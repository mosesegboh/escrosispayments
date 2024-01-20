// export const BaseUrl = 'http://localhost:8000'
// export const BaseUrl = 'http://localhost:3000'
// export const BaseUrl = 'http://10.0.2.2:3000'
export const BaseUrl = 'http://172.20.10.2:3000'
// export const BaseUrl = 'http://192.168.43.190:3000'
export const PaymentsUrl = `${BaseUrl}/payments/get-payment`
export const secondPaymentsUrl = ''
// export const BaseUrl = 'https://boiling-everglades-35416.herokuapp.com'
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X'
export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X'
// export const FLUTTERWAVE_SECRET_KEY = 'FLWSECK-0ac57183f19368ebdcaaa96ffdb490bd-X'
export const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3'
export const FLUTTERWAVE_GET_RATE_URL = 'transfers/rates'
export const FLUTTER_BILL_PAYMENT_URL = 'bills'
export const ADD_TRANSACTION_URL = '/transaction/add-transaction'
export const CARD_BLOCK_STATUS = 'block'
export const CARD_UNBLOCK_STATUS = 'unblock'
export const SERVICE_FEE_TRANSFER = 100
export const AIRTIME_SERVICE_FEE = 100
export const SERVICE_FEE_INT_TRANFER_DOLLAR = 5
export const SERVICE_FEE_BILL_PAYMENT = 100
export const SERVICE_FEE_INT_TRANFER_NAIRA = 100
export const DEFAULT_CURRENCY = 'NGN'
export const WEBSITE_URL = 'www.escrosis.com/contact'
export const TEST_STATUS_SUCCESS = 'success'
export const TEST_STATUS_FAILURE = 'success'
export const NG_PHONE_CODE = '+234'
export const SERVICE_FEE_TITHE = 200
export const MAIN_CURRENCY_BALANCE = 'NGN'
export const PAYMENT_URL =  'http://localhost:3001'
export const USE_TRANSFER =  true
export const USE_INT_TRANSFER =  true
export const USE_SWAP_CURRENCY =  true
export const USE_VIRTUAL_CARD =  true
export const ENABLE_FUNCTION = false
export const MULTIPLE_CURRENCY_LIMIT = 3

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

// export const allCountriesAbbreviations = [   
//     "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", 
//     "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", 
//     "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR",
//     "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "TL", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK",
//     "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU",
//     "GT", "GG", "GN", "GW", "GY", "HT", "HM", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", 
//     "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", 
//     "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", 
//     "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "AN", "NC", "NZ", "NI", "NE", "NG", 
//     "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", 
//     "QA", "CG", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", 
//     "RS", "CS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", 
//     "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", 
//     "VI", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW"
// ]

export const allCountriesAbbreviations = [
    "AE", "AR", "AU", "KI", "NR", "TV", "CA", "CH", "LI", "CZ", "ET", "AD", "AT", "BE", "CY",
    "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "MC", "NL", "PT", "SM",
    "SK", "SI", "ES", "VA", "GB", "GG", "IM", "JE", "GH", "IL", "IN", "JP", "KE", "MA", "EH",
    "MU", "MY", "NG", "NO", "SJ", "NZ", "CK", "NU", "PN", "TK", "PE", "PL", "RU", "RW", "SA",
    "SE", "SG", "SL", "TZ", "UG", "US", "AS", "BQ", "EC", "FM", "GU", "MH", "MP", "PA", "PR",
    "PW", "TL", "TC", "UM", "VG", "VI", "ZW", "CM", "CF", "TD", "CG", "GQ", "GA", "BJ", "BF",
    "CI", "GW", "ML", "NE", "SN", "TG", "ZA", "LS", "NA", "SZ", "ZM", "MW"
  ];

export const countriesAllowedForUsdBrlBalance = [
    "BR", "AE", "AR", "AU", "KI", "NR", "TV", "CA", "CH", "LI", "CZ", "ET", "AD", "AT", "BE",
    "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "MC", "NL", "PT",
    "SM", "SK", "SI", "ES", "VA", "GB", "GG", "IM", "JE", "GH", "IL", "IN", "JP", "KE", "MA",
    "EH", "MU", "MY", "NG", "NO", "SJ", "NZ", "CK", "NU", "PN", "TK", "PE", "PL", "RU", "RW",
    "SA", "SE", "SG", "SL", "TZ", "UG", "US", "AS", "BQ", "EC", "FM", "GU", "MH", "MP", "PA",
    "PR", "PW", "TL", "TC", "UM", "VG", "VI", "ZW", "CM", "CF", "TD", "CG", "GQ", "GA", "BJ",
    "BF", "CI", "GW", "ML", "NE", "SN", "TG", "ZA", "LS", "NA", "SZ", "ZM", "MW"
]

