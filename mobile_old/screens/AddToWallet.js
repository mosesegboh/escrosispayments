import React, { useState, useEffect, useContext } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        Modal,
      } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {randomString} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';
import {Octicons, Ionicons} from '@expo/vector-icons';
import WalletConfirmModal from '../components/WalletConfirmModal';

const {myButton, myPlaceHolderTextColor, darkLight} = Colors;


export default function AddToWallet({navigation}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials

  const [selectedValue, setSelectedValue] = useState("FirstLeg");
  const [choseData, setChoseData] = useState()
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [hideButton, setHideButton] = useState(true)
  // const [details, setDetails] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [dob, setDob] = useState();
  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  const setData = (data) => {
    setChoseData(data)
  }

  const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setDob(currentDate);
  }

  const changeModalVisible = (bool) => {
    if ( inputValueAmount == null || dob == null || transactionId == null ){
      // setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }
      setIsModalVisible(bool)
  }

  const handleMessage = (message,type="FAILED") => {
      setMessage(message)
      setMessageType(type)
  }

  const showDatePicker = () => {
      setShow(true);
  }

  const transactionData = {
    email: email,
    transactionId: transactionId,
    amount: inputValueAmount,
    transactionType: selectedValue,
    transactionName: "wallet",
    date: dob,
    details: "Add Funds To Wallet",
    token: `Bearer ${token}`
  }

  const navigateConfirmTransaction = () => {
    if ( email == '' || inputValueAmount == '' || dob == '' || transactionId == '' || details == '' ) {
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

  const handleOnAbort = () => {
    alert ('The transaction failed. Try again later')
    return
  }

  return (
    <View style={styles.container}>
      <Text>{choseData}</Text>
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

            <MyTextInput 
                icon="calendar"
                placeholder="YYYY - MM - DD"
                placeholderTextColor={myPlaceHolderTextColor}
                value={dob ? dob.toDateString() : ''}
                isDate={true}
                editable = {false}
                showDatePicker = {showDatePicker}
            />

            <MsgBox type={messageType}>{message}</MsgBox>

            <TouchableOpacity 
              onPress={() => changeModalVisible(true)}
              style={styles.addTransactionButton}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType='fade'
              visible={isModalVisible}
              onRequestClose={() => changeModalVisible(false)}
            >
            <WalletConfirmModal 
              changeModalVisible={changeModalVisible}
              setData={setData}
              transactionData = {transactionData}
            />
          </Modal>
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
