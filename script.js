// ════════════════════════════════════════════════════════
//  Food Fortune — v0.2.0  SUMMER UPDATE
//  NEW BASE GAME:
//    ✅ 6 new base foods (30 total)
//    ✅ New upgrade tier: Food Court (+300/s)
//    ✅ 2 new recipes (8 total)
//    ✅ Statistics / profile page (📊 button)
//  NEW SUMMER EVENT (2-week limited):
//    ✅ 14 exclusive summer foods (3 summer rarities)
//    ✅ 2 summer event boxes (cost Waves 🌊)
//    ✅ Summer UI theme (banner, colors, animated timer)
//    ✅ 14-day summer daily login calendar
//    ✅ 8 summer achievement badges
//  CARRIED FROM v0.1.3:
//    ✅ All patch fixes (search, filter, dark mode, etc.)
//    ✅ Ultra & Cosmic boxes
//    ✅ Prestige system, Recipes, Sound engine
// ════════════════════════════════════════════════════════

// ── SOUND ENGINE ──────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null, soundEnabled = true;

function getCtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx(), now = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const multi = (o, g, freq1, freq2, vol, dur, wave = "sine") => {
      o.type = wave;
      o.frequency.setValueAtTime(freq1, now);
      o.frequency.exponentialRampToValueAtTime(freq2, now + dur * 0.6);
      g.gain.setValueAtTime(vol, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.start(now); o.stop(now + dur);
    };
    switch (type) {
      case "click":       multi(osc, gain, 600, 800, 0.15, 0.1); break;
      case "box":         multi(osc, gain, 400, 900, 0.2, 0.25, "triangle"); break;
      case "rare":        multi(osc, gain, 500, 1200, 0.25, 0.4); break;
      case "sell":        multi(osc, gain, 300, 500, 0.08, 0.12, "square"); break;
      case "craft":       multi(osc, gain, 350, 1000, 0.18, 0.3); break;
      case "wave":        multi(osc, gain, 700, 1100, 0.12, 0.15); break;
      case "legendary":
        [0, 0.1, 0.2].forEach((d, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination); o2.type = "sine";
          o2.frequency.setValueAtTime(600 + i*200, now+d); o2.frequency.exponentialRampToValueAtTime(1400 + i*100, now+d+0.25);
          g2.gain.setValueAtTime(0.2, now+d); g2.gain.exponentialRampToValueAtTime(0.001, now+d+0.3);
          o2.start(now+d); o2.stop(now+d+0.3);
        }); return;
      case "achievement":
        [0, 0.12, 0.24].forEach((d, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination); o2.type = "triangle";
          o2.frequency.setValueAtTime(700 + i*150, now+d);
          g2.gain.setValueAtTime(0.15, now+d); g2.gain.exponentialRampToValueAtTime(0.001, now+d+0.18);
          o2.start(now+d); o2.stop(now+d+0.18);
        }); return;
      case "prestige":
        [0, 0.1, 0.2, 0.3, 0.4].forEach((d, i) => {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.connect(g2); g2.connect(ctx.destination); o2.type = "sine";
          o2.frequency.setValueAtTime(400 + i*180, now+d); o2.frequency.exponentialRampToValueAtTime(1600 + i*80, now+d+0.35);
          g2.gain.setValueAtTime(0.2, now+d); g2.gain.exponentialRampToValueAtTime(0.001, now+d+0.4);
          o2.start(now+d); o2.stop(now+d+0.4);
        }); return;
    }
  } catch (e) {}
}

// ── BASE FOODS — 30 total (6 new in v0.2.0) ───────────
const FOODS = [
  // COMMON (5)
  { name: "White Rice",       icon: "🍚", rarity: "common",    desc: "A humble staple. Not exciting, but reliable.",          sellValue: 1   },
  { name: "Plain Bread",      icon: "🍞", rarity: "common",    desc: "Just bread. Basic. You can do this.",                    sellValue: 1   },
  { name: "Boiled Egg",       icon: "🥚", rarity: "common",    desc: "Protein, that's about it.",                             sellValue: 1   },
  { name: "Carrot Sticks",    icon: "🥕", rarity: "common",    desc: "Crunchy and orange. Very common.",                      sellValue: 1   },
  { name: "Crackers",         icon: "🫙", rarity: "common",    desc: "The snack of mild disappointment.",                     sellValue: 1   },
  // UNCOMMON (6, +1 new: Cheese Platter)
  { name: "Ramen Bowl",       icon: "🍜", rarity: "uncommon",  desc: "Steaming noodles with a rich broth!",                   sellValue: 5   },
  { name: "Grilled Corn",     icon: "🌽", rarity: "uncommon",  desc: "Charred sweetness from the grill.",                     sellValue: 5   },
  { name: "Avocado Toast",    icon: "🥑", rarity: "uncommon",  desc: "A brunch classic. Somewhat trendy.",                    sellValue: 5   },
  { name: "Taco",             icon: "🌮", rarity: "uncommon",  desc: "Crunchy shell, tasty fillings.",                        sellValue: 5   },
  { name: "Pancakes",         icon: "🥞", rarity: "uncommon",  desc: "Fluffy stacked goodness.",                              sellValue: 5   },
  { name: "Cheese Platter",   icon: "🧀", rarity: "uncommon",  desc: "An assortment of fine aged cheeses. New in v0.2.0!",    sellValue: 8   }, // NEW
  // RARE (6, +2 new: Paella, Pho)
  { name: "Sushi Platter",    icon: "🍣", rarity: "rare",      desc: "Fresh nigiri and rolls, beautifully arranged.",         sellValue: 20  },
  { name: "Beef Steak",       icon: "🥩", rarity: "rare",      desc: "A perfectly seared cut. Medium-rare, of course.",       sellValue: 20  },
  { name: "Lobster Bisque",   icon: "🦞", rarity: "rare",      desc: "Rich, creamy, and deeply indulgent.",                   sellValue: 20  },
  { name: "Truffle Pasta",    icon: "🍝", rarity: "rare",      desc: "Earthy truffles tossed with silky pasta.",              sellValue: 20  },
  { name: "Wagyu Burger",     icon: "🍔", rarity: "rare",      desc: "Premium beef, perfectly seasoned.",                     sellValue: 20  },
  { name: "Paella",           icon: "🥘", rarity: "rare",      desc: "Saffron rice with seafood, chicken and chorizo. New!",  sellValue: 28  }, // NEW
  { name: "Pho",              icon: "🍲", rarity: "rare",      desc: "Vietnamese rice noodle soup with tender beef. New!",    sellValue: 25  }, // NEW
  // EPIC (5, +1 new: Omakase)
  { name: "Dragon Ramen",     icon: "🐉", rarity: "epic",      desc: "Legendary broth simmered for 72 hours.",                sellValue: 75  },
  { name: "Golden Cake",      icon: "🎂", rarity: "epic",      desc: "Encrusted with edible gold leaf.",                      sellValue: 75  },
  { name: "Kobe Teppanyaki",  icon: "🔥", rarity: "epic",      desc: "Finest Kobe beef, teppanyaki style.",                   sellValue: 75  },
  { name: "Black Truffle",    icon: "🍄", rarity: "epic",      desc: "Rare fungal treasure from Périgord.",                   sellValue: 75  },
  { name: "Omakase Set",      icon: "🎌", rarity: "epic",      desc: "Chef's selection sushi — every piece a masterpiece. New!", sellValue: 100 }, // NEW
  // LEGENDARY (4, +1 new: Unicorn Cake)
  { name: "Ambrosia Bowl",    icon: "🌟", rarity: "legendary", desc: "Food of the gods. Literally divine.",                   sellValue: 250 },
  { name: "Phoenix Wings",    icon: "🦅", rarity: "legendary", desc: "Spicy wings that burst into flame. Handle with care.",  sellValue: 250 },
  { name: "Crystal Sashimi",  icon: "💎", rarity: "legendary", desc: "Perfectly sliced, jewel-like tuna.",                    sellValue: 250 },
  { name: "Unicorn Cake",     icon: "🦄", rarity: "legendary", desc: "Shimmering cake that exists in no recipe book. New!",   sellValue: 320 }, // NEW
  // MYTHIC (2)
  { name: "Celestial Ramen",  icon: "✨", rarity: "mythic",    desc: "A bowl from another dimension. Indescribable taste.",   sellValue: 1000 },
  { name: "Star Cake",        icon: "🌠", rarity: "mythic",    desc: "Baked in a supernova. Impossibly rare.",                sellValue: 1000 },
];