// ip addr show
// 3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
//     link/ether 64:bc:58:4f:63:93 brd ff:ff:ff:ff:ff:ff
//     inet 172.20.10.3/28 brd 172.20.10.15 scope global dynamic noprefixroute wlp0s20f3
//        valid_lft 59259sec preferred_lft 59259sec
//     inet6 fe80::48cd:c49f:d67f:c795/64 scope link noprefixroute 
//        valid_lft forever preferred_lft forever


const countriesAllowedForCzkEtbTzsZarBalance = [
    "AE", "AR", "AU", "KI", "NR", "TV", "CA", "CH", "LI", "CZ", "ET", "AD", "AT", "BE", "CY",
    "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "MC", "NL", "PT", "SM",
    "SK", "SI", "ES", "VA", "GB", "GG", "IM", "JE", "GH", "IL", "IN", "JP", "KE", "MA", "EH",
    "MU", "MY", "NG", "NO", "SJ", "NZ", "CK", "NU", "PN", "TK", "PE", "PL", "RU", "RW", "SA",
    "SE", "SG", "SL", "TZ", "UG", "US", "AS", "BQ", "EC", "FM", "GU", "MH", "MP", "PA", "PR",
    "PW", "TL", "TC", "UM", "VG", "VI", "ZW", "CM", "CF", "TD", "CG", "GQ", "GA", "BJ", "BF",
    "CI", "GW", "ML", "NE", "SN", "TG", "ZA", "LS", "NA", "SZ", "ZM", "MW"
  ];
  
  
  
  


export const allowedAfricanCountries = [
    'NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'
]

export const allowedInternationalCurrencies = [
    'AED', 'ARS', 'AUD', 'CAD', 'CHF',
    'CZK', 'ETB', 'EUR', 'GBP', 'GHS',
    'ILS', 'INR', 'JPY', 'KES', 'MAD', 
    'MUR', 'MYR', 'NGN', 'NOK', 'NZD',
    'PEN', 'PLN', 'RUB', 'RWF', 'SAR',
    'SEK', 'SGD', 'SLL', 'TZS', 'UGX',
    'USD', 'XAF', 'XOF', 'ZAR', 'ZMK',
    'ZMW', 'MWK'
]

export const getCountryCurrency = (countries, currency, returnValue) => {
    // console.log(currency,returnValue, '--function')
    if (returnValue == "currency") {
        for (const [country, curr] of Object.entries(countries)) {
            if (curr === currency) {
              return currency;
            }
          }
          return null;
    }

    if (returnValue == "country") {
        for (const country in countries) {
            if (countries[country] === currency) {
                return country;
            }
        }
        return null; 
    }
}

// export const getCountryOfCurrency = (countries, currency) => {
//     for (const country in countries) {
//         if (countries[country] === currency) {
//             return country;
//         }
//     }
//     return null; // Currency not found in the countries object
// };

