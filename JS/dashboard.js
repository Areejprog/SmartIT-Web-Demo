// =========================================================
// Smart IT Web Demo - Dashboard
// LocalStorage Version
// =========================================================

const ASSETS_STORAGE_KEY = "smartIT_assets";
const TICKETS_STORAGE_KEY = "smartIT_tickets";

let assets = [];
let tickets = [];


// =========================
// Date & Time
// =========================

function updateDateTime() {

    const now = new Date();

    const dateElement =
        document.getElementById("dateTime");

    if (dateElement) {

        dateElement.textContent =
            now.toLocaleString();

    }
}


// =========================
// Load LocalStorage Data
// =========================

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
            "Failed to load dashboard data:",
            error
        );

        assets = [];
        tickets = [];
    }
}


// =========================
// Risk Analysis
// =========================

function calculateRiskAnalysis() {

    let riskScore = 0;

    const riskFactors = [];
    const recommendations = [];

    // ---------------------------------
    // 1. Open Tickets
    // ---------------------------------

    const openTickets =
        tickets.filter(ticket =>
            String(ticket.status || "")
                .trim()
                .toLowerCase() === "open"
        );

    if (openTickets.length > 0) {

        const openTicketScore =
            Math.min(openTickets.length * 5, 20);

        riskScore += openTicketScore;

        riskFactors.push(
            `${openTickets.length} open service ticket${openTickets.length > 1 ? "s" : ""} remain unresolved.`
        );

        recommendations.push(
            "Review and resolve open service tickets."
        );
    }


    // ---------------------------------
    // 2. High Priority Tickets
    // ---------------------------------

    const highPriorityTickets =
        tickets.filter(ticket =>
            ["high", "critical"].includes(
                String(ticket.priority || "")
                    .trim()
                    .toLowerCase()
            )
        );

    if (highPriorityTickets.length > 0) {

        const highPriorityScore =
            Math.min(highPriorityTickets.length * 8, 24);

        riskScore += highPriorityScore;

        riskFactors.push(
            `${highPriorityTickets.length} high-priority ticket${highPriorityTickets.length > 1 ? "s" : ""} require attention.`
        );

        recommendations.push(
            "Prioritize high-priority service requests."
        );
    }


    // ---------------------------------
    // 3. Maintenance Assets
    // ---------------------------------

    const maintenanceAssets =
        assets.filter(asset =>
            String(asset.status || "")
                .trim()
                .toLowerCase() === "maintenance"
        );

    if (maintenanceAssets.length > 0) {

        const maintenanceScore =
            Math.min(maintenanceAssets.length * 6, 18);

        riskScore += maintenanceScore;

        riskFactors.push(
            `${maintenanceAssets.length} asset${maintenanceAssets.length > 1 ? "s are" : " is"} currently under maintenance.`
        );

        recommendations.push(
            "Monitor assets under maintenance and verify service completion."
        );
    }


    // ---------------------------------
    // 4. Inactive Assets
    // ---------------------------------

    const inactiveAssets =
        assets.filter(asset =>
            ["inactive", "retired"].includes(
                String(asset.status || "")
                    .trim()
                    .toLowerCase()
            )
        );

    if (inactiveAssets.length > 0) {

        const inactiveScore =
            Math.min(inactiveAssets.length * 4, 12);

        riskScore += inactiveScore;

        riskFactors.push(
            `${inactiveAssets.length} inactive or retired asset${inactiveAssets.length > 1 ? "s" : ""} detected.`
        );

        recommendations.push(
            "Review inactive and retired assets and update their lifecycle status."
        );
    }


    // ---------------------------------
    // 5. Asset-to-Ticket Ratio
    // ---------------------------------

    if (
        assets.length > 0 &&
        tickets.length > assets.length
    ) {

        riskScore += 8;

        riskFactors.push(
            "The number of service tickets is relatively high compared with the number of managed assets."
        );

        recommendations.push(
            "Review recurring service issues and identify assets generating repeated tickets."
        );
    }


    // ---------------------------------
    // Limit Score
    // ---------------------------------

    riskScore =
        Math.min(riskScore, 100);


    // ---------------------------------
    // Risk Level
    // ---------------------------------

    let riskLevel = "Low";

    if (riskScore >= 75) {

        riskLevel = "Critical";

    } else if (riskScore >= 50) {

        riskLevel = "High";

    } else if (riskScore >= 25) {

        riskLevel = "Medium";

    }


    // ---------------------------------
    // No Risk Data
    // ---------------------------------

    if (
        assets.length === 0 &&
        tickets.length === 0
    ) {

        riskScore = 0;
        riskLevel = "Low";

        riskFactors.push(
            "No assets or service tickets are currently recorded."
        );

        recommendations.push(
            "Add IT assets and service tickets to begin monitoring operational risk."
        );
    }


    return {
        risk_score: riskScore,
        risk_level: riskLevel,
        risk_factors: riskFactors,
        recommendations: recommendations
    };
}


