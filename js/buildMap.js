export async function buildMap() {
    
    const style = await fetch('https://basemaps.linz.govt.nz/v1/tiles/topographic/3857/style/topographic.json?api=REMOVED').then(r => r.json());

    // keep only symbol layers (text labels)
    style.layers = style.layers.filter(l => l.type === 'symbol');

    // add aerial as first source
    style.sources.aerial = {
        type: 'raster',
        tiles: ['https://basemaps.linz.govt.nz/v1/tiles/aerial/3857/{z}/{x}/{y}.webp?api=REMOVED'],
        tileSize: 256,
        maxzoom: 22
    };

    // add aerial as first layer
    style.layers.unshift({ id: 'aerial', type: 'raster', source: 'aerial' });

    const map = new maplibregl.Map({
        container: 'map',
        style: style,
        center: [176.166, -37.686],
        zoom: 15
    });

    //fetch layers from geojson i cached from gis.tauranga.govt.nz' api: car parks, parking buildings, off street parking (waikato uni), mobility parking
    //can also get bus stops, public toilets, bins, etc later if i want
    //also extra carparks i located and drew myself in QGIS
    const [mobility_parking, car_parks, extra_carparks, onstreet_parks] = await Promise.all([
        fetch('./geojson/mobility.json').then(r => r.json()),
        fetch('./geojson/carparks.json').then(r => r.json()),
        fetch('./geojson/extra_carparks.json').then(r => r.json()),
        fetch('./geojson/onstreet_parks.json').then(r => r.json())
    ]);

    //combine car park polygons to be drawn
    const combined = {
        type: 'FeatureCollection',
        features: [...car_parks.features, ...extra_carparks.features, ...onstreet_parks.features]
    };

    //set mobility park icon
    const icon = new Image(32, 32);
    icon.src = './icons/wheelchair.png';
    icon.onload = () => map.addImage('wheelchair', icon);

    map.on('load', () => {

        // --- car parks ---
        map.addSource('car-parks', { type: 'geojson', data: combined });

        map.addLayer({
            id: 'car-parks-fill',
            type: 'fill',
            source: 'car-parks',
            paint: {
                'fill-color': 'green',
                'fill-opacity': 0.4
            }
        });

        map.addLayer({
            id: 'car-parks-outline',
            type: 'line',
            source: 'car-parks',
            paint: {
                'line-color': 'green',
                'line-width': 2
            }
        });

        // click behaviour
        map.on('click', 'car-parks-fill', (e) => {
            const feature = e.features[0];
            const p = feature.properties;
            const paid = p.CostHr > 0 ? 'Yes' : 'No';

            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <b>${p.Name ?? 'Unknown'}</b><br>
                    Spaces: ${p.AvailParks ?? 'Unknown'}<br>
                    Open hours: ${p.OpenHours ?? 'Unknown'}<br>
                    Paid: ${paid}
                `)
                .addTo(map);
        });

        map.on('mouseenter', 'car-parks-fill', () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', 'car-parks-fill', () => map.getCanvas().style.cursor = '');

        // --- mobility parking ---
        map.addSource('mobility', { type: 'geojson', data: mobility_parking });

        map.addLayer({
            id: 'mobility-icons',
            type: 'symbol',
            source: 'mobility',
            layout: {
                'icon-image': 'wheelchair',
                'icon-size': 1,
                'icon-anchor': 'bottom'
            }
        });

        map.on('click', 'mobility-icons', (e) => {
            const p = e.features[0].properties;
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(p.SiteDescription ?? 'Unknown')
                .addTo(map);
        });

        map.on('mouseenter', 'mobility-icons', () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', 'mobility-icons', () => map.getCanvas().style.cursor = '');

        // --- make sure map loads with all features within view ---
        const allFeatures = [...combined.features, ...mobility_parking.features];
        const coords = allFeatures.flatMap(f => 
            f.geometry.type === 'Point' 
                ? [f.geometry.coordinates] 
                : f.geometry.coordinates[0]
        );

        const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));

        map.fitBounds(bounds, { padding: {top: 150, bottom: 150, left: 40, right: 40} });
    });
    return map;
}