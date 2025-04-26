document.addEventListener('DOMContentLoaded', function() {
    // Web Storage példa
    const storageInput = document.getElementById('storageInput');
    const storageOutput = document.getElementById('storageOutput');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    saveBtn.addEventListener('click', function() {
        localStorage.setItem('userInput', storageInput.value);
        storageOutput.textContent = 'Adatok elmentve!';
    });
    
    loadBtn.addEventListener('click', function() {
        const savedData = localStorage.getItem('userInput');
        if (savedData) {
            storageOutput.textContent = `Mentett adat: ${savedData}`;
        } else {
            storageOutput.textContent = 'Nincsenek mentett adatok!';
        }
    });
    
    clearBtn.addEventListener('click', function() {
        localStorage.removeItem('userInput');
        storageOutput.textContent = 'Adatok törölve!';
    });
    
    // Web Worker példa
    // Web Worker inicializálása
    let primeWorker;

    // Prímszám generáló Worker kódja
    const workerCode = `
    function isPrime(n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
    
        if (n % 2 === 0 || n % 3 === 0) return false;
    
        let i = 5;
        let w = 2;
    
        while (i * i <= n) {
            if (n % i === 0) return false;
            i += w;
            w = 6 - w;
    }
    return true;
}

self.onmessage = function(e) {
    const maxPrimes = e.data.maxPrimes;
    let count = 0;
    let n = 2;
    const primes = [];
    
    while (count < maxPrimes) {
        if (isPrime(n)) {
            count++;
            primes.push(n);
            // Progress report
            if (count % 10 === 0 || count === maxPrimes) {
                self.postMessage({
                    type: 'progress',
                    current: count,
                    total: maxPrimes,
                    lastPrime: n
                });
            }
        }
        n++;
    }
    
    self.postMessage({
        type: 'result',
        primes: primes
    });
};`


// Worker indítása
document.getElementById('startWorker').addEventListener('click', function() {
    const maxPrimes = parseInt(document.getElementById('primeLimit').value) || 100;
    
    // Worker létrehozása blob-ból
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    primeWorker = new Worker(URL.createObjectURL(blob));
    
    // UI frissítése
    document.getElementById('startWorker').disabled = true;
    document.getElementById('stopWorker').disabled = false;
    document.getElementById('workerOutput').innerHTML = `
        <p>Állapot: Számolás folyamatban (0/${maxPrimes})</p>
        <div class="progress-container">
            <div class="progress-bar" id="primeProgress"></div>
        </div>
        <ul id="primeList"></ul>
    `;
    
    // Worker üzenetek kezelése
    primeWorker.onmessage = function(e) {
        const data = e.data;
        
        if (data.type === 'progress') {
            // Frissítjük a folyamatjelzőt
            const progressPercent = (data.current / data.total) * 100;
            document.getElementById('primeProgress').style.width = `${progressPercent}%`;
            
            // Frissítjük az állapotsort
            document.querySelector('#workerOutput p').textContent = 
                `Állapot: Számolás folyamatban (${data.current}/${data.total})`;
            
            // Hozzáadjuk az utolsó prímszámot a listához
            const primeList = document.getElementById('primeList');
            const li = document.createElement('li');
            li.textContent = `#${data.current}: ${data.lastPrime}`;
            li.classList.add('prime-highlight');
            primeList.appendChild(li);
            primeList.scrollTop = primeList.scrollHeight;
        }
        else if (data.type === 'result') {
            // Számolás befejeződött
            document.querySelector('#workerOutput p').textContent = 
                `Állapot: Kész! ${data.total} prímszám generálva.`;
            document.getElementById('startWorker').disabled = false;
            document.getElementById('stopWorker').disabled = true;
            
            // Összes prímszám megjelenítése
            const primeList = document.getElementById('primeList');
            primeList.innerHTML = '';
            data.primes.forEach((prime, index) => {
                const li = document.createElement('li');
                li.textContent = `#${index + 1}: ${prime}`;
                primeList.appendChild(li);
            });
        }
    };
    
    // Worker indítása
    primeWorker.postMessage({ maxPrimes: maxPrimes });
});

// Worker megállítása
document.getElementById('stopWorker').addEventListener('click', function() {
    if (primeWorker) {
        primeWorker.terminate();
        document.querySelector('#workerOutput p').textContent += ' (Megszakítva)';
        document.getElementById('startWorker').disabled = false;
        document.getElementById('stopWorker').disabled = true;
    }
});

// Reset gomb
document.getElementById('resetWorker').addEventListener('click', function() {
    if (primeWorker) {
        primeWorker.terminate();
    }
    document.getElementById('workerOutput').innerHTML = `
        <p>Állapot: Készen áll</p>
        <div class="progress-container">
            <div class="progress-bar" id="primeProgress"></div>
        </div>
        <ul id="primeList"></ul>
    `;
    document.getElementById('startWorker').disabled = false;
    document.getElementById('stopWorker').disabled = true;
});
    
    // Server-Sent Events példa (szimuláció)
    const sseOutput = document.getElementById('sseOutput');
    const startSSE = document.getElementById('startSSE');
    const stopSSE = document.getElementById('stopSSE');
    let sseInterval;
    
    startSSE.addEventListener('click', function() {
        let counter = 0;
        sseInterval = setInterval(function() {
            counter++;
            sseOutput.textContent = `Event received (${counter}) - ${new Date().toLocaleTimeString()}`;
        }, 1000);
    });
    
    stopSSE.addEventListener('click', function() {
        clearInterval(sseInterval);
        sseOutput.textContent = "Events stopped";
    });
    
    // Geolocation példa
    const geoOutput = document.getElementById('geoOutput');
    const getLocation = document.getElementById('getLocation');
    
    getLocation.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    geoOutput.innerHTML = `
                        Szélesség: ${position.coords.latitude}<br>
                        Hosszúság: ${position.coords.longitude}<br>
                        Pontosság: ${position.coords.accuracy} méter
                    `;
                },
                function(error) {
                    geoOutput.textContent = `Hiba történt: ${error.message}`;
                }
            );
        } else {
            geoOutput.textContent = "A böngésző nem támogatja a geolokációt!";
        }
    });
    
    // Drag and drop példa
    const dragImage = document.getElementById('dragImage');
    const dropArea = document.getElementById('dropArea');
    
    dragImage.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    });
    
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropArea.classList.add('highlight');
    });
    
    dropArea.addEventListener('dragleave', function() {
        dropArea.classList.remove('highlight');
    });
    
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        dropArea.classList.remove('highlight');
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        dropArea.innerHTML = '';
        dropArea.appendChild(draggedElement);
    });
    
    // Canvas példa
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const clearCanvas = document.getElementById('clearCanvas');
    
    // Egyszerű rajzolás
    let isDrawing = false;
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#007bff';
        
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }
    
    clearCanvas.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // SVG példa
