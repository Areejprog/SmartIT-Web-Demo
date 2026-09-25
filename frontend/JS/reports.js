 // =========================================================
// Smart IT Web Demo - Reports
// LocalStorage Version
// =========================================================

const ASSETS_STORAGE_KEY = "smartIT_assets";
const TICKETS_STORAGE_KEY = "smartIT_tickets";

let assets = [];
let tickets = [];

let assetsChart = null;
let ticketsChart = null;


// =========================================================
// Load Data
// =========================================================

function loadData() {

    try {

        const storedAssets =
            localStorage.getItem(ASSETS_STORAGE_KEY);

        const storedTickets =
            localStorage.getItem(TICKETS_STORAGE_KEY);

        assets =
            storedAssets
                ? JSON.parse(storedAssets)
                : [];

        tickets =
            storedTickets
                ? JSON.parse(storedTickets)
                : [];

    } catch (error) {

        console.error(
            "Failed to load reports data:",
            error
        );

        assets = [];
        tickets = [];
    }
}


// =========================================================
// Count Status
// =========================================================

function countStatus(items, status) {

    return items.filter(item =>
        String(item.status || "")
            .trim()
            .toLowerCase() ===
        status.toLowerCase()
    ).length;
}


// =========================================================
// Update Report Cards
// =========================================================

function updateReportCards() {

    const reportAssets =
        document.getElementById("reportAssets");

    const reportOpen =
        document.getElementById("reportOpen");

    const reportClosed =
        document.getElementById("reportClosed");

    const reportProgress =
        document.getElementById("reportProgress");


    // Total Assets

    if (reportAssets) {

        reportAssets.textContent =
            assets.length;

    }


    // Open Tickets

    if (reportOpen) {

        reportOpen.textContent =
            countStatus(
                tickets,
                "Open"
            );

    }


    // Closed Tickets

    if (reportClosed) {

        reportClosed.textContent =
            countStatus(
                tickets,
                "Closed"
            );

    }


    // In Progress

    if (reportProgress) {

        reportProgress.textContent =
            countStatus(
                tickets,
                "In Progress"
            );

    }
}


// =========================================================
// Assets By Status Chart
// =========================================================

function renderAssetsChart() {

    const canvas =
        document.getElementById("assetsChart");

    if (!canvas) {

        console.error(
            "assetsChart canvas was not found."
        );

        return;
    }


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    const active =
        countStatus(
            assets,
            "Active"
        );

    const maintenance =
        countStatus(
            assets,
            "Maintenance"
        );

    const inactive =
        countStatus(
            assets,
            "Inactive"
        );

    const retired =
        countStatus(
            assets,
            "Retired"
        );


    if (assetsChart) {

        assetsChart.destroy();

    }


    assetsChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Active",
                        "Maintenance",
                        "Inactive",
                        "Retired"
                    ],

                    datasets: [
                        {
                            label:
                                "Assets",

                            data: [
                                active,
                                maintenance,
                                inactive,
                                retired
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }
                }
            }
        );
}


// =========================================================
// Tickets Priority Chart
// =========================================================

function renderTicketsChart() {

    const canvas =
        document.getElementById("ticketsChart");

    if (!canvas) {

        console.error(
            "ticketsChart canvas was not found."
        );

        return;
    }


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    const low =
        tickets.filter(ticket =>
            String(ticket.priority || "")
                .trim()
                .toLowerCase() === "low"
        ).length;


    const medium =
        tickets.filter(ticket =>
            String(ticket.priority || "")
                .trim()
                .toLowerCase() === "medium"
        ).length;


    const high =
        tickets.filter(ticket =>
            String(ticket.priority || "")
                .trim()
                .toLowerCase() === "high"
        ).length;


    const critical =
        tickets.filter(ticket =>
            String(ticket.priority || "")
                .trim()
                .toLowerCase() === "critical"
        ).length;


    if (ticketsChart) {

        ticketsChart.destroy();

    }


    ticketsChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels: [
                        "Low",
                        "Medium",
                        "High",
                        "Critical"
                    ],

                    datasets: [
                        {
                            label:
                                "Tickets",

                            data: [
                                low,
                                medium,
                                high,
                                critical
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }
            }
        );
}


// =========================================================
// Load Reports
// =========================================================

function loadReports() {

    loadData();

    updateReportCards();

    renderAssetsChart();

    renderTicketsChart();


    console.log(
        "Reports assets:",
        assets
    );

    console.log(
        "Reports tickets:",
        tickets
    );
}


// =========================================================
// Start Reports
// =========================================================

loadReports();