/* =========================================================
   REFRIGERANT CHARGE CALCULATOR
   ========================================================= */


/* =========================================================
   DATABASE
   ========================================================= */

let equipmentDatabase =
    JSON.parse(localStorage.getItem("equipmentDatabase")) || [

    {
        id: Date.now(),
        manufacturer: "Example",
        model: "EXAMPLE-001",
        equipmentType: "Heat Pump",
        refrigerant: "R-454B",

        standardLength: 25,

        factoryCharge: 7.32,
        factoryChargeUnit: "lb",

        liquidDiameter: '3/8"',
        gasDiameter: '5/8"',

        chargeRate: 0.70,

        notes: "Example data only. Verify manufacturer documentation."
    }

];


/* =========================================================
   SAVE DATABASE
   ========================================================= */

function saveDatabase() {

    localStorage.setItem(
        "equipmentDatabase",
        JSON.stringify(equipmentDatabase)
    );

}


/* =========================================================
   TAB CONTROL
   ========================================================= */

function showTab(tabName) {

    document.querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.remove("active");

        });


    document.querySelectorAll(".tab-button")
        .forEach(button => {

            button.classList.remove("active");

        });


    document.getElementById(tabName)
        .classList.add("active");


    const buttons =
        document.querySelectorAll(".tab-button");


    buttons.forEach(button => {

        if (
            button.textContent
                .toLowerCase()
                .includes(
                    tabName === "calculator"
                        ? "calculator"
                        : "database"
                )
        ) {

            button.classList.add("active");

        }

    });


    if (tabName === "database") {

        renderDatabase();

    }

}


/* =========================================================
   LB / OZ CONVERSION
   ========================================================= */

function lbToOz(lb) {

    return Number(lb || 0) * 16;

}


function ozToLbOz(oz) {

    oz = Number(oz || 0);

    const lb =
        Math.floor(oz / 16);

    const remainingOz =
        oz - (lb * 16);


    return {
        lb: lb,
        oz: remainingOz
    };

}


function formatLbOz(totalOz) {

    const converted =
        ozToLbOz(totalOz);


    return (
        converted.lb +
        " lb " +
        converted.oz.toFixed(2) +
        " oz"
    );

}


/* =========================================================
   FACTORY CHARGE CONVERSION
   ========================================================= */

function convertFactoryCharge() {

    const value =
        Number(
            document.getElementById(
                "factoryChargeValue"
            ).value
        );


    const unit =
        document.getElementById(
            "factoryChargeUnit"
        ).value;


    if (!value) {

        document.getElementById(
            "factoryConversion"
        ).textContent =
            "Enter factory charge above.";

        return;

    }


    let totalOz;


    if (unit === "lb") {

        totalOz =
            lbToOz(value);

    } else {

        totalOz =
            value;

    }


    document.getElementById(
        "factoryConversion"
    ).textContent =

        "Converted: " +
        formatLbOz(totalOz) +
        " | Total: " +
        totalOz.toFixed(2) +
        " oz";

}


/* =========================================================
   CROSS PAIR CONTROL
   ========================================================= */

function toggleCrossPair() {

    const enabled =
        document.getElementById(
            "crossPairUsed"
        ).value === "yes";


    document.getElementById(
        "crossPairCharge"
    ).disabled = !enabled;


    document.getElementById(
        "crossPairUnit"
    ).disabled = !enabled;


    if (!enabled) {

        document.getElementById(
            "crossPairCharge"
        ).value = 0;

    }

}


/* =========================================================
   CALCULATE FACTORY CHARGE
   ========================================================= */

function getFactoryChargeOz() {

    const value =
        Number(
            document.getElementById(
                "factoryChargeValue"
            ).value
        );


    const unit =
        document.getElementById(
            "factoryChargeUnit"
        ).value;


    if (!value) {

        return 0;

    }


    if (unit === "lb") {

        return lbToOz(value);

    }


    return value;

}


