document.addEventListener('DOMContentLoaded', function() {
    // Alap Shape osztály
    class Shape {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color || this.getRandomColor();
            this.element = null;
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;
        }
        
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
        createElement(tag, className) {
            const element = document.createElement(tag);
            element.className = `shape ${className}`;
            element.style.left = `${this.x}px`;
            element.style.top = `${this.y}px`;
            element.style.backgroundColor = this.color;
            
            // Drag and drop események
            element.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());
            
            return element;
        }
        
        startDrag(e) {
            this.isDragging = true;
            this.offsetX = e.clientX - this.x;
            this.offsetY = e.clientY - this.y;
            
            // Kiválasztott elem kiemelése
            document.querySelectorAll('.shape').forEach(shape => {
                shape.style.zIndex = 0;
            });
            this.element.style.zIndex = 10;
            
            // Információk megjelenítése
            this.displayInfo();
        }
        
        drag(e) {
            if (!this.isDragging) return;
            
            this.x = e.clientX - this.offsetX;
            this.y = e.clientY - this.offsetY;
            
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            
            // Információk frissítése
            this.displayInfo();
        }
        
        stopDrag() {
            this.isDragging = false;
        }
        
        displayInfo() {
            const infoDiv = document.getElementById('shapeInfo');
            infoDiv.innerHTML = `
                <h3>${this.constructor.name}</h3>
                <p>Pozíció: (${this.x}, ${this.y})</p>
                <p>Szín: ${this.color}</p>
                ${this.getAdditionalInfo()}
            `;
        }
        
        getAdditionalInfo() {
            return '';
        }
        
        render(container) {
            container.appendChild(this.element);
        }
    }
    
    // Circle osztály
    class Circle extends Shape {
        constructor(x, y, radius, color) {
            super(x, y, color);
            this.radius = radius || Math.floor(Math.random() * 50) + 20;
            this.element = this.createElement('div', 'circle');
            this.element.style.width = `${this.radius * 2}px`;
            this.element.style.height = `${this.radius * 2}px`;
            this.element.style.borderRadius = '50%';
        }
        
        getAdditionalInfo() {
            return `<p>Sugár: ${this.radius}</p>`;
        }
    }
    
    // Rectangle osztály
    class Rectangle extends Shape {
        constructor(x, y, width, height, color) {
            super(x, y, color);
            this.width = width || Math.floor(Math.random() * 100) + 50;
            this.height = height || Math.floor(Math.random() * 100) + 50;
            this.element = this.createElement('div', 'rectangle');
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
        }
        
        getAdditionalInfo() {
            return `<p>Szélesség: ${this.width}, Magasság: ${this.height}</p>`;
        }
    }
    
    // Triangle osztály (SVG használatával)
    class Triangle extends Shape {
        constructor(x, y, size, color) {
            super(x, y, color);
            this.size = size || Math.floor(Math.random() * 80) + 40;
            this.element = this.createElementNS('svg', 'triangle');
            this.element.setAttribute('width', this.size);
            this.element.setAttribute('height', this.size);
            
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', `${this.size/2},0 0,${this.size} ${this.size},${this.size}`);
            polygon.setAttribute('fill', this.color);
            
            this.element.appendChild(polygon);
        }
        
        createElementNS(tag, className) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            element.setAttribute('class', `shape ${className}`);
            element.style.left = `${this.x}px`;
            element.style.top = `${this.y}px`;
            element.style.position = 'absolute';
            
            // Drag and drop események
            element.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());
            
            return element;
        }
        
        getAdditionalInfo() {
            return `<p>Méret: ${this.size}</p>`;
        }
    }
    
    // Alkalmazás vezérlő
    class ShapeApp {
        constructor() {
            this.shapeContainer = document.getElementById('shapeContainer');
            this.shapes = [];
            
            this.initEvents();
        }
        
        initEvents() {
            document.getElementById('createCircle').addEventListener('click', () => this.createRandomCircle());
            document.getElementById('createRectangle').addEventListener('click', () => this.createRandomRectangle());
            document.getElementById('createTriangle').addEventListener('click', () => this.createRandomTriangle());
            document.getElementById('clearShapes').addEventListener('click', () => this.clearShapes());
        }
        
        createRandomCircle() {
            const x = Math.floor(Math.random() * (this.shapeContainer.offsetWidth - 100));
            const y = Math.floor(Math.random() * (this.shapeContainer.offsetHeight - 100));
            const circle = new Circle(x, y);
            circle.render(this.shapeContainer);
            this.shapes.push(circle);
        }
        
        createRandomRectangle() {
            const x = Math.floor(Math.random() * (this.shapeContainer.offsetWidth - 150));
            const y = Math.floor(Math.random() * (this.shapeContainer.offsetHeight - 150));
            const rectangle = new Rectangle(x, y);
            rectangle.render(this.shapeContainer);
            this.shapes.push(rectangle);
        }
        
        createRandomTriangle() {
            const x = Math.floor(Math.random() * (this.shapeContainer.offsetWidth - 100));
            const y = Math.floor(Math.random() * (this.shapeContainer.offsetHeight - 100));
            const triangle = new Triangle(x, y);
            triangle.render(this.shapeContainer);
            this.shapes.push(triangle);
        }
        
        clearShapes() {
            this.shapeContainer.innerHTML = '';
            this.shapes = [];
            document.getElementById('shapeInfo').innerHTML = '';
        }
    }
    
    // Alkalmazás indítása
    new ShapeApp();
});