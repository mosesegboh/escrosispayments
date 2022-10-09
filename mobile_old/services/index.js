// export const BaseUrl = 'http://localhost:8000'
export const BaseUrl = 'http://localhost:8000'

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

