const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const sendEmailFunction = require('../../services/email/functions/sendEmailFunction')
const redeemTransactionTemplate = require('../../services/email/templates/transactionRedemptionTemplate')
const {redeemTransaction} = require('../process')

const processRedeemTransactionImmediate = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try
    {
        let transactionToRedeem = await Transaction.find({transactionId: transactionId})
                
        if (transactionToRedeem) {
            if (transactionToRedeem.transactionLeg = "SecondLeg") {
                await redeemTransaction(transactionToRedeem, res);
            }else {
                return res.json({
                    status: "FAILED",
                    message: "This transaction is cannot be redeemed but can only be canceled!"
                })
            }
        }else{
            return res.json({
                status: "FAILED",
                message: "You cannot redeem this transaction!"
            })
        }
    } catch(error) {
        console.log(err);
        return res.json({
            status: "FAILED",
            message: "An error Occurred!"
        })
    }
}

module.exports = {processRedeemTransactionImmediate}  