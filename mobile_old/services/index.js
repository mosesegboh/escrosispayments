// export const BaseUrl = 'http://localhost:8000'
export const BaseUrl = 'http://localhost:8000'
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X'
export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X'

async function wrapper(response) {
    const result = await response.json();
    return result
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

export function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function trimString(string, length) {
    return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
};

