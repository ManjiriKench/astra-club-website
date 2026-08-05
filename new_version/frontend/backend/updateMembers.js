const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../members.html');
let content = fs.readFileSync(file, 'utf8');

const startTag = '<main role="main" tabindex="-1">';
const endTag = '</main>';

const startIdx = content.indexOf(startTag);
const endIdx = content.indexOf(endTag, startIdx) + endTag.length;

if (startIdx === -1 || content.indexOf(endTag, startIdx) === -1) {
    console.error("Could not find <main> tags");
    process.exit(1);
}

const newMain = `<main role="main" tabindex="-1" id="dynamic-members-main">
        <div style="text-align: center; padding: 50px;">
            <p id="members-loading-text">Loading members from database...</p>
        </div>
    </main>`;

let newContent = content.substring(0, startIdx) + newMain + content.substring(endIdx);

const jsCode = `
        async function fetchAndRenderMembers() {
            try {
                const response = await fetch('http://localhost:5000/api/members');
                if (!response.ok) throw new Error('Network err');
                const members = await response.json();
                
                const groups = { 
                    1: { title: 'Faculty', items: [] }, 
                    2: { title: 'Core Team', items: [] }, 
                    3: { title: 'Domain Leads', items: [] }, 
                    4: { title: 'Technical Members', items: [] } 
                };
                
                members.forEach(m => { 
                    const lvl = m.role ? m.role.level : 4; 
                    if(groups[lvl]) groups[lvl].items.push(m); else groups[4].items.push(m); 
                });
                
                const container = document.getElementById('dynamic-members-main');
                container.innerHTML = '';
                
                for(let lvl = 1; lvl <= 4; lvl++) {
                    const group = groups[lvl];
                    if(group.items.length === 0) continue;
                    
                    let html = '<h2 class="section-title">' + group.title + '</h2><section class="members-lead-row">';
                    
                    group.items.forEach(m => {
                        html += \`
                        <div class="lead-card">
                            <img src="\${m.profileImageUrl || 'default.jpg'}" alt="\${m.firstName} \${m.lastName}"/>
                            <div class="mem-name">\${m.firstName} \${m.lastName}</div>
                            <div class="mem-role">\${m.role ? m.role.name : 'Member'}</div>
                            <div class="social-links">
                                \${m.linkedinUrl && m.linkedinUrl !== '#' ? \`<a href="\${m.linkedinUrl}" class="social-icon" aria-label="LinkedIn Profile"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.23 0H1.77C.79 0 0 .78 0 1.75v20.5C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.75V1.75c0-.97-.79-1.75-1.77-1.75zM7.05 20.47H3.59V9H7.05v11.47zM5.32 7.55c-1.12 0-2.03-.92-2.03-2.05s.91-2.05 2.03-2.05c1.13 0 2.04.92 2.04 2.05s-.91 2.05-2.04 2.05zm15.15 12.92h-3.51v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.83V9h3.38v1.54h.05c.47-.9 1.63-1.86 3.32-1.86 3.56 0 4.22 2.34 4.22 5.38v6.31z"/></svg></a>\` : ''}
                                \${m.githubUrl && m.githubUrl !== '#' ? \`<a href="\${m.githubUrl}" class="social-icon" aria-label="GitHub Profile"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.083-.73.083-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.834 2.809 1.306 3.492.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.52.125-3.174 0 0 1.005-.322 3.301 1.23.956-.266 1.96-.399 2.96-.399s1.004.133 2.96.399c2.296-1.552 3.3-1.23 3.3-1.23.665 1.654.26 2.871.125 3.174.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.474 5.923.43.37.81 1.096.81 2.213 0 1.604-.015 2.89-.015 3.284 0 .319.21.694.825.575C20.565 22.102 24 17.59 24 12.297c0-6.627-5.373-12-12-12z"/></svg></a>\` : ''}
                            </div>
                        </div>\`;
                    });
                    
                    html += '</section><br><hr class="section-divider" /><br>';
                    container.innerHTML += html;
                }
            } catch (err) {
                console.error(err);
                document.getElementById('members-loading-text').innerText = 'Failed to load members. Is the backend running?';
            }
        }
`;

const windowOnloadIdx = newContent.lastIndexOf('window.onload = function() {');
const afterWindowOnload = newContent.indexOf('};', windowOnloadIdx) + 2;

newContent = newContent.substring(0, windowOnloadIdx) + 
             jsCode + 
             newContent.substring(windowOnloadIdx, afterWindowOnload - 2) + 
             '\\n            fetchAndRenderMembers();\\n        ' + 
             newContent.substring(afterWindowOnload - 2);

fs.writeFileSync(file, newContent);
console.log('members.html updated successfully.');
