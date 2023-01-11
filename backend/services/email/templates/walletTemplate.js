const walletTransactionSuccess = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
        
    const subject = `You Have Successfully Added Funds to your wallet`

    const body = `<p>Hello There!</p>
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

 const walletTransactionFailed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Addition To Wallet Transaction Failed`

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

module.exports = {walletTransactionSuccess, walletTransactionFailed}