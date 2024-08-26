// Interest and number textfield
const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

// Services textfield
const serviceDiv = document.getElementById("serviceTags");
const serviceInputField = document.getElementById("servicesTextField");
const addServiceBtn = document.getElementById("servicesAddButton");

// slider for choosing amount of characters per interest
const charactersSlider = document.getElementById("characters");
const charactersValue = document.getElementById("charactersValue");

// Slider for choosing password length
const passwordLength = document.getElementById("passwordLength");
const passwordLengthValue = document.getElementById("passwordLengthValue");

// Slider for choosing service name
const serviceName = document.getElementById("serviceName");
const serviceNameValue = document.getElementById("serviceNameValue");

const capitalizeFirstLetter = document.getElementById("capitalizeFirstLettersCheckbox");
const useSpecialCharacters = document.getElementById("useSpecialCharactersCheckbox");

document.getElementById("darkModeSwitch").addEventListener("change", function () {
    if (this.checked) {
      lightMode();
    } else {
      darkMode();
    }
  });

function lightMode() {
  document.body.style.backgroundColor = "#ffffff";
  document.querySelector(".container").style.color = "#3b3b3b";
  document.querySelector("#inputsTextField").classList.add("light-mode");
  document.querySelector("#servicesTextField").classList.add("light-mode");
  document.querySelector("#passwords").style.backgroundColor = "#ccc";
}

function darkMode() {
  document.body.style.backgroundColor = "#3b3b3b";
  document.querySelector(".container").style.color = "#ffffff";
  document.querySelector("#inputsTextField").classList.remove("light-mode");
  document.querySelector("#servicesTextField").classList.remove("light-mode");
  document.querySelector("#passwords").style.backgroundColor = "#2c2c2c";
}

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

function generatePassword(tags, charactersValue, totalPasswordLength) {
  let basePasswordParts = [];
  let numbers = [];
  let nonNumberTags = [];

  const specialCharacterMap = {'o': '@', 'a': '@', 'l': '!', 'g': '&', 's': '$', 'e': '€'};

  // Separate numbers and non-number tags
  tags.forEach(tag => {
      if (!isNaN(tag)) {
          numbers.push(tag);
      } else {
          nonNumberTags.push(tag);
      }
  });

  // Check if the user checked the capitalize first letter checkbox
  const capitalizeFirst = capitalizeFirstLetter.checked;

  // Check if the user checked the use special characters checkbox
  const useSpecial = useSpecialCharacters.checked;

  // Generate the base part of the password from non-number tags
  nonNumberTags.forEach(tag => {
      let extractedPart = tag.substring(0, charactersValue);

      if(useSpecial) {
        extractedPart = extractedPart.split('').map(char => {
          return specialCharacterMap[char.toLowerCase()] || char;
        }).join('');
      }

      // Capitalize the first letter of every string in the tags array
      // if the user checked the box
      if(capitalizeFirst) {
        extractedPart = extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart);
  });

  // Combine the parts to create the base password
  let basePassword = basePasswordParts.join('');

  // Now add the numbers to the base password (inserted between parts)
  let passwordWithNumbers = '';
  basePasswordParts.forEach((part, index) => {
      passwordWithNumbers += part;
      if (index < basePasswordParts.length - 1 && numbers.length > 0) {
          // Insert a random number between parts if there are any left
          const randomIndex = Math.floor(Math.random() * numbers.length);
          passwordWithNumbers += numbers[randomIndex];
          // Optionally remove the number from the array if you want to use each number only once
          numbers.splice(randomIndex, 1);
      }
  });

  // Append any remaining numbers to the end of the password
  if (numbers.length > 0) {
      passwordWithNumbers += numbers.join('');
  }

  // Generate the final passwords for each service
  let finalPasswords = [];
  services.forEach(service => {
      let serviceNamePart = service.substring(0, serviceName.value);
      let specialCharIndex = passwordWithNumbers.search(/[@!&$€]/);

      let finalPassword = '';

      if (specialCharIndex !== -1) {
          // Insert the service name after the first special character
          finalPassword = passwordWithNumbers.slice(0, specialCharIndex + 1) + serviceNamePart + passwordWithNumbers.slice(specialCharIndex + 1);
      } else {
          // If no special character is found, just append the service name at the end
          finalPassword = passwordWithNumbers + serviceNamePart;
      }

      // If the final password is longer than the desired length, trim it
      if (finalPassword.length > totalPasswordLength) {
          finalPassword = finalPassword.substring(0, totalPasswordLength);
      }

      // If the final password is shorter than the desired length, add more numbers or padding
      while (finalPassword.length < totalPasswordLength) {
          finalPassword += numbers.length > 0 ? numbers[Math.floor(Math.random() * numbers.length)] : 'x';
      }

      finalPasswords.push(finalPassword);
  });

  return finalPasswords;
}

document.getElementById("generatePassword").addEventListener("click", function () {
  const totalPasswordLength = parseInt(passwordLength.value, 10);
  const passwords = generatePassword(tags, charactersSlider.value, totalPasswordLength);
  
  // Display the generated passwords in the passwords container
  const passwordsContainer = document.getElementById("passwords");
  passwordsContainer.innerHTML = passwords.map((pwd, index) => `
    <div id="password-${index}" class="password-item">
      ${pwd} 
      <button onclick="printPassword('password-${index}')" class="print-button">
        <i class="bi bi-printer"></i>
      </button>
    </div>
  `).join('');
});

function printPassword(passwordId) {
  const passwordElement = document.getElementById(passwordId).innerText;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          .password {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your Password</h2>
          <div class="password">${passwordElement}</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
