const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = email;
document.getElementById('checkBalanceBtn').addEventListener('click', async () =>{

    const balanceText = document.getElementById('balance');

    balanceText.textContent = 'loading...';

    const balance = await checkBalance();

    setTimeout(()=>{
        if(balance && balance.success){ 
            balanceText.textContent = 'your current balance : ' + balance.data.balance;
            balanceText.style.color = 'green';
        }
        else{
            balanceText.textContent = 'could not fetch the balance :' + balance.data.message;
            balanceText.style.color = 'red';
        }
    },1500);

    
})

const history = async () => {
    const transactions = await transactionHistory();
    showTransactionHistory(transactions.data);
}

history(); // autopopulate the history of transactions in main dashboard

function showTransactionHistory(transaction) {

    if (!transaction.transactions || transaction.transactions.length === 0) {
        transactionList.innerHTML = '<h3>No transactions yet !</h3>';
        return;
    }
    const transactionList = document.getElementById('transactionList');

    transactionList.innerHTML = '';
    transaction = transaction.transactions.toReversed();
    let count = 0;
    transaction.forEach(tx => {
        if(count >= 7) return; // fix no of transaction history on dashboard
        const li = document.createElement('li');
        li.innerHTML = `Amount: ${tx.amount}, Status: ${tx.type}, note: ${tx.description} <br><br>`;
        transactionList.appendChild(li);
        count++;
    });
}

document.getElementById('logoutBtn').addEventListener('click', async ()=>{
    await logout();
})