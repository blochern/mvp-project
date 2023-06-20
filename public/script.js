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

const displayDefault = () => {
    fetch("/vehicles").then((response) => response.json()).then((data) => {
        for (let elem of data) {
            createEntry(elem);
        }
    });
}

displayDefault();

document.querySelector('#create-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let requestObject = {
        name: document.querySelector('#v-name').value,
        tech_level: parseInt(document.querySelector('#v-tech-level').value),
        weapon_type: document.querySelector('#v-weapon-type').value,
        cost: parseInt(document.querySelector('#v-cost').value),
        faction: document.querySelector('#v-faction').value,
        stealth: document.querySelector('#v-stealth').checked
    };
    fetch("/vehicles", {
        method: "POST",
        body: JSON.stringify(requestObject),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json()).then((data) => {
        createEntry(data);
        document.querySelector('#v-name').value = "";
        document.querySelector('#v-tech-level').value = 1;
        document.querySelector('#v-weapon-type').value = "";
        document.querySelector('#v-cost').value = 300;
        document.querySelector('#v-faction').value = "";
        document.querySelector('#v-stealth').checked = false;
    });
});

document.querySelector('#search-function').addEventListener('submit', (event) => {
    event.preventDefault();

    // remove the previous back button (if it exists)
    if (document.querySelector('#back-button')) {
        document.querySelector('#back-button').remove();
    }

    // create a back button
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    document.querySelector('#search-function').parentElement.appendChild(backButton);
    backButton.addEventListener('click', (event) => {
        console.log(tableBody.children);
        for (let i = 0; i < tableBody.children.length; i++) {
            tableBody.children[i].remove();
        }
        backButton.remove();
        displayDefault();
    });

    // clear the table
    console.log(tableBody.children);
    for (let i = 0; i < tableBody.children.length; i++) {
        tableBody.children[i].remove();
    }

    // try to display the found vehicle
    try {
        let searchString = "/vehicle_search/" + document.querySelector('#search').value;
        console.log(searchString);
        fetch(searchString).then((response) => response.json()).then((data) => { 
                console.log(data);
         })
    }
    catch (error) { console.error(error.message); }
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

    let p = document.createElement('p');
    p.textContent = "Tech Level: ";
    const eTechLevel = document.createElement('input');
    eTechLevel.type = 'number';
    eTechLevel.id = 'e-tech-level';
    eTechLevel.required = 'required';
    eTechLevel.value = parseInt(entry.children[2].textContent);
    p.appendChild(eTechLevel);
    editForm.appendChild(p);

    const eWeaponType = document.createElement('input');
    eWeaponType.type = 'text';
    eWeaponType.id = 'e-weapon-type';
    eWeaponType.placeholder = 'Weapon Type...';
    eWeaponType.required = 'required';
    eWeaponType.value = entry.children[3].textContent;
    editForm.appendChild(eWeaponType);

    p = document.createElement('p');
    p.textContent = "Cost: ";
    const eCost = document.createElement('input');
    eCost.type = 'number';
    eCost.id = 'e-cost';
    eCost.required = 'required';
    eCost.value = parseInt(entry.children[4].textContent);
    p.appendChild(eCost);
    editForm.appendChild(p);

    const eFaction = document.createElement('input');
    eFaction.type = 'text';
    eFaction.id = 'e-faction';
    eFaction.placeholder = 'Faction...';
    eFaction.required = 'required';
    eFaction.value = entry.children[5].textContent;
    editForm.appendChild(eFaction);

    p = document.createElement('p');
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
        const requestBody = {
            name: document.querySelector('#e-name').value,
            tech_level: parseInt(document.querySelector('#e-tech-level').value),
            weapon_type: document.querySelector('#e-weapon-type').value,
            cost: parseInt(document.querySelector('#e-cost').value),
            faction: document.querySelector('#e-faction').value,
            stealth: document.querySelector('#e-stealth').checked
        };
        console.log(requestBody);
        console.log(`/vehicles/${id}`);
        fetch(`/vehicles/${id}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { 
            fillEntry(entry, data);
            document.querySelector('#edit-tr').remove();
         })
    });
}