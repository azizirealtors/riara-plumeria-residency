// =========================================================================
// Configuration Settings
// =========================================================================

// 1. Google Sheets Integration (Google Apps Script Web App Endpoint)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxkHiJI_FSwDalr1-86TmSP2IYHLAg6lKVKQy2NV4AFC3pEozPxqLK4Pkc0ndZcMcG/exec";

// 2. GoHighLevel Integration (Inbound Webhook Workflow Trigger)
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/Ma8WXaRAYZxpsCtjYUiA/webhook-trigger/12a8b6bc-782...";

// =========================================================================
// Form Event Listeners
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Hero Quick Interest Form (Tier 1)
  const heroForm = document.getElementById("hero-lead-form");
  if (heroForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById("hero-submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Standardized Payload mapped for Google Sheets & GHL
      const payload = {
        name: document.getElementById("hero-name") ? document.getElementById("hero-name").value.trim() : "",
        phone: document.getElementById("hero-phone") ? document.getElementById("hero-phone").value.trim() : "",
        email: "", // Empty for Tier 1
        unit: document.getElementById("hero-unit") ? document.getElementById("hero-unit").value : "",
        buyingFor: "",
        budget: "",
        financing: "",
        timeline: "",
        viewingDay: "",
        leadPriority: "Hot (Hero Quick)",
        formTier: "Tier 1 - Quick Interest",
        source: "Riara Plumeria Landing Page"
      };

      submitLeadToDestinations(payload, submitBtn, "Reserve Your Address Today →");
    });
  }

  // 2. Full Qualification Form (Tier 2)
  const fullForm = document.getElementById("full-lead-form");
  if (fullForm) {
    fullForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById("full-submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Standardized Payload mapped for Google Sheets & GHL
      const payload = {
        name: document.getElementById("full-name") ? document.getElementById("full-name").value.trim() : "",
        phone: document.getElementById("full-phone") ? document.getElementById("full-phone").value.trim() : "",
        email: document.getElementById("full-email") ? document.getElementById("full-email").value.trim() : "",
        unit: document.getElementById("full-unit") ? document.getElementById("full-unit").value : "",
        buyingFor: document.getElementById("full-buying-for") ? document.getElementById("full-buying-for").value : "",
        budget: document.getElementById("full-budget") ? document.getElementById("full-budget").value : "",
        financing: document.getElementById("full-financing") ? document.getElementById("full-financing").value : "",
        timeline: document.getElementById("full-timeline") ? document.getElementById("full-timeline").value : "",
        viewingDay: document.getElementById("full-viewing-day") ? document.getElementById("full-viewing-day").value : "",
        leadPriority: "High (Full Qualification)",
        formTier: "Tier 2 - Full Booking",
        source: "Riara Plumeria Landing Page"
      };

      submitLeadToDestinations(payload, submitBtn, "Reserve Your Address Today");
    });
  }
});

// =========================================================================
// Dual-Dispatch Logic: Fires Data to Google Sheets and GHL Asynchronously
// =========================================================================

/**
 * Handles concurrent API requests to Google Sheets and GoHighLevel.
 */
function submitLeadToDestinations(data, buttonElement, originalButtonText) {
  
  const requests = [];

  // Request 1: Google Apps Script Web App
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "") {
    const googleSheetPromise = fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Handles Apps Script cross-origin
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    requests.push(googleSheetPromise);
  }

  // Request 2: GoHighLevel Inbound Webhook
  if (GHL_WEBHOOK_URL && GHL_WEBHOOK_URL !== "") {
    const ghlPromise = fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    requests.push(ghlPromise);
  }

  // Execute both requests concurrently
  Promise.allSettled(requests)
    .then(() => {
      alert("Thank you! Your details have been received. Our sales team at Azizi Realtors will contact you shortly.");
      buttonElement.disabled = false;
      buttonElement.textContent = originalButtonText;
      
      const activeForm = buttonElement.closest("form");
      if (activeForm) activeForm.reset();
    })
    .catch((error) => {
      console.error("Error submitting lead:", error);
      alert("There was an error saving your request. Please try again.");
      buttonElement.disabled = false;
      buttonElement.textContent = originalButtonText;
    });
}

// =========================================================================
// UI Utility Functions
// =========================================================================

/**
 * Pre-selects unit type and smooth scrolls to the booking section
 */
function preselectUnitAndScroll(unitType) {
  const fullUnitSelect = document.getElementById("full-unit");
  const heroUnitSelect = document.getElementById("hero-unit");
  
  if (fullUnitSelect) fullUnitSelect.value = unitType;
  if (heroUnitSelect) heroUnitSelect.value = unitType;

  const targetSection = document.getElementById("book-viewing");
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}
