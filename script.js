/* =========================================================
   REFRIGERANT CHARGE CALCULATOR
   ========================================================= */


/* =========================================================
   DEFAULT EQUIPMENT DATABASE

   You can add your own models through the website.
   Data is stored in your browser using localStorage.
   ========================================================= */

const defaultEquipment = [

    {
        id: "carrier-37maraq12aa3",

        manufacturer: "Carrier",

        model: "37MARAQ12AA3",

        equipmentType: "Heat Pump",

        refrigerant: "R-454B",

        factoryLb: 2,

        factoryOz: 0,

        standardLength: 24.6,

        chargeRate: 0.16,

        notes: "Verify factory charge and line-charge rate against current manufacturer documentation."
    },


    {
        id: "example-daikin",

        manufacturer: "Daikin",

        model: "EXAMPLE-MODEL",

        equipmentType: "Heat Pump",

        refrigerant: "R-454B",

        factoryLb: 2,

        factoryOz: 0,

        standardLength: 24.6,

        chargeRate: 0.16,

        notes: "Example entry. Replace with actual manufacturer data."
    }


];



/* =========================================================
   DATABASE FUNCTIONS
   ========================================================= */


function getDatabase() {

    const saved =
        localStorage.getItem(
            "refrigerantEquipmentDatabase"
        );


    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Database could not be read:",
                error
            );

        }

    }


    localStorage.setItem(

        "refrigerantEquipmentDatabase",

        JSON.stringify(defaultEquipment)

    );


    return [...defaultEquipment];

}



function saveDatabase(database) {

    localStorage.setItem(

        "refrigerantEquipmentDatabase",

        JSON.stringify(database)

    );

}



/* =========================================================
   TAB CONTROL
   ========================================================= */


function showTab(tabName) {

    document
        .querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.remove("active");

        });


    document
        .querySelectorAll(".tab-button")
        .forEach(button => {

            button.classList.remove("active");

        });


    document
        .getElementById(tabName)
        .classList.add("active");


    const buttons =
        document.querySelectorAll(".tab-button");


    if (tabName === "calculator") {

        buttons[0].classList.add("active");

    } else {

        buttons[1].classList.add("active");

        renderDatabase();

    }

}



/* =========================================================
   MODEL SEARCH
   ========================================================= */


