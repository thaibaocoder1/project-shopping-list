"use strict";
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = document.querySelector(".btn");
let isEdit = false;
// Function
function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}
function onItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  if (isEdit) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
    formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
    formBtn.style.backgroundColor = "#000";
    isEdit = false;
    itemInput.value = "";
  } else {
    if (checkItemExists(newItem)) {
      alert("Item already added in list!");
      itemInput.value = "";
      return;
    }
  }
  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = "";
}
function checkItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}
function addItemToDOM(item) {
  const li = createElement(item);
  itemList.appendChild(li);
}
function addItemToStorage(item) {
  let itemsFromStorage;
  itemsFromStorage = getItemFromStorage();
  itemsFromStorage.push(item);
  localStorage && setItemToStorage(itemsFromStorage);
}
function getItemFromStorage() {
  return JSON.parse(localStorage.getItem("items")) || [];
}
function createElement(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  return li;
}
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");
  if (items) {
    items.forEach((item) => {
      const content = item.firstChild.textContent.toLowerCase();
      if (content.indexOf(text) !== -1) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }
}
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setEditForItem(e.target);
  }
}
function setEditForItem(item) {
  isEdit = true;
  itemList
    .querySelectorAll("li")
    .forEach((x) => x.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`;
  formBtn.style.backgroundColor = "green";
  itemInput.value = item.textContent;
}
function removeItem(item) {
  if (confirm("Are you sure?")) {
    item.remove();
    removeItemFromStorage(item.textContent);
  }
  checkUI();
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();
  itemsFromStorage = itemsFromStorage.filter((x) => x !== item);
  setItemToStorage(itemsFromStorage);
}
function removeAllItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("items");
  checkUI();
}
function setItemToStorage(item) {
  return localStorage.setItem("items", JSON.stringify(item));
}
function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
  formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  formBtn.style.backgroundColor = "#000";
  isEdit = false;
}
// Event Listeners
function initApp() {
  itemForm.addEventListener("submit", onItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", removeAllItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
}
initApp();