/* =========================================================
   CALCULATE ADDITIONAL LINE LENGTH
   ========================================================= */

function calculateAdditionalLineLength(
    installedLength,
    standardLength
) {

    const additional =
        Number(installedLength) -
        Number(standardLength);


    return Math.max(
        0,
        additional
    );

}


/* =========================================================
   CALCULATE
   ========================================================= */

function calculate() {

    const standardLength =
        Number(
            document.getElementById(
                "standardLength"
            ).value
        );


    const installedLength =
        Number(
            document.getElementById(
                "installedLength"
            ).value
        );


    const chargeRate =
        Number(
            document.getElementById(
                "chargeRate"
            ).value
        );


    if (
        !standardLength ||
        !installedLength
    ) {

        alert(
            "Please enter the pre-charge length and installed line length."
        );

        return;

    }


    const additionalLineLength =
        calculateAdditionalLineLength(
            installedLength,
            standardLength
        );


    const lineChargeOz =
        additionalLineLength *
        chargeRate;


    /* =====================================================
       CROSS PAIR CHARGE
       ===================================================== */

    const crossPairUsed =
        document.getElementById(
            "crossPairUsed"
        ).value === "yes";


    let crossPairOz = 0;


    if (crossPairUsed) {

        const crossPairValue =
            Number(
                document.getElementById(
                    "crossPairCharge"
                ).value
            );


        const crossPairUnit =
            document.getElementById(
                "crossPairUnit"
            ).value;


        if (crossPairUnit === "lb") {

            crossPairOz =
                lbToOz(
                    crossPairValue
                );

        } else {

            crossPairOz =
                crossPairValue;

        }

    }


    /* =====================================================
       OTHER CHARGE
       ===================================================== */

    const otherValue =
        Number(
            document.getElementById(
                "otherCharge"
            ).value
        );


    const otherUnit =
        document.getElementById(
            "otherChargeUnit"
        ).value;


    let otherOz = 0;


    if (otherUnit === "lb") {

        otherOz =
            lbToOz(otherValue);

    } else {

        otherOz =
            otherValue;

    }


    /* =====================================================
       TOTAL ADDITIONAL
       ===================================================== */

    const totalAdditionalOz =
        lineChargeOz +
        crossPairOz +
        otherOz;


    /* =====================================================
       FACTORY CHARGE
       ===================================================== */

    const factoryChargeOz =
        getFactoryChargeOz();


    /* =====================================================
       TOTAL SYSTEM CHARGE
       ===================================================== */

    const totalSystemOz =
        factoryChargeOz +
        totalAdditionalOz;


    /* =====================================================
       DISPLAY RESULTS
       ===================================================== */

    document.getElementById(
        "additionalLineLength"
    ).value =
        additionalLineLength.toFixed(2);


    document.getElementById(
        "results"
    ).style.display =
        "block";


    document.getElementById(
        "resultFactory"
    ).textContent =
        formatLbOz(factoryChargeOz);


    document.getElementById(
        "resultStandard"
    ).textContent =
        standardLength.toFixed(2) +
        " ft";


    document.getElementById(
        "resultInstalled"
    ).textContent =
        installedLength.toFixed(2) +
        " ft";


    document.getElementById(
        "resultAdditionalLine"
    ).textContent =
        additionalLineLength.toFixed(2) +
        " ft";


    document.getElementById(
        "resultRate"
    ).textContent =
        chargeRate.toFixed(2) +
        " oz/ft";


    document.getElementById(
        "resultAdditional"
    ).textContent =
        formatLbOz(
            lineChargeOz
        );


    document.getElementById(
        "resultSpecial"
    ).textContent =
        formatLbOz(
            crossPairOz +
            otherOz
        );


    document.getElementById(
        "resultTotal"
    ).textContent =
        formatLbOz(
            totalSystemOz
        );


    /* =====================================================
       CALCULATION BREAKDOWN
       ===================================================== */

    let breakdown = "";


    breakdown +=
        "ADDITIONAL REFRIGERANT LINE CALCULATION\n\n";


    breakdown +=
        "Installed Line Length\n" +
        installedLength.toFixed(2) +
        " ft\n\n";


    breakdown +=
        "− Pre-Charge / Standard Line Length\n" +
        standardLength.toFixed(2) +
        " ft\n\n";


    breakdown +=
        "────────────────────────────\n";


    breakdown +=
        "Additional Line Length\n" +
        additionalLineLength.toFixed(2) +
        " ft\n\n";


    breakdown +=
        "Additional Refrigerant Calculation\n\n";


    breakdown +=
        additionalLineLength.toFixed(2) +
        " ft × " +
        chargeRate.toFixed(2) +
        " oz/ft\n";


    breakdown +=
        "= " +
        lineChargeOz.toFixed(2) +
        " oz\n";


    breakdown +=
        "= " +
        formatLbOz(lineChargeOz) +
        "\n\n";


    /* =====================================================
       SPECIAL CHARGES
       ===================================================== */

    if (crossPairUsed) {

        breakdown +=
            "CROSS-PAIR ADDITIONAL CHARGE\n\n";


        breakdown +=
            "+ " +
            crossPairOz.toFixed(2) +
            " oz\n";


        breakdown +=
            "= " +
            formatLbOz(
                crossPairOz
            ) +
            "\n\n";

    }


    if (otherOz > 0) {

        breakdown +=
            "OTHER ADDITIONAL CHARGE\n\n";


        breakdown +=
            "+ " +
            otherOz.toFixed(2) +
            " oz\n";


        breakdown +=
            "= " +
            formatLbOz(
                otherOz
            ) +
            "\n\n";

    }


    breakdown +=
        "TOTAL ADDITIONAL REFRIGERANT\n\n";


    breakdown +=
        totalAdditionalOz.toFixed(2) +
        " oz\n";


    breakdown +=
        "= " +
        formatLbOz(
            totalAdditionalOz
        ) +
        "\n\n";


    breakdown +=
        "FACTORY CHARGE\n";


    breakdown +=
        formatLbOz(
            factoryChargeOz
        ) +
        "\n\n";


    breakdown +=
        "+ TOTAL ADDITIONAL REFRIGERANT\n";


    breakdown +=
        formatLbOz(
            totalAdditionalOz
        ) +
        "\n\n";


    breakdown +=
        "════════════════════════════\n";


    breakdown +=
        "TOTAL SYSTEM REFRIGERANT\n";


    breakdown +=
        formatLbOz(
            totalSystemOz
        );


    document.getElementById(
        "calculationBreakdown"
    ).textContent =
        breakdown;


    /* =====================================================
       CHEERS SUMMARY
       ===================================================== */

    generateCheersSummary();

}


