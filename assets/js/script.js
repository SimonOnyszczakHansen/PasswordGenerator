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

  // Input field: allow only letters (including æ, ø, å) and numbers
  inputField.addEventListener("input", function () {
    inputField.value = inputField.value.replace(/[^a-zA-ZæøåÆØÅ0-9]/g, "");
  });

  // Define the special character mapping and create its inverted map
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

  function invertMapping(map) {
    const inverted = {};
    for (const [key, lettersStr] of Object.entries(map)) {
      lettersStr.split(",").forEach((letter) => {
        inverted[letter.toLowerCase()] = key;
      });
    }
    return inverted;
  }
  const invertedMap = invertMapping(specialCharacterMap);

  // Arrays for storing tags and generated password parts
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
  ];
  let usedTagParts = [];
  let usedNumberParts = [];
  let usedTags = [];
  let usedNumbers = [];
  let usedItems = [];
  let specialCharacterMapping = {};

  // Feedback element for minimum interests requirement (assumes an element with this ID exists in the HTML)
  const minInterestsFeedback = document.getElementById("minInterestsFeedback");

  // Function to add items (tags) entered by the user
  function addItem(inputField, container, itemList) {
    const value = inputField.value.trim();
    if (value) {
      itemList.push(value);
      updateItems(container, itemList);
      inputField.value = "";
      updateBasePassword();
    }
    checkMinimumInterests();
  }

  // Function to update the tags container with the current list of items
  function updateItems(container, itemList) {
    container.innerHTML = itemList
      .map((item) => `<span>${escapeHTML(item)}</span>`)
      .join("");
  }

  // Handle addition and removal of tags
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
        updateBasePassword();
      }
      checkMinimumInterests();
    });
  }

  // Initialize tag addition and slider updates
  handleItemAddition(addBtn, inputField, tagsDiv, tags);
  updateSlider(charactersSlider, charactersValue);
  updateSlider(passwordLength, passwordLengthValue);
  updateSlider(serviceNameSlider, serviceNameValue);

  // Function to update slider display values
  function updateSlider(slider, displayElement) {
    slider.addEventListener("input", function () {
      displayElement.textContent = slider.value;
    });
  }

  // Function to check if enough interests and numbers have been added
  function checkMinimumInterests() {
    const totalPasswordLength = parseInt(passwordLength.value, 10);
    const charactersPerInterest = parseInt(charactersSlider.value, 10);
    const nonNumberTags = tags.filter((tag) => isNaN(tag));
    const numbers = tags.filter((tag) => !isNaN(tag));
    const expectedLength =
      nonNumberTags.length * charactersPerInterest +
      numbers.reduce((sum, num) => sum + num.length, 0) +
      1; // +1 for special character

    let errorMessages = [];
    if (expectedLength < totalPasswordLength) {
      const minInterestsRequired = Math.ceil(
        (totalPasswordLength -
          numbers.reduce((sum, num) => sum + num.length, 0) -
          1) /
          charactersPerInterest
      );
      errorMessages.push(
        "Tilføj venligst mindst " +
          minInterestsRequired +
          " interesser for at generere en adgangskode."
      );
    } else if (numbers.length === 0) {
      errorMessages.push(
        "Tilføj venligst mindst et tal for at generere et password"
      );
    }

    if (errorMessages.length > 0) {
      minInterestsFeedback.innerHTML = errorMessages.join("<br>");
      minInterestsFeedback.style.display = "block";
      document.getElementById("generatePassword").disabled = true;
      return false;
    } else {
      minInterestsFeedback.style.display = "none";
      document.getElementById("generatePassword").disabled = false;
      return true;
    }
  }

  document.getElementById("predefinedInterests").addEventListener("click", function (event) {
    if(event.target && event.target.tagName === "BUTTON") {
      const interests = event.target.textContent;
      tags.push(interests)
      updateItems(tagsDiv, tags);
      updateBasePassword();
      checkMinimumInterests();
    }
  });

