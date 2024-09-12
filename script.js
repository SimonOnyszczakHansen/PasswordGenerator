document.addEventListener("DOMContentLoaded", function () {
  // Select DOM elements for interaction
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

  // Define language translations for English and Danish
  const languages = {
    en: {
      header: "Password Generator",
      inputsTextField: "Type interest or number",
      characters: "Characters Per Interest",
      passwordLength: "Password Length",
      serviceName: "Number of characters from service name",
      useSpecialCharacters: "Use Special Characters",
      capitalizeFirstLetter: "Capitalize first letter",
      generatedPassword: "Generate Passwords",
      passwordsHeader: "Passwords",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      minInterestsMessage: "Please add at least {minInterests} interests to generate a password."
    },
    da: {
      header: "Adgangskode Generator",
      inputsTextField: "Indtast interesse eller tal",
      characters: "Tegn pr. Interesse",
      passwordLength: "Adgangskode Længde",
      serviceName: "Antal tegn fra service navn",
      useSpecialCharacters: "Brug Special Tegn",
      capitalizeFirstLetter: "Start Med Stort",
      generatedPassword: "Generer Adgangskoder",
      passwordsHeader: "Adgangskoder",
      weak: "Svag",
      medium: "Middel",
      strong: "Stærk",
      minInterestsMessage: "Tilføj venligst mindst {minInterests} interesser for at generere en adgangskode."
    }
  };

  // Detect the user's browser language and set the default to English
  const userLang = navigator.language || navigator.userLanguage;
  let selectedLang = languages['en']; // default language is English

  // Function to apply translations dynamically based on the selected language
  function applyTranslation(lang) {
    selectedLang = languages[lang] || languages["en"]; // Use English if the selected language is unavailable

    // Apply the translation to various parts of the UI
    document.getElementById("header").textContent = selectedLang.header;
    document.getElementById("inputsTextField").placeholder = selectedLang.inputsTextField;
    document.getElementById("charactersLabel").textContent = selectedLang.characters;
    document.getElementById("passwordLengthLabel").textContent = selectedLang.passwordLength;
    document.getElementById("serviceNameLabel").textContent = selectedLang.serviceName;
    document.getElementById("useSpecialCharactersLabel").textContent = selectedLang.useSpecialCharacters;
    document.getElementById("capitalizeFirstLettersLabel").textContent = selectedLang.capitalizeFirstLetter;
    document.getElementById("generatePassword").textContent = selectedLang.generatedPassword;
    document.getElementById("passwordsHeader").textContent = selectedLang.passwordsHeader;
  }

  // Apply translation based on the detected browser language
  if (userLang.startsWith("da")) {
    applyTranslation("da"); // Use Danish if the browser language starts with "da"
  } else {
    applyTranslation("en"); // Default to English
  }

  // Tags array to store user input
  let tags = [];
  let selectedServices = [
    "Facebook", "Twitter", "Instagram", "LinkedIn", "Google", "Amazon", "Netflix",
    "Spotify", "Apple", "Microsoft", "Dropbox", "GitHub", "Reddit", "WhatsApp", "Zoom"
  ]; // Predefined services to add to passwords

  // Create a feedback element for minimum interests requirement
  const minInterestsFeedback = document.createElement("div");
  minInterestsFeedback.style.color = "red";
  minInterestsFeedback.style.display = "none";
  document.querySelector(".inputsContainer").appendChild(minInterestsFeedback);

  // Function to add items (tags) entered by the user
  function addItem(inputField, container, itemList) {
    const value = inputField.value.trim();
    if (value) {
      itemList.push(value); // Add input to the item list
      updateItems(container, itemList); // Update the UI
      inputField.value = ""; // Clear input field
    }
    checkMinimumInterests(); // Check if the minimum number of interests is met
  }

  // Function to update the tags container with the current list of items
  function updateItems(container, itemList) {
    container.innerHTML = itemList.map((item) => `<span>${item}</span>`).join("");
  }

  // Function to handle adding items by clicking the "add" button or pressing Enter
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

    // Remove tags when clicked
    container.addEventListener("click", function (event) {
      const item = event.target;
      const index = itemList.indexOf(item.textContent);
      if (index > -1) {
        itemList.splice(index, 1); // Remove the item from the list
        updateItems(container, itemList); // Update the UI
      }
      checkMinimumInterests(); // Re-check if minimum interests are met
    });
  }

  // Function to update slider values in the UI when the slider changes
  function updateSlider(slider, displayElement) {
    slider.addEventListener("input", function () {
      displayElement.textContent = slider.value; // Update the display value for the slider
      checkMinimumInterests(); // Re-check if minimum interests are met
    });
  }

  // Initialize item addition and slider updates
  handleItemAddition(addBtn, inputField, tagsDiv, tags);
  updateSlider(charactersSlider, charactersValue);
  updateSlider(passwordLength, passwordLengthValue);
  updateSlider(serviceNameSlider, serviceNameValue);

  // Function to check if the user has added the minimum number of interests
  function checkMinimumInterests() {
    const totalPasswordLength = parseInt(passwordLength.value, 10); // Password length
    const serviceNameLength = parseInt(serviceNameSlider.value, 10); // Length from service name
    const charactersPerInterest = parseInt(charactersSlider.value, 10); // Characters per interest

    const nonNumberTags = tags.filter(tag => isNaN(tag)); // Filter out numbers from the tags

    // Calculate minimum number of interests required
    const minInterests = Math.ceil((totalPasswordLength - serviceNameLength) / charactersPerInterest);

    // Display a message if the user hasn't added enough interests
    if (nonNumberTags.length < minInterests) {
      const minInterestsMessage = selectedLang.minInterestsMessage.replace("{minInterests}", minInterests);
      minInterestsFeedback.textContent = minInterestsMessage;
      minInterestsFeedback.style.display = "block";
      document.getElementById("generatePassword").disabled = true; // Disable password generation
    } else {
      minInterestsFeedback.style.display = "none";
      document.getElementById("generatePassword").disabled = false; // Enable password generation
    }
  }

  // Function to generate a base password using the user's interests and inputs
  function generateBasePassword(tags, charactersValue, maxLength) {
    let basePasswordParts = [];
    let numbers = [];
    let nonNumberTags = [];

    // Map for replacing certain characters with special symbols
    const specialCharacterMap = { o: "@", l: "!", g: "&", s: "$", e: "€" };

    // Separate numbers and non-number tags from the user's input
    tags.forEach((tag) => {
      if (!isNaN(tag)) {
        numbers.push(tag); // Numbers
      } else {
        nonNumberTags.push(tag); // Non-number tags (interests)
      }
    });

    // Get user preferences for capitalizing the first letter and using special characters
    const capitalizeFirst = capitalizeFirstLetter.checked;
    const useSpecial = useSpecialCharacters.checked;

    // Process non-number tags for inclusion in the password
    nonNumberTags.forEach((tag) => {
      let extractedPart = tag.substring(0, charactersValue); // Get the first few characters

      // Replace with special characters if enabled
      if (useSpecial) {
        extractedPart = extractedPart
          .split("")
          .map((char) => {
            return specialCharacterMap[char.toLowerCase()] || char;
          })
          .join("");
      }

      // Capitalize the first letter if the option is selected
      if (capitalizeFirst) {
        extractedPart = extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart); // Add the processed tag to the password parts
    });

    let basePassword = basePasswordParts.join(""); // Join parts to form the base password

    // Ensure the base password doesn't exceed the maximum length
    if (basePassword.length > maxLength) {
      basePassword = basePassword.substring(0, maxLength);
    }

    // Insert numbers randomly into the password
    numbers.forEach((number) => {
      const randomIndex = Math.floor(Math.random() * (basePassword.length + 1));
      basePassword = basePassword.slice(0, randomIndex) + number + basePassword.slice(randomIndex);
    });

    return basePassword.substring(0, maxLength); // Return the final base password, capped to the max length
  }

  // Function to insert the service name into the generated password
  function insertServiceName(password, serviceName, serviceNameLength, totalLength) {
    const specialCharacterIndex = password.search(/[@!&$€]/); // Find the index of a special character
    let servicePart = serviceName.substring(0, serviceNameLength); // Extract part of the service name

    let newPassword;
    // Insert the service name after a special character, if one exists
    if (specialCharacterIndex !== -1) {
      newPassword = password.slice(0, specialCharacterIndex + 1) + servicePart + password.slice(specialCharacterIndex + 1);
    } else {
      newPassword = password + servicePart; // Otherwise, append the service name to the end
    }

    // Ensure the password doesn't exceed the total length
    if (newPassword.length > totalLength) {
      return newPassword.substring(0, totalLength);
    } else {
      return newPassword.padEnd(totalLength, "*"); // Pad the password if it's too short
    }
  }

  // Function to calculate the strength of the password based on various criteria
  function calculateStrength(password) {
    let strength = 0;

    // Password strength criteria
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

    // Dictionary of weak password words to penalize
    const dictionaryWords = ["password", "qwerty", "123456", "admin", "welcome"];
    const dictionaryScore = dictionaryWords.some((word) => password.toLowerCase().includes(word)) ? -20 : 0;

    // Apply each strength criterion to the password
    criteria.forEach((rule) => {
      if (rule.regex.test(password)) {
        strength += rule.score;
      }
    });

    // Subtract points for weak dictionary words
    strength += dictionaryScore;

    // Cap the strength score between 0 and 100
    strength = Math.max(0, Math.min(strength, 100));

    return strength; // Return the final strength score
  }

  // Function to update the strength meter in the UI
  function updateStrengthIndicator(password) {
    const strength = calculateStrength(password); // Calculate password strength
    const strengthMeterBar = document.querySelector(".strengthMeterBar");
    const strengthText = document.getElementById("strengthText");

    // Adjust the width of the bar based on the strength level
    let barWidth = 0;
    let strengthLabel = selectedLang.weak; // Default to weak

    if (strength >= 80) {
      barWidth = 100; // Full width for strong
      strengthLabel = selectedLang.strong;
    } else if (strength >= 60) {
      barWidth = 75; // Medium strength
      strengthLabel = selectedLang.medium;
    } else if (strength >= 30) {
      barWidth = 50; // Weak strength
      strengthLabel = selectedLang.weak;
    } else {
      barWidth = 25; // Very weak strength
    }

    // Update the width of the bar
    strengthMeterBar.style.width = `${barWidth}%`;

    // Update the text label for strength
    strengthText.textContent = strengthLabel;
  }

  // Event listener for the password generation button
  document.getElementById("generatePassword").addEventListener("click", function () {
    const totalPasswordLength = parseInt(passwordLength.value, 10); // Password length
    const serviceNameLength = parseInt(serviceNameSlider.value, 10); // Length from service name

    // Generate a base password based on user inputs
    const basePassword = generateBasePassword(tags, charactersSlider.value, totalPasswordLength - serviceNameLength);

    // Generate passwords for each selected service
    const passwords = selectedServices.map((service) => {
      return {
        serviceName: service,
        password: insertServiceName(basePassword, service, serviceNameLength, totalPasswordLength)
      };
    });

    // Display the generated passwords in the UI
    const passwordsContainer = document.getElementById("passwords");
    passwordsContainer.innerHTML = passwords
    .map(
      (entry, index) => {
        // Find the first special character index
        const specialCharacterIndex = entry.password.search(/[@!&$€]/);
  
        // Extract the base password up to and including the special character
        const basePassword = entry.password.slice(0, specialCharacterIndex + 1);
  
        // Extract the service part of the password based on the serviceNameLength (slider value)
        const servicePart = entry.password.slice(specialCharacterIndex + 1, specialCharacterIndex + 1 + serviceNameLength);
  
        // Get the remaining part of the password (if any) after the service name portion
        const remainingPassword = entry.password.slice(specialCharacterIndex + 1 + serviceNameLength);
  
        return `
          <div id="password-${index}" class="password-item">
            <span class="service-name">${entry.serviceName}</span> - 
            <span class="password-text">${basePassword}<span class="service-password">${servicePart}</span>${remainingPassword}</span>
            <span onclick="printPassword('password-${index}')" class="print-button">
              <i class="bi bi-printer"></i>
            </span>
          </div>
        `;
      }
    )
    .join("");
  
  
  
  
    // Show the password strength indicator for the first password
    if (passwords.length > 0) {
      updateStrengthIndicator(passwords[0].password);
      document.querySelector(".passwordContainer").classList.remove("hidden");
    }
  });

  // Function to print the password when the print button is clicked
  window.printPassword = function (passwordId) {
    const passwordElement = document.getElementById(passwordId).innerText;
    const printWindow = window.open("", "_blank");
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
    printWindow.print(); // Trigger the print dialog
  };
});