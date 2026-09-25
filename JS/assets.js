// =========================================================
// Smart IT Web Demo - Assets
// LocalStorage Version
// =========================================================

const ASSETS_STORAGE_KEY = "smartIT_assets";

let assets = [];


// =========================================================
// Storage Helpers
// =========================================================

function loadAssets() {

    try {

        const storedAssets =
            localStorage.getItem(ASSETS_STORAGE_KEY);

        assets =
            storedAssets
                ? JSON.parse(storedAssets)
                : [];

    } catch (error) {

        console.error(
            "Error loading assets from localStorage:",
            error
        );

        assets = [];
    }

    renderAssets(assets);
}


// =========================================================
// Save Assets
// =========================================================

function saveAssets() {

    localStorage.setItem(
        ASSETS_STORAGE_KEY,
        JSON.stringify(assets)
    );
}


// =========================================================
// Generate Asset ID
// =========================================================

function generateAssetId() {

    let maxNumber = 0;

    assets.forEach(asset => {

        const match =
            String(asset.asset_id || "")
                .match(/^AST-(\d+)$/);

        if (match) {

            const number =
                parseInt(match[1], 10);

            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });

    return (
        "AST-" +
        String(maxNumber + 1).padStart(4, "0")
    );
}


// =========================================================
// Generate Internal ID
// =========================================================

function generateInternalId() {

    if (!assets.length) {
        return 1;
    }

    return Math.max(
        ...assets.map(asset => Number(asset.id) || 0)
    ) + 1;
}


// =========================================================
// Calculate Device Age
// =========================================================

function calculateDeviceAge(purchaseDate) {

    if (!purchaseDate) {
        return "-";
    }

    const purchase = new Date(purchaseDate);
    const today = new Date();

    if (isNaN(purchase.getTime())) {
        return "-";
    }

    let years =
        today.getFullYear() -
        purchase.getFullYear();

    const monthDifference =
        today.getMonth() -
        purchase.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < purchase.getDate()
        )
    ) {
        years--;
    }

    if (years < 0) {
        return "Invalid date";
    }

    if (years === 0) {

        let months =
            (
                today.getFullYear() -
                purchase.getFullYear()
            ) * 12
            +
            today.getMonth() -
            purchase.getMonth();

        if (today.getDate() < purchase.getDate()) {
            months--;
        }

        if (months <= 0) {
            return "Less than 1 year";
        }

        return `${months} month${months > 1 ? "s" : ""}`;
    }

    return `${years} year${years > 1 ? "s" : ""}`;
}


// =========================================================
// Add Asset
// =========================================================

function addAsset() {

    const name =
        document.getElementById("assetName").value.trim();

    const type =
        document.getElementById("assetType").value;

    const department =
        document.getElementById("assetDepartment").value.trim();

    const employee =
        document.getElementById("assetEmployee").value.trim();

    const serialNumber =
        document.getElementById("assetSerial").value.trim();

    const location =
        document.getElementById("assetLocation").value.trim();

    const purchaseDate =
        document.getElementById("assetPurchaseDate").value;

    const status =
        document.getElementById("assetStatus").value;


    // =====================================================
    // Validation
    // =====================================================

    if (!name) {

        alert("Please enter the device name.");
        return;
    }

    if (!type) {

        alert("Please select the device type.");
        return;
    }

    if (!department) {

        alert("Please enter the department.");
        return;
    }

    if (!purchaseDate) {

        alert("Please enter the purchase date.");
        return;
    }


    // =====================================================
    // Create Asset
    // =====================================================

    const assetData = {

        id: generateInternalId(),

        asset_id: generateAssetId(),

        serial_number:
            serialNumber || null,

        name,

        type,

        department,

        employee_name:
            employee || null,

        location:
            location || null,

        purchase_date:
            purchaseDate,

        status

    };


    assets.push(assetData);

    saveAssets();

    alert("Asset added successfully.");

    clearAssetForm();

    loadAssets();
}


// =========================================================
// Clear Form
// =========================================================

function clearAssetForm() {

    document.getElementById("assetName").value = "";

    document.getElementById("assetType").value = "";

    document.getElementById("assetDepartment").value = "";

    document.getElementById("assetEmployee").value = "";

    document.getElementById("assetSerial").value = "";

    document.getElementById("assetLocation").value = "";

    document.getElementById("assetPurchaseDate").value = "";

    document.getElementById("assetStatus").value = "Active";
}


