const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

const charactersSlider = document.getElementById("characters");
const charactersValue = document.getElementById("charactersValue");

const passwordLength = document.getElementById("passwordLength");
const passwordLengthValue = document.getElementById("passwordLengthValue");

const serviceNameSlider = document.getElementById("serviceName");
const serviceNameValue = document.getElementById("serviceNameValue");

const capitalizeFirstLetter = document.getElementById("capitalizeFirstLettersCheckbox");
const useSpecialCharacters = document.getElementById("useSpecialCharactersCheckbox");

const serviceTagsDiv = document.getElementById("serviceTags");
const serviceButtons = document.querySelectorAll('.service-button');

let tags = [];
let selectedServices = [];

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

serviceButtons.forEach(button => {
  button.addEventListener("click", function () {
    const serviceName = button.dataset.service;
    button.classList.toggle("selected");

    if (selectedServices.includes(serviceName)) {
      selectedServices = selectedServices.filter(service => service !== serviceName);
    } else {
      selectedServices.push(serviceName);
    }

    updateItems(serviceTagsDiv, selectedServices);
  });
});

handleItemAddition(addBtn, inputField, tagsDiv, tags);

updateSlider(charactersSlider, charactersValue);
updateSlider(passwordLength, passwordLengthValue);
updateSlider(serviceNameSlider, serviceNameValue);

function generateBasePassword(tags, charactersValue, maxLength) {
  let basePasswordParts = [];
  let numbers = [];
  let nonNumberTags = [];

  const specialCharacterMap = {'o': '@', 'l': '!', 'g': '&', 's': '$', 'e': '€'};

  tags.forEach(tag => {
      if (!isNaN(tag)) {
          numbers.push(tag);
      } else {
          nonNumberTags.push(tag);
      }
  });

  const capitalizeFirst = capitalizeFirstLetter.checked;
  const useSpecial = useSpecialCharacters.checked;

  nonNumberTags.forEach(tag => {
      let extractedPart = tag.substring(0, charactersValue);

      if (useSpecial) {
          extractedPart = extractedPart.split('').map(char => {
              return specialCharacterMap[char.toLowerCase()] || char;
          }).join('');
      }

      if (capitalizeFirst) {
          extractedPart = extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart);
  });

  let basePassword = basePasswordParts.join('');

  if (basePassword.length > maxLength) {
    basePassword = basePassword.substring(0, maxLength);
  }

  numbers.forEach(number => {
      const randomIndex = Math.floor(Math.random() * (basePassword.length + 1));
      basePassword = basePassword.slice(0, randomIndex) + number + basePassword.slice(randomIndex);
  });

  return basePassword.substring(0, maxLength);
}

function insertServiceName(password, serviceName, serviceNameLength, totalLength) {
  const specialCharacterIndex = password.search(/[@!&$€]/);
  
  let servicePart = serviceName.substring(0, serviceNameLength);
  
  let newPassword;
  if (specialCharacterIndex !== -1) {
    newPassword = password.slice(0, specialCharacterIndex + 1) + servicePart + password.slice(specialCharacterIndex + 1);
  } else {
    newPassword = password + servicePart;
  }
  
  if (newPassword.length > totalLength) {
    return newPassword.substring(0, totalLength);
  } else {
    return newPassword.padEnd(totalLength, '*');
  }
}

function calculateStrength(password) {
  let strength = 0;

  const criteria = [
    { regex: /[a-z]/, message: "lowercase letter", score: 10 },
    { regex: /[A-Z]/, message: "uppercase letter", score: 10 },
    { regex: /\d/, message: "number", score: 10 },
    { regex: /[@$!%*?&€#?]/, message: "special character", score: 10 },
    { regex: /.{12,}/, message: "minimum 12 characters", score: 20 },
    { regex: /^(?!.*(.)\1\1)/, message: "no repeated characters", score: 10 },
    { regex: /^(?!.*[a-z]{3,}).*$/i, message: "no sequential letters", score: 10 },
    { regex: /^(?!.*[0-9]{3,}).*$/, message: "no sequential numbers", score: 10 },
    { regex: /^(?!.*(.)\1{2,}).*$/, message: "no repeating patterns", score: 10 }
  ];

  const dictionaryWords = ["password", "qwerty", "123456", "admin", "welcome"];
  const dictionaryScore = dictionaryWords.some(word => password.toLowerCase().includes(word)) ? -20 : 0;

  criteria.forEach(rule => {
    if (rule.regex.test(password)) {
      strength += rule.score;
    }
  });

  strength += dictionaryScore;

  strength = Math.max(0, Math.min(strength, 100));

  return strength;
}

function updateStrengthIndicator(password) {
  const strength = calculateStrength(password);
  const strengthMeter = document.getElementById("strengthMeter");
  const strengthText = document.getElementById("strengthText");

  strengthMeter.value = strength;

  let strengthLabel = "Weak";
  if (strength >= 80) {
    strengthLabel = "Strong";
  } else if (strength >= 60) {
    strengthLabel = "Medium";
  }

  strengthText.textContent = strengthLabel;
}

document.getElementById("generatePassword").addEventListener("click", function () {
  const totalPasswordLength = parseInt(passwordLength.value, 10);
  const serviceNameLength = parseInt(serviceNameSlider.value, 10);

  const basePassword = generateBasePassword(tags, charactersSlider.value, totalPasswordLength - serviceNameLength);

  const passwords = selectedServices.map(service => {
    return insertServiceName(basePassword, service, serviceNameLength, totalPasswordLength);
  });

  const passwordsContainer = document.getElementById("passwords");
  passwordsContainer.innerHTML = passwords.map((pwd, index) => `
    <div id="password-${index}" class="password-item">
      ${pwd} 
      <span onclick="printPassword('password-${index}')" class="print-button">
        <i class="bi bi-printer"></i>
      </span>
    </div>
  `).join('');

  if (passwords.length > 0) {
    updateStrengthIndicator(passwords[0]);
    document.querySelector(".passwordContainer").classList.remove("hidden");
  }
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
