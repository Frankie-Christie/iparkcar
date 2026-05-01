const fs = require('fs');

const mobility = JSON.parse(fs.readFileSync('./geojson/mobility.json', 'utf8'));
console.log(mobility.features.length);