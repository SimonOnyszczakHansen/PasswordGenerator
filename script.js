document.addEventListener('DOMContentLoaded', function() {
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

  const translations = {
    en: {
      header: "Password Generator",
      interestPlaceholder: "Type interest or number",
      charactersPerInterest: "Characters Per Interest",
      passwordLength: "Password Length",
      charactersFromServiceName: "Number of characters from service name",
      useSpecialCharacters: "Use Special Characters",
      capitalizeFirstLetters: "Capitalize First Letter",
      generatePasswords: "Generate Passwords",
      passwords: "Passwords"
    },
    da: {
      header: "Adgangskodegenerator",
      interestPlaceholder: "Indtast interesse eller tal",
      charactersPerInterest: "Tegn pr. interesse",
      passwordLength: "Adgangskodelængde",
      charactersFromServiceName: "Antal tegn fra tjenestens navn",
      useSpecialCharacters: "Brug specialtegn",
      capitalizeFirstLetters: "Kapitaliser første bogstav",
      generatePasswords: "Generér adgangskoder",
      passwords: "Adgangskoder"
    }
  };

  const userLang = navigator.language || navigator.userLanguage;

  function applyTranslations(lang) {
    const selectedLang = translations[lang] || translations['en'];

    // Updating the text contents of the elements based on the selected language
    document.getElementById('header').textContent = selectedLang.header;
    document.getElementById('inputsTextField').placeholder = selectedLang.interestPlaceholder;
    document.getElementById('characters').textContent = selectedLang.charactersPerInterest;
    document.getElementById('passwordLength').textContent = selectedLang.passwordLength;
    document.getElementById('serviceName').textContent = selectedLang.charactersFromServiceName;
    document.getElementById('useSpecialCharacters').textContent = selectedLang.useSpecialCharacters;
    document.getElementById('capitalizeFirstLetters').textContent = selectedLang.capitalizeFirstLetters;
    document.getElementById('generatePassword').textContent = selectedLang.generatePasswords;
    document.getElementById('passwordsHeader').textContent = selectedLang.passwords;
  }

  // Apply the language translations based on user's browser language
  if (userLang.startsWith('da')) {
    applyTranslations('da');  // Apply Danish if the language starts with 'da'
  } else {
    applyTranslations('en');  // Default to English
  }

let tags = [];
let selectedServices = [
    "Facebook", "Twitter", "Instagram", "LinkedIn", "Google", "Amazon", "Netflix", 
    "Spotify", "Apple", "Microsoft", "Dropbox", "GitHub", "Reddit", "WhatsApp", "Zoom"
]; // Predefined services

// Minimum interests feedback element
const minInterestsFeedback = document.createElement('div');
minInterestsFeedback.style.color = 'red';
minInterestsFeedback.style.display = 'none';
document.querySelector(".inputsContainer").appendChild(minInterestsFeedback);

function addItem(inputField, container, itemList) {
  const value = inputField.value.trim();

  if (value) {
    itemList.push(value);
    updateItems(container, itemList);
    inputField.value = "";
  }
  checkMinimumInterests();
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
    checkMinimumInterests(); 
  });
}

function updateSlider(slider, displayElement) {
  slider.addEventListener("input", function () {
    displayElement.textContent = slider.value;
    checkMinimumInterests();
  });
}

handleItemAddition(addBtn, inputField, tagsDiv, tags);

updateSlider(charactersSlider, charactersValue);
updateSlider(passwordLength, passwordLengthValue);
updateSlider(serviceNameSlider, serviceNameValue);

function checkMinimumInterests() {
  const totalPasswordLength = parseInt(passwordLength.value, 10);
  const serviceNameLength = parseInt(serviceNameSlider.value, 10);
  const charactersPerInterest = parseInt(charactersSlider.value, 10);

  const nonNumberTags = tags.filter(tag => isNaN(tag));

  const minInterests = Math.ceil((totalPasswordLength - serviceNameLength) / charactersPerInterest);

  if (nonNumberTags.length < minInterests) {
    minInterestsFeedback.textContent = `Please add at least ${minInterests} non-numeric interests to generate a password.`;
    minInterestsFeedback.style.display = 'block';
    document.getElementById("generatePassword").disabled = true;
  } else {
    minInterestsFeedback.style.display = 'none';
    document.getElementById("generatePassword").disabled = false;
  }
}

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
    return { 
      serviceName: service, 
      password: insertServiceName(basePassword, service, serviceNameLength, totalPasswordLength) 
    };
  });

  const passwordsContainer = document.getElementById("passwords");
  passwordsContainer.innerHTML = passwords.map((entry, index) => `
    <div id="password-${index}" class="password-item">
      <span class="service-name">${entry.serviceName} - </span> 
      <span class="password-text">${entry.password}</span> 
      <span onclick="printPassword('password-${index}')" class="print-button">
        <i class="bi bi-printer"></i>
      </span>
    </div>
  `).join('');

  if (passwords.length > 0) {
    updateStrengthIndicator(passwords[0].password);
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
})