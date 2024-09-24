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

  // Define language translations for English and Danish
  const languages = {
    en: {
      header: "Password Generator",
      inputsTextField: "Type interest or number",
      characters: "Characters Per Interest",
      passwordLength: "Password Length",
      serviceName: "Number of characters from website name",
      generatedPassword: "Generate Passwords",
      passwordsHeader: "Passwords",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      minInterestsMessage:
        "Please add at least {minInterests} interests to generate a password.",
    },
    da: {
      header: "Adgangskode Generator",
      inputsTextField: "Indtast interesse eller tal",
      characters: "Tegn pr. Interesse",
      passwordLength: "Adgangskode Længde",
      serviceName: "Antal tegn fra hjemmeside navn",
      generatedPassword: "Generer Adgangskoder",
      passwordsHeader: "Adgangskoder",
      weak: "Svag",
      medium: "Middel",
      strong: "Stærk",
      minInterestsMessage:
        "Tilføj venligst mindst {minInterests} interesser for at generere en adgangskode.",
    },
  };

  // Detect the user's browser language and set the default to English
  const userLang = navigator.language || navigator.userLanguage;
  let selectedLang = languages["en"]; // default language is English

  // Function to apply translations dynamically based on the selected language
  function applyTranslation(lang) {
    selectedLang = languages[lang] || languages["en"]; // Use English if the selected language is unavailable

    // Apply the translation to various parts of the UI
    document.getElementById("header").textContent = selectedLang.header;
    document.getElementById("inputsTextField").placeholder =
      selectedLang.inputsTextField;
    document.getElementById("charactersLabel").textContent =
      selectedLang.characters;
    document.getElementById("passwordLengthLabel").textContent =
      selectedLang.passwordLength;
    document.getElementById("serviceNameLabel").textContent =
      selectedLang.serviceName;
    document.getElementById("generatePassword").textContent =
      selectedLang.generatedPassword;
    document.getElementById("passwordsHeader").textContent =
      selectedLang.passwordsHeader;
  }

  // Input field event listener to restrict characters
  inputField.addEventListener("input", function () {
    // Allow letters (including æ, ø, å) and numbers
    inputField.value = inputField.value.replace(/[^a-zA-ZæøåÆØÅ0-9]/g, "");
  });

  // Apply translation based on the detected browser language
  if (userLang.startsWith("da")) {
    applyTranslation("da"); // Use Danish if the browser language starts with "da"
  } else {
    applyTranslation("en"); // Default to English
  }

  // Tags array to store user input
  let tags = [];
  let selectedServices = [
    "Facebook",
    "Twitter",
    "Instagram",
    "LinkedIn",
    "Google",
    "Amazon",
    "Netflix",
    "Spotify",
    "Apple",
    "Microsoft",
    "Dropbox",
    "GitHub",
    "Reddit",
    "WhatsApp",
    "Zoom",
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
      updateBasePassword(); // Update base password when a new item is added
    }
    checkMinimumInterests(); // Check if the minimum number of interests is met
  }

  // Function to update the tags container with the current list of items
  function updateItems(container, itemList) {
    container.innerHTML = itemList
      .map((item) => `<span>${item}</span>`)
      .join("");
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

    // Remove tags when clicked
    container.addEventListener("click", function (event) {
      const item = event.target;
      const index = itemList.indexOf(item.textContent);
      if (index > -1) {
        itemList.splice(index, 1); // Remove the item from the list
        updateItems(container, itemList); // Update the UI
        updateBasePassword(); // Update base password when an item is removed
      }
      checkMinimumInterests(); // Re-check if minimum interests are met
    });
  }

  // Function to update slider values in the UI when the slider changes
  function updateSlider(slider, displayElement) {
    slider.addEventListener("input", function () {
      displayElement.textContent = slider.value; // Update the display value for the slider
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

    const nonNumberTags = tags.filter((tag) => isNaN(tag)); // Filter out numbers from the tags

    // Calculate minimum number of interests required
    const minInterests = Math.ceil(
      (totalPasswordLength - serviceNameLength) / charactersPerInterest
    );

    // Display a message if the user hasn't added enough interests
    if (nonNumberTags.length < minInterests) {
      const minInterestsMessage = selectedLang.minInterestsMessage.replace(
        "{minInterests}",
        minInterests
      );
      minInterestsFeedback.textContent = minInterestsMessage;
      minInterestsFeedback.style.display = "block";
      document.getElementById("generatePassword").disabled = true; // Disable password generation
      return false;
    } else {
      minInterestsFeedback.style.display = "none";
      document.getElementById("generatePassword").disabled = false; // Enable password generation
      return true;
    }
  }

  // Function to generate a base password using the user's interests and inputs
  function generateBasePassword(tags, charactersValue, maxLength) {
    charactersValue = parseInt(charactersValue, 10);
    maxLength = parseInt(maxLength, 10);

    let basePasswordParts = [];
    let numbers = [];
    let nonNumberTags = [];

    // Map for replacing certain characters with special symbols
    const specialCharacterMap = {
      a: "@",
      b: "!",
      c: "(",
      d: "#",
      e: "€",
      f: "*",
      g: "&",
      h: "#",
      i: "!",
      j: "]",
      k: "<",
      l: "!",
      m: "^",
      n: "^",
      o: "@",
      p: "%",
      q: "&",
      r: "#",
      s: "$",
      t: "+",
      u: "_",
    };
    let specialCharacterInserted = false; // Flag to track if a special character has been inserted

    // Separate numbers and non-number tags from the user's input
    tags.forEach((tag) => {
      if (!isNaN(tag)) {
        numbers.push(tag); // Numbers
      } else {
        nonNumberTags.push(tag); // Non-number tags (interests)
      }
    });

    // Hardcoded preferences
    const capitalizeFirst = true;
    const useSpecial = true;

    // Process non-number tags for inclusion in the password
    nonNumberTags.forEach((tag, index) => {
      let extractedPart = tag.substring(0, charactersValue); // Get the first few characters

      // Replace only the first occurrence with a special character if enabled
      if (useSpecial && !specialCharacterInserted) {
        extractedPart = extractedPart
          .split("")
          .map((char) => {
            if (
              specialCharacterMap[char.toLowerCase()] &&
              !specialCharacterInserted
            ) {
              specialCharacterInserted = true; // Mark that we've inserted a special character
              return specialCharacterMap[char.toLowerCase()];
            }
            return char;
          })
          .join("");
      }

      // Capitalize the first letter if the option is selected
      if (capitalizeFirst) {
        extractedPart =
          extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart); // Add the processed tag to the password parts

      // Insert a number after each interest (if any numbers are left)
      if (index < numbers.length) {
        basePasswordParts.push(numbers[index]);
      }
    });

    let basePassword = basePasswordParts.join(""); // Join parts to form the base password

    // Ensure the base password doesn't exceed the maximum length
    if (basePassword.length > maxLength) {
      basePassword = basePassword.substring(0, maxLength);
    }

    return basePassword; // Return the final base password, capped to the max length
  }

  // Function to insert the service name into the generated password
  function insertServiceName(
    password,
    serviceName,
    serviceNameLength,
    totalLength
  ) {
    serviceNameLength = parseInt(serviceNameLength, 10);
    totalLength = parseInt(totalLength, 10);

    const specialCharacterIndex = password.search(/[!@#$%&*()_+\]<€^]/);
    let servicePart = serviceName.substring(0, serviceNameLength); // Extract part of the service name

    let newPassword;
    // Insert the service name after a special character, if one exists
    if (specialCharacterIndex !== -1) {
      newPassword =
        password.slice(0, specialCharacterIndex + 1) +
        servicePart +
        password.slice(specialCharacterIndex + 1);
    } else {
      newPassword = password + servicePart; // Otherwise, append the service name to the end
    }

    // Ensure the password is exactly the required length, by trimming extra characters if needed
    if (newPassword.length > totalLength) {
      return newPassword.substring(0, totalLength); // Trim the password if it's too long
    } else if (newPassword.length < totalLength) {
      return newPassword; // Don't pad with asterisks; just return the password as is
    }

    return newPassword; // Return the generated password
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
      {
        regex: /^(?!.*[a-z]{3,}).*$/i,
        message: "no sequential letters",
        score: 10,
      },
      {
        regex: /^(?!.*[0-9]{3,}).*$/i,
        message: "no sequential numbers",
        score: 10,
      },
      {
        regex: /^(?!.*(.)\1{2,}).*$/i,
        message: "no repeating patterns",
        score: 10,
      },
    ];

    // Dictionary of weak password words to penalize
    const dictionaryWords = [
      "password",
      "qwerty",
      "123456",
      "admin",
      "welcome",
    ];
    const dictionaryScore = dictionaryWords.some((word) =>
      password.toLowerCase().includes(word)
    )
      ? -20
      : 0;

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

  // Function to update the base password and strength indicator
  function updateBasePassword() {
    // Check if the minimum number of interests is met
    if (!checkMinimumInterests()) {
      // Hide the base password and strength indicator if minimum interests are not met
      document
        .getElementById("originalPasswordContainer")
        .classList.add("hidden");
      document.getElementById("passwordsContainer").classList.add("hidden");
      return;
    }

    const totalPasswordLength = parseInt(passwordLength.value, 10); // Password length
    const serviceNameLength = parseInt(serviceNameSlider.value, 10); // Length from service name

    // Generate a base password based on user inputs
    const basePassword = generateBasePassword(
      tags,
      charactersSlider.value,
      totalPasswordLength - serviceNameLength
    );

    // Update the base password text
    const originalPasswordDiv = document.getElementById("originalPassword");
    originalPasswordDiv.textContent = basePassword;

    // Update the strength indicator for the base password
    updateStrengthIndicator(basePassword);
  }

  // Function to generate and display passwords for each service
  function generateAndDisplayServicePasswords(basePassword) {
    const totalPasswordLength = parseInt(passwordLength.value, 10); // Password length
    const serviceNameLength = parseInt(serviceNameSlider.value, 10); // Length from service name

    // Generate passwords for each selected service
    const passwords = selectedServices.map((service) => {
      return {
        serviceName: service,
        password: insertServiceName(
          basePassword,
          service,
          serviceNameLength,
          totalPasswordLength
        ),
      };
    });

    // Display the generated passwords in the UI
    const passwordsContainer = document.getElementById("passwords");
    passwordsContainer.innerHTML = passwords
      .map((entry, index) => {
        // Find the first special character index
        const specialCharacterIndex =
          entry.password.search(/[!@#$%&*()_+\]<€^]/);

        // Extract the base password up to and including the special character
        const basePart =
          specialCharacterIndex !== -1
            ? entry.password.slice(0, specialCharacterIndex + 1)
            : entry.password.slice(0, totalPasswordLength - serviceNameLength);

        // Extract the service part of the password based on the serviceNameLength (slider value)
        const servicePart =
          specialCharacterIndex !== -1
            ? entry.password.slice(
                specialCharacterIndex + 1,
                specialCharacterIndex + 1 + serviceNameLength
              )
            : entry.password.slice(-serviceNameLength);

        // Get the remaining part of the password (if any) after the service name portion
        const remainingPassword =
          specialCharacterIndex !== -1
            ? entry.password.slice(
                specialCharacterIndex + 1 + serviceNameLength
              )
            : "";

        return `
          <div id="password-${index}" class="password-item">
            <span class="service-name">${entry.serviceName}</span> - 
            <span class="password-text">
              ${basePart}<span class="service-password">${servicePart}</span>${remainingPassword}
            </span>
            <i class="bi bi-printer-fill print-password-icon" data-index="${index}" title="Print"></i>
          </div>
        `;
      })
      .join("");

    // Add event listeners to the print icons
    const printIcons = document.querySelectorAll(".print-password-icon");
    printIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        printPassword(passwords[index]);
      });
    });

    // Show the passwords container
    document.getElementById("passwordsContainer").classList.remove("hidden");
  }

  // Function to generate and display passwords when the button is clicked
  let passwordsGenerated = false; // Flag to track if passwords have been generated

  function generateAndDisplayPasswords() {
    // First, update the base password
    updateBasePassword();

    // Check if the minimum number of interests is met
    if (!checkMinimumInterests()) {
      // Hide the base password and strength indicator if minimum interests are not met
      document
        .getElementById("originalPasswordContainer")
        .classList.add("hidden");
      document.getElementById("passwordsContainer").classList.add("hidden");

      // Add the shake animation to the error message
      minInterestsFeedback.classList.remove("shake-animation"); // Reset animation
      void minInterestsFeedback.offsetWidth; // Trigger reflow to restart the animation
      minInterestsFeedback.classList.add("shake-animation"); // Add animation class

      return;
    }

    // Set the flag to true, indicating that passwords have been generated
    passwordsGenerated = true;

    // Get the base password from the displayed text
    const basePassword =
      document.getElementById("originalPassword").textContent;

    // Generate and display service passwords
    generateAndDisplayServicePasswords(basePassword);

    // Show the base password and strength indicator
    document
      .getElementById("originalPasswordContainer")
      .classList.remove("hidden");
    // Show the passwords container
    document.getElementById("passwordsContainer").classList.remove("hidden");
  }

  // Event listener for the "Generate Password" button
  document
    .getElementById("generatePassword")
    .addEventListener("click", function () {
      generateAndDisplayPasswords();
    });

  // Function to handle updating the password when sliders change
  function handleSliderUpdates() {
    // Update the displayed slider value and base password when any of the sliders are adjusted
    charactersSlider.addEventListener("input", () => {
      charactersValue.textContent = charactersSlider.value;
      updateBasePassword(); // Update base password on slider change
    });

    passwordLength.addEventListener("input", () => {
      passwordLengthValue.textContent = passwordLength.value;
      updateBasePassword(); // Update base password on slider change
      if (passwordsGenerated) {
        generateAndDisplayPasswords(); // Update service passwords if they have been generated
      }
    });

    serviceNameSlider.addEventListener("input", () => {
      serviceNameValue.textContent = serviceNameSlider.value;
      updateBasePassword(); // Update base password on slider change
      if (passwordsGenerated) {
        generateAndDisplayPasswords(); // Update service passwords if they have been generated
      }
    });
  }

  // Initially hide the passwords container
  document.getElementById("passwordsContainer").classList.add("hidden");
  document.getElementById("originalPasswordContainer").classList.add("hidden");

  // Call this function after setting up the sliders
  handleSliderUpdates();

  // Implement the printPassword function
  function printPassword(entry) {
    // Open a new window
    const printWindow = window.open("", "", "height=600,width=800");

    // Define the HTML structure for the print window
    printWindow.document.write("<html><head><title>Print Password</title>");
    // Include styles for printing
    printWindow.document.write("<style>");
    printWindow.document.write(
      "body { font-family: Arial, sans-serif; padding: 20px; }"
    );
    printWindow.document.write(
      ".password-item { margin-bottom: 10px; font-size: 1.2em; }"
    );
    printWindow.document.write(".service-name { font-weight: bold; }");
    printWindow.document.write(
      ".password-text { display: inline-block; margin-left: 5px; }"
    );
    printWindow.document.write(
      ".service-password { color: #66cc00; font-weight: bold; }"
    );
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(
      "<h1>Password for " + entry.serviceName + "</h1>"
    );

    // Construct the password HTML
    const passwordHTML = `
      <div class="password-item">
        <span class="service-name">${entry.serviceName}</span> - 
        <span class="password-text">${entry.password}</span>
      </div>
    `;

    printWindow.document.write(passwordHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
});
