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
      numberRequiredMessage:
        "Please add at least one number to generate a password",

      specialCharacterCheckbox: "Use Special Character",
      uppercaseCheckpox: "Start With Uppercase",
      lowercaseCriteria: "Lowercase Letter",
      upperrcaseCriteria: "Uppercase Letter",
      numberCriteria: "Number",
      specialCharacterCriteria: "Special character",
      characterLengthCriteria: "Minimum 12 Characters",
      tagsUsed: "Used Interests",
      convertedMessage: "Converted {originalChar} to {specialChar}",
      infoSection1:
        "Enter your interests and favorite number, and we will generate a hacker-proof password for you.",
      infoSection2:
        "THIS IS A BETA PROJECT - Email chris@avirus.dk for ideas and feedback.",
      infoSection3: "--More to come--.",
      tooltipTextInterests:
        "Type your interests, what makes you happy, what you are interested in, and also write your favorite number.",
      tooltipTextCharactersPerInterest:
        "Specify how many characters of each interest to use in your new password.",
      tooltipTextPasswordLength:
        "The length of the final password - nowadays, 15 is actually the minimum recommended.",
      tooltipTextServiceName:
        "Number of characters from the website name to include.",
      tooltipTextGeneratedPasswords:
        "This section displays the passwords generated based on your inputs.",
      toolTipTextUsedInterests:
        "Here you can see the interests and numbers you have mentioned, presented so you understand how they are assembled, helping you remember them better.",
      predefinedInterests: [
        "golf",
        "badminton",
        "soccer",
        "dance",
        "running",
        "cycling",
        "friends",
        "drinking",
        "cars",
        "computer",
        "gaming",
        "krolf",
        "handball",
        "knitting",
        "hunting",
        "stamps",
        "cards",
        "horses",
        "walking",
        "bowling",
        "cats",
        "dogs",
        "flowers",
        "floorball",
        "beer",
        "fitness",
        "motorcycles",
        "art",
        "swimming",
        "food",
        "fishing",
        "boxing",
        "camping",
        "parkour",
        "music",
        "gymnastics",
        "books",
        "astronomy",
      ],
      typeYourOwnInterests: "TYPE YOUR OWN INTEREST",
      openVideoButton: "Watch Tutorial Video",
      interestsHeader: "Recommended Interests",
      colorsHeader: "Recommended Colors",
      typeYourOwnColors: "TYPE YOUR OWN COLORS",
      predefinedColors: [
        "Red",
        "Green",
        "Blue",
        "Yellow",
        "Orange",
        "Purple",
        "Black",
        "White",
        "Pink",
        "Brown",
        "Gray",
        "Turquoise",
      ],
      numbersHeader: "Recommended Numbers",
      predefinedNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      typeYourOwnNumbers: "TYPE YOUR OWN NUMBER",
      whoAmI: "Who am i",
      areYouParanoid: "Are you paranoid?",
      whoCanUseThis: "Who can use this site",
      sponsoredBy: "Sponsored by avirus.dk"
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
      numberRequiredMessage:
        "Tilføj venligst mindst et tal for at generere et password",
      specialCharacterCheckbox: "Brug Special Tegn",
      uppercaseCheckpox: "Start Med Stort",
      lowercaseCriteria: "Små Bogstaver",
      upperrcaseCriteria: "Store Bogstaver",
      numberCriteria: "Tal",
      specialCharacterCriteria: "Specialtegn",
      characterLengthCriteria: "Minimum 12 Tegn",
      tagsUsed: "Anvendte Interesser",
      convertedMessage: "Konverterede {originalChar} til {specialChar}",
      infoSection1:
        "Skriv dine interesser, og dit yndlingstal, så genererer vi en hacker-sikker adgangskode til dig.",
      infoSection2:
        "DETTE ER ET BETA PROJEKT - Skriv mail til chris@avirus.dk for ideer og feedback.",
      infoSection3: "--- Der kommer mere ---.",
      tooltipTextInterests:
        "Skriv dine interesser, hvad der gør dig glad, hvad du interesserer dig for, og skriv også dit yndlingstal.",
      tooltipTextCharactersPerInterest:
        "Angiv hvor mange tegn af hver interesse, der skal bruges i dit nye password.",
      tooltipTextPasswordLength:
        "Længden på det færdige password - i dag er 15 faktisk det mindste, der anbefales.",
      tooltipTextServiceName:
        "Antal tegn fra hjemmesidens navn, der skal inkluderes.",
      tooltipTextGeneratedPasswords:
        "Dette afsnit viser de adgangskoder, der er genereret baseret på dine input.",
      toolTipTextUsedInterests:
        "Se her de interesser og tal som du har nævnt, så står de så du forstår hvordan de er sat sammen, så husker du det bedre.",
      predefinedInterests: [
        "golf",
        "badminton",
        "fodbold",
        "dans",
        "løb",
        "cykling",
        "venner",
        "druk",
        "biler",
        "computer",
        "gaming",
        "krolf",
        "håndbold",
        "strikning",
        "jagt",
        "frimærker",
        "kort",
        "heste",
        "gåture",
        "bowling",
        "katte",
        "hunde",
        "blomster",
        "floorball",
        "øl",
        "fitness",
        "motorcykler",
        "kunst",
        "svømning",
        "mad",
        "fiskeri",
        "boksning",
        "camping",
        "parkour",
        "musik",
        "gymnastik",
        "bøger",
        "astronomi",
      ],
      typeYourOwnInterests: "SKRIV SELV DIN EGEN INTERESSE",
      openVideoButton: "Se Intro Video",
      interestsHeader: "Anbefalede Interesser",
      colorsHeader: "Anbefalede Farver",
      typeYourOwnColors: "SRIV SELV DINE EGNE FARVER",
      predefinedColors: [
        "Rød",
        "Grøn",
        "Blå",
        "Gul",
        "Orange",
        "Lilla",
        "Sort",
        "Hvid",
        "Pink",
        "Brun",
        "Grå",
        "Turkis",
      ],
      numbersHeader: "Anbefalede Tal",
      predefinedNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      typeYourOwnNumbers: "SKRIV SELV DIT EGET TAL",
      whoAmI: "Hvem er jeg",
      areYouParanoid: "Er du paranoid?",
      whoCanUseThis: "Hvem kan bruge denne side",
      sponsoredBy: "Sponsoreret af avirus.dk"
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
    document.getElementById("lowercase-criteria").textContent =
      selectedLang.lowercaseCriteria;
    document.getElementById("uppercase-criteria").textContent =
      selectedLang.upperrcaseCriteria;
    document.getElementById("number-criteria").textContent =
      selectedLang.numberCriteria;
    document.getElementById("special-criteria").textContent =
      selectedLang.specialCharacterCriteria;
    document.getElementById("length-criteria").textContent =
      selectedLang.characterLengthCriteria;
    document.getElementById("tooltip-text-interest").textContent =
      selectedLang.tooltipTextInterests;
    document.getElementById(
      "tooltip-text-characters-per-interest"
    ).textContent = selectedLang.tooltipTextCharactersPerInterest;
    document.getElementById("tooltip-text-password-length").textContent =
      selectedLang.tooltipTextPasswordLength;
    document.getElementById("tooltip-text-service-name").textContent =
      selectedLang.tooltipTextServiceName;
    document.getElementById("tooltip-text-generated-passwords").textContent =
      selectedLang.tooltipTextGeneratedPasswords;
    document.getElementById("tooltip-text-used-interests").textContent =
      selectedLang.toolTipTextUsedInterests;
    document.getElementById("openVideoButton").textContent =
      selectedLang.openVideoButton;
    document.getElementById("interestsHeader").textContent =
      selectedLang.interestsHeader;
    document.getElementById("colorsHeader").textContent =
      selectedLang.colorsHeader;
    document.getElementById("numbersHeader").textContent =
      selectedLang.numbersHeader;
    document.getElementById("whoAmI").textContent = selectedLang.whoAmI;
    document.getElementById("areYouParanoid").textContent = selectedLang.areYouParanoid;
    document.getElementById("whoCanUseThis").textContent = selectedLang.whoCanUseThis;
    document.getElementById("sponsoredBy").textContent = selectedLang.sponsoredBy;

    const infoSectionParagraphs = document.querySelectorAll(".info-section p");
    infoSectionParagraphs[0].textContent = selectedLang.infoSection1;
    infoSectionParagraphs[1].textContent = selectedLang.infoSection2;
    infoSectionParagraphs[2].textContent = selectedLang.infoSection3;

    // Update Tags Used header
    const tagsSummaryHeader = document.getElementById("tagsSummaryHeader");
    if (tagsSummaryHeader) {
      tagsSummaryHeader.textContent = selectedLang.tagsUsed;
    }

    // Render predefined interests and colors based on the selected language
    renderPredefinedInterests();
    renderPredefinedColors();
    renderPredefinedNumbers();
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

  // Define the special character mapping at the top level
  const specialCharacterMap = {
    "-": "e,i",
    "+": "?",
    "!": "i,I,L,1",
    '"': "?",
    "#": "0,8",
    "%": "P,p",
    "&": "O,o",
    "/": "L,l,i,I",
    "(": "L,i,I,l,c,C",
    ")": "L,i,I,l",
    "=": "?",
    "?": "æ,Æ",
    "@": "ø,Ø",
    "*": "å,Å",
  };

  // Function to invert the special character mapping
  function invertMapping(specialCharacterMap) {
    const invertedMap = {};
    for (const [specialChar, lettersStr] of Object.entries(
      specialCharacterMap
    )) {
      const letters = lettersStr.split(",");
      letters.forEach((letter) => {
        invertedMap[letter.toLowerCase()] = specialChar;
      });
    }
    return invertedMap;
  }

  // Create the inverted map at the top level
  const invertedMap = invertMapping(specialCharacterMap);

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

  // Arrays to store used parts and items
  let usedTagParts = [];
  let usedNumberParts = [];
  let usedTags = [];
  let usedNumbers = [];
  let usedItems = []; // New array to store used items in order

  // Variable to store the special character mapping
  let specialCharacterMapping = {};

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

  // Function to check if the user has added enough interests and numbers
  function checkMinimumInterests() {
    const totalPasswordLength = parseInt(passwordLength.value, 10); // Desired password length
    const charactersPerInterest = parseInt(charactersSlider.value, 10); // Characters per interest

    const nonNumberTags = tags.filter((tag) => isNaN(tag)); // Interests
    const numbers = tags.filter((tag) => !isNaN(tag)); // Numbers

    // Calculate expected password length
    const expectedLength =
      nonNumberTags.length * charactersPerInterest +
      numbers.reduce((sum, num) => sum + num.length, 0) +
      1; // +1 for special character

    let errorMessages = [];

    // Check if the expected password length meets the desired password length
    if (expectedLength < totalPasswordLength) {
      const minInterestsRequired = Math.ceil(
        (totalPasswordLength -
          numbers.reduce((sum, num) => sum + num.length, 0) -
          1) / // Subtract numbers and special character
          charactersPerInterest
      );

      const minInterestsMessage = selectedLang.minInterestsMessage.replace(
        "{minInterests}",
        minInterestsRequired
      );
      errorMessages.push(minInterestsMessage);
    } else if (numbers.length === 0) {
      const numberRequiredMessage = selectedLang.numberRequiredMessage;
      errorMessages.push(numberRequiredMessage);
    }

    if (errorMessages.length > 0) {
      minInterestsFeedback.innerHTML = errorMessages.join("<br>");
      minInterestsFeedback.style.display = "block";
      document.getElementById("generatePassword").disabled = true; // Disable password generation
      return false;
    } else {
      minInterestsFeedback.style.display = "none";
      document.getElementById("generatePassword").disabled = false; // Enable password generation
      return true;
    }
  }

  // Modified generateBasePassword function
  function generateBasePassword(tags, charactersValue, minLength) {
    charactersValue = parseInt(charactersValue, 10);
    minLength = parseInt(minLength, 10); // Now treated as minimum length

    let basePasswordParts = [];
    let numbers = [];
    let nonNumberTags = [];

    // Reset usedTagParts, usedNumberParts, and specialCharacterMapping for fresh generation
    usedTagParts = [];
    usedNumberParts = [];
    usedTags = [];
    usedNumbers = [];
    usedItems = [];
    specialCharacterMapping = {};

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
    for (let i = 0; i < nonNumberTags.length; i++) {
      const tag = nonNumberTags[i];
      let extractedPart = tag.substring(0, charactersValue); // Get exactly charactersValue characters

      // Replace æ, ø, å characters no matter what
      extractedPart = extractedPart
        .split("")
        .map((char) => {
          const replacement = invertedMap[char.toLowerCase()];

          if (["æ", "ø", "å"].includes(char.toLowerCase())) {
            if (replacement) {
              // Store the original and special character mapping, but only the first time
              if (!specialCharacterMapping.originalChar) {
                specialCharacterMapping.originalChar = char;
                specialCharacterMapping.specialChar = replacement;
              }

              return replacement;
            }
          } else if (useSpecial && !specialCharacterInserted) {
            if (replacement) {
              specialCharacterInserted = true; // Mark that we've inserted a special character

              // Store the original and special character mapping
              specialCharacterMapping.originalChar = char;
              specialCharacterMapping.specialChar = replacement;

              return replacement;
            }
          }

          return char;
        })
        .join("");

      // Capitalize the first letter if the option is selected
      if (capitalizeFirst && extractedPart.length > 0) {
        extractedPart =
          extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart);
      usedTagParts.push(extractedPart);
      usedTags.push(tag);
      usedItems.push({ type: "tag", value: extractedPart, original: tag });

      // Insert a number after each interest (if any numbers are left)
      if (numbers.length > 0) {
        const number = numbers.shift();
        basePasswordParts.push(number);
        usedNumberParts.push(number); // Store used number
        usedNumbers.push(number);
        usedItems.push({ type: "number", value: number, original: number });
      }
    }

    // If there are remaining numbers, add them at the end
    while (numbers.length > 0) {
      const number = numbers.shift();
      basePasswordParts.push(number);
      usedNumberParts.push(number);
      usedNumbers.push(number);
      usedItems.push({ type: "number", value: number, original: number });
    }

    // If no special character was inserted, add '!' at the end
    if (!specialCharacterInserted) {
      basePasswordParts.push("!");
      usedItems.push({ type: "special", value: "!", original: "!" });
    }

    // Join parts to form the base password
    const basePassword = basePasswordParts.join("");

    return basePassword; // Return the final base password
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

    // Generate the special characters regex dynamically
    const specialChars = Object.keys(specialCharacterMap)
      .join("")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters

    // Password strength criteria
    const criteria = [
      {
        key: "lowercase",
        regex: /[a-z]/,
        message: selectedLang.lowercaseCriteria,
        score: 20,
      },
      {
        key: "uppercase",
        regex: /[A-Z]/,
        message: selectedLang.upperrcaseCriteria,
        score: 20,
      },
      {
        key: "number",
        regex: /\d/,
        message: selectedLang.numberCriteria,
        score: 20,
      },
      {
        key: "special",
        regex: new RegExp("[" + specialChars + "]"),
        message: selectedLang.specialCharacterCriteria,
        score: 20,
      },
      {
        key: "length",
        regex: /.{12,}/,
        message: selectedLang.characterLengthCriteria,
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

    // Generate a base password based on user inputs
    const basePassword = generateBasePassword(
      tags,
      charactersSlider.value,
      totalPasswordLength
    );

    // Update the base password text
    const originalPasswordDiv = document.getElementById("originalPassword");
    originalPasswordDiv.textContent = basePassword;

    // Update the strength indicator for the base password
    updateStrengthIndicator(basePassword);

    // Update the tags summary to reflect the new usedTagParts and usedNumberParts
    updateTagsSummary();
  }

  function updateTagsSummary() {
    const tagsSummary = document.getElementById("tagsSummary");
    const tagsList = document.getElementById("tagsList");
    const specialCharInfo = document.getElementById("specialCharInfo");

    if (usedItems.length === 0) {
      tagsSummary.classList.add("hidden");
      tagsList.innerHTML = "";
      specialCharInfo.innerHTML = "";
      return;
    }

    tagsSummary.classList.remove("hidden");

    // Clear the existing list and special character info
    tagsList.innerHTML = "";
    specialCharInfo.innerHTML = "";

    // To keep track of the current indentation level
    let totalUsedLength = 0;

    // Iterate through usedItems and display them
    usedItems.forEach((item) => {
      const listItem = document.createElement("li");

      const usedPart = item.value || "";
      const remainingPart = item.original.substring(usedPart.length);

      // Set up indentation based on the total length of the parts used so far
      const indent = totalUsedLength * 10; // Adjust the multiplier for better spacing if needed

      // Create a div with increasing margin-left to simulate the stair-step effect
      listItem.innerHTML = `
              <div style="margin-left: ${indent}px;">
                  <span class="used-part">${escapeHTML(
                    usedPart
                  )}</span>${escapeHTML(remainingPart)}
              </div>
          `;

      tagsList.appendChild(listItem);

      // Update the total used length
      totalUsedLength += usedPart.length;
    });

    // Display the special character mapping if any
    if (specialCharacterMapping.originalChar) {
      const convertedMessage = selectedLang.convertedMessage
        .replace(
          "{originalChar}",
          `<span class="converted-char">${escapeHTML(
            specialCharacterMapping.originalChar
          )}</span>`
        )
        .replace(
          "{specialChar}",
          `<span class="converted-char">${escapeHTML(
            specialCharacterMapping.specialChar
          )}</span>`
        );

      specialCharInfo.innerHTML = convertedMessage;
    }
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
    const serviceNameLength = parseInt(serviceNameSlider.value, 10); // Length from service name

    // Generate passwords for each selected service
    const passwords = selectedServices.map((service) => {
      return {
        serviceName: service,
        password: insertServiceName(basePassword, service, serviceNameLength),
      };
    });

    // Display the generated passwords in the UI
    const passwordsContainer = document.getElementById("passwords");
    passwordsContainer.innerHTML = passwords
      .map((entry, index) => {
        const servicePart = entry.serviceName.substring(0, serviceNameLength);
        const servicePartIndex = entry.password.indexOf(servicePart);

        let basePart = "";
        let remainingPassword = "";

        if (servicePartIndex !== -1) {
          basePart = entry.password.slice(0, servicePartIndex);
          remainingPassword = entry.password.slice(
            servicePartIndex + servicePart.length
          );
        } else {
          basePart = entry.password;
          remainingPassword = "";
        }

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

  // Function to insert the service name into the generated password
  function insertServiceName(password, serviceName, serviceNameLength) {
    serviceNameLength = parseInt(serviceNameLength, 10);

    const specialCharacterIndex = password.search(/[-+!"#@%&/()=?]/);
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

    // No trimming of the final password length
    return newPassword; // Return the generated password
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
      ".tag-password { background-color: #ffeb3b; color: #000; padding: 0.2em 0.4em; border-radius: 3px; }"
    );
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(
      "<h1>Password for " + escapeHTML(entry.serviceName) + "</h1>"
    );

    // Construct the password HTML
    const passwordHTML = `
            <div class="password-item">
              <span class="service-name">${escapeHTML(entry.serviceName)}</span> - 
              <span class="password-text">
                <span class="tag-password">${escapeHTML(entry.password)}</span>
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

  // Function to render predefined interests
  function renderPredefinedInterests() {
    const predefinedInterestsDiv = document.getElementById(
      "predefinedInterests"
    );
    predefinedInterestsDiv.innerHTML = selectedLang.predefinedInterests
      .map(
        (interest) =>
          `<button class="predefined-interest-button">${escapeHTML(
            interest
          )}</button>`
      )
      .join("");

    // Add the 'Type your own interests' button
    predefinedInterestsDiv.innerHTML += `<button id="typeYourOwnInterestsButton" class="predefined-interest-button special-button">${escapeHTML(
      selectedLang.typeYourOwnInterests
    )}</button>`;

    const typeYourOwnInterestsButton = document.getElementById(
      "typeYourOwnInterestsButton"
    );
    typeYourOwnInterestsButton.addEventListener("click", function (event) {
      inputField.focus();
      event.stopPropagation(); // Prevent event from bubbling up
    });
  }

  // Handle clicks on predefined interest buttons
  function handlePredefinedInterestClicks() {
    const predefinedInterestsDiv = document.getElementById(
      "predefinedInterests"
    );
    predefinedInterestsDiv.addEventListener("click", function (event) {
      if (event.target && event.target.nodeName === "BUTTON") {
        const interest = event.target.textContent;
        // Add the interest to the tags
        tags.push(interest);
        updateItems(tagsDiv, tags); // Update the UI
        updateBasePassword(); // Update base password
        checkMinimumInterests(); // Check if minimum interests are met
      }
    });
  }

  function handleTypeYourOwnColorsButton() {
    const typeYourOwnColorsButton = document.getElementById(
      "typeYourOwnColorsButton"
    );
    typeYourOwnColorsButton.addEventListener("click", function (event) {
      inputField.focus();
      event.stopPropagation(); // Prevent event from bubbling up
    });
  }

  function renderPredefinedColors() {
    const predefinedColorsDiv = document.getElementById("predefinedColors");
    predefinedColorsDiv.innerHTML = selectedLang.predefinedColors
      .map(
        (color) =>
          `<button class="predefined-color-button">${escapeHTML(
            color
          )}</button>`
      )
      .join("");

    // Add the 'Type your own colors' button
    predefinedColorsDiv.innerHTML += `<button id="typeYourOwnColorsButton" class="predefined-color-button special-button">${escapeHTML(
      selectedLang.typeYourOwnColors
    )}</button>`;

    // Add event listener to the 'Type Your Own Colors' button
    const typeYourOwnColorsButton = document.getElementById(
      "typeYourOwnColorsButton"
    );
    typeYourOwnColorsButton.addEventListener("click", function (event) {
      inputField.focus();
      event.stopPropagation(); // Prevent event from bubbling up
    });
  }

  // Function to handle clicks on predefined color buttons
  function handlePredefinedColorClicks() {
    const predefinedColorsDiv = document.getElementById("predefinedColors");
    predefinedColorsDiv.addEventListener("click", function (event) {
      if (event.target && event.target.nodeName === "BUTTON") {
        const color = event.target.textContent;

        // Check if the clicked button is the 'Type Your Own Colors' button
        if (color === selectedLang.typeYourOwnColors) {
          // Focus the input field
          inputField.focus();
          event.stopPropagation(); // Prevent event from bubbling up
        } else {
          // Add the color to the tags
          tags.push(color);
          updateItems(tagsDiv, tags); // Update the UI
          updateBasePassword(); // Update base password
          checkMinimumInterests(); // Check if minimum interests are met
        }
      }
    });
  }

  // Function to render predefined numbers
function renderPredefinedNumbers() {
  const predefinedNumbersDiv = document.getElementById("predefinedNumbers");
  predefinedNumbersDiv.innerHTML = selectedLang.predefinedNumbers
    .map(
      (number) =>
        `<button class="predefined-number-button">${escapeHTML(
          number
        )}</button>`
    )
    .join("");

  // Add the 'Type your own numbers' button
  predefinedNumbersDiv.innerHTML += `<button id="typeYourOwnNumbersButton" class="predefined-number-button special-button">${escapeHTML(
    selectedLang.typeYourOwnNumbers
  )}</button>`;

  // Add event listener to the 'Type Your Own Numbers' button
  const typeYourOwnNumbersButton = document.getElementById(
    "typeYourOwnNumbersButton"
  );
  typeYourOwnNumbersButton.addEventListener("click", function (event) {
    inputField.focus();
    event.stopPropagation(); // Prevent event from bubbling up
  });
}

// Function to handle clicks on predefined number buttons
function handlePredefinedNumberClicks() {
  const predefinedNumbersDiv = document.getElementById("predefinedNumbers");
  predefinedNumbersDiv.addEventListener("click", function (event) {
    if (event.target && event.target.nodeName === "BUTTON") {
      const number = event.target.textContent;

      // Check if the clicked button is the 'Type Your Own Numbers' button
      if (number === selectedLang.typeYourOwnNumbers) {
        // Focus the input field
        inputField.focus();
        event.stopPropagation(); // Prevent event from bubbling up
      } else {
        // Add the number to the tags
        tags.push(number);
        updateItems(tagsDiv, tags); // Update the UI
        updateBasePassword(); // Update base password
        checkMinimumInterests(); // Check if minimum interests are met
      }
    }
  });
}


  // Call these functions after your existing initialization code
  renderPredefinedInterests();
  handlePredefinedInterestClicks();
  renderPredefinedColors();
  handlePredefinedColorClicks();
  renderPredefinedNumbers();
  handlePredefinedNumberClicks();

  // Get modal elements
  const modal = document.getElementById("videoModal");
  const openVideoButton = document.getElementById("openVideoButton");
  const closeModalButton = document.getElementById("closeModal");
  const tutorialVideo = document.getElementById("tutorialVideo");

  // Open the modal when the button is clicked
  openVideoButton.addEventListener("click", function () {
    modal.style.display = "block";
    // Play the video from the beginning
    tutorialVideo.currentTime = 0;
    tutorialVideo.pause();
  });

  // Close the modal when the close button is clicked
  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
    tutorialVideo.pause();
  });

  // Close the modal when the user clicks outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      tutorialVideo.pause();
    }
  });

  // Close modal on 'Esc' key press
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        tutorialVideo.pause();
      }
    }
  });
});
