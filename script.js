// ════════════════════════════════════════════════════════
//  Food Fortune — v0.3.1
//  ✅ 2026 World Cup Event (ends July 18)
//     - 16 exclusive WC foods (3 tiers)
//     - 2 WC event boxes (Stadium Coins)
//     - Country-based 24-day daily calendar
//     - Match Predict mechanic (daily, bonus SC)
//     - WC achievements & UI theme
//  ✅ 4 new base foods (38 total)
//  ✅ New upgrade: Stadium Kitchen (+1000/s)
//  ✅ 2 new recipes (14 total)
//  ✅ QoL: sort collection by rarity name,
//          prestige shop shows perks in settings,
//          auto-sell notif shows earnings
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
      case "click":     osc.type="sine";     osc.frequency.setValueAtTime(600,now);  osc.frequency.exponentialRampToValueAtTime(800,now+0.05);   gain.gain.setValueAtTime(0.15,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);  osc.start(now); osc.stop(now+0.1);  break;
      case "combo":     osc.type="sine";     osc.frequency.setValueAtTime(900,now);  osc.frequency.exponentialRampToValueAtTime(1300,now+0.08);  gain.gain.setValueAtTime(0.18,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.12); osc.start(now); osc.stop(now+0.12); break;
      case "box":       osc.type="triangle"; osc.frequency.setValueAtTime(400,now);  osc.frequency.exponentialRampToValueAtTime(900,now+0.15);   gain.gain.setValueAtTime(0.2,now);  gain.gain.exponentialRampToValueAtTime(0.001,now+0.25); osc.start(now); osc.stop(now+0.25); break;
      case "rare":      osc.type="sine";     osc.frequency.setValueAtTime(500,now);  osc.frequency.exponentialRampToValueAtTime(1200,now+0.3);   gain.gain.setValueAtTime(0.25,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.4);  osc.start(now); osc.stop(now+0.4);  break;
      case "sell":      osc.type="square";   osc.frequency.setValueAtTime(300,now);  osc.frequency.exponentialRampToValueAtTime(500,now+0.1);    gain.gain.setValueAtTime(0.08,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.12); osc.start(now); osc.stop(now+0.12); break;
      case "craft":     osc.type="sine";     osc.frequency.setValueAtTime(350,now);  osc.frequency.exponentialRampToValueAtTime(1000,now+0.2);   gain.gain.setValueAtTime(0.18,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);  osc.start(now); osc.stop(now+0.3);  break;
      case "lucky":     osc.type="triangle"; osc.frequency.setValueAtTime(600,now);  osc.frequency.exponentialRampToValueAtTime(1200,now+0.18);  gain.gain.setValueAtTime(0.15,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.22); osc.start(now); osc.stop(now+0.22); break;
      case "pshop":     osc.type="sine";     osc.frequency.setValueAtTime(800,now);  osc.frequency.exponentialRampToValueAtTime(1400,now+0.25);  gain.gain.setValueAtTime(0.2,now);  gain.gain.exponentialRampToValueAtTime(0.001,now+0.35); osc.start(now); osc.stop(now+0.35); break;
      case "trophy":    osc.type="triangle"; osc.frequency.setValueAtTime(700,now);  osc.frequency.exponentialRampToValueAtTime(1500,now+0.3);   gain.gain.setValueAtTime(0.2,now);  gain.gain.exponentialRampToValueAtTime(0.001,now+0.4);  osc.start(now); osc.stop(now+0.4);  break;
      case "autosell":  osc.type="square";   osc.frequency.setValueAtTime(400,now);  osc.frequency.exponentialRampToValueAtTime(600,now+0.08);   gain.gain.setValueAtTime(0.06,now); gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);  osc.start(now); osc.stop(now+0.1);  break;
      case "wc":        osc.type="triangle"; osc.frequency.setValueAtTime(500,now);  osc.frequency.exponentialRampToValueAtTime(1000,now+0.2);   gain.gain.setValueAtTime(0.2,now);  gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);  osc.start(now); osc.stop(now+0.3);  break;
      case "predict_win":
        [0,0.1,0.2].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="triangle"; o.frequency.setValueAtTime(600+i*300,now+d); g.gain.setValueAtTime(0.2,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.25); o.start(now+d); o.stop(now+d+0.25); }); return;
      case "legendary":
        [0,0.1,0.2].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="sine"; o.frequency.setValueAtTime(600+i*200,now+d); o.frequency.exponentialRampToValueAtTime(1400+i*100,now+d+0.25); g.gain.setValueAtTime(0.2,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.3); o.start(now+d); o.stop(now+d+0.3); }); return;
      case "celestial":
        [0,0.08,0.16,0.24,0.32].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="sine"; o.frequency.setValueAtTime(500+i*250,now+d); o.frequency.exponentialRampToValueAtTime(1600+i*120,now+d+0.4); g.gain.setValueAtTime(0.18,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.45); o.start(now+d); o.stop(now+d+0.45); }); return;
      case "achievement":
        [0,0.12,0.24].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="triangle"; o.frequency.setValueAtTime(700+i*150,now+d); g.gain.setValueAtTime(0.15,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.18); o.start(now+d); o.stop(now+d+0.18); }); return;
      case "prestige":
        [0,0.1,0.2,0.3,0.4].forEach((d,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type="sine"; o.frequency.setValueAtTime(400+i*180,now+d); o.frequency.exponentialRampToValueAtTime(1600+i*80,now+d+0.35); g.gain.setValueAtTime(0.2,now+d); g.gain.exponentialRampToValueAtTime(0.001,now+d+0.4); o.start(now+d); o.stop(now+d+0.4); }); return;
    }
  } catch(e){}
}

// ── BASE FOODS (38 total — 4 new in v0.3.1) ───────────
const FOODS = [
  {name:"White Rice",       icon:"🍚",rarity:"common",    desc:"A humble staple.",                                      sellValue:1   },
  {name:"Plain Bread",      icon:"🍞",rarity:"common",    desc:"Just bread. Basic.",                                     sellValue:1   },
  {name:"Boiled Egg",       icon:"🥚",rarity:"common",    desc:"Protein, that's about it.",                             sellValue:1   },
  {name:"Carrot Sticks",    icon:"🥕",rarity:"common",    desc:"Crunchy and orange.",                                   sellValue:1   },
  {name:"Crackers",         icon:"🫙",rarity:"common",    desc:"The snack of mild disappointment.",                     sellValue:1   },
  {name:"Ramen Bowl",       icon:"🍜",rarity:"uncommon",  desc:"Steaming noodles with a rich broth!",                   sellValue:5   },
  {name:"Grilled Corn",     icon:"🌽",rarity:"uncommon",  desc:"Charred sweetness from the grill.",                     sellValue:5   },
  {name:"Avocado Toast",    icon:"🥑",rarity:"uncommon",  desc:"A brunch classic. Somewhat trendy.",                    sellValue:5   },
  {name:"Taco",             icon:"🌮",rarity:"uncommon",  desc:"Crunchy shell, tasty fillings.",                        sellValue:5   },
  {name:"Pancakes",         icon:"🥞",rarity:"uncommon",  desc:"Fluffy stacked goodness.",                              sellValue:5   },
  {name:"Cheese Platter",   icon:"🧀",rarity:"uncommon",  desc:"An assortment of fine aged cheeses.",                   sellValue:8   },
  {name:"Sushi Platter",    icon:"🍣",rarity:"rare",      desc:"Fresh nigiri and rolls, beautifully arranged.",         sellValue:20  },
  {name:"Beef Steak",       icon:"🥩",rarity:"rare",      desc:"A perfectly seared cut. Medium-rare, of course.",       sellValue:20  },
  {name:"Lobster Bisque",   icon:"🦞",rarity:"rare",      desc:"Rich, creamy, and deeply indulgent.",                   sellValue:20  },
  {name:"Truffle Pasta",    icon:"🍝",rarity:"rare",      desc:"Earthy truffles tossed with silky pasta.",              sellValue:20  },
  {name:"Wagyu Burger",     icon:"🍔",rarity:"rare",      desc:"Premium beef, perfectly seasoned.",                     sellValue:20  },
  {name:"Paella",           icon:"🥘",rarity:"rare",      desc:"Saffron rice with seafood, chicken and chorizo.",       sellValue:28  },
  {name:"Pho",              icon:"🍲",rarity:"rare",      desc:"Vietnamese rice noodle soup with tender beef.",         sellValue:25  },
  {name:"Dragon Ramen",     icon:"🐉",rarity:"epic",      desc:"Legendary broth simmered for 72 hours.",                sellValue:75  },
  {name:"Golden Cake",      icon:"🎂",rarity:"epic",      desc:"Encrusted with edible gold leaf.",                      sellValue:75  },
  {name:"Kobe Teppanyaki",  icon:"🔥",rarity:"epic",      desc:"Finest Kobe beef, teppanyaki style.",                   sellValue:75  },
  {name:"Black Truffle",    icon:"🍄",rarity:"epic",      desc:"Rare fungal treasure from Périgord.",                   sellValue:75  },
  {name:"Omakase Set",      icon:"🎌",rarity:"epic",      desc:"Chef's selection sushi — every piece a masterpiece.",   sellValue:100 },
  {name:"Ambrosia Bowl",    icon:"🌟",rarity:"legendary", desc:"Food of the gods. Literally divine.",                   sellValue:250 },
  {name:"Phoenix Wings",    icon:"🦅",rarity:"legendary", desc:"Spicy wings that burst into flame.",                    sellValue:250 },
  {name:"Crystal Sashimi",  icon:"💎",rarity:"legendary", desc:"Perfectly sliced, jewel-like tuna.",                    sellValue:250 },
  {name:"Unicorn Cake",     icon:"🦄",rarity:"legendary", desc:"Shimmering cake that exists in no recipe book.",        sellValue:320 },
  {name:"Celestial Ramen",  icon:"✨",rarity:"mythic",    desc:"A bowl from another dimension.",                        sellValue:1000},
  {name:"Star Cake",        icon:"🌠",rarity:"mythic",    desc:"Baked in a supernova. Impossibly rare.",                sellValue:1000},
  {name:"Cosmos Broth",     icon:"🌌",rarity:"celestial", desc:"Distilled from the fabric of the universe itself.",     sellValue:5000},
  {name:"Nebula Sushi",     icon:"🔮",rarity:"celestial", desc:"Hand-rolled in stardust and wrapped in aurora.",        sellValue:5000},
  {name:"Galactic Cake",    icon:"🪐",rarity:"celestial", desc:"Seven layers, each representing a planet.",             sellValue:5000},
  {name:"The Eternal Feast",icon:"♾️",rarity:"celestial", desc:"A dish that has existed since the Big Bang.",           sellValue:10000},
  // NEW v0.3.1
  {name:"Beef Empanadas",   icon:"🫓",rarity:"uncommon",  desc:"Crispy pastry pockets filled with seasoned beef. Stadium favourite!", sellValue:8  },
  {name:"Churros",          icon:"🍩",rarity:"uncommon",  desc:"Golden fried dough dusted with sugar and cinnamon.",   sellValue:6   },
  {name:"Shawarma Wrap",    icon:"🌯",rarity:"rare",      desc:"Spiced slow-roasted meat in warm flatbread. A classic.", sellValue:22 },
  {name:"Grilled Whole Fish",icon:"🐠",rarity:"epic",     desc:"A whole fish marinated in herbs and grilled over open flame.", sellValue:90},
  {name:"World Trophy Cake",icon:"🏆",rarity:"legendary", desc:"A gold-frosted cake shaped like the World Cup trophy. Baked once every 4 years.", sellValue:400},
];

