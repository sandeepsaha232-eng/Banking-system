// all the utilities api will be written here


// check balance
async function checkBalance(){
    return request('/wallet/balance',{
        method : 'GET',
    });
}

//sending money
async function sendMoney(receiverEmail,amount,note){
    return request('/transaction/send',{
        method : 'POST',
        body : JSON.stringify({receiverEmail,amount,note})
    });
}

//deposit money
async function depositMoney(amount) {
    
    return request('/wallet/topup',{
        method : 'POST',
        body : JSON.stringify({amount})
    })
}

//get transactions history
async function transactionHistory(){
    return request('/transaction/history',{
        method : 'GET'
    })

}


// for logout
// clears the cookie on server, clears localStorage on user side
async function logout(){

    await request('/auth/logout',{ // request sent to clear cookie from server
        method : 'POST',
    })

    sessionStorage.clear(); // clears the cookie from the session storage
    window.location.href = './login.html' 
}