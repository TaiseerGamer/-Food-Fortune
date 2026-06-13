// ════════════════════════════════════════════════════════
//  Food Fortune — v0.2.1
//  ✅ Summer Event Expansion (6 new foods, Tidal Wave Chest, 7 more daily days)
//  ✅ Combo Click mechanic (rapid clicking builds a multiplier)
//  ✅ Lucky Upgrades tab (boost box drop rates permanently)
//  ✅ 2 new base recipes (10 total)
//  ✅ Notification system (milestone, wave, combo pop-ups)
//  Event ends: June 20
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
    switch (type) {
      case "click":       osc.type="sine";     osc.frequency.setValueAtTime(600,now); osc.frequency.exponentialRampToValueAtTime(800,now+0.05); gain.gain.setValueAtTime(0.15,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);  osc.start(now); osc.stop(now+0.1);  break;
      case "combo":       osc.type="sine";     osc.frequency.setValueAtTime(900,now); osc.frequency.exponentialRampToValueAtTime(1300,now+0.08); gain.gain.setValueAtTime(0.18,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.12); osc.start(now); osc.stop(now+0.12); break;
      case "box":         osc.type="triangle"; osc.frequency.setValueAtTime(400,now); osc.frequency.exponentialRampToValueAtTime(900,now+0.15);  gain.gain.setValueAtTime(0.2,now);  gain.gain.exponentialRampToValueAtTime(0.001,now+0.25); osc.start(now); osc.stop(now+0.25); break;
      case "rare":        osc.type="sine";     osc.frequency.setValueAtTime(500,now); osc.frequency.exponentialRampToValueAtTime(1200,now+0.3);  gain.gain.setValueAtTime(0.25,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.4);  osc.start(now); osc.stop(now+0.4);  break;
      case "sell":        osc.type="square";   osc.frequency.setValueAtTime(300,now); osc.frequency.exponentialRampToValueAtTime(500,now+0.1);   gain.gain.setValueAtTime(0.08,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.12); osc.start(now); osc.stop(now+0.12); break;
      case "craft":       osc.type="sine";     osc.frequency.setValueAtTime(350,now); osc.frequency.exponentialRampToValueAtTime(1000,now+0.2);  gain.gain.setValueAtTime(0.18,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);  osc.start(now); osc.stop(now+0.3);  break;
      case "wave":        osc.type="sine";     osc.frequency.setValueAtTime(700,now); osc.frequency.exponentialRampToValueAtTime(1100,now+0.12); gain.gain.setValueAtTime(0.12,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.15); osc.start(now); osc.stop(now+0.15); break;
      case "lucky":       osc.type="triangle"; osc.frequency.setValueAtTime(600,now); osc.frequency.exponentialRampToValueAtTime(1200,now+0.18); gain.gain.setValueAtTime(0.15,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.22); osc.start(now); osc.stop(now+0.22); break;
      case "legendary":
        [0,0.1,0.2].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="sine"; o.frequency.setValueAtTime(600+i*200,now+d); o.frequency.exponentialRampToValueAtTime(1400+i*100,now+d+0.25); g.gain.setValueAtTime(0.2,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.3); o.start(now+d); o.stop(now+d+0.3); }); return;
      case "achievement":
        [0,0.12,0.24].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="triangle"; o.frequency.setValueAtTime(700+i*150,now+d); g.gain.setValueAtTime(0.15,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.18); o.start(now+d); o.stop(now+d+0.18); }); return;
      case "prestige":
        [0,0.1,0.2,0.3,0.4].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="sine"; o.frequency.setValueAtTime(400+i*180,now+d); o.frequency.exponentialRampToValueAtTime(1600+i*80,now+d+0.35); g.gain.setValueAtTime(0.2,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.4); o.start(now+d); o.stop(now+d+0.4); }); return;
    }
  } catch(e){}
}

// ── BASE FOODS (30) ────────────────────────────────────
const FOODS = [
  {name:"White Rice",      icon:"🍚",rarity:"common",    desc:"A humble staple. Not exciting, but reliable.",          sellValue:1  },
  {name:"Plain Bread",     icon:"🍞",rarity:"common",    desc:"Just bread. Basic. You can do this.",                    sellValue:1  },
  {name:"Boiled Egg",      icon:"🥚",rarity:"common",    desc:"Protein, that's about it.",                             sellValue:1  },
  {name:"Carrot Sticks",   icon:"🥕",rarity:"common",    desc:"Crunchy and orange. Very common.",                      sellValue:1  },
  {name:"Crackers",        icon:"🫙",rarity:"common",    desc:"The snack of mild disappointment.",                     sellValue:1  },
  {name:"Ramen Bowl",      icon:"🍜",rarity:"uncommon",  desc:"Steaming noodles with a rich broth!",                   sellValue:5  },
  {name:"Grilled Corn",    icon:"🌽",rarity:"uncommon",  desc:"Charred sweetness from the grill.",                     sellValue:5  },
  {name:"Avocado Toast",   icon:"🥑",rarity:"uncommon",  desc:"A brunch classic. Somewhat trendy.",                    sellValue:5  },
  {name:"Taco",            icon:"🌮",rarity:"uncommon",  desc:"Crunchy shell, tasty fillings.",                        sellValue:5  },
  {name:"Pancakes",        icon:"🥞",rarity:"uncommon",  desc:"Fluffy stacked goodness.",                              sellValue:5  },
  {name:"Cheese Platter",  icon:"🧀",rarity:"uncommon",  desc:"An assortment of fine aged cheeses.",                   sellValue:8  },
  {name:"Sushi Platter",   icon:"🍣",rarity:"rare",      desc:"Fresh nigiri and rolls, beautifully arranged.",         sellValue:20 },
  {name:"Beef Steak",      icon:"🥩",rarity:"rare",      desc:"A perfectly seared cut. Medium-rare, of course.",       sellValue:20 },
  {name:"Lobster Bisque",  icon:"🦞",rarity:"rare",      desc:"Rich, creamy, and deeply indulgent.",                   sellValue:20 },
  {name:"Truffle Pasta",   icon:"🍝",rarity:"rare",      desc:"Earthy truffles tossed with silky pasta.",              sellValue:20 },
  {name:"Wagyu Burger",    icon:"🍔",rarity:"rare",      desc:"Premium beef, perfectly seasoned.",                     sellValue:20 },
  {name:"Paella",          icon:"🥘",rarity:"rare",      desc:"Saffron rice with seafood, chicken and chorizo.",       sellValue:28 },
  {name:"Pho",             icon:"🍲",rarity:"rare",      desc:"Vietnamese rice noodle soup with tender beef.",         sellValue:25 },
  {name:"Dragon Ramen",    icon:"🐉",rarity:"epic",      desc:"Legendary broth simmered for 72 hours.",                sellValue:75 },
  {name:"Golden Cake",     icon:"🎂",rarity:"epic",      desc:"Encrusted with edible gold leaf.",                      sellValue:75 },
  {name:"Kobe Teppanyaki", icon:"🔥",rarity:"epic",      desc:"Finest Kobe beef, teppanyaki style.",                   sellValue:75 },
  {name:"Black Truffle",   icon:"🍄",rarity:"epic",      desc:"Rare fungal treasure from Périgord.",                   sellValue:75 },
  {name:"Omakase Set",     icon:"🎌",rarity:"epic",      desc:"Chef's selection sushi — every piece a masterpiece.",   sellValue:100},
  {name:"Ambrosia Bowl",   icon:"🌟",rarity:"legendary", desc:"Food of the gods. Literally divine.",                   sellValue:250},
  {name:"Phoenix Wings",   icon:"🦅",rarity:"legendary", desc:"Spicy wings that burst into flame.",                    sellValue:250},
  {name:"Crystal Sashimi", icon:"💎",rarity:"legendary", desc:"Perfectly sliced, jewel-like tuna.",                    sellValue:250},
  {name:"Unicorn Cake",    icon:"🦄",rarity:"legendary", desc:"Shimmering cake that exists in no recipe book.",        sellValue:320},
  {name:"Celestial Ramen", icon:"✨",rarity:"mythic",    desc:"A bowl from another dimension. Indescribable taste.",   sellValue:1000},
  {name:"Star Cake",       icon:"🌠",rarity:"mythic",    desc:"Baked in a supernova. Impossibly rare.",                sellValue:1000},
];

