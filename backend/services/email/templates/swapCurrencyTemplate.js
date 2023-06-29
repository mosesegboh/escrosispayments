const swapCurrencySuccess = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
        
    const subject = `Your Swap Currency Operation is Successful`

    const body = `<p>Hello There!</p>
    <p>Your currency has been successfully swapped</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Date: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Thank You for transacting with us</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

 const swapCurrencyFailed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Swap Currency Operation is Failed`

    const body = `<p>Hello There!</p>
    <p>Sadly, your swap currency operation failed.</p>
    <p>The details of the transaction is below:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Date: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Kindly try again later</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

module.exports = {swapCurrencySuccess, swapCurrencyFailed}