import React, { useState, useEffect } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator
      } from 'react-native';
import  axios from 'axios'
import {Octicons} from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import {randomString} from '../services';
const { primary} = Colors;
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import { Colors,MsgBox,StyledContainer} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import  {allowedInternationalCurrencies}  from '../services/index'; 

export default function GetRate() {
  const [transactionId, setTransactionId] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [destinationCurrency, setDestinationCurrency] = useState()
  const [destinationAmount, setDestinationAmount] = useState()
  const [sourceCurrency, setSourceCurrency] = useState()
  const [sourceAmount, setSourceAmount] = useState()
  const [rate, setRate] = useState()
  const [showResult, setShowResult] = useState(false)

  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
  }

  const handleGetRate = () => {    
    console.log(destinationCurrency, sourceCurrency, '--currency')
    const inputValueAmount = 1
    handleMessage("")
  
    if ( destinationCurrency == null || sourceCurrency == null ) {
      handleMessage("Please enter destination currency and source currency to get rates")
      alert("Please enter destination currency and source currency to get rates")
      setSubmitting(false)
      return
    }
    setSubmitting(true)
    // console.log(`${FLUTTERWAVE_API_URL}/transfers/rates?amount=${inputValueAmount}&destination_currency=${destinationCurrency}&source_currency=${sourceCurrency}`)
    var config = {
      method: 'get',
      url: `${FLUTTERWAVE_API_URL}/transfers/rates?amount=${inputValueAmount}&destination_currency=${destinationCurrency}&source_currency=${sourceCurrency}`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
    };

    axios(config)
    .then(function (response) {
      // console.log(response.data)
      if (response.data.status == "success") {
        setDestinationAmount(response.data.data.destination.amount)
        setDestinationCurrency(response.data.data.destination.currency)
        setSourceAmount(response.data.data.source.amount)
        setSourceCurrency(response.data.data.source.currency)
        setRate(response.data.data.rate)
        // setShowRateDetails(true)
        setSubmitting(false)
        setShowResult(true)
      }
    })
    .catch(function (error) {
      setSubmitting(false)
      console.log(error);
    });
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <View>
          {showResult && <View style={styles.resultView}>
            <Text style={styles.balanceValue}>
              {destinationAmount || '0.00'} {destinationCurrency} = 
            </Text>
            <Text style={styles.balanceText}>
              Rate:
            </Text>
            <Text style={styles.balanceValue}>
              {rate || '0.00'} {sourceCurrency}
            </Text>
          </View>}

          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <SelectDropdown
            search={true}
            data={allowedInternationalCurrencies}
            onSelect={(selectedItem, index) => { 
              setDestinationCurrency(selectedItem)
            }}
            defaultButtonText = "Destination Currency"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <SelectDropdown
          search={true}
            data={allowedInternationalCurrencies}
            onSelect={(selectedItem, index) => { 
              setSourceCurrency(selectedItem)
            }}
            defaultButtonText = "Source Currency"
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
            onPress={handleGetRate}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleGetRate}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Get Rate</Text>
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
    resultView: {
        backgroundColor: 'rgba(59, 96, 189, 0.2)',
        height: 130,
        width: '99%',
        flexDirection: 'column',
        alignSelf: 'center',
        // borderRadius: 3,
        marginTop: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceText: {
      color: "white",
      fontFamily: 'Nunito',
      fontSize: 15,
    },
    billsText: {
      color: "#3b60bd",
      fontSize: 10,
      fontWeight: '400',
      fontFamily: 'Nunito'
    },
    balanceValue: {
      color: "white",
      fontWeight: 'bold',
      fontSize: 25,
      fontFamily: 'Nunito'
    },
});