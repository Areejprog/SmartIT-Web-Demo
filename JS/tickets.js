// =========================================================
// Smart IT Web Demo - Tickets
// LocalStorage Version
// =========================================================

const TICKETS_STORAGE_KEY = "smartIT_tickets";
const ASSETS_STORAGE_KEY = "smartIT_assets";

let tickets = [];
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
            "Error loading assets:",
            error
        );

        assets = [];
    }

    populateAssetSelect();
    populateEditAssetSelect();
}


// =========================================================
// Save Tickets
// =========================================================

function saveTickets() {

    localStorage.setItem(
        TICKETS_STORAGE_KEY,
        JSON.stringify(tickets)
    );
}


// =========================================================
// Load Tickets
// =========================================================

function loadTickets() {

    try {

        const storedTickets =
            localStorage.getItem(TICKETS_STORAGE_KEY);

        tickets =
            storedTickets
                ? JSON.parse(storedTickets)
                : [];

    } catch (error) {

        console.error(
            "Error loading tickets:",
            error
        );

        tickets = [];
    }

    renderTickets(tickets);

    updateTicketCount(tickets.length);
}


// =========================================================
// Generate Ticket ID
// =========================================================

function generateTicketId() {

    let maxNumber = 0;

    tickets.forEach(ticket => {

        const match =
            String(ticket.ticket_id || "")
                .match(/^TCK-(\d+)$/);

        if (match) {

            const number =
                parseInt(match[1], 10);

            if (number > maxNumber) {
                maxNumber = number;
            }
        }

    });


    return (
        "TCK-" +
        String(maxNumber + 1).padStart(4, "0")
    );
}


// =========================================================
// Generate Internal Ticket ID
// =========================================================

function generateInternalId() {

    if (!tickets.length) {
        return 1;
    }

    return Math.max(
        ...tickets.map(
            ticket => Number(ticket.id) || 0
        )
    ) + 1;
}


// =========================================================
// Populate Create Ticket Device Select
// =========================================================

function populateAssetSelect() {

    const select =
        document.getElementById("ticketAsset");

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Choose a device
        </option>
    `;


    assets.forEach(asset => {

        const option =
            document.createElement("option");

        option.value =
            asset.id;

        option.textContent =
            `${asset.asset_id} - ${asset.name}`;

        select.appendChild(option);

    });
}


// =========================================================
// Populate Edit Ticket Device Select
// =========================================================

function populateEditAssetSelect() {

    const select =
        document.getElementById(
            "editTicketAsset"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select Device
        </option>
    `;


    assets.forEach(asset => {

        const option =
            document.createElement("option");

        option.value =
            asset.id;

        option.textContent =
            `${asset.asset_id} - ${asset.name}`;

        select.appendChild(option);

    });
}


// =========================================================
// Find Asset
// =========================================================

function getAssetById(id) {

    return assets.find(
        asset =>
            Number(asset.id) === Number(id)
    );
}


// =========================================================
// Calculate Device Age
// =========================================================

function calculateDeviceAge(purchaseDate) {

    if (!purchaseDate) {
        return "-";
    }

    const purchase =
        new Date(purchaseDate);

    const today =
        new Date();

    if (isNaN(purchase.getTime())) {
        return "-";
    }

    let years =
        today.getFullYear()
        -
        purchase.getFullYear();

    const monthDifference =
        today.getMonth()
        -
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
                today.getFullYear()
                -
                purchase.getFullYear()
            ) * 12
            +
            today.getMonth()
            -
            purchase.getMonth();

        if (
            today.getDate()
            <
            purchase.getDate()
        ) {

            months--;
        }


        if (months <= 0) {
            return "Less than 1 year";
        }


        return `${months} month${
            months > 1 ? "s" : ""
        }`;
    }


    return `${years} year${
        years > 1 ? "s" : ""
    }`;
}


// =========================================================
// Device Selected
// =========================================================

const ticketAssetSelect =
    document.getElementById("ticketAsset");


if (ticketAssetSelect) {

    ticketAssetSelect.addEventListener(
        "change",
        showSelectedDevice
    );
}


function showSelectedDevice() {

    const select =
        document.getElementById(
            "ticketAsset"
        );


    if (!select) {
        return;
    }


    const assetId =
        Number(select.value);


    const asset =
        getAssetById(assetId);


    if (!asset) {

        setElementText(
            "infoDeviceName",
            "-"
        );

        setElementText(
            "infoDeviceType",
            "-"
        );

        setElementText(
            "infoEmployee",
            "-"
        );

        setElementText(
            "infoDepartment",
            "-"
        );

        setElementText(
            "infoSerial",
            "-"
        );

        setElementText(
            "infoAge",
            "-"
        );

        return;
    }


    setElementText(
        "infoDeviceName",
        asset.name || "-"
    );


    setElementText(
        "infoDeviceType",
        asset.type || "-"
    );


    setElementText(
        "infoEmployee",
        asset.employee_name || "-"
    );


    setElementText(
        "infoDepartment",
        asset.department || "-"
    );


    setElementText(
        "infoSerial",
        asset.serial_number || "-"
    );


    setElementText(
        "infoAge",
        calculateDeviceAge(
            asset.purchase_date
        )
    );
}