// ── SUMMER EXCLUSIVE FOODS (14) ───────────────────────
const SUMMER_FOODS = [
  // SUMMER (base tier)
  { name: "Mango Smoothie",   icon: "🥭", rarity: "summer",          desc: "Thick and tropical. Peak summer in a cup.",             sellValue: 80,  isSummer: true },
  { name: "Ice Cream Cone",   icon: "🍦", rarity: "summer",          desc: "Classic soft-serve on a waffle cone.",                  sellValue: 70,  isSummer: true },
  { name: "Watermelon Slice", icon: "🍉", rarity: "summer",          desc: "Cold, juicy, and 90% water. Summer perfection.",        sellValue: 60,  isSummer: true },
  { name: "BBQ Ribs",         icon: "🍖", rarity: "summer",          desc: "Slow-smoked over charcoal until fall-off-the-bone.",    sellValue: 90,  isSummer: true },
  { name: "Corn on the Cob",  icon: "🌽", rarity: "summer",          desc: "Buttered and grilled at a beach bonfire.",              sellValue: 55,  isSummer: true },
  { name: "Popsicle",         icon: "🧊", rarity: "summer",          desc: "Cherry-flavored and ice-cold. Essential summer snack.", sellValue: 50,  isSummer: true },
  // SUMMER RARE
  { name: "Lobster Roll",     icon: "🦞", rarity: "summer-rare",     desc: "New England classic — chunks of claw meat in butter.",  sellValue: 280, isSummer: true },
  { name: "Tropical Parfait", icon: "🍍", rarity: "summer-rare",     desc: "Layered tropical fruits with coconut cream.",           sellValue: 250, isSummer: true },
  { name: "Grilled Swordfish",icon: "🐟", rarity: "summer-rare",     desc: "Fresh catch from the sea, chargrilled with lemon.",     sellValue: 300, isSummer: true },
  { name: "Beach Paella",     icon: "🏖️", rarity: "summer-rare",    desc: "Paella cooked on open flame at the shoreline.",         sellValue: 320, isSummer: true },
  // SUMMER LEGENDARY
  { name: "Solar Sundae",     icon: "☀️", rarity: "summer-legendary", desc: "A sundae made with frozen sunlight. Impossibly bright.", sellValue: 1500, isSummer: true },
  { name: "Ocean Treasure",   icon: "🌊", rarity: "summer-legendary", desc: "A legendary platter from the deep blue. Mythical.",    sellValue: 1800, isSummer: true },
  { name: "Sunset Feast",     icon: "🌅", rarity: "summer-legendary", desc: "A lavish spread eaten as the sun sets over the ocean.", sellValue: 2000, isSummer: true },
  { name: "Island King Platter", icon: "🏝️", rarity: "summer-legendary", desc: "The ultimate island royale. Found only once a summer.", sellValue: 2500, isSummer: true },
];

// ── RARITIES ───────────────────────────────────────────
const RARITIES = {
  common:             { label: "COMMON"           },
  uncommon:           { label: "UNCOMMON"         },
  rare:               { label: "RARE"             },
  epic:               { label: "EPIC"             },
  legendary:          { label: "LEGENDARY"        },
  mythic:             { label: "MYTHIC"           },
  crafted:            { label: "CRAFTED"          },
  "summer":           { label: "SUMMER"           },
  "summer-rare":      { label: "SUMMER RARE"      },
  "summer-legendary": { label: "SUMMER LEGENDARY" },
};

// ── STANDARD BOXES ────────────────────────────────────
const BOXES = [
  { name:"Snack Box",   icon:"📦", price:8,    btnClass:"b0", desc:"Basic luck. Common finds likely.",               odds:"Common 60% · Uncommon 28% · Rare 9%",        weights:{common:60,uncommon:28,rare:9,epic:2.5,legendary:0.4,mythic:0.1} },
  { name:"Gourmet Box", icon:"🎁", price:40,   btnClass:"b1", desc:"Better odds — Rare foods await!",               odds:"Rare 22% · Epic 9% · Legendary 3%",          weights:{common:30,uncommon:35,rare:22,epic:9,legendary:3,mythic:1} },
  { name:"Legend Box",  icon:"👑", price:200,  btnClass:"b2", desc:"Extreme luck. Mythic possible!",                odds:"Epic 22% · Legendary 12% · Mythic 6%",       weights:{common:10,uncommon:20,rare:30,epic:22,legendary:12,mythic:6} },
  { name:"Ultra Box",   icon:"💜", price:600,  btnClass:"b3", desc:"Guaranteed Epic or higher.",                    odds:"Epic 45% · Legendary 35% · Mythic 20%",      weights:{common:0,uncommon:0,rare:0,epic:45,legendary:35,mythic:20}, cardClass:"ultra-card" },
  { name:"Cosmic Box",  icon:"🌌", price:2000, btnClass:"b4", desc:"Only Legendary & Mythic. The ultimate box.",   odds:"Legendary 60% · Mythic 40%",                 weights:{common:0,uncommon:0,rare:0,epic:0,legendary:60,mythic:40}, cardClass:"cosmic-card" },
];

// ── SUMMER BOXES ──────────────────────────────────────
const SUMMER_BOXES = [
  { name:"Beach Box",   icon:"🏖️", price:20, desc:"Common summer foods. Great to start!",      odds:"Summer 75% · Summer Rare 20% · Summer Legendary 5%",  weights:{"summer":75,"summer-rare":20,"summer-legendary":5} },
  { name:"Tidal Chest", icon:"🌊", price:55, desc:"Premium waves — Rare & Legendary summer foods!", odds:"Summer Rare 50% · Summer Legendary 50%",            weights:{"summer":0,"summer-rare":50,"summer-legendary":50} },
];

// ── SUMMER DAILY REWARDS (14 days) ────────────────────
const SUMMER_DAILY_REWARDS = [
  { day:1,  icon:"🌊", reward:10,  label:"10 🌊" },
  { day:2,  icon:"🌊", reward:15,  label:"15 🌊" },
  { day:3,  icon:"🍦", reward:20,  label:"20 🌊" },
  { day:4,  icon:"🌊", reward:15,  label:"15 🌊" },
  { day:5,  icon:"☀️", reward:30,  label:"30 🌊" },
  { day:6,  icon:"🌊", reward:20,  label:"20 🌊" },
  { day:7,  icon:"🏖️", reward:50, label:"50 🌊" },
  { day:8,  icon:"🌊", reward:20,  label:"20 🌊" },
  { day:9,  icon:"🍦", reward:25,  label:"25 🌊" },
  { day:10, icon:"🌊", reward:25,  label:"25 🌊" },
  { day:11, icon:"☀️", reward:40,  label:"40 🌊" },
  { day:12, icon:"🌊", reward:30,  label:"30 🌊" },
  { day:13, icon:"🌅", reward:60,  label:"60 🌊" },
  { day:14, icon:"🏝️", reward:150, label:"150 🌊" },
];

