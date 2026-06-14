if(sessionStorage.getItem('userEmail')){
    document.getElementById('email').value = sessionStorage.getItem('userEmail');
}

document.getElementById('loginBtn').addEventListener('click', async ()=>{

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!email || !password){
        return alert('all fields are required');
    }

    const res = await login(email,password);

    if(res && res.success){
        sessionStorage.setItem('userEmail',email);
        window.location.href = './dashboard.html';
    }
    else{
        alert('error : ' + res.data.message);
    }
})