// =========================================================
// Safe Text Helper
// =========================================================

function setElementText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// =========================================================
// Add Ticket
// =========================================================

function addTicket() {

    const assetId =
        document.getElementById(
            "ticketAsset"
        ).value;


    const service =
        document.getElementById(
            "ticketService"
        ).value;


    const priority =
        document.getElementById(
            "ticketPriority"
        ).value;


    const status =
        document.getElementById(
            "ticketStatus"
        ).value;


    const ticketDate =
        document.getElementById(
            "ticketDate"
        ).value;


    const description =
        document.getElementById(
            "ticketDescription"
        ).value.trim();


    if (!assetId) {

        alert(
            "Please select a device."
        );

        return;
    }


    if (!service) {

        alert(
            "Please select the required service."
        );

        return;
    }


    if (!ticketDate) {

        alert(
            "Please select the ticket date."
        );

        return;
    }


    const ticketIdInput =
        document.getElementById(
            "ticketId"
        );


    const ticketId =
        ticketIdInput.value.trim()
        ||
        generateTicketId();


    // Prevent duplicate Ticket IDs

    const duplicate =
        tickets.some(
            ticket =>
                ticket.ticket_id === ticketId
        );


    if (duplicate) {

        alert(
            "This ticket ID already exists."
        );

        return;
    }


    const ticketData = {

        id:
            generateInternalId(),

        ticket_id:
            ticketId,

        service_type:
            service,

        title:
            service,

        description:
            description || null,

        priority,

        status,

        ticket_date:
            ticketDate,

        asset_id:
            Number(assetId)

    };


    tickets.push(ticketData);

    saveTickets();

    alert(
        "Service ticket created successfully."
    );


    clearTicketForm();

    loadTickets();
}


// =========================================================
// Clear Ticket Form
// =========================================================

function clearTicketForm() {

    const ticketId =
        document.getElementById(
            "ticketId"
        );

    if (ticketId) {
        ticketId.value = "";
    }


    const ticketAsset =
        document.getElementById(
            "ticketAsset"
        );

    if (ticketAsset) {
        ticketAsset.value = "";
    }


    const ticketService =
        document.getElementById(
            "ticketService"
        );

    if (ticketService) {
        ticketService.value = "";
    }


    const ticketPriority =
        document.getElementById(
            "ticketPriority"
        );

    if (ticketPriority) {
        ticketPriority.value = "Medium";
    }


    const ticketStatus =
        document.getElementById(
            "ticketStatus"
        );

    if (ticketStatus) {
        ticketStatus.value = "Open";
    }


    const ticketDate =
        document.getElementById(
            "ticketDate"
        );

    if (ticketDate) {
        ticketDate.value = "";
    }


    const ticketDescription =
        document.getElementById(
            "ticketDescription"
        );

    if (ticketDescription) {
        ticketDescription.value = "";
    }


    showSelectedDevice();
}


// =========================================================
// Render Tickets
// =========================================================

