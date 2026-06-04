/* ============================================================
   MONSIEUR — shared dataset
   ============================================================ */
window.GARMENTS = [
  { id:"silk-cashmere-rollneck", name:"Silk Cashmere Rollneck", house:"Knitwear", cat:"Knitwear",
    price:1550, tone:"t-cashmere", material:"Silk Cashmere", composition:"70% Silk · 30% Cashmere",
    color:"Ivory", fit:"Regular", season:"Autumn / Winter", origin:"Inner Mongolia & Italy",
    tagline:"Icon", desc:"An icon of understated luxury. Crafted from a premium blend of silk and cashmere for exceptional softness, lightness and warmth." },
  { id:"soul-02-db-suit", name:"Soul 02 Double-Breasted Suit", house:"Tailoring", cat:"Suits",
    sku:"AG-SU-002",
    price:4200, tone:"t-navy", material:"Tropical Wool Linen", composition:"54% Wool · 30% Linen · 16% Silk",
    color:"Deep Mediterranean Navy", fit:"Relaxed Modern", season:"Spring / Summer", origin:"Biella, Italy",
    tagline:"Made in Italy", desc:"A relaxed double-breasted soul in deep Mediterranean navy. Soft natural shoulder, peak lapel and a pleated, easy trouser — tailored for evening ease." },
  { id:"sea-island-shirt", name:"Sea Island Poplin Shirt", house:"Shirting", cat:"Shirts",
    price:420, tone:"t-ivory", material:"Sea Island Cotton", composition:"100% Sea Island Cotton",
    color:"Powder Blue", fit:"Tailored", season:"All Season", origin:"Bergamo, Italy",
    tagline:"", desc:"Woven from the world's rarest long-staple cotton — luminous, cool to the hand, and quietly luxurious under tailoring." },
  { id:"vicuna-overcoat", name:"Vicuña Polo Coat", house:"Outerwear", cat:"Outerwear",
    price:12800, tone:"t-camel", material:"Pure Vicuña", composition:"100% Vicuña",
    color:"Natural Camel", fit:"Relaxed", season:"Autumn / Winter", origin:"Andes & Italy",
    tagline:"Rare", desc:"The rarest fibre on earth, woven into a relaxed polo coat. Impossibly light, warm beyond measure, and softer than memory." },
  { id:"flannel-trouser", name:"Pleated Flannel Trouser", house:"Tailoring", cat:"Trousers",
    price:680, tone:"t-flannel", material:"Super 120s Flannel", composition:"100% Merino Wool",
    color:"Stone Grey", fit:"Pleated", season:"Autumn / Winter", origin:"Huddersfield, England",
    tagline:"", desc:"A brushed Super 120s flannel cut with a single forward pleat and a relaxed, draping leg. The trouser a wardrobe is built around." },
  { id:"cashmere-polo", name:"Cashmere Piqué Polo", house:"Knitwear", cat:"Knitwear",
    price:890, tone:"t-stone", material:"Mongolian Cashmere", composition:"100% Cashmere",
    color:"Taupe", fit:"Regular", season:"All Season", origin:"Inner Mongolia & Scotland",
    tagline:"", desc:"A knitted polo in featherweight cashmere piqué — the ease of a t-shirt with the gravity of fine tailoring." },
  { id:"linen-db-blazer", name:"Irish Linen Blazer", house:"Tailoring", cat:"Jackets",
    price:1980, tone:"t-linen", material:"Irish Linen", composition:"100% Irish Linen",
    color:"Sand", fit:"Soft Structure", season:"Spring / Summer", origin:"Ireland",
    tagline:"", desc:"An unstructured warm-weather blazer in heavyweight Irish linen, made to crease, soften and improve with every wearing." },
  { id:"merino-overshirt", name:"Merino Travel Overshirt", house:"Knitwear", cat:"Outerwear",
    price:740, tone:"t-merino", material:"Merino Wool", composition:"100% Merino Wool",
    color:"Olive", fit:"Relaxed", season:"All Season", origin:"New Zealand & Italy",
    tagline:"", desc:"A knitted overshirt in thermoregulating merino — odour-resistant, endlessly packable, equally at home over a shirt or under a coat." },
  { id:"black-tie-dinner", name:"Midnight Dinner Jacket", house:"Formalwear", cat:"Suits",
    price:5400, tone:"t-black", material:"Wool & Mohair", composition:"80% Wool · 20% Mohair",
    color:"Midnight Blue", fit:"Tailored", season:"All Season", origin:"Biella, Italy",
    tagline:"Black Tie", desc:"A midnight-blue dinner jacket with grosgrain peak lapel — darker than black under candlelight, the only way to wear evening." },
  { id:"flannel-suit-grey", name:"Prince of Wales Suit", house:"Tailoring", cat:"Suits",
    price:3800, tone:"t-charcoal", material:"Super 130s Wool", composition:"100% Wool",
    color:"Grey Check", fit:"Tailored", season:"Autumn / Winter", origin:"Biella, Italy",
    tagline:"", desc:"The Prince of Wales check, rendered in a soft Super 130s. A business suit with a country soul." },
  { id:"milano-travel-suit", name:"Milano Travel Suit", house:"Tailoring", cat:"Suits",
    sku:"AG-SU-009",
    price:1595, tone:"t-navy", material:"High Twist Wool", composition:"100% High Twist Wool",
    color:"Navy", fit:"Modern Business", season:"Travel", origin:"Aelier Groupe atelier network",
    tagline:"Travel", desc:"A modern business suit in high-twist wool, tailored for travel with a composed drape, clean profile and resilient finish." },
  { id:"oxford-shirt-white", name:"Royal Oxford Shirt", house:"Shirting", cat:"Shirts",
    price:340, tone:"t-ivory", material:"Royal Oxford Cotton", composition:"100% Cotton",
    color:"White", fit:"Tailored", season:"All Season", origin:"Portugal",
    tagline:"", desc:"A lustrous royal oxford with a subtle texture — the white shirt that carries equally under a suit or alone." },
  { id:"donegal-overcoat", name:"Donegal Herringbone Coat", house:"Outerwear", cat:"Outerwear",
    price:3200, tone:"t-brown", material:"Donegal Tweed", composition:"95% Wool · 5% Cashmere",
    color:"Chestnut", fit:"Relaxed", season:"Autumn / Winter", origin:"Donegal, Ireland",
    tagline:"", desc:"A flecked Donegal herringbone overcoat with raglan shoulders — rugged provenance, refined silhouette." },
];
window.PRODUCT_BOARDS = {
  "soul-02-db-suit": "uploads/product-boards/continental-db-blazer.png",
  "milano-travel-suit": "uploads/product-boards/sartoria-peak-blazer.png",
  "flannel-trouser": "uploads/product-boards/riviera-pleated-trouser.png",
  "black-tie-dinner": "uploads/product-boards/sartoria-peak-blazer.png",
  "flannel-suit-grey": "uploads/product-boards/continental-formal-trouser.png"
};
(window.GARMENTS || []).forEach(g => { if (window.PRODUCT_BOARDS[g.id]) g.board = window.PRODUCT_BOARDS[g.id]; });

