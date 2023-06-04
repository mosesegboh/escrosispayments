// const image = require('../assets/escrosis-logo.png')
const successBillPayment = ({email, transactionId,  amount,  transactionType, date, details}) => {
    const subject = `Your Bill Payment Transaction is successful`

    const body =`<html>
                    <head>
                        <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
                    </head>
                    <body>
                        <p>Hello Client,</p>
                        <p>You have successfully added funds to your account.</p>
                        <p>The details of the transaction is below:</p>
                        <p><b>Transaction ID: ${transactionId}</b></p>
                        <p><b>Amount: ${amount}</b></p>
                        <p><b>Transaction Date: ${date}</b></p>
                        <p><b>Transaction Date: ${transactionType}</b></p>
                        <p><b> Details: ${details}</b></p>
                        <p>Thank You for transacting with us</p>
                        <p>Warm Regards</p>
                        <footer>
                            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
                        </footer>
                    </body>
                </html>`
    
    return [subject, body]
}

 const failedBillPayment = ({email, transactionId,  amount,  transactionType, date, details}) => {
    const subject = `Bill Payment Transaction Failed`

    const body =`<html>
                    <head>
                        <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
                    </head>
                    <body>
                        <p>Hello Client,</p>
                        <p>Your airtime purchase has failed.</p>
                        <p>The details of the transaction is below:</p>
                        <p><b>Transaction ID: ${transactionId}</b></p>
                        <p><b>Amount: ${amount}</b></p>
                        <p><b>Transaction Date: ${date}</b></p>
                        <p><b>Transaction Date: ${transactionType}</b></p>
                        <p><b> Details: ${details}</b></p>
                        <p>Thank You for transacting with us</p>
                        <p>Warm Regards</p>
                        <footer>
                            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
                        </footer>
                    </body>
                </html>`
    
    return [subject, body]
}

module.exports = {successBillPayment, failedBillPayment}   