import React, { useState, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        ActivityIndicator 
      } from 'react-native';
import { FLUTTERWAVE_PUBLIC_KEY } from '../services';
import {BaseUrl} from '../services/'
import  axios from 'axios'
import {PayWithFlutterwave} from 'flutterwave-react-native';
import { CredentialsContext } from '../components/CredentialsContext';
import {
  Colors,
  MsgBox,
} from '../components/styles';

const {primary} = Colors;

export default function ConfirmTransaction({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

  //context
  let {email, token} = storedCredentials
  let transactionDate = new Date().toString();

  const {
        transactionId,
        // transactionDate,
        amount,
        transactionType,
        date,
        details,
        secondLegTransactionId,
    } = route.params

  const [selectedValue, setSelectedValue] = useState("FirstLeg");
  const [show, setShow] = useState(false);
  const [inputValueAmount, setInputValueAmount] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [input, setInput] = useState();
  const [data, setData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [disabled, setDisabled] = useState(false)
  const [hideButton, setHideButton] = useState(true)
  const [dob, setDob] = useState();

  const handleMessage = (message,type="FAILED") => {
      setMessage(message)
      setMessageType(type)
  }

  const handleAddTransaction = () => {
      setSubmitting(true);
      handleMessage(null)
      const url = `${BaseUrl}/transaction/add-transaction`;

      let headers = 
      {
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      const credentials = {
        email: email,
        transactionDate: transactionDate,
        transactionId: transactionId,
        amount: amount,
        transactionType: selectedValue,
        date: date,
        details: details,
        secondLegTransactionId: secondLegTransactionId,
        token: `Bearer ${token}`
      }

      console.log(credentials);

      axios.post(url, credentials, headers).then((response) => {
        // token = response.token
        const result = response.data;
        console.log(result)
        const {message, status} = result
       
        if(status == 'SUCCESS'){
          setSubmitting(false)
          // navigation.navigate('AddTransaction')
          handleMessage(message, status)

          //set the form to null
          setInputValueAmount(null)
          setSecondLeg(null)
        //   setDetails(null)
          setData([])
          setInputValueAmount(null)
          setHideButton(false)
        //   setDate(null)
        }

        // navigation.navigate('AddTransaction')
      }).catch((error) => {
          console.log(error)
          setSubmitting(false)
          handleMessage("An error occured and this transaction is not completed, check your network and try again")
      })
  }

  // const handleOnRedirect = () => {
  //   // alert('Adding Transaction.......')
  //   setSubmitting(true);
  //     handleMessage(null)
  //     const url = 'https://boiling-everglades-35416.herokuapp.com/transaction/add-transaction';

  //     let headers = 
  //     {
  //       header: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       }
  //     }

  //     const credentials = {
  //       email: email,
  //       transactionDate: new Date(),
  //       transactionId: transactionId,
  //       amount: inputValueAmount,
  //       transactionType: selectedValue,
  //       date: dob,
  //       details: details,
  //       secondLegTransactionId: secondLeg,
  //       token: `Bearer ${token}`
  //     }

  //     axios.post(url, credentials, headers).then((response) => {
  //       // token = response.token
  //       const result = response.data;
  //       console.log(result)
  //       const {message, status} = result
       
  //       if(status == 'SUCCESS'){
  //         setSubmitting(false)
  //         handleMessage(message, status)

  //         //set the form to null
  //         setInputValueAmount(null)
  //         setSecondLeg(null)
  //       //   setDetails(null)
  //         setData([])
  //         setInputValueAmount(null)
  //       //   setDate(null)
  //       }
  //     }).catch((error) => {
  //         console.log(error)
  //         setSubmitting(false)
  //         handleMessage("An error occured, check your network and try again")
  //     })
      
  // }


  // const testDisabled = () => {
  //   if ( email == "" || inputValueAmount == "" || dob == "" || transactionId == "" ){
  //       setSubmitting(false)
  //       handleMessage("Please enter all fields")
  //       return false
  //   }else{
  //     return true
  //   }
    
  // }

  const handleOnAbort = () => {
    alert ('The transaction failed. Try again later')
    return
  }

  return (
    <View style={styles.container}>
        <View>
            <View>
            <Text style={styles.input}>Kindly confirm the transation and make payment</Text>
          </View>

          <View>
            <Text style={styles.input}>Transaction ID : {transactionId}</Text>
          </View>

          <View>
            <Text style={styles.input}>Amount : {amount}</Text>
          </View>

          <View>
            <Text style={styles.input}>Transaction Type : {transactionType}</Text>
          </View>

          <View>
            <Text style={styles.input}>Transaction Details : {details}</Text>
          </View>

          <View>
            <Text style={styles.input}>Transaction Redemption Date : {date ? date.toDateString() : ''}</Text>
          </View>

          {secondLeg && <View>
            <Text style={styles.input}>{secondLegTransactionId}</Text>
          </View>}

          <MsgBox type={messageType}>{message}</MsgBox>

          {hideButton && !submitting && <PayWithFlutterwave
            // style={styles.addTransactionButton}
            onRedirect={handleAddTransaction}
            // onWillInitialize = {handleOnRedirect}
            options={{
              tx_ref: transactionId,
              authorization: FLUTTERWAVE_PUBLIC_KEY,
              customer: {
                email: email
              },
              amount: Number(amount),
              currency: 'NGN',
              payment_options: 'card',
              onAbort: {handleOnAbort}
            }}
            customButton={(props) => (
              <TouchableOpacity
                style={styles.addTransactionButton}
                onPress={props.onPress}
                isBusy={props.isInitializing}
                >
                  <Text style={styles.buttonText}>Make Payment</Text>
              </TouchableOpacity>
            )}
          />}

          {hideButton && submitting && <TouchableOpacity 
            onPress={handleAddTransaction}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!hideButton && <TouchableOpacity 
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Go back</Text>
          </TouchableOpacity>}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'blue',
      backgroundColor: '#131112',
      padding: 8,
      justifyContent: 'center'
    },
    input: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 30,
    //   backgroundColor: '#1b181f',
      borderBottomColor: '#949197',
      borderBottomWidth: 1,
      borderRadius: 3,
      color: '#fff',
      margin: 10
    },
    picker: {
      backgroundColor: '#1b181f',
      borderBottomColor: '#949197',
      borderBottomWidth: 1,
      margin: 10,
      color: '#949197',
    },
    addTransactionButton: {
      backgroundColor: '#3a5fbc',
      height: 50,
      width: 350,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    },
    buttonText: {
      color: "#fff"
    },
    options: {
      flex: 1,
      flexDirection: 'column',

    }
});
