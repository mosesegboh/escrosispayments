import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator,
        ScrollView,
        Platform
      } from 'react-native';
import {Octicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {randomString} from '../services/';
const {myButton, darkLight, primary} = Colors;
import {Ionicons} from '@expo/vector-icons';
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import  {FLUTTERWAVE_GET_RATE_URL}  from '../services/index';
import {BaseUrl} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';
import SelectDropdown from 'react-native-select-dropdown'
// import SelectInput from 'react-native-select-input-ios'


export default function Transfer({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params
  const countrys = ["Egypt", "Canada", "Australia", "Ireland"]
  // const transferScope = ['local', 'International']


  const [selectedValue, setSelectedValue] = useState("ONCE");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValueAccount, setInputValueAccount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [narration, setNarration] = useState(false);
  const [input, setInput] = useState();
  const [data, setData] = useState([]);
  const [billData, setbillData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [banks, setBanks] = useState()
  const [countries, setCountries] = useState(['NG'])
  const [dob, setDob] = useState()
  const [currency, setCurrency] = useState();
  const [sourceCurrency, setSourceCurrency] = useState();
  const [transferScope, setTransferScope] = useState(['local', 'International']);
  const [rate, setRate] = useState();
  const [clientCurrencies, setClientCurrencies] = useState();
  const [countrySelected, setCountrySelected] = useState();
  const [localBanks, setLocalBanks] = useState(true);
  const [availableCurrency, setAvailableCurrency] = useState(['NG']);
  const [localCountries, setLocalCountries] = useState(['NG']);
  const [localTransfer, setLocalTransfer] = useState(false)
  const [africanTransfer, setAfricanTransfer] = useState(false)
  const [internationalTransfer, seInternationalAfricanTransfer] = useState(false)
  
  useEffect(()=>{
    // const clientCurrencies = ['NGN']

  // const localCountries = ['NG']
    // setCountries()
    //generate transaction ID
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
    
    var config = {
    method: 'get',
    url: `${FLUTTERWAVE_API_URL}/banks/${localCountries[0]}`,
    headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
    },
    };

    // console.log(config)

    axios(config)
    .then(function (response) {
    // console.log(JSON.stringify(response.data.data), 'this is data');
      setBanks(response.data.data);
    // console.log(banks, 'this is success')
    })
    .catch(function (error) {
      console.log(error);
    });
  },[]);

  //Actual date of birth chosen by the user to be sent
  

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

  const handleSelectedValue  = (text) => {
    setCurrency(text) 
    //make calls for rates for countries selected
    var axios = require('axios');
    var data = '';

    var config = {
    method: 'get',
    url: `${FLUTTERWAVE_API_URL}/transfers/rates?amount=${inputValueAmount}&destinationcurrency`,
    headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    // console.log(config)

    axios(config)
    .then(function (response) {
    // console.log(JSON.stringify(response.data));
    setBanks(response.data.data);
    })
    .catch(function (error) {
    console.log(error);
    });

  }

  const handleTransfer = (text) => {
    if ( email == null || inputValueAmount == null || inputValueAccount == null || selectedValue == null || transactionId == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {
      console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insufficient balance to complete this transaction, Kindly add funds to your wallet")
      alert("You have insufficient balance to complete this transaction, Kindly add funds to your wallet")
      return
    }

    setSubmitting(true)

    var data = {
      account_bank: selectedValue,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      currency: currency,
      reference: transactionId,
      callback_url: `${BaseUrl}/webhook/feedback`,
      debit_currency: currency,
    };

    console.log(data, 'this is the data')
    // return
          
    var config = {
      method: 'post',
      url: `${FLUTTERWAVE_API_URL}/transfers`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };
          
    axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data.data));
      const result = response.data

      // console.log(result, 'this is result')
      const { status, message} = result;

      // console.log(status, '--status')
      
      if (status === 'success') {
        // console.log('i got inside here')
        
        data.email = email
        data.transactionType = 'transfer'
        data.transactionName = 'transfer'
        data.details = narration
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`

        // console.log(data, '--this is success')
        // return
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
          const result = response.data
    
          const { status, message} = result;
          
    
          if(status === 'SUCCESS') {
            handleMessage(message, status)
            setSubmitting(false)
            alert(message)
          }else{
            handleMessage("An error occured", 'FAILED')
            setSubmitting(false)
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
      
      // console.log(response, 'response from 11');
    })
    .catch(function (error) {
      // console.log(error.response.data.message, 'response fom api call');
      // handleMessage(error.response.data.message, 'FAILED')
      alert(error.message)
      setSubmitting(false)
    });      
  }

  const handleGetRate = () => {
    var data = {
      account_bank: selectedValue,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      destination_currency: currency,
      source_currency: sourceCurrency
    };

    var config = {
      method: 'get',
      url: `${FLUTTERWAVE_API_URL}/${FLUTTERWAVE_GET_RATE_URL}`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      setRate(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleSelectedTransfer = (text) => {
    console.log(typeof(text), 'this is inside function')
    // setTransferScope(text)
   if (text == "International") {
      console.log('i am inside here')
      //   setCountries([
      //     'NG', 'GH', 'KE', 'UG', 'ZA', 'TZ', 
      //     'USD','AED', 'ARS', 'AUD', 'CAD', 
      //     'CHF','CZK', 'ETB', 'EUR', 'GBP', 
      //     'GHS', 'ILS', 'INR', 'JPY', 'KES', 
      //     'MAD', 'MUR', 'MYR', 'NGN', 'NOK', 
      //     'NZD', 'PEN', 'PLN', 'RUB', 'RWF', 
      //     'SAR', 'SEK', 'SGD', 'SLL', 'TZS', 
      //     'UGX', 'USD', 'XAF', 'XOF', 'ZAR', 
      //     'ZMK', 'ZMW', 'MWK', 'GBP'
      // ])
      setCountries([
        'NG', 'GH', 'KE', 'UG', 'ZA', 'TZ', 'US'
    ])

      //make another API call to get list of banks in other countries
    }else(
      setCountries(['NG'])
    )
  }

  const handleTransferScope = (text) => {
    console.log(text)

  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
  )
  }

  const handleSelectedCountry = (country) => {
    setCountrySelected(country)
    setLocalCountries([country])
    // console.log(`${FLUTTERWAVE_API_URL}/banks/${localCountries[0]}`, 'this is country!!!')

    
    //get banks detail
    var config = {
      method: 'get',
      url: `${FLUTTERWAVE_API_URL}/banks/${localCountries[0]}`,
      headers: { 
          'Authorization': FLUTTERWAVE_SECRET_KEY, 
          'Content-Type': 'application/json'
      },
      };
  
      console.log(config)
  
      axios(config)
      .then(function (response) {
      console.log(JSON.stringify(response.data.data), 'this is data');
        setBanks(response.data.data);
      // console.log(banks, 'this is success')
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const handleSelectedBanks = (banks) => {
    setLocalBanks(banks)
  }

  return (
    <KeyboardAvoidingWrapper>
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

          <SelectDropdown
            data={availableCurrency}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
            }}
            
            defaultButtonText="Available Currency"
              buttonStyle={{
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
            }}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{
              fontSize: 5,
              fontFamily: 'Nunito',
            }}
            buttonTextStyle={{
              color: '#fff',
              marginLeft: -5,
              marginRight: 230,
              fontFamily: 'Nunito',
              fontSize: 14,

              // justifyContent: 'left',
            }}
            rowTextStyle={{
              // alignItems: 'left'
              marginLeft: 0
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              console.log(selectedItem)
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />


          {/* <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            {clientCurrencies ? 
                clientCurrencies.map((item, index) => (
                    <Picker.Item key={item.id} label={item} value={item} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

        <TextInput
            style={styles.input}
            placeholder="     Amount"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={amount => setInputValueAmount(amount)}
            value={inputValueAmount}
          />

          {/* <Picker
            selectedValue={transferScope}
            style={styles.picker}
            onValueChange={(transferScope, itemIndex) => handleSelectedTransfer(transferScope)}
          >
            <Picker.Item label="local" value="local" />
            <Picker.Item label="International" value="international" />
          </Picker> */}

          <SelectDropdown
            data={transferScope}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
              handleSelectedTransfer(selectedItem)
              // setCountries(['NG', 'USD'])
            }}
            
            defaultButtonText="Transfer Scope"
              buttonStyle={{
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
            }}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{
              fontSize: 5,
              fontFamily: 'Nunito',
              // marginLeft: -5,
              // marginRight: 280,
            }}
            buttonTextStyle={{
              color: '#fff',
              marginLeft: -10,
              marginRight: 280,
              fontFamily: 'Nunito',
              fontSize: 14,

              // justifyContent: 'left',
            }}
            rowTextStyle={{
              // alignItems: 'left'
              marginLeft: 0
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              // console.log(selectedItem)
              // handleSelectedTransfer(selectedItem)
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />

          <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
              handleSelectedCountry(selectedItem)
              // setCountrySelected(selectedItem)
            }}
            
            defaultButtonText="countries"
              buttonStyle={{
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
            }}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{
              fontSize: 5,
              fontFamily: 'Nunito',
              // marginLeft: -5,
              // marginRight: 280,
            }}
            buttonTextStyle={{
              color: '#fff',
              marginLeft: -10,
              marginRight: 280,
              fontFamily: 'Nunito',
              fontSize: 14,

              // justifyContent: 'left',
            }}
            rowTextStyle={{
              // alignItems: 'left'
              marginLeft: 0
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              // console.log(selectedItem)
              // handleSelectedTransfer(selectedItem)
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />


          <SelectDropdown
            data={banks}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
              // setCountrySelected(selectedItem)
              handleSelectedBanks(selectedItem)
            }}
            
            defaultButtonText="Local Banks"
              buttonStyle={{
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
            }}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{
              fontSize: 5,
              fontFamily: 'Nunito',
              // marginLeft: -5,
              // marginRight: 280,
            }}
            buttonTextStyle={{
              color: '#fff',
              marginLeft: -10,
              marginRight: 280,
              fontFamily: 'Nunito',
              fontSize: 14,

              // justifyContent: 'left',
            }}
            rowTextStyle={{
              // alignItems: 'left'
              marginLeft: 0
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              // console.log(selectedItem)
              // handleSelectedTransfer(selectedItem)
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              console.log(item.name)
              return item.name
            }}
          />

          {/* <Picker
            selectedValue={currency}
            style={styles.picker}
            onValueChange={(currency, itemIndex) => handleSelectedValue(currency)}
          >
            {countries ? 
                countries.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

          {/* <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            {banks ? 
                banks.map((item, index) => (
                    <Picker.Item key={item.id} label={item.name} value={item.code} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}


          <TextInput
            style={styles.input}
            placeholder="Recipient Account Number"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={account => setInputValueAccount(account)}
            value={inputValueAccount}
          />

          <TextInput
            style={styles.input}
            placeholder="Narration"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={narration => setNarration(narration)}
            value={narration}
          />


          {
            internationalTransfer && <TextInput
            style={styles.input}
            placeholder="Swift Code"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={account => setInputValueAccount(account)}
            value={inputValueAccount}
          />
          }




          <MsgBox type={messageType}>{message}</MsgBox>

          {submitting && <TouchableOpacity 
            onPress={handleTransfer}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleTransfer}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}>Transfer</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </KeyboardAvoidingWrapper>
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
      justifyContent: 'center',
      height: '100%',
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