// =========================
// Update Main Statistics
// =========================

function updateStatistics() {

    const totalAssets =
        document.getElementById("totalAssets");

    const openTickets =
        document.getElementById("openTickets");

    const closedTickets =
        document.getElementById("closedTickets");

    const maintenanceAssets =
        document.getElementById("maintenanceAssets");


    // Total Assets

    if (totalAssets) {

        totalAssets.textContent =
            assets.length;

    }


    // Open Tickets

    if (openTickets) {

        openTickets.textContent =
            tickets.filter(ticket =>
                String(ticket.status || "")
                    .trim()
                    .toLowerCase() === "open"
            ).length;

    }


    // Closed Tickets

    if (closedTickets) {

        closedTickets.textContent =
            tickets.filter(ticket =>
                String(ticket.status || "")
                    .trim()
                    .toLowerCase() === "closed"
            ).length;

    }


    // Maintenance Assets

    if (maintenanceAssets) {

        maintenanceAssets.textContent =
            assets.filter(asset =>
                String(asset.status || "")
                    .trim()
                    .toLowerCase() === "maintenance"
            ).length;

    }
}


// =========================
// Update Risk UI
// =========================

function updateRiskAnalysis(riskData) {

    const riskScore =
        document.getElementById("riskScore");

    const riskLevelElement =
        document.getElementById("riskLevel");

    const riskFactors =
        document.getElementById("riskFactors");

    const recommendations =
        document.getElementById("recommendations");


    // ---------------------------------
    // Risk Score
    // ---------------------------------

    if (riskScore) {

        riskScore.textContent =
            riskData.risk_score;

    }


    // ---------------------------------
    // Risk Level
    // ---------------------------------

    if (riskLevelElement) {

        riskLevelElement.textContent =
            riskData.risk_level;

        riskLevelElement.className = "";

        switch (
            String(riskData.risk_level)
                .toLowerCase()
        ) {

            case "low":

                riskLevelElement.classList.add(
                    "risk-low"
                );

                break;

            case "medium":

                riskLevelElement.classList.add(
                    "risk-medium"
                );

                break;

            case "high":

                riskLevelElement.classList.add(
                    "risk-high"
                );

                break;

            case "critical":

                riskLevelElement.classList.add(
                    "risk-critical"
                );

                break;
        }
    }


    // ---------------------------------
    // Risk Factors
    // ---------------------------------

    if (riskFactors) {

        riskFactors.innerHTML = "";

        if (
            riskData.risk_factors &&
            riskData.risk_factors.length > 0
        ) {

            riskData.risk_factors.forEach(
                factor => {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        factor;

                    riskFactors.appendChild(li);

                }
            );

        }
    }


    // ---------------------------------
    // Recommendations
    // ---------------------------------

    if (recommendations) {

        recommendations.innerHTML = "";

        if (
            riskData.recommendations &&
            riskData.recommendations.length > 0
        ) {

            riskData.recommendations.forEach(
                recommendation => {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        recommendation;

                    recommendations.appendChild(li);

                }
            );

        }
    }
}


// =========================
// Load Dashboard
// =========================

function loadDashboard() {

    loadData();

    updateStatistics();

    const riskData =
        calculateRiskAnalysis();

    updateRiskAnalysis(
        riskData
    );


    console.log(
        "Dashboard assets:",
        assets
    );

    console.log(
        "Dashboard tickets:",
        tickets
    );

    console.log(
        "Risk analysis:",
        riskData
    );
}


// =========================
// Start Dashboard
// =========================

updateDateTime();

loadDashboard();

setInterval(
    updateDateTime,
    1000
);