import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator
      } from 'react-native';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {BaseUrl, randomString} from '../services';
const {primary} = Colors;
import {Octicons} from '@expo/vector-icons';
import  {FLUTTERWAVE_SECRET_KEY, 
  SERVICE_FEE_BILL_PAYMENT,
  TEST_STATUS_SUCCESS,
  TEST_STATUS_FAILURE,
  NG_PHONE_CODE,
  SERVICE_FEE_TITHE
}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import { CredentialsContext } from '../components/CredentialsContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import SelectDropdown from 'react-native-select-dropdown'
import {Colors, MsgBox, StyledContainer} from '../components/styles';


export default function BillPayment({route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance, bill} = route.params

  const [selectedValue, setSelectedValue] = useState("ONCE");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState('');
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState(); 
  const [billData, setbillData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [billSelected, setBillSelected] = useState()
  const [dob, setDob] = useState();
  const [transactionCurrency, setTransactionCurrency] = useState('NG');
  const [occurrence] = useState(['ONCE', 'HOURLY', 'WEEKLY', 'DAILY', 'MONTHLY'])
  const [billerName, setBillerName] = useState()

  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());

    //make api call to get all the available bill services
    const urlParameter = (bill == 'electricity') ? 'power' 
                      : (bill == 'internet') ? 'internet' 
                      : (bill == 'airtime') ? 'airtime' 
                      :  (bill == 'data') ? 'data_bundle' 
                      :  (bill == 'dhl') ? 'dhl' 
                      : ''
      const url = (bill == 'tithe' || bill == 'cable' || bill == 'tax' || bill == 'toll' || bill == 'dhl' || bill == "airtime") 
      ? `${FLUTTERWAVE_API_URL}/bill-categories`  
      : `${FLUTTERWAVE_API_URL}/bill-categories?${urlParameter}=1`;
      const token = FLUTTERWAVE_SECRET_KEY;

      axios.get(url, { headers: { Authorization: token } }).then((response) => {
        const {message, status, data} = response.data
        // console.log(data, '--data')
        // console.log(typeof(data), '--response data')
        if (bill == 'tithe' || bill == 'cable' || bill == 'tax' || bill == 'dhl' || bill == 'airtime') {
          const processedResponse = response.data.data

          var unCategorizedBillData = []
          // console.log(processedResponse, '--response data')
          processedResponse.forEach(myFunction);
          function myFunction(element) {
            if ( element.id >= 169 && element.id <= 188 && bill == 'tithe') {
              unCategorizedBillData.push(element)
            }
            if ( element.id >= 34 && element.id <= 38  && bill == 'cable') {
              unCategorizedBillData.push(element)
            }
            if ( element.id >= 165 && element.id <= 166 && bill == 'tax') {
              unCategorizedBillData.push(element)
            }
            if (element.is_airtime == true && bill == 'airtime') {
              unCategorizedBillData.push(element)
            }
            if ( (element.id === 47 || element.id == 104 || element.id == 167) && bill == 'dhl') {
              // console.log('dhl')
              unCategorizedBillData.push(element)
            }
          }
        }
        
        if (status == 'success'){
          // console.log('it was successful')
          if (bill == 'tithe' || bill == 'cable' || bill == 'tax' || bill == 'dhl' || bill == 'airtime'){
            setbillData(unCategorizedBillData)
          }else{
            setbillData(data)
          }
          
        }else{
          handleMessage('An error occured while getting services', 'FAILED')
        }
      }).catch((error) => {
          console.log(error)
          handleMessage('An error occured while getting services', 'FAILED')
      })
  },[]);

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

  const handleBillPurchase = (text) => {
    // console.log(selectedValue, 'selected value')
    if ( (email == null || inputValueAmount == null || inputValuePhone == null || selectedValue == null || transactionId == null) && (bill !== "airtime") ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if (bill == "airtime" && inputValueAmount == null) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if (inputValuePhone.length > 11 && (bill=="airtime" || bill == "data")) {
      setSubmitting(false)
      handleMessage("Kindly check the phone number and try again")
      alert("Kindly check the phone number and try again")
      return
    } else if (inputValuePhone.length > 10 && (bill=="electricity")) {
      setSubmitting(false)
      handleMessage("Kindly check the phone number and try again")
      alert("Kindly check the phone number and try again")
      return
    }

    if (inputValueAmount > balance) {
      // console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insuficient balance to complete this transaction")
      alert("You have insuficient balance to complete this transaction")
      return
    }

    setSubmitting(true)

    var serviceCharges = bill == 'tithe' ? SERVICE_FEE_TITHE :  SERVICE_FEE_BILL_PAYMENT

    var data = {
      country: 'NG',
      customer: NG_PHONE_CODE + inputValuePhone.slice(1),
      amount: (+inputValueAmount + +serviceCharges).toString(),
      recurrence: selectedValue,
      type: billerName,
      reference: transactionId,
    };

    // console.log(data, 'this is the first data')
    // return

    var config = {
      method: 'post',
      // url: `${FLUTTERWAVE_API_URL}/bills`,
      url: `${BaseUrl}/transaction/test-api?module=${bill}-success`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    // console.log(config.url, 'this is the url')
    // return
          
    axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      const result = response.data

      //FOR TESTING
      const { status, message} = result;
      
      if (status === 'success') {
        data.email = email
        data.status = status
        data.transactionType = (bill == 'electricity') ? 'power' 
                                : (bill == 'internet') ? 'internet' 
                                : (bill == 'data') ? 'data_bundle' 
                                : (bill == 'tithe') ? 'tithe'
                                : (bill == 'cable') ? 'cable'
                                : (bill == 'tax') ? 'tax'
                                : (bill == 'dhl') ? 'dhl'
                                : (bill == 'airtime') ? 'airtime'
                                : ''
        data.transactionName = 'billPayment'
        data.details = `${bill} Bill Purchase`
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.transactionCurrency = transactionCurrency
        data.token = `Bearer ${token}`

        // console.log(data, '----this is second data inside o')
        // return

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
          const result = response.data
    
          const { status, message} = result;
          
          if (status === 'SUCCESS') {
            handleMessage(message, status)
            setSubmitting(false)
            alert(message)
            setInputValueAmount('')
            setInputValuePhone('')
          } else {
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
      
      // console.log(response, 'response from 11');
    })
    .catch(function (error) {
      setSubmitting(false)
      console.log(error)
      console.log(error.response.data.message, 'response fom api call');
      handleMessage(error.response.data.message, 'FAILED')
      alert(error.response.data.message)
      
    });      
  }

  const handleSelectBillerName  = (text) => {
    if (bill == 'data') {
      var dataBundleAmount = text.split(',')
      setBillSelected(dataBundleAmount[0]) 
      setInputValueAmount(dataBundleAmount[1])
      // console.log(billSelected, inputValueAmount)
    }else{
      setBillSelected(text) 
    }
  }

  const handleSelectedItem = (item) => {
    // console.log(item)
    if (bill == 'data' || bill == 'cable') {
      setInputValueAmount(item.amount.toString())
    }
  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
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

          {((bill == 'electricity' || bill == 'internet'
            || bill == 'data' || bill == 'tithe' || bill == 'cable'
            || bill == 'tax' || bill == 'dhl' || bill == 'airtime'
            ) && billData.length !== 0) ? <SelectDropdown
              data={billData}
              search={true}
              onSelect={(selectedItem, index) => { 
                // console.log(selectedItem.biller_name, '---this is biler name')
                handleSelectedItem(selectedItem)
                setBillerName(selectedItem.biller_name)
                // if (bill == 'data') {() => setInputValueAmount('100')}
                // handleSelectBillerName(selectedItem.biller_name)
              }}
            defaultButtonText = {bill == 'electricity' ? 'Select Electricity Provider' 
                                : bill == 'internet' ? 'Select Internet Provider'
                                : bill == 'data' ? 'Select Data Provider'
                                : bill == 'tithe' ? 'Select Church'
                                : bill == 'cable' ? 'Select Cable TV Provider'
                                : bill == 'tax' ? 'Select Tax Authority'
                                : bill == 'dhl' ? 'Select Shipping Payment'
                                : bill == 'airtime' ? 'Select Airtime Provider'
                                : ''}
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem.short_name  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return `${item.biller_name} - ${item.short_name}` }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          /> 
          :
          <ActivityIndicator size="large" color={primary}/>}
          
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
            placeholder =  { (bill == 'electricity') ? 'Meter Number' 
                        : (bill == 'internet') ? 'Customer Number' 
                        : (bill == 'electricity') ? 'Meter Number' 
                        : (bill == 'data' || bill == 'airtime') ? 'Phone Number' 
                        : (bill == 'dhl') ? 'Label Number' 
                        :  'Customer Number'}
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
            onPress={handleBillPurchase}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleBillPurchase}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>
                {
                  (bill == 'electricity') ? 'Buy Electricity' 
                  : (bill == 'internet') ? 'Pay For Internet'
                  : (bill == 'data') ? 'Pay For Data Bundle'
                  : (bill == 'tithe') ? 'Pay For Tithe' 
                  : (bill == 'cable') ? 'Pay For Cable TV'
                  : (bill == 'tax') ? 'Pay For Tax'
                  : (bill == 'tax') ? 'Pay For Shipping'  
                  : (bill == 'airtime') ? 'Pay For Airtime' 
                  : ''
                }
              </Text>
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
    }
});
