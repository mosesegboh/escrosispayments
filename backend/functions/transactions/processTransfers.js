const transferFunction = require('../../services/email/functions/transferFunction')
const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')

const processTransfers = async (data, res) => {

    validation.validateData(data, res)

    let {email, 
        transactionId,
        amount, 
        transactionType, 
        date, 
        details, 
        transactionName,
        transactFromWallet,
        transactFromAddedFunds,
        accountNumber,
        accountBank,
        currency,
        reference,
        callbackUrl,
        debitCurrency,
    } = data

    // console.log('i got here');
    // return
    const userCurrentDetails = await Transaction.find({"Transaction.email": email}).sort({_id: -1}).limit(2)
    .then((transaction)=>{
        var currentBalance = transaction[1].balance ? transaction[1].balance : 0.00
        if(transactFromWallet == "yes"){
            var currentBalance = transaction[0].balance ? transaction[0].balance : 0.00
        }

        if (currentBalance == 0.00 && transactionName !== "wallet") {
            return res.json({
                status: "FAILED",
                message: "You do not have enough funds to carry out this transaction. Please add funds to your wallet"
            })
        }
        return [currentBalance]
    })

    if ( amount > userCurrentDetails[0]) {
        return res.json({
            status: "FAILED",
            message: "You do not have sufficient funds to complete your transaction"
        })
    }

    var filter = { transactionId: transactionId }; 
    var update = {
        transactionId: transactionId,
        transactionName: transactionName,
        transactionType: transactionType,
        balance: +userCurrentDetails[0] - +amount,
        amount: amount,
        email: email,
        date: date,
        details: details,
        transactFromWallet: transactFromWallet,
        accountNumber: accountNumber,
        accountBank: accountBank,
        currency: currency,
        reference: reference,
        callbackUrl: callbackUrl,
        debitCurrency: debitCurrency
    };

    if (transactFromAddedFunds == "no"){
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) {
                const status = "success"
                transferFunction.sendTransferEmail(result, res, status)
                res.json({
                    status: "SUCCESS",
                    message: "Your transaction has been successfuly completed"
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occured while saving transfer"
            })
        })
        return
    } 

    if (transactFromWallet == "yes"){    
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) {
                const status = "success"
                transferFunction.sendTransferEmail(result, res, status)
                res.json({
                    status: "SUCCESS",
                    message: "The transaction was successfully added"
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occured while saving user"
            })
        })
    }else{
        setTimeout(function(){
            console.log("Delaying for 5 secs for webhook");
        }, 5000);
        //balance will remain thesame if you are doing from added funds
        if ( transactFromAddedFunds == "yes"){
            update.balance = userCurrentDetails[0]
        }

        Transaction.findOneAndUpdate(filter, update, {
            new: true
        }).then(result => {
                console.log(result, '<-result, right track')
            if (result){
                const status = "success"
                transferFunction.sendTransferEmail(result, res, status)
                
                return res.json({
                    status: "SUCCESS",
                    message: "Transfer has been sent successfully"
                })
            }else{
                return res.json({
                    status: "FAILED",
                    message: "The transaction could not be completed - API"
                })
            }
        }).catch(err => {
            const status = "failed"
            var result = {}
    
            transferFunction.sendTransferEmail(result, res, status)
            console.log(err)
            return res.json({
                status: "FAILED",
                message: "An error occured, while trying to send the transfer"
            })
        })
    }
}

module.exports = {processTransfers}  