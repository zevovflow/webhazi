document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('dataTable');
    const ctx = document.getElementById('myChart').getContext('2d');
    const showRevenue = document.getElementById('showRevenue');
    const showExpense = document.getElementById('showExpense');
    const showProfit = document.getElementById('showProfit');
    const showProfitability = document.getElementById('showProfitability');
    
    // Adatok kinyerése a táblázatból
    function getTableData() {
        const rows = table.querySelectorAll('tbody tr');
        const data = {
            labels: [],
            revenue: [],
            expense: [],
            profit: [],
            profitability: []
        };
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            data.labels.push(cells[0].textContent);
            data.revenue.push(parseFloat(cells[1].textContent));
            data.expense.push(parseFloat(cells[2].textContent));
            data.profit.push(parseFloat(cells[3].textContent));
            data.profitability.push(parseFloat(cells[4].textContent));
        });
        
        return data;
    }
    
    // Diagram létrehozása
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Vállalati teljesítmény'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Év'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Érték'
                    }
                }
            }
        }
    });
    
    // Diagram frissítése
    function updateChart(dataIndex) {
        const tableData = getTableData();
        let dataset;
        
        switch (dataIndex) {
            case 1:
                dataset = {
                    label: 'Bevétel',
                    data: tableData.revenue,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                };
                break;
            case 2:
                dataset = {
                    label: 'Kiadás',
                    data: tableData.expense,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                };
                break;
            case 3:
                dataset = {
                    label: 'Profit',
                    data: tableData.profit,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                };
                break;
            case 4:
                dataset = {
                    label: 'Nyereségesség (%)',
                    data: tableData.profitability,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    tension: 0.1
                };
                break;
        }
        
        myChart.data.labels = tableData.labels;
        myChart.data.datasets = [dataset];
        myChart.update();
    }
    
    // Eseménykezelők
    showRevenue.addEventListener('click', function() {
        updateChart(1);
    });
    
    showExpense.addEventListener('click', function() {
        updateChart(2);
    });
    
    showProfit.addEventListener('click', function() {
        updateChart(3);
    });
    
    showProfitability.addEventListener('click', function() {
        updateChart(4);
    });
    
    // Kezdeti diagram
    updateChart(1);
    
    // Sor kiválasztása
    table.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            // Eltávolítjuk a korábbi kiválasztást
            table.querySelectorAll('tbody tr').forEach(r => {
                r.classList.remove('selected');
            });
            
            // Kiválasztjuk az aktuális sort
            this.classList.add('selected');
            
            // Megjelenítjük a sor adatait
            const cells = this.querySelectorAll('td');
            const rowData = {
                year: cells[0].textContent,
                revenue: parseFloat(cells[1].textContent),
                expense: parseFloat(cells[2].textContent),
                profit: parseFloat(cells[3].textContent),
                profitability: parseFloat(cells[4].textContent)
            };
            
            // Frissítjük a diagramot a sor adataival
            myChart.data.labels = ['Bevétel', 'Kiadás', 'Profit', 'Nyereségesség'];
            myChart.data.datasets = [{
                label: rowData.year,
                data: [rowData.revenue, rowData.expense, rowData.profit, rowData.profitability],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }];
            myChart.type = 'bar';
            myChart.options.plugins.title.text = `${rowData.year} évi adatok`;
            myChart.update();
        });
    });
});