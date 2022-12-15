import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        Button, 
        SafeAreaView, 
        TouchableWithoutFeedback, 
        ActivityIndicator 
      } from 'react-native';
// import { Colors, ExtraView } from './../components/styles';
import Constants from 'expo-constants';
//import constants file
import { FLUTTERWAVE_SECRET_KEY } from '../services';
// import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
//api
import  axios from 'axios'
//DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
//services
import {randomString} from '../services/';
//flutterwave
import {PayWithFlutterwave} from 'flutterwave-react-native';
//credentaisl context
import { CredentialsContext } from '../components/CredentialsContext';
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  RightIcon,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  FlatList,
  Pressable,
} from '../components/styles';
//Colors
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import {Autocomplete} from 'react-native-autocomplete-input';
export default function ConfirmTransaction({navigation, route}) {
  //context
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

    // let transactionDate = new Date();

  const [selectedValue, setSelectedValue] = useState("FirstLeg");
  const [show, setShow] = useState(false);
//   const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
//   const [transactionId, setTransactionId] = useState();
//   const [secondLegTransactionInput, setSecondLegTransactionInput] = useState();
  const [secondLeg, setSecondLeg] = useState();
//   const [details, setDetails] = useState();
  const [input, setInput] = useState();
  const [data, setData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [disabled, setDisabled] = useState(false)
  const [hideButton, setHideButton] = useState(true)
  

//   useEffect(()=>{
//     var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
//     // setTransactionId(rString.toUpperCase());
//   },[]);

  //Actual date of birth chosen by the user to be sent
  const [dob, setDob] = useState();

  const handleMessage = (message,type="FAILED") => {
      setMessage(message)
      setMessageType(type)
  }

  const handleAddTransaction = () => {
      setSubmitting(true);
      handleMessage(null)
      const url = 'https://boiling-everglades-35416.herokuapp.com/transaction/add-transaction';

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
    alert ('The transaction failed')
    // navigation.navigate('')
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
              authorization: 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X',
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
