import { buildMap } from './buildMap.js';

document.addEventListener('DOMContentLoaded', async function() {
    const map = await buildMap();

    const btnFilter = document.getElementById('btnFilter');
    const btnMenu = document.getElementById('btnMenu');
    const filterPanel = document.getElementById('filterPanel');
    const menuPanel = document.getElementById('menuPanel');
    const bottomPanel = document.querySelector(".panel-bottom");

    //set default date in filter date/time picker
    const now = new Date();
    const taurangaTime = new Date(now.toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' }));
    const pad = n => String(n).padStart(2, '0');
    const formatted = `${taurangaTime.getFullYear()}-${pad(taurangaTime.getMonth()+1)}-${pad(taurangaTime.getDate())}T${pad(taurangaTime.getHours())}:${pad(taurangaTime.getMinutes())}`;
    document.getElementById('datetime').value = formatted;

    btnFilter.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        menuPanel.classList.remove('open');
    });
    
    btnMenu.addEventListener('click', () => {
        menuPanel.classList.toggle('open');
        filterPanel.classList.remove('open')
    })

    function setPanelPos() {
        const navHeight = document.querySelector('.topnav').getBoundingClientRect().bottom;
        filterPanel.style.top = navHeight + 'px';
        menuPanel.style.top = navHeight + 'px';
        bottomPanel.style.bottom = map.getBoundingClientRect().bottom;
    }
    
    window.addEventListener('resize', () => {
        setPanelPos();
    });

    requestAnimationFrame(setPanelPos);
});

const visibleHeight = window.visualViewport.height;
window.visualViewport.addEventListener('resize', () => {
    //set bottom panel position specifically if duckduckgo 
    //keeps giving issues on mobile with the obstructive lower menu bar
})
    