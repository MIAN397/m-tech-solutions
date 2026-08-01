# Technical Architecture Blueprint: Mobile Parts ERP SaaS Platform

**Author:** M-Tech Solutions Principal Architect  
**Version:** 1.0.0  
**Target Stack:** MongoDB, Express.js, React.js, Node.js (MERN) + IndexedDB & Service Workers  

---

## 1. Database Optimization & Mongoose Schemas

This section details the strict Mongoose schemas designed for the platform, incorporating compound indexes to guarantee sub-millisecond query execution on heavily queried fields (`sku`, `invoiceNumber`, `imei`, `serialNumber`, and `date`).

### 1.1 Inventory Item Schema (`models/Product.js`)
Stores parts, compatibility metrics, and branch-specific matrices.

```javascript
import mongoose from 'mongoose';

const BranchStockSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Branch' },
  quantity: { type: Number, required: true, default: 0, min: 0 }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: String, required: true, index: true },
  compatibility: [{ type: String, index: true }], // e.g., ["iPhone 13", "iPhone 13 Pro"]
  costPrice: { type: Number, required: true, min: 0 },
  retailPrice: { type: Number, required: true, min: 0 },
  wholesalePrice: { type: Number, required: true, min: 0 },
  branchStocks: [BranchStockSchema],
  lowStockThreshold: { type: Number, default: 5 },
  primaryVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  lastRestocked: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for sku-based lookups and restock tracking
ProductSchema.index({ sku: 1, lastRestocked: -1 });
// Compound index for category inventory pricing evaluations
ProductSchema.index({ category: 1, retailPrice: 1 });

export default mongoose.model('Product', ProductSchema);
```

### 1.2 Traceable Serial/IMEI Unit Schema (`models/ItemUnit.js`)
Tracks the exact lifecycle of high-value components (e.g., replacement screens, complete assemblies) via unique IMEI or Serial Keys.

```javascript
import mongoose from 'mongoose';

const ItemUnitSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  imei: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
  serialNumber: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  status: { 
    type: String, 
    enum: ['IN_STOCK', 'TRANSFERRED', 'SOLD', 'RETURNED_TO_VENDOR', 'DEFECTIVE'], 
    default: 'IN_STOCK',
    index: true
  },
  purchaseInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseInvoice' },
  salesInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesInvoice', default: null },
  history: [{
    timestamp: { type: Date, default: Date.now },
    action: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: String
  }]
}, { timestamps: true });

// Compound indexes for tracing individual high-value items instantly
ItemUnitSchema.index({ imei: 1, status: 1 });
ItemUnitSchema.index({ serialNumber: 1, status: 1 });

export default mongoose.model('ItemUnit', ItemUnitSchema);
```

### 1.3 Dual-Invoice Schema (`models/SalesInvoice.js`)
Handles both wholesale and retail transactions with credit ledger links.

```javascript
import mongoose from 'mongoose';

const InvoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, required: true, min: 0 }, // Frozen cost at transaction time for exact profit aggregation
  discountAmount: { type: Number, default: 0 }, // Flat discount on item
  imeiOrSerials: [{ type: String }] // Tracks which specific IMEI units were checked out
});

const SalesInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, uppercase: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  invoiceType: { type: String, enum: ['RETAIL', 'WHOLESALE'], required: true, index: true },
  items: [InvoiceItemSchema],
  subTotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  amountPaid: { type: Number, required: true, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['PAID', 'PARTIAL', 'UNPAID'], 
    default: 'UNPAID', 
    index: true 
  },
  date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Compound index for invoice searches and ledger balances
SalesInvoiceSchema.index({ invoiceNumber: 1, date: -1 });
SalesInvoiceSchema.index({ customer: 1, paymentStatus: 1 });

export default mongoose.model('SalesInvoice', SalesInvoiceSchema);
```

---

## 2. Dashboard Aggregation Workflows

To calculate metrics (Net Profit, Wholesale Profit, Retail Profit, and Monthly Sales Trends) directly on the MongoDB cluster without pulling huge datasets into server memory, we implement the following aggregation pipeline.

