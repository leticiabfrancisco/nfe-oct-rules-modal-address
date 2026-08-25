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
  var form = document.getElementById("detailsForm");

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
    if (!matches.length) {
      autocomplete.hidden = true;
      return;
    }
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
    autocomplete.hidden = false;
  }

  function selectAddress(match) {
    addressInput.value = match.line1;
    postcode.value = match.postcode;
    city.value = match.city;
    county.value = match.county;
    updateCounter();
    autocomplete.hidden = true;
    expanded.hidden = false;
  }

  function updateCounter() {
    countyCounter.textContent = county.value.length + "/16";
  }

  addressInput.addEventListener("input", function () {
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

  cancelBtn.addEventListener("click", function () {
    form.reset();
    expanded.hidden = true;
    line2Field.hidden = true;
    addLine2Btn.hidden = false;
    updateCounter();
  });

  closeBtn.addEventListener("click", function () {
    document.querySelector(".backdrop").style.display = "none";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Details saved.");
  });
})();
