import React, { useState, useEffect, useContext } from 'react';
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
import { CredentialsContext } from '../components/CredentialsContext';

export default function SwapCurrency({route}) {
  const {storedCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params
  const [transactionId, setTransactionId] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [destinationCurrency, setDestinationCurrency] = useState()
  const [destinationAmount, setDestinationAmount] = useState()
  const [sourceCurrency, setSourceCurrency] = useState(['NG'])
  const [sourceAmount, setSourceAmount] = useState()
  const [rate, setRate] = useState()
  const [showResult, setShowResult] = useState(false)
  const [amount, setAmount] = useState(amount)
  const [updatedBalance, setUpdatedBalance] = useState()
  const  [convertedAmount, setConvertedAmount] = useState()
  const [newCurrency, setNewCurrency] = useState()

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

  const handleSwapCurrency = () => {  
        setSubmitting(true)  
        handleMessage("")
        console.log(amount, destinationCurrency, sourceCurrency, '--datae')

        if (amount > balance) {
            handleMessage("You do not have sufficient funds to complete this transaction")
            alert("You do not have sufficient funds to complete this transaction")
            setSubmitting(false)
            return
        }
    
        if ( destinationCurrency == null || sourceCurrency == null || amount == null) {
        handleMessage("Please enter destination currency and source currency to get rates")
        alert("Please enter destination currency and source currency to get rates")
        setSubmitting(false)
        return
        }

    
        console.log(`${FLUTTERWAVE_API_URL}/transfers/rates?amount=${amount}&destination_currency=${destinationCurrency}&source_currency=${sourceCurrency}`)
        // var config = {
        //   method: 'get',
        //   url: `${FLUTTERWAVE_API_URL}/transfers/rates?amount=${amount}&destination_currency=${destinationCurrency}&source_currency=${sourceCurrency}`,
        //   headers: { 
        //     'Authorization': FLUTTERWAVE_SECRET_KEY, 
        //     // 'Content-Type': 'application/json'
        //   },
        // };
        var axios = require('axios');

        var config = {
            method: 'get',
            url: 'https://api.flutterwave.com/v3/transfers/rates?amount=100&destination_currency=CAD&source_currency=NGN',
            headers: { 
                'Authorization': 'FLWSECK_TEST-b6f850878ce0d9e3ba061e0da47afa56-X'
            }
        };

        axios(config)
        .then(function (response) {
        // console.log(response.data)
        if (response.data.status == "success") {
            setDestinationAmount(response.data.data.source.amount)
            setDestinationCurrency(response.data.data.source.currency)
            setSourceAmount(response.data.data.destination.amount)
            setSourceCurrency(response.data.data.destination.currency)
            setRate(response.data.data.rate)
            setConvertedAmount(response.data.data.source.currency/amount)
            setNewCurrency(response.data.data.destination.currency)

            // console.log(
            //     destinationCurrency,
            //     response.data.data.destination.amount,
            //     destinationAmount,
            //     response.data.data.destination.currency,
            //     sourceCurrency,
            //     response.data.data.source.currency,
            //     sourceAmount,
            //     response.data.data.rate,
            //     '---result'
            // )
            
            // setSubmitting(false) 
            // return
            const data = {
                email: email,
                transactionType: 'swapcurrency',
                transactionName: 'swapcurrency',
                details: "Swap Currency",
                amount: amount,
                destinationCurrency: response.data.data.source.currency,
                destinationAmount: response.data.data.source.amount,
                sourceCurrency: response.data.data.destination.currency,
                sourceAmount: response.data.data.source.amount,
                convertedAmount: response.data.data.rate/amount,
                rate: response.data.data.rate
            }

            // console.log(data, '--data')

            // setSubmitting(false) 
            // return

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

                setSubmitting(false)
                setShowResult(true)
            }else{
                setSubmitting(false)
                alert('An error occured')
                console.log(error);
            }
            })
            .catch(function (error) {
            setSubmitting(false)
            console.log(error, 'error from api');
            alert('An error occured')
            });
    }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <View>
            <View style={styles.balanceView}>
            
            {/* <Text style={styles.balanceText}>{email || 'mosesegboh@gmail.com'}</Text> */}
            {/* <Text style={styles.balanceText}>{token || 'token'}</Text> */}
            <Text style={styles.balanceText}>
                CURRENT BALANCE
            </Text>
            <Text style={styles.balanceValue}>
                ₦{balance || '0.00'}
            </Text>
            {/* <TouchableOpacity onPress={clearLogin} style={styles.balanceValue}>
                <Text>Logout</Text>
            </TouchableOpacity> */}
            </View>

          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

         <TextInput
            style={styles.input}
            placeholder="How much do you want to swap from your balance"
            placeholderTextColor="#949197" 
            type="number"
            // keyboardType={'numeric'}
            onChangeText={amount => setAmount(amount)}
            value={amount}
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
            data={sourceCurrency}
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
            onPress={handleSwapCurrency}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleSwapCurrency}
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Swap Currency</Text>
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
    balanceView: {
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
});