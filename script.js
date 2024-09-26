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
      specialCharacterCheckbox: "Use Special Character",
      uppercaseCheckpox: "Start With Uppercase",
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
      specialCharacterCheckbox: "Brug Special Tegn",
      uppercaseCheckpox: "Start Med Stort",
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
    document.getElementById("labelForUppercaseLetters").textContent =
      selectedLang.uppercaseCheckpox;
    document.getElementById("labelForSpecialCharacters").textContent =
      selectedLang.specialCharacterCheckbox;

    // Update Tags Used header
    const tagsSummaryHeader = document.getElementById("tagsSummaryHeader");
    if (tagsSummaryHeader) {
      tagsSummaryHeader.textContent = selectedLang.tagsUsed;
    }
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

  // Array to store used parts of each tag for highlighting
  let usedTagParts = [];
  let usedNumberParts = []; // New array to store used number parts

  // Create a feedback element for minimum interests requirement
  const minInterestsFeedback = document.createElement("div");
  minInterestsFeedback.style.color = "red";
  minInterestsFeedback.style.display = "none";
  minInterestsFeedback.id = "minInterestsFeedback";
  document.querySelector(".inputsContainer").appendChild(minInterestsFeedback);

  // Function to add items (tags) entered by the user
  function addItem(inputField, container, itemList) {
    const value = inputField.value.trim();
    if (value) {
      itemList.push(value); // Add input to the item list
      updateItems(container, itemList); // Update the UI
      inputField.value = ""; // Clear input field
      updateBasePassword(); // Update base password when a new item is added
      updateTagsSummary(); // Update the tags summary
    }
    checkMinimumInterests(); // Check if the minimum number of interests is met
  }

  // Function to update the tags container with the current list of items
  function updateItems(container, itemList) {
    container.innerHTML = itemList
      .map((item) => `<span>${escapeHTML(item)}</span>`)
      .join("");
  }

  // Function to handle addition and removal of items (tags)
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
        updateTagsSummary(); // Update the tags summary
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

    // Reset usedTagParts and usedNumberParts for fresh generation
    usedTagParts = [];
    usedNumberParts = []; // Reset usedNumberParts

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

    let currentLength = 0;

    // Process non-number tags for inclusion in the password
    for (let i = 0; i < nonNumberTags.length; i++) {
      const tag = nonNumberTags[i];
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
      if (capitalizeFirst && extractedPart.length > 0) {
        extractedPart =
          extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      // Determine how much of extractedPart can be added before reaching maxLength
      let remainingLength = maxLength - currentLength;

      if (remainingLength <= 0) {
        break; // No more characters can be added
      }

      let partToAdd = extractedPart;

      if (extractedPart.length > remainingLength) {
        partToAdd = extractedPart.substring(0, remainingLength);
      }

      basePasswordParts.push(partToAdd);
      usedTagParts.push(partToAdd);
      currentLength += partToAdd.length;

      // Insert a number after each interest (if any numbers are left)
      if (i < numbers.length) {
        const number = numbers[i];
        let numberPartToAdd;
        if (currentLength + number.length > maxLength) {
          numberPartToAdd = number.substring(0, maxLength - currentLength);
          basePasswordParts.push(numberPartToAdd);
          currentLength += numberPartToAdd.length;
          usedNumberParts.push(numberPartToAdd); // Store used number part
        } else {
          basePasswordParts.push(number);
          currentLength += number.length;
          usedNumberParts.push(number); // Store used number
        }
      }

      // If we've reached maxLength, stop
      if (currentLength >= maxLength) {
        break;
      }
    }

    // Join parts to form the base password
    const basePassword = basePasswordParts.join("");

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
    const criteriaStatus = {
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
      length: false,
    };

    // Password strength criteria
    const criteria = [
      {
        key: "lowercase",
        regex: /[a-z]/,
        message: "lowercase letter",
        score: 20,
      },
      {
        key: "uppercase",
        regex: /[A-Z]/,
        message: "uppercase letter",
        score: 20,
      },
      { key: "number", regex: /\d/, message: "number", score: 20 },
      {
        key: "special",
        regex: /[@$!%*?&€#^]/,
        message: "special character",
        score: 20,
      },
      {
        key: "length",
        regex: /.{12,}/,
        message: "minimum 12 characters",
        score: 20,
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
        criteriaStatus[rule.key] = true;
      }
    });

    // Subtract points for weak dictionary words
    strength += dictionaryScore;

    // Cap the strength score between 0 and 100
    strength = Math.max(0, Math.min(strength, 100));

    return { strength, criteriaStatus };
  }

  function updateStrengthIndicator(password) {
    const { strength, criteriaStatus } = calculateStrength(password); // Destructure returned object
    const strengthMeterBar = document.querySelector(".strengthMeterBar");
    const strengthText = document.getElementById("strengthText");

    let barWidth = 0;
    let strengthLabel = selectedLang.weak; // Default to weak

    if (strength >= 90) {
      barWidth = 100;
      strengthLabel = selectedLang.strong;
    } else if (strength >= 80) {
      barWidth = 90;
      strengthLabel = selectedLang.strong;
    } else if (strength >= 70) {
      barWidth = 80;
      strengthLabel = selectedLang.medium;
    } else if (strength >= 60) {
      barWidth = 70;
      strengthLabel = selectedLang.medium;
    } else if (strength >= 50) {
      barWidth = 60;
      strengthLabel = selectedLang.medium;
    } else if (strength >= 40) {
      barWidth = 50;
      strengthLabel = selectedLang.medium;
    } else if (strength >= 30) {
      barWidth = 40;
      strengthLabel = selectedLang.weak;
    } else if (strength >= 20) {
      barWidth = 30;
      strengthLabel = selectedLang.weak;
    } else if (strength >= 10) {
      barWidth = 20;
      strengthLabel = selectedLang.weak;
    } else {
      barWidth = 10;
      strengthLabel = selectedLang.weak;
    }

    // Update the width of the bar
    strengthMeterBar.style.width = `${barWidth}%`;

    // Update the text label for strength
    strengthText.textContent = strengthLabel;

    // Update the strength criteria UI
    updateStrengthCriteriaUI(criteriaStatus);
  }

  // Function to update the strength criteria list in the UI
  function updateStrengthCriteriaUI(criteriaStatus) {
    // Mapping between criteria keys and their corresponding HTML element IDs
    const criteriaMap = {
      lowercase: "criteria-lowercase",
      uppercase: "criteria-uppercase",
      number: "criteria-number",
      special: "criteria-special",
      length: "criteria-length",
    };

    // Iterate over each criterion and update its UI
    for (const [key, isMet] of Object.entries(criteriaStatus)) {
      const criteriaElement = document.getElementById(criteriaMap[key]);
      if (criteriaElement) {
        const icon = criteriaElement.querySelector("i");
        if (isMet) {
          criteriaElement.classList.add("met");
          criteriaElement.classList.remove("unmet");
          icon.classList.remove("bi-x-circle");
          icon.classList.add("bi-check-circle");
        } else {
          criteriaElement.classList.add("unmet");
          criteriaElement.classList.remove("met");
          icon.classList.remove("bi-check-circle");
          icon.classList.add("bi-x-circle");
        }
      }
    }
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

    // Update the tags summary to reflect the new usedTagParts and usedNumberParts
    updateTagsSummary();
  }

  // Function to update the tags summary display with highlighted used parts
  function updateTagsSummary() {
    const tagsSummary = document.getElementById("tagsSummary");
    const tagsList = document.getElementById("tagsList");

    if (tags.length === 0) {
      tagsSummary.classList.add("hidden");
      tagsList.innerHTML = "";
      return;
    }

    tagsSummary.classList.remove("hidden");

    // Clear the existing list
    tagsList.innerHTML = "";

    let usedTagIndex = 0; // Counter for usedTagParts
    let usedNumberIndex = 0; // Counter for usedNumberParts

    // Iterate through each tag and its corresponding used part
    tags.forEach((tag) => {
      // Determine if the tag is a number or an interest
      if (isNaN(tag)) {
        // It's an interest; highlight the used part only
        const usedPart = usedTagParts[usedTagIndex++] || "";
        const remainingPart = tag.substring(usedPart.length);

        // Create list item with highlighted used part
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span class="used-part">${escapeHTML(
          usedPart
        )}</span>${escapeHTML(remainingPart)}`;
        tagsList.appendChild(listItem);
      } else {
        // It's a number; highlight the used part
        const usedNumberPart = usedNumberParts[usedNumberIndex++] || "";
        const remainingPart = tag.substring(usedNumberPart.length);

        // Create list item with highlighted used number part
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span class="used-part">${escapeHTML(
          usedNumberPart
        )}</span>${escapeHTML(remainingPart)}`;
        tagsList.appendChild(listItem);
      }
    });
  }

  // Function to escape HTML to prevent XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
                  <span class="service-name">${escapeHTML(
                    entry.serviceName
                  )}</span> - 
                  <span class="password-text">
                      <span class="tag-password">${escapeHTML(
                        basePart
                      )}</span><span class="service-password">${escapeHTML(
          servicePart
        )}</span>${escapeHTML(remainingPassword)}
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
      if (passwordsGenerated) {
        generateAndDisplayPasswords(); // Update service passwords if they have been generated
      }
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
      "body { font-family: Arial, sans-serif; padding: 20px; background-color: #2c2c2c; color: white; }"
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
    printWindow.document.write(
      ".tag-password { background-color: #ffeb3b; color: #000; padding: 0.2em 0.4em; border-radius: 3px; }" // Highlighted tag part
    );
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(
      "<h1>Password for " + escapeHTML(entry.serviceName) + "</h1>"
    );

    // Construct the password HTML
    const passwordHTML = `
          <div class="password-item">
              <span class="service-name">${escapeHTML(
                entry.serviceName
              )}</span> - 
              <span class="password-text">
                  <span class="tag-password">${escapeHTML(
                    entry.password
                  )}</span>
              </span>
          </div>
      `;

    printWindow.document.write(passwordHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  // Function to escape HTML to prevent XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
});
