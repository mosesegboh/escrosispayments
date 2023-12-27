import React, { useEffect, useState } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import {FLUTTERWAVE_PUBLIC_KEY, BaseUrl, DEFAULT_CURRENCY} from '../../Services'; 
import socketIo from 'socket.io-client';

const socket = socketIo('http://localhost:3000');

export default function ReceivePayment() {
  const [transactionId, setTransactionId] = useState();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [submitting, setSubmitting] = useState(false);

  useEffect(()=>{
    socket.on('paymentData', (data) => {
      console.log('Received data:', data);

      if (data) {
        const {email, transactionId} = data;
        console.log(transactionId, email);
        setTransactionId(transactionId)
        setEmail(email)

        var axios = require('axios');
        var config = {
          method: 'get',
          url: `${BaseUrl}/user/get-user?email=${email}&transactionId=${transactionId}`,
          headers: { 
            'Content-Type': 'application/json', 
            // 'Authorization': `Bearer ${token}`
          },
        };

        axios(config)
        .then(function (response) {
          // console.log(response)
          if (response.data.status === "SUCCESS") {
            var user = response.data.data;
            console.log(user)
            const {phone, name} = user
            setPhone(phone)
            setName(name)
          }else{
            alert('something went wrong')
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      }else{
        alert('error: no data received')
      }
    });
    //clean up the use effect
    return () => {
      socket.off('paymentData');
    };
  },[]); 

  const processPayments = (data) => {
    // console.log(data, '--data--')
    if (data.status === "cancelled") {
      alert('Your transaction was cancelled, please try again later')
      setSubmitting(false)
      return
    }

    setSubmitting(true);
    const url = `${BaseUrl}/transaction/add-transaction`;

    let headers = {
      header: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      }
    }

    const transactionData = {
      email: email,
      transactionId: transactionId,
      amount: amount,
      transactionName: "receivepayments",
      date: new Date(),
      transactionCurrency: DEFAULT_CURRENCY,
      transactionDate:  new Date(),
      details: "Payments Received",
      // token: `Bearer ${token}`
    }

    var axios = require('axios');
    axios.post(url, transactionData, headers)
    .then((response) => {
      const result = response.data;
      // console.log(result)
      const {message, status} = result
      // console.log(status, message, '--this is status and message')
      if (status === 'SUCCESS') {
        setSubmitting(false)
        alert('Funds was successfully Added to your account') 
        setAmount(null)
      } else {
        setSubmitting(false)
        alert("An error occured")
      }
    }).catch((error) => {
      console.log(error)
      alert("An error occured and this transaction is not completed, check your network and try again")
      setSubmitting(false)
    })
  }

  const config = {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: transactionId,
    amount: 100,
    currency: DEFAULT_CURRENCY,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: phone,
      name: name,
    },
    customizations: {
      title: 'My store',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Pay with Escrosis!',
    // callback: processPayments,
    callback: (response) => {
      console.log(response, 'response');
      processPayments(response);
      closePaymentModal() // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <div className="App d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-3 mb-5 bg-white rounded">
              <div className="card-body text-center">
                <h5 className="card-title mb-4">Make Payment</h5>
                <div className="input-group mb-4">
                    <div className="input-group-prepend">
                      <span className="input-group-text">$</span>
                    </div>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter amount" 
                      aria-label="Amount"
                      onChange= {(event) => setAmount(event.target.value)}
                      value={amount.toString()}
                    />
                </div>
                <FlutterWaveButton {...fwConfig} /> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
