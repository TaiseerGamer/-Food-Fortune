// ════════════════════════════════════════════════════════
//  Food Fortune — v1.0.3  PATCH
//  Changes:
//    ✅ Eid al-Adha event fully removed
//    ✅ 2 new box tiers: Ultra Box & Cosmic Box
//    ✅ Drop-rate odds shown on each box card
//    ✅ Collection search bar
//    ✅ Achievement category filter tabs
//    ✅ Dark mode / light mode toggle (Settings)
//    ✅ Sell hint shown in food modal
//    ✅ Auto-clicker tick rate improved (250ms → smooth)
//    ✅ Prestige threshold raised: 5,000 → 10,000 coins
//    ✅ Box price rebalance (Snack 10→8, Gourmet 50→40)
//    ✅ Achievement progress now persists across prestige
//    ✅ Duplicate achievement unlock bug fixed
//    ✅ CPS badge now updates instantly after upgrade
//    ✅ "Sell Dupes" floater now spawns at correct position
//    ✅ Settings version info panel added
//    ✅ Coin label shows current multiplier when prestiged
// ════════════════════════════════════════════════════════

// ── SOUND ENGINE ──────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (type) {
      case "click":
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        break;
      case "box":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
        break;
      case "rare":
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        break;
      case "legendary":
        [0, 0.1, 0.2].forEach((delay, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination);
          o2.type = "sine";
          o2.frequency.setValueAtTime(600 + i * 200, now + delay);
          o2.frequency.exponentialRampToValueAtTime(1400 + i * 100, now + delay + 0.25);
          g2.gain.setValueAtTime(0.2, now + delay);
          g2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);
          o2.start(now + delay); o2.stop(now + delay + 0.3);
        });
        return;
      case "achievement":
        [0, 0.12, 0.24].forEach((delay, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination);
          o2.type = "triangle";
          o2.frequency.setValueAtTime(700 + i * 150, now + delay);
          g2.gain.setValueAtTime(0.15, now + delay);
          g2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
          o2.start(now + delay); o2.stop(now + delay + 0.18);
        });
        return;
      case "sell":
        osc.type = "square";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now); osc.stop(now + 0.12);
        break;
      case "prestige":
        [0, 0.1, 0.2, 0.3, 0.4].forEach((delay, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination);
          o2.type = "sine";
          o2.frequency.setValueAtTime(400 + i * 180, now + delay);
          o2.frequency.exponentialRampToValueAtTime(1600 + i * 80, now + delay + 0.35);
          g2.gain.setValueAtTime(0.2, now + delay);
          g2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);
          o2.start(now + delay); o2.stop(now + delay + 0.4);
        });
        return;
      case "craft":
        osc.type = "sine";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        break;
    }
  } catch (e) { /* silently fail */ }
}

// ── FOOD DATA ──────────────────────────────────────────
const FOODS = [
  { name: "White Rice",      icon: "🍚", rarity: "common",    desc: "A humble staple. Not exciting, but reliable.",         sellValue: 1    },
  { name: "Plain Bread",     icon: "🍞", rarity: "common",    desc: "Just bread. Basic. You can do this.",                   sellValue: 1    },
  { name: "Boiled Egg",      icon: "🥚", rarity: "common",    desc: "Protein, that's about it.",                            sellValue: 1    },
  { name: "Carrot Sticks",   icon: "🥕", rarity: "common",    desc: "Crunchy and orange. Very common.",                     sellValue: 1    },
  { name: "Crackers",        icon: "🫙", rarity: "common",    desc: "The snack of mild disappointment.",                    sellValue: 1    },
  { name: "Ramen Bowl",      icon: "🍜", rarity: "uncommon",  desc: "Steaming noodles with a rich broth!",                  sellValue: 5    },
  { name: "Grilled Corn",    icon: "🌽", rarity: "uncommon",  desc: "Charred sweetness from the grill.",                    sellValue: 5    },
  { name: "Avocado Toast",   icon: "🥑", rarity: "uncommon",  desc: "A brunch classic. Somewhat trendy.",                   sellValue: 5    },
  { name: "Taco",            icon: "🌮", rarity: "uncommon",  desc: "Crunchy shell, tasty fillings.",                       sellValue: 5    },
  { name: "Pancakes",        icon: "🥞", rarity: "uncommon",  desc: "Fluffy stacked goodness.",                             sellValue: 5    },
  { name: "Sushi Platter",   icon: "🍣", rarity: "rare",      desc: "Fresh nigiri and rolls, beautifully arranged.",        sellValue: 20   },
  { name: "Beef Steak",      icon: "🥩", rarity: "rare",      desc: "A perfectly seared cut. Medium-rare, of course.",      sellValue: 20   },
  { name: "Lobster Bisque",  icon: "🦞", rarity: "rare",      desc: "Rich, creamy, and deeply indulgent.",                  sellValue: 20   },
  { name: "Truffle Pasta",   icon: "🍝", rarity: "rare",      desc: "Earthy truffles tossed with silky pasta.",             sellValue: 20   },
  { name: "Wagyu Burger",    icon: "🍔", rarity: "rare",      desc: "Premium beef, perfectly seasoned.",                    sellValue: 20   },
  { name: "Dragon Ramen",    icon: "🐉", rarity: "epic",      desc: "Legendary broth simmered for 72 hours.",               sellValue: 75   },
  { name: "Golden Cake",     icon: "🎂", rarity: "epic",      desc: "Encrusted with edible gold leaf.",                     sellValue: 75   },
  { name: "Kobe Teppanyaki", icon: "🔥", rarity: "epic",      desc: "Finest Kobe beef, teppanyaki style.",                  sellValue: 75   },
  { name: "Black Truffle",   icon: "🍄", rarity: "epic",      desc: "Rare fungal treasure from Périgord.",                  sellValue: 75   },
  { name: "Ambrosia Bowl",   icon: "🌟", rarity: "legendary", desc: "Food of the gods. Literally divine.",                  sellValue: 250  },
  { name: "Phoenix Wings",   icon: "🦅", rarity: "legendary", desc: "Spicy wings that burst into flame. Handle with care.", sellValue: 250  },
  { name: "Crystal Sashimi", icon: "💎", rarity: "legendary", desc: "Perfectly sliced, jewel-like tuna.",                   sellValue: 250  },
  { name: "Celestial Ramen", icon: "✨", rarity: "mythic",    desc: "A bowl from another dimension. Indescribable taste.",  sellValue: 1000 },
  { name: "Star Cake",       icon: "🌠", rarity: "mythic",    desc: "Baked in a supernova. Impossibly rare.",               sellValue: 1000 },
];

