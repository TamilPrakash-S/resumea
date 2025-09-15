async function fetchData() {

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const values = data.values;

        if (values && values.length > 0) {
            const tableBody = document.querySelector('#chit-data tbody');
            tableBody.innerHTML = "";

            let totalAmount = 0;
            let claimedCount = 0;
            const claimers = {};
            const months = [];
            const amounts = [];

            values.forEach((row, index) => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);

                // Stats
                totalAmount += parseInt(row[2]);
                if (row[3] && row[3] !== "-") {
                    claimers[row[3]] = (claimers[row[3]] || 0) + 1;
                    claimedCount++;
                }
                months.push(row[1]);
                amounts.push(parseInt(row[2]));
            });

            // Update Summary
            document.getElementById("total-members").textContent = Object.keys(months).length;
            document.getElementById("total-amount").textContent = totalAmount;
            document.getElementById("months-completed").textContent = claimedCount;

            // Charts
            renderCharts(months, amounts, claimers);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderCharts(months, amounts, claimers) {
    // Line Chart (Amount Growth)
    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: months,
            datasets: [{
                label: "Chit Amount",
                data: amounts,
                borderColor: "#ffce56",
                backgroundColor: "rgba(255,206,86,0.3)",
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true }
    });

    // Doughnut Chart (Claims Distribution)
    new Chart(document.getElementById("doughnutChart"), {
        type: "doughnut",
        data: {
            labels: Object.keys(claimers).map((e, i) => e + " - " + amounts[i]),
            datasets: [{
                data: amounts.slice(0, Object.keys(claimers).length),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        },
        options: { responsive: true }
    });
}

fetchData();
