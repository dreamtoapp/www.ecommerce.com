// Official Next.js Analytics Helper
// This file provides helper functions to work with @next/third-parties/google

console.log('Analytics helper loaded');

// Import the official sendGAEvent function (will be available when GoogleAnalytics component is loaded)
// This is just a helper file - the actual GoogleAnalytics component should be added to your layout

// Helper functions for e-commerce tracking using the official Next.js approach
const analyticsHelpers = {
  // Track product views
  trackProductView: (product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'SAR',
        value: parseFloat(product.price) || 0,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: parseFloat(product.price) || 0,
          quantity: 1
        }]
      });
    }
  },

  // Track add to cart events
  trackAddToCart: (product, quantity = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const value = (parseFloat(product.price) || 0) * quantity;
      window.gtag('event', 'add_to_cart', {
        currency: 'SAR',
        value: value,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: parseFloat(product.price) || 0,
          quantity: quantity
        }]
      });
    }
  },

  // Track purchase completion
  trackPurchase: (transaction) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transaction.id,
        value: parseFloat(transaction.total) || 0,
        currency: 'SAR',
        items: transaction.items.map(item => ({
          item_id: item.productId,
          item_name: item.name,
          item_category: item.category,
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1
        }))
      });
    }
  },

  // Track begin checkout
  trackBeginCheckout: (cart) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const value = cart.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
      window.gtag('event', 'begin_checkout', {
        currency: 'SAR',
        value: value,
        items: cart.items.map(item => ({
          item_id: item.productId,
          item_name: item.name,
          item_category: item.category,
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1
        }))
      });
    }
  },

  // Track search
  trackSearch: (searchTerm) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  }
};

// Export for use in components
export default analyticsHelpers; 