// ── WORLD CUP FOODS (16) ──────────────────────────────
const WC_FOODS = [
  // WC (base)
  {name:"Stadium Hot Dog",    icon:"🌭",rarity:"wc",          desc:"The unofficial food of every World Cup stadium worldwide.",     sellValue:60,  isWC:true},
  {name:"Loaded Nachos",      icon:"🫔",rarity:"wc",          desc:"Tortilla chips loaded with cheese, jalapeños and salsa.",      sellValue:65,  isWC:true},
  {name:"Vuvuzela Lemonade",  icon:"🍋",rarity:"wc",          desc:"Ice-cold lemonade drunk to the sound of vuvuzelas.",           sellValue:50,  isWC:true},
  {name:"Match Day Burger",   icon:"🍔",rarity:"wc",          desc:"A double patty smash burger made for match day energy.",       sellValue:70,  isWC:true},
  {name:"Fan Zone Fries",     icon:"🍟",rarity:"wc",          desc:"Extra-crispy fries served in a paper cone at the fan zone.",   sellValue:45,  isWC:true},
  {name:"Halftime Pretzel",   icon:"🥨",rarity:"wc",          desc:"A giant warm pretzel enjoyed at halftime.",                    sellValue:55,  isWC:true},
  // WC RARE
  {name:"Argentine Asado",    icon:"🥩",rarity:"wc-rare",     desc:"Grass-fed beef slow-grilled over wood fire by the champions.", sellValue:320, isWC:true},
  {name:"Brazilian Churrasco",icon:"🍖",rarity:"wc-rare",     desc:"Rodizio-style skewered meats straight from the grill.",       sellValue:300, isWC:true},
  {name:"French Crêpe Royale",icon:"🇫🇷",rarity:"wc-rare",   desc:"A paper-thin crêpe from a Parisian cart outside the stadium.", sellValue:280, isWC:true},
  {name:"Spanish Tapas Tower",icon:"🫙",rarity:"wc-rare",     desc:"A towering stack of twelve Spanish tapas. Olé!",              sellValue:340, isWC:true},
  {name:"Japanese Bento Box", icon:"🍱",rarity:"wc-rare",     desc:"A perfectly balanced bento prepared by Japan's finest chef.", sellValue:360, isWC:true},
  // WC LEGENDARY
  {name:"Golden Boot Steak",  icon:"👟",rarity:"wc-legendary",desc:"Wagyu steak shaped like the Golden Boot award. A trophy on a plate.", sellValue:1500,isWC:true},
  {name:"Trophy Sushi Roll",  icon:"🏆",rarity:"wc-legendary",desc:"A sushi roll wrapped in edible gold — one for every goal scored.", sellValue:1800,isWC:true},
  {name:"Champion's Feast",   icon:"🎊",rarity:"wc-legendary",desc:"The winning team's entire victory banquet recreated in one dish.", sellValue:2200,isWC:true},
  {name:"Final Whistle Cake", icon:"⚽",rarity:"wc-legendary",desc:"A seven-tier cake shaped like a football. Only baked after the final.", sellValue:2500,isWC:true},
  {name:"World Cup Banquet",  icon:"🌍",rarity:"wc-legendary",desc:"Every host nation's signature dish served together. Once every 4 years.", sellValue:3000,isWC:true},
];

// ── RARITIES ───────────────────────────────────────────
const RARITIES = {
  common:{label:"COMMON"},uncommon:{label:"UNCOMMON"},rare:{label:"RARE"},epic:{label:"EPIC"},
  legendary:{label:"LEGENDARY"},mythic:{label:"MYTHIC"},celestial:{label:"CELESTIAL"},crafted:{label:"CRAFTED"},
  "wc":{label:"WORLD CUP"},"wc-rare":{label:"WC RARE"},"wc-legendary":{label:"WC LEGENDARY"},
};

// ── STANDARD BOXES ────────────────────────────────────
const BOXES = [
  {name:"Snack Box",    icon:"📦",price:8,    btnClass:"b0",desc:"Basic luck.",                                   odds:"Common 60% · Uncommon 28% · Rare 9%",      weights:{common:60,uncommon:28,rare:9,epic:2.5,legendary:0.4,mythic:0.1,celestial:0}},
  {name:"Gourmet Box",  icon:"🎁",price:40,   btnClass:"b1",desc:"Better odds — Rare foods await!",              odds:"Rare 22% · Epic 9% · Legendary 3%",        weights:{common:30,uncommon:35,rare:22,epic:9,legendary:3,mythic:1,celestial:0}},
  {name:"Legend Box",   icon:"👑",price:200,  btnClass:"b2",desc:"Extreme luck. Mythic possible!",               odds:"Epic 22% · Legendary 12% · Mythic 6%",     weights:{common:10,uncommon:20,rare:30,epic:22,legendary:12,mythic:6,celestial:0}},
  {name:"Ultra Box",    icon:"💜",price:600,  btnClass:"b3",desc:"Guaranteed Epic or higher.",                   odds:"Epic 45% · Legendary 35% · Mythic 20%",    weights:{common:0,uncommon:0,rare:0,epic:45,legendary:35,mythic:20,celestial:0},cardClass:"ultra-card"},
  {name:"Cosmic Box",   icon:"🌌",price:2000, btnClass:"b4",desc:"Only Legendary & Mythic.",                     odds:"Legendary 60% · Mythic 40%",               weights:{common:0,uncommon:0,rare:0,epic:0,legendary:60,mythic:40,celestial:0},cardClass:"cosmic-card"},
  {name:"Celestial Box",icon:"🌠",price:8000, btnClass:"b5",desc:"Mythic & Celestial drops!",                   odds:"Mythic 70% · Celestial 30%",               weights:{common:0,uncommon:0,rare:0,epic:0,legendary:0,mythic:70,celestial:30},cardClass:"celestial-card"},
];

// ── WC BOXES ──────────────────────────────────────────
const WC_BOXES = [
  {name:"Stadium Box",       icon:"⚽",price:20, desc:"Common WC foods. Get in the game!",         odds:"WC 70% · WC Rare 25% · WC Legendary 5%", weights:{"wc":70,"wc-rare":25,"wc-legendary":5}},
  {name:"Golden Ticket Box", icon:"🏆",price:60, desc:"Rare & Legendary WC foods guaranteed!",     odds:"WC Rare 50% · WC Legendary 50%",          weights:{"wc":0,"wc-rare":50,"wc-legendary":50},cardClass:"golden-ticket-card"},
];

// ── WC COUNTRY DAILY REWARDS (24 days) ────────────────
const WC_DAILY_REWARDS = [
  {day:1, flag:"🇧🇷",country:"Brazil",       reward:15, label:"15⚽"},
  {day:2, flag:"🇦🇷",country:"Argentina",     reward:15, label:"15⚽"},
  {day:3, flag:"🇫🇷",country:"France",        reward:20, label:"20⚽"},
  {day:4, flag:"🇩🇪",country:"Germany",       reward:15, label:"15⚽"},
  {day:5, flag:"🇪🇸",country:"Spain",         reward:20, label:"20⚽"},
  {day:6, flag:"🇬🇧",country:"England",       reward:20, label:"20⚽"},
  {day:7, flag:"🇵🇹",country:"Portugal",      reward:25, label:"25⚽"},
  {day:8, flag:"🇳🇱",country:"Netherlands",   reward:20, label:"20⚽"},
  {day:9, flag:"🇮🇹",country:"Italy",         reward:25, label:"25⚽"},
  {day:10,flag:"🇯🇵",country:"Japan",         reward:20, label:"20⚽"},
  {day:11,flag:"🇲🇽",country:"Mexico",        reward:25, label:"25⚽"},
  {day:12,flag:"🇺🇸",country:"USA",           reward:30, label:"30⚽"},
  {day:13,flag:"🇸🇦",country:"Saudi Arabia",  reward:25, label:"25⚽"},
  {day:14,flag:"🇸🇳",country:"Senegal",       reward:30, label:"30⚽"},
  {day:15,flag:"🇦🇺",country:"Australia",     reward:25, label:"25⚽"},
  {day:16,flag:"🇲🇦",country:"Morocco",       reward:35, label:"35⚽"},
  {day:17,flag:"🇰🇷",country:"South Korea",   reward:30, label:"30⚽"},
  {day:18,flag:"🇨🇦",country:"Canada",        reward:35, label:"35⚽"},
  {day:19,flag:"🇺🇾",country:"Uruguay",       reward:35, label:"35⚽"},
  {day:20,flag:"🇳🇬",country:"Nigeria",       reward:40, label:"40⚽"},
  {day:21,flag:"🇨🇴",country:"Colombia",      reward:40, label:"40⚽"},
  {day:22,flag:"🇨🇭",country:"Switzerland",   reward:45, label:"45⚽"},
  {day:23,flag:"🇵🇱",country:"Poland",        reward:50, label:"50⚽"},
  {day:24,flag:"🌍",country:"World Cup Final", reward:200,label:"200⚽"},
];

// ── MATCH PREDICT DATA ─────────────────────────────────
// Seeded by day-of-year so it changes daily
const MATCH_POOL = [
  {home:"🇧🇷 Brazil",away:"🇦🇷 Argentina"},{home:"🇫🇷 France",away:"🇩🇪 Germany"},
  {home:"🇪🇸 Spain",away:"🇵🇹 Portugal"},{home:"🇬🇧 England",away:"🇳🇱 Netherlands"},
  {home:"🇮🇹 Italy",away:"🇯🇵 Japan"},{home:"🇺🇸 USA",away:"🇲🇽 Mexico"},
  {home:"🇸🇦 Saudi Arabia",away:"🇲🇦 Morocco"},{home:"🇦🇺 Australia",away:"🇰🇷 South Korea"},
  {home:"🇨🇦 Canada",away:"🇺🇾 Uruguay"},{home:"🇳🇬 Nigeria",away:"🇸🇳 Senegal"},
  {home:"🇨🇴 Colombia",away:"🇨🇭 Switzerland"},{home:"🇵🇱 Poland",away:"🇷🇴 Romania"},
  {home:"🇧🇷 Brazil",away:"🇫🇷 France"},{home:"🇦🇷 Argentina",away:"🇩🇪 Germany"},
];

function getTodayMatch(){
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0))/(1000*60*60*24));
  return MATCH_POOL[dayOfYear % MATCH_POOL.length];
}

