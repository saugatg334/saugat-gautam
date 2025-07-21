const STAGE_LIST = [
  { name: "Mahendra Highway", type: "Road", status: "Unlocked", levels: 100, unlockCost: 0 },
  { name: "Kathmandu City", type: "Urban", status: "Locked", levels: 100, unlockCost: 100 },
  { name: "Lumbini", type: "Cultural", status: "Locked", levels: 100, unlockCost: 150 },
  { name: "Pokhara", type: "Lake Hill", status: "Locked", levels: 100, unlockCost: 120 },
  { name: "Rara Lake", type: "Snow + Lake", status: "Locked", levels: 100, unlockCost: 130 },
  { name: "Nijgadh Fast Track", type: "Speedway", status: "Locked", levels: 100, unlockCost: 140 },
  { name: "Mustang Trail", type: "Rocky", status: "Locked", levels: 100, unlockCost: 150 },
  { name: "Everest Base Camp", type: "Snowy Mountain", status: "Locked", levels: 100, unlockCost: 160 },
  { name: "Terai Flatland", type: "Smooth Drive", status: "Locked", levels: 100, unlockCost: 110 },
  { name: "Chitwan National Park", type: "Jungle Safari", status: "Locked", levels: 100, unlockCost: 120 },
  { name: "Moon", type: "Low Gravity", status: "Bonus Locked", levels: 100, unlockCost: 200 },
  { name: "Mars Surface", type: "Alien Planet", status: "Locked", levels: 100, unlockCost: 130 },
  { name: "Cyber Arena", type: "Futuristic", status: "Locked", levels: 100, unlockCost: 140 },
  { name: "Space Highway", type: "Sci-Fi", status: "Locked", levels: 100, unlockCost: 150 },
  { name: "Glass Skyroad", type: "Transparent Path", status: "Locked", levels: 100, unlockCost: 160 },
  { name: "Gaindakot Bridge", type: "Narrow Bridges", status: "Locked", levels: 100, unlockCost: 170 },
  { name: "Boudhanath Circuit", type: "Cultural", status: "Locked", levels: 100, unlockCost: 180 },
  { name: "Pashupatinath Round", type: "Religious Temple", status: "Locked", levels: 100, unlockCost: 190 },
  { name: "Jungle Trail", type: "Forest Track", status: "Locked", levels: 100, unlockCost: 200 },
  { name: "Flood Survival", type: "Disaster Stage", status: "Locked", levels: 100, unlockCost: 210 },
  { name: "Earthquake Ruins", type: "Broken Terrain", status: "Locked", levels: 100, unlockCost: 220 },
  { name: "Snowstorm Drive", type: "Icy Road", status: "Locked", levels: 100, unlockCost: 230 },
  { name: "AI Robot War Zone", type: "Battle Area", status: "Locked", levels: 100, unlockCost: 240 },
  { name: "Neon City", type: "Lit-Up Roads", status: "Locked", levels: 100, unlockCost: 250 },
  { name: "Junkyard Rush", type: "Scrap Terrain", status: "Locked", levels: 100, unlockCost: 260 },
  { name: "Alien Planet", type: "Floating Gravity", status: "Locked", levels: 100, unlockCost: 270 },
  { name: "Desert Sandstorm", type: "Windy, Dry", status: "Locked", levels: 100, unlockCost: 280 },
  { name: "Thamel Night Drive", type: "Crowded Market", status: "Locked", levels: 100, unlockCost: 290 },
  { name: "Bhaktapur Durbar Square", type: "Ancient", status: "Locked", levels: 100, unlockCost: 300 },
  { name: "Fewa Tal", type: "Lakeside Beauty", status: "Locked", levels: 100, unlockCost: 310 },
  { name: "Hidden Tunnel (secret stage)", type: "Secret Bonus", status: "Hidden Bonus", levels: 100, unlockCost: 0 },
];


// Export for use in other modules
if (typeof module !== 'undefined') module.exports = STAGE_LIST;
export default STAGE_LIST;