// export const countriesAndCurrencies = {
//     "AF" : "AFN",
//     "AX" : "EUR",
//     "AL" : "ALL",
//     "DZ" : "DZD",
//     "AS" : "USD",
//     "AD" : "EUR",
//     "AO" : "AOA",
//     "AI" : "XCD",
//     "AQ" : "USD",
//     "AG" : "XCD",
//     "AR" : "ARS",
//     "AM" : "AMD",
//     "AW" : "AWG",
//     "AC" : "SHP",
//     "AU" : "AUD",
//     "AT" : "EUR",
//     "AZ" : "AZN",
//     "BS" : "BSD",
//     "BH" : "BHD",
//     "BD" : "BDT",
//     "BB" : "BBD",
//     "BY" : "BYN",
//     "BE" : "EUR",
//     "BZ" : "BZD",
//     "BJ" : "XOF",
//     "BM" : "BMD",
//     "BT" : "INR",
//     "BO" : "BOB",
//     "BA" : "BAM",
//     "BW" : "BWP",
//     "BV" : "NOK",
//     "BR" : "BRL",
//     "IO" : "USD",
//     "VG" : "USD",
//     "BN" : "BND",
//     "BG" : "BGN",
//     "BF" : "XOF",
//     "BI" : "BIF",
//     "KH" : "KHR",
//     "CM" : "XAF",
//     "CA" : "CAD",
//     "IC" : "EUR",
//     "CV" : "CVE",
//     "KY" : "KYD",
//     "CF" : "XAF",
//     "TD" : "XAF",
//     "CL" : "CLP",
//     "CN" : "CNY",
//     "CX" : "AUD",
//     "CC" : "AUD",
//     "CO" : "COP",
//     "KM" : "KMF",
//     "CG" : "XAF",
//     "CD" : "CDF",
//     "CK" : "NZD",
//     "CR" : "CRC",
//     "CI" : "XOF",
//     "HR" : "HRK",
//     "CU" : "CUP",
//     "CW" : "ANG",
//     "CY" : "EUR",
//     "CZ" : "CZK",
//     "DK" : "DKK",
//     "DJ" : "DJF",
//     "DM" : "XCD",
//     "DO" : "DOP",
//     "TL" : "IDR",
//     "EC" : "USD",
//     "EG" : "EGP",
//     "SV" : "SVC",
//     "GQ" : "XAF",
//     "ER" : "ERN",
//     'EE' : 'EUR',
//     'ET' : 'ETB',
//     'FK' : 'FKP',
//     'FO' : 'DKK',
//     'FJ' : 'FJD',
//     'FI' : 'EUR',
//     'FR' : 'EUR',
//     'GF' : 'EUR',
//     'PF' : 'XPF',
//     'TF' : 'EUR',
//     'GA' : 'XAF',
//     'GM' : 'GMD',
//     'GE' : 'GEL',
//     'DE' : 'EUR',
//     'GH' : 'GHS',
//     'GI' : 'GIP',
//     'GR' : 'EUR',
//     'GL' : 'DKK',
//     'GD' : 'XCD',
//     'GP' : 'EUR',
//     'GU' : 'USD',
//     'GT' : 'GTQ',
//     'GG' : 'GBP',
//     'GN' : 'GNF',
//     'GW' : 'XOF',
//     'GY' : 'GYD',
//     'HT' : 'HTG',
//     'HM' : 'AUD',
//     'HN' : 'HNL',
//     'HK' : 'HKD',
//     'HU' : 'HUF',
//     'IS' : 'ISK',
//     'IN' : 'INR',
//     'ID' : 'IDR',
//     'IR' : 'IRR',
//     'IQ' : 'IQD',
//     'IE' : 'EUR',
//     'IM' : 'GBP',
//     'IL' : 'ILS',
//     'IT' : 'EUR',
//     'JM' : 'JMD',
//     'JP' : 'JPY',
//     'JE' : 'GBP',
//     'JO' : 'JOD',
//     'KZ' : 'KZT',
//     'KE' : 'KES',
//     'KI' : 'AUD',
//     'XK' : 'EUR',
//     'KW' : 'KWD',
//     'KG' : 'KGS',
//     'LA' : 'LAK',
//     'LV' : 'EUR',
//     'LB' : 'LBP',
//     'LS' : 'LSL',
//     'LR' : 'LRD',
//     'LY' : 'LYD',
//     'LI' : 'CHF',
//     'LT' : 'EUR',
//     'LU' : 'EUR',
//     'MO' : 'MOP',
//     'MK' : 'MKD',
//     'MG' : 'MGA',
//     'MW' : 'MWK',
//     'MY' : 'MYR',
//     'MV' : 'MVR',
//     'ML' : 'XOF',
//     'MT' : 'EUR',
//     'MH' : 'USD',
//     'MQ' : 'EUR',
//     'MR' : 'MRU',
//     'MU' : 'MUR',
//     'YT' : 'EUR',
//     'MX' : 'MXN',
//     'FM' : 'USD',
//     'MD' : 'MDL',
//     'MC' : 'EUR',
//     'MN' : 'MNT',
//     'ME' : 'EUR',
//     'MS' : 'XCD',
//     'MA' : 'MAD',
//     'MZ' : 'MZN',
//     'MM' : 'MMK',
//     'NA' : 'NAD',
//     'NR' : 'AUD',
//     'NP' : 'NPR',
//     'NL' : 'EUR',
//     'AN' : 'ANG',
//     'NC' : 'XPF',
//     'NZ' : 'NZD',
//     'NI' : 'NIO',
//     'NE' : 'XOF',
//     'NG' : 'NGN',
//     'NU' : 'NZD',
//     'NF' : 'AUD',
//     'KP' : 'KPW',
//     'MP' : 'USD',
//     'NO' : 'NOK',
//     'OM' : 'OMR',
//     'PK' : 'PKR',
//     'PW' : 'USD',
//     'PS' : 'JOD',
//     'PA' : 'PAB',
//     'PG' : 'PGK',
//     'PY' : 'PYG',
//     'PE' : 'PEN',
//     'PH' : 'PHP',
//     'PN' : 'NZD',
//     'PL' : 'PLN',
//     'PT' : 'EUR',
//     'PR' : 'USD',
//     'QA' : 'QAR',
//     'RE' : 'EUR',
//     'RO' : 'RON',
//     'RU' : 'RUB',
//     'RW' : 'RWF',
//     'BL' : 'EUR',
//     'SH' : 'GBP',
//     'KN' : 'XCD',
//     'LC' : 'XCD',
//     'MF' : 'EUR',
//     'PM' : 'EUR',
//     'VC' : 'XCD',
//     'WS' : 'WST',
//     'SM' : 'EUR',
//     'ST' : 'STN',
//     'SA' : 'SAR',
//     'SN' : 'XOF',
//     'RS' : 'RSD',
//     'CS' : 'RSD',
//     'SC' : 'SCR',
//     'SL' : 'SLL',
//     'SG' : 'SGD',
//     'SX' : 'ANG',
//     'SK' : 'EUR',
//     'SI' : 'EUR',
//     'SB' : 'SBD',
//     'SO' : 'SOS',
//     'ZA' : 'ZAR',
//     'GS' : 'GBP',
//     'KR' : 'KRW',
//     'SS' : 'SSP',
//     'ES' : 'EUR',
//     'LK' : 'LKR',
//     'SD' : 'SDG',
//     'SR' : 'SRD',
//     'SJ' : 'NOK',
//     'SZ' : 'SZL',
//     'SE' : 'SEK',
//     'CH' : 'CHF',
//     'SY' : 'SYP',
//     'TW' : 'TWD',
//     'TJ' : 'TJS',
//     'TZ' : 'TZS',
//     'TH' : 'THB',
//     'TG' : 'XOF',
//     'TK' : 'NZD',
//     'TO' : 'TOP', 
//     'TT' : 'TTD',
//     'TA' : 'SHP',
//     'TN' : 'TND',
//     'TR' : 'TRY',
//     'TM' : 'TMT',
//     'TC' : 'USD',
//     'TV' : 'AUD',
//     'UM' : 'USD',
//     'VI' : 'USD',
//     'UG' : 'UGX',
//     'UA' : 'UAH',
//     'AE' : 'AED',
//     'GB' : 'GBP',
//     'US' : 'USD',
//     'UY' : 'UYU',
//     'UZ' : 'UZS',
//     'VU' : 'VUV',
//     'VA' : 'EUR',
//     'VE' : 'VES',
//     'VN' : 'VND',
//     'WF' : 'XPF',
//     'EH' : 'MAD',
//     'YE' : 'YER',
//     'ZM' : 'ZMW',
//     'ZW' : 'ZWL'    
// }

