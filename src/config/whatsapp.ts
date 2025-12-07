// WhatsApp configuration
export const whatsappConfig = {
  // Replace with your actual WhatsApp number (include country code, no + sign)
  // Example: For Chad (+235), use "235XXXXXXXXX"
  phoneNumber: "23586892942",

  // Default messages for different contexts
  defaultMessage:
    "Hello! I'm interested in Tchad Tech Hub services. Could you help me?",

  // Specific messages for different sections (optional)
  messages: {
    general: "Hello! I have a question about Tchad Tech Hub.",
    ecommerce:
      "Hi! I'm interested in your e-commerce platform. Can you tell me more?",
    elearning: "Hello! I'd like to know more about your learning courses.",
    hubManagement: "Hi! I'm interested in co-working spaces. Can you help me?",
    techHub:
      "Hello! I'd like to join the tech community. How can I get started?",
    support: "Hi! I need help with the platform. Can you assist me?",
  },

  // Button appearance settings
  appearance: {
    position: "bottom-right" as const, // or "bottom-left"
    showTooltip: true,
    tooltipText: "💬 Chat with us on WhatsApp",
    tooltipSubtext: "We typically reply within minutes",
  },
};

export default whatsappConfig;