// ── SUMMER FOODS (20 total — 6 new in v0.2.1) ─────────
const SUMMER_FOODS = [
  // SUMMER (base) — original 6
  {name:"Mango Smoothie",    icon:"🥭",rarity:"summer",           desc:"Thick and tropical. Peak summer in a cup.",             sellValue:80,  isSummer:true},
  {name:"Ice Cream Cone",    icon:"🍦",rarity:"summer",           desc:"Classic soft-serve on a waffle cone.",                  sellValue:70,  isSummer:true},
  {name:"Watermelon Slice",  icon:"🍉",rarity:"summer",           desc:"Cold, juicy, and 90% water. Summer perfection.",        sellValue:60,  isSummer:true},
  {name:"BBQ Ribs",          icon:"🍖",rarity:"summer",           desc:"Slow-smoked over charcoal until fall-off-the-bone.",    sellValue:90,  isSummer:true},
  {name:"Corn on the Cob",   icon:"🌽",rarity:"summer",           desc:"Buttered and grilled at a beach bonfire.",              sellValue:55,  isSummer:true},
  {name:"Popsicle",          icon:"🧊",rarity:"summer",           desc:"Cherry-flavored and ice-cold. Essential summer snack.", sellValue:50,  isSummer:true},
  // NEW v0.2.1 — SUMMER base
  {name:"Coconut Water",     icon:"🥥",rarity:"summer",           desc:"Straight from a fresh coconut. Impossibly refreshing.", sellValue:65,  isSummer:true},
  {name:"Grilled Pineapple", icon:"🍍",rarity:"summer",           desc:"Caramelized rings from the grill. Sweet and smoky.",    sellValue:70,  isSummer:true},
  {name:"Beach Hotdog",      icon:"🌭",rarity:"summer",           desc:"A classic footlong with mustard, eaten at the shore.",  sellValue:55,  isSummer:true},
  // SUMMER RARE — original 4
  {name:"Lobster Roll",      icon:"🦞",rarity:"summer-rare",      desc:"New England classic — chunks of claw meat in butter.",  sellValue:280, isSummer:true},
  {name:"Tropical Parfait",  icon:"🍍",rarity:"summer-rare",      desc:"Layered tropical fruits with coconut cream.",           sellValue:250, isSummer:true},
  {name:"Grilled Swordfish", icon:"🐟",rarity:"summer-rare",      desc:"Fresh catch from the sea, chargrilled with lemon.",     sellValue:300, isSummer:true},
  {name:"Beach Paella",      icon:"🏖️",rarity:"summer-rare",     desc:"Paella cooked on open flame at the shoreline.",         sellValue:320, isSummer:true},
  // NEW v0.2.1 — SUMMER RARE
  {name:"Pearl Oysters",     icon:"🦪",rarity:"summer-rare",      desc:"Freshly shucked oysters on a bed of crushed ice.",      sellValue:340, isSummer:true},
  {name:"Seafood Tower",     icon:"🐚",rarity:"summer-rare",      desc:"A towering platter of the ocean's finest.",             sellValue:360, isSummer:true},
  {name:"Frozen Daiquiri",   icon:"🍹",rarity:"summer-rare",      desc:"Blended frozen strawberry, lime and just enough fun.",  sellValue:290, isSummer:true},
  // SUMMER LEGENDARY — original 4
  {name:"Solar Sundae",      icon:"☀️",rarity:"summer-legendary", desc:"A sundae made with frozen sunlight. Impossibly bright.", sellValue:1500,isSummer:true},
  {name:"Ocean Treasure",    icon:"🌊",rarity:"summer-legendary", desc:"A legendary platter from the deep blue.",               sellValue:1800,isSummer:true},
  {name:"Sunset Feast",      icon:"🌅",rarity:"summer-legendary", desc:"A lavish spread eaten as the sun sets over the ocean.", sellValue:2000,isSummer:true},
  {name:"Island King Platter",icon:"🏝️",rarity:"summer-legendary",desc:"The ultimate island royale. Found only once a summer.",sellValue:2500,isSummer:true},
];

// ── RARITIES ───────────────────────────────────────────
const RARITIES = {
  common:{label:"COMMON"}, uncommon:{label:"UNCOMMON"}, rare:{label:"RARE"}, epic:{label:"EPIC"},
  legendary:{label:"LEGENDARY"}, mythic:{label:"MYTHIC"}, crafted:{label:"CRAFTED"},
  "summer":{label:"SUMMER"}, "summer-rare":{label:"SUMMER RARE"}, "summer-legendary":{label:"SUMMER LEGENDARY"},
};

// ── STANDARD BOXES ────────────────────────────────────
const BOXES = [
  {name:"Snack Box",   icon:"📦",price:8,    btnClass:"b0",desc:"Basic luck. Common finds likely.",              odds:"Common 60% · Uncommon 28% · Rare 9%",       weights:{common:60,uncommon:28,rare:9,epic:2.5,legendary:0.4,mythic:0.1}},
  {name:"Gourmet Box", icon:"🎁",price:40,   btnClass:"b1",desc:"Better odds — Rare foods await!",              odds:"Rare 22% · Epic 9% · Legendary 3%",         weights:{common:30,uncommon:35,rare:22,epic:9,legendary:3,mythic:1}},
  {name:"Legend Box",  icon:"👑",price:200,  btnClass:"b2",desc:"Extreme luck. Mythic possible!",               odds:"Epic 22% · Legendary 12% · Mythic 6%",      weights:{common:10,uncommon:20,rare:30,epic:22,legendary:12,mythic:6}},
  {name:"Ultra Box",   icon:"💜",price:600,  btnClass:"b3",desc:"Guaranteed Epic or higher.",                   odds:"Epic 45% · Legendary 35% · Mythic 20%",     weights:{common:0,uncommon:0,rare:0,epic:45,legendary:35,mythic:20},cardClass:"ultra-card"},
  {name:"Cosmic Box",  icon:"🌌",price:2000, btnClass:"b4",desc:"Only Legendary & Mythic. The ultimate box.",  odds:"Legendary 60% · Mythic 40%",                weights:{common:0,uncommon:0,rare:0,epic:0,legendary:60,mythic:40},cardClass:"cosmic-card"},
];

// ── SUMMER BOXES (3 now — Tidal Wave Chest is NEW) ────
const SUMMER_BOXES = [
  {name:"Beach Box",         icon:"🏖️",price:20, desc:"Common summer foods. Great to start!",             odds:"Summer 75% · S.Rare 20% · S.Legendary 5%",    weights:{"summer":75,"summer-rare":20,"summer-legendary":5}},
  {name:"Tidal Chest",       icon:"🌊",price:55, desc:"Premium waves — Rare & Legendary summer foods!",   odds:"Summer Rare 50% · Summer Legendary 50%",       weights:{"summer":0,"summer-rare":50,"summer-legendary":50}},
  {name:"Tidal Wave Chest",  icon:"🌀",price:120,desc:"NEW! Only Summer Legendary drops. Ultra rare!",    odds:"Summer Legendary 100%",                        weights:{"summer":0,"summer-rare":0,"summer-legendary":100},cardClass:"tidal-wave-card"},
];

// ── SUMMER DAILY REWARDS (21 days — 7 new in v0.2.1) ──
const SUMMER_DAILY_REWARDS = [
  {day:1,  icon:"🌊",reward:10,  label:"10 🌊"},
  {day:2,  icon:"🌊",reward:15,  label:"15 🌊"},
  {day:3,  icon:"🍦",reward:20,  label:"20 🌊"},
  {day:4,  icon:"🌊",reward:15,  label:"15 🌊"},
  {day:5,  icon:"☀️",reward:30,  label:"30 🌊"},
  {day:6,  icon:"🌊",reward:20,  label:"20 🌊"},
  {day:7,  icon:"🏖️",reward:50, label:"50 🌊"},
  {day:8,  icon:"🌊",reward:20,  label:"20 🌊"},
  {day:9,  icon:"🍦",reward:25,  label:"25 🌊"},
  {day:10, icon:"🌊",reward:25,  label:"25 🌊"},
  {day:11, icon:"☀️",reward:40,  label:"40 🌊"},
  {day:12, icon:"🌊",reward:30,  label:"30 🌊"},
  {day:13, icon:"🌅",reward:60,  label:"60 🌊"},
  {day:14, icon:"🏝️",reward:150,label:"150 🌊"},
  // NEW v0.2.1 — days 15-21
  {day:15, icon:"🌊",reward:35,  label:"35 🌊"},
  {day:16, icon:"🍹",reward:45,  label:"45 🌊"},
  {day:17, icon:"🌊",reward:40,  label:"40 🌊"},
  {day:18, icon:"☀️",reward:60,  label:"60 🌊"},
  {day:19, icon:"🌊",reward:50,  label:"50 🌊"},
  {day:20, icon:"🌅",reward:80,  label:"80 🌊"},
  {day:21, icon:"🏆",reward:250, label:"250 🌊"},
];

// ── UPGRADES ──────────────────────────────────────────
const UPGRADES = [
  {id:"snack_imp",  icon:"🍪",name:"Cookie Jar",  desc:"+1 coin/s automatically.", baseCps:1,   baseCost:50,    costScale:1.6,maxLevel:10},
  {id:"pizza_oven", icon:"🍕",name:"Pizza Oven",  desc:"+5 coins/s.",              baseCps:5,   baseCost:200,   costScale:1.7,maxLevel:10},
  {id:"sushi_bar",  icon:"🍣",name:"Sushi Bar",   desc:"+20 coins/s.",             baseCps:20,  baseCost:800,   costScale:1.8,maxLevel:10},
  {id:"ramen_shop", icon:"🍜",name:"Ramen Shop",  desc:"+80 coins/s.",             baseCps:80,  baseCost:3000,  costScale:1.9,maxLevel:10},
  {id:"food_court", icon:"🏬",name:"Food Court",  desc:"+300 coins/s. The big one.",baseCps:300,baseCost:15000, costScale:2.0,maxLevel:10},
];