function renderTickets(data) {

    const table =
        document.getElementById(
            "ticketsTable"
        );


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
                    No service tickets found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(ticket => {

        const row =
            document.createElement("tr");


        const asset =
            getAssetById(
                ticket.asset_id
            );


        const deviceName =
            asset?.name || "-";


        const deviceType =
            asset?.type || "-";


        const employee =
            asset?.employee_name || "-";


        const department =
            asset?.department || "-";


        row.innerHTML = `

            <td>
                ${ticket.ticket_id || "-"}
            </td>

            <td>
                ${deviceName}
            </td>

            <td>
                ${deviceType}
            </td>

            <td>
                ${employee}
            </td>

            <td>
                ${department}
            </td>

            <td>
                ${
                    ticket.service_type ||
                    ticket.title ||
                    "-"
                }
            </td>

            <td>
                ${ticket.ticket_date || "-"}
            </td>

            <td>
                ${ticket.priority || "-"}
            </td>

            <td>
                ${ticket.status || "-"}
            </td>

            <td class="ticket-actions-cell">

                <div class="ticket-action-buttons">

                    <button
                        type="button"
                        class="ticket-action-btn edit-btn"
                        onclick="editTicket(${ticket.id})"
                        title="Edit Ticket"
                        aria-label="Edit Ticket"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="ticket-action-btn delete-btn"
                        onclick="deleteTicket(${ticket.id})"
                        title="Delete Ticket"
                        aria-label="Delete Ticket"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });
}


// =========================================================
// Update Ticket Count
// =========================================================

function updateTicketCount(count) {

    const counter =
        document.getElementById(
            "ticketCount"
        );


    if (!counter) {
        return;
    }


    counter.textContent =
        `${count} service ticket${
            count === 1 ? "" : "s"
        }`;
}


// =========================================================
// Search Tickets
// =========================================================

function searchTickets() {

    const searchElement =
        document.getElementById(
            "searchTicket"
        );


    if (!searchElement) {
        return;
    }


    const searchValue =
        searchElement.value
            .toLowerCase()
            .trim();


    const filtered =
        tickets.filter(ticket => {

            const asset =
                getAssetById(
                    ticket.asset_id
                );


            return (

                (
                    ticket.ticket_id ||
                    ""
                )
                .toLowerCase()
                .includes(searchValue)

                ||

                (
                    ticket.service_type ||
                    ticket.title ||
                    ""
                )
                .toLowerCase()
                .includes(searchValue)

                ||

                (
                    asset?.name ||
                    ""
                )
                .toLowerCase()
                .includes(searchValue)

                ||

                (
                    asset?.employee_name ||
                    ""
                )
                .toLowerCase()
                .includes(searchValue)

                ||

                (
                    asset?.department ||
                    ""
                )
                .toLowerCase()
                .includes(searchValue)

            );

        });


    renderTickets(filtered);

    updateTicketCount(
        filtered.length
    );
}


// =========================================================
// Open Edit Ticket
// =========================================================

function editTicket(id) {

    const ticket =
        tickets.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!ticket) {

        alert(
            "Ticket not found."
        );

        return;
    }


    setElementValue(
        "editTicketId",
        ticket.id
    );


    setElementValue(
        "editTicketNumber",
        ticket.ticket_id
    );


    setElementValue(
        "editTicketAsset",
        ticket.asset_id || ""
    );


    setElementValue(
        "editTicketService",
        ticket.service_type ||
        ticket.title ||
        ""
    );


    setElementValue(
        "editTicketPriority",
        ticket.priority ||
        "Medium"
    );


    setElementValue(
        "editTicketStatus",
        ticket.status ||
        "Open"
    );


    setElementValue(
        "editTicketDate",
        ticket.ticket_date ||
        ""
    );


    setElementValue(
        "editTicketDescription",
        ticket.description ||
        ""
    );


    const modal =
        document.getElementById(
            "editTicketModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );
    }
}


// =========================================================
// Set Input Value
// =========================================================

function setElementValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value = value;
    }
}


// =========================================================
// Close Edit Ticket
// =========================================================

function closeEditTicket() {

    const modal =
        document.getElementById(
            "editTicketModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


// =========================================================
// Save Edited Ticket
// =========================================================

function saveEditedTicket() {

    const id =
        Number(
            document.getElementById(
                "editTicketId"
            ).value
        );


    const ticket =
        tickets.find(
            item =>
                Number(item.id) === id
        );


    if (!ticket) {

        alert(
            "Ticket not found."
        );

        return;
    }


    const assetId =
        document.getElementById(
            "editTicketAsset"
        ).value;


    const service =
        document.getElementById(
            "editTicketService"
        ).value;


    const priority =
        document.getElementById(
            "editTicketPriority"
        ).value;


    const status =
        document.getElementById(
            "editTicketStatus"
        ).value;


    const ticketDate =
        document.getElementById(
            "editTicketDate"
        ).value;


    const description =
        document.getElementById(
            "editTicketDescription"
        ).value.trim();


    if (!assetId) {

        alert(
            "Please select a device."
        );

        return;
    }


    if (!service) {

        alert(
            "Please select a service."
        );

        return;
    }


    if (!ticketDate) {

        alert(
            "Please select the ticket date."
        );

        return;
    }


    ticket.asset_id =
        Number(assetId);

    ticket.service_type =
        service;

    ticket.title =
        service;

    ticket.description =
        description || null;

    ticket.priority =
        priority;

    ticket.status =
        status;

    ticket.ticket_date =
        ticketDate;


    saveTickets();

    alert(
        "Ticket updated successfully."
    );


    closeEditTicket();

    loadTickets();
}


// =========================================================
// Delete Ticket
// =========================================================

function deleteTicket(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this ticket?"
        );


    if (!confirmed) {
        return;
    }


    tickets =
        tickets.filter(
            ticket =>
                Number(ticket.id) !== Number(id)
        );


    saveTickets();

    alert(
        "Ticket deleted successfully."
    );


    loadTickets();
}


// =========================================================
// Initialize
// =========================================================

function initializeTicketsPage() {

    loadAssets();

    loadTickets();

}


initializeTicketsPage();