// ── UPGRADES — new Food Court tier ────────────────────
const UPGRADES = [
  { id:"snack_imp",   icon:"🍪", name:"Cookie Jar",   desc:"+1 coin/s automatically.",    baseCps:1,   baseCost:50,    costScale:1.6, maxLevel:10 },
  { id:"pizza_oven",  icon:"🍕", name:"Pizza Oven",   desc:"+5 coins/s.",                 baseCps:5,   baseCost:200,   costScale:1.7, maxLevel:10 },
  { id:"sushi_bar",   icon:"🍣", name:"Sushi Bar",    desc:"+20 coins/s.",                baseCps:20,  baseCost:800,   costScale:1.8, maxLevel:10 },
  { id:"ramen_shop",  icon:"🍜", name:"Ramen Shop",   desc:"+80 coins/s.",                baseCps:80,  baseCost:3000,  costScale:1.9, maxLevel:10 },
  { id:"food_court",  icon:"🏬", name:"Food Court",   desc:"+300 coins/s. The big one.",  baseCps:300, baseCost:15000, costScale:2.0, maxLevel:10 }, // NEW
];

// ── RECIPES — 8 total (2 new in v0.2.0) ───────────────
const RECIPES = [
  { id:"breakfast_royale", name:"Breakfast Royale",    icon:"🍳", desc:"The ultimate breakfast — eggs, bread and pancakes.",    ingredients:[{name:"Boiled Egg",qty:2},{name:"Plain Bread",qty:1},{name:"Pancakes",qty:1}], sellValue:30   },
  { id:"surf_and_turf",    name:"Surf & Turf",         icon:"🍽️", desc:"Premium steak and fresh seafood on one plate.",          ingredients:[{name:"Beef Steak",qty:1},{name:"Sushi Platter",qty:1}], sellValue:120  },
  { id:"truffle_ramen",    name:"Truffle Ramen",       icon:"🫕", desc:"Silky ramen broth elevated with shaved black truffle.",  ingredients:[{name:"Ramen Bowl",qty:2},{name:"Black Truffle",qty:1}], sellValue:200  },
  { id:"golden_feast",     name:"Golden Feast",        icon:"🌅", desc:"Wagyu, truffle pasta and golden cake. Pure decadence.",  ingredients:[{name:"Wagyu Burger",qty:1},{name:"Truffle Pasta",qty:1},{name:"Golden Cake",qty:1}], sellValue:500 },
  { id:"dragon_sushi",     name:"Dragon Sushi Roll",   icon:"🐉", desc:"Dragon Ramen broth poured over premium sushi.",         ingredients:[{name:"Dragon Ramen",qty:1},{name:"Sushi Platter",qty:2}], sellValue:450  },
  { id:"cosmic_platter",   name:"Cosmic Platter",      icon:"🌌", desc:"Celestial Ramen meets Star Cake — transcends dimensions.", ingredients:[{name:"Celestial Ramen",qty:1},{name:"Star Cake",qty:1},{name:"Ambrosia Bowl",qty:1}], sellValue:5000 },
  // NEW v0.2.0
  { id:"summer_bbq",       name:"Summer BBQ Spread",   icon:"🔥", desc:"BBQ Ribs paired with Corn and Watermelon. Peak summer!", ingredients:[{name:"BBQ Ribs",qty:1},{name:"Watermelon Slice",qty:1},{name:"Corn on the Cob",qty:1}], sellValue:380 },
  { id:"island_dessert",   name:"Island Dessert Trio", icon:"🏝️", desc:"Mango Smoothie, Popsicle and Ice Cream Cone all at once.", ingredients:[{name:"Mango Smoothie",qty:1},{name:"Popsicle",qty:1},{name:"Ice Cream Cone",qty:1}], sellValue:300 },
];
RECIPES.forEach(r => {
  r.food = { name:r.name, icon:r.icon, rarity:"crafted", desc:r.desc, sellValue:r.sellValue, isCrafted:true };
});

// ── PRESTIGE ──────────────────────────────────────────
const PRESTIGE_THRESHOLD = 10000;
const PRESTIGE_MULTIPLIERS = [1.0, 1.5, 2.0, 2.75, 3.5, 5.0, 7.0, 10.0];