// ── RARITIES ───────────────────────────────────────────
const RARITIES = {
  common:    { label: "COMMON"    },
  uncommon:  { label: "UNCOMMON"  },
  rare:      { label: "RARE"      },
  epic:      { label: "EPIC"      },
  legendary: { label: "LEGENDARY" },
  mythic:    { label: "MYTHIC"    },
  crafted:   { label: "CRAFTED"   },
};

// ── BOXES — rebalanced prices, 2 new tiers ─────────────
// FIX: Snack Box 10→8, Gourmet Box 50→40
const BOXES = [
  {
    name: "Snack Box", icon: "📦", price: 8, btnClass: "b0",
    desc: "Basic luck. Common finds likely.",
    odds: "Common 60% · Uncommon 28% · Rare 9%",
    weights: { common: 60, uncommon: 28, rare: 9, epic: 2.5, legendary: 0.4, mythic: 0.1 },
  },
  {
    name: "Gourmet Box", icon: "🎁", price: 40, btnClass: "b1",
    desc: "Better odds — Rare foods await!",
    odds: "Rare 22% · Epic 9% · Legendary 3%",
    weights: { common: 30, uncommon: 35, rare: 22, epic: 9, legendary: 3, mythic: 1 },
  },
  {
    name: "Legend Box", icon: "👑", price: 200, btnClass: "b2",
    desc: "Extreme luck. Mythic possible!",
    odds: "Epic 22% · Legendary 12% · Mythic 6%",
    weights: { common: 10, uncommon: 20, rare: 30, epic: 22, legendary: 12, mythic: 6 },
  },
  // NEW v1.0.3
  {
    name: "Ultra Box", icon: "💜", price: 600, btnClass: "b3",
    desc: "Guaranteed Epic or higher. No common drops.",
    odds: "Epic 45% · Legendary 35% · Mythic 20%",
    weights: { common: 0, uncommon: 0, rare: 0, epic: 45, legendary: 35, mythic: 20 },
    cardClass: "ultra-card",
  },
  {
    name: "Cosmic Box", icon: "🌌", price: 2000, btnClass: "b4",
    desc: "Only Legendary & Mythic. The ultimate box.",
    odds: "Legendary 60% · Mythic 40%",
    weights: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 60, mythic: 40 },
    cardClass: "cosmic-card",
  },
];

// ── AUTO-CLICKER UPGRADES ─────────────────────────────
const UPGRADES = [
  { id: "snack_imp",  icon: "🍪", name: "Cookie Jar",  desc: "+1 coin/s automatically.",   baseCps: 1,  baseCost: 50,   costScale: 1.6, maxLevel: 10 },
  { id: "pizza_oven", icon: "🍕", name: "Pizza Oven",  desc: "+5 coins/s.",                baseCps: 5,  baseCost: 200,  costScale: 1.7, maxLevel: 10 },
  { id: "sushi_bar",  icon: "🍣", name: "Sushi Bar",   desc: "+20 coins/s.",               baseCps: 20, baseCost: 800,  costScale: 1.8, maxLevel: 10 },
  { id: "ramen_shop", icon: "🍜", name: "Ramen Shop",  desc: "+80 coins/s.",               baseCps: 80, baseCost: 3000, costScale: 1.9, maxLevel: 10 },
];

