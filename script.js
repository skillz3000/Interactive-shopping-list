let shoppingList = [
    { name: "J1s", price: 23600, purchased: false },
    { name: "Ant3s", price: 40000, purchased: false },
    { name: "VaporMax", price: 25000, purchased: false }
];

try {
    const savedList = localStorage.getItem("shoppingList");

    if (savedList !== null) {
        const parsedList = JSON.parse(savedList);

        if (
            Array.isArray(parsedList) &&
            parsedList.every(item =>
                item &&
                typeof item.name === "string" &&
                item.name.trim() !== "" &&
                typeof item.price === "number" &&
                Number.isFinite(item.price) &&
                item.price >= 0 &&
                typeof item.purchased === "boolean"
            )
        ) {
            shoppingList = parsedList;
        }
    }
} catch (error) {
    console.error("Error loading shopping list:", error);
}

const listContainer = document.getElementById("shoppingList");
const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addButton = document.getElementById("addButton");
const totalCost = document.getElementById("totalCost");

function saveShoppingList() {
    try {
        localStorage.setItem(
            "shoppingList",
            JSON.stringify(shoppingList)
        );
    } catch (error) {
        console.error("Error saving shopping list:", error);
        alert("Unable to save the shopping list.");
    }
}

function displayShoppingList() {
    listContainer.innerHTML = "";

    shoppingList.forEach(function(item, index) {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        const itemText = document.createElement("span");

        checkbox.type = "checkbox";
        checkbox.checked = item.purchased;

        checkbox.addEventListener("change", function() {
            item.purchased = checkbox.checked;

            saveShoppingList();
            displayShoppingList();
        });

        itemText.textContent =
            " " + item.name + " - KSh " +
            item.price.toFixed(2);

        itemText.style.textDecoration = item.purchased
            ? "line-through"
            : "none";

        label.appendChild(checkbox);
        label.appendChild(itemText);

        li.appendChild(label);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";

        editButton.addEventListener("click", function() {
            const newName = prompt(
                "Enter item name:",
                item.name
            );

            if (newName === null) {
                return;
            }

            if (newName.trim() === "") {
                alert("Item name cannot be empty!");
                return;
            }

            const newPrice = prompt(
                "Enter item price:",
                item.price
            );

            if (newPrice === null) {
                return;
            }

            const price = Number(newPrice);

            if (
                newPrice.trim() === "" ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                alert("Please enter a valid price!");
                return;
            }

            item.name = newName.trim();
            item.price = price;

            saveShoppingList();
            displayShoppingList();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            const confirmed = confirm(
                "Delete " + item.name + "?"
            );

            if (confirmed) {
                shoppingList.splice(index, 1);

                saveShoppingList();
                displayShoppingList();
            }
        });

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        listContainer.appendChild(li);
    });

    updateTotal();
}

function updateTotal() {
    const total = shoppingList.reduce(function(sum, item) {
        return item.purchased
            ? sum + item.price
            : sum;
    }, 0);

    totalCost.textContent = total.toFixed(2);
}

addButton.addEventListener("click", function() {
    const name = itemInput.value.trim();
    const price = Number(priceInput.value);

    if (name === "") {
        alert("Please enter an item name!");
        itemInput.focus();
        return;
    }

    if (
        priceInput.value.trim() === "" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        alert("Please enter a valid, non-negative price!");
        priceInput.focus();
        return;
    }

    shoppingList.push({
        name: name,
        price: price,
        purchased: false
    });

    itemInput.value = "";
    priceInput.value = "";

    saveShoppingList();
    displayShoppingList();
});


const markPurchasedButton =
    document.getElementById("markPurchasedButton");

if (markPurchasedButton) {
    markPurchasedButton.addEventListener("click", function() {
        shoppingList.forEach(function(item) {
            item.purchased = true;
        });

        saveShoppingList();
        displayShoppingList();
    });
}


const clearButton = document.getElementById("clearButton");

if (clearButton) {
    clearButton.addEventListener("click", function() {
        if (shoppingList.length === 0) {
            return;
        }

        const confirmed = confirm(
            "Are you sure you want to clear the shopping list?"
        );

        if (confirmed) {
            shoppingList = [];

            saveShoppingList();
            displayShoppingList();
        }
    });
}
