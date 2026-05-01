document.addEventListener('DOMContentLoaded', async function() {
    const map = L.map('map').setView([-37.686, 176.166], 15);
  
    L.tileLayer('https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=REMOVED',
    { maxZoom: 22, attribution: '© LINZ' }
    ).addTo(map);

    //fetch layers from geojson i cached from gis.tauranga.govt.nz' api: car parks, parking buildings, off street parking (waikato uni), mobility parking
    //can also get bus stops, public toilets, bins, etc later if i want
    const [mobility_parking, car_parks, off_street_parking, parking_buildings] = await Promise.all([
        fetch('./geojson/mobility.json').then(r => r.json()),
        fetch('./geojson/carparks.json').then(r => r.json()),
        fetch('./geojson/offstreet.json').then(r => r.json()),
        fetch('./geojson/parkingbuildings.json').then(r => r.json())
    ]);
    
    const combined = {
        features: [...car_parks.features, ...parking_buildings.features, ...off_street_parking.features]   
    };

    //build parking builing/lot polygons
    L.geoJSON(combined, {
        style: { color: 'green', fillOpacity: 0.4 },
        onEachFeature: (feature, layer) => {
            const p = feature.properties;
            const globalID = p.GlobalID;            //might be helpful for removing duplicates
            const paid = p?.CostHr > 0 ? "Yes" : "No";

            //popup customisation
            layer.bindPopup(
                `
                    <b>${p.Name ?? 'Unknown'}</b>
                    <br>
                    Spaces: ${p.AvailParks ?? 'Unknown'}
                    <br>
                    Open hours: ${p.OpenHours ?? 'Unknown'}
                    <br>
                    Paid: ${paid ?? 'Unknown'}
                `
            );
        }
    }).addTo(map);

    //set mobility park icon
    const mobilityIcon = L.icon({
        iconUrl: './icons/wheelchair.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      //build mobility parking markers
    L.geoJSON(mobility_parking, {
        pointToLayer: (feature, latlng) => L.marker(latlng, { icon: mobilityIcon }),
        onEachFeature: (feature, layer) => {
            const p = feature.properties;
            const globalID = p.GlobalID;            //might be helpful for removing duplicates

            //popup customisation
            layer.bindPopup(
                p.SiteDescription
            );
        }
    }).addTo(map);
});