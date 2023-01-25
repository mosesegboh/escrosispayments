import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput,
        ActivityIndicator,
      } from 'react-native';
import { FLUTTERWAVE_PUBLIC_KEY } from '../services';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {randomString} from '../services/';
import {BaseUrl} from '../services/'
import {PayWithFlutterwave} from 'flutterwave-react-native';
import Dialog from "react-native-dialog";
import { CredentialsContext } from '../components/CredentialsContext';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';
const {myButton, myPlaceHolderTextColor, darkLight, primary} = Colors;
import {Octicons, Ionicons} from '@expo/vector-icons';
// import {Autocomplete} from 'react-native-autocomplete-input';

export default function AddTransaction({navigation, route}) {
  const {storedCredentials} = useContext(CredentialsContext)

  let {email, token} = storedCredentials
  const {balance} = route.params

  const [selectedValue, setSelectedValue] = useState("FirstLeg");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [secondLegTransactionId, setSecondLegTransactionInput] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [details, setDetails] = useState();
  const [data, setData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [submittingConfirm, setSubmittingConfirm] = useState(false)
  const [messageType, setMessageType] = useState()
  const [showSecondLeg, setShowSecondLeg] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showNormal, setShowNormal] = useState(true)
  const [dob, setDob] = useState();
  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  const onChange = (event,selectedDate) => {
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

  const selectPaymentOption = () => {
    setSubmitting(true)
    console.log(balance)
    if ( email == null || inputValueAmount == null || dob == null || transactionId == null || details == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }
    
    if (inputValueAmount > balance) {
      console.log('i was clicked!')
      // setVisible(false)
      setVisible(true)
      setShowOptions(false)
      setShowNormal(true)
    }else if(inputValueAmount < balance) {
      setVisible(true)
      setShowOptions(true)
    }
  }
   
  const handleFromWallet = () => {
    var transactFromWallet = "yes";
    var transactFromAddedFunds = "no"
    handleAddTransaction(transactFromWallet, transactFromAddedFunds)
  }

  const handleFromAddedFunds = () => {
    var transactFromWallet = "no";
    var transactFromAddedFunds = "yes"
    handleAddTransaction(transactFromWallet, transactFromAddedFunds)
  }

const handleAddTransaction = (transactFromWallet, transactFromAddedFunds) => {
  setSubmitting(true);
  setSubmittingConfirm(true)
  handleMessage(null)
  const url = `${BaseUrl}/transaction/add-transaction`;

  let headers = {
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const credentials = {
    email: email,
    transactionDate: dob,
    transactionId: transactionId,
    amount: inputValueAmount,
    transactionType: selectedValue,
    date: date,
    transactionName: selectedValue,
    details: details,
    transactFromWallet: transactFromWallet,
    transactFromAddedFunds: transactFromAddedFunds,
    secondLegTransactionId: secondLeg ? secondLeg : 0.00,
    token: `Bearer ${token}`
  }

  console.log(credentials);

  axios.post(url, credentials, headers).then((response) => {
    // token = response.token
    const result = response.data;
    console.log(result)
    const {message, status} = result
    
    if (status == 'SUCCESS') {
      setVisible(false)
      setSubmitting(false)
      setSubmittingConfirm(false)
      // navigation.navigate('AddTransaction')
      handleMessage(message, status)
      alert('Your transaction was successful')

      //set the form to null
      setInputValueAmount(null)
      setSecondLeg(null)
      setDetails(null)
      setData([])
      setInputValueAmount(null)
    }else{
      handleMessage('An error Occured')
      setSubmitting(false)
      setSubmittingConfirm(false)
      setVisible(false)
    }
  }).catch((error) => {
      console.log(error, '-error from axios')
      setSubmitting(false)
      setSubmittingConfirm(false)
      setVisible(false)
      handleMessage("An error occured and this transaction is not completed, check your network and try again")
  })
}

const handleCancel = () => {
  setSubmitting(false)
  setVisible(false)
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

  // const getItemText = (item) => {
  //   let mainText = item.transactionId;
    
  //   return (
  //     <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
  //       <View style={{ marginLeft: 10, flexShrink: 1 }}>
  //         <Text style={{ fontWeight: "700" }}>{mainText}</Text>
  //         <Text style={{ fontSize: 12 }}>{item.transactionId}</Text>
  //       </View>
  //     </View>
  //   );
  // };
  // const props = {
  //     disabled: true
  // }
  const handleSelectedValue  = (text) => {
    setSelectedValue(text)
    if (text == "FirstLeg") {
      setShowSecondLeg(false)
    }else{
      setShowSecondLeg(true)
    }
  }

  const handleOnAbort = () => {
    alert ('The transaction failed. Try again later')
    return
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

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={amount => setInputValueAmount(amount)}
            value={inputValueAmount}
          />

          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => handleSelectedValue(itemValue)}
          >
            <Picker.Item label="FirstLeg" value="FirstLeg" />
            <Picker.Item label="SecondLeg" value="SecondLeg" />
          </Picker>

          <MyTextInput 
              icon="calendar"
              placeholder="YYYY - MM - DD"
              placeholderTextColor={myPlaceHolderTextColor}
              //onChangeText={handleChange('dateOfBirth')}
              //onBlur = {handleBlur('dateOfBirth')}
              value={dob ? dob.toDateString() : ''}
              isDate={true}
              editable = {false}
              showDatePicker = {showDatePicker}
          />

          <TextInput
            style={styles.input}
            placeholder="Details"
            placeholderTextColor="#949197"
            onChangeText={details => setDetails(details)}
            value={details} 
          />

          {showSecondLeg && <TextInput
            style={styles.input}
            placeholder="Second Leg Transaction"
            placeholderTextColor="#949197"
            onChangeText={secondLeg => setSecondLeg(secondLeg)}
            value={secondLeg} 
          />}

        {/* <Autocomplete
              // data={data}
              // value={query}
              // onChangeText={(text) => this.setState({ query: text })}
              // flatListProps={{
              //   keyExtractor: (_, idx) => idx,
              //   renderItem: ({ item }) => <Text>{item}</Text>,
              // }}
        /> */}

          {/* <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss}>
            <SafeAreaView style={styles.options}>
              <TextInput 
                style={styles.input}
                placeholder="Search For Transaction Id"
                value={secondLegTransactionInput}
                onChangeText={searchTransactionId}
              />
              <FlatList 
                data={data}
                renderItem={({item, index}) => (
                  <Pressable onPress={()=>alert('i was clicked')}>
                     {getItemText(item)}
                  </Pressable>
                )}
              />
            </SafeAreaView>
          </TouchableWithoutFeedback> */}

          <MsgBox type={messageType}>{message}</MsgBox>

          {!submitting && 
            <TouchableOpacity 
            onPress={() => selectPaymentOption()}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Make Payment</Text>
          </TouchableOpacity>}

          {submitting && <TouchableOpacity 
            // onPress={() => selectPaymentOption}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {showNormal  && <View>
            <Dialog.Container visible={visible}>
              <Dialog.Title>Attention!!!</Dialog.Title>
              <Dialog.Description>
                Please select the paymet type you desire?
              </Dialog.Description>
              <Dialog.Button label="Cancel" onPress={handleCancel}/>

              {showOptions && !submittingConfirm && <TouchableOpacity
                style={styles.addTransactionButton}
                onPress={handleFromWallet}
                >
                  <Text style={styles.buttonText}>From Wallet</Text>
              </TouchableOpacity>}

              {submittingConfirm && <TouchableOpacity 
                // onPress={handleFromWallet}
                style={styles.addTransactionButton}>
                  <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
              </TouchableOpacity>}

              {!submittingConfirm && <PayWithFlutterwave
                // style={styles.addTransactionButton}
                onRedirect={handleFromAddedFunds}
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
                      <Text style={styles.buttonText}>Add Funds</Text>
                  </TouchableOpacity>
                )}
              />}

            </Dialog.Container>
          </View>}
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
