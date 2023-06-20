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
            editButton.addEventListener('click', editEntry);
        }
        if (i === 8) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            td.appendChild(deleteButton);
            deleteButton.addEventListener('click', deleteEntry);
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

const deleteEntry = (event) => {
    const entry = event.target.parentElement.parentElement;
    const id = entry.children[0].textContent;
    fetch(`/vehicles/${id}`, {
        method: "DELETE"
    }).then((response) => response.json()).then((data) => { console.log(data); })
    entry.remove();
}

const editEntry = (event) => {
    if (document.querySelector('#edit-tr')) {
        const toRemove = document.querySelector('#edit-tr');
        toRemove.remove();
    }

    const entry = event.target.parentElement.parentElement;
    const id = entry.children[0].textContent;
    const editForm = document.createElement('form');
    editForm.action = '';
    editForm.id = 'edit-form';
    
    const eName = document.createElement('input');
    eName.type = 'text';
    eName.id = 'e-name';
    eName.placeholder = 'Name...';
    eName.required = 'required';
    eName.value = entry.children[1].textContent;
    editForm.appendChild(eName);

    const eTechLevel = document.createElement('input');
    eTechLevel.type = 'number';
    eTechLevel.id = 'e-tech-level';
    eTechLevel.required = 'required';
    eTechLevel.value = parseInt(entry.children[2].textContent);
    editForm.appendChild(eTechLevel);

    const eWeaponType = document.createElement('input');
    eWeaponType.type = 'text';
    eWeaponType.id = 'e-weapon-type';
    eWeaponType.placeholder = 'Weapon Type...';
    eWeaponType.required = 'required';
    eWeaponType.value = entry.children[3].textContent;
    editForm.appendChild(eTechLevel);

    const eCost = document.createElement('input');
    eCost.type = 'number';
    eCost.id = 'e-cost';
    eCost.required = 'required';
    eCost.value = parseInt(entry.children[4].textContent);
    editForm.appendChild(eCost);

    const eFaction = document.createElement('input');
    eFaction.type = 'text';
    eFaction.id = 'e-faction';
    eFaction.placeholder = 'Faction...';
    eFaction.required = 'required';
    eFaction.value = entry.children[5].textContent;
    editForm.appendChild(eFaction);

    const p = document.createElement('p');
    p.textContent = "Stealth: ";
    const eStealth = document.createElement('input');
    eStealth.type = 'checkbox';
    eStealth.id = 'e-stealth';
    eStealth.checked = entry.children[6].textContent === 'true';
    p.appendChild(eStealth);
    editForm.appendChild(p);

    const eSubmit = document.createElement('button');
    eSubmit.type = 'submit';
    eSubmit.textContent = 'Submit';
    editForm.appendChild(eSubmit);

    const td = document.createElement('td');
    td.colSpan = 9;
    td.appendChild(editForm);

    const tr = document.createElement('tr');
    tr.id = 'edit-tr';
    tr.appendChild(td);
    tableBody.insertBefore(tr, entry);

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        fetch(`/vehicles/${id}`, {
            method: "UPDATE",
            body: JSON.stringify({
                name: document.querySelector('#e-name').value,
                tech_level: document.querySelector('#e-tech-level').value,
                weapon_type: document.querySelector('#e-weapon-type').value,
                cost: document.querySelector('#e-cost').value,
                faction: document.querySelector('#e-faction').value,
                stealth: document.querySelector('#e-stealth').checked
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { console.log(data); })
    })
}