// ── LUCKY UPGRADES ────────────────────────────────────
// Each level adds a flat weight bonus to matching rarities
const LUCKY_UPGRADES = [
  {
    id:"lucky_rare", icon:"🔵", name:"Rare Luck", maxLevel:5,
    desc:"Boosts Rare drop rate in all standard boxes.",
    baseCost:300, costScale:2.5,
    effectLabel:(lvl)=>`+${lvl*2}% Rare weight`,
    apply:(weights,lvl)=>{ weights.rare = (weights.rare||0) + lvl*2; return weights; },
  },
  {
    id:"lucky_epic", icon:"🟣", name:"Epic Luck", maxLevel:5,
    desc:"Boosts Epic drop rate in all standard boxes.",
    baseCost:800, costScale:2.8,
    effectLabel:(lvl)=>`+${lvl*1.5}% Epic weight`,
    apply:(weights,lvl)=>{ weights.epic = (weights.epic||0) + lvl*1.5; return weights; },
  },
  {
    id:"lucky_legend", icon:"🟠", name:"Legend Luck", maxLevel:5,
    desc:"Boosts Legendary drop rate in all standard boxes.",
    baseCost:3000, costScale:3.2,
    effectLabel:(lvl)=>`+${lvl*0.8}% Legendary weight`,
    apply:(weights,lvl)=>{ weights.legendary = (weights.legendary||0) + lvl*0.8; return weights; },
  },
  {
    id:"lucky_mythic", icon:"🩷", name:"Mythic Luck", maxLevel:3,
    desc:"Boosts Mythic drop rate. Rare and precious.",
    baseCost:10000, costScale:4.0,
    effectLabel:(lvl)=>`+${lvl*0.3}% Mythic weight`,
    apply:(weights,lvl)=>{ weights.mythic = (weights.mythic||0) + lvl*0.3; return weights; },
  },
  {
    id:"lucky_summer", icon:"🌊", name:"Summer Luck", maxLevel:5,
    desc:"Boosts Summer Rare & Legendary odds in summer boxes.",
    baseCost:500, costScale:2.5,
    effectLabel:(lvl)=>`+${lvl*3}% Summer Rare/Legendary`,
    apply:(weights,lvl)=>{ weights["summer-rare"]=(weights["summer-rare"]||0)+lvl*2; weights["summer-legendary"]=(weights["summer-legendary"]||0)+lvl*1; return weights; },
  },
];

// ── RECIPES (10 total — 2 new in v0.2.1) ──────────────
const RECIPES = [
  {id:"breakfast_royale",name:"Breakfast Royale",   icon:"🍳",desc:"The ultimate breakfast — eggs, bread and pancakes.", ingredients:[{name:"Boiled Egg",qty:2},{name:"Plain Bread",qty:1},{name:"Pancakes",qty:1}],               sellValue:30  },
  {id:"surf_and_turf",   name:"Surf & Turf",        icon:"🍽️",desc:"Premium steak and fresh seafood on one plate.",       ingredients:[{name:"Beef Steak",qty:1},{name:"Sushi Platter",qty:1}],                                   sellValue:120 },
  {id:"truffle_ramen",   name:"Truffle Ramen",      icon:"🫕",desc:"Silky ramen broth elevated with shaved black truffle.",ingredients:[{name:"Ramen Bowl",qty:2},{name:"Black Truffle",qty:1}],                                    sellValue:200 },
  {id:"golden_feast",    name:"Golden Feast",       icon:"🌅",desc:"Wagyu, truffle pasta and golden cake. Pure decadence.",ingredients:[{name:"Wagyu Burger",qty:1},{name:"Truffle Pasta",qty:1},{name:"Golden Cake",qty:1}],       sellValue:500 },
  {id:"dragon_sushi",    name:"Dragon Sushi Roll",  icon:"🐉",desc:"Dragon Ramen broth poured over premium sushi.",       ingredients:[{name:"Dragon Ramen",qty:1},{name:"Sushi Platter",qty:2}],                                   sellValue:450 },
  {id:"cosmic_platter",  name:"Cosmic Platter",     icon:"🌌",desc:"Celestial Ramen meets Star Cake — transcends dimensions.",ingredients:[{name:"Celestial Ramen",qty:1},{name:"Star Cake",qty:1},{name:"Ambrosia Bowl",qty:1}],  sellValue:5000},
  {id:"summer_bbq",      name:"Summer BBQ Spread",  icon:"🔥",desc:"BBQ Ribs, Watermelon and Corn. Peak summer!",         ingredients:[{name:"BBQ Ribs",qty:1},{name:"Watermelon Slice",qty:1},{name:"Corn on the Cob",qty:1}],    sellValue:380 },
  {id:"island_dessert",  name:"Island Dessert Trio",icon:"🏝️",desc:"Mango Smoothie, Popsicle and Ice Cream Cone at once.",ingredients:[{name:"Mango Smoothie",qty:1},{name:"Popsicle",qty:1},{name:"Ice Cream Cone",qty:1}],     sellValue:300 },
  // NEW v0.2.1
  {id:"tropical_fusion", name:"Tropical Fusion",    icon:"🌺",desc:"Grilled Pineapple and Coconut Water blended into a luxurious summer bowl.",ingredients:[{name:"Grilled Pineapple",qty:2},{name:"Coconut Water",qty:1}],      sellValue:280 },
  {id:"ocean_royale",    name:"Ocean Royale",       icon:"🦪",desc:"Pearl Oysters served alongside a Seafood Tower — the ultimate ocean feast.",ingredients:[{name:"Pearl Oysters",qty:1},{name:"Seafood Tower",qty:1}],         sellValue:900 },
];
RECIPES.forEach(r=>{ r.food={name:r.name,icon:r.icon,rarity:"crafted",desc:r.desc,sellValue:r.sellValue,isCrafted:true}; });

// ── PRESTIGE ──────────────────────────────────────────
const PRESTIGE_THRESHOLD = 10000;
const PRESTIGE_MULTIPLIERS = [1.0,1.5,2.0,2.75,3.5,5.0,7.0,10.0];

// ── COMBO CONFIG ──────────────────────────────────────
const COMBO_DECAY_MS   = 1500;  // time without clicking before combo resets
const COMBO_LEVELS     = [1,1.5,2,2.5,3,4,5]; // multipliers per combo tier
const COMBO_THRESHOLDS = [0,5,10,20,35,55,80]; // clicks needed for each tier

