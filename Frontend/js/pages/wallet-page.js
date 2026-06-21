const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmailNav').textContent = email;

const balanceField = document.getElementById('currentBalance');
const history = document.getElementById('transactionHistory');
async function showBalance(){
    const balance = await checkBalance();
    
    if(balance && balance.success){ 
        balanceField.textContent = 'GC ' + balance.data.balance;
    }
    else{
        balanceField.textContent = 'Error';
    }
}
showBalance();

async function showTransaction(){
    const transactions = await transactionHistory();
    const sortedHistory = transactions.data.transactions.toReversed();
    showTransactionHistory(sortedHistory);
}

showTransaction();

function showTransactionHistory(transaction){
    history.innerHTML =''

    if (!transaction || transaction.length === 0) {
        history.innerHTML = '<p class="text-center mt-3">No transactions found.</p>';
        return;
    }

    transaction.forEach((tx)=>{

        const dateStr = new Date(tx.date).toLocaleString();
        let cardClass, amountPrefix;

        if(tx.type === 'credit'){
            cardClass = 'tx-credit';
            amountPrefix = '+';
        }
        else if(tx.type === 'debit'){
            cardClass = 'tx-debit';
            amountPrefix = '-';
        }
        else{
            cardClass = 'tx-deposit';
            amountPrefix = '+';
        }
        
        history.innerHTML +=`
            <div class="transaction-card ${cardClass}">
                <div class="tx-left">
                    <span class="tx-type">${tx.type}</span>
                    <span class="tx-desc">${tx.description || 'Transaction'}</span>
                </div>
                <div class="tx-right">
                    <span class="tx-amount">${amountPrefix}GC ${tx.amount}</span>
                    <div class="tx-date">${dateStr}</div>
                </div>
            </div>`;
    });
}

document.getElementById('addFundsBtn').addEventListener('click',async ()=>{
    const amount = document.getElementById('amount').value.trim();
    if(!amount){
        return showError('please enter the amount first !');
    }
    
    if(amount>100000){
        return showError('Dont be greedy 🙈');
    }
    const res = await depositMoney(amount);

    disableBtn(); // add funds cooldown

    if(res && res.success){
        balanceField.textContent = 'GC ' + res.data.balance;
    }

    showSlip(res.data);
    showTransaction();
    showBalance();
    document.getElementById('amount').value = '';
})

function disableBtn(){
    document.getElementById('addFundsBtn').disabled = true;
    setTimeout(()=>{
        document.getElementById('addFundsBtn').disabled = false;
    }, 30000);
}


function showError(message){ // show error message in popup
    const slip = document.getElementById('transactionModal');
    document.getElementById('modalContent').classList.add('error');
    document.getElementById('modalDetails').innerHTML = `
        <h3 style="color: rgba(149, 18, 18, 1);">Transaction Failed</h3>
        <p>Error: ${message}</p>
    `
    slip.style.display = 'block';

    const closeBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        slip.style.display = 'none';
        document.getElementById('modalContent').classList.remove('error');
    });

}

function showSlip(data){

    const slip = document.getElementById('transactionModal');

    document.getElementById('modalContent').classList.add('success');
    document.getElementById('modalDetails').innerHTML = `
        <h3 style="color: rgba(3, 118, 53, 1);">Transaction Successful</h3>
        <p>Amount: GC ${data.amount}</p>
        <p>Current Balance: GC ${data.balance}</p>
        <p>Description: Self deposit</p>
        <p>Transaction Reference: ${data.txnRef}</p>
    `
    slip.style.display = 'block';

    const closeBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        slip.style.display = 'none';
        document.getElementById('modalContent').classList.remove('success');

    });
}
