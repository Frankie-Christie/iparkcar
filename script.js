document.addEventListener('DOMContentLoaded', async function() {
  
    const map = new maplibregl.Map({
        container: 'map',
        style: {
          version: 8,
          sources: {
            aerial: {
              type: 'raster',
              tiles: ['https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=REMOVED'],
              tileSize: 256,
              maxzoom: 22
            },
            labels: {
              type: 'vector',
              tiles: ['https://basemaps.linz.govt.nz/v1/tiles/topographic/WebMercatorQuad/{z}/{x}/{y}.pbf?api=REMOVED'],
              maxzoom: 14
            }
          },
          layers: [
            {
              id: 'aerial',
              type: 'raster',
              source: 'aerial'
            },
            {
              id: 'street-names',
              type: 'symbol',
              source: 'labels',
              'source-layer': 'street_labels',
              layout: {
                'text-field': ['get', 'name'],
                'text-size': 12,
                'text-font': ['Open Sans Regular']
              },
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#000000',
                'text-halo-width': 1.5
              }
            }
          ]
        },
        center: [176.166, -37.686],
        zoom: 15
      });

    //fetch layers from geojson i cached from gis.tauranga.govt.nz' api: car parks, parking buildings, off street parking (waikato uni), mobility parking
    //can also get bus stops, public toilets, bins, etc later if i want
    const [mobility_parking, car_parks] = await Promise.all([
        fetch('./geojson/mobility.json').then(r => r.json()),
        fetch('./geojson/carparks.json').then(r => r.json())
    ]);

    //set mobility park icon
    const icon = new Image(32, 32);
    icon.src = './icons/wheelchair.png';
    icon.onload = () => map.addImage('wheelchair', icon);

    map.on('load', () => {

        // --- car parks ---
        map.addSource('car-parks', { type: 'geojson', data: car_parks });

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

        // click to toggle car park colour
        map.on('click', 'car-parks-fill', (e) => {
            const feature = e.features[0];
            const p = feature.properties;
            const paid = p.CostHr > 0 ? 'Yes' : 'No';

            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <b>${p.Name ?? 'Unknown'}</b><br>
                    <b>${p.GlobalID ?? 'Unknown'}</b><br>
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
    });
});