function searchModels() {

    const search =
        document
            .getElementById("modelSearch")
            .value
            .trim()
            .toLowerCase();


    const results =
        document.getElementById(
            "modelResults"
        );


    if (!search) {

        results.style.display = "none";

        results.innerHTML = "";

        return;

    }


    const database = getDatabase();


    const matches =
        database.filter(item => {

            return (

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

        });


    if (matches.length === 0) {

        results.innerHTML = `

            <div class="model-result">

                No matching equipment found.

            </div>

        `;

        results.style.display = "block";

        return;

    }


    results.innerHTML =
        matches
            .slice(0, 20)
            .map(item => `

                <div
                    class="model-result"
                    onclick="selectModel('${escapeAttribute(item.id)}')">

                    <strong>

                        ${escapeHTML(item.manufacturer)}
                        -
                        ${escapeHTML(item.model)}

                    </strong>

                    <small>

                        ${escapeHTML(item.equipmentType)}
                        |
                        ${escapeHTML(item.refrigerant)}
                        |
                        Factory:
                        ${formatCharge(
                            item.factoryLb,
                            item.factoryOz
                        )}

                    </small>

                </div>

            `)
            .join("");


    results.style.display = "block";

}



function selectModel(id) {

    const database = getDatabase();


    const item =
        database.find(
            equipment => equipment.id === id
        );


    if (!item) {

        return;

    }


    document.getElementById(
        "manufacturer"
    ).value = item.manufacturer;


    document.getElementById(
        "modelNumber"
    ).value = item.model;


    document.getElementById(
        "equipmentType"
    ).value = item.equipmentType;


    document.getElementById(
        "refrigerant"
    ).value = item.refrigerant;


    document.getElementById(
        "factoryLb"
    ).value = item.factoryLb;


    document.getElementById(
        "factoryOz"
    ).value = item.factoryOz;


    document.getElementById(
        "standardLength"
    ).value = item.standardLength;


    document.getElementById(
        "chargeRate"
    ).value = item.chargeRate;


    document.getElementById(
        "factoryTotalLb"
    ).value = "";


    document.getElementById(
        "modelSearch"
    ).value =
        item.manufacturer +
        " " +
        item.model;


    document.getElementById(
        "modelResults"
    ).style.display = "none";

}



/* =========================================================
   CALCULATE
   ========================================================= */


function calculate() {

    const factoryLb =
        numberValue("factoryLb");


    const factoryOz =
        numberValue("factoryOz");


    const factoryTotalInput =
        numberValue("factoryTotalLb");


    const standardLength =
        numberValue("standardLength");


    const installedLength =
        numberValue("installedLength");


    const chargeRate =
        numberValue("chargeRate");


    let factoryTotalOz;


    /*
       If total factory charge is entered,
       use that value.

       Otherwise calculate:

       lb × 16 + oz
    */

    if (
        factoryTotalInput > 0
    ) {

        factoryTotalOz =
            factoryTotalInput * 16;

    } else {

        factoryTotalOz =
            (factoryLb * 16) +
            factoryOz;

    }


    if (factoryTotalOz < 0) {

        alert(
            "Please enter a valid factory charge."
        );

        return;

    }


    if (installedLength < 0) {

        alert(
            "Installed line length cannot be negative."
        );

        return;

    }


    if (standardLength < 0) {

        alert(
            "Standard line length cannot be negative."
        );

        return;

    }


    if (chargeRate < 0) {

        alert(
            "Charge rate cannot be negative."
        );

        return;

    }



    /*
       Additional line length
    */

    const additionalLine =
        Math.max(
            0,
            installedLength -
            standardLength
        );



    /*
       Additional refrigerant

       additional line × oz/ft
    */

    const additionalChargeOz =
        additionalLine *
        chargeRate;



    /*
       Total refrigerant
    */

    const totalChargeOz =
        factoryTotalOz +
        additionalChargeOz;



    /*
       Convert to pounds + ounces
    */

    const factoryCharge =
        ozToLbOz(factoryTotalOz);


    const additionalCharge =
        ozToLbOz(additionalChargeOz);


    const totalCharge =
        ozToLbOz(totalChargeOz);



    /*
       Display results
    */

    document.getElementById(
        "resultFactory"
    ).textContent =
        formatLbOz(factoryCharge);


    document.getElementById(
        "resultStandard"
    ).textContent =
        `${formatNumber(standardLength)} ft`;


    document.getElementById(
        "resultInstalled"
    ).textContent =
        `${formatNumber(installedLength)} ft`;


    document.getElementById(
        "resultAdditionalLine"
    ).textContent =
        `${formatNumber(additionalLine)} ft`;


    document.getElementById(
        "resultRate"
    ).textContent =
        `${formatNumber(chargeRate)} oz/ft`;


    document.getElementById(
        "resultAdditional"
    ).textContent =
        formatLbOz(additionalCharge);


    document.getElementById(
        "resultTotal"
    ).textContent =
        formatLbOz(totalCharge);



    /*
       Create CHEERS summary
    */

    createCheersSummary({

        factoryTotalOz,

        additionalLine,

        additionalChargeOz,

        totalChargeOz,

        factoryCharge,

        additionalCharge,

        totalCharge,

        standardLength,

        installedLength,

        chargeRate

    });



    document.getElementById(
        "results"
    ).style.display = "block";

}



/* =========================================================
   CHEERS SUMMARY
   ========================================================= */


function createCheersSummary(data) {

    const manufacturer =
        getValue("manufacturer");


    const model =
        getValue("modelNumber");


    const serial =
        getValue("serialNumber");


    const equipmentType =
        getValue("equipmentType");


    const refrigerant =
        getValue("refrigerant");


    const summary =

`CHEERS REFRIGERANT CHARGE INFORMATION

Equipment Type: ${equipmentType}

Manufacturer: ${manufacturer}

Model Number: ${model}

Serial Number: ${serial || "N/A"}

Refrigerant: ${refrigerant}

Factory Refrigerant Charge:
${formatLbOz(data.factoryCharge)}
(${formatNumber(data.factoryTotalOz)} oz)

Standard Line Length:
${formatNumber(data.standardLength)} ft

Installed Line Length:
${formatNumber(data.installedLength)} ft

Additional Line Length:
${formatNumber(data.additionalLine)} ft

Additional Refrigerant Charge Rate:
${formatNumber(data.chargeRate)} oz/ft

Additional Refrigerant Added:
${formatLbOz(data.additionalCharge)}
(${formatNumber(data.additionalChargeOz)} oz)

Total Refrigerant Charge:
${formatLbOz(data.totalCharge)}
(${formatNumber(data.totalChargeOz)} oz)

Calculation:
Additional Line Length × Charge Rate

${formatNumber(data.additionalLine)} ft × ${formatNumber(data.chargeRate)} oz/ft
= ${formatNumber(data.additionalChargeOz)} oz

Total:
Factory Charge + Additional Refrigerant
= ${formatNumber(data.totalChargeOz)} oz

Note:
Verify factory charge, standard line length,
and additional charge rate against the
applicable manufacturer's documentation.`;


    document.getElementById(
        "cheersSummary"
    ).textContent = summary;

}



/* =========================================================
   COPY CHEERS
   ========================================================= */


async function copyCheers() {

    const text =
        document.getElementById(
            "cheersSummary"
        ).textContent;


    if (!text) {

        alert(
            "Please calculate the refrigerant charge first."
        );

        return;

    }


    await copyText(
        text
    );


    alert(
        "CHEERS information copied to clipboard."
    );

}



/* =========================================================
   COPY CALCULATION
   ========================================================= */


async function copyCalculation() {

    const manufacturer =
        getValue("manufacturer");


    const model =
        getValue("modelNumber");


    const refrigerant =
        getValue("refrigerant");


    const factory =
        document.getElementById(
            "resultFactory"
        ).textContent;


    const additionalLine =
        document.getElementById(
            "resultAdditionalLine"
        ).textContent;


    const additional =
        document.getElementById(
            "resultAdditional"
        ).textContent;


    const total =
        document.getElementById(
            "resultTotal"
        ).textContent;


    const text =

`${manufacturer} ${model}

Refrigerant: ${refrigerant}

Factory Charge: ${factory}

Additional Line Length: ${additionalLine}

Additional Refrigerant: ${additional}

Total Refrigerant Charge: ${total}`;


    await copyText(text);


    alert(
        "Calculation copied to clipboard."
    );

}



/* =========================================================
   ADD MODEL
   ========================================================= */


function openAddModel() {

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Equipment";


    document.getElementById(
        "editId"
    ).value = "";


    clearModelForm();


    document.getElementById(
        "modelModal"
    ).style.display = "flex";

}



/* =========================================================
   EDIT MODEL
   ========================================================= */


function editModel(id) {

    const database = getDatabase();


    const item =
        database.find(
            equipment => equipment.id === id
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
        "dbFactoryLb"
    ).value =
        item.factoryLb;


    document.getElementById(
        "dbFactoryOz"
    ).value =
        item.factoryOz;


    document.getElementById(
        "dbStandardLength"
    ).value =
        item.standardLength;


    document.getElementById(
        "dbChargeRate"
    ).value =
        item.chargeRate;


    document.getElementById(
        "dbNotes"
    ).value =
        item.notes || "";


    document.getElementById(
        "modelModal"
    ).style.display = "flex";

}



/* =========================================================
   SAVE MODEL
   ========================================================= */


function saveModel() {

    const manufacturer =
        getValue("dbManufacturer");


    const model =
        getValue("dbModel");


    const equipmentType =
        getValue("dbEquipmentType");


    const refrigerant =
        getValue("dbRefrigerant");


    const factoryLb =
        numberValue("dbFactoryLb");


    const factoryOz =
        numberValue("dbFactoryOz");


    const standardLength =
        numberValue("dbStandardLength");


    const chargeRate =
        numberValue("dbChargeRate");


    const notes =
        getValue("dbNotes");


    if (
        !manufacturer ||
        !model ||
        !refrigerant
    ) {

        alert(
            "Please complete all required fields."
        );

        return;

    }


    if (
        factoryLb < 0 ||
        factoryOz < 0 ||
        standardLength < 0 ||
        chargeRate < 0
    ) {

        alert(
            "Values cannot be negative."
        );

        return;

    }


    if (factoryOz >= 16) {

        alert(
            "Factory ounces should be less than 16 oz."
        );

        return;

    }


    const database = getDatabase();


    const editId =
        getValue("editId");


    if (editId) {

        const index =
            database.findIndex(
                item =>
                    item.id === editId
            );


        if (index !== -1) {

            database[index] = {

                id: editId,

                manufacturer,

                model,

                equipmentType,

                refrigerant,

                factoryLb,

                factoryOz,

                standardLength,

                chargeRate,

                notes

            };

        }

    } else {

        const newModel = {

            id:
                generateId(),

            manufacturer,

            model,

            equipmentType,

            refrigerant,

            factoryLb,

            factoryOz,

            standardLength,

            chargeRate,

            notes

        };


        database.push(
            newModel
        );

    }


    saveDatabase(database);


    closeModal();


    renderDatabase();


    alert(
        "Equipment saved successfully."
    );

}



/* =========================================================
   DELETE MODEL
   ========================================================= */


function deleteModel(id) {

    const database = getDatabase();


    const item =
        database.find(
            equipment => equipment.id === id
        );


    if (!item) {

        return;

    }


    const confirmed =
        confirm(

            `Delete ${item.manufacturer} ${item.model}?`

        );


    if (!confirmed) {

        return;

    }


    const updated =
        database.filter(
            equipment =>
                equipment.id !== id
        );


    saveDatabase(updated);


    renderDatabase();

}



/* =========================================================
   DELETE ALL
   ========================================================= */


function deleteAllModels() {

    const confirmed =
        confirm(

            "Are you sure you want to delete ALL equipment models?"

        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "refrigerantEquipmentDatabase"
    );


    saveDatabase([]);


    renderDatabase();


    alert(
        "All equipment models have been deleted."
    );

}



/* =========================================================
   RENDER DATABASE
   ========================================================= */


function renderDatabase() {

    const database = getDatabase();


    const search =
        getValue("databaseSearch")
            .toLowerCase();


    const filtered =
        database.filter(item => {

            return (

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

        });


    const table =
        document.getElementById(
            "databaseTable"
        );


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    No equipment found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        filtered
            .map(item => `

                <tr>

                    <td>
                        ${escapeHTML(item.manufacturer)}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(item.model)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(item.refrigerant)}
                    </td>

                    <td>
                        ${formatCharge(
                            item.factoryLb,
                            item.factoryOz
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.standardLength
                        )}
                        ft
                    </td>

                    <td>
                        ${formatNumber(
                            item.chargeRate
                        )}
                        oz/ft
                    </td>

                    <td>

                        <button
                            class="action-button edit"
                            onclick="editModel('${escapeAttribute(item.id)}')">

                            Edit

                        </button>


                        <button
                            class="action-button delete"
                            onclick="deleteModel('${escapeAttribute(item.id)}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `)
            .join("");

}



/* =========================================================
   EXPORT DATABASE
   ========================================================= */


function exportDatabase() {

    const database =
        getDatabase();


    const data =
        JSON.stringify(
            database,
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


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        "refrigerant-equipment-database.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


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

                    throw new Error(
                        "Invalid database format."
                    );

                }


                const confirmed =
                    confirm(

                        "Import this database and replace your current database?"

                    );


                if (!confirmed) {

                    return;

                }


                saveDatabase(
                    imported
                );


                renderDatabase();


                alert(
                    "Database imported successfully."
                );


            } catch(error) {

                alert(
                    "Could not import the database. Please check the JSON file."
                );

                console.error(
                    error
                );

            }

        };


    reader.readAsText(
        file
    );


    event.target.value = "";

}



