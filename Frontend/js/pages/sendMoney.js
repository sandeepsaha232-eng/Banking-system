document.getElementById('sendBtn').addEventListener('click', async () => {

    const receiverEmail = document.getElementById('receiverEmail').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const note = document.getElementById('note').value.trim();


    if(!receiverEmail || !amount){
        showError("Please fill all the required fields.");
        return;
    }

    const response = await sendMoney(receiverEmail, amount, note);
    
    if(response && response.data.success){
        showSlip(response.data);
    }
    else{
        showError(response.data.message)
    }
});

function showError(message){ // show error message in popup
    const slip = document.getElementById('transactionModal');
    document.getElementById('modalContent').classList.add('error');
    document.getElementById('modalDetails').innerHTML = `
        <h3>Transaction Failed</h3>
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
    console.log(slip);
    document.getElementById('modalContent').classList.add('success');
    document.getElementById('modalDetails').innerHTML = `
        <h3>Transaction Successful</h3>
        <p>Amount: ${data.amount}</p>
        <p>Receiver: ${data.receiverEmail}</p>
        <p>Description: ${data.description}</p>
        <p>Transaction Reference: ${data.txnRef}</p>
    `
    slip.style.display = 'block';

    const closeBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        slip.style.display = 'none';
        document.getElementById('modalContent').classList.remove('success');

    });
}
