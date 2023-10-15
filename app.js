"use strict";
const inputForm = document.getElementById("item-form");
const inputAddItem = document.getElementById("item-input");
const inputFilter = document.getElementById("filter");
const listBlock = document.getElementById("item-list");
const btnClear = document.getElementById("clear");
const formBtn = inputForm.querySelector(".btn");
let isEditMode = false;
// Functionality
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}
function onAddItemToForm(e) {
  e.preventDefault();
  const inputValue = inputAddItem.value;
  if (inputValue === "") {
    alert("Please fill this field!");
    return;
  }
  if (isEditMode) {
    const itemEdit = listBlock.querySelector("li.edit-mode");
    removeItemFromStorage(itemEdit.textContent);
    itemEdit.classList.remove("edit-mode");
    itemEdit.remove();
    isEditMode = false;
  } else {
    if (checkItemExists(inputValue)) {
      alert("Item is already in list!");
      inputAddItem.value = "";
      return;
    }
  }
  addItemToDom(inputValue);
  addItemToStorage(inputValue);
  checkUI();
  inputAddItem.value = "";
}
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
function checkItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
function addItemToDom(value) {
  const li = document.createElement("li");
  li.textContent = value;
  const button = createButtonItem("remove-item btn-link text-red");
  li.appendChild(button);
  listBlock.appendChild(li);
}
function createButtonItem(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIconItem("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
function createIconItem(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
function getItemsFromStorage() {
  const itemsFromStorage = JSON.parse(localStorage.getItem("items")) || [];
  return itemsFromStorage;
}
function filterItems(e) {
  const listItems = listBlock.querySelectorAll("li");
  const filterValue = e.target.value.toLowerCase();
  [...listItems].forEach((item) => {
    const textItem = item.firstChild.textContent.toLowerCase();
    if (textItem.indexOf(filterValue) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
function removeItem(e) {
  const removeIcon = e.target.closest("i");
  (removeIcon &&
    setTimeout(() => {
      const item = removeIcon.parentNode.parentNode;
      console.log(item);
      item.remove();
      removeItemFromStorage(item.textContent);
      checkUI();
    }, 300)) ||
    editItem(e.target.closest("li"));
}
function editItem(item) {
  isEditMode = true;
  listBlock
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228B22";
  const textEdit = item.textContent;
  if (!textEdit) return;
  inputAddItem.value = textEdit;
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((x) => x !== item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
function clearAllItems() {
  while (listBlock.firstChild) {
    listBlock.removeChild(listBlock.firstChild);
  }
  localStorage.removeItem("items");
  checkUI();
}
function checkUI() {
  const listItems = listBlock.querySelectorAll("li");
  if (listItems.length === 0) {
    btnClear.style.display = "none";
    inputFilter.style.display = "none";
  } else {
    btnClear.style.display = "block";
    inputFilter.style.display = "block";
  }
  isEditMode = false;
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
}
// Event Listeners
function init() {
  inputForm.addEventListener("submit", onAddItemToForm);
  listBlock.addEventListener("click", removeItem);
  btnClear.addEventListener("click", clearAllItems);
  inputFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
}
init();