// ── ACHIEVEMENTS ──────────────────────────────────────
const ACHIEVEMENTS = [
  {id:"first_click",     icon:"👆",name:"First Touch",        desc:"Click the coin once.",                  cat:"clicks",    type:"clicks",        target:1,      reward:5,    isSummer:false},
  {id:"click_100",       icon:"💪",name:"Finger Workout",     desc:"Click 100 times.",                      cat:"clicks",    type:"clicks",        target:100,    reward:50,   isSummer:false},
  {id:"click_1000",      icon:"🖱️",name:"Click Monster",      desc:"Click 1,000 times.",                    cat:"clicks",    type:"clicks",        target:1000,   reward:200,  isSummer:false},
  {id:"click_10000",     icon:"⚡",name:"Turbo Clicker",      desc:"Click 10,000 times.",                   cat:"clicks",    type:"clicks",        target:10000,  reward:800,  isSummer:false},
  {id:"combo_5",         icon:"🔥",name:"On Fire!",           desc:"Reach a ×2 combo multiplier.",          cat:"clicks",    type:"combo",         target:2,      reward:30,   isSummer:false},
  {id:"combo_max",       icon:"💥",name:"Combo King",         desc:"Reach the maximum ×5 combo multiplier.",cat:"clicks",    type:"combo",         target:5,      reward:300,  isSummer:false},
  {id:"first_box",       icon:"🎁",name:"Unboxed!",           desc:"Open your first box.",                  cat:"boxes",     type:"boxes",         target:1,      reward:10,   isSummer:false},
  {id:"box_25",          icon:"📦",name:"Box Hoarder",        desc:"Open 25 boxes.",                        cat:"boxes",     type:"boxes",         target:25,     reward:100,  isSummer:false},
  {id:"box_100",         icon:"🏪",name:"Box Magnate",        desc:"Open 100 boxes.",                       cat:"boxes",     type:"boxes",         target:100,    reward:500,  isSummer:false},
  {id:"box_500",         icon:"🏭",name:"Box Factory",        desc:"Open 500 boxes.",                       cat:"boxes",     type:"boxes",         target:500,    reward:2000, isSummer:false},
  {id:"ultra_first",     icon:"💜",name:"Going Ultra",        desc:"Open your first Ultra Box.",            cat:"boxes",     type:"ultraBoxes",    target:1,      reward:200,  isSummer:false},
  {id:"cosmic_first",    icon:"🌌",name:"Cosmic Taste",       desc:"Open your first Cosmic Box.",           cat:"boxes",     type:"cosmicBoxes",   target:1,      reward:800,  isSummer:false},
  {id:"foods_5",         icon:"🥗",name:"Foodie",             desc:"Collect 5 unique foods.",               cat:"collection",type:"unique",         target:5,      reward:30,   isSummer:false},
  {id:"foods_15",        icon:"🍽️",name:"Gourmet",            desc:"Collect 15 unique foods.",              cat:"collection",type:"unique",         target:15,     reward:150,  isSummer:false},
  {id:"foods_all",       icon:"👨‍🍳",name:"Master Chef",        desc:"Collect all 30 unique foods.",          cat:"collection",type:"unique",         target:30,     reward:3000, isSummer:false},
  {id:"rare_find",       icon:"🔵",name:"Rare Find",          desc:"Obtain a Rare food.",                   cat:"collection",type:"rarity",         target:"rare", reward:40,   isSummer:false},
  {id:"epic_find",       icon:"🟣",name:"Epic Taste",         desc:"Obtain an Epic food.",                  cat:"collection",type:"rarity",         target:"epic", reward:100,  isSummer:false},
  {id:"legend_find",     icon:"🟠",name:"Legendary Feast",    desc:"Obtain a Legendary food.",              cat:"collection",type:"rarity",         target:"legendary",reward:300,isSummer:false},
  {id:"mythic_find",     icon:"🩷",name:"Mythic Bite",        desc:"Obtain a Mythic food.",                 cat:"collection",type:"rarity",         target:"mythic",  reward:1000,isSummer:false},
  {id:"streak_3",        icon:"🔥",name:"On a Roll",          desc:"Log in 3 days in a row.",               cat:"other",     type:"streak",         target:3,      reward:75,   isSummer:false},
  {id:"streak_7",        icon:"🌟",name:"Weekly Warrior",     desc:"Maintain a 7-day streak.",              cat:"other",     type:"streak",         target:7,      reward:500,  isSummer:false},
  {id:"sold_100",        icon:"💸",name:"Market Flip",        desc:"Earn 100 coins by selling.",            cat:"other",     type:"sellTotal",      target:100,    reward:50,   isSummer:false},
  {id:"sold_5000",       icon:"💰",name:"Food Trader",        desc:"Earn 5,000 coins by selling.",          cat:"other",     type:"sellTotal",      target:5000,   reward:500,  isSummer:false},
  {id:"first_craft",     icon:"🍳",name:"Chef's Kiss",        desc:"Craft your first recipe.",              cat:"recipes",   type:"crafted",        target:1,      reward:60,   isSummer:false},
  {id:"all_recipes",     icon:"📖",name:"Recipe Master",      desc:"Craft all 10 recipes.",                 cat:"recipes",   type:"crafted",        target:10,     reward:2500, isSummer:false},
  {id:"prestige_1",      icon:"⭐",name:"Transcended",        desc:"Prestige for the first time.",          cat:"prestige",  type:"prestige",       target:1,      reward:500,  isSummer:false},
  {id:"prestige_3",      icon:"🌠",name:"Legend Reborn",      desc:"Prestige 3 times.",                     cat:"prestige",  type:"prestige",       target:3,      reward:2000, isSummer:false},
  {id:"prestige_5",      icon:"👑",name:"Eternal Foodie",     desc:"Prestige 5 times.",                     cat:"prestige",  type:"prestige",       target:5,      reward:8000, isSummer:false},
  // SUMMER
  {id:"summer_first_box",icon:"🏖️",name:"Beach Day!",         desc:"Open your first Summer box.",           cat:"summer",    type:"summerBoxes",    target:1,      reward:20,   isSummer:true, rewardType:"waves"},
  {id:"summer_box_10",   icon:"🌊",name:"Wave Rider",         desc:"Open 10 Summer boxes.",                 cat:"summer",    type:"summerBoxes",    target:10,     reward:60,   isSummer:true, rewardType:"waves"},
  {id:"summer_box_30",   icon:"🏄",name:"Surf's Up",          desc:"Open 30 Summer boxes.",                 cat:"summer",    type:"summerBoxes",    target:30,     reward:150,  isSummer:true, rewardType:"waves"},
  {id:"tidal_wave_first",icon:"🌀",name:"Tidal Surge",        desc:"Open your first Tidal Wave Chest.",     cat:"summer",    type:"tidalBoxes",     target:1,      reward:80,   isSummer:true, rewardType:"waves"},
  {id:"summer_food_1",   icon:"🍦",name:"Summer Taste",       desc:"Collect your first Summer food.",       cat:"summer",    type:"summerFoods",    target:1,      reward:15,   isSummer:true, rewardType:"waves"},
  {id:"summer_food_10",  icon:"🌺",name:"Summer Collector",   desc:"Collect 10 different Summer foods.",    cat:"summer",    type:"summerFoods",    target:10,     reward:100,  isSummer:true, rewardType:"waves"},
  {id:"summer_food_all", icon:"🏝️",name:"Island Master",      desc:"Collect all 20 Summer exclusive foods.",cat:"summer",    type:"summerFoods",    target:20,     reward:600,  isSummer:true, rewardType:"waves"},
  {id:"summer_legend",   icon:"☀️",name:"Solar Legend",       desc:"Obtain a Summer Legendary food.",       cat:"summer",    type:"rarity",         target:"summer-legendary",reward:200,isSummer:true,rewardType:"waves"},
  {id:"summer_daily_21", icon:"🌅",name:"21 Days of Summer",  desc:"Claim all 21 Summer daily splashes.",   cat:"summer",    type:"summerDays",     target:21,     reward:500,  isSummer:true, rewardType:"waves"},
  {id:"lucky_first",     icon:"🍀",name:"First Luck",         desc:"Buy your first Lucky Upgrade.",         cat:"other",     type:"luckyBought",    target:1,      reward:50,   isSummer:false},
  {id:"all_lucky",       icon:"🌈",name:"Max Lucky",          desc:"Max out any Lucky Upgrade to level 5.", cat:"other",     type:"luckyMaxed",     target:1,      reward:500,  isSummer:false},
];

// ── STATE ──────────────────────────────────────────────
let money=0, waves=0, totalClicks=0, totalBoxes=0, totalUltraBoxes=0, totalCosmicBoxes=0;
let totalSummerBoxes=0, totalTidalBoxes=0, collection={}, upgradeLevels={}, luckyLevels={};
let achievementsDone=new Set(), totalSellEarned=0, loginStreak=0, rarityFound=new Set();
let prestigeCount=0, craftedSet=new Set(), showFloaters=true, notifEnabled=true;
let achFilter="all", collSearchQuery="", accumulatedCoins=0;
let summerFoodsFound=new Set(), summerDaysClaimed=[], summerEventStart=null;
let luckyBought=0, luckyMaxed=0;
// Combo state
let comboCount=0, comboTier=0, comboDecayTimer=null;

// ── DOM ────────────────────────────────────────────────
const moneyEl=document.getElementById("money-display"),clicksEl=document.getElementById("stat-clicks"),boxesEl=document.getElementById("stat-boxes"),foodsEl=document.getElementById("stat-foods"),streakEl=document.getElementById("stat-streak"),wavesEl=document.getElementById("stat-waves"),summerCurrEl=document.getElementById("summer-currency"),collList=document.getElementById("collection-list"),coinBtn=document.getElementById("coin-btn"),coinLabel=document.getElementById("coin-label"),overlay=document.getElementById("modal-overlay"),resultModal=document.getElementById("result-modal"),modalIcon=document.getElementById("modal-icon"),modalRar=document.getElementById("modal-rarity"),modalName=document.getElementById("modal-name"),modalDesc=document.getElementById("modal-desc"),modalSummerBadge=document.getElementById("modal-summer-badge"),modalCraftBadge=document.getElementById("modal-crafted-badge"),modalSellHint=document.getElementById("modal-sell-hint"),modalClose=document.getElementById("modal-close"),cpsBadge=document.getElementById("cps-badge"),cpsVal=document.getElementById("cps-val"),comboBadge=document.getElementById("combo-badge"),comboVal=document.getElementById("combo-val"),sellAllBtn=document.getElementById("sell-all-btn"),achToast=document.getElementById("achievement-toast"),toastIcon=document.getElementById("toast-icon"),toastLabel=document.getElementById("toast-label"),toastName=document.getElementById("toast-name"),dailyBanner=document.getElementById("daily-banner"),dailyTitle=document.getElementById("daily-title"),dailySub=document.getElementById("daily-sub"),dailyClaim=document.getElementById("daily-claim-btn"),soundBtn=document.getElementById("sound-btn"),settingsBtn=document.getElementById("settings-btn"),statsBtn=document.getElementById("stats-btn"),settingsOverlay=document.getElementById("settings-overlay"),settingsClose=document.getElementById("settings-close-btn"),settingsReset=document.getElementById("settings-reset-btn"),soundToggle=document.getElementById("sound-toggle"),floaterToggle=document.getElementById("floater-toggle"),darkmodeToggle=document.getElementById("darkmode-toggle"),notifToggle=document.getElementById("notif-toggle"),summerBannerToggle=document.getElementById("summer-banner-toggle"),prestigeOverlay=document.getElementById("prestige-overlay"),prestigeBanner=document.getElementById("prestige-banner"),prestigeBanBtn=document.getElementById("prestige-banner-btn"),prestigeConfirm=document.getElementById("prestige-confirm-btn"),prestigeCancel=document.getElementById("prestige-cancel-btn"),prestigeBadge=document.getElementById("prestige-badge"),prestigeMultD=document.getElementById("prestige-mult-display"),prestigeMultP=document.getElementById("prestige-mult-preview"),prestigeChip=document.getElementById("prestige-chip"),statPrestige=document.getElementById("stat-prestige"),prestigeRwdPrev=document.getElementById("prestige-rewards-preview"),collSearch=document.getElementById("coll-search"),statsOverlay=document.getElementById("stats-overlay"),statsGrid=document.getElementById("stats-grid"),statsClose=document.getElementById("stats-close-btn"),summerClaimBtn=document.getElementById("summer-claim-btn"),summerDaysRow=document.getElementById("summer-days-row"),summerTimerDisp=document.getElementById("summer-timer-display"),summerTimerBar=document.getElementById("summer-timer-bar"),summerDaysLeft=document.getElementById("summer-days-left"),comboMeterWrap=document.getElementById("combo-meter-wrap"),comboLabelVal=document.getElementById("combo-label-val"),comboMeterBar=document.getElementById("combo-meter-bar"),notifArea=document.getElementById("notif-area");

