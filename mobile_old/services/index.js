// export const BaseUrl = 'http://localhost:8000'
// export const BaseUrl = 'http://localhost:3000'
export const BaseUrl = 'http://10.0.2.2:3000'
// export const BaseUrl = 'https://boiling-everglades-35416.herokuapp.com'
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X'
export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X'
// export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK-0ac57183f19368ebdcaaa96ffdb490bd-X'
export const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3'
export const FLUTTERWAVE_GET_RATE_URL = 'transfers/rates'
export const FLUTTER_BILL_PAYMENT_URL = 'bills'
export const ADD_TRANSACTION_URL = '/transaction/add-transaction'

async function wrapper(response) {
    const result = await response.json();
    return result
}

export function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function trimString(string, length) {
    if(string){
        return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
    } 
};

export function getRandom(length) {
    return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    );
}

export async function getTransactions() {
    const response = await fetch(`${BaseUrl}/transactions/read`,{
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
    const result = await response.json();
    return result
}

export async function handleBillPayment(data, flutterApiEndpoint, addTransactionEndpoint, appData ){
    response = await fetch(`${FLUTTERWAVE_API_URL}/${flutterApiEndpoint}`,{
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        }, 
        body: JSON.stringify(data)
    })

    const result = response.data
    const { status, message} = result;

    if (status === 'success') {
        response = await fetch(`${BaseUrl}/${addTransactionEndpoint}`,{
            method:'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            }, 
            body: JSON.stringify(appData)
        })
    
        const appResult = response.data
        return {result, appResult}
    }else{
        return 'failed'
    }  
}