// ── RECIPES ────────────────────────────────────────────
const RECIPES = [
  { id: "breakfast_royale", name: "Breakfast Royale",   icon: "🍳", desc: "The ultimate breakfast — eggs, bread and pancakes stacked to perfection.", rarity: "crafted", ingredients: [{ name: "Boiled Egg", qty: 2 }, { name: "Plain Bread", qty: 1 }, { name: "Pancakes", qty: 1 }], sellValue: 30 },
  { id: "surf_and_turf",    name: "Surf & Turf",        icon: "🍽️", desc: "Premium steak and fresh seafood on one plate.", rarity: "crafted", ingredients: [{ name: "Beef Steak", qty: 1 }, { name: "Sushi Platter", qty: 1 }], sellValue: 120 },
  { id: "truffle_ramen",    name: "Truffle Ramen",      icon: "🫕", desc: "Silky ramen broth elevated with shaved black truffle. Absurdly luxurious.", rarity: "crafted", ingredients: [{ name: "Ramen Bowl", qty: 2 }, { name: "Black Truffle", qty: 1 }], sellValue: 200 },
  { id: "golden_feast",     name: "Golden Feast",       icon: "🌅", desc: "Wagyu, truffle pasta and golden cake. Pure decadence.", rarity: "crafted", ingredients: [{ name: "Wagyu Burger", qty: 1 }, { name: "Truffle Pasta", qty: 1 }, { name: "Golden Cake", qty: 1 }], sellValue: 500 },
  { id: "dragon_sushi",     name: "Dragon Sushi Roll",  icon: "🐉", desc: "Dragon Ramen broth poured over a premium sushi platter.", rarity: "crafted", ingredients: [{ name: "Dragon Ramen", qty: 1 }, { name: "Sushi Platter", qty: 2 }], sellValue: 450 },
  { id: "cosmic_platter",   name: "Cosmic Platter",     icon: "🌌", desc: "Celestial Ramen meets Star Cake — a meal that transcends dimensions.", rarity: "crafted", ingredients: [{ name: "Celestial Ramen", qty: 1 }, { name: "Star Cake", qty: 1 }, { name: "Ambrosia Bowl", qty: 1 }], sellValue: 5000 },
];
RECIPES.forEach(r => {
  r.food = { name: r.name, icon: r.icon, rarity: "crafted", desc: r.desc, sellValue: r.sellValue, isCrafted: true };
});

// ── PRESTIGE CONFIG — threshold raised ────────────────
// FIX: raised from 5,000 → 10,000
const PRESTIGE_THRESHOLD = 10000;
const PRESTIGE_MULTIPLIERS = [1.0, 1.5, 2.0, 2.75, 3.5, 5.0, 7.0, 10.0];

// ── ACHIEVEMENTS ──────────────────────────────────────
const ACHIEVEMENTS = [
  { id: "first_click",  icon: "👆", name: "First Touch",     desc: "Click the coin for the first time.", cat: "clicks",    type: "clicks",    target: 1,           reward: 5    },
  { id: "click_100",    icon: "💪", name: "Finger Workout",  desc: "Click 100 times.",                   cat: "clicks",    type: "clicks",    target: 100,         reward: 50   },
  { id: "click_1000",   icon: "🖱️", name: "Click Monster",   desc: "Click 1,000 times.",                 cat: "clicks",    type: "clicks",    target: 1000,        reward: 200  },
  { id: "click_10000",  icon: "⚡", name: "Turbo Clicker",   desc: "Click 10,000 times.",                cat: "clicks",    type: "clicks",    target: 10000,       reward: 800  },
  { id: "first_box",    icon: "🎁", name: "Unboxed!",        desc: "Open your first box.",               cat: "boxes",     type: "boxes",     target: 1,           reward: 10   },
  { id: "box_25",       icon: "📦", name: "Box Hoarder",     desc: "Open 25 boxes.",                     cat: "boxes",     type: "boxes",     target: 25,          reward: 100  },
  { id: "box_100",      icon: "🏪", name: "Box Magnate",     desc: "Open 100 boxes.",                    cat: "boxes",     type: "boxes",     target: 100,         reward: 500  },
  { id: "box_500",      icon: "🏭", name: "Box Factory",     desc: "Open 500 boxes.",                    cat: "boxes",     type: "boxes",     target: 500,         reward: 2000 },
  { id: "ultra_first",  icon: "💜", name: "Going Ultra",     desc: "Open your first Ultra Box.",         cat: "boxes",     type: "ultraBoxes",target: 1,           reward: 200  },
  { id: "cosmic_first", icon: "🌌", name: "Cosmic Taste",    desc: "Open your first Cosmic Box.",        cat: "boxes",     type: "cosmicBoxes",target: 1,          reward: 800  },
  { id: "foods_5",      icon: "🥗", name: "Foodie",          desc: "Collect 5 unique foods.",            cat: "collection",type: "unique",    target: 5,           reward: 30   },
  { id: "foods_15",     icon: "🍽️", name: "Gourmet",         desc: "Collect 15 unique foods.",           cat: "collection",type: "unique",    target: 15,          reward: 150  },
  { id: "foods_all",    icon: "👨‍🍳", name: "Master Chef",     desc: "Collect all 24 unique foods.",       cat: "collection",type: "unique",    target: 24,          reward: 2000 },
  { id: "rare_find",    icon: "🔵", name: "Rare Find",       desc: "Obtain a Rare food.",                cat: "collection",type: "rarity",    target: "rare",      reward: 40   },
  { id: "epic_find",    icon: "🟣", name: "Epic Taste",      desc: "Obtain an Epic food.",               cat: "collection",type: "rarity",    target: "epic",      reward: 100  },
  { id: "legend_find",  icon: "🟠", name: "Legendary Feast", desc: "Obtain a Legendary food.",           cat: "collection",type: "rarity",    target: "legendary", reward: 300  },
  { id: "mythic_find",  icon: "🩷", name: "Mythic Bite",     desc: "Obtain a Mythic food.",              cat: "collection",type: "rarity",    target: "mythic",    reward: 1000 },
  { id: "streak_3",     icon: "🔥", name: "On a Roll",       desc: "Log in 3 days in a row.",            cat: "other",     type: "streak",    target: 3,           reward: 75   },
  { id: "streak_7",     icon: "🌟", name: "Weekly Warrior",  desc: "Maintain a 7-day streak.",           cat: "other",     type: "streak",    target: 7,           reward: 500  },
  { id: "sold_100",     icon: "💸", name: "Market Flip",     desc: "Earn 100 coins by selling.",         cat: "other",     type: "sellTotal", target: 100,         reward: 50   },
  { id: "sold_5000",    icon: "💰", name: "Food Trader",     desc: "Earn 5,000 coins by selling.",       cat: "other",     type: "sellTotal", target: 5000,        reward: 500  },
  { id: "first_craft",  icon: "🍳", name: "Chef's Kiss",     desc: "Craft your first recipe.",           cat: "recipes",   type: "crafted",   target: 1,           reward: 60   },
  { id: "all_recipes",  icon: "📖", name: "Recipe Master",   desc: "Craft all 6 recipes.",               cat: "recipes",   type: "crafted",   target: 6,           reward: 1500 },
  { id: "prestige_1",   icon: "⭐", name: "Transcended",     desc: "Prestige for the first time.",       cat: "prestige",  type: "prestige",  target: 1,           reward: 500  },
  { id: "prestige_3",   icon: "🌠", name: "Legend Reborn",   desc: "Prestige 3 times.",                  cat: "prestige",  type: "prestige",  target: 3,           reward: 2000 },
  { id: "prestige_5",   icon: "👑", name: "Eternal Foodie",  desc: "Prestige 5 times.",                  cat: "prestige",  type: "prestige",  target: 5,           reward: 8000 },
];

