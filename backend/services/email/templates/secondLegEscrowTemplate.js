const success = ({transactionId,  amount,  transactionType, transactionDate, details, secondLegTransactionId}) => {
        
    const subject = `Your Escrow transaction Is Now Locked`

    const body = `
    <html>
        <head>
            <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
        </head>
        <body>
            <p>Hello</p>
            <p>This is to notify you that your Escrow transaction is now locked</p>
            <p>Here are the details of you transaction:</p>
            <p><b>Transaction ID: ${transactionId}</b></p>
            <p><b>Amount: ${amount}</b></p>
            <p><b> Second Leg Transaction Id: ${secondLegTransactionId}</b></p>
            <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
            <p><b> Transaction Leg: ${transactionType}</b></p>
            <p><b> Details: ${details}</b></p>
            <p><b> Status:locked</b></p>
            <p><b> Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL}</b> to lock and confirm the transaction.</p>
            <p>Thank you for trusting us, your transaction is in safe hands.</p>
            <p>Warm Regards</p>
        </body>
        <footer>
            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
        </footer>
    </html>`
    
    const params = {
        subject: subject,
        body: body
    }

    return params
}

const failed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Transaction Failed`

    const body = `
    <html>
        <head>
            <img src="../assets/escrosis-logo.png" alt="escrosis_logo">
        </head>
        <body>
            <p>Hello</p>
            <p>This is to notify you that your transaction failed</p>
            <p>Here are the details of you transaction:</p>
            <p><b>Transaction ID: ${transactionId}</b></p>
            <p><b>Amount: ${amount}</b></p>
            <p><b>Transaction Redemption Date: ${transactionType}</b></p>
            <p><b> Transaction Leg: ${transactionDate}</b></p>
            <p><b> Details: ${details}</b></p>
            <p>Kindly try again later</p>
            <p>Warm Regards</p>
            <p><b> Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL}</b> to lock and confirm the transaction.</p>
        </body>
        <footer>
            <p><a href="www.escrosispayments.com">www.escrosispayments.com</a></p>
        </footer>
    </html>`
    
    const params = {
        subject: subject,
        body: body
    }

    return params
}

module.exports = {
    success,
    failed, 
}