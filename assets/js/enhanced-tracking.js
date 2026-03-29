// Enhanced tracking for your website
document.addEventListener('DOMContentLoaded', function() {
  // Track outbound links
  document.body.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Track outbound links
    if (href && (href.startsWith('http') || href.startsWith('www'))) {
      if (!link.href.includes(window.location.hostname)) {
        gtag('event', 'outbound_click', {
          'event_category': 'Outbound Link',
          'event_label': href,
          'transport_type': 'beacon',
          'event_callback': function() { document.location = href; }
        });
        event.preventDefault();
      }
    }
    
    // Track email clicks
    if (href && href.startsWith('mailto:')) {
      gtag('event', 'email_click', {
        'event_category': 'Contact',
        'event_label': href.replace('mailto:', '')
      });
    }
    
    // Track PDF downloads
    if (href && href.endsWith('.pdf')) {
      gtag('event', 'file_download', {
        'event_category': 'Downloads',
        'event_label': href.split('/').pop()
      });
    }
  });

  // Track scroll depth
  const scrollDepth = {
    elements: [25, 50, 75, 100],
    tracked: false,
    threshold: 0.8, // 80% of the page
    
    init: function() {
      window.addEventListener('scroll', this.trackScrollDepth.bind(this));
    },
    
    trackScrollDepth: function() {
      if (this.tracked) return;
      
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / pageHeight) * 100;
      
      this.elements.forEach(percentage => {
        if (scrollPercentage >= percentage && !this.tracked) {
          gtag('event', 'scroll', {
            'event_category': 'Scroll Depth',
            'event_label': `Scrolled ${percentage}%`,
            'value': percentage
          });
          
          if (percentage === 100) {
            this.tracked = true;
          }
        }
      });
    }
  };
  
  scrollDepth.init();
});
