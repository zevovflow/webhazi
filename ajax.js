document.addEventListener('DOMContentLoaded', function() {
    // API konfiguráció
    const API_URL = 'http://gamf.nhely.hu/ajax2/';
    const CODE = 'F7R3PUgamf77'; // SAJÁT NEPTUN KÓD HASZNÁLATA!
    
    // DOM elemek
    const readDataBtn = document.getElementById('readData');
    const readOutput = document.getElementById('readOutput');
    const statsOutput = document.getElementById('statsOutput');
    const createForm = document.getElementById('createForm');
    const createOutput = document.getElementById('createOutput');
    const updateForm = document.getElementById('updateForm');
    const updateOutput = document.getElementById('updateOutput');
    const deleteForm = document.getElementById('deleteForm');
    const deleteOutput = document.getElementById('deleteOutput');
    const getDataForIdBtn = document.getElementById('getDataForId');

    // READ művelet - Adatok lekérése
    function fetchData() {
        readOutput.innerHTML = '<p>Adatok betöltése...</p>';
        
        const params = new URLSearchParams();
        params.append('op', 'read');
        params.append('code', CODE);
        
        fetch(`${API_URL}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hiba! Státusz: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = text ? JSON.parse(text) : null;
                
                if (data && data.list && data.list.length > 0) {
                    displayData(data.list);
                    calculateStats(data.list);
                } else {
                    readOutput.innerHTML = '<p class="info">Nincsenek elérhető adatok.</p>';
                    statsOutput.innerHTML = '';
                }
            } catch (e) {
                console.error('JSON parse error:', e, 'Response text:', text);
                readOutput.innerHTML = `
                    <p class="error">Hiba történt az adatok feldolgozásában</p>
                    <p class="debug">Válasz: ${text}</p>
                `;
            }
        })
        .catch(error => {
            readOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
            console.error('Error:', error);
        });
    }

    function displayData(data) {
        let html = '<div class="data-container"><h4>Adatok:</h4><ul>';
        
        data.forEach(item => {
            html += `
                <li class="data-item">
                    <span class="data-id">ID: ${item.id}</span>
                    <span class="data-name">Név: ${item.name}</span>
                    <span class="data-height">Magasság: ${item.height}</span>
                    <span class="data-weight">Súly: ${item.weight}</span>
                </li>
            `;
        });
        
        html += '</ul></div>';
        readOutput.innerHTML = html;
    }

    function calculateStats(data) {
        const heights = data.map(item => {
            const height = parseFloat(item.height);
            return isNaN(height) ? 0 : height;
        });
        
        if (heights.length === 0) {
            statsOutput.innerHTML = '<p class="info">Nincsenek érvényes magasság adatok.</p>';
            return;
        }
        
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = sum / heights.length;
        const max = Math.max(...heights);
        
        statsOutput.innerHTML = `
            <div class="stats-container">
                <h4>Statisztikák:</h4>
                <ul>
                    <li>Összeg: ${sum.toFixed(2)}</li>
                    <li>Átlag: ${avg.toFixed(2)}</li>
                    <li>Maximum: ${max.toFixed(2)}</li>
                </ul>
            </div>
        `;
    }

    // CREATE művelet - Új adat létrehozása
    createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('createName').value.trim();
        const height = document.getElementById('createHeight').value.trim();
        const weight = document.getElementById('createWeight').value.trim();
        
        // Validáció
        if (!name || !height || !weight) {
            createOutput.innerHTML = '<p class="error">Minden mező kitöltése kötelező!</p>';
            return;
        }
        
        if (name.length > 30 || height.length > 30 || weight.length > 30) {
            createOutput.innerHTML = '<p class="error">A mezők maximális hossza 30 karakter!</p>';
            return;
        }
        
        const params = new URLSearchParams();
        params.append('op', 'create');
        params.append('name', name);
        params.append('height', height);
        params.append('weight', weight);
        params.append('code', CODE);
        
        createOutput.innerHTML = '<p class="info">Adat létrehozása folyamatban...</p>';
        
        fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(text => {
            try {
                const result = text ? parseInt(text) : 0;
                
                if (result === 1) {
                    createOutput.innerHTML = '<p class="success">Adat sikeresen létrehozva!</p>';
                    createForm.reset();
                    fetchData(); // Frissítjük az adatokat
                } else {
                    createOutput.innerHTML = `
                        <p class="error">Hiba történt az adat létrehozásakor.</p>
                        <p class="debug">Válasz: ${text}</p>
                    `;
                }
            } catch (e) {
                createOutput.innerHTML = `
                    <p class="error">Hiba történt a válasz feldolgozásában</p>
                    <p class="debug">Válasz: ${text}</p>
                `;
            }
        })
        .catch(error => {
            createOutput.innerHTML = `<p class="error">Hálózati hiba: ${error.message}</p>`;
        });
    });

    // UPDATE művelet - Adat frissítése
    getDataForIdBtn.addEventListener('click', function() {
        const id = document.getElementById('updateId').value.trim();
        
        if (!id) {
            updateOutput.innerHTML = '<p class="error">ID megadása kötelező!</p>';
            return;
        }
        
        fetchDataById(id);
    });

    function fetchDataById(id) {
        updateOutput.innerHTML = '<p class="info">Adatok betöltése...</p>';
        
        const params = new URLSearchParams();
        params.append('op', 'read');
        params.append('code', CODE);
        
        fetch(`${API_URL}?${params.toString()}`)
        .then(response => response.text())
        .then(text => {
            try {
                const data = text ? JSON.parse(text) : null;
                
                if (data && data.list) {
                    const item = data.list.find(i => i.id === id);
                    
                    if (item) {
                        document.getElementById('updateName').value = item.name;
                        document.getElementById('updateHeight').value = item.height;
                        document.getElementById('updateWeight').value = item.weight;
                        updateOutput.innerHTML = '<p class="success">Adatok betöltve!</p>';
                    } else {
                        updateOutput.innerHTML = '<p class="error">Nem található adat a megadott ID-val.</p>';
                    }
                } else {
                    updateOutput.innerHTML = '<p class="error">Nincsenek elérhető adatok.</p>';
                }
            } catch (e) {
                updateOutput.innerHTML = `
                    <p class="error">Hiba történt az adatok feldolgozásában</p>
                    <p class="debug">Válasz: ${text}</p>
                `;
            }
        })
        .catch(error => {
            updateOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
        });
    }

    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('updateId').value.trim();
        const name = document.getElementById('updateName').value.trim();
        const height = document.getElementById('updateHeight').value.trim();
        const weight = document.getElementById('updateWeight').value.trim();
        
        // Validáció
        if (!id || !name || !height || !weight) {
            updateOutput.innerHTML = '<p class="error">Minden mező kitöltése kötelező!</p>';
            return;
        }
        
        if (name.length > 30 || height.length > 30 || weight.length > 30) {
            updateOutput.innerHTML = '<p class="error">A mezők maximális hossza 30 karakter!</p>';
            return;
        }
        
        const params = new URLSearchParams();
        params.append('op', 'update');
        params.append('id', id);
        params.append('name', name);
        params.append('height', height);
        params.append('weight', weight);
        params.append('code', CODE);
        
        updateOutput.innerHTML = '<p class="info">Adat frissítése folyamatban...</p>';
        
        fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(text => {
            try {
                const result = text ? parseInt(text) : 0;
                
                if (result === 1) {
                    updateOutput.innerHTML = '<p class="success">Adat sikeresen frissítve!</p>';
                    fetchData(); // Frissítjük az adatokat
                } else {
                    updateOutput.innerHTML = `
                        <p class="error">Hiba történt az adat frissítésekor.</p>
                        <p class="debug">Válasz: ${text}</p>
                    `;
                }
            } catch (e) {
                updateOutput.innerHTML = `
                    <p class="error">Hiba történt a válasz feldolgozásában</p>
                    <p class="debug">Válasz: ${text}</p>
                `;
            }
        })
        .catch(error => {
            updateOutput.innerHTML = `<p class="error">Hálózati hiba: ${error.message}</p>`;
        });
    });

    // DELETE művelet - Adat törlése
    deleteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('deleteId').value.trim();
        
        if (!id) {
            deleteOutput.innerHTML = '<p class="error">ID megadása kötelező!</p>';
            return;
        }
        
        if (!confirm('Biztosan törölni szeretné ezt az adatot?')) {
            return;
        }
        
        const params = new URLSearchParams();
        params.append('op', 'delete');
        params.append('id', id);
        params.append('code', CODE);
        
        deleteOutput.innerHTML = '<p class="info">Adat törlése folyamatban...</p>';
        
        fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(text => {
            try {
                const result = text ? parseInt(text) : 0;
                
                if (result === 1) {
                    deleteOutput.innerHTML = '<p class="success">Adat sikeresen törölve!</p>';
                    fetchData(); // Frissítjük az adatokat
                    deleteForm.reset();
                } else {
                    deleteOutput.innerHTML = `
                        <p class="error">Hiba történt az adat törlésekor.</p>
                        <p class="debug">Válasz: ${text}</p>
                    `;
                }
            } catch (e) {
                deleteOutput.innerHTML = `
                    <p class="error">Hiba történt a válasz feldolgozásában</p>
                    <p class="debug">Válasz: ${text}</p>
                `;
            }
        })
        .catch(error => {
            deleteOutput.innerHTML = `<p class="error">Hálózati hiba: ${error.message}</p>`;
        });
    });

    // Eseményfigyelők
    readDataBtn.addEventListener('click', fetchData);
    
    // Kezdeti adatok betöltése
    fetchData();
});