export const countriesAndCurrencies = {
    "AR" : "ARS",
    "AU" : "AUD",
    "BE" : "EUR",
    "BG" : "BGN",
    "CA" : "CAD",
    "CN" : "CNY",
    "HR" : "HRK",
    "CZ" : "CZK",
    "DK" : "DKK",
    "EE" : "EUR",
    "FI" : "EUR",
    "FR" : "EUR",
    "DE" : "EUR",
    "GR" : "EUR",
    "HK" : "HKD",
    "HU" : "HUF",
    "IS" : "ISK",
    "IN" : "INR",
    "ID" : "IDR",
    "IE" : "EUR",
    "IL" : "ILS",
    "IT" : "EUR",
    "JP" : "JPY",
    "LV" : "EUR",
    "LT" : "EUR",
    "LU" : "EUR",
    "MY" : "MYR",
    "MX" : "MXN",
    "NL" : "EUR",
    "NZ" : "NZD",
    "NO" : "NOK",
    "PH" : "PHP",
    "PL" : "PLN",
    "PT" : "EUR",
    "RO" : "RON",
    "RU" : "RUB",
    "SG" : "SGD",
    "SK" : "EUR",
    "SI" : "EUR",
    "ZA" : "ZAR",
    "KR" : "KRW",
    "ES" : "EUR",
    "SE" : "SEK",
    "CH" : "CHF",
    "TW" : "TWD",
    "TH" : "THB",
    "TR" : "TRY",
    "GB" : "GBP",
    "US" : "USD",
    "VN" : "VND",
    "GH" : "GHS",
    "UG" : "UGX",
    "TZ" : "TZS",
    "ZM" : "ZMW",
    "KE" : "KES",
    "NG" : "NGN",
};

