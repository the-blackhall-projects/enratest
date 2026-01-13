(() => {
  // 2024 Enrate BER price list (homes up to 275 m²)
  const basePrices = {
    "Apartment": { "1": 210, "2": 220, "3": 235, "4": 245, "5": null },
    "Mid-Terrace House": { "1": 220, "2": 235, "3": 245, "4": 265, "5": 285 },
    "Semi-D or End of Terrace": { "1": 240, "2": 240, "3": 250, "4": 265, "5": 285 },
    "Detached House": { "1": 250, "2": 250, "3": 260, "4": 275, "5": 295 }
  };

  const ADD_EXTENSION = 10;     // per extension (heated)
  const ADD_SUNROOM = 10;       // per heated conservatory/sunroom
  const UPDATE_ON_FILE = 130;   // update a recent/valid BER on file
  const EXT_REBUILT = 350;      // extensively rebuilt house
  const POSTAGE = 10;            // postal delivery
  const LOCAL_DISCOUNT = 10;    // local area discount            // postal delivery

  const form = document.getElementById("pricingCalculator");
  const result = document.getElementById("calcResult");
  const btn = document.getElementById("calcBtn");
  if (!form || !result) return;

  const fmt = (n) => {
    const v = Math.round(n);
    const abs = Math.abs(v).toLocaleString("en-IE");
    return v < 0 ? `-€${abs}` : `€${abs}`;
  };

  const readInt = (name) => {
    const v = form.querySelector(`[name="${name}"]`)?.value;
    const n = Number.parseInt(String(v ?? "0"), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const readBool = (name) => !!form.querySelector(`[name="${name}"]`)?.checked;

  const compute = () => {
    const propertyType = form.querySelector('[name="property_type"]')?.value || "Apartment";
    const beds = form.querySelector('[name="beds"]')?.value || "3";
    const area = Number.parseFloat(String(form.querySelector('[name="area"]')?.value || ""));
    const extensions = readInt("extensions");
    const sunrooms = readInt("sunrooms");
    const isUpdate = readBool("update_existing");
    const isRebuilt = readBool("extensively_rebuilt");
    const postage = readBool("postage");
    const localDiscount = readBool("local_discount");

    // Mutually exclusive toggles: if both ticked, prioritise update-on-file (cheapest/specific)
    let total = 0;
    let breakdown = [];
    let warnings = [];

    if (Number.isFinite(area) && area > 275) {
      warnings.push("Home appears to be over 275 m². The published price list applies up to 275 m²; please request a quote.");
    }

    if (isUpdate) {
      total = UPDATE_ON_FILE + (postage ? POSTAGE : 0);
      breakdown.push({ label: "Update BER on file", amount: UPDATE_ON_FILE });
      if (postage) breakdown.push({ label: "Postal delivery", amount: POSTAGE });
    } else if (isRebuilt) {
      total = EXT_REBUILT + (postage ? POSTAGE : 0);
      breakdown.push({ label: "Extensively rebuilt house", amount: EXT_REBUILT });
      if (postage) breakdown.push({ label: "Postal delivery", amount: POSTAGE });
    } else {
      const base = basePrices?.[propertyType]?.[beds];
      if (typeof base !== "number") {
        result.innerHTML = `
          <div class="alert alert-warning mb-0">
            <div class="fw-semibold">Quote required</div>
            <div class="small">A ${beds}-bed ${propertyType} is not listed. Please request a quote.</div>
          </div>`;
        return;
      }

      total = base;
      breakdown.push({ label: `Base price (${propertyType}, ${beds} bed)`, amount: base });

      const extras = (extensions * ADD_EXTENSION) + (sunrooms * ADD_SUNROOM);
      if (extensions > 0) breakdown.push({ label: `Extensions (heated) × ${extensions}`, amount: extensions * ADD_EXTENSION });
      if (sunrooms > 0) breakdown.push({ label: `Heated conservatory/sunroom × ${sunrooms}`, amount: sunrooms * ADD_SUNROOM });

      if (postage) breakdown.push({ label: "Postal delivery", amount: POSTAGE });

      total += extras + (postage ? POSTAGE : 0);
    }

        if (localDiscount) {
      breakdown.push({ label: "Enrate Local Area discount", amount: -LOCAL_DISCOUNT });
      total -= LOCAL_DISCOUNT;
    }

    const rows = breakdown.map((b) => `
      <tr>
        <td class="text-muted">${b.label}</td>
        <td class="text-end fw-semibold">${fmt(b.amount)}</td>
      </tr>`).join("");

    const warningHtml = warnings.length
      ? `<div class="alert alert-warning mt-3 mb-0"><div class="small">${warnings.join("<br/>")}</div></div>`
      : "";

    result.innerHTML = `
      <div class="alert alert-success mb-0">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div class="fw-semibold">Estimated fully inclusive fee</div>
            <div class="small text-muted">Price already includes the SEAI registration filing fee of €30, and we do not add VAT.</div>
          </div>
          <div class="display-6 mb-0">${fmt(total)}</div>
        </div>

        <div class="table-responsive mt-3">
          <table class="table table-sm mb-0">
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${warningHtml}
      </div>`;
  };

  // UX: keep mutually exclusive checkboxes in sync
  const syncExclusive = () => {
    const u = form.querySelector('[name="update_existing"]');
    const r = form.querySelector('[name="extensively_rebuilt"]');
    if (!u || !r) return;
    if (u.checked) r.checked = false;
    if (r.checked) u.checked = false;
  };

  form.addEventListener("change", () => {
    syncExclusive();
  });

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      syncExclusive();
      compute();
    });
  }

  // Provide an initial estimate
  compute();
})();