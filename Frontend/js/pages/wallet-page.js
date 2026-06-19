const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = 'user' + email;

const balanceField = document.getElementById('currentBalance');
const history = document.getElementById('transactionHistory');
async function showBalance(){
    const balance = await checkBalance();
    
    if(balance && balance.success){ 
        balanceField.textContent = 'your current balance : ' + balance.data.balance;
        balanceField.style.color = 'green';
    }
    else{
        balanceField.textContent = 'could not fetch the balance :' + balance.data.message;
        balanceField.style.color = 'red';
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
        return showError('please enter the amount first !');
    }
    
    if(amount>100000){
        return showError('Dont be greedy 🙈');
    }
    const res = await depositMoney(amount);

    disableBtn(); // add funds cooldown

    if(res && res.success){
        balanceField.textContent = 'your current balance : ' + res.data.balance;
        balanceField.style.color = 'green';
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
        <p>Amount: ${data.amount}</p>
        <p>Current Balance: ${data.balance}</p>
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