function getTodayMatchWinner(){
  const now = new Date();
  const seed = now.getFullYear()*1000 + Math.floor((now - new Date(now.getFullYear(),0,0))/(1000*60*60*24));
  // pseudo-random but deterministic per day
  const r = ((seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  return r > 0.5 ? "home" : "away";
}

// ── UPGRADES ──────────────────────────────────────────
const UPGRADES = [
  {id:"snack_imp",    icon:"🍪",name:"Cookie Jar",      desc:"+1 coin/s.",     baseCps:1,    baseCost:50,    costScale:1.6,maxLevel:10},
  {id:"pizza_oven",   icon:"🍕",name:"Pizza Oven",      desc:"+5 coins/s.",    baseCps:5,    baseCost:200,   costScale:1.7,maxLevel:10},
  {id:"sushi_bar",    icon:"🍣",name:"Sushi Bar",       desc:"+20 coins/s.",   baseCps:20,   baseCost:800,   costScale:1.8,maxLevel:10},
  {id:"ramen_shop",   icon:"🍜",name:"Ramen Shop",      desc:"+80 coins/s.",   baseCps:80,   baseCost:3000,  costScale:1.9,maxLevel:10},
  {id:"food_court",   icon:"🏬",name:"Food Court",      desc:"+300 coins/s.",  baseCps:300,  baseCost:15000, costScale:2.0,maxLevel:10},
  {id:"stadium_kit",  icon:"🏟️",name:"Stadium Kitchen", desc:"+1,000 coins/s. A full stadium catering operation!", baseCps:1000,baseCost:60000,costScale:2.1,maxLevel:10}, // NEW
];

// ── LUCKY UPGRADES ────────────────────────────────────
const LUCKY_UPGRADES = [
  {id:"lucky_rare",   icon:"🔵",name:"Rare Luck",      maxLevel:5,desc:"Boosts Rare drop weight.",               baseCost:300,  costScale:2.5,apply:(w,l)=>{w.rare=(w.rare||0)+l*2;return w;},         effectLabel:(l)=>`+${l*2}% Rare`},
  {id:"lucky_epic",   icon:"🟣",name:"Epic Luck",      maxLevel:5,desc:"Boosts Epic drop weight.",               baseCost:800,  costScale:2.8,apply:(w,l)=>{w.epic=(w.epic||0)+l*1.5;return w;},      effectLabel:(l)=>`+${l*1.5}% Epic`},
  {id:"lucky_legend", icon:"🟠",name:"Legend Luck",    maxLevel:5,desc:"Boosts Legendary drop weight.",          baseCost:3000, costScale:3.2,apply:(w,l)=>{w.legendary=(w.legendary||0)+l*0.8;return w;},effectLabel:(l)=>`+${l*0.8}% Legendary`},
  {id:"lucky_mythic", icon:"🩷",name:"Mythic Luck",    maxLevel:3,desc:"Boosts Mythic drop weight.",             baseCost:10000,costScale:4.0,apply:(w,l)=>{w.mythic=(w.mythic||0)+l*0.3;return w;},   effectLabel:(l)=>`+${l*0.3}% Mythic`},
  {id:"lucky_celest", icon:"🌌",name:"Celestial Luck", maxLevel:3,desc:"Boosts Celestial weight in Celestial Box.",baseCost:30000,costScale:4.5,apply:(w,l)=>{w.celestial=(w.celestial||0)+l*5;return w;},effectLabel:(l)=>`+${l*5}% Celestial`},
  {id:"lucky_wc",     icon:"⚽",name:"Stadium Luck",   maxLevel:5,desc:"Boosts WC Rare & Legendary in WC boxes.", baseCost:400,  costScale:2.5,apply:(w,l)=>{w["wc-rare"]=(w["wc-rare"]||0)+l*3;w["wc-legendary"]=(w["wc-legendary"]||0)+l*1;return w;},effectLabel:(l)=>`+WC Rare/Legend`},
];

// ── PRESTIGE SHOP ─────────────────────────────────────
const PRESTIGE_SHOP = [
  {id:"ps_start_coins",  icon:"🪙", name:"Head Start",        desc:"Start each run with bonus coins.",           maxLevel:3,costs:[1,2,3],effects:["500 coins","2,000 coins","5,000 coins"],getValue:(l)=>[0,500,2000,5000][l]},
  {id:"ps_click_bonus",  icon:"👆", name:"Power Click",        desc:"+N coins per click on top of multiplier.",   maxLevel:3,costs:[1,2,4],effects:["+1/click","+2/click","+4/click"],getValue:(l)=>l},
  {id:"ps_cps_boost",    icon:"⚡", name:"Auto Boost",         desc:"All auto-clickers produce more coins.",      maxLevel:2,costs:[2,4],  effects:["+25% CPS","+50% CPS"],getValue:(l)=>l*0.25},
  {id:"ps_lucky_discount",icon:"🍀",name:"Lucky Deal",         desc:"Lucky Upgrade costs reduced.",               maxLevel:2,costs:[1,3],  effects:["−20% Lucky costs","−40% Lucky costs"],getValue:(l)=>l*0.2},
  {id:"ps_box_discount",  icon:"🎁",name:"Box Bargain",        desc:"All box prices reduced.",                    maxLevel:3,costs:[1,2,3],effects:["−10% boxes","−20% boxes","−30% boxes"],getValue:(l)=>l*0.1},
  {id:"ps_sell_boost",    icon:"💰",name:"Market Expert",      desc:"All food sell values increased.",            maxLevel:2,costs:[2,4],  effects:["+25% sell","+50% sell"],getValue:(l)=>l*0.25},
  {id:"ps_streak_shield", icon:"🛡️",name:"Streak Shield",      desc:"Losing streak resets to 3 instead of 1.",   maxLevel:1,costs:[2],    effects:["Streak →3"],getValue:(l)=>l},
  {id:"ps_celestial_luck",icon:"🌠",name:"Celestial Sense",   desc:"+10% Celestial chance per level.",           maxLevel:3,costs:[3,5,8],effects:["+10%","+20%","+30%"],getValue:(l)=>l*0.1},
];

// ── PRESTIGE ──────────────────────────────────────────
const PRESTIGE_THRESHOLD = 10000;
const PRESTIGE_MULTIPLIERS = [1.0,1.5,2.0,2.75,3.5,5.0,7.0,10.0];

// ── COMBO ─────────────────────────────────────────────
const COMBO_DECAY_MS   = 1500;
const COMBO_LEVELS     = [1,1.5,2,2.5,3,4,5];
const COMBO_THRESHOLDS = [0,5,10,20,35,55,80];

// ── RECIPES (14 total — 2 new in v0.3.1) ──────────────
const RECIPES = [
  {id:"breakfast_royale", name:"Breakfast Royale",    icon:"🍳", desc:"Eggs, bread and pancakes stacked to perfection.",          ingredients:[{name:"Boiled Egg",qty:2},{name:"Plain Bread",qty:1},{name:"Pancakes",qty:1}],                      sellValue:30  },
  {id:"surf_and_turf",    name:"Surf & Turf",         icon:"🍽️", desc:"Premium steak and fresh seafood on one plate.",             ingredients:[{name:"Beef Steak",qty:1},{name:"Sushi Platter",qty:1}],                                          sellValue:120 },
  {id:"truffle_ramen",    name:"Truffle Ramen",       icon:"🫕", desc:"Silky ramen elevated with black truffle.",                  ingredients:[{name:"Ramen Bowl",qty:2},{name:"Black Truffle",qty:1}],                                           sellValue:200 },
  {id:"golden_feast",     name:"Golden Feast",        icon:"🌅", desc:"Wagyu, truffle pasta and golden cake.",                     ingredients:[{name:"Wagyu Burger",qty:1},{name:"Truffle Pasta",qty:1},{name:"Golden Cake",qty:1}],              sellValue:500 },
  {id:"dragon_sushi",     name:"Dragon Sushi Roll",   icon:"🐉", desc:"Dragon Ramen broth poured over premium sushi.",            ingredients:[{name:"Dragon Ramen",qty:1},{name:"Sushi Platter",qty:2}],                                          sellValue:450 },
  {id:"cosmic_platter",   name:"Cosmic Platter",      icon:"🌌", desc:"Celestial Ramen meets Star Cake.",                          ingredients:[{name:"Celestial Ramen",qty:1},{name:"Star Cake",qty:1},{name:"Ambrosia Bowl",qty:1}],           sellValue:5000},
  {id:"summer_bbq",       name:"Summer BBQ Spread",   icon:"🔥", desc:"BBQ Ribs, Watermelon and Corn.",                            ingredients:[{name:"BBQ Ribs",qty:1},{name:"Watermelon Slice",qty:1},{name:"Corn on the Cob",qty:1}],           sellValue:380 },
  {id:"island_dessert",   name:"Island Dessert Trio", icon:"🏝️", desc:"Mango Smoothie, Popsicle and Ice Cream Cone.",              ingredients:[{name:"Mango Smoothie",qty:1},{name:"Popsicle",qty:1},{name:"Ice Cream Cone",qty:1}],            sellValue:300 },
  {id:"tropical_fusion",  name:"Tropical Fusion",     icon:"🌺", desc:"Grilled Pineapple and Coconut Water — a summer bowl.",      ingredients:[{name:"Grilled Pineapple",qty:2},{name:"Coconut Water",qty:1}],                                    sellValue:280 },
  {id:"ocean_royale",     name:"Ocean Royale",        icon:"🦪", desc:"Pearl Oysters + Seafood Tower.",                            ingredients:[{name:"Pearl Oysters",qty:1},{name:"Seafood Tower",qty:1}],                                       sellValue:900 },
  {id:"celestial_tasting",name:"Celestial Tasting",   icon:"🌌", desc:"Cosmos Broth and Nebula Sushi — beyond imagination.",       ingredients:[{name:"Cosmos Broth",qty:1},{name:"Nebula Sushi",qty:1}],                                         sellValue:15000},
  {id:"ultimate_plate",   name:"The Ultimate Plate",  icon:"♾️", desc:"The Eternal Feast + Galactic Cake.",                        ingredients:[{name:"The Eternal Feast",qty:1},{name:"Galactic Cake",qty:1}],                                    sellValue:30000},
  // NEW v0.3.1
  {id:"stadium_street",   name:"Stadium Street Plate",icon:"⚽", desc:"Empanadas, Fan Zone Fries and a Stadium Hot Dog — the full matchday spread.", ingredients:[{name:"Beef Empanadas",qty:1},{name:"Fan Zone Fries",qty:1},{name:"Stadium Hot Dog",qty:1}], sellValue:350},
  {id:"wc_grand_plate",   name:"World Cup Grand Plate",icon:"🏆",desc:"The Golden Boot Steak served alongside a World Cup Banquet. Reserved for champions.", ingredients:[{name:"Golden Boot Steak",qty:1},{name:"World Cup Banquet",qty:1}], sellValue:8000},
];
RECIPES.forEach(r=>{ r.food={name:r.name,icon:r.icon,rarity:"crafted",desc:r.desc,sellValue:r.sellValue,isCrafted:true}; });

// ── TROPHIES ──────────────────────────────────────────
const TROPHIES = [
  {id:"t_first_click",     icon:"👆",name:"First Click",       desc:"Clicked the coin for the first time.",         tier:"bronze",  condition:(s)=>s.totalClicks>=1},
  {id:"t_click_1k",        icon:"💪",name:"Click Centurion",   desc:"Reached 1,000 total clicks.",                  tier:"bronze",  condition:(s)=>s.totalClicks>=1000},
  {id:"t_click_10k",       icon:"⚡",name:"Click Legend",      desc:"Reached 10,000 total clicks.",                 tier:"silver",  condition:(s)=>s.totalClicks>=10000},
  {id:"t_click_100k",      icon:"💥",name:"Click Deity",       desc:"Reached 100,000 total clicks.",                tier:"gold",    condition:(s)=>s.totalClicks>=100000},
  {id:"t_first_box",       icon:"🎁",name:"Unboxing Day",      desc:"Opened your first mystery box.",               tier:"bronze",  condition:(s)=>s.totalBoxes>=1},
  {id:"t_box_50",          icon:"📦",name:"Box Collector",     desc:"Opened 50 boxes.",                             tier:"bronze",  condition:(s)=>s.totalBoxes>=50},
  {id:"t_box_500",         icon:"🏭",name:"Box Empire",        desc:"Opened 500 boxes.",                            tier:"silver",  condition:(s)=>s.totalBoxes>=500},
  {id:"t_first_epic",      icon:"🟣",name:"Epic Discovery",    desc:"Obtained your first Epic food.",               tier:"bronze",  condition:(s)=>s.rarityFound.has("epic")},
  {id:"t_first_mythic",    icon:"🩷",name:"Mythic Moment",     desc:"Obtained your first Mythic food.",             tier:"gold",    condition:(s)=>s.rarityFound.has("mythic")},
  {id:"t_first_celestial", icon:"🌌",name:"Beyond the Stars",  desc:"Obtained your first Celestial food.",          tier:"diamond", condition:(s)=>s.rarityFound.has("celestial")},
  {id:"t_first_craft",     icon:"🍳",name:"Chef Awakens",      desc:"Crafted your first recipe.",                   tier:"bronze",  condition:(s)=>s.craftedSet.size>=1},
  {id:"t_all_recipes",     icon:"📖",name:"Grand Cuisine",     desc:"Crafted all 14 recipes.",                      tier:"gold",    condition:(s)=>s.craftedSet.size>=14},
  {id:"t_prestige_1",      icon:"⭐",name:"Reborn",            desc:"Prestiged for the first time.",                tier:"silver",  condition:(s)=>s.prestigeCount>=1},
  {id:"t_prestige_5",      icon:"👑",name:"Eternal Foodie",    desc:"Prestiged 5 times.",                           tier:"gold",    condition:(s)=>s.prestigeCount>=5},
  {id:"t_streak_7",        icon:"🔥",name:"Week Warrior",      desc:"Maintained a 7-day login streak.",             tier:"silver",  condition:(s)=>s.loginStreak>=7},
  {id:"t_sell_10k",        icon:"💰",name:"Food Mogul",        desc:"Earned 10,000 coins from selling food.",       tier:"gold",    condition:(s)=>s.totalSellEarned>=10000},
  {id:"t_max_combo",       icon:"💫",name:"Combo Master",      desc:"Reached the ×5 maximum combo multiplier.",     tier:"silver",  condition:(s)=>s.maxComboReached>=5},
  {id:"t_pshop_first",     icon:"✨",name:"Prestige Spender",  desc:"Spent your first Prestige Point.",             tier:"silver",  condition:(s)=>s.totalPpSpent>=1},
  {id:"t_celestial_box",   icon:"🌠",name:"Box of the Gods",   desc:"Opened a Celestial Box.",                      tier:"diamond", condition:(s)=>s.totalCelestialBoxes>=1},
  {id:"t_wc_first",        icon:"⚽",name:"Kick Off!",         desc:"Opened your first World Cup box.",             tier:"bronze",  condition:(s)=>s.totalWCBoxes>=1},
  {id:"t_wc_predict",      icon:"🎯",name:"The Oracle",        desc:"Correctly predicted a match outcome.",         tier:"silver",  condition:(s)=>s.correctPredictions>=1},
  {id:"t_wc_all_foods",    icon:"🌍",name:"Global Cuisine",    desc:"Collected all 16 WC exclusive foods.",         tier:"gold",    condition:(s)=>s.wcFoodsFound.size>=16},
  {id:"t_all_trophies",    icon:"🏅",name:"Trophy Hunter",     desc:"Earned 15 or more trophies.",                  tier:"diamond", condition:(s)=>s.trophiesEarned>=15},
];

// ── ACHIEVEMENTS ──────────────────────────────────────
const ACHIEVEMENTS = [
  {id:"first_click",      icon:"👆",name:"First Touch",        desc:"Click the coin once.",                    cat:"clicks",    type:"clicks",         target:1,       reward:5,    isWC:false},
  {id:"click_100",        icon:"💪",name:"Finger Workout",     desc:"Click 100 times.",                        cat:"clicks",    type:"clicks",         target:100,     reward:50,   isWC:false},
  {id:"click_1000",       icon:"🖱️",name:"Click Monster",      desc:"Click 1,000 times.",                      cat:"clicks",    type:"clicks",         target:1000,    reward:200,  isWC:false},
  {id:"click_10000",      icon:"⚡",name:"Turbo Clicker",      desc:"Click 10,000 times.",                     cat:"clicks",    type:"clicks",         target:10000,   reward:800,  isWC:false},
  {id:"combo_5",          icon:"🔥",name:"On Fire!",           desc:"Reach a ×2 combo multiplier.",            cat:"clicks",    type:"combo",          target:2,       reward:30,   isWC:false},
  {id:"combo_max",        icon:"💥",name:"Combo King",         desc:"Reach the ×5 max combo.",                 cat:"clicks",    type:"combo",          target:5,       reward:300,  isWC:false},
  {id:"first_box",        icon:"🎁",name:"Unboxed!",           desc:"Open your first box.",                    cat:"boxes",     type:"boxes",          target:1,       reward:10,   isWC:false},
  {id:"box_25",           icon:"📦",name:"Box Hoarder",        desc:"Open 25 boxes.",                          cat:"boxes",     type:"boxes",          target:25,      reward:100,  isWC:false},
  {id:"box_100",          icon:"🏪",name:"Box Magnate",        desc:"Open 100 boxes.",                         cat:"boxes",     type:"boxes",          target:100,     reward:500,  isWC:false},
  {id:"box_500",          icon:"🏭",name:"Box Factory",        desc:"Open 500 boxes.",                         cat:"boxes",     type:"boxes",          target:500,     reward:2000, isWC:false},
  {id:"ultra_first",      icon:"💜",name:"Going Ultra",        desc:"Open your first Ultra Box.",              cat:"boxes",     type:"ultraBoxes",     target:1,       reward:200,  isWC:false},
  {id:"cosmic_first",     icon:"🌌",name:"Cosmic Taste",       desc:"Open your first Cosmic Box.",             cat:"boxes",     type:"cosmicBoxes",    target:1,       reward:800,  isWC:false},
  {id:"celestial_first",  icon:"🌠",name:"Beyond the Cosmos",  desc:"Open your first Celestial Box.",          cat:"boxes",     type:"celestialBoxes", target:1,       reward:3000, isWC:false},
  {id:"foods_5",          icon:"🥗",name:"Foodie",             desc:"Collect 5 unique foods.",                 cat:"collection",type:"unique",          target:5,       reward:30,   isWC:false},
  {id:"foods_15",         icon:"🍽️",name:"Gourmet",            desc:"Collect 15 unique foods.",                cat:"collection",type:"unique",          target:15,      reward:150,  isWC:false},
  {id:"foods_all",        icon:"👨‍🍳",name:"Master Chef",        desc:"Collect all 38 unique base foods.",       cat:"collection",type:"unique",          target:38,      reward:5000, isWC:false},
  {id:"rare_find",        icon:"🔵",name:"Rare Find",          desc:"Obtain a Rare food.",                     cat:"collection",type:"rarity",          target:"rare",  reward:40,   isWC:false},
  {id:"epic_find",        icon:"🟣",name:"Epic Taste",         desc:"Obtain an Epic food.",                    cat:"collection",type:"rarity",          target:"epic",  reward:100,  isWC:false},
  {id:"legend_find",      icon:"🟠",name:"Legendary Feast",    desc:"Obtain a Legendary food.",                cat:"collection",type:"rarity",          target:"legendary",reward:300,isWC:false},
  {id:"mythic_find",      icon:"🩷",name:"Mythic Bite",        desc:"Obtain a Mythic food.",                   cat:"collection",type:"rarity",          target:"mythic",reward:1000, isWC:false},
  {id:"celestial_find",   icon:"🌌",name:"Celestial Taste",    desc:"Obtain a Celestial food.",                cat:"collection",type:"rarity",          target:"celestial",reward:5000,isWC:false},
  {id:"streak_3",         icon:"🔥",name:"On a Roll",          desc:"Log in 3 days in a row.",                 cat:"other",     type:"streak",          target:3,       reward:75,   isWC:false},
  {id:"streak_7",         icon:"🌟",name:"Weekly Warrior",     desc:"Maintain a 7-day streak.",                cat:"other",     type:"streak",          target:7,       reward:500,  isWC:false},
  {id:"sold_100",         icon:"💸",name:"Market Flip",        desc:"Earn 100 coins by selling.",              cat:"other",     type:"sellTotal",       target:100,     reward:50,   isWC:false},
  {id:"sold_10000",       icon:"💰",name:"Food Mogul",         desc:"Earn 10,000 coins by selling.",           cat:"other",     type:"sellTotal",       target:10000,   reward:1000, isWC:false},
  {id:"first_craft",      icon:"🍳",name:"Chef's Kiss",        desc:"Craft your first recipe.",                cat:"recipes",   type:"crafted",         target:1,       reward:60,   isWC:false},
  {id:"all_recipes",      icon:"📖",name:"Recipe Master",      desc:"Craft all 14 recipes.",                   cat:"recipes",   type:"crafted",         target:14,      reward:5000, isWC:false},
  {id:"prestige_1",       icon:"⭐",name:"Transcended",        desc:"Prestige for the first time.",            cat:"prestige",  type:"prestige",        target:1,       reward:500,  isWC:false},
  {id:"prestige_3",       icon:"🌠",name:"Legend Reborn",      desc:"Prestige 3 times.",                       cat:"prestige",  type:"prestige",        target:3,       reward:2000, isWC:false},
  {id:"prestige_5",       icon:"👑",name:"Eternal Foodie",     desc:"Prestige 5 times.",                       cat:"prestige",  type:"prestige",        target:5,       reward:8000, isWC:false},
  {id:"pshop_first",      icon:"✨",name:"First Purchase",     desc:"Buy from the Prestige Shop.",             cat:"prestige",  type:"ppSpent",         target:1,       reward:0,    isWC:false},
  {id:"trophy_10",        icon:"🏅",name:"Trophy Collector",   desc:"Earn 10 trophies.",                       cat:"other",     type:"trophies",        target:10,      reward:500,  isWC:false},
  {id:"auto_sell_on",     icon:"🔄",name:"Hands Free",         desc:"Enable the Auto-Sell feature.",           cat:"other",     type:"autoSell",        target:1,       reward:100,  isWC:false},
  // WC ACHIEVEMENTS
  {id:"wc_first_box",     icon:"⚽",name:"Kick Off!",          desc:"Open your first World Cup box.",          cat:"worldcup",  type:"wcBoxes",         target:1,       reward:25,   isWC:true, rewardType:"sc"},
  {id:"wc_box_10",        icon:"🥅",name:"Hat Trick",          desc:"Open 10 World Cup boxes.",                cat:"worldcup",  type:"wcBoxes",         target:10,      reward:80,   isWC:true, rewardType:"sc"},
  {id:"wc_box_30",        icon:"🏆",name:"Cup Run",            desc:"Open 30 World Cup boxes.",                cat:"worldcup",  type:"wcBoxes",         target:30,      reward:200,  isWC:true, rewardType:"sc"},
  {id:"wc_food_1",        icon:"🌭",name:"Stadium Snack",      desc:"Collect your first WC food.",             cat:"worldcup",  type:"wcFoods",         target:1,       reward:20,   isWC:true, rewardType:"sc"},
  {id:"wc_food_8",        icon:"🍟",name:"Fan Zone Feast",     desc:"Collect 8 different WC foods.",           cat:"worldcup",  type:"wcFoods",         target:8,       reward:100,  isWC:true, rewardType:"sc"},
  {id:"wc_food_all",      icon:"🌍",name:"Global Cuisine",     desc:"Collect all 16 WC exclusive foods.",      cat:"worldcup",  type:"wcFoods",         target:16,      reward:600,  isWC:true, rewardType:"sc"},
  {id:"wc_legend",        icon:"👟",name:"Golden Boot",        desc:"Obtain a WC Legendary food.",             cat:"worldcup",  type:"rarity",          target:"wc-legendary",reward:250,isWC:true,rewardType:"sc"},
  {id:"wc_predict_1",     icon:"🎯",name:"The Oracle",         desc:"Correctly predict a match outcome.",      cat:"worldcup",  type:"correctPredictions",target:1,     reward:30,   isWC:true, rewardType:"sc"},
  {id:"wc_predict_5",     icon:"🔮",name:"Fortune Teller",     desc:"Correctly predict 5 matches.",            cat:"worldcup",  type:"correctPredictions",target:5,     reward:150,  isWC:true, rewardType:"sc"},
  {id:"wc_daily_24",      icon:"🎊",name:"Full Tournament",    desc:"Claim all 24 WC daily country rewards.",  cat:"worldcup",  type:"wcDays",          target:24,      reward:500,  isWC:true, rewardType:"sc"},
];

// ── STATE ──────────────────────────────────────────────
let money=0,stadiumCoins=0,totalClicks=0,totalBoxes=0,totalUltraBoxes=0,totalCosmicBoxes=0,totalCelestialBoxes=0,totalWCBoxes=0;
let collection={},upgradeLevels={},luckyLevels={},prestigeShopLevels={};
let achievementsDone=new Set(),totalSellEarned=0,loginStreak=0,rarityFound=new Set();
let prestigeCount=0,prestigePoints=0,totalPpSpent=0;
let craftedSet=new Set(),showFloaters=true,notifEnabled=true;
let achFilter="all",collSearchQuery="",accCoins=0;
let luckyBought=0,luckyMaxed=0;
let comboCount=0,comboTier=0,comboDecayTimer=null,maxComboReached=1;
let autoSellEnabled=false,autoSellThreshold=3;
let trophiesEarned=0,trophiesUnlocked=new Set();
let wcFoodsFound=new Set(),wcDaysClaimed=[],correctPredictions=0;
let predictedToday=false,predictResult=null;

// ── DOM ────────────────────────────────────────────────
const moneyEl=document.getElementById("money-display"),clicksEl=document.getElementById("stat-clicks"),boxesEl=document.getElementById("stat-boxes"),foodsEl=document.getElementById("stat-foods"),streakEl=document.getElementById("stat-streak"),scEl=document.getElementById("stat-sc"),wcCurrEl=document.getElementById("wc-currency"),collList=document.getElementById("collection-list"),coinBtn=document.getElementById("coin-btn"),coinLabel=document.getElementById("coin-label"),overlay=document.getElementById("modal-overlay"),resultModal=document.getElementById("result-modal"),modalIcon=document.getElementById("modal-icon"),modalRar=document.getElementById("modal-rarity"),modalName=document.getElementById("modal-name"),modalDesc=document.getElementById("modal-desc"),modalWcBadge=document.getElementById("modal-wc-badge"),modalCelestialBadge=document.getElementById("modal-celestial-badge"),modalCraftBadge=document.getElementById("modal-crafted-badge"),modalSellHint=document.getElementById("modal-sell-hint"),modalClose=document.getElementById("modal-close"),cpsBadge=document.getElementById("cps-badge"),cpsVal=document.getElementById("cps-val"),comboBadge=document.getElementById("combo-badge"),comboVal=document.getElementById("combo-val"),ppBadge=document.getElementById("pp-badge"),ppDisplay=document.getElementById("pp-display"),sellAllBtn=document.getElementById("sell-all-btn"),achToast=document.getElementById("achievement-toast"),toastIcon=document.getElementById("toast-icon"),toastLabel=document.getElementById("toast-label"),toastName=document.getElementById("toast-name"),dailyBanner=document.getElementById("daily-banner"),dailyTitle=document.getElementById("daily-title"),dailySub=document.getElementById("daily-sub"),dailyClaim=document.getElementById("daily-claim-btn"),soundBtn=document.getElementById("sound-btn"),settingsBtn=document.getElementById("settings-btn"),statsBtn=document.getElementById("stats-btn"),settingsOverlay=document.getElementById("settings-overlay"),settingsClose=document.getElementById("settings-close-btn"),settingsReset=document.getElementById("settings-reset-btn"),soundToggle=document.getElementById("sound-toggle"),floaterToggle=document.getElementById("floater-toggle"),darkmodeToggle=document.getElementById("darkmode-toggle"),notifToggle=document.getElementById("notif-toggle"),wcBannerToggle=document.getElementById("wc-banner-toggle"),prestigeOverlay=document.getElementById("prestige-overlay"),prestigeBanner=document.getElementById("prestige-banner"),prestigeBanBtn=document.getElementById("prestige-banner-btn"),prestigeConfirm=document.getElementById("prestige-confirm-btn"),prestigeCancel=document.getElementById("prestige-cancel-btn"),prestigeBadge=document.getElementById("prestige-badge"),prestigeMultD=document.getElementById("prestige-mult-display"),prestigeMultP=document.getElementById("prestige-mult-preview"),prestigeChip=document.getElementById("prestige-chip"),statPrestige=document.getElementById("stat-prestige"),statPp=document.getElementById("stat-pp"),prestigeRwdPrev=document.getElementById("prestige-rewards-preview"),collSearch=document.getElementById("coll-search"),statsOverlay=document.getElementById("stats-overlay"),statsGrid=document.getElementById("stats-grid"),statsClose=document.getElementById("stats-close-btn"),autoSellBtn=document.getElementById("auto-sell-toggle-btn"),autoSellPanel=document.getElementById("auto-sell-panel"),autoSellOptions=document.getElementById("auto-sell-options"),comboMeterWrap=document.getElementById("combo-meter-wrap"),comboLabelVal=document.getElementById("combo-label-val"),comboMeterBar=document.getElementById("combo-meter-bar"),notifArea=document.getElementById("notif-area"),pshopPpDisplay=document.getElementById("pshop-pp-display"),trophyCount=document.getElementById("trophy-count"),trophyTotal=document.getElementById("trophy-total"),wcTimerDisp=document.getElementById("wc-timer-display"),wcTimerBar=document.getElementById("wc-timer-bar"),wcDaysLeft=document.getElementById("wc-days-left"),wcClaimBtn=document.getElementById("wc-claim-btn"),wcDaysRow=document.getElementById("wc-days-row"),wcMatchDisplay=document.getElementById("wc-match-display"),wcPredictResult=document.getElementById("wc-predict-result");

// ── PRESTIGE SHOP HELPERS ─────────────────────────────
function getPsLevel(id){return prestigeShopLevels[id]||0;}
function getPsClickBonus(){return getPsLevel("ps_click_bonus");}
function getPsCpsBoost(){return 1+getPsLevel("ps_cps_boost")*0.25;}
function getPsLuckyDiscount(){return getPsLevel("ps_lucky_discount")*0.2;}
function getPsBoxDiscount(){return getPsLevel("ps_box_discount")*0.1;}
function getPsSellBoost(){return 1+getPsLevel("ps_sell_boost")*0.25;}
function getPsCelestialBonus(){return getPsLevel("ps_celestial_luck")*0.1;}
function getBoxPrice(box){return Math.max(1,Math.floor(box.price*(1-getPsBoxDiscount())));}
function getSellValue(food){return Math.floor(food.sellValue*getPsSellBoost());}

// ── HELPERS ────────────────────────────────────────────
function getPrestigeMult(){return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount,PRESTIGE_MULTIPLIERS.length-1)];}
function getNextPrestigeMult(){return PRESTIGE_MULTIPLIERS[Math.min(prestigeCount+1,PRESTIGE_MULTIPLIERS.length-1)];}
function getComboMult(){return COMBO_LEVELS[Math.min(comboTier,COMBO_LEVELS.length-1)];}
function updateMoney(){moneyEl.textContent=money.toLocaleString();}
function updateSC(){stadiumCoins=Math.max(0,stadiumCoins);scEl.textContent=stadiumCoins.toLocaleString();wcCurrEl.textContent=stadiumCoins.toLocaleString();}
function updateStats(){
  clicksEl.textContent=totalClicks.toLocaleString();boxesEl.textContent=totalBoxes.toLocaleString();
  foodsEl.textContent=Object.values(collection).reduce((s,v)=>s+v.count,0).toLocaleString();
  streakEl.textContent=loginStreak;updateSC();updatePrestigeUI();
}
function updatePrestigeUI(){
  const mult=getPrestigeMult();
  if(prestigeCount>0){prestigeBadge.style.display="inline-flex";prestigeMultD.textContent=mult.toFixed(1);prestigeChip.style.display="inline-flex";statPrestige.textContent=prestigeCount;statPp.textContent=prestigePoints;}
  const eligible=money>=PRESTIGE_THRESHOLD&&prestigeCount<PRESTIGE_MULTIPLIERS.length-1;
  prestigeBanner.style.display=eligible?"flex":"none";
  if(eligible&&prestigeMultP)prestigeMultP.textContent="×"+getNextPrestigeMult().toFixed(1);
  updateCoinLabel();updatePpDisplay();
}
function updatePpDisplay(){ppDisplay.textContent=prestigePoints;if(pshopPpDisplay)pshopPpDisplay.textContent=prestigePoints;ppBadge.style.display=prestigePoints>0?"inline-flex":"none";}
function updateCoinLabel(){const pm=getPrestigeMult(),cm=getComboMult(),pb=getPsClickBonus();const t=(pm*cm+pb).toFixed(2);coinLabel.textContent=(pm>1||cm>1||pb>0)?`Click to earn +${t} coins!`:"Click to earn coins!";}
function spawnFloater(x,y,amount,color){if(!showFloaters)return;const el=document.createElement("div");el.className="floater";el.textContent=`+${amount}`;if(color)el.style.color=color;el.style.left=(x-20)+"px";el.style.top=(y-30)+"px";document.body.appendChild(el);el.addEventListener("animationend",()=>el.remove());}
function showNotif(text,type="milestone"){if(!notifEnabled)return;const pill=document.createElement("div");pill.className=`notif-pill type-${type}`;pill.textContent=text;notifArea.appendChild(pill);setTimeout(()=>{pill.classList.add("out");setTimeout(()=>pill.remove(),350);},2500);}
function getTotalCps(){return Math.floor(UPGRADES.reduce((s,u)=>s+u.baseCps*(upgradeLevels[u.id]||0),0)*getPrestigeMult()*getPsCpsBoost());}
function getUpgradeCost(u){return Math.floor(u.baseCost*Math.pow(u.costScale,upgradeLevels[u.id]||0));}
function getLuckyCost(lu){return Math.floor(lu.baseCost*Math.pow(lu.costScale,luckyLevels[lu.id]||0)*(1-getPsLuckyDiscount()));}
function updateCpsBadge(){const c=getTotalCps();cpsBadge.style.display=c>0?"inline-flex":"none";cpsVal.textContent=c.toLocaleString();}

