
const header = document.getElementById("HEADER");
const entriesArray = document.getElementsByClassName("entry");
const tableBody = document.getElementById("table").children[0];

// puts the data (fetched from the backend) into td's (that have been created in createEntry)
const fillEntry = (entry, object) => {
    const items = entry.children;
    const values = Object.values(object);
    for (let i = 0; i < items.length; i++) {
        if (values[i] !== undefined) {
            items[i].textContent = values[i];
        }
    }
}

// creates an entry on the table (fills data with 'object' by default, if given)
const createEntry = (object) => {
    // creating the table row
    const tr = document.createElement('tr');
    // creating 9 td's
    for (let i = 0; i < 9; i++) {
        const td = document.createElement('td');
        tr.appendChild(td);
        if (i === 0) {
            td.classList = "first";
        }
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
    tr.children[0].classList.add("id");
    tr.children[2].classList += "integer";
    tr.children[4].classList += "integer";
    tr.children[8].classList += "last";
    fillEntry(tr, object);
    tableBody.appendChild(tr);
}

// deletes an entry (pretty simple)
const deleteEntry = (event) => {
    const entry = event.target.parentElement.parentElement;
    const id = entry.children[0].textContent;
    fetch(`/vehicles/${id}`, {
        method: "DELETE"
    }).then((response) => response.json()).then((data) => { console.log(data); })
    entry.remove();
}

// edit an entry (very long!)
const editEntry = (event) => {
    const entry = event.target.parentElement.parentElement;
    const id = entry.children[0].textContent;
    const editForm = document.createElement('form');
    editForm.action = '';
    editForm.id = 'edit-form';

    let td = document.createElement('td');
    const eName = document.createElement('input');
    eName.type = 'text';
    eName.id = 'e-name';
    eName.placeholder = 'Name...';
    eName.required = 'required';
    eName.value = entry.children[1].textContent;
    td.appendChild(eName);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[1]);

    td = document.createElement('td');
    const eTechLevel = document.createElement('input');
    eTechLevel.type = 'number';
    eTechLevel.id = 'e-tech-level';
    eTechLevel.required = 'required';
    eTechLevel.value = parseInt(entry.children[2].textContent);
    td.appendChild(eTechLevel);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[2]);

    td = document.createElement('td');
    const eWeaponType = document.createElement('input');
    eWeaponType.type = 'text';
    eWeaponType.id = 'e-weapon-type';
    eWeaponType.placeholder = 'Weapon Type...';
    eWeaponType.required = 'required';
    eWeaponType.value = entry.children[3].textContent;
    td.appendChild(eWeaponType);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[3]);

    td = document.createElement('td');
    const eCost = document.createElement('input');
    eCost.type = 'number';
    eCost.id = 'e-cost';
    eCost.required = 'required';
    eCost.value = parseInt(entry.children[4].textContent);
    td.appendChild(eCost);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[4]);

    td = document.createElement('td');
    const eFaction = document.createElement('input');
    eFaction.type = 'text';
    eFaction.id = 'e-faction';
    eFaction.placeholder = 'Faction...';
    eFaction.required = 'required';
    eFaction.value = entry.children[5].textContent;
    td.appendChild(eFaction);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[5]);

    td = document.createElement('td');
    const eStealth = document.createElement('input');
    eStealth.type = 'checkbox';
    eStealth.id = 'e-stealth';
    eStealth.checked = entry.children[6].textContent === 'true';
    td.appendChild(eStealth);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[6]);

    td = document.createElement('td');
    const eSubmit = document.createElement('button');
    eSubmit.type = 'submit';
    eSubmit.textContent = 'Submit';
    td.appendChild(eSubmit);
    editForm.appendChild(td);
    entry.replaceChild(td, entry.children[7]);

    eSubmit.addEventListener('click', (event) => {
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
            const array = Object.values(data);
            for (let i = 1; i < 8; i++) {
                const td = document.createElement('td');
                if (i === 2 || i === 4) {
                    td.classList += "integer";
                }
                if (i === 7) {
                    const editButton = document.createElement('button');
                    editButton.textContent = "Edit";
                    td.appendChild(editButton);
                    editButton.addEventListener('click', editEntry);
                } else {
                    td.textContent = array[i];
                }
                entry.replaceChild(td, entry.children[i]);
            }
        })
    });
}

// event listener for submitting the "create" form
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

// event listener for searching for an entry by name
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
    document.querySelector('#search-function').appendChild(backButton);
    backButton.addEventListener('click', (event) => {
        // the back button clears the table, and...
        let i = tableBody.children.length - 1;
        while (i > 0) {
            tableBody.children[i].remove();
            i--;
        }
        // disappears after it's selected, and...
        backButton.remove();
        // goes back to display the default table
        displayDefault();
    });

    // clear the table
    let i = tableBody.children.length - 1;
    while (i > 0) {
        tableBody.children[i].remove();
        i--;
    }
    const searchString = "/vehicle_search/" + document.querySelector('#search').value;
    fetch(searchString).then((response) => response.json()).then((data) => {
        for (let elem of data) {
            createEntry(elem);
        }
    })
});

// function that displays "default" information (GET all)
const displayDefault = () => {
    fetch("/vehicles").then((response) => response.json()).then((data) => {
        for (let elem of data) {
            createEntry(elem);
        }
    });
}

// top of the call stack -- display default info
displayDefault();
