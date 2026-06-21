const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = email;
document.getElementById('checkBalanceBtn').addEventListener('click', async () => {

    const balanceText = document.getElementById('balance');

    balanceText.textContent = 'loading...';

    const balance = await checkBalance();

    setTimeout(() => {
        if (balance && balance.success) {
            balanceText.textContent = 'your current balance : ' + balance.data.balance;
            balanceText.style.color = 'var(--secondry-color)';
        }
        else {
            balanceText.textContent = 'could not fetch the balance :' + balance.data.message;
            balanceText.style.color = 'red';
        }
    }, 1500);


})

const history = async () => {
    const transactions = await transactionHistory();
    showTransactionHistory(transactions.data);
}

history(); // autopopulate the history of transactions in main dashboard

function showTransactionHistory(transaction) {
    const transactionList = document.getElementById('transactionList');

    if (!transaction.transactions || transaction.transactions.length === 0) {
        transactionList.innerHTML = '<h3>No transactions yet !</h3>';
        return;
    }

    transactionList.innerHTML = '';
    transaction = transaction.transactions.toReversed();
    let count = 0;
    transaction.forEach(tx => {
        if (count >= 7) return;

        const dateStr = new Date(tx.date).toLocaleDateString();

        let cardClass, amountPrefix;
        if (tx.type === 'credit') {
            cardClass = 'tx-credit';
            amountPrefix = '+';
        } else if (tx.type === 'debit') {
            cardClass = 'tx-debit';
            amountPrefix = '-';
        } else {
            cardClass = 'tx-deposit';
            amountPrefix = '+';
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="transaction-card ${cardClass}">
                <div class="tx-left">
                    <span class="tx-type">${tx.type}</span>
                    <span class="tx-desc">${tx.description}</span>
                </div>
                <div class="tx-right">
                    <span class="tx-amount">${amountPrefix}${tx.amount}</span>
                    <div class="tx-date">${dateStr}</div>
                </div>
            </div>`;
        transactionList.appendChild(li);
        count++;
    });
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
})