// Language System for Nepali Racer
// Supports English and Nepali translations

const LANGUAGES = {
  english: {
    // Main Menu
    title: "Nepali Racer",
    startGame: "Start Game",
    selectVehicle: "Select Vehicle",
    selectStage: "Select Stage", 
    selectCharacter: "Select Character",
    exit: "Exit",
    back: "Back",
    confirm: "Confirm",
    cancel: "Cancel",
    
    // Game UI
    fuel: "Fuel",
    coins: "Coins",
    diamonds: "Diamonds",
    score: "Score",
    distance: "Distance",
    speed: "Speed",
    
    // Power-ups
    nitroBoost: "Nitro Boost",
    shieldActive: "Shield Active",
    magnetActive: "Coin Magnet",
    fuelBoost: "Fuel Boost",
    
    // Shop
    shop: "Shop",
    upgrades: "Upgrades",
    vehicles: "Vehicles",
    stages: "Stages",
    characters: "Characters",
    buy: "Buy",
    upgrade: "Upgrade",
    owned: "Owned",
    locked: "Locked",
    unlocked: "Unlocked",
    
    // Upgrade categories
    speedUpgrade: "Speed Upgrade",
    suspensionUpgrade: "Suspension Upgrade", 
    fuelUpgrade: "Fuel Efficiency",
    gripUpgrade: "Grip Upgrade",
    
    // Vehicle types
    offroad: "Offroad",
    farming: "Farming",
    superSpeed: "Super Speed",
    publicTransport: "Public Transport",
    airVehicle: "Air Vehicle",
    local: "Local",
    classicRace: "Classic Race",
    official: "Official",
    emergency: "Emergency",
    sciFi: "Sci-Fi",
    simple: "Simple",
    motor: "Motor",
    modern: "Modern",
    localTaxi: "Local Taxi",
    traditional: "Traditional",
    military: "Military",
    futuristic: "Futuristic",
    lowGravity: "Low Gravity",
    highTech: "High Tech",
    premium: "Premium",
    morphing: "Morphing",
    robotDriven: "Robot Driven",
    heavyVehicle: "Heavy Vehicle",
    delivery: "Delivery",
    classic: "Classic",
    iceTerrain: "Ice Terrain",
    lightRide: "Light Ride",
    traditionalRural: "Traditional Rural",
    alienRide: "Alien Ride",
    race: "Race",
    
    // Stage types
    road: "Road",
    urban: "Urban",
    cultural: "Cultural",
    lakeHill: "Lake Hill",
    snowLake: "Snow + Lake",
    speedway: "Speedway",
    rocky: "Rocky",
    snowyMountain: "Snowy Mountain",
    smoothDrive: "Smooth Drive",
    jungleSafari: "Jungle Safari",
    alienPlanet: "Alien Planet",
    battleArea: "Battle Area",
    litUpRoads: "Lit-Up Roads",
    scrapTerrain: "Scrap Terrain",
    floatingGravity: "Floating Gravity",
    windyDry: "Windy, Dry",
    crowdedMarket: "Crowded Market",
    ancient: "Ancient",
    lakesideBeauty: "Lakeside Beauty",
    secretBonus: "Secret Bonus",
    
    // Game Over
    gameOver: "Game Over",
    finalScore: "Final Score",
    coinsEarned: "Coins Earned",
    diamondsEarned: "Diamonds Earned",
    restart: "Restart",
    mainMenu: "Main Menu",
    
    // Settings
    settings: "Settings",
    language: "Language",
    music: "Music",
    sound: "Sound Effects",
    on: "On",
    off: "Off",
    resetProgress: "Reset Progress",
    
    // Ethnic Groups
    selectEthnicGroup: "Select Your Ethnic Group",
    chooseEthnicGroup: "-- Choose Ethnic Group --",
    
    // Common
    loading: "Loading...",
    pleaseWait: "Please wait...",
    notEnoughCoins: "Not enough coins!",
    notEnoughDiamonds: "Not enough diamonds!",
    purchaseSuccessful: "Purchase successful!",
    upgradeSuccessful: "Upgrade successful!",
    maxLevel: "Max level reached!",
    level: "Level"
  },
  
  nepali: {
    // Main Menu  
    title: "नेपाली रेसर",
    startGame: "खेल सुरु गर्नुहोस्",
    selectVehicle: "सवारी साधन छान्नुहोस्",
    selectStage: "चरण छान्नुहोस्",
    selectCharacter: "पात्र छान्नुहोस्",
    exit: "बाहिर निस्कनुहोस्",
    back: "फिर्ता",
    confirm: "पुष्टि गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    
    // Game UI
    fuel: "इन्धन",
    coins: "सिक्का",
    diamonds: "हीरा", 
    score: "अंक",
    distance: "दूरी",
    speed: "गति",
    
    // Power-ups
    nitroBoost: "नाइट्रो बूस्ट",
    shieldActive: "सुरक्षा ढाल सक्रिय",
    magnetActive: "सिक्का चुम्बक",
    fuelBoost: "इन्धन बूस्ट",
    
    // Shop
    shop: "पसल",
    upgrades: "स्तरोन्नति",
    vehicles: "सवारी साधन",
    stages: "चरणहरू",
    characters: "पात्रहरू",
    buy: "किन्नुहोस्",
    upgrade: "स्तरोन्नति गर्नुहोस्",
    owned: "स्वामित्व",
    locked: "बन्द",
    unlocked: "खुला",
    
    // Upgrade categories
    speedUpgrade: "गति स्तरोन्नति",
    suspensionUpgrade: "सस्पेन्सन स्तरोन्नति",
    fuelUpgrade: "इन्धन दक्षता",
    gripUpgrade: "पकड स्तरोन्नति",
    
    // Vehicle types (keeping English for now, can be translated further)
    offroad: "अफरोड",
    farming: "कृषि",
    superSpeed: "सुपर स्पीड",
    publicTransport: "सार्वजनिक यातायात",
    airVehicle: "हवाई सवारी",
    local: "स्थानीय",
    classicRace: "क्लासिक रेस",
    official: "आधिकारिक",
    emergency: "आपातकालीन",
    sciFi: "साइ-फाई",
    simple: "सरल",
    motor: "मोटर",
    modern: "आधुनिक",
    localTaxi: "स्थानीय ट्याक्सी",
    traditional: "परम्परागत",
    military: "सैन्य",
    futuristic: "भविष्यवादी",
    lowGravity: "कम गुरुत्वाकर्षण",
    highTech: "उच्च प्रविधि",
    premium: "प्रिमियम",
    morphing: "रूपान्तरण",
    robotDriven: "रोबोट चालित",
    heavyVehicle: "भारी सवारी",
    delivery: "डेलिभरी",
    classic: "क्लासिक",
    iceTerrain: "बरफको क्षेत्र",
    lightRide: "हल्का सवारी",
    traditionalRural: "परम्परागत ग्रामीण",
    alienRide: "विदेशी सवारी",
    race: "दौड",
    
    // Stage types
    road: "सडक",
    urban: "सहरी",
    cultural: "सांस्कृतिक",
    lakeHill: "ताल पहाड",
    snowLake: "हिउँ + ताल",
    speedway: "द्रुत मार्ग",
    rocky: "चट्टानी",
    snowyMountain: "हिउँ पहाड",
    smoothDrive: "चिकनो ड्राइभ",
    jungleSafari: "जंगल सफारी",
    alienPlanet: "विदेशी ग्रह",
    battleArea: "युद्ध क्षेत्र",
    litUpRoads: "उज्यालो सडक",
    scrapTerrain: "फोहोर क्षेत्र",
    floatingGravity: "तैरिरहेको गुरुत्वाकर्षण",
    windyDry: "हावाहुरी सुख्खा",
    crowdedMarket: "भीडभाड बजार",
    ancient: "पुरातन",
    lakesideBeauty: "तालको किनार सुन्दरता",
    secretBonus: "गुप्त बोनस",
    
    // Game Over
    gameOver: "खेल समाप्त",
    finalScore: "अन्तिम अंक",
    coinsEarned: "कमाएको सिक्का",
    diamondsEarned: "कमाएको हीरा",
    restart: "पुनः सुरु गर्नुहोस्",
    mainMenu: "मुख्य मेनु",
    
    // Settings
    settings: "सेटिङ्ग",
    language: "भाषा",
    music: "संगीत",
    sound: "ध्वनि प्रभाव",
    on: "चालु",
    off: "बन्द",
    resetProgress: "प्रगति रीसेट गर्नुहोस्",
    
    // Ethnic Groups
    selectEthnicGroup: "आफ्नो जातीय समूह छान्नुहोस्",
    chooseEthnicGroup: "-- जातीय समूह छान्नुहोस् --",
    
    // Common
    loading: "लोड हुँदै...",
    pleaseWait: "कृपया पर्खनुहोस्...",
    notEnoughCoins: "पर्याप्त सिक्का छैन!",
    notEnoughDiamonds: "पर्याप्त हीरा छैन!",
    purchaseSuccessful: "खरिद सफल!",
    upgradeSuccessful: "स्तरोन्नति सफल!",
    maxLevel: "अधिकतम स्तर पुगेको!",
    level: "स्तर"
  }
};

// Translation function
function translate(key, lang = null) {
  const currentLang = lang || (window.gameState ? window.gameState.language : 'english');
  return LANGUAGES[currentLang][key] || LANGUAGES.english[key] || key;
}

// Helper function to get all keys for a language
function getLanguageKeys(lang) {
  return LANGUAGES[lang] || LANGUAGES.english;
}

// Export for global use
window.LANGUAGES = LANGUAGES;
window.translate = translate;
window.getLanguageKeys = getLanguageKeys;

export { LANGUAGES, translate, getLanguageKeys };