/* =========================================================
   CHEERS SUMMARY
   ========================================================= */

function generateCheersSummary() {

    const manufacturer =
        document.getElementById(
            "manufacturer"
        ).value;


    const model =
        document.getElementById(
            "modelNumber"
        ).value;


    const serial =
        document.getElementById(
            "serialNumber"
        ).value;


    const equipmentType =
        document.getElementById(
            "equipmentType"
        ).value;


    const refrigerant =
        document.getElementById(
            "refrigerant"
        ).value;


    const standardLength =
        document.getElementById(
            "standardLength"
        ).value;


    const installedLength =
        document.getElementById(
            "installedLength"
        ).value;


    const additionalLength =
        document.getElementById(
            "additionalLineLength"
        ).value;


    const chargeRate =
        document.getElementById(
            "chargeRate"
        ).value;


    const liquidDiameter =
        document.getElementById(
            "installedLiquidDiameter"
        ).value ||
        document.getElementById(
            "liquidLineDiameter"
        ).value;


    const gasDiameter =
        document.getElementById(
            "installedGasDiameter"
        ).value ||
        document.getElementById(
            "gasLineDiameter"
        ).value;


    const specialRequirement =
        document.getElementById(
            "specialRequirement"
        ).value;


    const factoryChargeOz =
        getFactoryChargeOz();


    const crossPairUsed =
        document.getElementById(
            "crossPairUsed"
        ).value === "yes";


    const crossPairValue =
        Number(
            document.getElementById(
                "crossPairCharge"
            ).value
        );


    const crossPairUnit =
        document.getElementById(
            "crossPairUnit"
        ).value;


    let crossPairOz = 0;


    if (crossPairUsed) {

        crossPairOz =
            crossPairUnit === "lb"
                ? lbToOz(crossPairValue)
                : crossPairValue;

    }


    const otherValue =
        Number(
            document.getElementById(
                "otherCharge"
            ).value
        );


    const otherUnit =
        document.getElementById(
            "otherChargeUnit"
        ).value;


    const otherOz =
        otherUnit === "lb"
            ? lbToOz(otherValue)
            : otherValue;


    const lineChargeOz =
        Number(additionalLength) *
        Number(chargeRate);


    const totalAdditionalOz =
        lineChargeOz +
        crossPairOz +
        otherOz;


    const totalSystemOz =
        factoryChargeOz +
        totalAdditionalOz;


    let text = "";


    text +=
        "CHEERS REFRIGERANT INFORMATION\n\n";


    text +=
        "Manufacturer: " +
        manufacturer +
        "\n";


    text +=
        "Model: " +
        model +
        "\n";


    if (serial) {

        text +=
            "Serial Number: " +
            serial +
            "\n";

    }


    text +=
        "Equipment Type: " +
        equipmentType +
        "\n";


    text +=
        "Refrigerant: " +
        refrigerant +
        "\n\n";


    text +=
        "MANUFACTURER STANDARD INFORMATION\n\n";


    text +=
        "Pre-Charge / Standard Line Length: " +
        standardLength +
        " ft\n";


    text +=
        "Factory Refrigerant Charge: " +
        formatLbOz(
            factoryChargeOz
        ) +
        "\n";


    text +=
        "Liquid Line Diameter: " +
        liquidDiameter +
        "\n";


    text +=
        "Gas / Suction Line Diameter: " +
        gasDiameter +
        "\n\n";


    text +=
        "INSTALLATION INFORMATION\n\n";


    text +=
        "Installed Line Length: " +
        installedLength +
        " ft\n";


    text +=
        "Additional Line Length: " +
        additionalLength +
        " ft\n";


    text +=
        "Additional Refrigerant Required: " +
        chargeRate +
        " oz/ft\n";


    text +=
        "Additional Refrigerant Charge: " +
        formatLbOz(
            lineChargeOz
        ) +
        "\n\n";


    if (crossPairUsed) {

        text +=
            "Cross-Pair Used: YES\n";


        text +=
            "Cross-Pair Additional Charge: " +
            formatLbOz(
                crossPairOz
            ) +
            "\n\n";

    } else {

        text +=
            "Cross-Pair Used: NO\n\n";

    }


    if (otherOz > 0) {

        text +=
            "Other Additional Charge: " +
            formatLbOz(
                otherOz
            ) +
            "\n\n";

    }


    text +=
        "TOTAL ADDITIONAL REFRIGERANT: " +
        formatLbOz(
            totalAdditionalOz
        ) +
        "\n";


    text +=
        "TOTAL SYSTEM REFRIGERANT: " +
        formatLbOz(
            totalSystemOz
        ) +
        "\n\n";


    if (specialRequirement) {

        text +=
            "MANUFACTURER-SPECIFIC REQUIREMENT:\n";


        text +=
            specialRequirement +
            "\n";

    }


    document.getElementById(
        "cheersSummary"
    ).textContent =
        text;

}