// ── SUMMER EVENT CONFIG ───────────────────────────────
const SUMMER_EVENT_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// ── ACHIEVEMENTS ──────────────────────────────────────
const ACHIEVEMENTS = [
  { id:"first_click",      icon:"👆", name:"First Touch",        desc:"Click the coin once.",                  cat:"clicks",     type:"clicks",         target:1,            reward:5,    isSummer:false },
  { id:"click_100",        icon:"💪", name:"Finger Workout",     desc:"Click 100 times.",                      cat:"clicks",     type:"clicks",         target:100,          reward:50,   isSummer:false },
  { id:"click_1000",       icon:"🖱️", name:"Click Monster",      desc:"Click 1,000 times.",                    cat:"clicks",     type:"clicks",         target:1000,         reward:200,  isSummer:false },
  { id:"click_10000",      icon:"⚡", name:"Turbo Clicker",      desc:"Click 10,000 times.",                   cat:"clicks",     type:"clicks",         target:10000,        reward:800,  isSummer:false },
  { id:"first_box",        icon:"🎁", name:"Unboxed!",           desc:"Open your first box.",                  cat:"boxes",      type:"boxes",          target:1,            reward:10,   isSummer:false },
  { id:"box_25",           icon:"📦", name:"Box Hoarder",        desc:"Open 25 boxes.",                        cat:"boxes",      type:"boxes",          target:25,           reward:100,  isSummer:false },
  { id:"box_100",          icon:"🏪", name:"Box Magnate",        desc:"Open 100 boxes.",                       cat:"boxes",      type:"boxes",          target:100,          reward:500,  isSummer:false },
  { id:"box_500",          icon:"🏭", name:"Box Factory",        desc:"Open 500 boxes.",                       cat:"boxes",      type:"boxes",          target:500,          reward:2000, isSummer:false },
  { id:"ultra_first",      icon:"💜", name:"Going Ultra",        desc:"Open your first Ultra Box.",            cat:"boxes",      type:"ultraBoxes",     target:1,            reward:200,  isSummer:false },
  { id:"cosmic_first",     icon:"🌌", name:"Cosmic Taste",       desc:"Open your first Cosmic Box.",           cat:"boxes",      type:"cosmicBoxes",    target:1,            reward:800,  isSummer:false },
  { id:"foods_5",          icon:"🥗", name:"Foodie",             desc:"Collect 5 unique foods.",               cat:"collection", type:"unique",         target:5,            reward:30,   isSummer:false },
  { id:"foods_15",         icon:"🍽️", name:"Gourmet",            desc:"Collect 15 unique foods.",              cat:"collection", type:"unique",         target:15,           reward:150,  isSummer:false },
  { id:"foods_all",        icon:"👨‍🍳", name:"Master Chef",        desc:"Collect all 30 unique foods.",          cat:"collection", type:"unique",         target:30,           reward:3000, isSummer:false },
  { id:"rare_find",        icon:"🔵", name:"Rare Find",          desc:"Obtain a Rare food.",                   cat:"collection", type:"rarity",         target:"rare",       reward:40,   isSummer:false },
  { id:"epic_find",        icon:"🟣", name:"Epic Taste",         desc:"Obtain an Epic food.",                  cat:"collection", type:"rarity",         target:"epic",       reward:100,  isSummer:false },
  { id:"legend_find",      icon:"🟠", name:"Legendary Feast",    desc:"Obtain a Legendary food.",              cat:"collection", type:"rarity",         target:"legendary",  reward:300,  isSummer:false },
  { id:"mythic_find",      icon:"🩷", name:"Mythic Bite",        desc:"Obtain a Mythic food.",                 cat:"collection", type:"rarity",         target:"mythic",     reward:1000, isSummer:false },
  { id:"streak_3",         icon:"🔥", name:"On a Roll",          desc:"Log in 3 days in a row.",               cat:"other",      type:"streak",         target:3,            reward:75,   isSummer:false },
  { id:"streak_7",         icon:"🌟", name:"Weekly Warrior",     desc:"Maintain a 7-day streak.",              cat:"other",      type:"streak",         target:7,            reward:500,  isSummer:false },
  { id:"sold_100",         icon:"💸", name:"Market Flip",        desc:"Earn 100 coins by selling.",            cat:"other",      type:"sellTotal",      target:100,          reward:50,   isSummer:false },
  { id:"sold_5000",        icon:"💰", name:"Food Trader",        desc:"Earn 5,000 coins by selling.",          cat:"other",      type:"sellTotal",      target:5000,         reward:500,  isSummer:false },
  { id:"first_craft",      icon:"🍳", name:"Chef's Kiss",        desc:"Craft your first recipe.",              cat:"recipes",    type:"crafted",        target:1,            reward:60,   isSummer:false },
  { id:"all_recipes",      icon:"📖", name:"Recipe Master",      desc:"Craft all 8 recipes.",                  cat:"recipes",    type:"crafted",        target:8,            reward:2000, isSummer:false },
  { id:"prestige_1",       icon:"⭐", name:"Transcended",        desc:"Prestige for the first time.",          cat:"prestige",   type:"prestige",       target:1,            reward:500,  isSummer:false },
  { id:"prestige_3",       icon:"🌠", name:"Legend Reborn",      desc:"Prestige 3 times.",                     cat:"prestige",   type:"prestige",       target:3,            reward:2000, isSummer:false },
  { id:"prestige_5",       icon:"👑", name:"Eternal Foodie",     desc:"Prestige 5 times.",                     cat:"prestige",   type:"prestige",       target:5,            reward:8000, isSummer:false },
  // SUMMER ACHIEVEMENTS
  { id:"summer_first_box", icon:"🏖️", name:"Beach Day!",         desc:"Open your first Summer box.",           cat:"summer",     type:"summerBoxes",    target:1,            reward:20,   isSummer:true, rewardType:"waves" },
  { id:"summer_box_10",    icon:"🌊", name:"Wave Rider",         desc:"Open 10 Summer boxes.",                 cat:"summer",     type:"summerBoxes",    target:10,           reward:60,   isSummer:true, rewardType:"waves" },
  { id:"summer_box_30",    icon:"🏄", name:"Surf's Up",          desc:"Open 30 Summer boxes.",                 cat:"summer",     type:"summerBoxes",    target:30,           reward:150,  isSummer:true, rewardType:"waves" },
  { id:"summer_food_1",    icon:"🍦", name:"Summer Taste",       desc:"Collect your first Summer food.",       cat:"summer",     type:"summerFoods",    target:1,            reward:15,   isSummer:true, rewardType:"waves" },
  { id:"summer_food_7",    icon:"🌺", name:"Summer Collector",   desc:"Collect 7 different Summer foods.",     cat:"summer",     type:"summerFoods",    target:7,            reward:80,   isSummer:true, rewardType:"waves" },
  { id:"summer_food_all",  icon:"🏝️", name:"Island Master",      desc:"Collect all 14 Summer exclusive foods.", cat:"summer",   type:"summerFoods",    target:14,           reward:400,  isSummer:true, rewardType:"waves" },
  { id:"summer_legend",    icon:"☀️", name:"Solar Legend",       desc:"Obtain a Summer Legendary food.",       cat:"summer",     type:"rarity",         target:"summer-legendary", reward:200, isSummer:true, rewardType:"waves" },
  { id:"summer_daily_14",  icon:"🌅", name:"14 Days of Summer",  desc:"Claim all 14 Summer daily splashes.",   cat:"summer",     type:"summerDays",     target:14,           reward:300,  isSummer:true, rewardType:"waves" },
];

// ── STATE ──────────────────────────────────────────────
let money            = 0;
let waves            = 0;
let totalClicks      = 0;
let totalBoxes       = 0;
let totalUltraBoxes  = 0;
let totalCosmicBoxes = 0;
let totalSummerBoxes = 0;
let collection       = {};
let upgradeLevels    = {};
let achievementsDone = new Set();
let totalSellEarned  = 0;
let loginStreak      = 0;
let rarityFound      = new Set();
let prestigeCount    = 0;
let craftedSet       = new Set();
let showFloaters     = true;
let achFilter        = "all";
let collSearchQuery  = "";
let accumulatedCoins = 0;
let summerFoodsFound = new Set();
let summerDaysClaimed = [];
let summerEventStart = null; // set from localStorage

// ── DOM REFS ───────────────────────────────────────────
const moneyEl         = document.getElementById("money-display");
const clicksEl        = document.getElementById("stat-clicks");
const boxesEl         = document.getElementById("stat-boxes");
const foodsEl         = document.getElementById("stat-foods");
const streakEl        = document.getElementById("stat-streak");
const wavesEl         = document.getElementById("stat-waves");
const summerCurrEl    = document.getElementById("summer-currency");
const collList        = document.getElementById("collection-list");
const coinBtn         = document.getElementById("coin-btn");
const coinLabel       = document.getElementById("coin-label");
const overlay         = document.getElementById("modal-overlay");
const resultModal     = document.getElementById("result-modal");
const modalIcon       = document.getElementById("modal-icon");
const modalRar        = document.getElementById("modal-rarity");
const modalName       = document.getElementById("modal-name");
const modalDesc       = document.getElementById("modal-desc");
const modalSummerBadge= document.getElementById("modal-summer-badge");
const modalCraftBadge = document.getElementById("modal-crafted-badge");
const modalSellHint   = document.getElementById("modal-sell-hint");
const modalClose      = document.getElementById("modal-close");
const cpsBadge        = document.getElementById("cps-badge");
const cpsVal          = document.getElementById("cps-val");
const sellAllBtn      = document.getElementById("sell-all-btn");
const achToast        = document.getElementById("achievement-toast");
const toastIcon       = document.getElementById("toast-icon");
const toastLabel      = document.getElementById("toast-label");
const toastName       = document.getElementById("toast-name");
const dailyBanner     = document.getElementById("daily-banner");
const dailyTitle      = document.getElementById("daily-title");
const dailySub        = document.getElementById("daily-sub");
const dailyClaim      = document.getElementById("daily-claim-btn");
const soundBtn        = document.getElementById("sound-btn");
const settingsBtn     = document.getElementById("settings-btn");
const statsBtn        = document.getElementById("stats-btn");
const settingsOverlay = document.getElementById("settings-overlay");
const settingsClose   = document.getElementById("settings-close-btn");
const settingsReset   = document.getElementById("settings-reset-btn");
const soundToggle     = document.getElementById("sound-toggle");
const floaterToggle   = document.getElementById("floater-toggle");
const darkmodeToggle  = document.getElementById("darkmode-toggle");
const summerBannerToggle = document.getElementById("summer-banner-toggle");
const prestigeOverlay = document.getElementById("prestige-overlay");
const prestigeBanner  = document.getElementById("prestige-banner");
const prestigeBanBtn  = document.getElementById("prestige-banner-btn");
const prestigeConfirm = document.getElementById("prestige-confirm-btn");
const prestigeCancel  = document.getElementById("prestige-cancel-btn");
const prestigeBadge   = document.getElementById("prestige-badge");
const prestigeMultD   = document.getElementById("prestige-mult-display");
const prestigeMultP   = document.getElementById("prestige-mult-preview");
const prestigeChip    = document.getElementById("prestige-chip");
const statPrestige    = document.getElementById("stat-prestige");
const prestigeRwdPrev = document.getElementById("prestige-rewards-preview");
const collSearch      = document.getElementById("coll-search");
const statsOverlay    = document.getElementById("stats-overlay");
const statsGrid       = document.getElementById("stats-grid");
const statsClose      = document.getElementById("stats-close-btn");
const summerClaimBtn  = document.getElementById("summer-claim-btn");
const summerDaysRow   = document.getElementById("summer-days-row");
const summerTimerDisp = document.getElementById("summer-timer-display");
const summerTimerBar  = document.getElementById("summer-timer-bar");
const summerDaysLeft  = document.getElementById("summer-days-left");