// ── HELPERS ────────────────────────────────────────────
function getPrestigeMult()     { return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount,PRESTIGE_MULTIPLIERS.length-1)]; }
function getNextPrestigeMult() { return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount+1,PRESTIGE_MULTIPLIERS.length-1)]; }
function getComboMult()        { return COMBO_LEVELS[Math.min(comboTier,COMBO_LEVELS.length-1)]; }
function updateMoney()         { moneyEl.textContent=money.toLocaleString(); }
function updateWaves()         { waves=Math.max(0,waves); wavesEl.textContent=waves.toLocaleString(); summerCurrEl.textContent=waves.toLocaleString(); }
function updateStats() {
  clicksEl.textContent=totalClicks.toLocaleString(); boxesEl.textContent=totalBoxes.toLocaleString();
  foodsEl.textContent=Object.values(collection).reduce((s,v)=>s+v.count,0).toLocaleString();
  streakEl.textContent=loginStreak; updateWaves(); updatePrestigeUI();
}
function updatePrestigeUI() {
  const mult=getPrestigeMult();
  if (prestigeCount>0) { prestigeBadge.style.display="inline-flex"; prestigeMultD.textContent=mult.toFixed(1); prestigeChip.style.display="inline-flex"; statPrestige.textContent=prestigeCount; }
  const eligible=money>=PRESTIGE_THRESHOLD&&prestigeCount<PRESTIGE_MULTIPLIERS.length-1;
  prestigeBanner.style.display=eligible?"flex":"none";
  if (eligible&&prestigeMultP) prestigeMultP.textContent="×"+getNextPrestigeMult().toFixed(1);
  updateCoinLabel();
}
function updateCoinLabel() {
  const pm=getPrestigeMult(), cm=getComboMult(), total=(pm*cm).toFixed(2);
  coinLabel.textContent=pm>1||cm>1?`Click to earn ×${total} coins!`:"Click to earn coins!";
}
function spawnFloater(x,y,amount,color) {
  if(!showFloaters)return;
  const el=document.createElement("div"); el.className="floater"; el.textContent=`+${amount}`;
  if(color)el.style.color=color; el.style.left=(x-20)+"px"; el.style.top=(y-30)+"px";
  document.body.appendChild(el); el.addEventListener("animationend",()=>el.remove());
}
function getTotalCps() { return Math.floor(UPGRADES.reduce((s,u)=>s+u.baseCps*(upgradeLevels[u.id]||0),0)*getPrestigeMult()); }
function getUpgradeCost(upg) { return Math.floor(upg.baseCost*Math.pow(upg.costScale,upgradeLevels[upg.id]||0)); }
function getLuckyCost(lu) { return Math.floor(lu.baseCost*Math.pow(lu.costScale,luckyLevels[lu.id]||0)); }
function updateCpsBadge() { const c=getTotalCps(); cpsBadge.style.display=c>0?"inline-flex":"none"; cpsVal.textContent=c.toLocaleString(); }

// ── NOTIFICATION SYSTEM ────────────────────────────────
function showNotif(text, type="milestone") {
  if(!notifEnabled)return;
  const pill=document.createElement("div");
  pill.className=`notif-pill type-${type}`;
  pill.textContent=text;
  notifArea.appendChild(pill);
  setTimeout(()=>{ pill.classList.add("out"); setTimeout(()=>pill.remove(),350); }, 2500);
}

// ── COMBO CLICK MECHANIC ──────────────────────────────
function updateCombo() {
  const oldTier=comboTier;
  comboTier=0;
  for(let i=COMBO_THRESHOLDS.length-1;i>=0;i--) { if(comboCount>=COMBO_THRESHOLDS[i]){ comboTier=i; break; } }
  const mult=getComboMult();
  // Update badge
  if(comboTier>0) {
    comboBadge.style.display="inline-flex"; comboVal.textContent=mult.toFixed(1)+"x";
    comboMeterWrap.style.display="block"; comboLabelVal.textContent="×"+mult.toFixed(1);
    coinBtn.classList.add("combo-active");
  } else {
    comboBadge.style.display="none"; comboMeterWrap.style.display="none";
    coinBtn.classList.remove("combo-active");
  }
  // Progress bar — fill toward next tier
  const nextTierIdx=Math.min(comboTier+1,COMBO_THRESHOLDS.length-1);
  const from=COMBO_THRESHOLDS[comboTier], to=COMBO_THRESHOLDS[nextTierIdx];
  const pct=comboTier>=COMBO_THRESHOLDS.length-1?100:((comboCount-from)/(to-from))*100;
  comboMeterBar.style.width=Math.min(pct,100)+"%";
  // Notify on new tier
  if(comboTier>oldTier&&comboTier>0) {
    playSound("combo");
    showNotif(`🔥 Combo ×${mult.toFixed(1)}!`, "combo");
    checkAchievements();
  }
  updateCoinLabel();
}

function resetCombo() {
  comboCount=0; comboTier=0;
  comboBadge.style.display="none"; comboMeterWrap.style.display="none";
  coinBtn.classList.remove("combo-active");
  updateCoinLabel();
}

// ── COIN CLICK ─────────────────────────────────────────
let totalClickCount=0;
coinBtn.addEventListener("click",(e)=>{
  const pm=getPrestigeMult(), cm=getComboMult();
  const earned=Math.max(1,Math.floor(pm*cm));
  money+=earned; totalClicks++; totalClickCount++;
  // Waves every 10 clicks
  if(totalClickCount%10===0){ waves++; updateWaves(); spawnFloater(e.clientX-20,e.clientY-55,"1 🌊","#00c8ff"); playSound("wave"); showNotif("🌊 +1 Wave earned!","wave"); }
  // Combo
  comboCount++;
  clearTimeout(comboDecayTimer);
  comboDecayTimer=setTimeout(()=>{ resetCombo(); },COMBO_DECAY_MS);
  updateCombo();
  updateMoney(); updateStats(); playSound(cm>1?"combo":"click");
  coinBtn.classList.add("popping"); setTimeout(()=>coinBtn.classList.remove("popping"),100);
  spawnFloater(e.clientX,e.clientY,earned,cm>1?"#ffaa44":null);
  renderBoxButtons(); renderUpgrades(); renderLuckyUpgrades();
  checkAchievements();
  // Milestone notifs
  if([100,500,1000,5000,10000].includes(totalClicks)) showNotif(`🎉 ${totalClicks.toLocaleString()} clicks!`,"milestone");
});

// ── AUTO-CLICKER ───────────────────────────────────────
setInterval(()=>{
  const cps=getTotalCps();
  if(cps>0){
    accumulatedCoins+=cps/4;
    if(accumulatedCoins>=1){ const a=Math.floor(accumulatedCoins); accumulatedCoins-=a; money+=a; updateMoney(); updatePrestigeUI(); }
  }
},250);

// ── APPLY LUCKY UPGRADES TO BOX WEIGHTS ──────────────
function getModifiedWeights(box) {
  const w={...box.weights};
  LUCKY_UPGRADES.forEach(lu=>{
    const lvl=luckyLevels[lu.id]||0;
    if(lvl>0 && !box.name.toLowerCase().includes("summer") && lu.id!=="lucky_summer") lu.apply(w,lvl);
    if(lvl>0 && (box.name.toLowerCase().includes("summer")||box.name.toLowerCase().includes("tidal")) && lu.id==="lucky_summer") lu.apply(w,lvl);
  });
  return w;
}

// ── PICK FOOD ──────────────────────────────────────────
function pickFood(box) {
  const w=getModifiedWeights(box);
  const total=Object.values(w).reduce((a,b)=>a+b,0);
  let rand=Math.random()*total, chosen="common";
  for(const[r,wt]of Object.entries(w)){ if(wt===0)continue; rand-=wt; if(rand<=0){chosen=r;break;} }
  const pool=FOODS.filter(f=>f.rarity===chosen);
  return pool[Math.floor(Math.random()*pool.length)];
}

function pickSummerFood(box) {
  const w=getModifiedWeights(box);
  const total=Object.values(w).reduce((a,b)=>a+b,0);
  let rand=Math.random()*total, chosen="summer";
  for(const[r,wt]of Object.entries(w)){ if(wt===0)continue; rand-=wt; if(rand<=0){chosen=r;break;} }
  const pool=SUMMER_FOODS.filter(f=>f.rarity===chosen);
  return pool[Math.floor(Math.random()*pool.length)];
}

// ── OPEN BOX ───────────────────────────────────────────
function openBox(idx) {
  const box=BOXES[idx]; if(money<box.price)return;
  money-=box.price; totalBoxes++;
  if(idx===3)totalUltraBoxes++; if(idx===4)totalCosmicBoxes++;
  updateMoney(); updateStats(); renderBoxButtons();
  const food=pickFood(box); registerFood(food);
  playSound(["legendary","mythic"].includes(food.rarity)?"legendary":["rare","epic"].includes(food.rarity)?"rare":"box");
  showFoodModal(food,false,false); checkAchievements();
}

