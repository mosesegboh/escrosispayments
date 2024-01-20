const success = ({transactionId,  amount,  status, transactionDate, details}) => {
        
    const subject = `Your Escrow Transaction Has Been Cancelled`

    const body = `
    <html>
        <head>
            <img
                src="${process.env.EMAIL_HEADER_BANNER}" 
                alt="escrosis_logo"
            >
        </head>
        <body>
            <p>Hello Customer,</p>
            <p>This is to notify you that your escrow transaction has been cancelled!</p>
            <p>Here are the details of the transaction:</p>
            <p><b>Transaction ID: ${transactionId}</b></p>
            <p><b>Amount: ${amount}</b></p>
            <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
            <p><b>Transaction Status: ${status}</b></p>
            <p><b>Details: ${details}</b></p>
            <p><b>Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL}</b></p>
            <p>Thank you for trusting us, your transaction is in safe hands.</p>
            <p>Warm Regards</p>
        </body>
        <footer>
            <p><a href="${process.env.SITE_URL}">Escrosis</a></p>
            <img
                src="${process.env.EMAIL_FOOTER_BANNER}" 
                alt="escrosis_logo"
            >
        </footer>
    </html>`

    const params = {
        subject: subject,
        body: body
    }

    return params
}


const failed = ({transactionId,  amount,  status, transactionDate, details}) => {
    const subject = `Your Escrow Transaction Has Failed To Be Cancelled`

    const body = `
        <html>
            <head>
                <img
                    src="${process.env.EMAIL_HEADER_BANNER}" 
                    alt="escrosis_logo"
                >
            </head>
            <body>
                <p>Hello Customer,</p>
                <p>This is to notify you that an escrow transaction failed to be cancelled</p>
                <p>Here are the details of the transaction:</p>
                <p><b>Transaction ID: ${transactionId}</b></p>
                <p><b>Amount: ${amount}</b></p>
                <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
                <p><b> Transaction Status: ${status}</b></p>
                <p><b> Details: ${details}</b></p>
                <p><b> Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL}</b></p>
                <p>Thank you for trusting us, your transaction is in safe hands.</p>
                <p>Warm Regards</p>
            </body>
            <footer>
                <p><a href="${process.env.SITE_URL}">Escrosis</a></p>
                <img
                    src="${process.env.EMAIL_FOOTER_BANNER}" 
                    alt="escrosis_logo"
                >
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