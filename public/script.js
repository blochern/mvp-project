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
    // creating the table row
    const tr = document.createElement('tr');
    // creating 9 td's
    for (let i = 0; i < 9; i++) {
        const td = document.createElement('td');
        tr.appendChild(td);
        if (i === 7) {
            const editButton = document.createElement('button');
            editButton.textContent = "Edit";
            td.appendChild(editButton);
        }
        if (i === 8) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            td.appendChild(deleteButton);
        }
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

const createForm = document.querySelector('#create-form');

createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let requestObject = {
        name: "",
        tech_level: 0,
        weapon_type: "",
        cost: 0,
        faction: "",
        stealth: false
    };
    for (let elem of createForm) {
        switch (elem.id) {
            case "v-name": {
                requestObject.name = elem.value;
                console.log(requestObject.name);
                break;
            }
            case "v-tech-level": {
                requestObject.tech_level = elem.value;
                console.log(requestObject.tech_level);
                break;
            }
            case "v-weapon_type": {
                requestObject.weapon_type = elem.value;
                console.log(requestObject.weapon_type);
                break;
            }
            case "v-cost": {
                requestObject.cost = elem.value;
                console.log(requestObject.cost);
                break;
            }
            case "v-faction": {
                requestObject.faction = elem.value;
                console.log(requestObject.faction);
                break;
            }
            case "v-stealth": {
                requestObject.stealth = elem.checked;
                console.log(requestObject.stealth);
                break;
            }
        }
    }
    console.log(requestObject);
    fetch("/vehicles", {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json()).then((data) => {
        createEntry(data);
    });
});