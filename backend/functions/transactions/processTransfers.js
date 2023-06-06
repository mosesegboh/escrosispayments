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
        transferType
    } = data

    // console.log('i got here');
    // return
    const userCurrentDetails = await Transaction.find({"Transaction.email": email}).sort({_id: -1}).limit(2)
    .then((transaction)=>{
        var currentBalance = transaction[1].balance ? transaction[1].balance : 0.00
        if (transactFromWallet == "yes"){
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

    if ( amount > userCurrentDetails[0] ) {
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
        //wait till after webook before deducting - so just leave the old balance for now or you can credit it back after being successfull
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
        debitCurrency: debitCurrency,
        status: 'pending',

        ...((transferType == "isGUZT") ? { destination_branch_code: data.branchCode, beneficiary_name: data.beneficiaryName } : {}),

        ...((transferType = "isLocalDomiciliaryAndIsFcmbOrIsUsdOrIsEur") ? { beneficiary_name: data.beneficiaryName } : {}),

        ...((transferType = "isLocalDomiciliary") ? { meta: [{
            first_name: data.beneficiaryFirstName,
            last_name: data.beneficiaryLastName,
            email: data.beneficiaryEmail,
            beneficiary_country: data.beneficiaryCountry,
            mobile_number: data.beneficiaryMobile,
            sender: data.sender,
            merchant_name: data.merchantName
          }] } : {}),
        //additional meta fields for international transfers
        ...((transferType == "isLocalDomiciliaryandisFcmbDorm") ? { meta: [{
            beneficiaryEmail: data.beneficiaryEmail,
            beneficiary_country: data.beneficiaryCountry,
            beneficiary_occupation: data.beneficiaryOccupation,
            recipient_address: data.recipientAddress,
            mobile_number: data.beneficiaryMobile,
            sender: data.sender,
            sender_country: data.senderCountry,
            sender_id_number: data.senderIdNumber,
            sender_id_type: data.senderIdType,
            sender_id_expiry: data.senderIdExpiryDate,
            sender_mobile_number: data.senderMobile,
            sender_address: data.senderAddress,
            sender_occupation: data.senderOccupation,
            sender_beneficiary_relationship: data.senderBeneficiaryRelationship,
            transfer_purpose: data.transferPurpose
        }] } : {}),

        ...(transferType = "isUsdAccount" ? { meta: [{
            AccountNumber: data.inputValueAccount,
            RoutingNumber: data.routingNumber,
            SwiftCode: data.swiftCode,
            BankName: data.internationBankName,
            BeneficiaryName: data.beneficiaryName,
            BeneficiaryAddress: data.beneficiaryAddress,
            BeneficiaryCountry: data.beneficiaryCountry,
          }]} : {}),

        ...(transferType == "isEurGbp" ? { meta: [{
            AccountNumber: data.inputValueAccount,
            RoutingNumber: data.routingNumber,
            SwiftCode: data.swiftCode,
            BankName: data.internationBankName,
            BeneficiaryName: data.beneficiaryName,
            BeneficiaryCountry: data.beneficiaryCountry,
            PostalCode: data.postalCode,
            StreetNumber: data.streetNumber,
            StreetName: data.beneficiaryStreetName,
            City: data.beneficiaryCity
        }]} : {}),

        ...(transferType == "isKesAccount" ? { meta: [{
            sender: data.sender,
            sender_country: data.senderCountry,
            mobile_number: data.senderMobile
        }]} : {}),

        ...(isZarAccount == 'isZarAccount' ? { meta: [{
            first_name: data.beneficiaryFirstName,
            last_name: data.beneficiaryLastName,
            email: data.beneficiaryEmail,
            mobile_number: data.beneficiaryMobile,
            recipient_address: data.recipientAddress
        }]} : {}),

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
                    message: "Your transaction has been successfuly submitted"
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


    if (transactFromWallet == "yes") {    
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
        //balance will remain thesame if you are doing from added funds
        if ( transactFromAddedFunds == "yes"){
            update.balance = userCurrentDetails[0]
        }

        Transaction.save(update).
        then(result => {
            console.log(result, '<-result, right track')
            if (result){
                const status = "success"
                transferFunction.sendTransferEmail(result, res, status)
                
                return res.json({
                    status: "SUCCESS",
                    message: "Transfer has been submitted successfully"
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
                message: "An error occured, while trying to submit the transfer"
            })
        })
    }

    //OLD CODE
    // if (transactFromWallet == "yes") {    
    //     const newTransaction = new Transaction(update)
    //     newTransaction.save()
    //     .then(result => {
    //         if (result) {
    //             const status = "success"
    //             transferFunction.sendTransferEmail(result, res, status)
    //             res.json({
    //                 status: "SUCCESS",
    //                 message: "The transaction was successfully added"
    //             })
    //         }
    //     }).catch(err => {
    //         console.log(err)
    //         res.json({
    //             status: "FAILED",
    //             message: "An error occured while saving user"
    //         })
    //     })
    // }else{
    //     setTimeout(function(){
    //         console.log("Delaying for 5 secs for webhook");
    //     }, 5000);
    //     //balance will remain thesame if you are doing from added funds
    //     if ( transactFromAddedFunds == "yes"){
    //         update.balance = userCurrentDetails[0]
    //     }

    //     Transaction.findOneAndUpdate(filter, update, {
    //         new: true
    //     }).then(result => {
    //             console.log(result, '<-result, right track')
    //         if (result){
    //             const status = "success"
    //             transferFunction.sendTransferEmail(result, res, status)
                
    //             return res.json({
    //                 status: "SUCCESS",
    //                 message: "Transfer has been sent successfully"
    //             })
    //         }else{
    //             return res.json({
    //                 status: "FAILED",
    //                 message: "The transaction could not be completed - API"
    //             })
    //         }
    //     }).catch(err => {
    //         const status = "failed"
    //         var result = {}
    
    //         transferFunction.sendTransferEmail(result, res, status)
    //         console.log(err)
    //         return res.json({
    //             status: "FAILED",
    //             message: "An error occured, while trying to send the transfer"
    //         })
    //     })
    // }
}

module.exports = {processTransfers}  