// ── HELPERS ────────────────────────────────────────────
function getPrestigeMult()     { return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount, PRESTIGE_MULTIPLIERS.length-1)]; }
function getNextPrestigeMult() { return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount+1, PRESTIGE_MULTIPLIERS.length-1)]; }

function updateMoney() { moneyEl.textContent = money.toLocaleString(); }
function updateWaves() {
  waves = Math.max(0, waves);
  wavesEl.textContent = waves.toLocaleString();
  summerCurrEl.textContent = waves.toLocaleString();
}

function updateStats() {
  clicksEl.textContent = totalClicks.toLocaleString();
  boxesEl.textContent  = totalBoxes.toLocaleString();
  foodsEl.textContent  = Object.values(collection).reduce((s,v)=>s+v.count,0).toLocaleString();
  streakEl.textContent = loginStreak;
  updateWaves();
  updatePrestigeUI();
}

function updatePrestigeUI() {
  const mult = getPrestigeMult();
  if (prestigeCount > 0) {
    prestigeBadge.style.display = "inline-flex";
    prestigeMultD.textContent   = mult.toFixed(1);
    prestigeChip.style.display  = "inline-flex";
    statPrestige.textContent    = prestigeCount;
    coinLabel.textContent = `Click to earn ${mult.toFixed(1)}× coins!`;
  } else {
    coinLabel.textContent = "Click to earn coins!";
  }
  const eligible = money >= PRESTIGE_THRESHOLD && prestigeCount < PRESTIGE_MULTIPLIERS.length-1;
  prestigeBanner.style.display = eligible ? "flex" : "none";
  if (eligible && prestigeMultP) prestigeMultP.textContent = "×" + getNextPrestigeMult().toFixed(1);
}

function spawnFloater(x, y, amount, color) {
  if (!showFloaters) return;
  const el = document.createElement("div");
  el.className = "floater";
  el.textContent = `+${amount}`;
  if (color) el.style.color = color;
  el.style.left = (x-20)+"px";
  el.style.top  = (y-30)+"px";
  document.body.appendChild(el);
  el.addEventListener("animationend", ()=>el.remove());
}

function getTotalCps() {
  const base = UPGRADES.reduce((s,u)=>s+u.baseCps*(upgradeLevels[u.id]||0),0);
  return Math.floor(base * getPrestigeMult());
}

function getUpgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(upg.costScale, upgradeLevels[upg.id]||0));
}

function updateCpsBadge() {
  const cps = getTotalCps();
  cpsBadge.style.display = cps > 0 ? "inline-flex" : "none";
  cpsVal.textContent = cps.toLocaleString();
}

// ── SUMMER EVENT TIMER ────────────────────────────────
function initSummerEvent() {
  let start = localStorage.getItem("ff_summerStart");
  if (!start) {
    start = Date.now().toString();
    localStorage.setItem("ff_summerStart", start);
  }
  summerEventStart = parseInt(start);
  const stored = localStorage.getItem("ff_summerDays");
  summerDaysClaimed = stored ? JSON.parse(stored) : [];
  renderSummerDaysRow();
  updateSummerTimer();
  setInterval(updateSummerTimer, 1000);

  const todayClaimed = localStorage.getItem("ff_summerDayClaimedDate") === new Date().toDateString();
  summerClaimBtn.disabled = todayClaimed || summerDaysClaimed.length >= 14;
  if (summerDaysClaimed.length >= 14) summerClaimBtn.textContent = "All 14 Days Claimed! 🌊";
  if (todayClaimed && summerDaysClaimed.length < 14) summerClaimBtn.textContent = "Come back tomorrow 🌊";
}

