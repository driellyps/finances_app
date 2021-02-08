const Modal = {
  toggle() {
    document.querySelector('.modal-overlay').classList.toggle('active');
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
  incomes() {

  },
  expenses() {},
  total() {}
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

    const tClass = amount > 0 ? "income" : "expense"

    const html = `
    <td class="description">${description}</td>
    <td class="${tClass}">${amount}</td>
    <td class="date">${date}</td>
    <td class="button">
      <img src="./assets/minus.svg" alt="apagar transação">
    </td>`

    return html
  }
}

transactions.forEach(t => {
  DOM.newTransaction(t)
})