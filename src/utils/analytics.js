// Event tracking helper for Google Analytics 4 / Google Tag Manager
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.log(`[Analytics Event Tracked]: ${eventName}`, eventParams);
  }
};

export const trackWhatsAppClick = (sourceLocation) => {
  trackEvent('whatsapp_click', {
    event_category: 'conversion',
    event_label: sourceLocation,
  });
};

export const trackPhoneClick = (sourceLocation) => {
  trackEvent('phone_click', {
    event_category: 'conversion',
    event_label: sourceLocation,
  });
};

export const trackQuoteClick = (serviceOrProject = 'General') => {
  trackEvent('quote_request_click', {
    event_category: 'lead',
    event_label: serviceOrProject,
  });
};
