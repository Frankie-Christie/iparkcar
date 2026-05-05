import { buildMap } from './buildMap.js';

document.addEventListener('DOMContentLoaded', async function() {
    await buildMap();

    const btnFilter = document.getElementById('btnFilter');
    const btnMenu = document.getElementById('btnMenu');
    const filterPanel = document.getElementById('filterPanel');
    const menuPanel = document.getElementById('menuPanel');
    const bottomPanel = document.getElementById('bottomPanel');
    const menuItemPanel = document.getElementById('menuItem');
    const tabHeight = document.getElementById('bottomTabs').offsetHeight;
    const navHeight = document.querySelector('.topnav').getBoundingClientRect().bottom;

    //set default date in filter date/time picker
    const now = new Date();
    const taurangaTime = new Date(now.toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' }));
    const pad = n => String(n).padStart(2, '0');
    const formatted = `${taurangaTime.getFullYear()}-${pad(taurangaTime.getMonth()+1)}-${pad(taurangaTime.getDate())}T${pad(taurangaTime.getHours())}:${pad(taurangaTime.getMinutes())}`;
    document.getElementById('datetime').value = formatted;

    btnFilter.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        menuPanel.classList.remove('open');
        menuItemPanel.classList.remove('open');
    });
    
    btnMenu.addEventListener('click', () => {
        menuPanel.classList.toggle('open');
        filterPanel.classList.remove('open')
        menuItemPanel.classList.remove('open');
    })

    function setPanelPos() {
        filterPanel.style.top = navHeight + 'px';
        menuPanel.style.top = navHeight + 'px';
        menuItemPanel.style.top = navHeight + 'px';
        bottomPanel.style.bottom = (tabHeight - bottomPanel.offsetHeight) + 'px';
    }
    
    window.addEventListener('resize', () => {
        setPanelPos();
    });

    requestAnimationFrame(setPanelPos);

    document.querySelectorAll('.menuItem').forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.innerHTML;
            //call different function based on each choice
            menuPanel.classList.remove('open')
            menuItemPanel.classList.add('open');
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) {
                bottomPanel.style.bottom = (tabHeight - bottomPanel.offsetHeight) + 'px';
                btn.classList.remove('active');
            } else {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.remove('hidden');
                bottomPanel.style.bottom = 0 + 'px';
            }
        });
    });

    //collapse bttom panel when something else is clicked
    document.addEventListener('click', (e) => {
        if (!bottomPanel.contains(e.target)) {
            bottomPanel.style.bottom = (tabHeight - bottomPanel.offsetHeight) + 'px';
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });
});