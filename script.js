let map = L.map("map").setView([0, 0], 1);

L.tileLayer('https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=REMOVED',
{ maxZoom: 22, attribution: '© LINZ' }
).addTo(map);