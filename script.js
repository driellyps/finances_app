const Modal = {
  toggle() {
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
}

const Utils = {
  formatAmount(value) {
    return Math.round(value * 100)
  },
  formatDate(date){
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""; 

    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value;
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances.transactions")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances.transactions", JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    this.all.push(transaction);

    App.reload();
  },
  remove(index) {
    this.all.splice(index, 1);
    App.reload()
  },
  incomes() {
    let income = 0;
    this.all.forEach(t => {
      if(t.amount > 0) {
        income += t.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0;
    this.all.forEach(t => {
      if(t.amount < 0) {
        expense += t.amount
      }
    })
    return expense
  },
  total() {
    return this.incomes() + this.expenses()
  }
}

const DOM = {
  container: document.querySelector('#data-table tbody'),

  newTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.dataset.index = index;
    tr.innerHTML = this.innerHTMLTransaction(transaction, index);

    this.container.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const { description, amount, date } = transaction;

    const tClass = amount > 0 ? "income" : "expense";

    const formatedAmount = Utils.formatCurrency(amount)

    const html = `
    <td class="description">${description}</td>
    <td class="${tClass}">${formatedAmount}</td>
    <td class="date">${date}</td>
    <td class="button">
      <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="apagar transação">
    </td>`

    return html
  },
  updateBalance() {
    document.getElementById('incomeDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document.getElementById('expensesDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document.getElementById('balanceDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.total())
    Balance.totalBalance()
  },
  clearTransactions() {
    DOM.container.innerHTML = ""
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    }
  },

  validateFields() {
    const { description, amount, date } = this.getValues();

    if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
        throw new Error("Preencha todos os campos")
      }
  },

  formatValues() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }
    
  },

  clearFields() {
    this.description.value = "";
    this.amount.value = "";
    this.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      this.validateFields();
      const transaction = this.formatValues();
      Transaction.add(transaction)

      this.clearFields();
      
      Modal.toggle();
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach((t, index) => {
      DOM.newTransaction(t, index)
    })
    
    DOM.updateBalance();

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  }
}


const Balance = {
  totalBalance() {
    const cardTotal = document.querySelector('.card.total')
    
    Transaction.total() < 0 ? cardTotal.classList.add('negative') : cardTotal.classList.remove('negative');
  
   
  }
}

App.init()

const body = document.querySelector('body')

const Dark = {
  toggle() {
    body.classList.toggle('active')
  }
}