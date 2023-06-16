console.log("Script is all hooked up and ready to go, cap'n!");

const exampleObject = {
    id: 1,
    name: "Attack Bike",
    tech_level: 1,
    weapon_type: "Tiberium Core Missiles",
    cost: 600,
    faction: "Brotherhood of Nod (NOD)",
    stealth: false
}

const header = document.getElementById("HEADER");
const entriesArray = document.getElementsByClassName("entry");
const tableBody = document.getElementById("table").children[0];


const fillEntry = (entry, object) => {
    const items = entry.children;
    const values = Object.values(object);
    for (let i = 0; i < items.length; i++) {
        if (values[i] !== undefined) {
            items[i].textContent = values[i];
        }
    }
}

const createEntry = (object) => {
    const tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        const td = document.createElement('td');
        tr.appendChild(td);
    }
    tr.children[0].classList += "id";
    tr.children[2].classList += "integer";
    tr.children[4].classList += "integer";
    fillEntry(tr, object);
    tableBody.appendChild(tr);
}

fetch("/vehicles").then((response) => response.json()).then((data) => { 
    for (let elem of data) {
        createEntry(elem);
    }
 });