// ── STATE ──────────────────────────────────────────────
let money            = 0;
let totalClicks      = 0;
let totalBoxes       = 0;
let totalUltraBoxes  = 0;
let totalCosmicBoxes = 0;
let collection       = {};
let upgradeLevels    = {};
// FIX: achievementsDone now persists across prestige — stored separately
let achievementsDone = new Set();
let totalSellEarned  = 0;
let loginStreak      = 0;
let rarityFound      = new Set();
let prestigeCount    = 0;
let craftedSet       = new Set();
let showFloaters     = true;
let achFilter        = "all";
let collSearchQuery  = "";

// ── DOM REFS ───────────────────────────────────────────
const moneyEl           = document.getElementById("money-display");
const clicksEl          = document.getElementById("stat-clicks");
const boxesEl           = document.getElementById("stat-boxes");
const foodsEl           = document.getElementById("stat-foods");
const streakEl          = document.getElementById("stat-streak");
const collList          = document.getElementById("collection-list");
const coinBtn           = document.getElementById("coin-btn");
const coinLabel         = document.getElementById("coin-label");
const overlay           = document.getElementById("modal-overlay");
const resultModal       = document.getElementById("result-modal");
const modalIcon         = document.getElementById("modal-icon");
const modalRar          = document.getElementById("modal-rarity");
const modalName         = document.getElementById("modal-name");
const modalDesc         = document.getElementById("modal-desc");
const modalCraftedBadge = document.getElementById("modal-crafted-badge");
const modalSellHint     = document.getElementById("modal-sell-hint");
const modalClose        = document.getElementById("modal-close");
const cpsBadge          = document.getElementById("cps-badge");
const cpsVal            = document.getElementById("cps-val");
const sellAllBtn        = document.getElementById("sell-all-btn");
const achToast          = document.getElementById("achievement-toast");
const toastIcon         = document.getElementById("toast-icon");
const toastLabel        = document.getElementById("toast-label");
const toastName         = document.getElementById("toast-name");
const dailyBanner       = document.getElementById("daily-banner");
const dailyTitle        = document.getElementById("daily-title");
const dailySub          = document.getElementById("daily-sub");
const dailyClaim        = document.getElementById("daily-claim-btn");
const soundBtn          = document.getElementById("sound-btn");
const settingsBtn       = document.getElementById("settings-btn");
const settingsOverlay   = document.getElementById("settings-overlay");
const settingsClose     = document.getElementById("settings-close-btn");
const settingsReset     = document.getElementById("settings-reset-btn");
const soundToggle       = document.getElementById("sound-toggle");
const floaterToggle     = document.getElementById("floater-toggle");
const darkmodeToggle    = document.getElementById("darkmode-toggle");
const prestigeOverlay   = document.getElementById("prestige-overlay");
const prestigeBanner    = document.getElementById("prestige-banner");
const prestigeBannerBtn = document.getElementById("prestige-banner-btn");
const prestigeConfirm   = document.getElementById("prestige-confirm-btn");
const prestigeCancel    = document.getElementById("prestige-cancel-btn");
const prestigeBadge     = document.getElementById("prestige-badge");
const prestigeMultDisp  = document.getElementById("prestige-mult-display");
const prestigeMultPrev  = document.getElementById("prestige-mult-preview");
const prestigeChip      = document.getElementById("prestige-chip");
const statPrestige      = document.getElementById("stat-prestige");
const prestigeRwdPrev   = document.getElementById("prestige-rewards-preview");
const collSearch        = document.getElementById("coll-search");

// ── HELPERS ────────────────────────────────────────────
function getPrestigeMultiplier() {
  return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount, PRESTIGE_MULTIPLIERS.length - 1)];
}
function getNextPrestigeMultiplier() {
  return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount + 1, PRESTIGE_MULTIPLIERS.length - 1)];
}

function updateMoney() { moneyEl.textContent = money.toLocaleString(); }

function updateStats() {
  clicksEl.textContent = totalClicks.toLocaleString();
  boxesEl.textContent  = totalBoxes.toLocaleString();
  foodsEl.textContent  = Object.values(collection).reduce((s, v) => s + v.count, 0).toLocaleString();
  streakEl.textContent = loginStreak;
  updatePrestigeUI();
}

