const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

const serviceDiv = document.getElementById("serviceTags");
const serviceInputField = document.getElementById("servicesTextField");
const addServiceBtn = document.getElementById("servicesAddButton");

const charactersSlider = document.getElementById("characters");
const charactersValue = document.getElementById("charactersValue");

const passwordLength = document.getElementById("passwordLength");
const passwordLengthValue = document.getElementById("passwordLengthValue")

const serviceName = document.getElementById("serviceName");
const serviceNameValue = document.getElementById("serviceNameValue");

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
  container.innerHTML = itemList.map((item) => `<span>${item}</span>`).join("");
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

function updateSlider(slider, displayElement) {
  slider.addEventListener("input", function () {
    displayElement.textContent = slider.value;
  });
}

handleItemAddition(addBtn, inputField, tagsDiv, tags);
handleItemAddition(addServiceBtn, serviceInputField, serviceDiv, services);

updateSlider(charactersSlider, charactersValue);
updateSlider(passwordLength, passwordLengthValue);
updateSlider(serviceName, serviceNameValue);