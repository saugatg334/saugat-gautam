// Stage and Vehicle data for dynamic use
// (File: script.js)
const stages = [
  { number: 1, name: 'Mahendra Highway', terrain: 'Road', status: 'Unlocked' },
  { number: 2, name: 'Kathmandu City', terrain: 'Urban', status: 'Locked' },
  { number: 3, name: 'Lumbini', terrain: 'Cultural', status: 'Locked' },
  { number: 4, name: 'Pokhara', terrain: 'Lake Hill', status: 'Locked' },
  { number: 5, name: 'Rara Lake', terrain: 'Snow + Lake', status: 'Locked' },
  { number: 6, name: 'Nijgadh Fast Track', terrain: 'Speedway', status: 'Locked' },
  { number: 7, name: 'Mustang Trail', terrain: 'Rocky', status: 'Locked' },
  { number: 8, name: 'Everest Base Camp', terrain: 'Snowy Mountain', status: 'Locked' },
  { number: 9, name: 'Terai Flatland', terrain: 'Smooth Drive', status: 'Locked' },
  { number: 10, name: 'Chitwan National Park', terrain: 'Jungle Safari', status: 'Locked' },
  { number: 11, name: 'Moon', terrain: 'Low Gravity', status: 'Bonus Locked' },
  { number: 12, name: 'Mars Surface', terrain: 'Alien Planet', status: 'Locked' },
  { number: 13, name: 'Cyber Arena', terrain: 'Futuristic', status: 'Locked' },
  { number: 14, name: 'Space Highway', terrain: 'Sci-Fi', status: 'Locked' },
  { number: 15, name: 'Glass Skyroad', terrain: 'Transparent Path', status: 'Locked' },
  { number: 16, name: 'Gaindakot Bridge', terrain: 'Narrow Bridges', status: 'Locked' },
  { number: 17, name: 'Boudhanath Circuit', terrain: 'Cultural', status: 'Locked' },
  { number: 18, name: 'Pashupatinath Round', terrain: 'Religious Temple', status: 'Locked' },
  { number: 19, name: 'Jungle Trail', terrain: 'Forest Track', status: 'Locked' },
  { number: 20, name: 'Flood Survival', terrain: 'Disaster Stage', status: 'Locked' },
  { number: 21, name: 'Earthquake Ruins', terrain: 'Broken Terrain', status: 'Locked' },
  { number: 22, name: 'Snowstorm Drive', terrain: 'Icy Road', status: 'Locked' },
  { number: 23, name: 'AI Robot War Zone', terrain: 'Battle Area', status: 'Locked' },
  { number: 24, name: 'Neon City', terrain: 'Lit-Up Roads', status: 'Locked' },
  { number: 25, name: 'Junkyard Rush', terrain: 'Scrap Terrain', status: 'Locked' },
  { number: 26, name: 'Alien Planet', terrain: 'Floating Gravity', status: 'Locked' },
  { number: 27, name: 'Desert Sandstorm', terrain: 'Windy, Dry', status: 'Locked' },
  { number: 28, name: 'Thamel Night Drive', terrain: 'Crowded Market', status: 'Locked' },
  { number: 29, name: 'Bhaktapur Durbar Square', terrain: 'Ancient', status: 'Locked' },
  { number: 30, name: 'Fewa Tal', terrain: 'Lakeside Beauty', status: 'Locked' },
  { number: 31, name: 'Hidden Tunnel (secret stage)', terrain: 'Secret Bonus', status: 'Hidden Bonus' }
];
const vehicles = [
  { number: 1, name: 'Rickshaw', type: 'Local', status: 'Unlocked' },
  { number: 2, name: 'Brawan Jeep', type: 'Offroad', status: 'Unlocked' },
  { number: 3, name: 'Hot Rod', type: 'Classic Race', status: 'Locked' },
  { number: 4, name: 'Tractor', type: 'Farming', status: 'Locked' },
  { number: 5, name: 'Police Van', type: 'Official', status: 'Locked' },
  { number: 6, name: 'Ambulance', type: 'Emergency', status: 'Locked' },
  { number: 7, name: 'School Bus', type: 'Public Transport', status: 'Locked' },
  { number: 8, name: 'Moonlander', type: 'Sci-Fi', status: 'Bonus Locked' },
  { number: 9, name: 'Helicopter', type: 'Air Vehicle', status: 'Locked' },
  { number: 10, name: 'Cycle', type: 'Simple', status: 'Unlocked' },
  { number: 11, name: 'Bike', type: 'Motor', status: 'Locked' },
  { number: 12, name: 'Fire Truck', type: 'Emergency', status: 'Locked' },
  { number: 13, name: 'Electric Car', type: 'Modern', status: 'Locked' },
  { number: 14, name: 'Tuk Tuk', type: 'Local Taxi', status: 'Locked' },
  { number: 15, name: 'Bullock Cart', type: 'Traditional', status: 'Locked' },
  { number: 16, name: 'Army Truck', type: 'Military', status: 'Locked' },
  { number: 17, name: 'Drone Rider', type: 'Futuristic', status: 'Locked' },
  { number: 18, name: 'Solar Car', type: 'Sci-Fi', status: 'Locked' },
  { number: 19, name: 'Gravity Bike', type: 'Low Gravity', status: 'Locked' },
  { number: 20, name: 'Magnet Truck', type: 'High Tech', status: 'Locked' },
  { number: 21, name: 'Luxury SUV', type: 'Premium', status: 'Locked' },
  { number: 22, name: 'Transformer Ride', type: 'Morphing', status: 'Locked' },
  { number: 23, name: 'AI Car', type: 'Robot Driven', status: 'Locked' },
  { number: 24, name: 'Cargo Truck', type: 'Heavy Vehicle', status: 'Locked' },
  { number: 25, name: 'Van', type: 'Delivery', status: 'Locked' },
  { number: 26, name: 'Vintage Car', type: 'Classic', status: 'Locked' },
  { number: 27, name: 'Snowmobile', type: 'Ice Terrain', status: 'Locked' },
  { number: 28, name: 'Jet Car', type: 'Super Speed', status: 'Locked' },
  { number: 29, name: 'Electric Scooter', type: 'Light Ride', status: 'Locked' },
  { number: 30, name: 'Horse Cart', type: 'Traditional Rural', status: 'Locked' },
  { number: 31, name: 'UFO Car (hidden)', type: 'Alien Ride', status: 'Hidden Bonus' }
];
// Example: You can use these arrays to dynamically render tables or for game logic

// Draw a simple background and text to verify canvas is working
window.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('gamecanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Nepali Racer Game Area', 180, 200);
  }
});