// ── COMBO ─────────────────────────────────────────────
function updateCombo(){
  const old=comboTier;comboTier=0;
  for(let i=COMBO_THRESHOLDS.length-1;i>=0;i--){if(comboCount>=COMBO_THRESHOLDS[i]){comboTier=i;break;}}
  const mult=getComboMult();
  if(comboTier>0){comboBadge.style.display="inline-flex";comboVal.textContent=mult.toFixed(1)+"x";comboMeterWrap.style.display="block";comboLabelVal.textContent="×"+mult.toFixed(1);coinBtn.classList.add("combo-active");}
  else{comboBadge.style.display="none";comboMeterWrap.style.display="none";coinBtn.classList.remove("combo-active");}
  const ni=Math.min(comboTier+1,COMBO_THRESHOLDS.length-1),from=COMBO_THRESHOLDS[comboTier],to=COMBO_THRESHOLDS[ni];
  const pct=comboTier>=COMBO_THRESHOLDS.length-1?100:((comboCount-from)/(to-from))*100;
  comboMeterBar.style.width=Math.min(pct,100)+"%";
  if(comboTier>old&&comboTier>0){playSound("combo");showNotif(`🔥 Combo ×${mult.toFixed(1)}!`,"combo");}
  if(mult>maxComboReached){maxComboReached=mult;checkAchievements();}
  updateCoinLabel();
}
function resetCombo(){comboCount=0;comboTier=0;comboBadge.style.display="none";comboMeterWrap.style.display="none";coinBtn.classList.remove("combo-active");updateCoinLabel();}

