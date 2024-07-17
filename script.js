let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const refreshButton = document.getElementById("refresh-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const expenditurePercentage = document.getElementById("expenditure-percentage");
const balancePercentage = document.getElementById("balance-percentage");
const list = document.getElementById("list");
let tempAmount = 0;

// Set budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = parseFloat(totalAmount.value);
  // empty or negative input
  if (isNaN(tempAmount) || tempAmount <= 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set Budget
    amount.innerHTML = tempAmount.toFixed(2);
    // Set Balance
    balanceValue.innerText = (tempAmount - parseFloat(expenditureValue.innerText)).toFixed(2);
    // Clear Input Box
    totalAmount.value = "";
    // Update percentages and pie chart
    updatePercentages();
    updatePieChart();
  }
});

// Function to disable edit and delete button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function to modify list elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = parseFloat(balanceValue.innerText);
  let currentExpense = parseFloat(expenditureValue.innerText);
  let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText);
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = (currentBalance + parentAmount).toFixed(2);
  expenditureValue.innerText = (currentExpense - parentAmount).toFixed(2);
  parentDiv.remove();
  // Update percentages and pie chart
  updatePercentages();
  updatePieChart();
};

// Function to create list
const listCreator = (expenseName, expenseValue) => {
  let subListContent = document.createElement("div");
  subListContent.classList.add("sublist-content", "flex-space");
  list.appendChild(subListContent);
  subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue.toFixed(2)}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "24px";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "24px";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  subListContent.appendChild(editButton);
  subListContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(subListContent);
  // Update percentages and pie chart
  updatePercentages();
  updatePieChart();
};

// Function to add expenses
checkAmountButton.addEventListener("click", () => {
  // Empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  // Enable buttons
  disableButtons(false);
  // Expense
  let expenditure = parseFloat(userAmount.value);
  // Total expense (existing + new)
  let sum = parseFloat(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum.toFixed(2);
  // Total balance(budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance.toFixed(2);
  // Create list
  listCreator(productTitle.value, expenditure);
  // Empty inputs
  productTitle.value = "";
  userAmount.value = "";
});

// Refresh the page
refreshButton.addEventListener("click", () => {
  location.reload();
});

// Chart.js for pie chart
const ctx = document.getElementById('pie-chart').getContext('2d');
let pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Balance', 'Expenditure'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#4CAF50', '#F44336'],
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  }
});

// Update the pie chart data
const updatePieChart = () => {
  pieChart.data.datasets[0].data[0] = parseFloat(balanceValue.innerText);
  pieChart.data.datasets[0].data[1] = parseFloat(expenditureValue.innerText);
  pieChart.update();
};

// Update percentages
const updatePercentages = () => {
  const totalBudget = parseFloat(amount.innerText);
  const expenditure = parseFloat(expenditureValue.innerText);
  const balance = parseFloat(balanceValue.innerText);

  if (totalBudget > 0) {
    expenditurePercentage.innerText = ((expenditure / totalBudget) * 100).toFixed(2) + "%";
    balancePercentage.innerText = ((balance / totalBudget) * 100).toFixed(2) + "%";
  } else {
    expenditurePercentage.innerText = "0%";
    balancePercentage.innerText = "0%";
  }
};