function updateSummerTimer() {
  const elapsed = Date.now() - summerEventStart;
  const remaining = Math.max(0, SUMMER_EVENT_DURATION_MS - elapsed);
  const progress = Math.max(0, 1 - elapsed / SUMMER_EVENT_DURATION_MS);
  const daysLeft = Math.ceil(remaining / 86400000);

  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  summerTimerDisp.textContent = `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  summerTimerBar.style.width = (progress * 100) + "%";
  if (summerDaysLeft) summerDaysLeft.textContent = daysLeft;
}

function renderSummerDaysRow() {
  summerDaysRow.innerHTML = "";
  SUMMER_DAILY_REWARDS.forEach(day => {
    const claimed = summerDaysClaimed.includes(day.day);
    const isNext  = summerDaysClaimed.length + 1 === day.day;
    const chip = document.createElement("div");
    chip.className = "summer-day-chip" + (claimed ? " claimed" : isNext ? " today" : " future");
    chip.innerHTML = `<span class="summer-day-num">D${day.day}</span><span class="summer-day-reward">${claimed ? "✅" : day.icon}</span><span class="summer-day-check">${claimed ? "Done" : day.label}</span>`;
    summerDaysRow.appendChild(chip);
  });
}

summerClaimBtn.addEventListener("click", () => {
  const nextDay = summerDaysClaimed.length + 1;
  if (nextDay > 14) return;
  const reward = SUMMER_DAILY_REWARDS[nextDay - 1];
  waves += reward.reward;
  summerDaysClaimed.push(nextDay);
  updateWaves();
  renderSummerDaysRow();
  renderSummerBoxes();
  localStorage.setItem("ff_summerDays", JSON.stringify(summerDaysClaimed));
  localStorage.setItem("ff_summerDayClaimedDate", new Date().toDateString());
  summerClaimBtn.disabled = true;
  summerClaimBtn.textContent = nextDay >= 14 ? "All 14 Days Claimed! 🌊" : "Come back tomorrow 🌊";
  playSound("wave");
  const r = summerClaimBtn.getBoundingClientRect();
  spawnFloater(r.left + r.width/2, r.top + window.scrollY - 10, `${reward.reward} 🌊`, "#00c8ff");
  checkAchievements();
});

// ── COIN CLICK ─────────────────────────────────────────
let clickCount = 0;
coinBtn.addEventListener("click", (e) => {
  const earned = Math.max(1, Math.floor(1 * getPrestigeMult()));
  money += earned;
  totalClicks++;
  clickCount++;
  if (clickCount % 10 === 0) {
    waves++;
    updateWaves();
    spawnFloater(e.clientX - 20, e.clientY - 55, "1 🌊", "#00c8ff");
    playSound("wave");
  }
  updateMoney(); updateStats();
  playSound("click");
  coinBtn.classList.add("popping");
  setTimeout(() => coinBtn.classList.remove("popping"), 100);
  spawnFloater(e.clientX, e.clientY, earned);
  renderBoxButtons(); renderUpgrades();
  checkAchievements();
});

// ── AUTO-CLICKER ───────────────────────────────────────
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
  const total = Object.values(w).reduce((a,b)=>a+b,0);
  let rand = Math.random() * total, chosen = "common";
  for (const [r,wt] of Object.entries(w)) {
    if (wt === 0) continue;
    rand -= wt;
    if (rand <= 0) { chosen = r; break; }
  }
  const pool = FOODS.filter(f=>f.rarity===chosen);
  return pool[Math.floor(Math.random()*pool.length)];
}

function pickSummerFood(box) {
  const w = box.weights;
  const total = Object.values(w).reduce((a,b)=>a+b,0);
  let rand = Math.random() * total, chosen = "summer";
  for (const [r,wt] of Object.entries(w)) {
    if (wt === 0) continue;
    rand -= wt;
    if (rand <= 0) { chosen = r; break; }
  }
  const pool = SUMMER_FOODS.filter(f=>f.rarity===chosen);
  return pool[Math.floor(Math.random()*pool.length)];
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
  playSound(["legendary","mythic"].includes(food.rarity) ? "legendary" : ["rare","epic"].includes(food.rarity) ? "rare" : "box");
  showFoodModal(food, false, false);
  checkAchievements();
}

function openSummerBox(idx) {
  const box = SUMMER_BOXES[idx];
  if (waves < box.price) return;
  waves -= box.price;
  totalSummerBoxes++;
  updateWaves(); renderSummerBoxes();
  const food = pickSummerFood(box);
  registerFood(food);
  summerFoodsFound.add(food.name);
  rarityFound.add(food.rarity);
  playSound(food.rarity === "summer-legendary" ? "legendary" : "rare");
  showFoodModal(food, true, false);
  checkAchievements();
}

function registerFood(food) {
  if (!collection[food.name]) collection[food.name] = { food, count: 0 };
  collection[food.name].count++;
  rarityFound.add(food.rarity);
  renderCollection();
}

// ── SHOW FOOD MODAL ────────────────────────────────────
function showFoodModal(food, isSummer, isCrafted) {
  modalIcon.textContent = food.icon;
  modalRar.textContent  = RARITIES[food.rarity].label;
  const cls = isSummer ? "rarity-color-" + food.rarity.replace("-","_") + " rarity-color-summer"
             : isCrafted ? "rarity-color-crafted"
             : "rarity-color-" + food.rarity;
  modalRar.className    = "modal-rarity-label " + (isSummer ? "rarity-color-summer" : isCrafted ? "rarity-color-crafted" : "rarity-color-"+food.rarity);
  modalName.textContent = food.name;
  modalName.className   = "modal-food-name " + (isSummer ? "rarity-color-summer" : isCrafted ? "rarity-color-crafted" : "rarity-color-"+food.rarity);
  modalDesc.textContent = food.desc;
  modalSummerBadge.style.display = isSummer ? "inline-block" : "none";
  modalCraftBadge.style.display  = isCrafted ? "inline-block" : "none";
  modalSellHint.textContent = `Sell value: ${food.sellValue} 🪙`;
  if (isSummer) {
    resultModal.classList.add("summer-modal");
    modalName.classList.add("summer-shine");
    setTimeout(() => modalName.classList.remove("summer-shine"), 1700);
  } else {
    resultModal.classList.remove("summer-modal");
    if (["legendary","mythic"].includes(food.rarity) || isCrafted) {
      modalName.classList.add("shine");
      setTimeout(() => modalName.classList.remove("shine"), 1300);
    }
  }
  overlay.classList.add("show");
}

modalClose.addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("show"); });

// ── CRAFTING ───────────────────────────────────────────
function canCraft(recipe) {
  return recipe.ingredients.every(i => collection[i.name] && collection[i.name].count >= i.qty);
}

function craftRecipe(id) {
  const recipe = RECIPES.find(r=>r.id===id);
  if (!recipe || !canCraft(recipe)) return;
  recipe.ingredients.forEach(i => {
    collection[i.name].count -= i.qty;
    if (collection[i.name].count <= 0) delete collection[i.name];
  });
  registerFood(recipe.food);
  craftedSet.add(id);
  playSound("craft");
  showFoodModal(recipe.food, false, true);
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
  updateMoney(); updateCpsBadge(); renderUpgrades(); renderBoxButtons();
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
    const e = collection[name];
    if (e.count > 1) { total += (e.count-1)*e.food.sellValue; totalSellEarned += (e.count-1)*e.food.sellValue; e.count = 1; }
  });
  if (total > 0) {
    money += total; updateMoney(); renderCollection(); checkAchievements();
    playSound("sell");
    const r = sellAllBtn.getBoundingClientRect();
    spawnFloater(r.left+r.width/2, r.top+window.scrollY-10, total, "#5dde78");
  }
}
sellAllBtn.addEventListener("click", sellAllDupes);

// ── PRESTIGE ───────────────────────────────────────────
function openPrestigeModal() {
  prestigeRwdPrev.innerHTML = `Current: <strong style="color:#c87eff">×${getPrestigeMult().toFixed(1)}</strong> &nbsp;→&nbsp; After: <strong style="color:#ffe680">×${getNextPrestigeMult().toFixed(1)}</strong>`;
  prestigeOverlay.classList.add("show");
}

function doPrestige() {
  prestigeCount++;
  money=0; totalBoxes=0; totalUltraBoxes=0; totalCosmicBoxes=0;
  totalClicks=0; collection={}; upgradeLevels={};
  totalSellEarned=0; craftedSet=new Set(); rarityFound=new Set();
  accumulatedCoins=0;
  renderCollection(); renderBoxButtons(); renderUpgrades(); renderRecipes();
  updateMoney(); updateStats(); updateCpsBadge();
  prestigeOverlay.classList.remove("show");
  playSound("prestige");
  checkAchievements();
  prestigeBadge.classList.add("prestige-shine");
  setTimeout(() => prestigeBadge.classList.remove("prestige-shine"), 1500);
}

prestigeBanBtn.addEventListener("click", openPrestigeModal);
prestigeConfirm.addEventListener("click", doPrestige);
prestigeCancel.addEventListener("click", () => prestigeOverlay.classList.remove("show"));
prestigeOverlay.addEventListener("click", (e) => { if (e.target===prestigeOverlay) prestigeOverlay.classList.remove("show"); });

// ── STATISTICS ─────────────────────────────────────────
statsBtn.addEventListener("click", () => {
  const uniqueBase    = Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length;
  const uniqueSummer  = summerFoodsFound.size;
  const uniqueCrafted = Object.keys(collection).filter(n=>collection[n].food.isCrafted).length;
  const totalOwned    = Object.values(collection).reduce((s,v)=>s+v.count,0);
  const highRarity    = [...rarityFound].filter(r=>["legendary","mythic","summer-legendary"].includes(r)).length > 0;
  const cells = [
    { label:"Total Clicks",       value: totalClicks.toLocaleString() },
    { label:"Boxes Opened",       value: totalBoxes.toLocaleString() },
    { label:"Coins Earned (sell)",value: totalSellEarned.toLocaleString() },
    { label:"Login Streak",       value: loginStreak + " 🔥" },
    { label:"Prestige Count",     value: prestigeCount },
    { label:"Prestige Mult",      value: "×" + getPrestigeMult().toFixed(1) },
    { label:"Base Foods Found",   value: `${uniqueBase} / 30` },
    { label:"Summer Foods",       value: `${uniqueSummer} / 14` },
    { label:"Crafted Dishes",     value: `${uniqueCrafted} / 8` },
    { label:"Total in Collection",value: totalOwned.toLocaleString() },
    { label:"Recipes Crafted",    value: `${craftedSet.size} / 8` },
    { label:"Waves Earned",       value: waves.toLocaleString() + " 🌊" },
  ];
  statsGrid.innerHTML = cells.map(c=>`
    <div class="stats-cell">
      <div class="stats-cell-label">${c.label}</div>
      <div class="stats-cell-value">${c.value}</div>
    </div>
  `).join("");
  statsOverlay.classList.add("show");
});
statsClose.addEventListener("click", () => statsOverlay.classList.remove("show"));
statsOverlay.addEventListener("click", (e) => { if (e.target===statsOverlay) statsOverlay.classList.remove("show"); });

// ── SETTINGS ───────────────────────────────────────────
settingsBtn.addEventListener("click", () => settingsOverlay.classList.add("show"));
settingsClose.addEventListener("click", () => settingsOverlay.classList.remove("show"));
settingsOverlay.addEventListener("click", (e) => { if (e.target===settingsOverlay) settingsOverlay.classList.remove("show"); });
soundToggle.addEventListener("change", () => { soundEnabled=soundToggle.checked; soundBtn.textContent=soundEnabled?"🔊":"🔇"; soundBtn.classList.toggle("muted",!soundEnabled); });
floaterToggle.addEventListener("change", () => { showFloaters=floaterToggle.checked; });
darkmodeToggle.addEventListener("change", () => { document.body.classList.toggle("light-mode",!darkmodeToggle.checked); });
summerBannerToggle.addEventListener("change", () => { document.getElementById("summer-banner").style.display = summerBannerToggle.checked ? "flex" : "none"; });
soundBtn.addEventListener("click", () => { soundEnabled=!soundEnabled; soundToggle.checked=soundEnabled; soundBtn.textContent=soundEnabled?"🔊":"🔇"; soundBtn.classList.toggle("muted",!soundEnabled); });
settingsReset.addEventListener("click", () => { if (confirm("⚠️ Reset ALL save data? This cannot be undone!")) { localStorage.clear(); location.reload(); } });

// ── COLLECTION SEARCH ──────────────────────────────────
collSearch.addEventListener("input", () => { collSearchQuery = collSearch.value.toLowerCase().trim(); renderCollection(); });

// ── ACHIEVEMENTS ───────────────────────────────────────
let toastQueue = [], toastRunning = false;

function checkAchievements() {
  let anyNew = false;
  ACHIEVEMENTS.forEach(ach => {
    if (achievementsDone.has(ach.id)) return;
    let done = false;
    switch (ach.type) {
      case "clicks":        done = totalClicks >= ach.target; break;
      case "boxes":         done = totalBoxes  >= ach.target; break;
      case "ultraBoxes":    done = totalUltraBoxes  >= ach.target; break;
      case "cosmicBoxes":   done = totalCosmicBoxes >= ach.target; break;
      case "summerBoxes":   done = totalSummerBoxes >= ach.target; break;
      case "unique":        done = Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length >= ach.target; break;
      case "rarity":        done = rarityFound.has(ach.target); break;
      case "streak":        done = loginStreak >= ach.target; break;
      case "sellTotal":     done = totalSellEarned >= ach.target; break;
      case "crafted":       done = craftedSet.size >= ach.target; break;
      case "prestige":      done = prestigeCount >= ach.target; break;
      case "summerFoods":   done = summerFoodsFound.size >= ach.target; break;
      case "summerDays":    done = summerDaysClaimed.length >= ach.target; break;
    }
    if (done) {
      achievementsDone.add(ach.id);
      if (ach.rewardType === "waves") { waves += ach.reward; updateWaves(); }
      else { money += ach.reward; updateMoney(); }
      playSound("achievement");
      toastQueue.push(ach); anyNew = true;
    }
  });
  if (anyNew) { runToastQueue(); renderAchievements(); }
}

function runToastQueue() {
  if (toastRunning || toastQueue.length === 0) return;
  toastRunning = true;
  const ach = toastQueue.shift();
  toastIcon.textContent = ach.icon;
  const rewardStr = ach.rewardType === "waves" ? `+${ach.reward} 🌊` : `+${ach.reward} 🪙`;
  toastName.textContent = `${ach.name} (${rewardStr})`;
  if (ach.isSummer) {
    achToast.classList.add("summer-toast");
    toastLabel.textContent = "☀️ Summer Achievement!";
    toastLabel.className = "toast-label summer-toast-label";
  } else {
    achToast.classList.remove("summer-toast");
    toastLabel.textContent = "Achievement Unlocked!";
    toastLabel.className = "toast-label";
  }
  achToast.classList.add("show");
  setTimeout(() => {
    achToast.classList.remove("show");
    setTimeout(() => { toastRunning=false; runToastQueue(); }, 400);
  }, 3200);
}

// ── DAILY LOGIN BONUS ──────────────────────────────────
function checkDailyBonus() {
  const today=new Date().toDateString(), lastLogin=localStorage.getItem("ff_lastLogin")||"", streak=parseInt(localStorage.getItem("ff_streak")||"0");
  if (localStorage.getItem("ff_claimed")===today) return;
  const yesterday=new Date(Date.now()-86400000).toDateString();
  loginStreak=(lastLogin===yesterday)?streak+1:1;
  const bonus=Math.min(loginStreak*10,200);
  dailyTitle.textContent=`Day ${loginStreak} Bonus! 🎉`; dailySub.textContent=`Login streak reward: +${bonus} 🪙`; dailyClaim.textContent=`Claim +${bonus} 🪙`;
  dailyBanner.style.display="flex";
  dailyClaim.addEventListener("click", ()=>{
    money+=bonus; updateMoney(); renderBoxButtons();
    dailyBanner.style.display="none";
    localStorage.setItem("ff_lastLogin",today); localStorage.setItem("ff_streak",loginStreak); localStorage.setItem("ff_claimed",today);
    updateStats(); checkAchievements();
  }, { once:true });
}

// ── RENDER: BOXES ──────────────────────────────────────
function renderBoxButtons() {
  const grid = document.getElementById("boxes-grid"); grid.innerHTML="";
  BOXES.forEach((box,i) => {
    const card = document.createElement("div");
    card.className = "box-card" + (box.cardClass ? " "+box.cardClass : "");
    card.innerHTML = `<div class="box-icon">${box.icon}</div><div class="box-name">${box.name}</div><div class="box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="box-price">🪙 ${box.price.toLocaleString()}</div><button class="box-btn ${box.btnClass}" ${money<box.price?"disabled":""}>Open!</button>`;
    card.querySelector("button").addEventListener("click", ()=>openBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: SUMMER BOXES ───────────────────────────────
function renderSummerBoxes() {
  const grid = document.getElementById("summer-boxes-grid"); grid.innerHTML="";
  SUMMER_BOXES.forEach((box,i) => {
    const card = document.createElement("div");
    card.className = "summer-box-card";
    card.innerHTML = `<div class="summer-box-icon">${box.icon}</div><div class="summer-box-name">${box.name}</div><div class="summer-box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="summer-box-price">🌊 ${box.price} Waves</div><button class="summer-box-btn" ${waves<box.price?"disabled":""}>Open!</button>`;
    card.querySelector("button").addEventListener("click", ()=>openSummerBox(i));
    grid.appendChild(card);
  });
}

// ── RENDER: UPGRADES ───────────────────────────────────
function renderUpgrades() {
  const grid = document.getElementById("upgrades-grid"); grid.innerHTML="";
  UPGRADES.forEach((upg,i) => {
    const lvl=upgradeLevels[upg.id]||0, maxed=lvl>=upg.maxLevel, cost=getUpgradeCost(upg);
    const cpsAmt=Math.floor(upg.baseCps*lvl*getPrestigeMult());
    const card=document.createElement("div"); card.className="upgrade-card"+(maxed?" maxed":"");
    card.innerHTML=`<div class="upgrade-icon">${upg.icon}</div><div class="upgrade-info"><div class="upgrade-name">${upg.name}</div><div class="upgrade-desc">${upg.desc}</div><span class="upgrade-level">Lvl ${lvl}/${upg.maxLevel} · ${cpsAmt>0?`+${cpsAmt}/s`:"idle"}</span></div><div class="upgrade-right"><div class="upgrade-price">${maxed?"—":"🪙 "+cost.toLocaleString()}</div><button class="upgrade-btn ${maxed?"maxed-btn":""}" ${maxed||money<cost?"disabled":""}>${maxed?"MAX":"Buy"}</button></div>`;
    if (!maxed) card.querySelector("button").addEventListener("click",()=>buyUpgrade(i));
    grid.appendChild(card);
  });
}

// ── RENDER: RECIPES ────────────────────────────────────
function renderRecipes() {
  const list=document.getElementById("recipes-list"); list.innerHTML="";
  RECIPES.forEach(recipe=>{
    const craftable=canCraft(recipe), crafted=craftedSet.has(recipe.id);
    const card=document.createElement("div"); card.className="recipe-card"+(craftable?" can-craft":"");
    const ingsHTML=recipe.ingredients.map((ing,i)=>{
      const entry=collection[ing.name], has=entry&&entry.count>=ing.qty, have=entry?entry.count:0;
      return `${i>0?'<span class="recipe-plus">+</span>':""}<span class="recipe-ingredient ${has?"has-it":"missing"}">${ing.qty>1?`${ing.qty}× `:""}${ing.name} <span style="opacity:.6">(${have})</span></span>`;
    }).join("")+`<span class="recipe-arrow">→</span><span class="recipe-ingredient has-it">${recipe.icon} ${recipe.name}</span>`;
    card.innerHTML=`<div class="recipe-top"><div class="recipe-result-icon">${recipe.icon}</div><div class="recipe-info"><div class="recipe-name">${recipe.name}</div><div class="recipe-desc">${recipe.desc}</div><span class="recipe-rarity-badge">🍳 CRAFTED · sells for ${recipe.sellValue} 🪙</span></div></div><div class="recipe-ingredients">${ingsHTML}</div><button class="recipe-craft-btn ${crafted&&!craftable?"crafted-btn":""}" ${!craftable?"disabled":""}>${crafted&&!craftable?"✅ Crafted":craftable?"🍳 Craft!":"🔒 Need ingredients"}</button>`;
    if (craftable) card.querySelector("button").addEventListener("click",()=>craftRecipe(recipe.id));
    list.appendChild(card);
  });
}

// ── RENDER: ACHIEVEMENTS ───────────────────────────────
const ACH_CATEGORIES = ["all","clicks","boxes","collection","recipes","prestige","summer","other"];

function renderAchFilterBar() {
  const bar=document.getElementById("ach-filter-bar"); bar.innerHTML="";
  ACH_CATEGORIES.forEach(cat=>{
    const btn=document.createElement("button");
    btn.className="ach-filter-btn"+(achFilter===cat?" active":"");
    btn.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
    btn.addEventListener("click",()=>{achFilter=cat; renderAchFilterBar(); renderAchievements();});
    bar.appendChild(btn);
  });
}

function renderAchievements() {
  const list=document.getElementById("achievements-list"); list.innerHTML="";
  const filtered=achFilter==="all"?ACHIEVEMENTS:ACHIEVEMENTS.filter(a=>a.cat===achFilter);
  const sorted=[...filtered].sort((a,b)=>{ if(a.isSummer&&!b.isSummer) return -1; if(!a.isSummer&&b.isSummer) return 1; return 0; });
  sorted.forEach(ach=>{
    const done=achievementsDone.has(ach.id);
    let progress=0;
    switch(ach.type){
      case "clicks":      progress=Math.min(totalClicks/ach.target,1); break;
      case "boxes":       progress=Math.min(totalBoxes/ach.target,1); break;
      case "ultraBoxes":  progress=Math.min(totalUltraBoxes/ach.target,1); break;
      case "cosmicBoxes": progress=Math.min(totalCosmicBoxes/ach.target,1); break;
      case "summerBoxes": progress=Math.min(totalSummerBoxes/ach.target,1); break;
      case "unique":      progress=Math.min(Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length/ach.target,1); break;
      case "rarity":      progress=rarityFound.has(ach.target)?1:0; break;
      case "streak":      progress=Math.min(loginStreak/ach.target,1); break;
      case "sellTotal":   progress=Math.min(totalSellEarned/ach.target,1); break;
      case "crafted":     progress=Math.min(craftedSet.size/ach.target,1); break;
      case "prestige":    progress=Math.min(prestigeCount/ach.target,1); break;
      case "summerFoods": progress=Math.min(summerFoodsFound.size/ach.target,1); break;
      case "summerDays":  progress=Math.min(summerDaysClaimed.length/ach.target,1); break;
    }
    const pct=Math.round(progress*100);
    const rewardStr=ach.rewardType==="waves"?`+${ach.reward} 🌊`:`+${ach.reward} 🪙`;
    const card=document.createElement("div");
    card.className="ach-card"+(done?" unlocked":"")+(ach.isSummer?" summer-ach":"");
    card.innerHTML=`<div class="ach-icon ${done?"":"locked"}">${ach.icon}</div><div class="ach-info"><div class="ach-name ${ach.isSummer?"summer-name":""}">${ach.name}</div><div class="ach-desc ${ach.isSummer?"summer-desc":""}">${ach.desc}</div>${!done?`<div class="ach-progress-wrap"><div class="ach-progress-bar"><div class="ach-progress-fill ${pct>=100?"done":""} ${ach.isSummer?"summer-fill":""}" style="width:${pct}%"></div></div><div class="ach-pct">${pct}%</div></div>`:""}</div><div class="ach-reward ${ach.isSummer?"summer-reward":""}">${rewardStr}</div>`;
    list.appendChild(card);
  });
}

// ── RENDER: COLLECTION ─────────────────────────────────
function renderCollection() {
  collList.innerHTML="";
  const order=["summer-legendary","summer-rare","summer","crafted","mythic","legendary","epic","rare","uncommon","common"];
  let sorted=Object.values(collection).sort((a,b)=>order.indexOf(a.food.rarity)-order.indexOf(b.food.rarity));
  if (collSearchQuery) sorted=sorted.filter(({food})=>food.name.toLowerCase().includes(collSearchQuery)||food.rarity.toLowerCase().includes(collSearchQuery));
  if (sorted.length===0){ collList.innerHTML=`<p class="empty-msg">${collSearchQuery?"No results found.":"Open boxes to discover foods!"}</p>`; return; }
  sorted.forEach(({food,count})=>{
    const item=document.createElement("div");
    const isSummer=food.isSummer, isCrafted=food.isCrafted;
    item.className="coll-item"+(isSummer?" summer-item":isCrafted?" crafted-item":"");
    const hasDupe=count>1;
    const colorClass=isSummer?"rarity-color-summer":isCrafted?"rarity-color-crafted":"rarity-color-"+food.rarity;
    const dotClass=isSummer?"dot-"+food.rarity.replace("-","_"):isCrafted?"dot-crafted":"dot-"+food.rarity;
    const dotSafe=["summer","summer-rare","summer-legendary"].includes(food.rarity)?`dot-${food.rarity.replace("-","-")}`:dotClass;
    item.innerHTML=`<div class="rarity-dot ${dotSafe}"></div><span class="coll-icon">${food.icon}</span><span class="coll-name ${colorClass}">${food.name}</span><span class="coll-count">×${count}</span>${hasDupe?`<button class="coll-sell-btn">Sell (${count-1}) +${(count-1)*food.sellValue}🪙</button>`:""}`;
    if (hasDupe) item.querySelector(".coll-sell-btn").addEventListener("click",()=>sellDupe(food.name));
    collList.appendChild(item);
  });
}

// ── TABS ───────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
    if(btn.dataset.tab==="achievements"){renderAchFilterBar();renderAchievements();}
    if(btn.dataset.tab==="upgrades")renderUpgrades();
    if(btn.dataset.tab==="recipes")renderRecipes();
    if(btn.dataset.tab==="summer"){renderSummerBoxes();renderSummerDaysRow();}
  });
});

// ── INIT ───────────────────────────────────────────────
checkDailyBonus();
initSummerEvent();
renderBoxButtons();
renderSummerBoxes();
renderUpgrades();
renderRecipes();
renderCollection();
renderAchFilterBar();
renderAchievements();
updateCpsBadge();
updatePrestigeUI();
updateWaves();