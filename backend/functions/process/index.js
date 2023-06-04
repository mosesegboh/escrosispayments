const Transaction = require('../../models/Transaction')
const {sendEmailFunction} = require('../../services/email/functions/sendEmailFunctionExport')
const {successBillPayment, failedBillPayment} = require('../../services/email/templates/billPaymentTemplate')
// const {failedBillPayment} = require('../../services/email/templates/billPaymentTemplate')
const {firstLegTransactionSuccess, 
      firstLegTransactionFailed, 
      secondLegTransactionSuccess, 
      secondLegTransactionFailed} = require('../../services/email/templates/escrowTemplate')
// const {failedEscrowService} = require('../../services/email/templates/escrowTemplate')

const getCurrentUserDetails = async ({email, amount, transactFromWallet}, sortOrder=-1, limit=2) => {
    const userDetails = await Transaction.find({"Transaction.email": email}).sort({_id: sortOrder}).limit(limit)
    .then((transaction)=>{
        if (transaction) {
            // console.log(transaction)
            var currentlockedTransactionBalance = transaction[1].lockedTransaction ? transaction[1].lockedTransaction : 0.00
            var currentUnlockedTransactionBalance = transaction[1].unLockedTransaction ?  transaction[1].unLockedTransaction : 0.00
            var currentBalance = transaction[1].balance ? transaction[1].balance : 0.00

            if ( amount > currentBalance && transactFromWallet == "yes") {
                return res.json({
                    status: "FAILED",
                    message: "You do not have sufficient funds to complete your transaction"
                })
            }
            // console.log(currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance)
        
            return [currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance]
        }else{
            return res.json({
                status: "FAILED",
                message: "Client data not found"
            })
        }
        
    })

    // return [currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance]
    return userDetails
}

const appriopriateTemplate = (transactionName, status, successBillPayment=null, failedBillPayment=null) => {
    if (transactionName == 'billPayment' && status == 'success') {
        return successBillPayment
    }else if (transactionName ==  'billPayment' && status == 'failed') {ption123
        
        return successBillFailed
    }
}


const saveTransaction = (filter, update, data, res) => {
    
    if (data.transactFromWallet == "yes"){    
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) {
                const status = "success"
                const relevantTemplate = (data.transactionName == 'billPayment') ? successBillPayment 
                                        : null
                sendEmailFunction(result, res, status, relevantTemplate)
                return res.json({
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

        if ( data.transactFromAddedFunds == "yes"){//balance will remain thesame if you are doing from added funds
            update.balance = userCurrentDetails[0]
        }

        Transaction.findOneAndUpdate(filter, update, {
            new: true
        }).then(result => {
                // console.log(result, '<-result, right track')
            if (result){
                const status = "success"
                

                sendEmailFunction(result, res, status, successBillPayment)
                
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
            sendEmailFunction(result, res, status, failedBillPayment)
            console.log(err)
            return res.json({
                status: "FAILED",
                message: "An error occured, while trying to send the transfer"
            })
        })
    }
}

module.exports = {saveTransaction, getCurrentUserDetails}  