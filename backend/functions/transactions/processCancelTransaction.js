const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const {cancelTransaction} = require('../process')

const processCancelTransactionImmediate = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data

    try
    {
        let transactionToCancel = await Transaction.find({transactionId: transactionId})
                
        if (transactionToCancel) {
            await cancelTransaction(transactionToCancel, res)
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
            message: "An error occurred!"
        })
    }
}

module.exports = {processCancelTransactionImmediate}  