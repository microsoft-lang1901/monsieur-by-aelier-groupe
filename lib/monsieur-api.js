const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DB_FILE = path.join(ROOT, "data", "db.json");
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SESSION_SECRET = process.env.MONSIEUR_SESSION_SECRET || "";
const CLIENT_ACCESS_CODE = process.env.MONSIEUR_CLIENT_ACCESS_CODE || "";
const IS_VERCEL = Boolean(process.env.VERCEL);

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const PUBLIC_GET_ROUTES = new Set([
  "/api/health",
  "/api/products",
  "/api/materials",
  "/api/passport"
]);
const PUBLIC_POST_ROUTES = new Set(["/api/auth/login"]);

function isProductionRuntime() {
  return IS_VERCEL || process.env.NODE_ENV === "production";
}

function loadDb() {
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return {
      wardrobe: db.wardrobe || [],
      orders: db.orders || [],
      mtmCommissions: db.mtmCommissions || [],
      fittingRequests: db.fittingRequests || [],
      contactRequests: db.contactRequests || [],
      events: db.events || []
    };
  } catch {
    return { wardrobe: [], orders: [], mtmCommissions: [], fittingRequests: [], contactRequests: [], events: [] };
  }
}

function saveDb(db) {
  if (isProductionRuntime()) {
    throw new Error("Persistent storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function hasSupabase() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && typeof fetch === "function");
}

function requireSupabaseInProduction() {
  if (isProductionRuntime() && !hasSupabase()) {
    throw new Error("Supabase is required in production. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

async function supabaseRequest(table, options = {}) {
  const query = options.query || "";
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: options.method || "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: options.prefer || "return=representation"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${table} ${response.status}: ${text}`);
  }
  if (response.status === 204) return [];
  return response.json();
}

async function readStore(db, table, localKey) {
  requireSupabaseInProduction();
  if (!hasSupabase()) return db[localKey] || [];
  return supabaseRequest(table, { query: "?select=*&order=created_at.desc" });
}

async function insertStore(db, table, localKey, record) {
  requireSupabaseInProduction();
  if (!hasSupabase()) {
    db[localKey].unshift(record);
    return record;
  }
  const rows = await supabaseRequest(table, { method: "POST", body: record });
  return rows[0] || record;
}

async function deleteStore(db, table, localKey, column, value) {
  requireSupabaseInProduction();
  if (!hasSupabase()) {
    const before = db[localKey].length;
    db[localKey] = db[localKey].filter(item => item[column] !== value);
    return before !== db[localKey].length;
  }
  await supabaseRequest(table, {
    method: "DELETE",
    query: `?${column}=eq.${encodeURIComponent(value)}`,
    prefer: "return=minimal"
  });
  return true;
}

function loadDesignData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(PUBLIC_DIR, "monsieur-data.js"), "utf8"), context);
  return {
    garments: context.window.GARMENTS || [],
    materials: context.window.MATERIALS || [],
    dossier: context.window.DOSSIER || {},
    mtm: context.window.MTM || {},
    passport: context.window.PASSPORT || {}
  };
}

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(body);
}

