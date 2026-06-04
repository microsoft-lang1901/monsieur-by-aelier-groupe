(function () {
  const API = "/api";
  let loginAttempted = false;

  function request(method, path, body) {
    return fetch(API + path, {
      method,
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    }).then(res => res.json()).then(payload => {
      if (payload && payload.error === "Authentication is required." && ensureAuth()) {
        return request(method, path, body);
      }
      return payload;
    });
  }

  function requestSync(method, path, body) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, API + path, false);
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(body ? JSON.stringify(body) : null);
      const response = JSON.parse(xhr.responseText || "{}");
      if (response.error === "Authentication is required." && ensureAuth()) {
        return requestSync(method, path, body);
      }
      return response;
    } catch {
      return { ok: false };
    }
  }

  function ensureAuth() {
    if (loginAttempted) return false;
    loginAttempted = true;
    const accessCode = window.prompt ? window.prompt("Private client access code") : "";
    if (!accessCode) return false;
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", API + "/auth/login", false);
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(JSON.stringify({ accessCode }));
      const response = JSON.parse(xhr.responseText || "{}");
      loginAttempted = false;
      return Boolean(response.ok);
    } catch {
      return false;
    }
  }

  function refreshWard(n) {
    const badge = document.getElementById("m-ward-badge");
    if (badge) {
      badge.textContent = n;
      if (n) badge.removeAttribute("hidden");
      else badge.setAttribute("hidden", "");
    }
  }

  function itemFromProduct(item) {
    return {
      id: item.id,
      name: item.name,
      sku: item.sku || "",
      house: item.house || "",
      tone: item.tone || "",
      material: item.material || "",
      price: Number(item.price || 0),
      board: item.board || "",
      editorial: Array.isArray(item.editorial) ? item.editorial : []
    };
  }

  function getWardrobe() {
    const response = requestSync("GET", "/wardrobe");
    if (response.ok && Array.isArray(response.wardrobe)) {
      localStorage.setItem("m-wardrobe", JSON.stringify(response.wardrobe));
      return response.wardrobe;
    }
    return JSON.parse(localStorage.getItem("m-wardrobe") || "[]");
  }

  window.Backend = {
    request,
    getWardrobe,
    addWardrobe(item) {
      const response = requestSync("POST", "/wardrobe", { item: itemFromProduct(item) });
      if (response.ok) localStorage.setItem("m-wardrobe", JSON.stringify(response.wardrobe || []));
      return response;
    },
    removeWardrobe(id) {
      const response = requestSync("DELETE", "/wardrobe/" + encodeURIComponent(id));
      if (response.ok) localStorage.setItem("m-wardrobe", JSON.stringify(response.wardrobe || []));
      return response;
    },
    createOrder(payload) {
      return request("POST", "/orders", payload);
    },
    createPaymentIntent(payload) {
      return request("POST", "/payment-intents", payload);
    },
    login(payload) {
      return request("POST", "/auth/login", payload || {});
    },
    session() {
      return request("GET", "/session");
    },
    createCommission(payload) {
      return request("POST", "/mtm-commissions", payload);
    },
    createFittingRequest(payload) {
      return request("POST", "/fitting-requests", payload || {});
    },
    createContactRequest(payload) {
      return request("POST", "/contact-requests", payload);
    }
  };

  if (window.MN) {
    window.MN.getWard = getWardrobe;
    window.MN.inWard = function (id) {
      return getWardrobe().some(item => item.id === id);
    };
    window.MN.addWard = function (item) {
      const response = window.Backend.addWardrobe(item);
      const list = getWardrobe();
      refreshWard(list.length);
      if (response.alreadySaved && window.toast) window.toast(item.name + " is already in your wardrobe");
      else if (window.toast) window.toast("Added " + item.name + " to your wardrobe");
      return response.ok && !response.alreadySaved;
    };
    window.MN.removeWard = function (id) {
      const response = window.Backend.removeWardrobe(id);
      const list = getWardrobe();
      refreshWard(list.length);
      return response.ok ? list : [];
    };
    refreshWard(getWardrobe().length);
  }

  document.addEventListener("click", event => {
    const pay = event.target.closest("#pay, [data-pay]");
    if (pay && !pay.dataset.backendRecorded) {
      pay.dataset.backendRecorded = "1";
      const selectedPayment = document.querySelector("[data-pm].on");
      const fields = document.querySelectorAll(".co .field input");
      let items = getWardrobe();
      if (!items.length && window.GARMENTS && window.GARMENTS[0]) items = [itemFromProduct(window.GARMENTS[0])];
      const amount = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
      window.Backend.createPaymentIntent({
        amount,
        currency: "usd",
        paymentMethod: selectedPayment ? selectedPayment.dataset.pm : "apple"
      }).then(payment => window.Backend.createOrder({
        paymentMethod: selectedPayment ? selectedPayment.dataset.pm : "apple",
        paymentIntentId: payment.paymentIntent ? payment.paymentIntent.id : undefined,
        shipping: {
          name: fields[4] ? fields[4].value : "Alexandre Moreau",
          address: fields[5] ? fields[5].value : "",
          city: fields[6] ? fields[6].value : "",
          postalCode: fields[7] ? fields[7].value : ""
        },
        items
      }));
    }

    const schedule = event.target.closest("#schedule");
    if (schedule) {
      window.Backend.createFittingRequest({ note: "Made to Measure fitting requested." });
    }

    const confirm = event.target.closest("#confirm");
    if (confirm) {
      window.Backend.createCommission({
        style: "Double-Breasted",
        fabric: "Silk Cashmere",
        details: ["Peak Lapel", "Side Vents", "Pleated"]
      });
    }
  }, true);

  document.addEventListener("submit", event => {
    const form = event.target.closest(".cform");
    if (!form) return;
    const fields = form.querySelectorAll("input, textarea");
    window.Backend.createContactRequest({
      name: fields[0] ? fields[0].value : "",
      email: fields[1] ? fields[1].value : "",
      message: fields[2] ? fields[2].value : ""
    });
  }, true);
})();
