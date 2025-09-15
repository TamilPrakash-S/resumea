const loanAmountInput = document.getElementById("loanAmount");
const interestRateInput = document.getElementById("interestRate");
const loanTenureInput = document.getElementById("loanTenure");
const tenureTypeInput = document.getElementById("tenureType");

const emiResult = document.getElementById("emi");
const loanAmountResult = document.getElementById("loanAmountResult");
const totalInterestResult = document.getElementById("totalInterest");
const totalPaymentResult = document.getElementById("totalPayment");
const amountWords = document.getElementById("amountWords");
const scheduleTableBody = document.querySelector("#scheduleTable tbody");

let scheduleMode = "yearly";
let emiChart;

// Format numbers in Indian style
function formatIndianNumber(num) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num).replace('₹', '');
}

// Convert number to words (Indian system)
function numberToWords(num) {
    // This is an improved version of the number to words function, with better handling of large numbers
    const units = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab"];
    let words = "";
    let i = 0;
    while (num > 0) {
        let chunk;
        if (i === 0) {
            chunk = num % 1000;
            num = Math.floor(num / 1000);
        } else {
            chunk = num % 100;
            num = Math.floor(num / 100);
        }
        if (chunk) {
            words = convertChunk(chunk) + " " + units[i] + " " + words;
        }
        i++;
    }
    return words.trim() + " Rupees Only";
}

function convertChunk(n) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertChunk(n % 100) : "");
    return "";
}

// EMI Calculation
function calculateEMI() {
    loanAmountResult.innerHTML = loanAmountInput.value;
    let principal = parseInt(loanAmountInput.value.replace(/,/g, "")) || 0;
    let rate = parseFloat(interestRateInput.value) / 100 / 12;
    let tenure = parseInt(loanTenureInput.value) || 0;

    if (tenureTypeInput.value === "years") {
        tenure *= 12;
    }

    // Input Validation and Feedback
    if (principal < 1) {
        amountWords.textContent = "Please enter a positive amount";
    } else {
        loanAmountInput.value = formatIndianNumber(principal);
        amountWords.textContent = numberToWords(principal);
    }

    if (principal > 0 && rate > 0 && tenure > 0) {
        const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
        const totalPayment = emi * tenure;
        const totalInterest = totalPayment - principal;

        emiResult.textContent = formatIndianNumber(Math.round(emi));
        totalInterestResult.textContent = formatIndianNumber(Math.round(totalInterest));
        totalPaymentResult.textContent = formatIndianNumber(Math.round(totalPayment));

        updateChart(principal, totalInterest);
        buildSchedule(principal, rate, tenure, emi);
    } else {
        emiResult.textContent = "0";
        totalInterestResult.textContent = "0";
        totalPaymentResult.textContent = "0";
        updateChart(0, 0);
        scheduleTableBody.innerHTML = "";
    }
}

// Update Chart
function updateChart(principal, interest) {
    const ctx = document.getElementById("emiChart").getContext("2d");
    if (emiChart) emiChart.destroy();

    const chartData = [principal, interest];
    const chartLabels = ["Principal", "Interest"];

    emiChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: ["#006056", "#F50057"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

// Build Amortization Schedule
function buildSchedule(principal, rate, tenure, emi) {
    let balance = principal;
    scheduleTableBody.innerHTML = "";

    if (scheduleMode === "monthly") {
        document.getElementById("periodHeader").textContent = "Month";
        for (let month = 1; month <= tenure; month++) {
            let interest = balance * rate;
            let principalComp = emi - interest;
            balance -= principalComp;

            const row = `<tr>
                <td>${month}</td>
                <td>₹ ${formatIndianNumber(Math.round(principalComp))}</td>
                <td>₹ ${formatIndianNumber(Math.round(interest))}</td>
                <td>₹ ${formatIndianNumber(Math.round(balance > 0 ? balance : 0))}</td>
            </tr>`;
            scheduleTableBody.innerHTML += row;
        }
    } else { // Yearly
        document.getElementById("periodHeader").textContent = "Year";
        let year = 1, totalPrincipal = 0, totalInterest = 0;
        for (let month = 1; month <= tenure; month++) {
            let interest = balance * rate;
            let principalComp = emi - interest;
            balance -= principalComp;
            totalPrincipal += principalComp;
            totalInterest += interest;

            if (month % 12 === 0 || month === tenure) {
                const row = `<tr>
                    <td>${year}</td>
                    <td>₹ ${formatIndianNumber(Math.round(totalPrincipal))}</td>
                    <td>₹ ${formatIndianNumber(Math.round(totalInterest))}</td>
                    <td>₹ ${formatIndianNumber(Math.round(balance > 0 ? balance : 0))}</td>
                </tr>`;
                scheduleTableBody.innerHTML += row;
                year++;
                totalPrincipal = 0;
                totalInterest = 0;
            }
        }
    }
}

// Events
loanAmountInput.addEventListener("input", calculateEMI);
interestRateInput.addEventListener("input", calculateEMI);
loanTenureInput.addEventListener("input", calculateEMI);
tenureTypeInput.addEventListener("change", calculateEMI);

document.getElementById("yearlyBtn").addEventListener("click", () => {
    scheduleMode = "yearly";
    document.getElementById("yearlyBtn").classList.add("active");
    document.getElementById("monthlyBtn").classList.remove("active");
    calculateEMI();
});

document.getElementById("monthlyBtn").addEventListener("click", () => {
    scheduleMode = "monthly";
    document.getElementById("monthlyBtn").classList.add("active");
    document.getElementById("yearlyBtn").classList.remove("active");
    calculateEMI();
});

// Initial calculation on page load
calculateEMI();