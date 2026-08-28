(function () {
  "use strict";

  var addr = document.getElementById("addr");
  var suggest = document.getElementById("suggest");
  var manualRow = document.getElementById("manualRow");
  var searchMode = document.getElementById("searchMode");
  var manualMode = document.getElementById("manualMode");
  var keyboard = document.getElementById("keyboard");
  var backToSearch = document.getElementById("backToSearch");
  var saveManual = document.getElementById("saveManual");
  var shiftOn = false;

  var mLine1 = document.getElementById("mLine1");
  var mPostcode = document.getElementById("mPostcode");
  var mCity = document.getElementById("mCity");
  var mCounty = document.getElementById("mCounty");

  var SUGGESTIONS = [
    { line1: "Downing Street 10", label: "Downing Street 10, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 12", label: "Downing Street 12, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 16", label: "Downing Street 16, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" },
    { line1: "Downing Street 20", label: "Downing Street 20, SW1A 2AA, Westminster", postcode: "SW1A 2AA", city: "London", county: "Westminster" }
  ];

  function render() {
    suggest.innerHTML = "";
    var q = addr.value.trim().toLowerCase();
    if (q.length < 2) return;

    var matches = SUGGESTIONS.filter(function (s) {
      return s.label.toLowerCase().indexOf(q) !== -1;
    });

    if (!matches.length) {
      renderEmpty(addr.value.trim());
      return;
    }

    matches.forEach(function (m) {
      var li = document.createElement("li");
      li.textContent = m.label;
      li.addEventListener("click", function () { selectAddress(m); });
      suggest.appendChild(li);
    });
  }

  // No-results empty state with a manual-entry escape hatch.
  function renderEmpty(query) {
    var li = document.createElement("li");
    li.className = "msuggest__empty";

    var p = document.createElement("p");
    p.textContent = 'No matches for "' + query + '". Check the spelling, or';

    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "enter your address manually";
    btn.addEventListener("click", startManual);

    li.appendChild(p);
    li.appendChild(btn);
    suggest.appendChild(li);
  }

  function selectAddress(m) {
    // In a real flow this returns to the card form; here we just prefill manual.
    mLine1.value = m.line1;
    mPostcode.value = m.postcode;
    mCity.value = m.city;
    mCounty.value = m.county;
    showManual();
  }

  function startManual() {
    mLine1.value = addr.value.trim();
    mPostcode.value = "";
    mCity.value = "";
    mCounty.value = "";
    showManual();
  }

  function showManual() {
    searchMode.hidden = true;
    manualMode.hidden = false;
    keyboard.hidden = true;
  }

  function showSearch() {
    manualMode.hidden = true;
    searchMode.hidden = false;
    keyboard.hidden = false;
    addr.focus();
  }

  addr.addEventListener("input", render);
  manualRow.addEventListener("click", startManual);
  backToSearch.addEventListener("click", showSearch);
  saveManual.addEventListener("click", showSearch);

  // Build decorative-but-functional keyboard letters.
  document.querySelectorAll("[data-keys]").forEach(function (row) {
    row.getAttribute("data-keys").split(" ").forEach(function (ch) {
      var key = document.createElement("button");
      key.className = "key";
      key.type = "button";
      key.textContent = ch;
      key.setAttribute("data-char", ch);
      row.appendChild(key);
    });
  });

  keyboard.addEventListener("click", function (e) {
    var key = e.target.closest(".key");
    if (!key) return;
    var action = key.getAttribute("data-action");

    if (key.hasAttribute("data-char")) {
      insert(shiftOn ? key.getAttribute("data-char").toUpperCase() : key.getAttribute("data-char"));
      if (shiftOn) toggleShift(false);
      return;
    }
    if (action === "space") insert(" ");
    else if (action === "back") backspace();
    else if (action === "shift") toggleShift(!shiftOn);
  });

  function insert(ch) {
    addr.value += ch;
    render();
  }

  function backspace() {
    addr.value = addr.value.slice(0, -1);
    render();
  }

  function toggleShift(on) {
    shiftOn = on;
    document.querySelector(".key--shift").classList.toggle("active", on);
  }
})();
