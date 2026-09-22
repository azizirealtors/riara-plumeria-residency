// Updated Google Apps Script Web App URL for Riara Plumeria Lead Capture
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxkHiJI_FSwDalr1-86TmSP2IYHLAg6lKVKQy2NV4AFC3pEozPxqLK4Pkc0ndZcMcG/exec";

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Hero Quick Interest Form (Tier 1)
  const heroForm = document.getElementById("hero-lead-form");
  if (heroForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById("hero-submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Payload aligned with Sheet Columns A-L
      const payload = {
        name: document.getElementById("hero-name") ? document.getElementById("hero-name").value : "",
        phone: document.getElementById("hero-phone") ? document.getElementById("hero-phone").value : "",
        email: "", // Empty for Hero Form
        unit: document.getElementById("hero-unit") ? document.getElementById("hero-unit").value : "",
        buyingFor: "",
        budget: "",
        financing: "",
        timeline: "",
        viewingDay: "",
        leadPriority: "Hot (Hero Quick)",
        formTier: "Tier 1 - Quick Interest"
      };

      sendToGoogleSheet(payload, submitBtn, "Reserve Your Address Today →");
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

      // Payload aligned with Sheet Columns A-L
      const payload = {
        name: document.getElementById("full-name") ? document.getElementById("full-name").value : "",
        phone: document.getElementById("full-phone") ? document.getElementById("full-phone").value : "",
        email: document.getElementById("full-email") ? document.getElementById("full-email").value : "",
        unit: document.getElementById("full-unit") ? document.getElementById("full-unit").value : "",
        buyingFor: document.getElementById("full-buying-for") ? document.getElementById("full-buying-for").value : "",
        budget: document.getElementById("full-budget") ? document.getElementById("full-budget").value : "",
        financing: document.getElementById("full-financing") ? document.getElementById("full-financing").value : "",
        timeline: document.getElementById("full-timeline") ? document.getElementById("full-timeline").value : "",
        viewingDay: document.getElementById("full-viewing-day") ? document.getElementById("full-viewing-day").value : "",
        leadPriority: "High (Full Qualification)",
        formTier: "Tier 2 - Full Booking"
      };

      sendToGoogleSheet(payload, submitBtn, "Reserve Your Address Today");
    });
  }
});

/**
 * Sends form payload to Google Sheet via POST
 */
function sendToGoogleSheet(data, buttonElement, originalButtonText) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
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

/**
 * Pre-selects unit type and smooth scrolls to booking form
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