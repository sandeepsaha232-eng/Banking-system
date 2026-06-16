// all the authentication api will be passed from here

/*  
    All the core authentication APIs are written here,

    these functions will be called from the respective functions of the
    features present in the pages folder.

    Here the main central API method will be called by sending the necessary fields
*/

// for registeration
async function register(name,email,password,phone,address){ // this will be called from register.js

    return request('/auth/signup',{ // over here we have called requesr method of API.js and directly returning the data returned by the backend
        method: 'POST',
        body: JSON.stringify({name,email,password,phone,address}) // sending necessaryu fields
    });

}

// the above process is happening for all the api calls

//for otpVerification
async function verifyOtp(otp,email){

    return request('/auth/otp',{
        method: 'POST',
        body: JSON.stringify({otp,email})
    });

}

// for login
async function login(email,password){
    
    return request('/auth/login',{
        method : 'POST',
        body : JSON.stringify({email,password})
    });
}
