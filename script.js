// Interest and number textfield
const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

// Services textfield
const serviceDiv = document.getElementById("serviceTags");
const serviceInputField = document.getElementById("servicesTextField");
const addServiceBtn = document.getElementById("servicesAddButton");

// slider for choosing characters
const charactersSlider = document.getElementById("characters");
const charactersValue = document.getElementById("charactersValue");

// Slider for choosing password length
const passwordLength = document.getElementById("passwordLength");
const passwordLengthValue = document.getElementById("passwordLengthValue");

// Slider for choosing service name
const serviceName = document.getElementById("serviceName");
const serviceNameValue = document.getElementById("serviceNameValue");

document
  .getElementById("darkModeSwitch")
  .addEventListener("change", function () {
    if (this.checked) {
      document.body.style.backgroundColor = "#ffffff";
      document.querySelector(".container").style.color = "#3b3b3b";
      document.querySelector("#inputsTextField").classList.add("light-mode");
      document.querySelector("#servicesTextField").classList.add("light-mode");
    } else {
      document.body.style.backgroundColor = "#3b3b3b";
      document.querySelector(".container").style.color = "#ffffff";
      document.querySelector("#inputsTextField").classList.remove("light-mode");
      document.querySelector("#servicesTextField").classList.remove("light-mode");
    }
  });

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