/* =========================================================
   COPY CHEERS
   ========================================================= */

function copyCheers() {

    const text =
        document.getElementById(
            "cheersSummary"
        ).textContent;


    navigator.clipboard.writeText(text)
        .then(() => {

            alert(
                "CHEERS information copied."
            );

        });

}


/* =========================================================
   COPY CALCULATION
   ========================================================= */

function copyCalculation() {

    const text =
        document.getElementById(
            "calculationBreakdown"
        ).textContent;


    navigator.clipboard.writeText(text)
        .then(() => {

            alert(
                "Calculation copied."
            );

        });

}


/* =========================================================
   MODEL SEARCH
   ========================================================= */

function searchModels() {

    const search =
        document.getElementById(
            "modelSearch"
        ).value
        .toLowerCase()
        .trim();


    const results =
        document.getElementById(
            "modelResults"
        );


    results.innerHTML = "";


    if (!search) {

        return;

    }


    const matches =
        equipmentDatabase.filter(item =>

            item.manufacturer
                .toLowerCase()
                .includes(search)

            ||

            item.model
                .toLowerCase()
                .includes(search)

            ||

            item.refrigerant
                .toLowerCase()
                .includes(search)

        );


    matches.forEach(item => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "model-result";


        div.textContent =
            item.manufacturer +
            " — " +
            item.model +
            " — " +
            item.refrigerant;


        div.onclick = function() {

            loadModel(item);

        };


        results.appendChild(div);

    });

}