function sendError(res, status, message) {
  send(res, status, { ok: false, error: message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return new Date().toISOString();
}

function privateClient(design) {
  return {
    id: "client_alexandre_moreau",
    name: design.dossier.name || "Mr. Alexandre Moreau",
    email: "alexandre.moreau@example.com",
    tier: design.dossier.tier || "Private Client",
    since: design.dossier.since || "2021",
    authenticated: true
  };
}

function toSnake(record) {
  const mapped = {};
  for (const [key, value] of Object.entries(record)) {
    const snake = key.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
    mapped[snake] = value;
  }
  return mapped;
}

function fromSnake(record) {
  const mapped = {};
  for (const [key, value] of Object.entries(record)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    mapped[camel] = value;
  }
  return mapped;
}

function signSession(clientId) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${clientId}.${issuedAt}`;
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifySession(token) {
  if (!SESSION_SECRET || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [clientId, issuedAt, signature] = parts;
  const payload = `${clientId}.${issuedAt}`;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  const ageSeconds = Math.floor(Date.now() / 1000) - Number(issuedAt);
  return clientId === "client_alexandre_moreau" && Number.isFinite(ageSeconds) && ageSeconds < 60 * 60 * 24 * 7;
}

function getCookie(req, name) {
  const header = req.headers.cookie || "";
  const cookies = header.split(";").map(part => part.trim()).filter(Boolean);
  for (const cookie of cookies) {
    const eq = cookie.indexOf("=");
    if (eq === -1) continue;
    if (cookie.slice(0, eq) === name) return decodeURIComponent(cookie.slice(eq + 1));
  }
  return "";
}

function sessionCookie(value, maxAge) {
  const secure = isProductionRuntime() ? "; Secure" : "";
  return `monsieur_session=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function isPublicRoute(method, pathname) {
  if (method === "GET" && PUBLIC_GET_ROUTES.has(pathname)) return true;
  if (method === "POST" && PUBLIC_POST_ROUTES.has(pathname)) return true;
  return false;
}

function requireAuthenticated(req, res, method, pathname) {
  if (isPublicRoute(method, pathname)) return true;
  if (verifySession(getCookie(req, "monsieur_session"))) return true;
  sendError(res, 401, "Authentication is required.");
  return false;
}

async function recordEvent(db, type, payload) {
  const entry = { id: id("evt"), type, payload, createdAt: now(), created_at: now() };
  if (!hasSupabase()) {
    db.events.unshift(entry);
    db.events = db.events.slice(0, 100);
    return entry;
  }
  await supabaseRequest("events", { method: "POST", body: toSnake(entry) });
  return entry;
}

function productFromPayload(item) {
  if (!item || !item.id || !item.name) return null;
  const editorial = Array.isArray(item.editorial)
    ? item.editorial
      .filter(entry => entry && entry.src)
      .map(entry => ({
        label: String(entry.label || "Product image"),
        src: String(entry.src)
      }))
    : [];
  return {
    id: String(item.id),
    name: String(item.name),
    sku: String(item.sku || ""),
    house: String(item.house || ""),
    tone: String(item.tone || ""),
    material: String(item.material || ""),
    price: Number(item.price || 0),
    board: String(item.board || ""),
    editorial
  };
}

async function handleApi(req, res, url) {
  const db = loadDb();
  const design = loadDesignData();
  const pathname = url.pathname;

  if (!requireAuthenticated(req, res, req.method, pathname)) return;

  if (req.method === "GET" && pathname === "/api/health") {
    return send(res, 200, {
      ok: true,
      service: "monsieur-backend",
      storage: hasSupabase() ? "supabase" : "local-json",
      productionReady: !isProductionRuntime() || hasSupabase(),
      time: now()
    });
  }
  if (req.method === "GET" && pathname === "/api/products") return send(res, 200, { ok: true, products: design.garments });
  if (req.method === "GET" && pathname === "/api/materials") return send(res, 200, { ok: true, materials: design.materials });
  if (req.method === "GET" && pathname === "/api/passport") return send(res, 200, { ok: true, passport: design.passport });
  if (req.method === "GET" && pathname === "/api/dossier") return send(res, 200, { ok: true, dossier: design.dossier });
  if (req.method === "GET" && pathname === "/api/session") return send(res, 200, { ok: true, client: privateClient(design) });
  if (req.method === "GET" && pathname === "/api/events") return send(res, 200, { ok: true, events: (await readStore(db, "events", "events")).map(fromSnake) });
  if (req.method === "GET" && pathname === "/api/orders") return send(res, 200, { ok: true, orders: (await readStore(db, "orders", "orders")).map(fromSnake) });
  if (req.method === "GET" && pathname === "/api/mtm-commissions") return send(res, 200, { ok: true, commissions: (await readStore(db, "mtm_commissions", "mtmCommissions")).map(fromSnake) });
  if (req.method === "GET" && pathname === "/api/wardrobe") return send(res, 200, { ok: true, wardrobe: (await readStore(db, "wardrobe", "wardrobe")).map(fromSnake) });

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const body = await readBody(req);
    if (!SESSION_SECRET || !CLIENT_ACCESS_CODE) {
      return sendError(res, 503, "Private client access is not configured.");
    }
    if (String(body.accessCode || "") !== CLIENT_ACCESS_CODE) {
      return sendError(res, 401, "Invalid access code.");
    }
    const client = privateClient(design);
    const session = { id: signSession(client.id), clientId: client.id, email: body.email || client.email, createdAt: now() };
    res.setHeader("set-cookie", sessionCookie(session.id, 60 * 60 * 24 * 7));
    await recordEvent(db, "auth.login", { clientId: client.id });
    if (!hasSupabase()) saveDb(db);
    return send(res, 200, { ok: true, client, session: { ...session, id: "set-cookie" } });
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    res.setHeader("set-cookie", sessionCookie("", 0));
    await recordEvent(db, "auth.logout", {});
    if (!hasSupabase()) saveDb(db);
    return send(res, 200, { ok: true });
  }

  if (MUTATING_METHODS.has(req.method)) requireSupabaseInProduction();

  if (req.method === "POST" && pathname === "/api/payment-intents") {
    const body = await readBody(req);
    const amount = Number(body.amount || 0);
    if (!amount || amount < 1) return sendError(res, 400, "A positive payment amount is required.");
    const paymentIntent = {
      id: id("pi"),
      status: "succeeded",
      amount,
      currency: body.currency || "usd",
      method: body.paymentMethod || "apple",
      createdAt: now()
    };
    await recordEvent(db, "payment.succeeded", { id: paymentIntent.id, amount });
    if (!hasSupabase()) saveDb(db);
    return send(res, 201, { ok: true, paymentIntent });
  }

  if (req.method === "POST" && pathname === "/api/wardrobe") {
    const body = await readBody(req);
    const item = productFromPayload(body.item || body);
    if (!item) return sendError(res, 400, "A wardrobe item with id and name is required.");
    const wardrobe = (await readStore(db, "wardrobe", "wardrobe")).map(fromSnake);
    const exists = wardrobe.some(entry => entry.id === item.id);
    if (!exists) {
      const record = { ...item, savedAt: now(), createdAt: now() };
      await insertStore(db, "wardrobe", "wardrobe", toSnake(record));
      await recordEvent(db, "wardrobe.added", { id: item.id, name: item.name });
      if (!hasSupabase()) saveDb(db);
    }
    return send(res, 200, { ok: true, item, wardrobe: (await readStore(db, "wardrobe", "wardrobe")).map(fromSnake), alreadySaved: exists });
  }

  if (req.method === "DELETE" && pathname.startsWith("/api/wardrobe/")) {
    const itemId = decodeURIComponent(pathname.replace("/api/wardrobe/", ""));
    const removed = await deleteStore(db, "wardrobe", "wardrobe", "id", itemId);
    await recordEvent(db, "wardrobe.removed", { id: itemId });
    if (!hasSupabase()) saveDb(db);
    return send(res, 200, { ok: true, removed, wardrobe: (await readStore(db, "wardrobe", "wardrobe")).map(fromSnake) });
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    const body = await readBody(req);
    const items = Array.isArray(body.items) && body.items.length ? body.items.map(productFromPayload).filter(Boolean) : (await readStore(db, "wardrobe", "wardrobe")).map(fromSnake);
    if (!items.length) return sendError(res, 400, "At least one order item is required.");
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const order = {
      id: id("ord"),
      status: "confirmed",
      paymentMethod: String(body.paymentMethod || "apple"),
      shipping: body.shipping || {},
      items,
      subtotal,
      total: subtotal,
      paymentStatus: "paid",
      paymentIntentId: body.paymentIntentId || id("pi"),
      createdAt: now()
    };
    await insertStore(db, "orders", "orders", toSnake(order));
    await recordEvent(db, "order.confirmed", { id: order.id, total: order.total });
    if (!hasSupabase()) saveDb(db);
    return send(res, 201, { ok: true, order });
  }

  if (req.method === "POST" && pathname === "/api/mtm-commissions") {
    const body = await readBody(req);
    const commission = {
      id: id("mtm"),
      status: "commissioned",
      style: body.style || "Double-Breasted",
      fabric: body.fabric || "Silk Cashmere",
      details: body.details || [],
      measurements: body.measurements || design.mtm.measurements || [],
      estimatedAtelierTime: body.estimatedAtelierTime || "6-8 weeks",
      createdAt: now()
    };
    await insertStore(db, "mtm_commissions", "mtmCommissions", toSnake(commission));
    await recordEvent(db, "mtm.commissioned", { id: commission.id, style: commission.style, fabric: commission.fabric });
    if (!hasSupabase()) saveDb(db);
    return send(res, 201, { ok: true, commission });
  }

  if (req.method === "POST" && pathname === "/api/fitting-requests") {
    const body = await readBody(req);
    const request = {
      id: id("fit"),
      status: "requested",
      name: body.name || design.dossier.name || "Private Client",
      note: body.note || "Client requested a fitting.",
      createdAt: now()
    };
    await insertStore(db, "fitting_requests", "fittingRequests", toSnake(request));
    await recordEvent(db, "fitting.requested", { id: request.id });
    if (!hasSupabase()) saveDb(db);
    return send(res, 201, { ok: true, request });
  }

  if (req.method === "POST" && pathname === "/api/contact-requests") {
    const body = await readBody(req);
    if (!body.name || !body.email) return sendError(res, 400, "Name and email are required.");
    const request = {
      id: id("con"),
      status: "new",
      name: String(body.name),
      email: String(body.email),
      message: String(body.message || ""),
      createdAt: now()
    };
    await insertStore(db, "contact_requests", "contactRequests", toSnake(request));
    await recordEvent(db, "contact.created", { id: request.id, email: request.email });
    if (!hasSupabase()) saveDb(db);
    return send(res, 201, { ok: true, request });
  }

  sendError(res, 404, "API route not found.");
}

module.exports = {
  PUBLIC_DIR,
  handleApi,
  sendError
};
