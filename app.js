//budget_controller
var budgetController = (function(id, description, value) {
  var Expense = function() {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function() {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate the budget: income - expensessss
      data.budget = data.totals.inc - data.totals.exp;
      //cal percentage of income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//UI_controller
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc 0r exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      //create HTML string with placeholder tag
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace placeholder tags
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    // deleteListItem = function(selectorID){

    // },
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudgget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =obj.totalExp;
      if(obj.percentage>0){
        document.querySelector(DOMstrings.percentageLabel).textContent =obj.percentage + '%';
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//global_module_controller
var controller = (function(budgetContrlr, UIContrl) {
  var eventLisetener = function() {
    var DOM = UIContrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  var updateBudget = function() {
    budgetContrlr.calculateBudget();
    //returns the budget
    var budget = budgetContrlr.getBudget();
    //display the buddget
    UIContrl.displayBudgget(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    input = UIContrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = budgetContrlr.addItem(
        input.type,
        input.description,
        input.value
      );

      UIContrl.addListItem(newItem, input.type);

      UIContrl.clearFields();

      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("ok tested");
      UIContrl.displayBudgget( {
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      }
      );
      eventLisetener();
    }
  };
})(budgetController, UIController);
controller.init();
//back at 1aug