/* =========================================================
   LOAD MODEL
   ========================================================= */

function loadModel(item) {

    document.getElementById(
        "manufacturer"
    ).value =
        item.manufacturer;


    document.getElementById(
        "modelNumber"
    ).value =
        item.model;


    document.getElementById(
        "equipmentType"
    ).value =
        item.equipmentType;


    document.getElementById(
        "refrigerant"
    ).value =
        item.refrigerant;


    document.getElementById(
        "standardLength"
    ).value =
        item.standardLength;


    document.getElementById(
        "factoryChargeValue"
    ).value =
        item.factoryCharge;


    document.getElementById(
        "factoryChargeUnit"
    ).value =
        item.factoryChargeUnit;


    document.getElementById(
        "liquidLineDiameter"
    ).value =
        item.liquidDiameter;


    document.getElementById(
        "gasLineDiameter"
    ).value =
        item.gasDiameter;


    document.getElementById(
        "chargeRate"
    ).value =
        item.chargeRate;

   document.getElementById(
    "crossPairCharge"
).value =
    item.crossPairCharge || 0;


document.getElementById(
    "crossPairUnit"
).value =
    item.crossPairUnit || "oz";


document.getElementById(
    "specialRequirement"
).value =
    item.specialRequirement || "";

    document.getElementById(
        "manufacturerNotes"
    ).value =
        item.notes || "";


    convertFactoryCharge();


    document.getElementById(
        "modelResults"
    ).innerHTML = "";


    document.getElementById(
        "modelSearch"
    ).value =
        item.model;

}


/* =========================================================
   DATABASE RENDER
   ========================================================= */