window.PRODUCT_EDITORIAL = {
  "AG-SU-002": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-002-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-002-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-002-back.png", label:"Back View" }
  ],
  "AG-SU-003": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-003-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-003-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-003-back.png", label:"Back View" }
  ],
  "AG-SU-005": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-005-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-005-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-005-back.png", label:"Back View" }
  ],
  "AG-SU-006": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-006-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-006-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-006-back.png", label:"Back View" }
  ],
  "AG-SU-007": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-007-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-007-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-007-back.png", label:"Back View" }
  ],
  "AG-SU-008": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-008-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-008-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-008-back.png", label:"Back View" }
  ],
  "AG-SU-009": [
    { kind:"front", src:"uploads/product-editorial/AG-SU-009-front.png", label:"Front View" },
    { kind:"side", src:"uploads/product-editorial/AG-SU-009-side.png", label:"Side View" },
    { kind:"back", src:"uploads/product-editorial/AG-SU-009-back.png", label:"Back View" }
  ]
};
(window.GARMENTS || []).forEach(g => {
  if (g.sku && window.PRODUCT_EDITORIAL[g.sku]) g.editorial = window.PRODUCT_EDITORIAL[g.sku];
});
window.MATERIALS = [
  { name:"Silk Cashmere", tone:"t-cashmere", line:"The perfect union of strength and softness.",
    note:"Warm", weight:"Lightweight", desc:"A premium blend marrying the lustre of mulberry silk with the warmth of cashmere — an icon of understated luxury." },
  { name:"Pure Cashmere", tone:"t-stone", line:"Ultrafine softness, unrivalled warmth.",
    note:"Warm", weight:"Lightweight", desc:"Combed from the underfleece of Capra hircus goats in Inner Mongolia. Graded by micron and staple length for the finest hand." },
  { name:"Vicuña", tone:"t-camel", line:"The rarest fibre on earth.",
    note:"Warm", weight:"Lightweight", desc:"Shorn from wild Andean vicuña no more than once every three years. The softest, warmest and rarest natural fibre known." },
  { name:"Tropical Wool", tone:"t-wool", line:"Refined, versatile and naturally elegant.",
    note:"All Season", weight:"Midweight", desc:"A high-twist open weave that breathes in heat and resists creasing — the modern foundation of warm-weather tailoring." },
  { name:"Irish Linen", tone:"t-linen", line:"Light, breathable, made for warmer days.",
    note:"Cool", weight:"Lightweight", desc:"Spun from long-line European flax. Crisp when new, it softens into a relaxed, lived-in drape with age." },
  { name:"Merino Wool", tone:"t-merino", line:"Naturally thermoregulating and odour-resistant.",
    note:"All Season", weight:"Midweight", desc:"Fine Merino fibre that warms in cold and cools in heat — naturally elastic, breathable and endlessly wearable." },
  { name:"Sea Island Cotton", tone:"t-ivory", line:"Extremely soft and naturally luminous.",
    note:"Cool", weight:"Lightweight", desc:"The rarest long-staple cotton in the world, prized for its silken hand, durability and quiet sheen." },
  { name:"Super 120s Flannel", tone:"t-flannel", line:"Brushed comfort with a soft, full hand.",
    note:"Warm", weight:"Heavyweight", desc:"A milled and brushed worsted that traps warmth in a soft nap — the most comforting cloth in tailoring." },
];

