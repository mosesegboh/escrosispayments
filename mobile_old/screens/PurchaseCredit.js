import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator
      } from 'react-native';
import Constants from 'expo-constants';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {randomString} from '../services/';
//flutterwave
import {PayWithFlutterwave} from 'flutterwave-react-native';
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import ConfirmTransaction from './ConfirmTransaction';
//credentaisl context
import { CredentialsContext } from '../components/CredentialsContext';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import {Autocomplete} from 'react-native-autocomplete-input';

export default function PurchaseCredit({navigation}) {
  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  //context
  let {email} = storedCredentials

  const [selectedValue, setSelectedValue] = useState();
  const [selectedValueRecurrence, setSelectedValueRecurrence] = useState();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState();
  const [secondLegTransactionInput, setSecondLegTransactionInput] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [details, setDetails] = useState();
  const [input, setInput] = useState();
  const [data, setData] = useState([]);
  const [billData, setbillData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [disabled, setDisabled] = useState(false)
  
  useEffect(()=>{
    //generate transaction ID
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());

    //make api call to get all the available bill services
    // const url = 'https://api.flutterwave.com/v3/bill-categories?airtime=1';
    // const token = FLUTTERWAVE_SECRET_KEY;

    // axios.get(url, { headers: { Authorization: token } }).then((response) => {
    // //   console.log(response, 'this is the response')
    //   const {message, status, data} = response.data

    //   console.log(data, 'this is data')
     
    //   if(status == 'success'){
    //     console.log('it was successful')
    //     setbillData(data)
    //   }else{
    //     handleMessage('An error occured while getting services', 'FAILED')
    //   }
    // }).catch((error) => {
    //     console.log(error)
    //     handleMessage('An error occured while getting services', 'FAILED')
    // })
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

  const showDatePicker = () => {
      setShow(true);
  }

  const navigateConfirmTransaction = () => {
    if ( email == null || inputValueAmount == null || dob == null || transactionId == null || details == null ){
        setSubmitting(false)
        handleMessage("Please enter all fields")
        alert("Please enter all fields")
        return
    }
    
    navigation.navigate('ConfirmTransaction', {
    transactionId: transactionId,
    email: email,
    // transactionDate: new Date(),
    amount: inputValueAmount,
    transactionType: selectedValue,
    date: dob,
    details: details,
    secondLegTransactionId: secondLeg,
    token: `Bearer ${token}`
  })}

  const handleAddTransaction = () => {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // if ( email == "" || inputValueAmount == "" || dob == "" || transactionId == "" || details == "" ){
    //     setSubmitting(false)
    //     handleMessage("Please enter all fields")
    // }
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
        transactionDate: new Date(),
        transactionId: transactionId,
        amount: inputValueAmount,
        transactionType: selectedValue,
        date: dob,
        details: details,
        secondLegTransactionId: secondLeg,
        token: `Bearer ${token}`
      }

      axios.post(url, credentials, headers).then((response) => {
        // token = response.token
        const result = response.data;
        console.log(result)
        const {message, status} = result
       
        if(status == 'SUCCESS'){
          setSubmitting(false)
          handleMessage(message, status)

          //set the form to null
          setInputValueAmount(null)
          setSecondLeg(null)
          setDetails(null)
          setData([])
          setInputValueAmount(null)
          setDate(null)
        }
      }).catch((error) => {
          console.log(error)
          setSubmitting(false)
          handleMessage("An error occured, check your network and try again")
      })
  }

  const searchTransactionId = (text) => {
      setSecondLegTransactionInput(text);
      // console.log('get data')
      if (text.length > 2) {

        const url = 'https://boiling-everglades-35416.herokuapp.com/transaction/get-transactions'

        headers = {
          'Authorization': `String text ${token}`
        }

        credentials = {
          email: email,
        }

        axios.post(url, credentials,headers ).then((response) => {
          // token = response.token
          const result = response.data;
          console.log(result)
          if(result.length > 0) setData(result);
          
      
          setSubmitting(false)
        }).catch((error) => {
            console.log(error)
            setSubmitting(false)
            handleMessage("An error occured, check your network and try again")
        })
        
      }
  }

  const handleAirtimePurchase = (text) => {
         //do some validation
         setSubmitting(true)

         var data = JSON.stringify({
            country: 'NG',
            customer: inputValuePhone,
            amount: inputValueAmount,
            recurrence: selectedValueRecurrence,
            type: 'AIRTIME',
            reference: transactionId,
          });
          
          var config = {
            method: 'post',
            url: 'https://api.flutterwave.com/v3/bills',
            headers: { 
              'Authorization': 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X', 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            const result = JSON.stringify(response.data)

            const { status, message} = result;
            handleMessage(message, status)
            
            console.log(response);
          })
          .catch(function (error) {
            console.log(error.message);
            handleMessage('Insufficient funds in your wallet', 'FAILED')
            alert('insufficient funds in your wallet')
            setSubmitting(false)
          });
          
  }

  return (
    <View style={styles.container}>
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

          {/* <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(text)
                (itemValue)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={item.short_name} value={item.short_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

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
            keyboardType={'numeric'}
            onChangeText={phone => setInputValuePhone(phone)}
            value={inputValuePhone}
          />

          <Picker
            selectedValue={selectedValueRecurrence}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValueRecurrence(itemValue)}
          >
            <Picker.Item label="ONCE" value="ONCE" />
            <Picker.Item label="HOURLY" value="HOURLY" />
            <Picker.Item label="WEEKLY" value="WEEKLY" />
            <Picker.Item label="DAILY" value="DAILY" />
            <Picker.Item label="MONTHLY" value="MONTHLY" />
          </Picker>

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
    </View>
  );
}

const MyTextInput = ({label, icon,isPassword,hidePassword,setHidePassword, 
  isDate, showDatePicker,...props}) => {
  return (
      <View>
          <LeftIcon>
              <Octicons name={icon} size={30} color={myButton} />
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          {!isDate && <StyledTextInput {...props}/>}
          {isDate && <TouchableOpacity onPress={showDatePicker}>
                  <StyledTextInput {...props}/>
              </TouchableOpacity>}
          {isPassword && (
              <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                  <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight}  />
              </RightIcon>
          )}
      </View>
  )
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
    }
});