function updatePrestigeUI() {
  const mult = getPrestigeMultiplier();
  if (prestigeCount > 0) {
    prestigeBadge.style.display = "inline-flex";
    prestigeMultDisp.textContent = mult.toFixed(1);
    prestigeChip.style.display = "inline-flex";
    statPrestige.textContent = prestigeCount;
    // FIX: coin label reflects multiplier
    coinLabel.textContent = `Click to earn ${mult.toFixed(1)}× coins!`;
  } else {
    coinLabel.textContent = "Click to earn coins!";
  }
  const eligible = money >= PRESTIGE_THRESHOLD && prestigeCount < PRESTIGE_MULTIPLIERS.length - 1;
  prestigeBanner.style.display = eligible ? "flex" : "none";
  if (eligible && prestigeMultPrev) {
    prestigeMultPrev.textContent = "×" + getNextPrestigeMultiplier().toFixed(1);
  }
}

function spawnFloater(x, y, amount, color) {
  if (!showFloaters) return;
  const el = document.createElement("div");
  el.className = "floater";
  el.textContent = `+${amount}`;
  if (color) el.style.color = color;
  el.style.left = (x - 20) + "px";
  el.style.top  = (y - 30) + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function getTotalCps() {
  const base = UPGRADES.reduce((s, u) => s + u.baseCps * (upgradeLevels[u.id] || 0), 0);
  return Math.floor(base * getPrestigeMultiplier());
}

function getUpgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(upg.costScale, upgradeLevels[upg.id] || 0));
}

// FIX: CPS badge updates immediately
function updateCpsBadge() {
  const cps = getTotalCps();
  cpsBadge.style.display = cps > 0 ? "inline-flex" : "none";
  cpsVal.textContent = cps.toLocaleString();
}

// ── COIN CLICK ─────────────────────────────────────────
coinBtn.addEventListener("click", (e) => {
  const earned = Math.max(1, Math.floor(1 * getPrestigeMultiplier()));
  money += earned;
  totalClicks++;
  updateMoney(); updateStats();
  playSound("click");
  coinBtn.classList.add("popping");
  setTimeout(() => coinBtn.classList.remove("popping"), 100);
  spawnFloater(e.clientX, e.clientY, earned);
  renderBoxButtons(); renderUpgrades();
  checkAchievements();
});

// FIX: smoother tick — 250ms instead of 1000ms, award ¼ CPS per tick
let accumulatedCoins = 0;
setInterval(() => {
  const cps = getTotalCps();
  if (cps > 0) {
    accumulatedCoins += cps / 4;
    if (accumulatedCoins >= 1) {
      const award = Math.floor(accumulatedCoins);
      accumulatedCoins -= award;
      money += award;
      updateMoney();
      updatePrestigeUI();
    }
  }
}, 250);

// ── PICK FOOD ──────────────────────────────────────────
function pickFood(box) {
  const w = box.weights;
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let chosen = "common";
  for (const [r, wt] of Object.entries(w)) {
    if (wt === 0) continue;
    rand -= wt;
    if (rand <= 0) { chosen = r; break; }
  }
  const pool = FOODS.filter(f => f.rarity === chosen);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── OPEN BOX ───────────────────────────────────────────
function openBox(idx) {
  const box = BOXES[idx];
  if (money < box.price) return;
  money -= box.price;
  totalBoxes++;
  if (idx === 3) totalUltraBoxes++;
  if (idx === 4) totalCosmicBoxes++;
  updateMoney(); updateStats(); renderBoxButtons();
  const food = pickFood(box);
  registerFood(food);
  const snd = ["legendary","mythic"].includes(food.rarity) ? "legendary"
            : ["rare","epic"].includes(food.rarity) ? "rare" : "box";
  playSound(snd);
  showFoodModal(food, false);
  checkAchievements();
}

function registerFood(food) {
  if (!collection[food.name]) collection[food.name] = { food, count: 0 };
  collection[food.name].count++;
  rarityFound.add(food.rarity);
  renderCollection();
}

// ── SHOW FOOD MODAL ────────────────────────────────────
function showFoodModal(food, isCrafted) {
  modalIcon.textContent = food.icon;
  modalRar.textContent  = RARITIES[food.rarity].label;
  const cls = isCrafted ? "rarity-color-crafted" : "rarity-color-" + food.rarity;
  modalRar.className    = "modal-rarity-label " + cls;
  modalName.textContent = food.name;
  modalName.className   = "modal-food-name " + cls;
  modalDesc.textContent = food.desc;
  modalCraftedBadge.style.display = isCrafted ? "inline-block" : "none";
  // FIX: sell hint in modal
  modalSellHint.textContent = `Sell value: ${food.sellValue} 🪙`;
  resultModal.classList.remove("eid-modal");
  if (["legendary","mythic"].includes(food.rarity) || isCrafted) {
    modalName.classList.add("shine");
    setTimeout(() => modalName.classList.remove("shine"), 1300);
  }
  overlay.classList.add("show");
}

modalClose.addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("show"); });

// ── CRAFTING ───────────────────────────────────────────
function canCraft(recipe) {
  return recipe.ingredients.every(ing => collection[ing.name] && collection[ing.name].count >= ing.qty);
}

function craftRecipe(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe || !canCraft(recipe)) return;
  recipe.ingredients.forEach(ing => {
    collection[ing.name].count -= ing.qty;
    if (collection[ing.name].count <= 0) delete collection[ing.name];
  });
  registerFood(recipe.food);
  craftedSet.add(id);
  playSound("craft");
  showFoodModal(recipe.food, true);
  renderRecipes();
  checkAchievements();
}

