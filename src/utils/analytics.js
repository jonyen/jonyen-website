// Google Analytics utility functions

export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

export const event = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackSkillsFilter = (filterValue) => {
  event('skills_filter', {
    event_category: 'portfolio_interaction',
    event_label: filterValue,
    value: 1,
  });
};

export const trackSectionEngagement = (sectionName, interactionType = 'click') => {
  event('section_interaction', {
    event_category: 'portfolio_engagement',
    event_label: sectionName,
    interaction_type: interactionType,
  });
};

export const trackCardInteraction = (cardTitle, interactionType = 'click') => {
  event('portfolio_card_interaction', {
    event_category: 'portfolio_engagement',
    event_label: cardTitle,
    interaction_type: interactionType,
  });
};