// ── COIN CLICK ─────────────────────────────────────────
let clickCounter=0;
coinBtn.addEventListener("click",(e)=>{
  const pm=getPrestigeMult(),cm=getComboMult(),pb=getPsClickBonus();
  const earned=Math.max(1,Math.floor(pm*cm)+pb);
  money+=earned;totalClicks++;clickCounter++;
  if(clickCounter%10===0){stadiumCoins++;updateSC();spawnFloater(e.clientX-20,e.clientY-55,"1⚽","#ffd700");playSound("wc");showNotif("⚽ +1 Stadium Coin!","wc");}
  updateMoney();updateStats();playSound(cm>1?"combo":"click");
  coinBtn.classList.add("popping");setTimeout(()=>coinBtn.classList.remove("popping"),100);
  spawnFloater(e.clientX,e.clientY,earned,cm>1?"#ffaa44":null);
  comboCount++;clearTimeout(comboDecayTimer);comboDecayTimer=setTimeout(()=>resetCombo(),COMBO_DECAY_MS);updateCombo();
  renderBoxButtons();renderUpgrades();renderLucky();renderWCBoxes();
  checkAchievements();checkTrophies();
  if([100,500,1000,5000,10000].includes(totalClicks))showNotif(`🎉 ${totalClicks.toLocaleString()} clicks!`,"milestone");
});

// ── AUTO-CLICKER ───────────────────────────────────────
setInterval(()=>{const c=getTotalCps();if(c>0){accCoins+=c/4;if(accCoins>=1){const a=Math.floor(accCoins);accCoins-=a;money+=a;updateMoney();updatePrestigeUI();}}},250);

// ── PICK FOOD ──────────────────────────────────────────
function getModifiedWeights(box){
  const w={...box.weights};
  LUCKY_UPGRADES.forEach(lu=>{const l=luckyLevels[lu.id]||0;if(l>0)lu.apply(w,l);});
  if(box.name==="Celestial Box"){w.celestial=(w.celestial||0)+getPsCelestialBonus()*100;}
  return w;
}
function pickFood(box){
  const w=getModifiedWeights(box);const total=Object.values(w).reduce((a,b)=>a+b,0);
  let rand=Math.random()*total,chosen="common";
  for(const[r,wt]of Object.entries(w)){if(wt<=0)continue;rand-=wt;if(rand<=0){chosen=r;break;}}
  const pool=FOODS.filter(f=>f.rarity===chosen);
  return pool.length>0?pool[Math.floor(Math.random()*pool.length)]:FOODS[0];
}
function pickWCFood(box){
  const w=getModifiedWeights(box);const total=Object.values(w).reduce((a,b)=>a+b,0);
  let rand=Math.random()*total,chosen="wc";
  for(const[r,wt]of Object.entries(w)){if(wt<=0)continue;rand-=wt;if(rand<=0){chosen=r;break;}}
  const pool=WC_FOODS.filter(f=>f.rarity===chosen);
  return pool.length>0?pool[Math.floor(Math.random()*pool.length)]:WC_FOODS[0];
}

