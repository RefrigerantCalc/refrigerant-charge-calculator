* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #f4f6f8;
    color: #222;
}

.container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

header h1 {
    margin-bottom: 5px;
}

header p {
    color: #666;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-button {
    padding: 12px 22px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #ddd;
    font-weight: bold;
}

.tab-button.active {
    background: #333;
    color: white;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.card {
    background: white;
    padding: 22px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card h2 {
    margin-top: 0;
    margin-bottom: 20px;
}

.card h3 {
    margin-top: 0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field.full {
    grid-column: 1 / -1;
}

label {
    font-weight: bold;
    margin-bottom: 7px;
}

input,
select,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
}

textarea {
    resize: vertical;
}

.unit-input {
    display: flex;
    gap: 8px;
}

.unit-input input {
    flex: 1;
}

.unit-input select {
    width: 90px;
}

.conversion-display {
    padding: 12px;
    background: #f1f5f9;
    border-radius: 6px;
    font-weight: bold;
}

.button-row {
    display: flex;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
}

button {
    font-size: 15px;
}

.primary,
.secondary,
.danger {
    padding: 11px 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.primary {
    background: #333;
    color: white;
}

.secondary {
    background: #ddd;
    color: #222;
}

.danger {
    background: #b42318;
    color: white;
}

.primary:hover,
.secondary:hover,
.danger:hover,
.tab-button:hover {
    opacity: 0.85;
}

.model-search {
    position: relative;
    margin-bottom: 20px;
}

.model-results {
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    z-index: 20;
    max-height: 250px;
    overflow-y: auto;
}

.model-result {
    padding: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.model-result:hover {
    background: #f1f1f1;
}

.results {
    border: 2px solid #333;
}

.result-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 25px;
}

.result-box {
    padding: 15px;
    background: #f5f6f7;
    border-radius: 8px;
}

.result-box span {
    display: block;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.result-box strong {
    font-size: 18px;
}

.result-box.total {
    grid-column: span 2;
    background: #e9eef3;
}

.calculation-box {
    margin-top: 20px;
    padding: 20px;
    background: #f8fafc;
    border: 1px solid #d5dbe1;
    border-radius: 8px;
}

.calculation-breakdown {
    font-family: "Courier New", monospace;
    white-space: pre-wrap;
    line-height: 1.7;
    font-size: 16px;
}

.cheers-box {
    margin-top: 20px;
    padding: 20px;
    background: #f7f7f7;
    border-radius: 8px;
}

.cheers-box pre {
    white-space: pre-wrap;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
}

.database-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.database-search {
    margin-bottom: 20px;
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

th {
    background: #f1f3f5;
}

.database-tools {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    z-index: 100;
}

.modal-content {
    background: white;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 25px;
    border-radius: 10px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close {
    border: none;
    background: transparent;
    font-size: 30px;
    cursor: pointer;
}

footer {
    text-align: center;
    color: #777;
    font-size: 13px;
    padding: 20px;
}

@media (max-width: 800px) {

    .grid {
        grid-template-columns: 1fr;
    }

    .field.full {
        grid-column: auto;
    }

    .result-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .database-header {
        flex-direction: column;
        align-items: flex-start;
    }
}

@media (max-width: 500px) {

    .container {
        padding: 10px;
    }

    .result-grid {
        grid-template-columns: 1fr;
    }

    .result-box.total {
        grid-column: span 1;
    }

    .unit-input {
        flex-direction: column;
    }

    .unit-input select {
        width: 100%;
    }
}
