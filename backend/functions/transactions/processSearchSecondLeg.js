const Transaction = require('../../models/Transaction')


async function processSearchSecondLeg(query, res) {
    try {console.log(query)
        const transactions = await Transaction.find({ transactionId: { $regex: query, $options: 'i' } 
                    }).exec();
        res.json({
            status: "success",
            data: transactions
        })
    } catch (error) {
      console.error('Error occurred during search:', error);
      res.json({
            status: "failed",
            message: "Error occured while fetching "
        })
    }
  }

module.exports = {processSearchSecondLeg}