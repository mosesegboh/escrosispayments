import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator
      } from 'react-native';
import  axios from 'axios'
import {Octicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown'
import {randomString} from '../services/';
const { primary} = Colors;
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import { CredentialsContext } from '../components/CredentialsContext';
import { Colors,MsgBox,StyledContainer} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'


export default function PurchaseCredit({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params

  const [selectedValue, setSelectedValue] = useState("ONCE");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [occurrence] = useState(['ONCE', 'HOURLY', 'WEEKLY', 'DAILY', 'MONTHLY'])
  
  useEffect(()=>{
    //generate transaction ID
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  //Actual date of birth chosen by the user to be sent
  const [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setDob(currentDate);
  }

  const handleMessage = (message,type="FAILED") => {
      setMessage(message)
      setMessageType(type)
  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
  }

  const handleAirtimePurchase = (text) => {
    console.log(selectedValue, 'selected value')
    if ( email == null || inputValueAmount == null || inputValuePhone == null || selectedValue == null || transactionId == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {
      console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insufficient balance to complete this transaction")
      alert("You have insufficient balance to complete this transaction")
      return
    }

    setSubmitting(true)

    var data = JSON.stringify({
      country: 'NG',
      customer: inputValuePhone,
      amount: inputValueAmount,
      recurrence: selectedValue,
      type: 'AIRTIME',
      reference: transactionId,
    });

    console.log(data, 'this is the data')
          
    var config = {
      method: 'post',
      url: `${FLUTTERWAVE_API_URL}/bills`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };
          
    axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      // const result = JSON.stringify(response.data)
      const result = response.data
      const { status, message} = result;
      
      if(status === 'success') {
        data.email = email
        data.transactionType = 'airtime'
        data.transactionName = 'airtime'
        data.details = 'airtime purchase'
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`

        //make another api call to update client account
        var config = {
          method: 'post',
          url: `${BaseUrl}/transaction/add-transaction`,
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data), 'response from acios');
          // const result = JSON.stringify(response.data)
          const result = response.data
    
          const { status, message} = result;
          
    
          if(status === 'SUCCESS') {
            handleMessage(message, status)
            setSubmitting(false)
            alert(message)
          }else{
            handleMessage("An error occured", 'FAILED')
            setSubmitting(false)
            alert(error.message)
          }
        })
        .catch(function (error) {
          console.log(error.message, 'response from aff transacton');
          handleMessage(error.message, 'FAILED')
          alert(error.message)
          setSubmitting(false)
        })

      }else{
        handleMessage("An error occured", 'FAILED')
        setSubmitting(false)
      }
      
      console.log(response, 'response from 11');
    })
    .catch(function (error) {
      console.log(error.response.data.message, 'response fom api call');
      handleMessage(error.response.data.message, 'FAILED')
      alert(error.message)
      setSubmitting(false)
    });      
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <View>
          {show && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode='date'
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
              />
          )}

          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={amount => setInputValueAmount(amount)}
            value={inputValueAmount}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#949197" 
            type="number"
            // keyboardType={'numeric'}
            onChangeText={phone => setInputValuePhone(phone)}
            value={inputValuePhone}
          />

          <SelectDropdown
            data={occurrence}
            onSelect={(selectedItem, index) => { 
              handleSelectBillerName(selectedItem)
            }}
            defaultButtonText = "Occurence"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <MsgBox type={messageType}>{message}</MsgBox>

           {submitting && <TouchableOpacity 
            onPress={handleAirtimePurchase}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleAirtimePurchase}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Purchase Airtime</Text>
          </TouchableOpacity>}
        </View>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
      
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
      backgroundColor: '#1b181f',
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
    },
    //select drop down
    dropDownButtonStyle: {
      paddingTop: 30,
      backgroundColor: '#1b181f',
      borderBottomColor: '#949197',
      borderBottomWidth: 1,
      borderRadius: 3,
      color: '#fff',
      margin: 10,
      width: '95%',
      paddingTop: 10,
      fontFamily: 'Nunito',
      fontSize: 5
    },
    dropDownButtonTextStyle: {
      color: '#949197',
      fontFamily: 'Nunito',
      fontSize: 15,
    },
});


// const navigateConfirmTransaction = () => {
//   if ( email == null || inputValueAmount == null || dob == null || transactionId == null || details == null ){
//       setSubmitting(false)
//       handleMessage("Please enter all fields")
//       alert("Please enter all fields")
//       return
//   }
  
//   navigation.navigate('ConfirmTransaction', {
//   transactionId: transactionId,
//   email: email,
//   // transactionDate: new Date(),
//   amount: inputValueAmount,
//   transactionType: selectedValue,
//   date: dob,
//   details: details,
//   secondLegTransactionId: secondLeg,
//   token: `Bearer ${token}`
// })}

// const searchTransactionId = (text) => {
//   setSecondLegTransactionInput(text);
//   // console.log('get data')
//   if (text.length > 2) {

//     const url = 'https://boiling-everglades-35416.herokuapp.com/transaction/get-transactions'

//     headers = {
//       'Authorization': `String text ${token}`
//     }

//     credentials = {
//       email: email,
//     }

//     axios.post(url, credentials,headers ).then((response) => {
//       // token = response.token
//       const result = response.data;
//       console.log(result)
//       if(result.length > 0) setData(result);
      
  
//       setSubmitting(false)
//     }).catch((error) => {
//         console.log(error)
//         setSubmitting(false)
//         handleMessage("An error occured, check your network and try again")
//     })
    
//   }
// }

// </Picker> */}

// const handleAddTransaction = () => {
//   // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   // if ( email == "" || inputValueAmount == "" || dob == "" || transactionId == "" || details == "" ){
//   //     setSubmitting(false)
//   //     handleMessage("Please enter all fields")
//   // }
//     setSubmitting(true);
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
//         setDetails(null)
//         setData([])
//         setInputValueAmount(null)
//         setDate(null)
//       }
//     }).catch((error) => {
//         console.log(error)
//         setSubmitting(false)
//         handleMessage("An error occured, check your network and try again")
//     })
// }