// ── OPEN BOX ───────────────────────────────────────────
function openBox(idx){
  const box=BOXES[idx],price=getBoxPrice(box);if(money<price)return;
  money-=price;totalBoxes++;
  if(idx===3)totalUltraBoxes++;if(idx===4)totalCosmicBoxes++;if(idx===5)totalCelestialBoxes++;
  updateMoney();updateStats();renderBoxButtons();
  const food=pickFood(box);registerFood(food);
  const snd=food.rarity==="celestial"?"celestial":["legendary","mythic"].includes(food.rarity)?"legendary":["rare","epic"].includes(food.rarity)?"rare":"box";
  playSound(snd);showFoodModal(food,false,false);checkAchievements();checkTrophies();
  if(autoSellEnabled&&collection[food.name]&&collection[food.name].count>autoSellThreshold)setTimeout(()=>sellDupe(food.name),600);
}
function openWCBox(idx){
  const box=WC_BOXES[idx];if(stadiumCoins<box.price)return;
  stadiumCoins-=box.price;totalWCBoxes++;updateSC();renderWCBoxes();
  const food=pickWCFood(box);registerFood(food);wcFoodsFound.add(food.name);
  playSound(food.rarity==="wc-legendary"?"legendary":"rare");showFoodModal(food,true,false);
  checkAchievements();checkTrophies();
}
function registerFood(food){
  if(!collection[food.name])collection[food.name]={food,count:0};
  collection[food.name].count++;rarityFound.add(food.rarity);renderCollection();
}

// ── SHOW MODAL ─────────────────────────────────────────
function showFoodModal(food,isWC,isCrafted){
  modalIcon.textContent=food.icon;
  modalRar.textContent=RARITIES[food.rarity]?.label||food.rarity.toUpperCase();
  const cls=isWC?"rarity-color-wc":isCrafted?"rarity-color-crafted":"rarity-color-"+food.rarity;
  modalRar.className="modal-rarity-label "+cls;modalName.textContent=food.name;modalName.className="modal-food-name "+cls;
  modalDesc.textContent=food.desc;
  modalWcBadge.style.display=isWC?"inline-block":"none";
  modalCelestialBadge.style.display=food.rarity==="celestial"?"inline-block":"none";
  modalCraftBadge.style.display=isCrafted?"inline-block":"none";
  modalSellHint.textContent=`Sell value: ${getSellValue(food)} 🪙`;
  if(isWC){resultModal.classList.add("wc-modal");resultModal.classList.remove("celestial-modal");modalName.classList.add("wc-shine");setTimeout(()=>modalName.classList.remove("wc-shine"),1700);showNotif("⚽ World Cup food drop!","wc");}
  else if(food.rarity==="celestial"){resultModal.classList.add("celestial-modal");resultModal.classList.remove("wc-modal");modalName.classList.add("celestial-shine");setTimeout(()=>modalName.classList.remove("celestial-shine"),2100);showNotif("🌌 CELESTIAL drop!","celestial");}
  else{resultModal.classList.remove("wc-modal","celestial-modal");if(["legendary","mythic"].includes(food.rarity)||isCrafted){modalName.classList.add("shine");setTimeout(()=>modalName.classList.remove("shine"),1300);}}
  overlay.classList.add("show");
}
modalClose.addEventListener("click",()=>overlay.classList.remove("show"));
overlay.addEventListener("click",(e)=>{if(e.target===overlay)overlay.classList.remove("show");});

// ── WC EVENT ───────────────────────────────────────────
const WC_END = new Date("2026-07-18T23:59:59").getTime();
const WC_TOTAL_MS = 38*24*60*60*1000; // approx event length for progress bar

function initWCEvent(){
  const stored=localStorage.getItem("ff_wcDays");wcDaysClaimed=stored?JSON.parse(stored):[];
  predictedToday=localStorage.getItem("ff_predictDate")===new Date().toDateString();
  correctPredictions=parseInt(localStorage.getItem("ff_correctPredictions")||"0");
  renderWCDaysRow();renderMatchPredict();updateWCTimer();setInterval(updateWCTimer,1000);
  const claimed=localStorage.getItem("ff_wcDayClaimedDate")===new Date().toDateString();
  wcClaimBtn.disabled=claimed||wcDaysClaimed.length>=24;
  if(wcDaysClaimed.length>=24)wcClaimBtn.textContent="All 24 Days Claimed! 🏆";
  else if(claimed)wcClaimBtn.textContent="Come back tomorrow ⚽";
}

