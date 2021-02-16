const Modal = {
  toggle() {
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
}

const Utils = {
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

const transactions = [
  {
  id: 1,
  description: "Luz",
  amount: -50000,
  date: '12/01/21'
  },
  {
  id: 2,
  description: "Website",
  amount: 200000,
  date: '13/01/21'
  },
  {
  id: 1,
  description: "Água",
  amount: -30000,
  date: '13/01/21'
  }
]

const Transaction = {
  all: transactions,
  add(transaction) {
    this.all.push(transaction);

    App.reload();
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
    tr.innerHTML = this.innerHTMLTransaction(transaction);

    this.container.appendChild(tr)
  },
  innerHTMLTransaction(transaction) {
    const { description, amount, date } = transaction;

    const tClass = amount > 0 ? "income" : "expense";

    const formatedAmount = Utils.formatCurrency(amount)

    const html = `
    <td class="description">${description}</td>
    <td class="${tClass}">${formatedAmount}</td>
    <td class="date">${date}</td>
    <td class="button">
      <img src="./assets/minus.svg" alt="apagar transação">
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
  },
  clearTransactions() {
    DOM.container.innerHTML = ""
  }
}

const App = {
  init() {
    Transaction.all.forEach(t => {
      DOM.newTransaction(t)
    })
    
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  }
}

App.init()