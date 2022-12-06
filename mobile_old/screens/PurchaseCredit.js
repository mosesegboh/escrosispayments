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
//api
import  axios from 'axios'
//DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
//services
import {randomString} from '../services/';
//flutterwave
import {PayWithFlutterwave} from 'flutterwave-react-native';

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
//Colors
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import {Autocomplete} from 'react-native-autocomplete-input';

export default function PurchaseCredit({navigation}) {
  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

  //context
  let {email, token} = storedCredentials

  const [selectedValue, setSelectedValue] = useState("FirstLeg");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [secondLegTransactionInput, setSecondLegTransactionInput] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [details, setDetails] = useState();
  const [input, setInput] = useState();
  const [data, setData] = useState([]);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [disabled, setDisabled] = useState(false)
  
  useEffect(()=>{
    //generate transaction ID
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());

    //make api call to get all the available bill services
    
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
            // placeholder="Transactionssss ID"
            // placeholderTextColor="#949197" 
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
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
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

          <TextInput
            style={styles.input}
            placeholder="Second Leg Transaction"
            placeholderTextColor="#949197"
            onChangeText={secondLeg => setSecondLeg(secondLeg)}
            value={secondLeg} 
          />

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

          {/* {!submitting && <PayWithFlutterwave
            // style={styles.addTransactionButton}
            onRedirect={handleOnRedirect}
            // onWillInitialize = {handleOnRedirect}
            options={{
              tx_ref: transactionId,
              authorization: 'FLWPUBK_TEST-3f746dcb908cfa7a7c6088ed4e05388c-X',
              customer: {
                email: email
              },
              amount: Number(inputValueAmount),
              currency: 'NGN',
              payment_options: 'card'
            }}
            customButton={(props) => (
              <TouchableOpacity
                style={styles.addTransactionButton}
                onPress={testDisabled() == true ? props.onPress : onPress}
                isBusy={props.isInitializing}
                disabled={disabled}
                >
                  <Text style={styles.buttonText}>Add Transaction</Text>
              </TouchableOpacity>
            )}
            // disabled: true
          />} */}

          {/* {!submitting && <TouchableOpacity 
            onPress={handleAddTransaction}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Add Transation</Text>
          </TouchableOpacity>} */}

          <TouchableOpacity 
            onPress={navigateConfirmTransaction}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>

         
          
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
