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
            switch(btn.id) {
                case "settings":
                    settings();
                    break;
                case "tutorial":
                    tutorial();
                    break;
                case "payment":
                    paymentHistory();
                    break;
                case "acknowledgements":
                    acknowledgements();
                    break;
                case "alertMenu":
                    alerts();
                    break;
                case "report":
                    reportBug();
                    break;
                case "feedback":
                    feedback();
                    break;
                default:
                    feedback()
            }
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
        if (!menuPanel.contains(e.target)) {
            menuPanel.classList.remove('open');
        }
        if (!menuItemPanel.contains(e.target)) {
            menuItemPanel.classList.remove('open');
        }
        if (!filterPanel.contains(e.target)) {
            filterPanel.classList.remove('open');
        }
    });

    //dynamically size bottom tabs to shortest tab
    const dashboard = document.getElementById('dashboard');
    let maxHeight = dashboard.offsetHeight;
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.height = maxHeight + 'px';
    });


    //menu item html
    let currentTransportMode = "car";

    function settings() {
        menuItemPanel.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 16px;">
                <h2>Settings</h2>

                <h3>Transport Mode</h3>
                <p style="color:#666; font-size:14px;">
                    Current: <strong>car</strong>
                </p>

                <div style="display:flex; flex-direction:column; gap:8px; max-width:200px;">
                    <button>🚗 Car</button>
                    <button>🏍️ Motorbike</button>
                    <button>🚲 Bicycle</button>
                    <button>🛴 E-Scooter</button>
                </div>
            </div>
        `;
    }


    function tutorial() {
        menuItemPanel.innerHTML = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2>Tutorial</h2>
                <p style="font-size: 16px; color: #555;">
                    🚧 Under construction 🚧
                </p>
            </div>
        `;
    }

    function paymentHistory() {
        menuItemPanel.innerHTML = `
            <h2>Payment History</h2>
            <div style="font-family: Arial, sans-serif;">
                <div style="padding:8px; border-bottom:1px solid #ccc;">
                    <strong>Devonport Rd Parking</strong><br>
                    6 May 2026 • 9:12 AM - 10:45 AM<br>
                    $4.00 • Card Payment
                </div>
    
                <div style="padding:8px; border-bottom:1px solid #ccc;">
                    <strong>Elizabeth St Carpark</strong><br>
                    4 May 2026 • 1:05 PM - 2:30 PM<br>
                    $5.00 • Mobile Pay
                </div>
    
                <div style="padding:8px; border-bottom:1px solid #ccc;">
                    <strong>Spring St Parking Zone</strong><br>
                    2 May 2026 • 8:20 AM - 9:10 AM<br>
                    $2.00 • Card Payment
                </div>
    
                <div style="padding:8px;">
                    <strong>Willow St Parking</strong><br>
                    29 Apr 2026 • 3:15 PM - 4:40 PM<br>
                    $4.00 • Mobile Pay
                </div>
            </div>
        `;
    }

    function alerts() {
        menuItemPanel.innerHTML = `
            <div class="alerts-form">
                <h2>Submit an Alert</h2>
                <p>Report something that other users should know about.</p>
    
                <label for="alert-type">Alert Type</label>
                <select id="alert-type">
                    <option>Road closure</option>
                    <option>Price change</option>
                    <option>New parking area</option>
                    <option>Temporary restriction</option>
                    <option>Other</option>
                </select>
    
                <label for="alert-desc">Description</label>
                <textarea id="alert-desc" placeholder="What’s happening?"></textarea>
    
                <label for="alert-location">Location</label>
                <input id="alert-location" type="text" placeholder="e.g. Cameron Rd & Spring St">
    
                <label for="alert-date">Date (optional)</label>
                <input id="alert-date" type="date">
    
                <button class="submit-btn" disabled>Submit Alert</button>
    
                <p class="note">(Prototype only — alerts are not submitted)</p>
            </div>
        `;
    }

    function reportBug() {
        menuItemPanel.innerHTML = `
            <div class="report-bug">
                <h2>Report a Bug</h2>
                <p>Spotted an issue or incorrect map data? Let us know below.</p>
    
                <label for="bug-type">Issue Type</label>
                <select id="bug-type">
                    <option>Incorrect parking info</option>
                    <option>Missing parking area</option>
                    <option>Map not loading</option>
                    <option>Other</option>
                </select>
    
                <label for="bug-desc">Description</label>
                <textarea id="bug-desc" placeholder="Describe the issue..."></textarea>
    
                <label for="bug-location">Location (optional)</label>
                <input id="bug-location" type="text" placeholder="e.g. Devonport Rd">
    
                <button class="submit-btn">Submit</button>
    
                <p class="note">(Prototype only — submission not active)</p>
            </div>
        `;
    }

    function acknowledgements() {
        menuItemPanel.innerHTML = `
            <div class="acknowledgements">
                <p>
                    <a href="https://www.flaticon.com/free-icons/wheelchair" title="wheelchair icons">
                        Wheelchair icons created by Freepik - Flaticon
                    </a>
                </p>
    
                <p>
                    <a href="https://www.flaticon.com/free-icons/menu" title="menu icons">
                        Menu icon created by juicy_fish - Flaticon
                    </a>
                </p>
    
                <p>
                    <a href="https://www.flaticon.com/free-icons/filter" title="filter icons">
                        Filter icon created by juicy_fish - Flaticon
                    </a>
                </p>
    
                <p>QGIS was used to draw the majority of parking polygons and assign categories.</p>
    
                <p>
                    The remaining carpark and mobility data was retrieved from 
                    <a href="https://gis.tauranga.govt.nz">gis.tauranga.govt.nz</a>.
                </p>
    
                <p>LINZ aerial and topographic maps were used.</p>
    
                <p>maplibre-gl was used for displaying maps.</p>
    
                <p>ChatGPT & Claude AI were used for automation and large scale GeoJSON processing.</p>
    
                <p>
                    Concept developed by Tauranga Parking WAIKT363 Impact Lab team. 
                    [Michael Watson, Ayush Narayan, Amber Treadaway, Frankie Christie]
                </p>
    
                <p>Website designed and created by Frankie Christie.</p>
            </div>
        `;
    }

    function feedback() {
        menuItemPanel.innerHTML = `
            <div class="feedback">
                <p>We’d love to hear your thoughts!</p>
    
                <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSc2wRV8Lxri9JwwCOUT5hp-2wII-rfQzWIlp1Jue8Vlo6HSsQ/viewform?usp=dialog" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="feedback-link"
                >
                    Give Feedback
                </a>
            </div>
        `;
    }
});

