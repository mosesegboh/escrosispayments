// const image = require('../assets/escrosis-logo.png')
const success = ({email, transactionId,  amount,  transactionType, date, details}) => {
    const subject = `Your Bill Payment Transaction is successful`

    const body =`<html>
                    <head>
                        <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
                    </head>
                    <body>
                        <p>Hello Client,</p>
                        <p>You have successfully made a bill payment.</p>
                        <p>The details of the transaction is below:</p>
                        <p><b>Transaction ID: ${transactionId}</b></p>
                        <p><b>Amount: ${amount}</b></p>
                        <p><b>Transaction Date: ${date}</b></p>
                        <p><b>Transaction Type: ${transactionType}</b></p>
                        <p><b> Details: ${details}</b></p>
                        <p>Thank You for transacting with us</p>
                        <p>Warm Regards</p>
                        <footer>
                            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
                        </footer>
                    </body>
                </html>`
    
    const emailDetails = { subject: subject, body: body }

    return emailDetails
}

 const failed = ({email, transactionId,  amount,  transactionType, date, details}) => {
    const subject = `Bill Payment Transaction Failed`

    const body =`<html>
                    <head>
                        <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
                    </head>
                    <body>
                        <p>Hello Client,</p>
                        <p>Your bill payment has failed.</p>
                        <p>The details of the transaction is below:</p>
                        <p><b>Transaction ID: ${transactionId}</b></p>
                        <p><b>Amount: ${amount}</b></p>
                        <p><b>Transaction Date: ${date}</b></p>
                        <p><b>Transaction Type: ${transactionType}</b></p>
                        <p><b> Details: ${details}</b></p>
                        <p>Thank You for transacting with us</p>
                        <p>Warm Regards</p>
                        <footer>
                            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
                        </footer>
                    </body>
                </html>`
    
    const emailDetails = { subject: subject, body: body }

    return emailDetails
}

module.exports = {success, failed}