/* private client dossier */
window.DOSSIER = {
  name:"Mr. Alexandre Moreau", since:"2021", tier:"Private Client",
  overview:[
    { k:"Collection Archive", v:"24", u:"Pieces" },
    { k:"Atelier Orders", v:"3", u:"Active" },
    { k:"Measurement Profile", v:"2", u:"Saved" },
    { k:"Private Releases", v:"2", u:"Available" },
  ],
  activity:[
    { t:"Atelier Order Confirmed", s:"Silk Cashmere Overcoat", w:"2d", ico:"order" },
    { t:"New Private Release", s:"Italian Linen Collection", w:"1w", ico:"release" },
    { t:"Measurement Profile Updated", s:"Summer 2024", w:"2w", ico:"measure" },
  ],
};

/* made to measure steps + measurements */
window.MTM = {
  steps:["Style","Fabric","Details","Measurements","Review"],
  measurements:[
    { k:"Chest", v:"102 cm" }, { k:"Waist", v:"86 cm" }, { k:"Hip", v:"101 cm" },
    { k:"Shoulder", v:"48 cm" }, { k:"Sleeve Length", v:"63 cm" }, { k:"Back Length", v:"75 cm" },
    { k:"Inseam", v:"82 cm" },
  ],
};

/* fibre passport (for Silk Cashmere Rollneck) */
window.PASSPORT = {
  garment:"silk-cashmere-rollneck", code:"FP-CN-002 / IVORY",
  origin:[
    { k:"Cashmere Origin", v:"Inner Mongolia, China" },
    { k:"Silk Origin", v:"Como, Italy" },
    { k:"Yarn Spinning", v:"Biella, Italy" },
    { k:"Knitting", v:"Perugia, Italy" },
    { k:"Finishing", v:"Tuscany, Italy" },
  ],
  spec:[
    { k:"Cashmere Micron Count", v:"14.5 micron" },
    { k:"Silk Grade", v:"6A Mulberry Silk" },
    { k:"Gauge", v:"12-Gauge Fine Knit" },
    { k:"Garment Weight", v:"320 g" },
    { k:"Construction", v:"Fully Fashioned" },
    { k:"Traceability", v:"100% Verified" },
  ],
};

function fmtPrice(n){ return '$' + n.toLocaleString('en-US'); }
function findGarment(id){ return (window.GARMENTS||[]).find(g => g.id === id) || window.GARMENTS[0]; }