function openSummerBox(idx) {
  const box=SUMMER_BOXES[idx]; if(waves<box.price)return;
  waves-=box.price; totalSummerBoxes++;
  if(idx===2)totalTidalBoxes++;
  updateWaves(); renderSummerBoxes();
  const food=pickSummerFood(box); registerFood(food); summerFoodsFound.add(food.name);
  playSound(food.rarity==="summer-legendary"?"legendary":"rare");
  showFoodModal(food,true,false); checkAchievements();
}

function registerFood(food) {
  if(!collection[food.name])collection[food.name]={food,count:0};
  collection[food.name].count++; rarityFound.add(food.rarity); renderCollection();
}

// ── SHOW MODAL ─────────────────────────────────────────
function showFoodModal(food,isSummer,isCrafted) {
  modalIcon.textContent=food.icon;
  modalRar.textContent=RARITIES[food.rarity].label;
  const cls=isSummer?"rarity-color-summer":isCrafted?"rarity-color-crafted":"rarity-color-"+food.rarity;
  modalRar.className="modal-rarity-label "+cls; modalName.textContent=food.name; modalName.className="modal-food-name "+cls;
  modalDesc.textContent=food.desc; modalSummerBadge.style.display=isSummer?"inline-block":"none"; modalCraftBadge.style.display=isCrafted?"inline-block":"none";
  modalSellHint.textContent=`Sell value: ${food.sellValue} 🪙`;
  if(isSummer){resultModal.classList.add("summer-modal");modalName.classList.add("summer-shine");setTimeout(()=>modalName.classList.remove("summer-shine"),1700);}
  else{resultModal.classList.remove("summer-modal");if(["legendary","mythic"].includes(food.rarity)||isCrafted){modalName.classList.add("shine");setTimeout(()=>modalName.classList.remove("shine"),1300);}}
  overlay.classList.add("show");
}
modalClose.addEventListener("click",()=>overlay.classList.remove("show"));
overlay.addEventListener("click",(e)=>{if(e.target===overlay)overlay.classList.remove("show");});

// ── CRAFTING ───────────────────────────────────────────
function canCraft(r){return r.ingredients.every(i=>collection[i.name]&&collection[i.name].count>=i.qty);}
function craftRecipe(id) {
  const r=RECIPES.find(x=>x.id===id); if(!r||!canCraft(r))return;
  r.ingredients.forEach(i=>{collection[i.name].count-=i.qty;if(collection[i.name].count<=0)delete collection[i.name];});
  registerFood(r.food); craftedSet.add(id); playSound("craft"); showFoodModal(r.food,false,true); renderRecipes(); checkAchievements();
}

// ── UPGRADES ───────────────────────────────────────────
function buyUpgrade(idx){
  const u=UPGRADES[idx],lvl=upgradeLevels[u.id]||0; if(lvl>=u.maxLevel)return;
  const c=getUpgradeCost(u); if(money<c)return;
  money-=c; upgradeLevels[u.id]=lvl+1; updateMoney(); updateCpsBadge(); renderUpgrades(); renderBoxButtons();
}

// ── LUCKY UPGRADES ────────────────────────────────────
function buyLucky(idx){
  const lu=LUCKY_UPGRADES[idx],lvl=luckyLevels[lu.id]||0; if(lvl>=lu.maxLevel)return;
  const c=getLuckyCost(lu); if(money<c)return;
  money-=c; luckyLevels[lu.id]=lvl+1; luckyBought++;
  if(luckyLevels[lu.id]===lu.maxLevel)luckyMaxed++;
  updateMoney(); playSound("lucky");
  showNotif(`🍀 ${lu.name} upgraded to Lvl ${luckyLevels[lu.id]}!`,"lucky");
  renderLuckyUpgrades(); renderBoxButtons(); checkAchievements();
}

// ── SELL DUPLICATES ────────────────────────────────────
function sellDupe(n){const e=collection[n];if(!e||e.count<=1)return;const earn=(e.count-1)*e.food.sellValue;e.count=1;money+=earn;totalSellEarned+=earn;playSound("sell");updateMoney();renderCollection();checkAchievements();}
function sellAllDupes(){
  let t=0; Object.keys(collection).forEach(n=>{const e=collection[n];if(e.count>1){t+=(e.count-1)*e.food.sellValue;totalSellEarned+=(e.count-1)*e.food.sellValue;e.count=1;}});
  if(t>0){money+=t;updateMoney();renderCollection();checkAchievements();playSound("sell");const r=sellAllBtn.getBoundingClientRect();spawnFloater(r.left+r.width/2,r.top+window.scrollY-10,t,"#5dde78");showNotif(`💰 Sold dupes for ${t} 🪙!`,"milestone");}
}
sellAllBtn.addEventListener("click",sellAllDupes);

// ── PRESTIGE ───────────────────────────────────────────
function openPrestigeModal(){prestigeRwdPrev.innerHTML=`Current: <strong style="color:#c87eff">×${getPrestigeMult().toFixed(1)}</strong> → After: <strong style="color:#ffe680">×${getNextPrestigeMult().toFixed(1)}</strong>`;prestigeOverlay.classList.add("show");}
function doPrestige(){
  prestigeCount++;money=0;totalBoxes=0;totalUltraBoxes=0;totalCosmicBoxes=0;totalClicks=0;collection={};upgradeLevels={};luckyLevels={};
  totalSellEarned=0;craftedSet=new Set();rarityFound=new Set();accumulatedCoins=0;luckyBought=0;luckyMaxed=0;comboCount=0;comboTier=0;
  renderCollection();renderBoxButtons();renderUpgrades();renderRecipes();renderLuckyUpgrades();
  updateMoney();updateStats();updateCpsBadge();prestigeOverlay.classList.remove("show");playSound("prestige");checkAchievements();
  prestigeBadge.classList.add("prestige-shine");setTimeout(()=>prestigeBadge.classList.remove("prestige-shine"),1500);
}
prestigeBanBtn.addEventListener("click",openPrestigeModal);
prestigeConfirm.addEventListener("click",doPrestige);
prestigeCancel.addEventListener("click",()=>prestigeOverlay.classList.remove("show"));
prestigeOverlay.addEventListener("click",(e)=>{if(e.target===prestigeOverlay)prestigeOverlay.classList.remove("show");});

// ── SUMMER TIMER ───────────────────────────────────────
function initSummerEvent(){
  let s=localStorage.getItem("ff_summerStart"); if(!s){s=Date.now().toString();localStorage.setItem("ff_summerStart",s);} summerEventStart=parseInt(s);
  const stored=localStorage.getItem("ff_summerDays"); summerDaysClaimed=stored?JSON.parse(stored):[];
  renderSummerDaysRow(); updateSummerTimer(); setInterval(updateSummerTimer,1000);
  const claimed=localStorage.getItem("ff_summerDayClaimedDate")===new Date().toDateString();
  summerClaimBtn.disabled=claimed||summerDaysClaimed.length>=21;
  if(summerDaysClaimed.length>=21)summerClaimBtn.textContent="All 21 Days Claimed! 🌊";
  else if(claimed)summerClaimBtn.textContent="Come back tomorrow 🌊";
}

// Event ends June 20 2026 midnight
const SUMMER_END = new Date("2026-06-20T23:59:59").getTime();

