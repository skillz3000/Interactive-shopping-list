let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [
    { name: "J1s", price: 23600, purchased: false },
    { name: "Ant3s", price: 40000, purchased: false },
    { name: "VaporMax", price: 25000, purchased: false }
];

const listContainer = document.getElementById("shoppingList");
const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addButton = document.getElementById("addButton");
const totalCost = document.getElementById("totalCost");
const clearButton = document.getElementById("clearButton");
const markPurchasedButton = document.getElementById("markPurchasedButton");

// Save list
function saveList() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// Display list
function displayList() {
    listContainer.innerHTML = "";

    shoppingList.forEach((item, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const text = document.createElement("span");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        checkbox.type = "checkbox";
        checkbox.checked = item.purchased;

        text.textContent = `${item.name} - KSh ${item.price.toFixed(2)}`;
        text.style.textDecoration = item.purchased ? "line-through" : "none";

        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        checkbox.addEventListener("change", () => {
            item.purchased = checkbox.checked;
            saveList();
            displayList();
        });

        editButton.addEventListener("click", () => {
            const name = prompt("Enter item name:", item.name);
            if (name === null || !name.trim()) return;

            const price = prompt("Enter item price:", item.price);
            if (price === null || price.trim() === "" ||
                !Number.isFinite(Number(price)) || Number(price) < 0) {
                alert("Enter a valid price!");
                return;
            }

            item.name = name.trim();
            item.price = Number(price);

            saveList();
            displayList();
        });

        deleteButton.addEventListener("click", () => {
            shoppingList.splice(index, 1);
            saveList();
            displayList();
        });

        li.append(checkbox, text, editButton, deleteButton);
        listContainer.appendChild(li);
    });

    // Calculate purchased items total
    const total = shoppingList.reduce(
        (sum, item) => sum + (item.purchased ? item.price : 0), 0
    );

    totalCost.textContent = total.toFixed(2);
}

// Add item
addButton.addEventListener("click", () => {
    const name = itemInput.value.trim();
    const price = Number(priceInput.value);

    if (!name || priceInput.value.trim() === "" ||
        !Number.isFinite(price) || price < 0) {
        alert("Enter a valid item name and price!");
        return;
    }

    shoppingList.push({ name, price, purchased: false });

    itemInput.value = "";
    priceInput.value = "";

    saveList();
    displayList();
});


    if (markPurchasedButton) {
    markPurchasedButton.addEventListener("click", () => {
        shoppingList.forEach(item => item.purchased = true);
        saveList();
        displayList();
    });
}

// Clear list
if (clearButton) {
    clearButton.addEventListener("click", () => {
        if (confirm("Clear the entire shopping list?")) {
            shoppingList = [];
            saveList();
            displayList();
        }
    });
}

// Start the application
displayList();