document.getElementById("predefinedColors").addEventListener("click", function (event) {
    if(event.target && event.target.tagName === "BUTTON") {
      const colors = event.target.textContent;
      tags.push(colors)
      updateItems(tagsDiv, tags);
      updateBasePassword();
      checkMinimumInterests();
    }
  });

  document.getElementById("predefinedNumbers").addEventListener("click", function (event) {
    if(event.target && event.target.tagName === "BUTTON") {
      const numbers = event.target.textContent;
      tags.push(numbers)
      updateItems(tagsDiv, tags);
      updateBasePassword();
      checkMinimumInterests();
    }
  });

  // Function to generate the base password based on user inputs
  function generateBasePassword(tags, charactersValue, minLength) {
    charactersValue = parseInt(charactersValue, 10);
    minLength = parseInt(minLength, 10);

    let basePasswordParts = [];
    let numbers = [];
    let nonNumberTags = [];

    usedTagParts = [];
    usedNumberParts = [];
    usedTags = [];
    usedNumbers = [];
    usedItems = [];
    specialCharacterMapping = {};
    let specialCharacterInserted = false;

    tags.forEach((tag) => {
      if (!isNaN(tag)) {
        numbers.push(tag);
      } else {
        nonNumberTags.push(tag);
      }
    });

    const capitalizeFirst = true;

    nonNumberTags.forEach((tag) => {
      let extractedPart = tag.substring(0, charactersValue);
      extractedPart = extractedPart
        .split("")
        .map((char) => {
          if (["æ", "ø", "å", "Æ", "Ø", "Å"].includes(char.toLowerCase())) {
            if (!specialCharacterInserted) {
              const replacement = invertedMap[char.toLowerCase()];
              if (replacement) {
                specialCharacterInserted = true;
                specialCharacterMapping.originalChar = char;
                specialCharacterMapping.specialChar = replacement;
                return replacement;
              }
            }
          }
          return char;
        })
        .join("");

      if (capitalizeFirst && extractedPart.length > 0) {
        extractedPart =
          extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);
      }

      basePasswordParts.push(extractedPart);
      usedTagParts.push(extractedPart);
      usedTags.push(tag);
      usedItems.push({ type: "tag", value: extractedPart, original: tag });

      if (numbers.length > 0) {
        const number = numbers.shift();
        basePasswordParts.push(number);
        usedNumberParts.push(number);
        usedNumbers.push(number);
        usedItems.push({ type: "number", value: number, original: number });
      }
    });

    while (numbers.length > 0) {
      const number = numbers.shift();
      basePasswordParts.push(number);
      usedNumberParts.push(number);
      usedNumbers.push(number);
      usedItems.push({ type: "number", value: number, original: number });
    }

    if (!specialCharacterInserted) {
      basePasswordParts.push("!");
      usedItems.push({ type: "special", value: "!", original: "!" });
    }

    return basePasswordParts.join("");
  }

  // Function to calculate password strength
  function calculateStrength(password) {
    let strength = 0;
    const criteriaStatus = {
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
      length: false,
    };

    const specialChars = Object.keys(specialCharacterMap)
      .join("")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const criteria = [
      { key: "lowercase", regex: /[a-z]/, score: 20 },
      { key: "uppercase", regex: /[A-Z]/, score: 20 },
      { key: "number", regex: /\d/, score: 20 },
      { key: "special", regex: new RegExp("[" + specialChars + "]"), score: 20 },
      { key: "length", regex: /.{12,}/, score: 20 },
    ];

    const dictionaryWords = ["password", "qwerty", "123456", "admin", "welcome"];
    const dictionaryScore = dictionaryWords.some((word) =>
      password.toLowerCase().includes(word)
    )
      ? -20
      : 0;

    criteria.forEach((rule) => {
      if (rule.regex.test(password)) {
        strength += rule.score;
        criteriaStatus[rule.key] = true;
      }
    });

    strength += dictionaryScore;
    strength = Math.max(0, Math.min(strength, 100));

    return { strength, criteriaStatus };
  }

  const currentLang = this.documentElement.lang || "en";

  const strengthLabels = {
    en: { weak: "Weak", medium: "Medium", strong: "Strong" },
    da: { weak: "Svag", medium: "Middel", strong: "Stærk" }
  };

  // Update the strength meter and criteria indicators
  function updateStrengthIndicator(password) {
    const { strength, criteriaStatus } = calculateStrength(password);
    const strengthMeterBar = document.querySelector(".strengthMeterBar");
    const strengthText = document.getElementById("strengthText");
  
    let barWidth = 0;
    // Default to "weak" based on current language
    let strengthLabel = strengthLabels[currentLang].weak;
  
    if (strength >= 90) {
      barWidth = 100;
      strengthLabel = strengthLabels[currentLang].strong;
    } else if (strength >= 80) {
      barWidth = 90;
      strengthLabel = strengthLabels[currentLang].strong;
    } else if (strength >= 70) {
      barWidth = 80;
      strengthLabel = strengthLabels[currentLang].medium;
    } else if (strength >= 60) {
      barWidth = 70;
      strengthLabel = strengthLabels[currentLang].medium;
    } else if (strength >= 50) {
      barWidth = 60;
      strengthLabel = strengthLabels[currentLang].medium;
    } else if (strength >= 40) {
      barWidth = 50;
      strengthLabel = strengthLabels[currentLang].medium;
    } else if (strength >= 30) {
      barWidth = 40;
      strengthLabel = strengthLabels[currentLang].weak;
    } else if (strength >= 20) {
      barWidth = 30;
      strengthLabel = strengthLabels[currentLang].weak;
    } else if (strength >= 10) {
      barWidth = 20;
      strengthLabel = strengthLabels[currentLang].weak;
    } else {
      barWidth = 10;
      strengthLabel = strengthLabels[currentLang].weak;
    }
  
    strengthMeterBar.style.width = `${barWidth}%`;
    strengthText.textContent = strengthLabel;
  
    updateStrengthCriteriaUI(criteriaStatus);
  }
  

  // Update the UI for each strength criteria
  function updateStrengthCriteriaUI(criteriaStatus) {
    const criteriaMap = {
      lowercase: "criteria-lowercase",
      uppercase: "criteria-uppercase",
      number: "criteria-number",
      special: "criteria-special",
      length: "criteria-length",
    };

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

  // Update base password and strength indicator
  function updateBasePassword() {
    if (!checkMinimumInterests()) {
      document
        .getElementById("originalPasswordContainer")
        .classList.add("hidden");
      document.getElementById("passwordsContainer").classList.add("hidden");
      return;
    }

    const totalPasswordLength = parseInt(passwordLength.value, 10);
    const basePassword = generateBasePassword(
      tags,
      charactersSlider.value,
      totalPasswordLength
    );

    document.getElementById("originalPassword").textContent = basePassword;
    updateStrengthIndicator(basePassword);
    updateTagsSummary();
  }

  // Update the summary of used tags
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
    tagsList.innerHTML = "";
    specialCharInfo.innerHTML = "";

    let totalUsedLength = 0;
    usedItems.forEach((item) => {
      const listItem = document.createElement("li");
      const usedPart = item.value || "";
      const remainingPart = item.original.substring(usedPart.length);
      const indent = totalUsedLength * 10;
      listItem.innerHTML = `<div style="margin-left: ${indent}px;">
                              <span class="used-part">${escapeHTML(
                                usedPart
                              )}</span>${escapeHTML(remainingPart)}
                            </div>`;
      tagsList.appendChild(listItem);
      totalUsedLength += usedPart.length;
    });

    if (specialCharacterMapping.originalChar) {
      specialCharInfo.innerHTML =
        "Konverterede " +
        `<span class="converted-char">${escapeHTML(
          specialCharacterMapping.originalChar
        )}</span>` +
        " til " +
        `<span class="converted-char">${escapeHTML(
          specialCharacterMapping.specialChar
        )}</span>`;
    }
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Generate and display passwords for each service
  function generateAndDisplayServicePasswords(basePassword) {
    const serviceNameLength = parseInt(serviceNameSlider.value, 10);
    const passwords = selectedServices.map((service) => {
      return {
        serviceName: service,
        password: insertServiceName(basePassword, service, serviceNameLength),
      };
    });

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

    const printIcons = document.querySelectorAll(".print-password-icon");
    printIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        printPassword(passwords[index]);
      });
    });

    document.getElementById("passwordsContainer").classList.remove("hidden");
  }

  // Insert the service name into the generated password
  function insertServiceName(password, serviceName, serviceNameLength) {
    serviceNameLength = parseInt(serviceNameLength, 10);
    const specialCharacterIndex = password.search(/[-+!"#@%&/()=?]/);
    let servicePart = serviceName.substring(0, serviceNameLength);
    let newPassword;

    if (specialCharacterIndex !== -1) {
      newPassword =
        password.slice(0, specialCharacterIndex + 1) +
        servicePart +
        password.slice(specialCharacterIndex + 1);
    } else {
      newPassword = password + servicePart;
    }
    return newPassword;
  }

  // Generate and display passwords when the button is clicked
  let passwordsGenerated = false;
  function generateAndDisplayPasswords() {
    updateBasePassword();
    if (!checkMinimumInterests()) {
      document
        .getElementById("originalPasswordContainer")
        .classList.add("hidden");
      document.getElementById("passwordsContainer").classList.add("hidden");

      // Add shake animation to the error message
      minInterestsFeedback.classList.remove("shake-animation");
      void minInterestsFeedback.offsetWidth;
      minInterestsFeedback.classList.add("shake-animation");
      return;
    }

    passwordsGenerated = true;
    const basePassword =
      document.getElementById("originalPassword").textContent;
    generateAndDisplayServicePasswords(basePassword);
    document.getElementById("originalPasswordContainer").classList.remove("hidden");
    document.getElementById("passwordsContainer").classList.remove("hidden");
  }

  document.getElementById("generatePassword").addEventListener("click", function () {
    generateAndDisplayPasswords();
  });

  // Update password when sliders change
  function handleSliderUpdates() {
    charactersSlider.addEventListener("input", () => {
      charactersValue.textContent = charactersSlider.value;
      updateBasePassword();
      if (passwordsGenerated) {
        generateAndDisplayPasswords();
      }
    });

    passwordLength.addEventListener("input", () => {
      passwordLengthValue.textContent = passwordLength.value;
      updateBasePassword();
      if (passwordsGenerated) {
        generateAndDisplayPasswords();
      }
    });

    serviceNameSlider.addEventListener("input", () => {
      serviceNameValue.textContent = serviceNameSlider.value;
      updateBasePassword();
      if (passwordsGenerated) {
        generateAndDisplayPasswords();
      }
    });
  }
  handleSliderUpdates();

  // Initially hide password containers
  document.getElementById("passwordsContainer").classList.add("hidden");
  document.getElementById("originalPasswordContainer").classList.add("hidden");

  // Print password functionality
  function printPassword(entry) {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Password</title>");
    printWindow.document.write("<style>");
    printWindow.document.write("body { font-family: Arial, sans-serif; padding: 20px; background-color: #2c2c2c; color: white; }");
    printWindow.document.write(".password-item { margin-bottom: 10px; font-size: 1.2em; }");
    printWindow.document.write(".service-name { font-weight: bold; }");
    printWindow.document.write(".password-text { display: inline-block; margin-left: 5px; }");
    printWindow.document.write(".service-password { color: #66cc00; font-weight: bold; }");
    printWindow.document.write(".tag-password { background-color: #ffeb3b; color: #000; padding: 0.2em 0.4em; border-radius: 3px; }");
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write("<h1>Password for " + escapeHTML(entry.serviceName) + "</h1>");
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

  // Modal video functionality
  const modal = document.getElementById("videoModal");
  const openVideoButton = document.getElementById("openVideoButton");
  const closeModalButton = document.getElementById("closeModal");
  const tutorialVideo = document.getElementById("tutorialVideo");

  openVideoButton.addEventListener("click", function () {
    modal.style.display = "block";
    tutorialVideo.currentTime = 0;
    tutorialVideo.pause();
  });
  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
    tutorialVideo.pause();
  });
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      tutorialVideo.pause();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        tutorialVideo.pause();
      }
    }
  });
});