function updateSummerTimer(){
  const remaining=Math.max(0,SUMMER_END-Date.now());
  const progress=Math.max(0,remaining/(21*24*60*60*1000));
  const d=Math.floor(remaining/86400000),h=Math.floor((remaining%86400000)/3600000),m=Math.floor((remaining%3600000)/60000),s=Math.floor((remaining%60000)/1000);
  summerTimerDisp.textContent=`${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  summerTimerBar.style.width=(progress*100)+"%";
  if(summerDaysLeft)summerDaysLeft.textContent=d;
}

function renderSummerDaysRow(){
  summerDaysRow.innerHTML="";
  SUMMER_DAILY_REWARDS.forEach(day=>{
    const claimed=summerDaysClaimed.includes(day.day),isNext=summerDaysClaimed.length+1===day.day;
    const chip=document.createElement("div"); chip.className="summer-day-chip"+(claimed?" claimed":isNext?" today":" future");
    chip.innerHTML=`<span class="summer-day-num">D${day.day}</span><span class="summer-day-reward">${claimed?"✅":day.icon}</span><span class="summer-day-check">${claimed?"✓":day.label}</span>`;
    summerDaysRow.appendChild(chip);
  });
}

summerClaimBtn.addEventListener("click",()=>{
  const next=summerDaysClaimed.length+1; if(next>21)return;
  const reward=SUMMER_DAILY_REWARDS[next-1]; waves+=reward.reward; summerDaysClaimed.push(next);
  updateWaves(); renderSummerDaysRow(); renderSummerBoxes();
  localStorage.setItem("ff_summerDays",JSON.stringify(summerDaysClaimed)); localStorage.setItem("ff_summerDayClaimedDate",new Date().toDateString());
  summerClaimBtn.disabled=true; summerClaimBtn.textContent=next>=21?"All 21 Days Claimed! 🌊":"Come back tomorrow 🌊";
  playSound("wave"); const r=summerClaimBtn.getBoundingClientRect(); spawnFloater(r.left+r.width/2,r.top+window.scrollY-10,`${reward.reward} 🌊`,"#00c8ff");
  showNotif(`🌊 Day ${next} splash claimed! +${reward.reward} Waves`,"wave"); checkAchievements();
});

// ── STATISTICS ─────────────────────────────────────────
statsBtn.addEventListener("click",()=>{
  const cells=[
    {label:"Total Clicks",      value:totalClicks.toLocaleString()},
    {label:"Boxes Opened",      value:totalBoxes.toLocaleString()},
    {label:"Coins from Selling",value:totalSellEarned.toLocaleString()},
    {label:"Login Streak",      value:loginStreak+" 🔥"},
    {label:"Prestige Count",    value:prestigeCount},
    {label:"Prestige Mult",     value:"×"+getPrestigeMult().toFixed(1)},
    {label:"Best Combo",        value:"×"+getComboMult().toFixed(1)},
    {label:"Base Foods",        value:Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length+" / 30"},
    {label:"Summer Foods",      value:summerFoodsFound.size+" / 20"},
    {label:"Crafted Dishes",    value:Object.keys(collection).filter(n=>collection[n].food.isCrafted).length+" / 10"},
    {label:"Recipes Done",      value:craftedSet.size+" / 10"},
    {label:"Waves Earned",      value:waves.toLocaleString()+" 🌊"},
  ];
  statsGrid.innerHTML=cells.map(c=>`<div class="stats-cell"><div class="stats-cell-label">${c.label}</div><div class="stats-cell-value">${c.value}</div></div>`).join("");
  statsOverlay.classList.add("show");
});
statsClose.addEventListener("click",()=>statsOverlay.classList.remove("show"));
statsOverlay.addEventListener("click",(e)=>{if(e.target===statsOverlay)statsOverlay.classList.remove("show");});

// ── SETTINGS ───────────────────────────────────────────
settingsBtn.addEventListener("click",()=>settingsOverlay.classList.add("show"));
settingsClose.addEventListener("click",()=>settingsOverlay.classList.remove("show"));
settingsOverlay.addEventListener("click",(e)=>{if(e.target===settingsOverlay)settingsOverlay.classList.remove("show");});
soundToggle.addEventListener("change",()=>{soundEnabled=soundToggle.checked;soundBtn.textContent=soundEnabled?"🔊":"🔇";soundBtn.classList.toggle("muted",!soundEnabled);});
floaterToggle.addEventListener("change",()=>{showFloaters=floaterToggle.checked;});
darkmodeToggle.addEventListener("change",()=>{document.body.classList.toggle("light-mode",!darkmodeToggle.checked);});
notifToggle.addEventListener("change",()=>{notifEnabled=notifToggle.checked;});
summerBannerToggle.addEventListener("change",()=>{document.getElementById("summer-banner").style.display=summerBannerToggle.checked?"flex":"none";});
soundBtn.addEventListener("click",()=>{soundEnabled=!soundEnabled;soundToggle.checked=soundEnabled;soundBtn.textContent=soundEnabled?"🔊":"🔇";soundBtn.classList.toggle("muted",!soundEnabled);});
settingsReset.addEventListener("click",()=>{if(confirm("⚠️ Reset ALL save data? This cannot be undone!")){localStorage.clear();location.reload();}});
collSearch.addEventListener("input",()=>{collSearchQuery=collSearch.value.toLowerCase().trim();renderCollection();});

// ── DAILY BONUS ────────────────────────────────────────
function checkDailyBonus(){
  const today=new Date().toDateString(),last=localStorage.getItem("ff_lastLogin")||"",streak=parseInt(localStorage.getItem("ff_streak")||"0");
  if(localStorage.getItem("ff_claimed")===today)return;
  const yesterday=new Date(Date.now()-86400000).toDateString(); loginStreak=(last===yesterday)?streak+1:1;
  const bonus=Math.min(loginStreak*10,200);
  dailyTitle.textContent=`Day ${loginStreak} Bonus! 🎉`; dailySub.textContent=`Login streak reward: +${bonus} 🪙`; dailyClaim.textContent=`Claim +${bonus} 🪙`; dailyBanner.style.display="flex";
  dailyClaim.addEventListener("click",()=>{money+=bonus;updateMoney();renderBoxButtons();dailyBanner.style.display="none";localStorage.setItem("ff_lastLogin",today);localStorage.setItem("ff_streak",loginStreak);localStorage.setItem("ff_claimed",today);updateStats();checkAchievements();},{once:true});
}

// ── ACHIEVEMENTS ───────────────────────────────────────
let toastQueue=[],toastRunning=false;
function checkAchievements(){
  let anyNew=false;
  ACHIEVEMENTS.forEach(ach=>{
    if(achievementsDone.has(ach.id))return;
    let done=false;
    switch(ach.type){
      case "clicks":       done=totalClicks>=ach.target; break;
      case "combo":        done=getComboMult()>=ach.target; break;
      case "boxes":        done=totalBoxes>=ach.target; break;
      case "ultraBoxes":   done=totalUltraBoxes>=ach.target; break;
      case "cosmicBoxes":  done=totalCosmicBoxes>=ach.target; break;
      case "summerBoxes":  done=totalSummerBoxes>=ach.target; break;
      case "tidalBoxes":   done=totalTidalBoxes>=ach.target; break;
      case "unique":       done=Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length>=ach.target; break;
      case "rarity":       done=rarityFound.has(ach.target); break;
      case "streak":       done=loginStreak>=ach.target; break;
      case "sellTotal":    done=totalSellEarned>=ach.target; break;
      case "crafted":      done=craftedSet.size>=ach.target; break;
      case "prestige":     done=prestigeCount>=ach.target; break;
      case "summerFoods":  done=summerFoodsFound.size>=ach.target; break;
      case "summerDays":   done=summerDaysClaimed.length>=ach.target; break;
      case "luckyBought":  done=luckyBought>=ach.target; break;
      case "luckyMaxed":   done=luckyMaxed>=ach.target; break;
    }
    if(done){achievementsDone.add(ach.id);if(ach.rewardType==="waves"){waves+=ach.reward;updateWaves();}else{money+=ach.reward;updateMoney();}playSound("achievement");toastQueue.push(ach);anyNew=true;}
  });
  if(anyNew){runToastQueue();renderAchievements();}
}
function runToastQueue(){
  if(toastRunning||toastQueue.length===0)return; toastRunning=true;
  const ach=toastQueue.shift(); toastIcon.textContent=ach.icon;
  const rs=ach.rewardType==="waves"?`+${ach.reward} 🌊`:`+${ach.reward} 🪙`; toastName.textContent=`${ach.name} (${rs})`;
  if(ach.isSummer){achToast.classList.add("summer-toast");toastLabel.textContent="☀️ Summer Achievement!";toastLabel.className="toast-label summer-toast-label";}
  else{achToast.classList.remove("summer-toast");toastLabel.textContent="Achievement Unlocked!";toastLabel.className="toast-label";}
  achToast.classList.add("show");
  setTimeout(()=>{achToast.classList.remove("show");setTimeout(()=>{toastRunning=false;runToastQueue();},400);},3200);
}

// ── RENDER: BOXES ──────────────────────────────────────
function renderBoxButtons(){
  const grid=document.getElementById("boxes-grid"); grid.innerHTML="";
  BOXES.forEach((box,i)=>{
    const card=document.createElement("div"); card.className="box-card"+(box.cardClass?" "+box.cardClass:"");
    card.innerHTML=`<div class="box-icon">${box.icon}</div><div class="box-name">${box.name}</div><div class="box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="box-price">🪙 ${box.price.toLocaleString()}</div><button class="box-btn ${box.btnClass}" ${money<box.price?"disabled":""}>Open!</button>`;
    card.querySelector("button").addEventListener("click",()=>openBox(i)); grid.appendChild(card);
  });
}

// ── RENDER: SUMMER BOXES ───────────────────────────────
function renderSummerBoxes(){
  const grid=document.getElementById("summer-boxes-grid"); grid.innerHTML="";
  SUMMER_BOXES.forEach((box,i)=>{
    const card=document.createElement("div"); card.className="summer-box-card"+(box.cardClass?" "+box.cardClass:"");
    card.innerHTML=`<div class="summer-box-icon">${box.icon}</div><div class="summer-box-name">${box.name}</div><div class="summer-box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="summer-box-price">🌊 ${box.price} Waves</div><button class="summer-box-btn ${box.cardClass==="tidal-wave-card"?"tidal-wave-btn":""}" ${waves<box.price?"disabled":""}>Open!</button>`;
    card.querySelector("button").addEventListener("click",()=>openSummerBox(i)); grid.appendChild(card);
  });
}

// ── RENDER: LUCKY UPGRADES ─────────────────────────────
function renderLuckyUpgrades(){
  const grid=document.getElementById("lucky-grid"); grid.innerHTML="";
  LUCKY_UPGRADES.forEach((lu,i)=>{
    const lvl=luckyLevels[lu.id]||0, maxed=lvl>=lu.maxLevel, cost=getLuckyCost(lu);
    const card=document.createElement("div"); card.className="lucky-card"+(maxed?" maxed":"");
    card.innerHTML=`<div class="lucky-icon">${lu.icon}</div><div class="lucky-info"><div class="lucky-name">${lu.name}</div><div class="lucky-desc">${lu.desc}</div><span class="lucky-effect">Lvl ${lvl}/${lu.maxLevel} · ${lvl>0?lu.effectLabel(lvl):"Not purchased"}</span></div><div class="lucky-right"><div class="lucky-price">${maxed?"—":"🪙 "+cost.toLocaleString()}</div><button class="lucky-btn ${maxed?"maxed-btn":""}" ${maxed||money<cost?"disabled":""}>${maxed?"MAX":"Buy"}</button></div>`;
    if(!maxed)card.querySelector("button").addEventListener("click",()=>buyLucky(i)); grid.appendChild(card);
  });
}

