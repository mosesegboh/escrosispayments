const virtualCardFundTransactionSuccess = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
        
    const subject = `You Have Successfully Added Funds to your Virtual Card`

    const body = `<p>Hello There!</p>
    <p>You have successfully added funds to your virtualCard.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Date: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Thank You for transacting with us</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

 const virtualCardFundTransactionFailed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Addition To Virtual Card Transaction Failed`

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

module.exports = {virtualCardFundTransactionSuccess, virtualCardFundTransactionFailed}