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
import {Picker} from '@react-native-picker/picker';
import {randomString} from '../services';
const {myButton, darkLight, primary} = Colors;
import {Octicons, Ionicons} from '@expo/vector-icons';
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import  {handleBillPayment}  from '../services/index';
import { CredentialsContext } from '../components/CredentialsContext';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';


export default function BillPayment({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance, bill} = route.params

  const [selectedValue, setSelectedValue] = useState("ONCE");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState(); 
  const [details, setDetails] = useState();
  const [billData, setbillData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [billSelected, setBillSelected] = useState()
  const [dob, setDob] = useState();

  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());

    //make api call to get all the available bill services
    const urlParameter = (bill == 'electricity') ? 'power' 
                      : (bill == 'internet') ? 'internet' 
                      :  (bill == 'data') ? 'data_bundle' 
                      :  (bill == 'dhl') ? 'dhl' 
                      : ''
      const url = (bill == 'tithe' || bill == 'cable' || bill == 'tax' || bill == 'toll' || bill == 'dhl') 
      ? `${FLUTTERWAVE_API_URL}/bill-categories`  
      : `${FLUTTERWAVE_API_URL}/bill-categories?${urlParameter}=1`;
      const token = FLUTTERWAVE_SECRET_KEY;

      axios.get(url, { headers: { Authorization: token } }).then((response) => {
        const {message, status, data} = response.data
        // console.log(data, '--data')
        // console.log(typeof(data), '--response data')
        if (bill == 'tithe' || bill == 'cable' || bill == 'tax') {
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
            if ( element.id = 165 && bill == 'dhl') {
              unCategorizedBillData.push(element)
            }
          }
          // console.log(unCategorizedBillData, 'this is uncatego')
        }
        
        if (status == 'success'){
          // console.log('it was successful')
          if (bill == 'tithe' || bill == 'cable' || bill == 'tax' || bill == 'dhl'){
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
    // secondLegTransactionId: secondLeg,
    token: `Bearer ${token}`
  })}


  const handleSelectedValue  = (text) => {
    setSelectedValue(text)
  }

  const handleBillPurchase = (text) => {
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
      type: billSelected,
      reference: transactionId,
    });

    console.log(data, 'this is the data')
    // return
          
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
        data.transactionType = (bill == 'electricity') ? 'power' 
                                : (bill == 'internet') ? 'internet' 
                                : (bill == 'data') ? 'data_bundle' 
                                : (bill == 'tithe') ? 'tithe'
                                : (bill == 'cable') ? 'cable'
                                : (bill == 'tax') ? 'tax'
                                : (bill == 'dhl') ? 'dhl'
                                : ''
        data.transactionName = 'billPayment' 
        data.details = `${bill} bill purchase`
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`

        console.log(data, 'i got inside here oh')

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
      // alert(error.message)
      setSubmitting(false)
    });      
  }

  const handleSelectBillerName  = (text) => {
    if(bill == 'data') {
      var dataBundleAmount = text.split(',')
      setBillSelected(dataBundleAmount[0]) 
      setInputValueAmount(dataBundleAmount[1])
      // console.log(billSelected, inputValueAmount)
    }else{
      setBillSelected(text) 
    }
  }

  // const handleSetAmount  = (text, amount) => {
  //   setBillSelected(text) 
  //   setInputValueAmount(amount)
  //   console.log(amount)
  //   // setInputValueAmount(amount)
  //   // console.log(currency)
  // }

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

          {(bill == 'electricity') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={item.short_name} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'internet') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={item.short_name} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'data') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={item.biller_name} value={ ` ${item.biller_name},${item.amount} `} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'tithe') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={`${item.short_name} ${item.biller_name}`} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'cable') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={`${item.short_name} ${item.biller_name}`} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'tax') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={`${item.short_name} ${item.biller_name}`} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          {(bill == 'dhl') && <Picker
            selectedValue={billSelected}
            style={styles.picker}
            onValueChange={(billSelected, itemIndex) => handleSelectBillerName(billSelected)}
          >
            {billData ? 
                billData.map((item, index) => (
                    <Picker.Item key={item.id} label={`${item.short_name} ${item.biller_name}`} value={item.biller_name} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker>}

          

          

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
                        : (bill == 'data') ? 'Phone Number' 
                        : (bill == 'dhl') ? 'Label Number' 
                        :  'Customer Number'}
            placeholderTextColor="#949197" 
            type="number"
            // keyboardType={'numeric'}
            onChangeText={phone => setInputValuePhone(phone)}
            value={inputValuePhone}
          />

          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => handleSelectedValue(itemValue)}
          >
            <Picker.Item label="ONCE" value="ONCE" />
            <Picker.Item label="HOURLY" value="HOURLY" />
            <Picker.Item label="WEEKLY" value="WEEKLY" />
            <Picker.Item label="DAILY" value="DAILY" />
            <Picker.Item label="MONTHLY" value="MONTHLY" />
          </Picker>

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
                  : ''
                }
              </Text>
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