// =========================================================
// Render Assets
// =========================================================

function renderAssets(data) {

    const table =
        document.getElementById("assetsTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    style="text-align:center; padding:30px;"
                >
                    No assets found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(asset => {

        const row =
            document.createElement("tr");


        const deviceAge =
            calculateDeviceAge(
                asset.purchase_date
            );


        row.innerHTML = `

            <td>
                ${asset.asset_id || "-"}
            </td>

            <td>
                ${asset.serial_number || "-"}
            </td>

            <td>
                ${asset.name || "-"}
            </td>

            <td>
                ${asset.type || "-"}
            </td>

            <td>
                ${asset.department || "-"}
            </td>

            <td>
                ${asset.employee_name || "-"}
            </td>

            <td>
                ${asset.purchase_date || "-"}
            </td>

            <td>
                ${deviceAge}
            </td>

            <td>
                ${asset.status || "-"}
            </td>

            <td>

                <button
                    onclick="editAsset(${asset.id})"
                >
                    Edit
                </button>

                <button
                    onclick="deleteAsset(${asset.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });
}


// =========================================================
// Edit Asset
// =========================================================

function editAsset(id) {

    const asset =
        assets.find(
            item => item.id === id
        );


    if (!asset) {
        return;
    }


    const name =
        prompt(
            "Device Name:",
            asset.name || ""
        );

    if (name === null) {
        return;
    }


    const type =
        prompt(
            "Device Type:",
            asset.type || ""
        );

    if (type === null) {
        return;
    }


    const department =
        prompt(
            "Department:",
            asset.department || ""
        );

    if (department === null) {
        return;
    }


    const employee =
        prompt(
            "Employee Name:",
            asset.employee_name || ""
        );

    if (employee === null) {
        return;
    }


    const serialNumber =
        prompt(
            "Serial Number:",
            asset.serial_number || ""
        );

    if (serialNumber === null) {
        return;
    }


    const location =
        prompt(
            "Location:",
            asset.location || ""
        );

    if (location === null) {
        return;
    }


    const purchaseDate =
        prompt(
            "Purchase Date (YYYY-MM-DD):",
            asset.purchase_date || ""
        );

    if (purchaseDate === null) {
        return;
    }


    const status =
        prompt(
            "Status:",
            asset.status || "Active"
        );

    if (status === null) {
        return;
    }


    asset.name =
        name.trim();

    asset.type =
        type.trim();

    asset.department =
        department.trim();

    asset.employee_name =
        employee.trim() || null;

    asset.serial_number =
        serialNumber.trim() || null;

    asset.location =
        location.trim() || null;

    asset.purchase_date =
        purchaseDate.trim() || null;

    asset.status =
        status.trim();


    saveAssets();

    alert("Asset updated successfully.");

    loadAssets();
}


// =========================================================
// Delete Asset
// =========================================================

function deleteAsset(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this asset?"
        );


    if (!confirmed) {
        return;
    }


    // Prevent deleting an asset that has tickets
    const storedTickets =
        localStorage.getItem("smartIT_tickets");

    const tickets =
        storedTickets
            ? JSON.parse(storedTickets)
            : [];


    const hasTickets =
        tickets.some(
            ticket =>
                Number(ticket.asset_id) === Number(id)
        );


    if (hasTickets) {

        alert(
            "This asset cannot be deleted because it has service tickets."
        );

        return;
    }


    assets =
        assets.filter(
            asset =>
                Number(asset.id) !== Number(id)
        );


    saveAssets();

    alert("Asset deleted successfully.");

    loadAssets();
}


// =========================================================
// Search Assets
// =========================================================

function searchAssets() {

    const searchElement =
        document.getElementById("searchAsset");

    if (!searchElement) {
        return;
    }


    const searchValue =
        searchElement.value
            .toLowerCase()
            .trim();


    const filtered =
        assets.filter(asset =>

            (
                asset.asset_id || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.serial_number || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.name || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.type || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.department || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.employee_name || ""
            )
            .toLowerCase()
            .includes(searchValue)

            ||

            (
                asset.location || ""
            )
            .toLowerCase()
            .includes(searchValue)

        );


    renderAssets(filtered);
}


// =========================================================
// Start
// =========================================================

loadAssets();