/* =========================================================
   CLEAR CALCULATOR
   ========================================================= */


function clearCalculator() {

    const fields = [

        "modelSearch",

        "manufacturer",

        "modelNumber",

        "serialNumber",

        "refrigerant",

        "factoryLb",

        "factoryOz",

        "factoryTotalLb",

        "installedLength",

        "chargeRate"

    ];


    fields.forEach(
        id => {

            document.getElementById(
                id
            ).value = "";

        }
    );


    document.getElementById(
        "equipmentType"
    ).value =
        "Heat Pump";


    document.getElementById(
        "standardLength"
    ).value =
        "24.6";


    document.getElementById(
        "modelResults"
    ).style.display =
        "none";


    document.getElementById(
        "results"
    ).style.display =
        "none";

}



/* =========================================================
   MODAL
   ========================================================= */


function closeModal() {

    document.getElementById(
        "modelModal"
    ).style.display =
        "none";

}


function clearModelForm() {

    const fields = [

        "dbManufacturer",

        "dbModel",

        "dbRefrigerant",

        "dbFactoryLb",

        "dbFactoryOz",

        "dbStandardLength",

        "dbChargeRate",

        "dbNotes"

    ];


    fields.forEach(
        id => {

            document.getElementById(
                id
            ).value = "";

        }
    );


    document.getElementById(
        "dbEquipmentType"
    ).value =
        "Heat Pump";

}



