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
import {BaseUrl} from '../services/'
import Dialog from "react-native-dialog";
import { CredentialsContext } from '../components/CredentialsContext';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
  StyledContainer
} from '../components/styles';
const {myButton, myPlaceHolderTextColor, darkLight, primary} = Colors;
import {Octicons, Ionicons} from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
// import { FLUTTERWAVE_PUBLIC_KEY } from '../services';
// import {PayWithFlutterwave} from 'flutterwave-react-native';

export default function AddTransaction({navigation, route}) {
  const {storedCredentials} = useContext(CredentialsContext)

  let {email, token} = storedCredentials
  const {balance} = route.params
  const [selectedValue, setSelectedValue] = useState("FirstLeg");

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState()
  const [dob, setDob] = useState();

  const [inputValueAmount, setInputValueAmount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [transactionParty, setTransactionParty] = useState();
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
  const [transactionLegs, setTransactionLegs] = useState(['FirstLeg', 'SecondLeg'])
  const [transactionParties, setTransactionParties] = useState(['Buyer', 'Seller'])
  const [searchTrasactionSecondLeg, setSearchTrasactionSecondLeg] = useState([])
  const [secondPartyEmail, setSecondPartyEmail] = useState()
  const [secondPartyPhone, setSecondPartyPhone] = useState()
  const [transactionLeg, setTransactionLeg] = useState()
  const [editable, setEditable] = useState(true)
  var [searchResultData, searchResultAmount, transactionRedemptionDate, transactionDetails, searchTransactionParty] = [[], [], [], [], []];

  
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

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const selectPaymentOption = () => {
    setSubmitting(true)
    console.log(email, inputValueAmount,dob, transactionId, details, transactionLeg )
    if ( email == null || inputValueAmount == null || dob == null || transactionId == null || details == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }
    
    if (inputValueAmount > balance) {

      setSubmitting(false)
      handleMessage("Kindly add funds to your wallet")
      alert("Kindly add funds to your wallet")
      return
     
      // setVisible(true)
      // setShowOptions(false)
      // setShowNormal(true)
    }
    // else if(inputValueAmount < balance) {
    //   setVisible(true)
    //   setShowOptions(true)
    // }
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

    if ( email == null || inputValueAmount == null || dob == null || transactionId == null || details == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {

      setSubmitting(false)
      handleMessage("Kindly add funds to your wallet from the dashboard")
      alert("Kindly add funds to your wallet from the dashboard")
      return
    }

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
      transactionType: transactionLeg,
      date: date,
      transactionName: "escrow",
      details: details,
      ...((secondPartyEmail !== undefined) ? { secondPartyEmail: secondPartyEmail } : {}),
      ...((secondPartyEmail !== undefined) ? { secondPartyPhone: secondPartyPhone } : {}),
      transactionParty: transactionParty,
      transactFromWallet: transactFromWallet,
      transactFromAddedFunds: transactFromAddedFunds,
      secondLegTransactionId: secondLeg ? secondLeg : 0.00,
      token: `Bearer ${token}`
    }

    // console.log(credentials, '--credentials--');
    // setSubmitting(false);
    // return
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
        setTransactionParty(null)
        setInputValueAmount(null)
        setSecondPartyEmail(null)
        setSecondPartyPhone(null)
        setTransactionLeg(null)
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
    // console.log('get data')
    if (text.length > 2) {
      const url = `${BaseUrl}/transaction/get-transactions?searchSecondLeg=${text}`
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const credentials = {
        email: email,
        token: `Bearer ${token}`
      }

      axios.post(url, credentials,headers ).then((response) => {
        const result = response.data;
        if (result.data.length > 0) {
          result.data.forEach((item, index) => {
            searchResultData.push(item.transactionId);
            searchResultAmount.push(item.amount)
            transactionRedemptionDate.push(item.redemptionDate)
            transactionDetails.push(item.details)
            searchTransactionParty.push(item.transactionParty)
          });
        }
        setSearchTrasactionSecondLeg(searchResultData);
        setInputValueAmount(String(searchResultAmount[0]))
        setEditable(false);
        setDetails(transactionDetails[0])
        let dateObject = new Date(transactionRedemptionDate);
        let formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;
        setDob(formattedDate);
        // searchTransactionParty[0] === "Buyer" ? setTransactionParty("Seller") : setTransactionParty("Buyer")
        console.log(searchTransactionParty[0], 'ooooo')
        // console.log(searchResultAmount[0],typeof(searchResultAmount[0]) ,transactionRedemptionDate[0],searchResultData, transactionDetails[0], '--options')
      }).catch((error) => {
          console.log(error)
          setSubmitting(false)
          handleMessage("An error occured, check your network and try again")
      })
    }
  }

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

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
  )}

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <View>
          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <SelectDropdown
            data={transactionLegs}
            onSelect={(selectedItem, index) => { 
              handleSelectedValue(selectedItem)
              setTransactionLeg(selectedItem)
            }}
            defaultButtonText = "Transaction Leg"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          {showSecondLeg && <SelectDropdown
            search={true}
            onChangeSearchInputText = {(text) => {searchTransactionId(text)}}
            data={searchTrasactionSecondLeg}
            onSelect={(selectedItem, index) => { 
              setTransactionParty(selectedItem)
              console.log(searchResultAmount, 'iii')
              // setInputValueAmount('test amount')
            }}
            defaultButtonText = "Search Second Leg Transaction Leg"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            keyboardType={'numeric'}
            onChangeText={value => setInputValueAmount(value)}
            value={inputValueAmount}
            editable={editable}
          />        

          <SelectDropdown
            data={transactionParties}
            onSelect={(selectedItem, index) => { 
              setTransactionParty(selectedItem)
            }}
            defaultButtonText = "Transaction Leg"
            onPress={editable ? undefined : () => {}}
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem;  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          {!showSecondLeg && <TextInput
            style={styles.input}
            placeholder="Second Party Email"
            placeholderTextColor="#949197"
            onChangeText={text => setSecondPartyEmail(text)}
            value={secondPartyEmail}
          />}

          {!showSecondLeg && <TextInput
            style={styles.input}
            placeholder="Second Party Phone"
            placeholderTextColor="#949197"
            onChangeText={text => setSecondPartyPhone(text)}
            value={secondPartyPhone} 
          />}

          <MyTextInput 
            icon="calendar"
            placeholder="Transaction Redemption Date"
            placeholderTextColor={myPlaceHolderTextColor}
            value={dob ? dob :  ''}
            isDate={true}
            editable = {editable}
            showDatePicker = {showDatePicker}
            onPress={() => showMode('date')}
            style={styles.input}
            onPressIn = {toggleDatePicker}
          />

          {show && editable && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            style={{height: 120,
              marginTop: -10,
              color: "#fff"}}
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

          <TextInput
            style={styles.input}
            placeholder="Details"
            placeholderTextColor="#949197"
            onChangeText={details => setDetails(details)}
            value={details}
            editable={editable}
          />

          <MsgBox type={messageType}>{message}</MsgBox>

          {!submitting && 
            <TouchableOpacity 
            onPress={/*() => selectPaymentOption()*/handleFromWallet}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Make Payment</Text>
          </TouchableOpacity>}

          {submitting && <TouchableOpacity 
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {showNormal  && <View>
            <Dialog.Container visible={visible}>
              <Dialog.Title>Attention!</Dialog.Title>
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

              {/* {!submittingConfirm && <PayWithFlutterwave
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
              />} */}
            </Dialog.Container>
          </View>}
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
      paddingTop: 20,
      backgroundColor: '#1b181f',
      borderBottomColor: '#949197',
      borderBottomWidth: 1,
      borderRadius: 3,
      color: '#fff',
      margin: 10,
      fontFamily: 'Nunito'
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
