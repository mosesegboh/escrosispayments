const transferSuccess = ({email, transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Transfer is successful`

    const body = `<p>Hello Client,</p>
    <p>You have successfully added funds to your account.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Date: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Thank You for transacting with us</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

 const transferFailed = ({email, transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Transfer is successful`

    const body = `<p>Hello There!</p>
    <p>Sadly, your addition to wallet transaction failed.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Date: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Kindly try again later</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

module.exports = {transferSuccess, transferFailed}   