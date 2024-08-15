const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

const serviceDiv = document.getElementById("serviceTags");
const serviceInputField = document.getElementById("servicesTextField");
const addServiceBtn = document.getElementById("servicesAddButton");

let tags = [];
let services = [];

function addItem(inputField, container, itemList) {
    const value = inputField.value.trim();
    if (value) {
        itemList.push(value);
        updateItems(container, itemList);
        inputField.value = "";
    }
}

function updateItems(container, itemList) {
    container.innerHTML = itemList.map(item => `<span>${item}</span>`).join("");
}

function handleItemAddition(addButton, inputField, container, itemList) {
    addButton.addEventListener("click", function () {
        addItem(inputField, container, itemList);
    });

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addItem(inputField, container, itemList);
        }
    });

    container.addEventListener("click", function (event) {
        const item = event.target;
        const index = itemList.indexOf(item.textContent);
        if (index > -1) {
            itemList.splice(index, 1);
            updateItems(container, itemList);
        }
    });
}

// Initialize the functions for both tags and services
handleItemAddition(addBtn, inputField, tagsDiv, tags);
handleItemAddition(addServiceBtn, serviceInputField, serviceDiv, services);
