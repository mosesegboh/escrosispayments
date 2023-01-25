const validateData = (data, res) => {
    let dataArray = Object.entries(data)

    for (item of dataArray){
        if (item[1] == null) {
            res.json({
                status: "FAILED",
                message: "Please enter all input fields"
            })
        }
        
        var trimedDataKey = JSON.stringify(item[0]).trim()
        var trimedDataValue = JSON.stringify(item[1]).trim()

        var stringCompareDate = JSON.stringify("date").trim()
        var stringCompareTransactionDate = JSON.stringify("date").trim()
        if (trimedDataKey == stringCompareDate || trimedDataKey == stringCompareTransactionDate) {
            // console.log(trimedDataValue, 'inside date')
            if (!new Date(trimedDataValue).getTime()) {
                return res.json({
                    status: "FAILED",
                    message: "Invalid date entered"
                })
            }
        }

        var stringCompareEmail = JSON.stringify("email").trim()
        if (trimedDataKey == stringCompareEmail) {
            // console.log(trimedDataValue, 'inside email')
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w {2, 3})+$/.test(trimedDataValue)) {
                return res.json({
                    status: "FAILED",
                    message: "Invalid email"
                })
            } 
        }

        var stringCompareAmount = JSON.stringify("amount").trim()
        if (trimedDataKey == stringCompareAmount) {
            // console.log(stringCompareAmount,trimedDataValue, '-amount')
            if (Number.isInteger(trimedDataValue)) {
                return res.json({
                    status: "FAILED",
                    message: "Invalid Amount Entered"
                })
            } 
        }
        return true
    }
}

module.exports = {validateData}  