// ── RENDER: UPGRADES ───────────────────────────────────
function renderUpgrades(){
  const grid=document.getElementById("upgrades-grid"); grid.innerHTML="";
  UPGRADES.forEach((u,i)=>{
    const lvl=upgradeLevels[u.id]||0, maxed=lvl>=u.maxLevel, cost=getUpgradeCost(u), cpsAmt=Math.floor(u.baseCps*lvl*getPrestigeMult());
    const card=document.createElement("div"); card.className="upgrade-card"+(maxed?" maxed":"");
    card.innerHTML=`<div class="upgrade-icon">${u.icon}</div><div class="upgrade-info"><div class="upgrade-name">${u.name}</div><div class="upgrade-desc">${u.desc}</div><span class="upgrade-level">Lvl ${lvl}/${u.maxLevel} · ${cpsAmt>0?`+${cpsAmt}/s`:"idle"}</span></div><div class="upgrade-right"><div class="upgrade-price">${maxed?"—":"🪙 "+cost.toLocaleString()}</div><button class="upgrade-btn ${maxed?"maxed-btn":""}" ${maxed||money<cost?"disabled":""}>${maxed?"MAX":"Buy"}</button></div>`;
    if(!maxed)card.querySelector("button").addEventListener("click",()=>buyUpgrade(i)); grid.appendChild(card);
  });
}

// ── RENDER: RECIPES ────────────────────────────────────
function renderRecipes(){
  const list=document.getElementById("recipes-list"); list.innerHTML="";
  RECIPES.forEach(r=>{
    const craftable=canCraft(r), crafted=craftedSet.has(r.id);
    const card=document.createElement("div"); card.className="recipe-card"+(craftable?" can-craft":"");
    const ingsHTML=r.ingredients.map((ing,i)=>{const e=collection[ing.name],has=e&&e.count>=ing.qty,have=e?e.count:0;return `${i>0?'<span class="recipe-plus">+</span>':""}<span class="recipe-ingredient ${has?"has-it":"missing"}">${ing.qty>1?`${ing.qty}× `:""}${ing.name} <span style="opacity:.6">(${have})</span></span>`;}).join("")+`<span class="recipe-arrow">→</span><span class="recipe-ingredient has-it">${r.icon} ${r.name}</span>`;
    card.innerHTML=`<div class="recipe-top"><div class="recipe-result-icon">${r.icon}</div><div class="recipe-info"><div class="recipe-name">${r.name}</div><div class="recipe-desc">${r.desc}</div><span class="recipe-rarity-badge">🍳 CRAFTED · sells for ${r.sellValue} 🪙</span></div></div><div class="recipe-ingredients">${ingsHTML}</div><button class="recipe-craft-btn ${crafted&&!craftable?"crafted-btn":""}" ${!craftable?"disabled":""}>${crafted&&!craftable?"✅ Crafted":craftable?"🍳 Craft!":"🔒 Need ingredients"}</button>`;
    if(craftable)card.querySelector("button").addEventListener("click",()=>craftRecipe(r.id)); list.appendChild(card);
  });
}

// ── RENDER: ACHIEVEMENTS ───────────────────────────────
const ACH_CATS=["all","clicks","boxes","collection","recipes","prestige","summer","other"];
function renderAchFilterBar(){
  const bar=document.getElementById("ach-filter-bar"); bar.innerHTML="";
  ACH_CATS.forEach(cat=>{const btn=document.createElement("button");btn.className="ach-filter-btn"+(achFilter===cat?" active":"");btn.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);btn.addEventListener("click",()=>{achFilter=cat;renderAchFilterBar();renderAchievements();});bar.appendChild(btn);});
}
function renderAchievements(){
  const list=document.getElementById("achievements-list"); list.innerHTML="";
  const filtered=achFilter==="all"?ACHIEVEMENTS:ACHIEVEMENTS.filter(a=>a.cat===achFilter);
  const sorted=[...filtered].sort((a,b)=>{if(a.isSummer&&!b.isSummer)return -1;if(!a.isSummer&&b.isSummer)return 1;return 0;});
  sorted.forEach(ach=>{
    const done=achievementsDone.has(ach.id); let p=0;
    switch(ach.type){
      case"clicks":p=Math.min(totalClicks/ach.target,1);break; case"combo":p=Math.min(getComboMult()/ach.target,1);break;
      case"boxes":p=Math.min(totalBoxes/ach.target,1);break; case"ultraBoxes":p=Math.min(totalUltraBoxes/ach.target,1);break;
      case"cosmicBoxes":p=Math.min(totalCosmicBoxes/ach.target,1);break; case"summerBoxes":p=Math.min(totalSummerBoxes/ach.target,1);break;
      case"tidalBoxes":p=Math.min(totalTidalBoxes/ach.target,1);break;
      case"unique":p=Math.min(Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isSummer).length/ach.target,1);break;
      case"rarity":p=rarityFound.has(ach.target)?1:0;break; case"streak":p=Math.min(loginStreak/ach.target,1);break;
      case"sellTotal":p=Math.min(totalSellEarned/ach.target,1);break; case"crafted":p=Math.min(craftedSet.size/ach.target,1);break;
      case"prestige":p=Math.min(prestigeCount/ach.target,1);break; case"summerFoods":p=Math.min(summerFoodsFound.size/ach.target,1);break;
      case"summerDays":p=Math.min(summerDaysClaimed.length/ach.target,1);break;
      case"luckyBought":p=Math.min(luckyBought/ach.target,1);break; case"luckyMaxed":p=Math.min(luckyMaxed/ach.target,1);break;
    }
    const pct=Math.round(p*100),rs=ach.rewardType==="waves"?`+${ach.reward} 🌊`:`+${ach.reward} 🪙`;
    const card=document.createElement("div"); card.className="ach-card"+(done?" unlocked":"")+(ach.isSummer?" summer-ach":"");
    card.innerHTML=`<div class="ach-icon ${done?"":"locked"}">${ach.icon}</div><div class="ach-info"><div class="ach-name ${ach.isSummer?"summer-name":""}">${ach.name}</div><div class="ach-desc ${ach.isSummer?"summer-desc":""}">${ach.desc}</div>${!done?`<div class="ach-progress-wrap"><div class="ach-progress-bar"><div class="ach-progress-fill ${pct>=100?"done":""} ${ach.isSummer?"summer-fill":""}" style="width:${pct}%"></div></div><div class="ach-pct">${pct}%</div></div>`:""}</div><div class="ach-reward ${ach.isSummer?"summer-reward":""}">${rs}</div>`;
    list.appendChild(card);
  });
}

// ── RENDER: COLLECTION ─────────────────────────────────
function renderCollection(){
  collList.innerHTML="";
  const order=["summer-legendary","summer-rare","summer","crafted","mythic","legendary","epic","rare","uncommon","common"];
  let sorted=Object.values(collection).sort((a,b)=>order.indexOf(a.food.rarity)-order.indexOf(b.food.rarity));
  if(collSearchQuery)sorted=sorted.filter(({food})=>food.name.toLowerCase().includes(collSearchQuery)||food.rarity.toLowerCase().includes(collSearchQuery));
  if(sorted.length===0){collList.innerHTML=`<p class="empty-msg">${collSearchQuery?"No results found.":"Open boxes to discover foods!"}</p>`;return;}
  sorted.forEach(({food,count})=>{
    const item=document.createElement("div"),isSummer=food.isSummer,isCrafted=food.isCrafted;
    item.className="coll-item"+(isSummer?" summer-item":isCrafted?" crafted-item":"");
    const hasDupe=count>1,colorClass=isSummer?"rarity-color-summer":isCrafted?"rarity-color-crafted":"rarity-color-"+food.rarity,dotClass=isSummer?"dot-"+food.rarity:isCrafted?"dot-crafted":"dot-"+food.rarity;
    item.innerHTML=`<div class="rarity-dot ${dotClass}"></div><span class="coll-icon">${food.icon}</span><span class="coll-name ${colorClass}">${food.name}</span><span class="coll-count">×${count}</span>${hasDupe?`<button class="coll-sell-btn">Sell (${count-1}) +${(count-1)*food.sellValue}🪙</button>`:""}`;
    if(hasDupe)item.querySelector(".coll-sell-btn").addEventListener("click",()=>sellDupe(food.name));
    collList.appendChild(item);
  });
}

// ── TABS ───────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
    btn.classList.add("active"); document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
    if(btn.dataset.tab==="achievements"){renderAchFilterBar();renderAchievements();}
    if(btn.dataset.tab==="upgrades")renderUpgrades();
    if(btn.dataset.tab==="recipes")renderRecipes();
    if(btn.dataset.tab==="lucky")renderLuckyUpgrades();
    if(btn.dataset.tab==="summer"){renderSummerBoxes();renderSummerDaysRow();}
  });
});

// ── INIT ───────────────────────────────────────────────
checkDailyBonus(); initSummerEvent();
renderBoxButtons(); renderSummerBoxes(); renderUpgrades(); renderLuckyUpgrades();
renderRecipes(); renderCollection(); renderAchFilterBar(); renderAchievements();
updateCpsBadge(); updatePrestigeUI(); updateWaves();