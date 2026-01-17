// THE DATABASE (Loads from your browser memory)
let db = JSON.parse(localStorage.getItem('theInBetweenDB')) || {
    rooms: [],
    entities: []
};

// INITIAL LOAD
renderSidebar();

// 1. SIDEBAR LOGIC
function renderSidebar() {
    const roomList = document.getElementById('room-list');
    const entityList = document.getElementById('entity-list');
    
    roomList.innerHTML = '';
    entityList.innerHTML = '';

    // Loop through saved Rooms
    db.rooms.forEach((room, index) => {
        const div = document.createElement('div');
        div.className = 'nav-item';
        div.innerText = room.title;
        div.onclick = () => loadPage('room', index);
        roomList.appendChild(div);
    });

    // Loop through saved Entities
    db.entities.forEach((entity, index) => {
        const div = document.createElement('div');
        div.className = 'nav-item';
        div.innerText = entity.title;
        div.onclick = () => loadPage('entity', index);
        entityList.appendChild(div);
    });
}

// 2. EDITOR LOGIC (The "New" Button)
function openEditor(type) {
    document.getElementById('view-mode').classList.add('hidden');
    document.getElementById('edit-mode').classList.remove('hidden');
    
    document.getElementById('entry-type').value = type;
    
    // Toggle correct fields
    if (type === 'room') {
        document.getElementById('room-fields').classList.remove('hidden');
        document.getElementById('entity-fields').classList.add('hidden');
    } else {
        document.getElementById('room-fields').classList.add('hidden');
        document.getElementById('entity-fields').classList.remove('hidden');
    }
    
    // Clear form
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-body').value = '';
}

function cancelEdit() {
    document.getElementById('edit-mode').classList.add('hidden');
    document.getElementById('view-mode').classList.remove('hidden');
}

function saveEntry() {
    const type = document.getElementById('entry-type').value;
    const title = document.getElementById('entry-title').value;
    const body = document.getElementById('entry-body').value;

    if (!title) return alert("Please give it a name!");

    const newEntry = {
        title,
        body,
        date: new Date().toLocaleDateString()
    };

    if (type === 'room') {
        newEntry.difficulty = document.getElementById('room-difficulty').value;
        newEntry.temp = document.getElementById('room-temp').value;
        db.rooms.push(newEntry);
    } else {
        newEntry.hostility = document.getElementById('entity-hostility').value;
        newEntry.habitat = document.getElementById('entity-habitat').value;
        db.entities.push(newEntry);
    }

    // SAVE TO BROWSER MEMORY
    localStorage.setItem('theInBetweenDB', JSON.stringify(db));
    
    // REFRESH
    renderSidebar();
    cancelEdit();
    
    // Open the page we just made
    if(type === 'room') loadPage('room', db.rooms.length - 1);
    else loadPage('entity', db.entities.length - 1);
}

// 3. PAGE VIEW LOGIC (The Template Engine)
function loadPage(type, index) {
    const data = type === 'room' ? db.rooms[index] : db.entities[index];
    const view = document.getElementById('view-mode');
    
    // Build the Infobox HTML based on type
    let infoboxHTML = '';
    if (type === 'room') {
        infoboxHTML = `
            <div class="stat"><b>Class:</b> <span>${data.difficulty}</span></div>
            <div class="stat"><b>Temp:</b> <span>${data.temp}</span></div>
        `;
    } else {
        infoboxHTML = `
            <div class="stat"><b>Hostility:</b> <span>${data.hostility}</span></div>
            <div class="stat"><b>Habitat:</b> <span>${data.habitat}</span></div>
        `;
    }

    // Inject HTML
    view.innerHTML = `
        <div class="page-container">
            <div class="article">
                <small>The In Between > ${type}s > ${data.title}</small>
                <h1>${data.title}</h1>
                <p style="white-space: pre-wrap;">${data.body}</p>
            </div>
            
            <aside class="infobox">
                <div class="infobox-header">${data.title}</div>
                <div style="background:#f0f8ff; height:150px; border-radius:4px; margin-bottom:15px; display:flex; align-items:center; justify-content:center; color:#b0bec5; font-size:0.8rem;">
                    (No Image)
                </div>
                ${infoboxHTML}
                <div class="stat"><b>Date:</b> <span>${data.date}</span></div>
            </aside>
        </div>
    `;
    
    document.getElementById('edit-mode').classList.add('hidden');
    view.classList.remove('hidden');
}

function showHome() {
    document.getElementById('view-mode').innerHTML = `
        <div class="article-content" style="text-align:center; padding-top:50px;">
            <h1 style="color:#81d4fa;">❄️ The In Between</h1>
            <p>Select a file from the left to view.</p>
        </div>
    `;
    document.getElementById('edit-mode').classList.add('hidden');
    document.getElementById('view-mode').classList.remove('hidden');
}

// 4. BACKUP (Because LocalStorage can be cleared)
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "in_between_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
