document.getElementById('registerBtn').addEventListener('click',async ()=>{
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if(!name || !email || !password || !phone || !address){
        return alert('all fields are required');
    }

    const res = await register(name,email,password,phone,address); // fields from the user

    if(res && res.success){
        sessionStorage.setItem('otpEmail',email);  // storing userEmail in session storage to further verify the otp
        window.location.href = './verify-otp.html';
    }
    else{
        alert('error: ' + res.data.message);
    }
});