```javascript
import SalesInvoice from './models/SalesInvoice.js';

export async function getDashboardMetrics(branchId, startDate, endDate) {
  const matchStage = {
    $match: {
      branchId: new mongoose.Types.ObjectId(branchId),
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }
  };

  const metrics = await SalesInvoice.aggregate([
    matchStage,
    {
      $facet: {
        // Facet A: Financial Totals and Profits
        financials: [
          { $unwind: '$items' },
          {
            $project: {
              invoiceType: 1,
              itemRevenue: { $multiply: ['$items.quantity', '$items.unitPrice'] },
              itemCost: { $multiply: ['$items.quantity', '$items.costPrice'] },
              itemDiscount: { $ifNull: ['$items.discountAmount', 0] }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$itemRevenue' },
              totalCost: { $sum: '$itemCost' },
              totalDiscount: { $sum: '$itemDiscount' },
              // Conditional sums for Retail and Wholesale
              retailRevenue: {
                $sum: { $cond: [{ $eq: ['$invoiceType', 'RETAIL'] }, '$itemRevenue', 0] }
              },
              retailCost: {
                $sum: { $cond: [{ $eq: ['$invoiceType', 'RETAIL'] }, '$itemCost', 0] }
              },
              wholesaleRevenue: {
                $sum: { $cond: [{ $eq: ['$invoiceType', 'WHOLESALE'] }, '$itemRevenue', 0] }
              },
              wholesaleCost: {
                $sum: { $cond: [{ $eq: ['$invoiceType', 'WHOLESALE'] }, '$itemCost', 0] }
              }
            }
          },
          {
            $project: {
              _id: 0,
              netRevenue: { $subtract: ['$totalRevenue', '$totalDiscount'] },
              netCost: '$totalCost',
              netProfit: { $subtract: [{ $subtract: ['$totalRevenue', '$totalDiscount'] }, '$totalCost'] },
              retailProfit: { $subtract: ['$retailRevenue', '$retailCost'] },
              wholesaleProfit: { $subtract: ['$wholesaleRevenue', '$wholesaleCost'] }
            }
          }
        ],
        // Facet B: Chronological Sales Trends
        monthlyTrends: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
              salesCount: { $sum: 1 },
              revenue: { $sum: '$grandTotal' }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]);

  return {
    financials: metrics[0].financials[0] || {
      netRevenue: 0,
      netCost: 0,
      netProfit: 0,
      retailProfit: 0,
      wholesaleProfit: 0
    },
    monthlyTrends: metrics[0].monthlyTrends
  };
}
```

---

## 3. Offline-First POS Subsystem (Service Worker + IndexedDB)

This section maps the offline transaction engine, enabling sales operations during network dropouts with automated batch background synchronization.

### 3.1 IndexedDB Local Schema (Client Database)
We use `idb` or vanilla IndexedDB to set up a local database named `mtech_erp_local` with stores:
- `products`: Caches stock prices and compatibility data for offline search.
- `offline_invoices`: Stores queued invoices.

### 3.2 Service Worker Sync Listener (`public/sw-sync.js`)
Service worker listens for a background sync event (`sync-invoices`) triggered by the browser when connectivity is restored.

```javascript
import { openDB } from 'idb';

const DB_NAME = 'mtech_erp_local';

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncOfflineInvoices());
  }
});

async function syncOfflineInvoices() {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction('offline_invoices', 'readonly');
  const store = tx.objectStore('offline_invoices');
  const invoices = await store.getAll();

  if (invoices.length === 0) return;

  for (const invoice of invoices) {
    try {
      const response = await fetch('/api/v1/sales/invoice/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });

      if (response.ok) {
        // Remove successfully synced item from IndexedDB
        const deleteTx = db.transaction('offline_invoices', 'readwrite');
        await deleteTx.objectStore('offline_invoices').delete(invoice.localId);
        await deleteTx.done;
      }
    } catch (err) {
      console.error('Failed to sync invoice: ' + invoice.localId, err);
      // Wait for next sync attempt
    }
  }
}
```

### 3.3 Offline Detection & Trigger in React
```javascript
export async function saveInvoice(invoiceData) {
  if (navigator.onLine) {
    // Send directly to API
    return await api.post('/sales/invoice', invoiceData);
  } else {
    // Queue locally in IndexedDB
    const db = await openDB('mtech_erp_local', 1);
    const localId = 'offline_' + Date.now();
    await db.put('offline_invoices', {
      ...invoiceData,
      localId,
      offline: true,
      createdAt: new Date()
    });

    // Register Background Sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-invoices');
    }
    
    return { success: true, queued: true, localId };
  }
}
```

---

## 4. Multi-Branch Inventory & Audit Trails

### 4.1 Intra-Branch Transfer Log (`models/InventoryTransfer.js`)
Enables movement between branch locations without skewing profit metrics by preventing false sales registrations.

```javascript
import mongoose from 'mongoose';

const TransferItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  imeis: [{ type: String }]
});

const InventoryTransferSchema = new mongoose.Schema({
  senderBranchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  receiverBranchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  items: [TransferItemSchema],
  status: { type: String, enum: ['PENDING', 'SHIPPED', 'RECEIVED', 'REJECTED'], default: 'PENDING' },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('InventoryTransfer', InventoryTransferSchema);
```

### 4.2 Immutable Global Audit Log Schema (`models/AuditLog.js`)
Tracks granular user activity on invoices or stock adjustments.

```javascript
import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actionType: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE', 'STOCK_ADJUST'], required: true },
  entityName: { type: String, required: true }, // e.g. "SalesInvoice", "Product"
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  previousValues: { type: mongoose.Schema.Types.Mixed },
  newValues: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String
}, { capped: true, size: 52428800, max: 100000 }); // Capped at 50MB for immutability and automatic oldest log recycling

export default mongoose.model('AuditLog', AuditLogSchema);
```
