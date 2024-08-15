const tagsDiv = document.getElementById("tags");
const addBtn = document.getElementById("addButton");
const inputField = document.getElementById("inputsTextField");

let tags = [];

function addTag() {
  const value = inputField.value.trim();
  if (value) {
    tags.push(value);
    updateTags(tagsDiv, tags);
    inputField.value = "";
  }
}

function updateTags(container, tagList) {
  container.innerHTML = tagList.map((tag) => `<span>${tag}</span>`).join("");
}

addBtn.addEventListener("click", function () {
  addTag();
});

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTag();
  }
});

tagsDiv.addEventListener("click", function () {
    const tag = event.target;
    const index = tags.indexOf(tag.textContent);
    if (index > -1) {
        tags.splice(index, 1);
        updateTags(tagsDiv, tags);
        }
})