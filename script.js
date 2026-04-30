let map = document.getElementById("map");

L.tileLayer("https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=fY9qbKMhlDxa9FUU85k9",
{
    attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> 
    <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
}).addTo(map);