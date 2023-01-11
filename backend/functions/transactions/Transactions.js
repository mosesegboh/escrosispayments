const express = require('express')
const Transaction = require('../../models/Transaction')

const updateCustomerLockedBalance = ( balance, amount) => {
  return +balance + +amount; 
}

const revertCustomerLockedBalance = ( balance, amount) => {
  return +balance - +amount; 
}

const redeemTransaciton = async (transactionId, dateToredeem ) => {
    let todaysDate = new Date()

    //get the TransactionSchem
    var transactionToUpdate = await Transaction.find({"Transaction.transactionDate": dateToredeem, "Transaction.status": locked})
          .then((result) => { 
              // const newTransactionToUpdate = result[0] ? result[0]  : 0.00
              // return newTransactionToUpdate
              result.forEach(() => {
                console.log('i found you')
                //contact the debit transaction
                const emailForDebitLeeg = result.email
                const transactionIdForFistLeg = result.transactionId
                const transactionIdForSecondLeg = result.secondLegTransactionId
                
              })
          })

    // if (todaysDate == dateToredeem) {
    //     //Go through all transactions where status is locked update the transaction and end email address debit the client wallet and creadot te ther parties wallet.
  }


module.exports = {updateCustomerLockedBalance, redeemTransaciton}