// ── UPGRADES ───────────────────────────────────────────
function buyUpgrade(idx) {
  const upg = UPGRADES[idx];
  const lvl = upgradeLevels[upg.id] || 0;
  if (lvl >= upg.maxLevel) return;
  const cost = getUpgradeCost(upg);
  if (money < cost) return;
  money -= cost;
  upgradeLevels[upg.id] = lvl + 1;
  updateMoney();
  // FIX: immediate CPS badge update
  updateCpsBadge();
  renderUpgrades(); renderBoxButtons();
}

// ── SELL DUPLICATES ────────────────────────────────────
function sellDupe(foodName) {
  const entry = collection[foodName];
  if (!entry || entry.count <= 1) return;
  const earned = (entry.count - 1) * entry.food.sellValue;
  entry.count = 1;
  money += earned; totalSellEarned += earned;
  playSound("sell");
  updateMoney(); renderCollection(); checkAchievements();
}

function sellAllDupes() {
  let total = 0;
  Object.keys(collection).forEach(name => {
    const entry = collection[name];
    if (entry.count > 1) {
      total += (entry.count - 1) * entry.food.sellValue;
      totalSellEarned += (entry.count - 1) * entry.food.sellValue;
      entry.count = 1;
    }
  });
  if (total > 0) {
    money += total; updateMoney(); renderCollection(); checkAchievements();
    playSound("sell");
    // FIX: floater spawns at correct screen position
    const r = sellAllBtn.getBoundingClientRect();
    spawnFloater(r.left + r.width / 2, r.top + window.scrollY - 10, total, "#5dde78");
  }
}
sellAllBtn.addEventListener("click", sellAllDupes);

// ── PRESTIGE ───────────────────────────────────────────
function openPrestigeModal() {
  const next = getNextPrestigeMultiplier();
  prestigeRwdPrev.innerHTML =
    `Current: <strong style="color:#c87eff">×${getPrestigeMultiplier().toFixed(1)}</strong> &nbsp;→&nbsp; After: <strong style="color:#ffe680">×${next.toFixed(1)}</strong> on all coin earnings`;
  prestigeOverlay.classList.add("show");
}

function doPrestige() {
  prestigeCount++;
  money = 0; totalBoxes = 0; totalUltraBoxes = 0; totalCosmicBoxes = 0;
  totalClicks = 0; collection = {}; upgradeLevels = {};
  totalSellEarned = 0; craftedSet = new Set(); rarityFound = new Set();
  accumulatedCoins = 0;
  renderCollection(); renderBoxButtons(); renderUpgrades(); renderRecipes();
  updateMoney(); updateStats(); updateCpsBadge();
  prestigeOverlay.classList.remove("show");
  playSound("prestige");
  // FIX: achievements NOT reset on prestige — only game progress
  checkAchievements();
  prestigeBadge.classList.add("prestige-shine");
  setTimeout(() => prestigeBadge.classList.remove("prestige-shine"), 1500);
}

prestigeBannerBtn.addEventListener("click", openPrestigeModal);
prestigeConfirm.addEventListener("click", doPrestige);
prestigeCancel.addEventListener("click", () => prestigeOverlay.classList.remove("show"));
prestigeOverlay.addEventListener("click", (e) => { if (e.target === prestigeOverlay) prestigeOverlay.classList.remove("show"); });

// ── SETTINGS ───────────────────────────────────────────
settingsBtn.addEventListener("click", () => settingsOverlay.classList.add("show"));
settingsClose.addEventListener("click", () => settingsOverlay.classList.remove("show"));
settingsOverlay.addEventListener("click", (e) => { if (e.target === settingsOverlay) settingsOverlay.classList.remove("show"); });

soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
  soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
  soundBtn.classList.toggle("muted", !soundEnabled);
});

floaterToggle.addEventListener("change", () => { showFloaters = floaterToggle.checked; });

// FIX: dark mode toggle actually applies to body
darkmodeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode", !darkmodeToggle.checked);
});

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.checked = soundEnabled;
  soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
  soundBtn.classList.toggle("muted", !soundEnabled);
});

settingsReset.addEventListener("click", () => {
  if (confirm("⚠️ Reset ALL save data? This cannot be undone!")) {
    localStorage.clear();
    location.reload();
  }
});

// ── COLLECTION SEARCH (NEW v1.0.3) ────────────────────
collSearch.addEventListener("input", () => {
  collSearchQuery = collSearch.value.toLowerCase().trim();
  renderCollection();
});

// ── ACHIEVEMENTS — FIX duplicate unlock bug ────────────
let toastQueue = [], toastRunning = false;

function checkAchievements() {
  let anyNew = false;
  ACHIEVEMENTS.forEach(ach => {
    if (achievementsDone.has(ach.id)) return; // FIX: guard prevents re-firing
    let done = false;
    switch (ach.type) {
      case "clicks":      done = totalClicks >= ach.target; break;
      case "boxes":       done = totalBoxes  >= ach.target; break;
      case "ultraBoxes":  done = totalUltraBoxes  >= ach.target; break;
      case "cosmicBoxes": done = totalCosmicBoxes >= ach.target; break;
      case "unique":      done = Object.keys(collection).filter(n => !collection[n].food.isCrafted).length >= ach.target; break;
      case "rarity":      done = rarityFound.has(ach.target); break;
      case "streak":      done = loginStreak >= ach.target; break;
      case "sellTotal":   done = totalSellEarned >= ach.target; break;
      case "crafted":     done = craftedSet.size >= ach.target; break;
      case "prestige":    done = prestigeCount >= ach.target; break;
    }
    if (done) {
      achievementsDone.add(ach.id); // FIX: added before reward to prevent double-fire
      money += ach.reward;
      updateMoney();
      playSound("achievement");
      toastQueue.push(ach);
      anyNew = true;
    }
  });
  if (anyNew) { runToastQueue(); renderAchievements(); }
}