function updateWCTimer(){
  const remaining=Math.max(0,WC_END-Date.now());
  const progress=Math.max(0,remaining/WC_TOTAL_MS);
  const d=Math.floor(remaining/86400000),h=Math.floor((remaining%86400000)/3600000),m=Math.floor((remaining%3600000)/60000),s=Math.floor((remaining%60000)/1000);
  if(wcTimerDisp)wcTimerDisp.textContent=`${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  if(wcTimerBar)wcTimerBar.style.width=(progress*100)+"%";
  if(wcDaysLeft)wcDaysLeft.textContent=d;
}

function renderWCDaysRow(){
  if(!wcDaysRow)return;wcDaysRow.innerHTML="";
  WC_DAILY_REWARDS.forEach(day=>{
    const claimed=wcDaysClaimed.includes(day.day),isNext=wcDaysClaimed.length+1===day.day;
    const chip=document.createElement("div");chip.className="wc-day-chip"+(claimed?" claimed":isNext?" today":" future");
    chip.innerHTML=`<span class="wc-day-flag">${claimed?"✅":day.flag}</span><span class="wc-day-num">D${day.day}</span><span class="wc-day-reward">${claimed?"✓":day.label}</span>`;
    wcDaysRow.appendChild(chip);
  });
}

wcClaimBtn&&wcClaimBtn.addEventListener("click",()=>{
  const next=wcDaysClaimed.length+1;if(next>24)return;
  const reward=WC_DAILY_REWARDS[next-1];stadiumCoins+=reward.reward;wcDaysClaimed.push(next);
  updateSC();renderWCDaysRow();renderWCBoxes();
  localStorage.setItem("ff_wcDays",JSON.stringify(wcDaysClaimed));localStorage.setItem("ff_wcDayClaimedDate",new Date().toDateString());
  wcClaimBtn.disabled=true;wcClaimBtn.textContent=next>=24?"All 24 Days Claimed! 🏆":"Come back tomorrow ⚽";
  playSound("wc");const r=wcClaimBtn.getBoundingClientRect();spawnFloater(r.left+r.width/2,r.top+window.scrollY-10,`${reward.reward}⚽`,"#ffd700");
  showNotif(`⚽ ${reward.flag} ${reward.country} Day! +${reward.reward} SC`,"wc");checkAchievements();checkTrophies();
});

function renderMatchPredict(){
  if(!wcMatchDisplay)return;
  const match=getTodayMatch(),winner=getTodayMatchWinner();
  wcMatchDisplay.innerHTML="";
  const homeBtn=document.createElement("button"),awayBtn=document.createElement("button"),vsEl=document.createElement("div");
  homeBtn.className="wc-team-btn";awayBtn.className="wc-team-btn";vsEl.className="wc-vs";
  const [homeFlag,...homeParts]=match.home.split(" ");const [awayFlag,...awayParts]=match.away.split(" ");
  homeBtn.innerHTML=`<div class="wc-team-flag">${homeFlag}</div><div class="wc-team-name">${homeParts.join(" ")}</div>`;
  awayBtn.innerHTML=`<div class="wc-team-flag">${awayFlag}</div><div class="wc-team-name">${awayParts.join(" ")}</div>`;
  vsEl.textContent="VS";
  if(predictedToday){
    const stored=localStorage.getItem("ff_predictChoice");
    homeBtn.disabled=true;awayBtn.disabled=true;
    if(stored==="home"){homeBtn.classList.add(winner==="home"?"correct":"wrong");awayBtn.classList.add(winner==="home"?"wrong":"correct");}
    else{awayBtn.classList.add(winner==="away"?"correct":"wrong");homeBtn.classList.add(winner==="away"?"wrong":"correct");}
    wcPredictResult.style.display="block";
    const correct=(stored===winner);wcPredictResult.textContent=correct?`✅ Correct! +40⚽ earned!`:`❌ Wrong guess! Better luck tomorrow.`;
  } else {
    homeBtn.addEventListener("click",()=>makePrediction("home",winner,homeBtn,awayBtn));
    awayBtn.addEventListener("click",()=>makePrediction("away",winner,awayBtn,homeBtn));
  }
  wcMatchDisplay.appendChild(homeBtn);wcMatchDisplay.appendChild(vsEl);wcMatchDisplay.appendChild(awayBtn);
}

function makePrediction(choice,winner,selectedBtn,otherBtn){
  predictedToday=true;
  localStorage.setItem("ff_predictDate",new Date().toDateString());
  localStorage.setItem("ff_predictChoice",choice);
  selectedBtn.disabled=true;otherBtn.disabled=true;
  const correct=(choice===winner);
  selectedBtn.classList.add(correct?"correct":"wrong");
  otherBtn.classList.add(correct?"wrong":"correct");
  if(correct){
    stadiumCoins+=40;updateSC();correctPredictions++;
    localStorage.setItem("ff_correctPredictions",correctPredictions);
    playSound("predict_win");showNotif("🎯 Correct prediction! +40 SC","wc");
    spawnFloater(window.innerWidth/2,window.innerHeight/2,"40⚽","#ffd700");
  } else {showNotif("❌ Wrong prediction! Try tomorrow.","wc");}
  wcPredictResult.style.display="block";
  wcPredictResult.textContent=correct?`✅ Correct! +40⚽ earned!`:`❌ Wrong guess! Better luck tomorrow.`;
  renderWCBoxes();checkAchievements();checkTrophies();
}

// ── CRAFTING ───────────────────────────────────────────
function canCraft(r){return r.ingredients.every(i=>collection[i.name]&&collection[i.name].count>=i.qty);}
function craftRecipe(id){
  const r=RECIPES.find(x=>x.id===id);if(!r||!canCraft(r))return;
  r.ingredients.forEach(i=>{collection[i.name].count-=i.qty;if(collection[i.name].count<=0)delete collection[i.name];});
  registerFood(r.food);craftedSet.add(id);playSound("craft");showFoodModal(r.food,false,true);renderRecipes();checkAchievements();checkTrophies();
}

// ── UPGRADES ───────────────────────────────────────────
function buyUpgrade(idx){
  const u=UPGRADES[idx],lvl=upgradeLevels[u.id]||0;if(lvl>=u.maxLevel)return;
  const c=getUpgradeCost(u);if(money<c)return;
  money-=c;upgradeLevels[u.id]=lvl+1;updateMoney();updateCpsBadge();renderUpgrades();renderBoxButtons();
}
function buyLucky(idx){
  const lu=LUCKY_UPGRADES[idx],lvl=luckyLevels[lu.id]||0;if(lvl>=lu.maxLevel)return;
  const c=getLuckyCost(lu);if(money<c)return;
  money-=c;luckyLevels[lu.id]=lvl+1;luckyBought++;if(luckyLevels[lu.id]===lu.maxLevel)luckyMaxed++;
  updateMoney();playSound("lucky");showNotif(`🍀 ${lu.name} Lvl ${luckyLevels[lu.id]}!`,"milestone");renderLucky();renderBoxButtons();checkAchievements();
}
function buyPrestigeShop(idx){
  const p=PRESTIGE_SHOP[idx],lvl=getPsLevel(p.id);if(lvl>=p.maxLevel)return;
  const cost=p.costs[lvl];if(prestigePoints<cost)return;
  prestigePoints-=cost;totalPpSpent+=cost;prestigeShopLevels[p.id]=(lvl+1);
  updatePpDisplay();playSound("pshop");showNotif(`✨ ${p.name} purchased!`,"prestige");
  renderPrestigeShop();renderBoxButtons();renderUpgrades();renderLucky();checkAchievements();
}

// ── SELL ───────────────────────────────────────────────
function sellDupe(n){const e=collection[n];if(!e||e.count<=1)return;const earn=(e.count-1)*getSellValue(e.food);e.count=1;money+=earn;totalSellEarned+=earn;playSound("sell");updateMoney();renderCollection();checkAchievements();checkTrophies();}
function sellAllDupes(){
  let t=0;Object.keys(collection).forEach(n=>{const e=collection[n];if(e.count>1){t+=(e.count-1)*getSellValue(e.food);totalSellEarned+=(e.count-1)*getSellValue(e.food);e.count=1;}});
  if(t>0){money+=t;updateMoney();renderCollection();checkAchievements();checkTrophies();playSound("sell");const r=sellAllBtn.getBoundingClientRect();spawnFloater(r.left+r.width/2,r.top+window.scrollY-10,t,"#5dde78");showNotif(`💰 Sold dupes for ${t.toLocaleString()} 🪙!`,"sell");}
}
sellAllBtn.addEventListener("click",sellAllDupes);

// ── AUTO SELL ──────────────────────────────────────────
function initAutoSell(){
  const opts=[2,3,5,10];autoSellOptions.innerHTML="";
  opts.forEach(n=>{const btn=document.createElement("button");btn.className="auto-sell-opt"+(autoSellThreshold===n?" selected":"");btn.textContent=`>${n}`;btn.addEventListener("click",()=>{autoSellThreshold=n;initAutoSell();});autoSellOptions.appendChild(btn);});
}
autoSellBtn.addEventListener("click",()=>{
  autoSellEnabled=!autoSellEnabled;autoSellBtn.textContent=`🔄 Auto-Sell: ${autoSellEnabled?"ON":"OFF"}`;autoSellBtn.classList.toggle("active",autoSellEnabled);autoSellPanel.style.display=autoSellEnabled?"block":"none";
  if(autoSellEnabled){playSound("autosell");showNotif(`🔄 Auto-Sell ON (>${autoSellThreshold})`, "sell");checkAchievements();}
});

// ── PRESTIGE ───────────────────────────────────────────
function openPrestigeModal(){prestigeRwdPrev.innerHTML=`Mult: <strong style="color:#c87eff">×${getPrestigeMult().toFixed(1)}</strong> → <strong style="color:#ffe680">×${getNextPrestigeMult().toFixed(1)}</strong> + <strong style="color:#ffe566">+1 ✨ PP</strong>`;prestigeOverlay.classList.add("show");}
function doPrestige(){
  prestigeCount++;prestigePoints++;
  const startCoins=PRESTIGE_SHOP[0].getValue(getPsLevel("ps_start_coins"));
  money=startCoins;totalBoxes=0;totalUltraBoxes=0;totalCosmicBoxes=0;totalCelestialBoxes=0;totalWCBoxes=0;
  totalClicks=0;collection={};upgradeLevels={};luckyLevels={};totalSellEarned=0;craftedSet=new Set();rarityFound=new Set();accCoins=0;luckyBought=0;luckyMaxed=0;comboCount=0;comboTier=0;maxComboReached=1;
  renderCollection();renderBoxButtons();renderUpgrades();renderLucky();renderRecipes();renderPrestigeShop();
  updateMoney();updateStats();updateCpsBadge();updatePpDisplay();prestigeOverlay.classList.remove("show");playSound("prestige");
  showNotif(`⭐ Prestige ${prestigeCount}! +1 PP earned.`,"prestige");checkAchievements();checkTrophies();
  prestigeBadge.classList.add("prestige-shine");setTimeout(()=>prestigeBadge.classList.remove("prestige-shine"),1500);
}
prestigeBanBtn.addEventListener("click",openPrestigeModal);
prestigeConfirm.addEventListener("click",doPrestige);
prestigeCancel.addEventListener("click",()=>prestigeOverlay.classList.remove("show"));
prestigeOverlay.addEventListener("click",(e)=>{if(e.target===prestigeOverlay)prestigeOverlay.classList.remove("show");});

// ── TROPHIES ───────────────────────────────────────────
function getState(){return{totalClicks,totalBoxes,rarityFound,craftedSet,prestigeCount,loginStreak,totalSellEarned,maxComboReached,totalPpSpent,totalCelestialBoxes,totalWCBoxes,wcFoodsFound,correctPredictions,trophiesEarned};}
function checkTrophies(){
  const s=getState();let anyNew=false;
  TROPHIES.forEach(t=>{if(trophiesUnlocked.has(t.id))return;if(t.condition(s)){trophiesUnlocked.add(t.id);trophiesEarned++;anyNew=true;playSound("trophy");showNotif(`🏅 Trophy: ${t.name}!`,"milestone");}});
  if(!trophiesUnlocked.has("t_all_trophies")&&trophiesEarned>=15){trophiesUnlocked.add("t_all_trophies");trophiesEarned++;playSound("trophy");showNotif("🏅 Trophy: Trophy Hunter!","milestone");}
  if(anyNew){renderTrophies();checkAchievements();}
  if(trophyCount)trophyCount.textContent=trophiesEarned;if(trophyTotal)trophyTotal.textContent=TROPHIES.length;
}

// ── STATS ──────────────────────────────────────────────
statsBtn.addEventListener("click",()=>{
  const cells=[{label:"Total Clicks",value:totalClicks.toLocaleString()},{label:"Boxes Opened",value:totalBoxes.toLocaleString()},{label:"Coins from Selling",value:totalSellEarned.toLocaleString()},{label:"Login Streak",value:loginStreak+" 🔥"},{label:"Prestige Count",value:prestigeCount},{label:"Prestige Mult",value:"×"+getPrestigeMult().toFixed(1)},{label:"Prestige Points",value:prestigePoints+" ✨"},{label:"Best Combo",value:"×"+maxComboReached.toFixed(1)},{label:"Stadium Coins",value:stadiumCoins+" ⚽"},{label:"WC Foods Found",value:wcFoodsFound.size+" / 16"},{label:"Match Predictions",value:correctPredictions+" correct"},{label:"Trophies Earned",value:trophiesEarned+" / "+TROPHIES.length}];
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
wcBannerToggle&&wcBannerToggle.addEventListener("change",()=>{document.getElementById("wc-banner").style.display=wcBannerToggle.checked?"flex":"none";});
soundBtn.addEventListener("click",()=>{soundEnabled=!soundEnabled;soundToggle.checked=soundEnabled;soundBtn.textContent=soundEnabled?"🔊":"🔇";soundBtn.classList.toggle("muted",!soundEnabled);});
settingsReset.addEventListener("click",()=>{if(confirm("⚠️ Reset ALL save data? This cannot be undone!")){localStorage.clear();location.reload();}});
collSearch.addEventListener("input",()=>{collSearchQuery=collSearch.value.toLowerCase().trim();renderCollection();});

// ── DAILY BONUS ────────────────────────────────────────
function checkDailyBonus(){
  const today=new Date().toDateString(),last=localStorage.getItem("ff_lastLogin")||"",streak=parseInt(localStorage.getItem("ff_streak")||"0");
  if(localStorage.getItem("ff_claimed")===today)return;
  const yesterday=new Date(Date.now()-86400000).toDateString();
  const shieldActive=getPsLevel("ps_streak_shield")>0;
  loginStreak=(last===yesterday)?streak+1:(shieldActive?Math.max(3,1):1);
  const bonus=Math.min(loginStreak*10,200);
  dailyTitle.textContent=`Day ${loginStreak} Bonus! 🎉`;dailySub.textContent=`Login streak reward: +${bonus} 🪙`;dailyClaim.textContent=`Claim +${bonus} 🪙`;dailyBanner.style.display="flex";
  dailyClaim.addEventListener("click",()=>{money+=bonus;updateMoney();renderBoxButtons();dailyBanner.style.display="none";localStorage.setItem("ff_lastLogin",today);localStorage.setItem("ff_streak",loginStreak);localStorage.setItem("ff_claimed",today);updateStats();checkAchievements();checkTrophies();},{once:true});
}

// ── ACHIEVEMENTS ───────────────────────────────────────
let toastQueue=[],toastRunning=false;
function checkAchievements(){
  let anyNew=false;
  ACHIEVEMENTS.forEach(ach=>{
    if(achievementsDone.has(ach.id))return;
    let done=false;
    switch(ach.type){
      case"clicks":             done=totalClicks>=ach.target;break;
      case"combo":              done=maxComboReached>=ach.target;break;
      case"boxes":              done=totalBoxes>=ach.target;break;
      case"ultraBoxes":         done=totalUltraBoxes>=ach.target;break;
      case"cosmicBoxes":        done=totalCosmicBoxes>=ach.target;break;
      case"celestialBoxes":     done=totalCelestialBoxes>=ach.target;break;
      case"wcBoxes":            done=totalWCBoxes>=ach.target;break;
      case"unique":             done=Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isWC).length>=ach.target;break;
      case"rarity":             done=rarityFound.has(ach.target);break;
      case"streak":             done=loginStreak>=ach.target;break;
      case"sellTotal":          done=totalSellEarned>=ach.target;break;
      case"crafted":            done=craftedSet.size>=ach.target;break;
      case"prestige":           done=prestigeCount>=ach.target;break;
      case"ppSpent":            done=totalPpSpent>=ach.target;break;
      case"trophies":           done=trophiesEarned>=ach.target;break;
      case"autoSell":           done=autoSellEnabled;break;
      case"wcFoods":            done=wcFoodsFound.size>=ach.target;break;
      case"wcDays":             done=wcDaysClaimed.length>=ach.target;break;
      case"correctPredictions": done=correctPredictions>=ach.target;break;
    }
    if(done){
      achievementsDone.add(ach.id);
      if(ach.rewardType==="sc"){stadiumCoins+=ach.reward;updateSC();}else{money+=ach.reward;updateMoney();}
      playSound("achievement");toastQueue.push(ach);anyNew=true;
    }
  });
  if(anyNew){runToastQueue();renderAchievements();}
}
function runToastQueue(){
  if(toastRunning||toastQueue.length===0)return;toastRunning=true;
  const ach=toastQueue.shift();toastIcon.textContent=ach.icon;
  const rs=ach.rewardType==="sc"?`+${ach.reward} ⚽`:`+${ach.reward} 🪙`;toastName.textContent=`${ach.name} (${rs})`;
  if(ach.isWC){achToast.classList.add("wc-toast");toastLabel.textContent="⚽ WC Achievement!";toastLabel.className="toast-label wc-toast-label";}
  else{achToast.classList.remove("wc-toast");toastLabel.textContent="Achievement Unlocked!";toastLabel.className="toast-label";}
  achToast.classList.add("show");
  setTimeout(()=>{achToast.classList.remove("show");setTimeout(()=>{toastRunning=false;runToastQueue();},400);},3200);
}

// ── RENDERS ────────────────────────────────────────────
function renderBoxButtons(){
  const grid=document.getElementById("boxes-grid");grid.innerHTML="";
  BOXES.forEach((box,i)=>{const price=getBoxPrice(box);const card=document.createElement("div");card.className="box-card"+(box.cardClass?" "+box.cardClass:"");card.innerHTML=`<div class="box-icon">${box.icon}</div><div class="box-name">${box.name}</div><div class="box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="box-price">🪙 ${price.toLocaleString()}</div><button class="box-btn ${box.btnClass}" ${money<price?"disabled":""}>Open!</button>`;card.querySelector("button").addEventListener("click",()=>openBox(i));grid.appendChild(card);});
}
function renderWCBoxes(){
  const grid=document.getElementById("wc-boxes-grid");if(!grid)return;grid.innerHTML="";
  WC_BOXES.forEach((box,i)=>{const card=document.createElement("div");card.className="wc-box-card"+(box.cardClass?" "+box.cardClass:"");card.innerHTML=`<div class="wc-box-icon">${box.icon}</div><div class="wc-box-name">${box.name}</div><div class="wc-box-desc">${box.desc}</div><div class="box-odds">${box.odds}</div><div class="wc-box-price">⚽ ${box.price} SC</div><button class="wc-box-btn ${box.cardClass==="golden-ticket-card"?"golden-btn":""}" ${stadiumCoins<box.price?"disabled":""}>Open!</button>`;card.querySelector("button").addEventListener("click",()=>openWCBox(i));grid.appendChild(card);});
}
function renderPrestigeShop(){
  const grid=document.getElementById("pshop-grid");if(!grid)return;grid.innerHTML="";
  if(pshopPpDisplay)pshopPpDisplay.textContent=prestigePoints;
  PRESTIGE_SHOP.forEach((p,i)=>{const lvl=getPsLevel(p.id),maxed=lvl>=p.maxLevel,cost=maxed?0:p.costs[lvl];const card=document.createElement("div");card.className="pshop-card"+(lvl>0?" owned":"")+(maxed?" maxed-card":"");const effectStr=lvl>0?`Current: ${p.effects[lvl-1]}`:"Not purchased";card.innerHTML=`<div class="pshop-icon">${p.icon}</div><div class="pshop-info"><div class="pshop-name">${p.name}</div><div class="pshop-desc">${p.desc}</div><span class="pshop-effect">Lvl ${lvl}/${p.maxLevel} · ${effectStr}</span></div><div class="pshop-right"><div class="pshop-cost">${maxed?"MAX":"✨ "+cost+" PP"}</div><button class="pshop-btn ${maxed?"owned-btn":""}" ${maxed||prestigePoints<cost?"disabled":""}>${maxed?"✅ Maxed":lvl>0?"Upgrade":"Buy"}</button></div>`;if(!maxed)card.querySelector("button").addEventListener("click",()=>buyPrestigeShop(i));grid.appendChild(card);});
}
function renderLucky(){
  const grid=document.getElementById("lucky-grid");if(!grid)return;grid.innerHTML="";
  LUCKY_UPGRADES.forEach((lu,i)=>{const lvl=luckyLevels[lu.id]||0,maxed=lvl>=lu.maxLevel,cost=getLuckyCost(lu);const card=document.createElement("div");card.className="lucky-card"+(maxed?" maxed":"");card.innerHTML=`<div class="lucky-icon">${lu.icon}</div><div class="lucky-info"><div class="lucky-name">${lu.name}</div><div class="lucky-desc">${lu.desc}</div><span class="lucky-effect">Lvl ${lvl}/${lu.maxLevel} · ${lvl>0?lu.effectLabel(lvl):"Not purchased"}</span></div><div class="lucky-right"><div class="lucky-price">${maxed?"—":"🪙 "+cost.toLocaleString()}</div><button class="lucky-btn ${maxed?"maxed-btn":""}" ${maxed||money<cost?"disabled":""}>${maxed?"MAX":"Buy"}</button></div>`;if(!maxed)card.querySelector("button").addEventListener("click",()=>buyLucky(i));grid.appendChild(card);});
}
function renderUpgrades(){
  const grid=document.getElementById("upgrades-grid");if(!grid)return;grid.innerHTML="";
  UPGRADES.forEach((u,i)=>{const lvl=upgradeLevels[u.id]||0,maxed=lvl>=u.maxLevel,cost=getUpgradeCost(u),cpsAmt=Math.floor(u.baseCps*lvl*getPrestigeMult()*getPsCpsBoost());const card=document.createElement("div");card.className="upgrade-card"+(maxed?" maxed":"");card.innerHTML=`<div class="upgrade-icon">${u.icon}</div><div class="upgrade-info"><div class="upgrade-name">${u.name}</div><div class="upgrade-desc">${u.desc}</div><span class="upgrade-level">Lvl ${lvl}/${u.maxLevel} · ${cpsAmt>0?`+${cpsAmt}/s`:"idle"}</span></div><div class="upgrade-right"><div class="upgrade-price">${maxed?"—":"🪙 "+cost.toLocaleString()}</div><button class="upgrade-btn ${maxed?"maxed-btn":""}" ${maxed||money<cost?"disabled":""}>${maxed?"MAX":"Buy"}</button></div>`;if(!maxed)card.querySelector("button").addEventListener("click",()=>buyUpgrade(i));grid.appendChild(card);});
}
function renderRecipes(){
  const list=document.getElementById("recipes-list");if(!list)return;list.innerHTML="";
  RECIPES.forEach(r=>{const craftable=canCraft(r),crafted=craftedSet.has(r.id);const card=document.createElement("div");card.className="recipe-card"+(craftable?" can-craft":"");const ings=r.ingredients.map((ing,i)=>{const e=collection[ing.name],has=e&&e.count>=ing.qty,have=e?e.count:0;return`${i>0?'<span class="recipe-plus">+</span>':""}<span class="recipe-ingredient ${has?"has-it":"missing"}">${ing.qty>1?`${ing.qty}× `:""}${ing.name} <span style="opacity:.6">(${have})</span></span>`;}).join("")+`<span class="recipe-arrow">→</span><span class="recipe-ingredient has-it">${r.icon} ${r.name}</span>`;card.innerHTML=`<div class="recipe-top"><div class="recipe-result-icon">${r.icon}</div><div class="recipe-info"><div class="recipe-name">${r.name}</div><div class="recipe-desc">${r.desc}</div><span class="recipe-rarity-badge">🍳 CRAFTED · sells for ${getSellValue(r.food)} 🪙</span></div></div><div class="recipe-ingredients">${ings}</div><button class="recipe-craft-btn ${crafted&&!craftable?"crafted-btn":""}" ${!craftable?"disabled":""}>${crafted&&!craftable?"✅ Crafted":craftable?"🍳 Craft!":"🔒 Need ingredients"}</button>`;if(craftable)card.querySelector("button").addEventListener("click",()=>craftRecipe(r.id));list.appendChild(card);});
}
function renderTrophies(){
  const grid=document.getElementById("trophies-grid");if(!grid)return;grid.innerHTML="";
  if(trophyCount)trophyCount.textContent=trophiesEarned;if(trophyTotal)trophyTotal.textContent=TROPHIES.length;
  TROPHIES.forEach(t=>{const earned=trophiesUnlocked.has(t.id);const card=document.createElement("div");card.className="trophy-card"+(earned?" earned":" locked");card.innerHTML=`<div class="trophy-icon">${earned?t.icon:"🔒"}</div><div class="trophy-name ${earned?"earned-name":""}">${t.name}</div><div class="trophy-desc">${earned?t.desc:"???"}</div><span class="trophy-tier ${t.tier}">${t.tier.toUpperCase()}</span>`;grid.appendChild(card);});
}
const ACH_CATS=["all","clicks","boxes","collection","recipes","prestige","worldcup","other"];
function renderAchFilterBar(){
  const bar=document.getElementById("ach-filter-bar");if(!bar)return;bar.innerHTML="";
  ACH_CATS.forEach(cat=>{const btn=document.createElement("button");btn.className="ach-filter-btn"+(achFilter===cat?" active":"");btn.textContent=cat==="worldcup"?"World Cup":cat.charAt(0).toUpperCase()+cat.slice(1);btn.addEventListener("click",()=>{achFilter=cat;renderAchFilterBar();renderAchievements();});bar.appendChild(btn);});
}
function renderAchievements(){
  const list=document.getElementById("achievements-list");if(!list)return;list.innerHTML="";
  const filtered=achFilter==="all"?ACHIEVEMENTS:achFilter==="worldcup"?ACHIEVEMENTS.filter(a=>a.isWC):ACHIEVEMENTS.filter(a=>a.cat===achFilter);
  const sorted=[...filtered].sort((a,b)=>{if(a.isWC&&!b.isWC)return -1;if(!a.isWC&&b.isWC)return 1;return 0;});
  sorted.forEach(ach=>{
    const done=achievementsDone.has(ach.id);let p=0;
    switch(ach.type){
      case"clicks":p=Math.min(totalClicks/ach.target,1);break;case"combo":p=Math.min(maxComboReached/ach.target,1);break;
      case"boxes":p=Math.min(totalBoxes/ach.target,1);break;case"ultraBoxes":p=Math.min(totalUltraBoxes/ach.target,1);break;
      case"cosmicBoxes":p=Math.min(totalCosmicBoxes/ach.target,1);break;case"celestialBoxes":p=Math.min(totalCelestialBoxes/ach.target,1);break;
      case"wcBoxes":p=Math.min(totalWCBoxes/ach.target,1);break;case"unique":p=Math.min(Object.keys(collection).filter(n=>!collection[n].food.isCrafted&&!collection[n].food.isWC).length/ach.target,1);break;
      case"rarity":p=rarityFound.has(ach.target)?1:0;break;case"streak":p=Math.min(loginStreak/ach.target,1);break;
      case"sellTotal":p=Math.min(totalSellEarned/ach.target,1);break;case"crafted":p=Math.min(craftedSet.size/ach.target,1);break;
      case"prestige":p=Math.min(prestigeCount/ach.target,1);break;case"ppSpent":p=Math.min(totalPpSpent/ach.target,1);break;
      case"trophies":p=Math.min(trophiesEarned/ach.target,1);break;case"autoSell":p=autoSellEnabled?1:0;break;
      case"wcFoods":p=Math.min(wcFoodsFound.size/ach.target,1);break;case"wcDays":p=Math.min(wcDaysClaimed.length/ach.target,1);break;
      case"correctPredictions":p=Math.min(correctPredictions/ach.target,1);break;
    }
    const pct=Math.round(p*100),rs=ach.rewardType==="sc"?`+${ach.reward} ⚽`:`+${ach.reward} 🪙`;
    const card=document.createElement("div");card.className="ach-card"+(done?" unlocked":"")+(ach.isWC?" wc-ach":"");
    card.innerHTML=`<div class="ach-icon ${done?"":"locked"}">${ach.icon}</div><div class="ach-info"><div class="ach-name ${ach.isWC?"wc-name":""}">${ach.name}</div><div class="ach-desc ${ach.isWC?"wc-desc":""}">${ach.desc}</div>${!done?`<div class="ach-progress-wrap"><div class="ach-progress-bar"><div class="ach-progress-fill ${pct>=100?"done":""} ${ach.isWC?"wc-fill":""}" style="width:${pct}%"></div></div><div class="ach-pct">${pct}%</div></div>`:""}</div><div class="ach-reward ${ach.isWC?"wc-reward":""}">${rs}</div>`;
    list.appendChild(card);
  });
}
function renderCollection(){
  collList.innerHTML="";
  const order=["wc-legendary","wc-rare","wc","celestial","crafted","mythic","legendary","epic","rare","uncommon","common"];
  let sorted=Object.values(collection).sort((a,b)=>order.indexOf(a.food.rarity)-order.indexOf(b.food.rarity));
  if(collSearchQuery)sorted=sorted.filter(({food})=>food.name.toLowerCase().includes(collSearchQuery)||food.rarity.toLowerCase().includes(collSearchQuery));
  if(sorted.length===0){collList.innerHTML=`<p class="empty-msg">${collSearchQuery?"No results found.":"Open boxes to discover foods!"}</p>`;return;}
  sorted.forEach(({food,count})=>{
    const item=document.createElement("div");const isWC=food.isWC,isCelestial=food.rarity==="celestial",isCrafted=food.isCrafted;
    item.className="coll-item"+(isWC?" wc-item":isCelestial?" celestial-item":isCrafted?" crafted-item":"");
    const hasDupe=count>1;
    const colorClass=isWC?"rarity-color-wc":isCelestial?"rarity-color-celestial":isCrafted?"rarity-color-crafted":"rarity-color-"+food.rarity;
    const dotClass=isWC?"dot-"+food.rarity.replace("-","_"):isCelestial?"dot-celestial":isCrafted?"dot-crafted":"dot-"+food.rarity;
    const safeDot=["wc","wc-rare","wc-legendary"].includes(food.rarity)?`dot-${food.rarity.replace("-","-")}`:dotClass;
    item.innerHTML=`<div class="rarity-dot ${safeDot}"></div><span class="coll-icon">${food.icon}</span><span class="coll-name ${colorClass}">${food.name}</span><span class="coll-count">×${count}</span>${hasDupe?`<button class="coll-sell-btn">Sell (${count-1}) +${(count-1)*getSellValue(food)}🪙</button>`:""}`;
    if(hasDupe)item.querySelector(".coll-sell-btn").addEventListener("click",()=>sellDupe(food.name));
    collList.appendChild(item);
  });
}

// ── TABS ───────────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
    btn.classList.add("active");document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
    if(btn.dataset.tab==="achievements"){renderAchFilterBar();renderAchievements();}
    if(btn.dataset.tab==="upgrades")renderUpgrades();
    if(btn.dataset.tab==="recipes")renderRecipes();
    if(btn.dataset.tab==="lucky")renderLucky();
    if(btn.dataset.tab==="prestige-shop")renderPrestigeShop();
    if(btn.dataset.tab==="trophies")renderTrophies();
    if(btn.dataset.tab==="worldcup"){renderWCBoxes();renderWCDaysRow();renderMatchPredict();}
  });
});

// ── INIT ───────────────────────────────────────────────
checkDailyBonus();initWCEvent();initAutoSell();
renderBoxButtons();renderWCBoxes();renderPrestigeShop();renderLucky();
renderUpgrades();renderRecipes();renderCollection();renderAchFilterBar();renderAchievements();renderTrophies();
updateCpsBadge();updatePrestigeUI();updateSC();updatePpDisplay();checkTrophies();