function renderDatabase() {

    const table =
        document.getElementById(
            "databaseTable"
        );


    const search =
        document.getElementById(
            "databaseSearch"
        ).value
        .toLowerCase()
        .trim();


    table.innerHTML = "";


    const filtered =
        equipmentDatabase.filter(item =>

            item.manufacturer
                .toLowerCase()
                .includes(search)

            ||

            item.model
                .toLowerCase()
                .includes(search)

            ||

            item.refrigerant
                .toLowerCase()
                .includes(search)

        );


    filtered.forEach(item => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>${escapeHtml(item.manufacturer)}</td>

            <td>${escapeHtml(item.model)}</td>

            <td>${escapeHtml(item.refrigerant)}</td>

            <td>${item.standardLength} ft</td>

            <td>${formatLbOz(
                item.factoryChargeUnit === "lb"
                    ? lbToOz(item.factoryCharge)
                    : item.factoryCharge
            )}</td>

            <td>${escapeHtml(item.liquidDiameter)}</td>

            <td>${escapeHtml(item.gasDiameter)}</td>

            <td>${item.chargeRate} oz/ft</td>

            <td>

                <button
                    class="secondary"
                    onclick="editModel(${item.id})">

                    Edit

                </button>

                <button
                    class="danger"
                    onclick="deleteModel(${item.id})">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   OPEN ADD MODEL
   ========================================================= */

function openAddModel() {

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Equipment";


    document.getElementById(
        "editId"
    ).value = "";


    clearDatabaseForm();


    document.getElementById(
        "modelModal"
    ).style.display =
        "flex";

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    document.getElementById(
        "modelModal"
    ).style.display =
        "none";

}


/* =========================================================
   CLEAR DATABASE FORM
   ========================================================= */

function clearDatabaseForm() {

 const fields = [

    "dbManufacturer",
    "dbModel",
    "dbRefrigerant",
    "dbStandardLength",
    "dbFactoryCharge",
    "dbLiquidDiameter",
    "dbGasDiameter",
    "dbChargeRate",
    "dbCrossPairCharge",
    "dbSpecialRequirement",
    "dbNotes"

];


    fields.forEach(id => {

        document.getElementById(
            id
        ).value = "";

    });


    document.getElementById(
        "dbFactoryChargeUnit"
    ).value =
        "lb";


    document.getElementById(
        "dbEquipmentType"
    ).value =
        "Heat Pump";

}


/* =========================================================
   SAVE MODEL
   ========================================================= */

function saveModel() {

    const manufacturer =
        document.getElementById(
            "dbManufacturer"
        ).value.trim();


    const model =
        document.getElementById(
            "dbModel"
        ).value.trim();


    const refrigerant =
        document.getElementById(
            "dbRefrigerant"
        ).value.trim();


    const standardLength =
        Number(
            document.getElementById(
                "dbStandardLength"
            ).value
        );


    if (
        !manufacturer ||
        !model ||
        !refrigerant ||
        !standardLength
    ) {

        alert(
            "Please complete the required fields."
        );

        return;

    }


    const id =
        document.getElementById(
            "editId"
        ).value;


    const item = {

        id: id
            ? Number(id)
            : Date.now(),

        manufacturer:
            manufacturer,

        model:
            model,

        equipmentType:
            document.getElementById(
                "dbEquipmentType"
            ).value,

        refrigerant:
            refrigerant,

        standardLength:
            standardLength,

        factoryCharge:
            Number(
                document.getElementById(
                    "dbFactoryCharge"
                ).value
            ),

        factoryChargeUnit:
            document.getElementById(
                "dbFactoryChargeUnit"
            ).value,

        liquidDiameter:
            document.getElementById(
                "dbLiquidDiameter"
            ).value,

        gasDiameter:
            document.getElementById(
                "dbGasDiameter"
            ).value,

        chargeRate:
    Number(
        document.getElementById(
            "dbChargeRate"
        ).value
    ),

crossPairCharge:
    Number(
        document.getElementById(
            "dbCrossPairCharge"
        ).value
    ),

crossPairUnit:
    document.getElementById(
        "dbCrossPairUnit"
    ).value,

specialRequirement:
    document.getElementById(
        "dbSpecialRequirement"
    ).value,

notes:
    document.getElementById(
        "dbNotes"
    ).value
};


    if (id) {

        const index =
            equipmentDatabase.findIndex(
                x =>
                    x.id === Number(id)
            );


        equipmentDatabase[index] =
            item;

    } else {

        equipmentDatabase.push(
            item
        );

    }


    saveDatabase();

    renderDatabase();

    closeModal();


    alert(
        "Equipment saved."
    );

}


/* =========================================================
   EDIT MODEL
   ========================================================= */

function editModel(id) {

    const item =
        equipmentDatabase.find(
            x =>
                x.id === id
        );


    if (!item) {

        return;

    }


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Equipment";


    document.getElementById(
        "editId"
    ).value =
        item.id;


    document.getElementById(
        "dbManufacturer"
    ).value =
        item.manufacturer;


    document.getElementById(
        "dbModel"
    ).value =
        item.model;


    document.getElementById(
        "dbEquipmentType"
    ).value =
        item.equipmentType;


    document.getElementById(
        "dbRefrigerant"
    ).value =
        item.refrigerant;


    document.getElementById(
        "dbStandardLength"
    ).value =
        item.standardLength;


    document.getElementById(
        "dbFactoryCharge"
    ).value =
        item.factoryCharge;


    document.getElementById(
        "dbFactoryChargeUnit"
    ).value =
        item.factoryChargeUnit;


    document.getElementById(
        "dbLiquidDiameter"
    ).value =
        item.liquidDiameter;


    document.getElementById(
        "dbGasDiameter"
    ).value =
        item.gasDiameter;


    document.getElementById(
        "dbChargeRate"
    ).value =
        item.chargeRate;

   document.getElementById(
    "dbCrossPairCharge"
).value =
    item.crossPairCharge || 0;


document.getElementById(
    "dbCrossPairUnit"
).value =
    item.crossPairUnit || "oz";


document.getElementById(
    "dbSpecialRequirement"
).value =
    item.specialRequirement || "";


    document.getElementById(
        "dbNotes"
    ).value =
        item.notes || "";


    document.getElementById(
        "modelModal"
    ).style.display =
        "flex";

}


/* =========================================================
   DELETE MODEL
   ========================================================= */

function deleteModel(id) {

    if (
        !confirm(
            "Delete this equipment?"
        )
    ) {

        return;

    }


    equipmentDatabase =
        equipmentDatabase.filter(
            item =>
                item.id !== id
        );


    saveDatabase();

    renderDatabase();

}


/* =========================================================
   DELETE ALL
   ========================================================= */

function deleteAllModels() {

    if (
        !confirm(
            "Delete ALL equipment from the database?"
        )
    ) {

        return;

    }


    equipmentDatabase = [];


    saveDatabase();

    renderDatabase();

}


/* =========================================================
   EXPORT DATABASE
   ========================================================= */

function exportDatabase() {

    const data =
        JSON.stringify(
            equipmentDatabase,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    a.href =
        url;


    a.download =
        "refrigerant-equipment-database.json";


    a.click();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORT DATABASE
   ========================================================= */

function importDatabase(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const imported =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !Array.isArray(
                        imported
                    )
                ) {

                    throw new Error();

                }


                equipmentDatabase =
                    imported;


                saveDatabase();

                renderDatabase();


                alert(
                    "Database imported successfully."
                );


            } catch {

                alert(
                    "Invalid database file."
                );

            }

        };


    reader.readAsText(file);

}


/* =========================================================
   CLEAR CALCULATOR
   ========================================================= */

function clearCalculator() {

    document
        .querySelectorAll(
            "#calculator input"
        )
        .forEach(input => {

            if (
                !input.readOnly
            ) {

                input.value = "";

            }

        });


    document
        .querySelectorAll(
            "#calculator textarea"
        )
        .forEach(textarea => {

            textarea.value = "";

        });


    document.getElementById(
        "factoryChargeUnit"
    ).value =
        "lb";


    document.getElementById(
        "equipmentType"
    ).value =
        "Heat Pump";


    document.getElementById(
        "crossPairUsed"
    ).value =
        "no";


    document.getElementById(
        "crossPairCharge"
    ).value =
        0;


    document.getElementById(
        "crossPairCharge"
    ).disabled =
        true;


    document.getElementById(
        "crossPairUnit"
    ).disabled =
        true;


    document.getElementById(
        "otherCharge"
    ).value =
        0;


    document.getElementById(
        "results"
    ).style.display =
        "none";


    document.getElementById(
        "factoryConversion"
    ).textContent =
        "Enter factory charge above.";

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderDatabase();

        convertFactoryCharge();

        toggleCrossPair();

    }
);
