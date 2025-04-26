document.addEventListener('DOMContentLoaded', function() {
    // Kezdeti adatok
    let tableData = [
        { id: 1, name: "Kovács János", age: 32, city: "Budapest", job: "Fejlesztő" },
        { id: 2, name: "Nagy Anna", age: 28, city: "Debrecen", job: "Tervező" },
        { id: 3, name: "Tóth Péter", age: 45, city: "Szeged", job: "Manager" },
        { id: 4, name: "Szabó Éva", age: 24, city: "Pécs", job: "Marketing" }
    ];
    
    // DOM elemek
    const tableBody = document.querySelector('#dataTable tbody');
    const addRowBtn = document.getElementById('addRowBtn');
    const editForm = document.getElementById('editForm');
    const rowForm = document.getElementById('rowForm');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const searchColumn = document.getElementById('searchColumn');
    const sortIcons = document.querySelectorAll('.sort-icon');
    
    // Táblázat feltöltése
    function renderTable(data = tableData) {
        tableBody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.age}</td>
                <td>${row.city}</td>
                <td>${row.job}</td>
                <td>
                    <button class="edit-btn" data-id="${row.id}">Szerkeszt</button>
                    <button class="delete-btn" data-id="${row.id}">Töröl</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        
        // Eseménykezelők hozzáadása
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editRow);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteRow);
        });
    }
    
    // Új sor hozzáadása
    addRowBtn.addEventListener('click', function() {
        document.getElementById('editId').value = '';
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('city').value = '';
        document.getElementById('job').value = '';
        editForm.style.display = 'block';
    });
    
    // Sor szerkesztése
    function editRow(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = tableData.find(item => item.id === id);
        
        if (row) {
            document.getElementById('editId').value = row.id;
            document.getElementById('name').value = row.name;
            document.getElementById('age').value = row.age;
            document.getElementById('city').value = row.city;
            document.getElementById('job').value = row.job;
            editForm.style.display = 'block';
        }
    }
    
    // Sor törlése
    function deleteRow(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (confirm('Biztosan törölni szeretné ezt a sort?')) {
            tableData = tableData.filter(item => item.id !== id);
            renderTable();
        }
    }
    
    // Űrlap mentése
    rowForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validáció
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const city = document.getElementById('city').value.trim();
        const job = document.getElementById('job').value.trim();
        
        if (!name || !age || !city || !job) {
            alert('Minden mező kitöltése kötelező!');
            return;
        }
        
        if (name.length > 50 || city.length > 50 || job.length > 50) {
            alert('A mezők maximális hossza 50 karakter!');
            return;
        }
        
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
            alert('A kor 1 és 120 közötti szám kell legyen!');
            return;
        }
        
        const id = document.getElementById('editId').value;
        const newRow = {
            id: id ? parseInt(id) : Math.max(...tableData.map(item => item.id)) + 1,
            name: name,
            age: ageNum,
            city: city,
            job: job
        };
        
        if (id) {
            // Módosítás
            const index = tableData.findIndex(item => item.id === newRow.id);
            if (index !== -1) {
                tableData[index] = newRow;
            }
        } else {
            // Új sor
            tableData.push(newRow);
        }
        
        editForm.style.display = 'none';
        renderTable();
    });
    
    // Modal bezárása
    closeBtn.addEventListener('click', function() {
        editForm.style.display = 'none';
    });
    
    // Keresés
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const column = searchColumn.value;
        
        if (!searchTerm) {
            renderTable();
            return;
        }
        
        const filteredData = tableData.filter(row => {
            if (column === 'all') {
                return (
                    row.name.toLowerCase().includes(searchTerm) ||
                    row.age.toString().includes(searchTerm) ||
                    row.city.toLowerCase().includes(searchTerm) ||
                    row.job.toLowerCase().includes(searchTerm)
                );
            } else {
                const colIndex = parseInt(column);
                switch (colIndex) {
                    case 0: return row.name.toLowerCase().includes(searchTerm);
                    case 1: return row.age.toString().includes(searchTerm);
                    case 2: return row.city.toLowerCase().includes(searchTerm);
                    case 3: return row.job.toLowerCase().includes(searchTerm);
                    default: return true;
                }
            }
        });
        
        renderTable(filteredData);
    });
    
    // Rendezés
    document.querySelectorAll('#dataTable th').forEach((th, index) => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            const isAsc = this.classList.contains('asc');
            
            // Rendezési ikonok frissítése
            document.querySelectorAll('#dataTable th').forEach(th => {
                th.classList.remove('asc', 'desc');
                th.querySelector('.sort-icon').textContent = '';
            });
            
            // Új rendezés
            if (isAsc) {
                this.classList.add('desc');
                this.querySelector('.sort-icon').textContent = '↑';
                sortTable(column, false);
            } else {
                this.classList.add('asc');
                this.querySelector('.sort-icon').textContent = '↓';
                sortTable(column, true);
            }
        });
    });
    
    function sortTable(column, ascending) {
        tableData.sort((a, b) => {
            let aValue, bValue;
            
            switch (column) {
                case '0': aValue = a.name; bValue = b.name; break;
                case '1': aValue = a.age; bValue = b.age; break;
                case '2': aValue = a.city; bValue = b.city; break;
                case '3': aValue = a.job; bValue = b.job; break;
                default: return 0;
            }
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return ascending ? -1 : 1;
            if (aValue > bValue) return ascending ? 1 : -1;
            return 0;
        });
        
        renderTable();
    }
    
    // Kezdeti renderelés
    renderTable();
});