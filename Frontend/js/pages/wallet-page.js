const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = 'user' + email;

const balanceField = document.getElementById('currentBalance');
const history = document.getElementById('transactionHistory');
(async function showBalance(){
    const balance = await checkBalance();
    
    if(balance && balance.success){ 
        balanceField.textContent = 'your current balance : ' + balance.data.balance;
        balanceField.style.color = 'green';
    }
    else{
        balanceField.textContent = 'could not fetch the balance :' + balance.data.message;
        balanceField.style.color = 'red';
    }
})()

async function showTransaction(){
    const transactions = await transactionHistory();
    const sortedHistory = transactions.data.transactions.toReversed();
    showTransactionHistory(sortedHistory);
}

showTransaction();

function showTransactionHistory(transaction){
    history.innerHTML =''

    transaction.forEach((tx)=>{

        tx.date = new Date(tx.date).toLocaleString();

        if(tx.type === 'credit'){
            history.innerHTML +=`<div class="transaction-card credit">
                <p>Type: <span style = "color:green">${tx.type}</span></p>
                <p>Amount: <span style = "color:green">${tx.amount}</span</p>
                <p>Date: ${tx.date}</p>
            </div>`
        }
        else if(tx.type === 'debit'){
            history.innerHTML +=`<div class="transaction-card debit">
                <p>Type: <span style = "color:red">${tx.type}</span></p>
                <p>Amount: <span style = "color:red">${tx.amount}</span</p>
                <p>Date: ${tx.date}</p>
            </div>`
        }
        else{
            history.innerHTML +=`<div class="transaction-card deposit">
                <p>Type: <span style = "color:blue">${tx.type}</span></p>
                <p>Amount: <span style = "color:blue">${tx.amount}</span</p>
                <p>Date: ${tx.date}</p>
            </div>`
        }
    })

}

document.getElementById('addFundsBtn').addEventListener('click',async ()=>{
    const amount = document.getElementById('amount').value.trim();

    if(!amount){
        return alert('please enter the amount first !');
    }

    const res = await depositMoney(amount);

    if(res && res.success){
        balanceField.textContent = 'your current balance : ' + res.data.balance;
        balanceField.style.color = 'green';
    }

    showTransaction();
})
