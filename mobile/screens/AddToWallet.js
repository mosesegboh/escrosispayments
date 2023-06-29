import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator,
        Platform
      } from 'react-native';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {randomString} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
import Dialog from "react-native-dialog";
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
  StyledContainer
} from '../components/styles';
import {Octicons, Ionicons} from '@expo/vector-icons';
import {BaseUrl} from '../services/'
import {PayWithFlutterwave} from 'flutterwave-react-native';
import { FLUTTERWAVE_PUBLIC_KEY, DEFAULT_CURRENCY } from '../services';
const {primary} = Colors;
const {myButton, darkLight} = Colors;
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'


export default function AddToWallet({navigation}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState()
  const [dob, setDob] = useState();

  const [choseData, setChoseData] = useState()
  const [inputValueAmount, setInputValueAmount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [submittingConfirm, setSubmittingConfirm] = useState(false)
  const [messageType, setMessageType] = useState()
  const [visible, setVisible] = useState(false)
  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  const onChange = ({type}, selectedDate) => {
    if (type == "set"){
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker()
        setDob(currentDate.toDateString());
      }  
    }else{
      toggleDatePicker()
    }  
  }

  const RenderItem = ({item}) => {
    return(
      <TouchableWithoutFeedback>
        <Image source={item.image} style={{width: 310, height: 180, borderRadius: 10}} />
      </TouchableWithoutFeedback>
    )
  }

  const handleAddTransaction = () => {
    setSubmittingConfirm(true);
    handleMessage(null)
    const url = `${BaseUrl}/transaction/add-transaction`;

    let headers = 
    {
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const transactionData = {
      email: email,
      transactionId: transactionId,
      amount: inputValueAmount,
      transactionType: "wallet",
      transactionName: "wallet",
      date: new Date(),
      transactionCurrency: DEFAULT_CURRENCY,
      transactionDate:  new Date(),
      details: "Add Funds To Wallet",
      token: `Bearer ${token}`
    }
    // console.log(transactionData, '--transaction data--');
    // return
  axios.post(url, transactionData, headers).then((response) => {
    // token = response.token
    const result = response.data;
    console.log(result)
    const {message, status} = result

    console.log(status, message, '--this is status and message')
    
    if (status == 'SUCCESS') {
      setSubmitting(false)
      handleMessage(message, status)
      alert('Funds was successfully Added to your account')

      //set the form to null
      setInputValueAmount(null)
      // setHideButton(false)
      setVisible(false)
      setDob(null)
    } else {
      setSubmitting(false)
      handleMessage("An error occured")
      setVisible(false)
    }
    // navigation.navigate('AddTransaction')
  }).catch((error) => {
    console.log(error)
    setSubmitting(false)
    setVisible(false)
    handleMessage("An error occured and this transaction is not completed, check your network and try again")
  })
}

  const confirmTransaction = () => {
    if ( inputValueAmount == null || transactionId == null ){
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }
    setSubmitting(true);
    setVisible(true)
  }

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const showDatePicker = () => {
    setShow(true);
  }

  const toggleDatePicker = () => {
    setShow(!show)
  }

  const confirmIosDate = () => {
    setDob(date.toDateString())
    toggleDatePicker()
  }

  const handleOnAbort = () => {
    alert ('The transaction failed. Try again later')
    setSubmitting(false)
    setVisible(false)
    return
  }

  const handleCancel = () => {
    setSubmitting(false)
    setVisible(false)
    return
  }

  const handleRedirect = () => {
    console.log('i was redirected!!!')
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <Text>{choseData}</Text>
        <View>
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

            {/* <MyTextInput 
              icon="calendar"
              placeholder=" ID expiry - YYYY - MM - DD"
              placeholderTextColor={myPlaceHolderTextColor}
              value={dob ? dob : ''}
              isDate={true}
              editable = {false}
              showDatePicker = {showDatePicker}
              onPress={() => showMode('date')}
              style={styles.input}
              onPressIn = {toggleDatePicker}
            /> */}

            {show && (<DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              style={{
                height: 120,
                marginTop: -10,
                color: "#fff"
              }}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />)}

            {show &&  Platform.OS === 'ios' && <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}
            >
              <TouchableOpacity style={[
                  styles.button,
                  styles.pickerButton,
                  {backgroundColor: '#3a5fbc',
                  height: 30,
                  width: 70,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -30,
                  borderRadius: 15 }
                ]}
                onPress={toggleDatePicker}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {color: '#fff', fontFamily: 'Nunito' }
                  ]}
                >Cancel</Text>
              </TouchableOpacity>

            <TouchableOpacity style={[
                styles.button,
                styles.pickerButton,
                {
                  backgroundColor: '#3a5fbc',
                  height: 30,
                  width: 70,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -30,
                  borderRadius: 15
                }
              ]}
              onPress={confirmIosDate}
            >
              <Text
                style={[
                  styles.buttonText,
                  {color: '#fff', fontFamily: 'Nunito'}

                ]}
              >Confirm</Text>
            </TouchableOpacity>
          </View>}

            <MsgBox type={messageType}>{message}</MsgBox>

            {!submitting && <TouchableOpacity 
              onPress={() => confirmTransaction()}
              style={styles.addTransactionButton}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>}

            {submitting && <TouchableOpacity 
            onPress={() => selectPaymentOption}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

            <Dialog.Container visible={visible}>
              <Dialog.Title>Fund Wallet</Dialog.Title>
              <Dialog.Description>
                Do you want to proceed?
              </Dialog.Description>
              {!submittingConfirm && <PayWithFlutterwave
                // style={styles.addTransactionButton}
                onRedirect={handleRedirect}
                // onWillInitialize = {handleOnRedirect}
                options={{
                  tx_ref: transactionId,
                  authorization: FLUTTERWAVE_PUBLIC_KEY,
                  customer: {
                    email: email
                  },
                  amount: Number(inputValueAmount),
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

              {submittingConfirm && <TouchableOpacity 
                onPress={handleAddTransaction}
                style={styles.addTransactionButton}>
                  <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
              </TouchableOpacity>}

              <Dialog.Button label="Cancel" onPress={handleCancel}/>
            </Dialog.Container>
        </View>
      </StyledContainer>
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
