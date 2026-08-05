const fs = require('fs');

// Fix members.html \n issue
let mHtml = fs.readFileSync('c:/Users/Manjiri/Desktop/frontend/members.html', 'utf8');
mHtml = mHtml.replace('\\n            fetchAndRenderMembers();\\n', '\n            fetchAndRenderMembers();\n');
fs.writeFileSync('c:/Users/Manjiri/Desktop/frontend/members.html', mHtml);

// Update index.html
let iHtml = fs.readFileSync('c:/Users/Manjiri/Desktop/frontend/index.html', 'utf8');

// Replace static cards with dynamic container
const cardsStart = iHtml.indexOf('<div class="cards">');
// Since index.html has an exact structure, replace everything in it up to the end of the div
const cardsEnd = iHtml.indexOf('</div>', iHtml.lastIndexOf('<div class="card placeholder">'));
const finalCardsEnd = iHtml.indexOf('</div>', cardsEnd + 5) + 6;

if(cardsStart > -1 && finalCardsEnd > -1) {
    const newCards = `<div class="cards" id="dynamic-events-cards">
                    <div class="card placeholder">
                        <h3 class="card-title">Loading events from database...</h3>
                    </div>
                </div>`;
    iHtml = iHtml.substring(0, cardsStart) + newCards + iHtml.substring(finalCardsEnd);
}

// Inject fetch logic before </body>
const scriptInject = `
        async function fetchAndRenderEvents() {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if(!response.ok) throw new Error('API failed');
                const events = await response.json();
                
                const container = document.getElementById('dynamic-events-cards');
                container.innerHTML = '';
                
                events.forEach(evt => {
                    const dateObj = new Date(evt.eventDate);
                    const dateStr = isNaN(dateObj) ? evt.eventDate : dateObj.toLocaleDateString();
                    
                    container.innerHTML += \`
                    <div class="card">
                        <img src="\${evt.coverImageUrl || 'default.jpg'}" alt="\${evt.title}"/>
                        <h3 class="card-title">\${evt.title}</h3>
                        <p><strong>Date:</strong> \${dateStr}</p>
                        <p><strong>Venue:</strong> \${evt.venue || 'TBA'}</p>
                    </div>\`;
                });
            } catch(err) {
                console.error(err);
                document.getElementById('dynamic-events-cards').innerHTML = '<div class="card placeholder"><h3 class="card-title">Failed to load</h3></div>';
            }
        }
`;

const onloadIdx = iHtml.lastIndexOf('window.onload = function() {');
const firstBlock = iHtml.substring(0, onloadIdx);
const secondBlock = iHtml.substring(onloadIdx);

const startAutoIdx = secondBlock.indexOf('startAutoScroll();');
const finalBlock = secondBlock.substring(0, startAutoIdx) + 'fetchAndRenderEvents();\n            ' + secondBlock.substring(startAutoIdx);

iHtml = firstBlock + scriptInject + finalBlock;
fs.writeFileSync('c:/Users/Manjiri/Desktop/frontend/index.html', iHtml);
console.log('Finished updating files');
