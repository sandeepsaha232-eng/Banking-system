const BASE_URL = 'http://127.0.0.1:3000/api';

// central API request : all the request will be sent through this API

async function request(path, options = {}) { // path will specify the url and options will specify the data to be sent to the backend
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            headers: { 
                'Content-Type': 'application/json'
             },
            credentials: 'include', // sends the cookies : by default cookies are not sent
            ...options, // other data coming from frontend that has to be sent to the Backend
        });

        const data = await res.json();

        if (res.status === 401) { // if there is any error fallback to login page
            console.log(res);
            sessionStorage.clear();
            // window.location.href = './login.html';
            return;
        }

        return { success: res.ok, status: res.status, data }; // if everything is okay return the data to the caller method of respective page

    } catch (err) {
        return { success: false, data: { message: 'error occured ' + err.message } };
    }
}

// while linking scripts make sure to first add api.js first as it has to be available first for every api