const svgContainer = document.getElementById('svgContainer');
let svgElement;

function createSvg() {
    // SVG elem létrehozása
    svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "200");
    svgElement.setAttribute("height", "200");
    svgElement.style.border = "1px solid #000";
    svgElement.style.display = "block";
    svgElement.style.margin = "10px 0";

    // Kör elem létrehozása
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "100");
    circle.setAttribute("cy", "100");
    circle.setAttribute("r", "80");
    circle.setAttribute("fill", "#007bff");
    circle.setAttribute("id", "svgCircle");

    // Szöveg elem létrehozása
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "100");
    text.setAttribute("y", "120");
    text.setAttribute("font-size", "24");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.textContent = "SVG";

    // Elemek hozzáadása
    svgElement.appendChild(circle);
    svgElement.appendChild(text);
    svgContainer.appendChild(svgElement);
}

// Szín változtatása gomb
document.getElementById('changeSvgColor').addEventListener('click', function() {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('svgCircle').setAttribute('fill', randomColor);
});

// Animáció gomb
document.getElementById('animateSvg').addEventListener('click', function() {
    const circle = document.getElementById('svgCircle');
    let radius = 80;
    let growing = false;
    
    const animation = setInterval(() => {
        if (growing) {
            radius += 2;
            if (radius >= 90) growing = false;
        } else {
            radius -= 2;
            if (radius <= 70) growing = true;
        }
        
        circle.setAttribute('r', radius);
    }, 50);
    
    // 3 másodperc után leállítjuk az animációt
    setTimeout(() => {
        clearInterval(animation);
        circle.setAttribute('r', 80);
    }, 3000);
});

// SVG létrehozása az oldal betöltésekor
createSvg();

});