/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */


function numberValue(id) {

    const value =
        parseFloat(
            document.getElementById(
                id
            ).value
        );


    return Number.isFinite(value)
        ? value
        : 0;

}



function getValue(id) {

    return (
        document.getElementById(id)
            ?.value
            ?.trim()
        || ""
    );

}



function ozToLbOz(totalOz) {

    const pounds =
        Math.floor(
            totalOz / 16
        );


    const ounces =
        totalOz -
        (pounds * 16);


    return {

        pounds,

        ounces

    };

}



function formatLbOz(value) {

    if (
        value.pounds === 0 &&
        value.ounces === 0
    ) {

        return "0 lb 0 oz";

    }


    if (
        value.pounds === 0
    ) {

        return (
            `${formatNumber(value.ounces)} oz`
        );

    }


    if (
        value.ounces === 0
    ) {

        return (
            `${value.pounds} lb`
        );

    }


    return (

        `${value.pounds} lb ${formatNumber(value.ounces)} oz`

    );

}



function formatCharge(
    pounds,
    ounces
) {

    return formatLbOz({

        pounds:
            Number(pounds) || 0,

        ounces:
            Number(ounces) || 0

    });

}



function formatNumber(number) {

    return Number(number)
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");

}



function generateId() {

    return (

        "equipment-" +

        Date.now() +

        "-" +

        Math.random()
            .toString(36)
            .substring(2, 9)

    );

}



function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



function escapeAttribute(value) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}



async function copyText(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

    } catch(error) {

        /*
           Fallback for browsers where
           Clipboard API is unavailable.
        */

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    }

}



/* =========================================================
   CLOSE SEARCH WHEN CLICKING OUTSIDE
   ========================================================= */


document.addEventListener(
    "click",
    function(event) {

        const searchBox =
            document.getElementById(
                "modelSearch"
            );


        const results =
            document.getElementById(
                "modelResults"
            );


        if (
            searchBox &&
            results &&
            !searchBox.contains(event.target) &&
            !results.contains(event.target)
        ) {

            results.style.display =
                "none";

        }

    }
);



/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */


document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "modelModal"
            );


        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);



/* =========================================================
   INITIALIZE
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           Make sure the database exists.
        */

        getDatabase();


        /*
           Show database if user opens
           that tab.
        */

        renderDatabase();

    }
);