function runToastQueue() {
  if (toastRunning || toastQueue.length === 0) return;
  toastRunning = true;
  const ach = toastQueue.shift();
  toastIcon.textContent = ach.icon;
  toastName.textContent = `${ach.name} (+${ach.reward} 🪙)`;
  toastLabel.textContent = "Achievement Unlocked!";
  toastLabel.className = "toast-label";
  achToast.classList.add("show");
  setTimeout(() => {
    achToast.classList.remove("show");
    setTimeout(() => { toastRunning = false; runToastQueue(); }, 400);
  }, 3000);
}

// ── DAILY LOGIN BONUS ──────────────────────────────────
function checkDailyBonus() {
  const today     = new Date().toDateString();
  const lastLogin = localStorage.getItem("ff_lastLogin") || "";
  const streak    = parseInt(localStorage.getItem("ff_streak") || "0");
  if (localStorage.getItem("ff_claimed") === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  loginStreak = (lastLogin === yesterday) ? streak + 1 : 1;
  const bonus = Math.min(loginStreak * 10, 200);
  dailyTitle.textContent    = `Day ${loginStreak} Bonus! 🎉`;
  dailySub.textContent      = `Login streak reward: +${bonus} 🪙`;
  dailyClaim.textContent    = `Claim +${bonus} 🪙`;
  dailyBanner.style.display = "flex";
  dailyClaim.addEventListener("click", () => {
    money += bonus; updateMoney(); renderBoxButtons();
    dailyBanner.style.display = "none";
    localStorage.setItem("ff_lastLogin", today);
    localStorage.setItem("ff_streak",    loginStreak);
    localStorage.setItem("ff_claimed",   today);
    updateStats(); checkAchievements();
  }, { once: true });
}

// ── RENDER: BOXES ──────────────────────────────────────
function renderBoxButtons() {
  const grid = document.getElementById("boxes-grid");
  grid.innerHTML = "";
  BOXES.forEach((box, i) => {
    const card = document.createElement("div");
    card.className = "box-card" + (box.cardClass ? " " + box.cardClass : "");
    card.innerHTML = `
      <div class="box-icon">${box.icon}</div>
      <div class="box-name">${box.name}</div>
      <div class="box-desc">${box.desc}</div>
      <div class="box-odds">${box.odds}</div>
      <div class="box-price">🪙 ${box.price.toLocaleString()}</div>
      <button class="box-btn ${box.btnClass}" ${money < box.price ? "disabled" : ""}>Open!</button>
    `;
    card.querySelector("button").addEventListener("click", () => openBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: UPGRADES ───────────────────────────────────
function renderUpgrades() {
  const grid = document.getElementById("upgrades-grid");
  grid.innerHTML = "";
  UPGRADES.forEach((upg, i) => {
    const lvl   = upgradeLevels[upg.id] || 0;
    const maxed = lvl >= upg.maxLevel;
    const cost  = getUpgradeCost(upg);
    const cpsAmt = Math.floor(upg.baseCps * lvl * getPrestigeMultiplier());
    const card = document.createElement("div");
    card.className = "upgrade-card" + (maxed ? " maxed" : "");
    card.innerHTML = `
      <div class="upgrade-icon">${upg.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${upg.name}</div>
        <div class="upgrade-desc">${upg.desc}</div>
        <span class="upgrade-level">Lvl ${lvl}/${upg.maxLevel} · ${cpsAmt > 0 ? `+${cpsAmt}/s` : "idle"}</span>
      </div>
      <div class="upgrade-right">
        <div class="upgrade-price">${maxed ? "—" : "🪙 " + cost.toLocaleString()}</div>
        <button class="upgrade-btn ${maxed ? "maxed-btn" : ""}" ${maxed || money < cost ? "disabled" : ""}>${maxed ? "MAX" : "Buy"}</button>
      </div>
    `;
    if (!maxed) card.querySelector("button").addEventListener("click", () => buyUpgrade(i));
    grid.appendChild(card);
  });
}

// ── RENDER: RECIPES ────────────────────────────────────
function renderRecipes() {
  const list = document.getElementById("recipes-list");
  list.innerHTML = "";
  RECIPES.forEach(recipe => {
    const craftable = canCraft(recipe);
    const crafted   = craftedSet.has(recipe.id);
    const card = document.createElement("div");
    card.className = "recipe-card" + (craftable ? " can-craft" : "");
    const ingsHTML = recipe.ingredients.map((ing, i) => {
      const entry = collection[ing.name];
      const has   = entry && entry.count >= ing.qty;
      const have  = entry ? entry.count : 0;
      return `${i > 0 ? '<span class="recipe-plus">+</span>' : ""}
        <span class="recipe-ingredient ${has ? "has-it" : "missing"}">
          ${ing.qty > 1 ? `${ing.qty}× ` : ""}${ing.name} <span style="opacity:.6">(${have})</span>
        </span>`;
    }).join("") + `<span class="recipe-arrow">→</span>
      <span class="recipe-ingredient has-it">${recipe.icon} ${recipe.name}</span>`;
    card.innerHTML = `
      <div class="recipe-top">
        <div class="recipe-result-icon">${recipe.icon}</div>
        <div class="recipe-info">
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-desc">${recipe.desc}</div>
          <span class="recipe-rarity-badge">🍳 CRAFTED · sells for ${recipe.sellValue} 🪙</span>
        </div>
      </div>
      <div class="recipe-ingredients">${ingsHTML}</div>
      <button class="recipe-craft-btn ${crafted && !craftable ? "crafted-btn" : ""}" ${!craftable ? "disabled" : ""}>
        ${crafted && !craftable ? "✅ Crafted" : craftable ? "🍳 Craft!" : "🔒 Need ingredients"}
      </button>
    `;
    if (craftable) card.querySelector("button").addEventListener("click", () => craftRecipe(recipe.id));
    list.appendChild(card);
  });
}

// ── RENDER: ACHIEVEMENTS (with filter) ────────────────
const ACH_CATEGORIES = ["all", "clicks", "boxes", "collection", "recipes", "prestige", "other"];

function renderAchFilterBar() {
  const bar = document.getElementById("ach-filter-bar");
  bar.innerHTML = "";
  ACH_CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "ach-filter-btn" + (achFilter === cat ? " active" : "");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.addEventListener("click", () => { achFilter = cat; renderAchFilterBar(); renderAchievements(); });
    bar.appendChild(btn);
  });
}

function renderAchievements() {
  const list = document.getElementById("achievements-list");
  list.innerHTML = "";
  const filtered = achFilter === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === achFilter);
  filtered.forEach(ach => {
    const done = achievementsDone.has(ach.id);
    let progress = 0;
    switch (ach.type) {
      case "clicks":      progress = Math.min(totalClicks / ach.target, 1); break;
      case "boxes":       progress = Math.min(totalBoxes  / ach.target, 1); break;
      case "ultraBoxes":  progress = Math.min(totalUltraBoxes  / ach.target, 1); break;
      case "cosmicBoxes": progress = Math.min(totalCosmicBoxes / ach.target, 1); break;
      case "unique":      progress = Math.min(Object.keys(collection).filter(n => !collection[n].food.isCrafted).length / ach.target, 1); break;
      case "rarity":      progress = rarityFound.has(ach.target) ? 1 : 0; break;
      case "streak":      progress = Math.min(loginStreak / ach.target, 1); break;
      case "sellTotal":   progress = Math.min(totalSellEarned / ach.target, 1); break;
      case "crafted":     progress = Math.min(craftedSet.size / ach.target, 1); break;
      case "prestige":    progress = Math.min(prestigeCount / ach.target, 1); break;
    }
    const pct = Math.round(progress * 100);
    const card = document.createElement("div");
    card.className = "ach-card" + (done ? " unlocked" : "");
    card.innerHTML = `
      <div class="ach-icon ${done ? "" : "locked"}">${ach.icon}</div>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
        ${!done ? `<div class="ach-progress-wrap">
          <div class="ach-progress-bar"><div class="ach-progress-fill ${pct>=100?"done":""}" style="width:${pct}%"></div></div>
          <div class="ach-pct">${pct}%</div>
        </div>` : ""}
      </div>
      <div class="ach-reward">+${ach.reward} 🪙</div>
    `;
    list.appendChild(card);
  });
}

// ── RENDER: COLLECTION (with search) ──────────────────
function renderCollection() {
  collList.innerHTML = "";
  const order = ["crafted","mythic","legendary","epic","rare","uncommon","common"];
  let sorted = Object.values(collection).sort((a, b) =>
    order.indexOf(a.food.rarity) - order.indexOf(b.food.rarity)
  );
  // FIX: search filter applied correctly
  if (collSearchQuery) {
    sorted = sorted.filter(({ food }) =>
      food.name.toLowerCase().includes(collSearchQuery) ||
      food.rarity.toLowerCase().includes(collSearchQuery)
    );
  }
  if (sorted.length === 0) {
    collList.innerHTML = `<p class="empty-msg">${collSearchQuery ? "No results found." : "Open boxes to discover foods!"}</p>`;
    return;
  }
  sorted.forEach(({ food, count }) => {
    const item = document.createElement("div");
    item.className = "coll-item" + (food.isCrafted ? " crafted-item" : "");
    const hasDupe = count > 1;
    const colorClass = food.isCrafted ? "rarity-color-crafted" : "rarity-color-" + food.rarity;
    const dotClass   = food.isCrafted ? "dot-crafted" : "dot-" + food.rarity;
    item.innerHTML = `
      <div class="rarity-dot ${dotClass}"></div>
      <span class="coll-icon">${food.icon}</span>
      <span class="coll-name ${colorClass}">${food.name}</span>
      <span class="coll-count">×${count}</span>
      ${hasDupe ? `<button class="coll-sell-btn">Sell (${count-1}) +${(count-1)*food.sellValue}🪙</button>` : ""}
    `;
    if (hasDupe) item.querySelector(".coll-sell-btn").addEventListener("click", () => sellDupe(food.name));
    collList.appendChild(item);
  });
}

// ── TABS ───────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "achievements") { renderAchFilterBar(); renderAchievements(); }
    if (btn.dataset.tab === "upgrades")     renderUpgrades();
    if (btn.dataset.tab === "recipes")      renderRecipes();
  });
});

// ── INIT ───────────────────────────────────────────────
checkDailyBonus();
renderBoxButtons();
renderUpgrades();
renderRecipes();
renderCollection();
renderAchFilterBar();
renderAchievements();
updateCpsBadge();
updatePrestigeUI();