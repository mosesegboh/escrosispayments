const success = ({transactionId,  amount,  transactionType, date, details}) => {
        
    const subject = `You Have Successfully Added Funds to your wallet`

    const body = `<p>Hello There!</p>
    <p>You have successfully added funds to your account.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Type: ${transactionType}</b></p>
    <p><b>Transaction Date: ${date}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Thank You for transacting with us</p>
    <p>Warm Regards</p>`

    const emailDetails = { subject: subject, body: body }

    return emailDetails
}

 const failed = ({transactionId,  amount,  transactionType, date, details}) => {
    const subject = `Your Addition To Wallet Transaction Failed`

    const body = `<p>Hello There!</p>
    <p>Sadly, your addition to wallet transaction failed.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Type: ${transactionType}</b></p>
    <p><b>Transaction Date: ${date}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Kindly try again later</p>
    <p>Warm Regards</p>`

    const emailDetails = { subject: subject, body: body }

    return emailDetails
}

module.exports = {success, failed}