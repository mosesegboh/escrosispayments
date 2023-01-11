const firstLegTransactionSuccess = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
        
    const subject = `Your transaction was successfully Added`

    const body = `<p>Hello</p><p>This is to notify you that your transaction has been completed</p>
    <p>Here are the details of you transaction:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Redemption Date: ${transactionType}</b></p>
    <p><b> Transaction Leg: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Thank you for trusting us, your transaction is in safe hands.</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

 const firstLegTransactionFailed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Transaction Failed`

    const body = `<p>Hello</p><p>This is to notify you that your transaction failed</p>
    <p>Here are the details of you transaction:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Redemption Date: ${transactionType}</b></p>
    <p><b> Transaction Leg: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Kindly try again later</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

const secondLegTransactionSuccess = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
        
    const subject = `Your transaction Is Now Locked`

    const body = `<p>Hello</p><p>This is to notify you that your transaction has been locked</p>
    <p>Here are the details of you transaction:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b> Second Leg Transaction Id: ${secondLegTransactionId}</b></p>
    <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
    <p><b> Transaction Leg: ${transactionType}</b></p>
    <p><b> Details: ${details}</b></p>
    <p><b> Status:locked</b></p>
    <p>Thank you for trusting us, your transaction is in safe hands.</p>
    <p>You shall be notified on transaction redemption date.</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

const secondLegTransactionFailed = ({transactionId,  amount,  transactionType, transactionDate, details}) => {
    const subject = `Your Transaction Failed`

    const body = `<p>Hello</p><p>This is to notify you that your transaction failed</p>
    <p>Here are the details of you transaction:</p>
    <p><b>Transaction ID: ${transactionId}</b></p>
    <p><b>Amount: ${amount}</b></p>
    <p><b>Transaction Redemption Date: ${transactionType}</b></p>
    <p><b> Transaction Leg: ${transactionDate}</b></p>
    <p><b> Details: ${details}</b></p>
    <p>Kindly try again later</p>
    <p>Warm Regards</p>`
    
    return [subject, body]
}

module.exports = {firstLegTransactionSuccess, firstLegTransactionFailed, secondLegTransactionSuccess, secondLegTransactionFailed}