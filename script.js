(function () {
  "use strict";

  var addressInput = document.getElementById("addressLine1");
  var autocomplete = document.getElementById("autocomplete");
  var expanded = document.getElementById("expanded");
  var addLine2Btn = document.getElementById("addLine2Btn");
  var line2Field = document.getElementById("line2Field");
  var postcode = document.getElementById("postcode");
  var city = document.getElementById("city");
  var county = document.getElementById("county");
  var countyCounter = document.getElementById("countyCounter");
  var cancelBtn = document.getElementById("cancelBtn");
  var closeBtn = document.getElementById("closeBtn");
  var nextBtn = document.getElementById("nextBtn");
  var modalBackdrop = document.getElementById("modalBackdrop");
  var form = document.getElementById("detailsForm");
  var useShopperDetails = document.getElementById("useShopperDetails");
  var docTypeValue = document.getElementById("docTypeValue");
  var docNumber = document.getElementById("docNumber");
  var docCountryValue = document.getElementById("docCountryValue");
  var docCountryFlag = document.getElementById("docCountryFlag");
  var manualEntry = false;

  function applyShopperDetails() {
    if (useShopperDetails.checked) {
      docTypeValue.textContent = "Passport";
      docNumber.value = "37112312441";
      docCountryValue.textContent = "United Kingdom";
      docCountryFlag.src = "uk-flag.svg";
    } else {
      docTypeValue.textContent = "Select from list";
      docNumber.value = "";
      docCountryValue.textContent = "Select from list";
      docCountryFlag.src = "flag-icon.svg";
    }
  }

  function openModal() {
    applyShopperDetails();
    modalBackdrop.hidden = false;
    document.documentElement.classList.add("modal-open");
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.documentElement.classList.remove("modal-open");
  }

  // Mock address suggestions keyed by the postcode/city they resolve to.
  var SUGGESTIONS = [
    { line1: "Downing Street 10", label: "Downing Street 10, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 12", label: "Downing Street 12, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 16", label: "Downing Street 16, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 20", label: "Downing Street 20, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" }
  ];

  function renderSuggestions(query) {
    autocomplete.innerHTML = "";
    var q = query.trim().toLowerCase();
    if (q.length < 2) {
      autocomplete.hidden = true;
      return;
    }
    var matches = SUGGESTIONS.filter(function (s) {
      return s.label.toLowerCase().indexOf(q) !== -1;
    });
    matches.forEach(function (match) {
      var li = document.createElement("li");
      li.textContent = match.label;
      li.setAttribute("role", "option");
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectAddress(match);
      });
      autocomplete.appendChild(li);
    });
    appendManualFooter();
    autocomplete.hidden = false;
  }

  // Persistent footer link to fall back to manual entry.
  function appendManualFooter() {
    var li = document.createElement("li");
    li.className = "autocomplete__footer";
    li.setAttribute("role", "option");
    li.textContent = "Can't find the address? Enter it manually";
    li.addEventListener("mousedown", function (e) {
      e.preventDefault();
      startManualEntry();
    });
    autocomplete.appendChild(li);
  }

  function selectAddress(match) {
    addressInput.value = match.line1;
    postcode.value = match.postcode;
    city.value = match.city;
    county.value = match.county;
    updateCounter();
    autocomplete.hidden = true;
    manualEntry = false;
    expanded.hidden = false;
  }

  // Reveal the structured form with empty, editable fields.
  function startManualEntry() {
    autocomplete.hidden = true;
    postcode.value = "";
    city.value = "";
    county.value = "";
    updateCounter();
    manualEntry = true;
    expanded.hidden = false;
    addressInput.focus();
  }

  function updateCounter() {
    countyCounter.textContent = county.value.length + "/16";
  }

  function collapseAddress() {
    expanded.hidden = true;
    manualEntry = false;
    postcode.value = "";
    city.value = "";
    county.value = "";
    line2Field.hidden = true;
    addLine2Btn.hidden = false;
    var line2 = document.getElementById("addressLine2");
    if (line2) {
      line2.value = "";
    }
    updateCounter();
  }

  addressInput.addEventListener("input", function () {
    if (addressInput.value.trim() === "") {
      collapseAddress();
    }
    // While manual entry is active, keep the form open instead of showing results.
    if (manualEntry) {
      autocomplete.hidden = true;
      return;
    }
    renderSuggestions(addressInput.value);
  });

  addressInput.addEventListener("focus", function () {
    if (addressInput.value.trim().length >= 2 && expanded.hidden) {
      renderSuggestions(addressInput.value);
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#addressField")) {
      autocomplete.hidden = true;
    }
  });

  addLine2Btn.addEventListener("click", function () {
    line2Field.hidden = false;
    addLine2Btn.hidden = true;
  });

  county.addEventListener("input", updateCounter);

  useShopperDetails.addEventListener("change", applyShopperDetails);

  cancelBtn.addEventListener("click", function () {
    form.reset();
    expanded.hidden = true;
    manualEntry = false;
    line2Field.hidden = true;
    addLine2Btn.hidden = false;
    updateCounter();
    closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  nextBtn.addEventListener("click", openModal);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    closeModal();
  });
})();
