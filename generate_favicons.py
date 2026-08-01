import os
import struct
import zlib

def make_png(width, height, get_pixel_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter type 0
        for x in range(width):
            r, g, b, a = get_pixel_func(x, y)
            raw_data.extend([r, g, b, a])
            
    def chunk(type_str, data):
        t = type_str.encode('ascii')
        crc = zlib.crc32(t + data)
        return struct.pack('>I', len(data)) + t + data + struct.pack('>I', crc)
        
    header = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), level=9)
    
    return b'\x89PNG\r\n\x1a\n' + chunk('IHDR', header) + chunk('IDAT', idat) + chunk('IEND', b'')

def render_logo_png(size, circle_bg=True):
    scale = size / 100.0
    ss = 4 # 4x supersampling
    w = size * ss
    h = size * ss
    
    bg_color = (0, 102, 255, 255) # #0066FF
    
    def inside_rounded_rect(x, y, rx, ry, rw, rh, r):
        if x < rx or x > rx + rw or y < ry or y > ry + rh:
            return False
        cx = rx + r if x < rx + r else (rx + rw - r if x > rx + rw - r else x)
        cy = ry + r if y < ry + r else (ry + rh - r if y > ry + rh - r else y)
        return (x - cx)**2 + (y - cy)**2 <= r**2

    def point_in_poly(x, y, poly):
        n = len(poly)
        inside = False
        p1x, p1y = poly[0]
        for i in range(n + 1):
            p2x, p2y = poly[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        return inside

    top_chevron = [(34,20), (50,36), (66,20), (66,32), (50,48), (34,32)]
    bottom_tri = [(34,53), (66,53), (50,69)]
    
    grid = bytearray(w * h)
    
    for y in range(h):
        gy = (y + 0.5) / (ss * scale)
        for x in range(w):
            gx = (x + 0.5) / (ss * scale)
            
            is_fg = False
            if inside_rounded_rect(gx, gy, 20, 20, 14, 60, 4):
                is_fg = True
            elif inside_rounded_rect(gx, gy, 66, 20, 14, 60, 4):
                is_fg = True
            elif point_in_poly(gx, gy, top_chevron):
                is_fg = True
            elif point_in_poly(gx, gy, bottom_tri):
                is_fg = True
                
            grid[y * w + x] = 1 if is_fg else 0

    def get_pixel(px, py):
        fg_count = 0
        circle_count = 0
        
        for dy in range(ss):
            sy = py * ss + dy
            gy = (sy + 0.5) / (ss * scale)
            for dx in range(ss):
                sx = px * ss + dx
                gx = (sx + 0.5) / (ss * scale)
                
                if grid[sy * w + sx]:
                    fg_count += 1
                
                if circle_bg and (gx - 50)**2 + (gy - 50)**2 <= 49**2:
                    circle_count += 1
                    
        total = ss * ss
        fg_ratio = fg_count / total
        circle_ratio = circle_count / total
        
        if fg_ratio > 0:
            r = int(bg_color[0] * (1 - fg_ratio) + 255 * fg_ratio)
            g = int(bg_color[1] * (1 - fg_ratio) + 255 * fg_ratio)
            b = int(bg_color[2] * (1 - fg_ratio) + 255 * fg_ratio)
            a = int(255 * circle_ratio) if circle_bg else int(255 * fg_ratio)
            return (r, g, b, a)
        elif circle_ratio > 0 and circle_bg:
            a = int(255 * circle_ratio)
            return (bg_color[0], bg_color[1], bg_color[2], a)
        else:
            return (0, 0, 0, 0)

    return make_png(size, size, get_pixel)

def make_ico(png_list):
    # png_list is list of (width, height, png_bytes)
    count = len(png_list)
    header = struct.pack('<HHH', 0, 1, count)
    
    entries = bytearray()
    offset = 6 + count * 16
    
    for w, h, data in png_list:
        b_w = 0 if w >= 256 else w
        b_h = 0 if h >= 256 else h
        size = len(data)
        entry = struct.pack('<BBBBHHII', b_w, b_h, 0, 0, 1, 32, size, offset)
        entries.extend(entry)
        offset += size
        
    ico_bytes = bytearray(header) + entries
    for _, _, data in png_list:
        ico_bytes.extend(data)
        
    return bytes(ico_bytes)

def generate_all():
    public_dir = '/Users/miantuahaafzal/Documents/M-Tech Solutions/public'
    
    # 1. SVG
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <!-- Circular Accent Background -->
  <circle cx="50" cy="50" r="49" fill="#0066FF" />
  
  <!-- Centered M-Tech White Logo -->
  <g fill="#FFFFFF">
    <!-- Left Pillar -->
    <rect x="20" y="20" width="14" height="60" rx="4" />
    
    <!-- Right Pillar -->
    <rect x="66" y="20" width="14" height="60" rx="4" />
    
    <!-- Top Downward Chevron -->
    <path d="M 34 20 L 50 36 L 66 20 L 66 32 L 50 48 L 34 32 Z" />
    
    <!-- Bottom Downward Triangle -->
    <path d="M 34 53 H 66 L 50 69 Z" />
  </g>
</svg>
'''
    with open(os.path.join(public_dir, 'favicon.svg'), 'w') as f:
        f.write(svg_content)
    print("Generated favicon.svg")

    # Sizes to generate
    sizes = {
        'favicon-48x48.png': 48,      # Google recommended size
        'favicon-32x32.png': 32,
        'favicon-192x192.png': 192,
        'favicon-512x512.png': 512,
        'apple-touch-icon.png': 180,
        'apple-touch-icon-precomposed.png': 180,
    }
    
    png_buffers = {}
    for filename, sz in sizes.items():
        if sz not in png_buffers:
            png_buffers[sz] = render_logo_png(sz, circle_bg=True)
        with open(os.path.join(public_dir, filename), 'wb') as f:
            f.write(png_buffers[sz])
        print(f"Generated {filename} ({sz}x{sz})")
        
    # ICO containing 48x48 and 32x32 PNG layers
    ico_data = make_ico([(48, 48, png_buffers[48]), (32, 32, png_buffers[32])])
    with open(os.path.join(public_dir, 'favicon.ico'), 'wb') as f:
        f.write(ico_data)
    print("Generated favicon.ico (multi-resolution)")

    # Clean up test file if exists
    test_path = os.path.join(public_dir, 'test_render.png')
    if os.path.exists(test_path):
        os.remove(test_path)
        print("Removed test_render.png")

if __name__ == '__main__':
    generate_all()
