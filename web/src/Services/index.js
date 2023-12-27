// export const BaseUrl = 'http://localhost:8000'
// export const BaseUrl = 'http://localhost:3000'

// export const BaseUrl = 'http://10.0.2.2:3000'
export const BaseUrl = 'http://172.20.10.3:3000'
// export const BaseUrl = 'https://boiling-everglades-35416.herokuapp.com'
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X'
export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X'
// export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK-0ac57183f19368ebdcaaa96ffdb490bd-X'
export const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3'

export const PROCESS_PAYMENTS_URL = '/payments/get-payment-data'

export const  DEFAULT_CURRENCY = 'NGN'

export function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}