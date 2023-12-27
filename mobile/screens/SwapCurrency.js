import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator,
        Dimensions
      } from 'react-native';
import  axios from 'axios'
import {Octicons} from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import {randomString} from '../services';
const { primary} = Colors;
import  {FLUTTERWAVE_SECRET_KEY, BaseUrl, MAIN_CURRENCY_BALANCE, FLUTTERWAVE_API_URL, DEFAULT_CURRENCY, MULTIPLE_CURRENCY_LIMIT}  from '../services/index';
import { Colors,MsgBox,StyledContainer} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import  {allowedInternationalCurrencies}  from '../services/index'; 
import { CredentialsContext } from '../components/CredentialsContext';
import Carousel from 'react-native-snap-carousel'

export default function SwapCurrency({route}) {
  const {storedCredentials} = useContext(CredentialsContext)
  let {email, token, name} = storedCredentials
  // const {balance} = route.params
  const {balance, multipleCurrencyObject, hasMultipleCurrency} = route.params
  // console.log(multipleCurrencyObject)
  var balanceArray = []
  if (multipleCurrencyObject && multipleCurrencyObject.length > 0 
    // && multipleCurrencyObject[0] !== 0
    ) {
    multipleCurrencyObject.forEach((item) => {
      balanceArray.push(`${item.toCurrency} - ${item.newBalanceToAfterTransaction}`)
    })
  } else {
    balanceArray.push(`${DEFAULT_CURRENCY} - ${balance}`)
  }

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
  const [balances, setBalances] = useState()
  const [sourceCurrencyBalance, setSourceCurrencyBalance] = useState()
  const [prevBalanceFrom, setPreviousBalanceFrom] = useState(+0.00)
  const [prevBalanceTo, setPreviousBalanceTo] = useState(+0.00)
  const [mainCurrency, setMainCurrency] = useState(DEFAULT_CURRENCY)
  const [mainBalance, setMainBalance] = useState(+0.00)

  // console.log(multipleCurrencyObject)
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  useEffect(() => {
    if (multipleCurrencyObject && (multipleCurrencyObject.length > 0) && (multipleCurrencyObject[0] !== 0)) {
      multipleCurrencyObject.forEach((item) => {
        if (destinationCurrency === item.toCurrency) {
          setPreviousBalanceFrom(item.balance);
        }

        if (sourceCurrency === item.toCurrency) {
          setPreviousBalanceTo(item.balance);
        }

        if (MAIN_CURRENCY_BALANCE === item.toCurrency) {
          setMainCurrency(item.toCurrency);
        }

        if (MAIN_CURRENCY_BALANCE === item.toCurrency) {
          setMainCurrency(item.toCurrency);
          setMainBalance(item.balance)
        }
      });
    } else {
      setMainBalance(balance);
    }
    // else {
    //   setPreviousBalanceFrom(+0.00);
    //   setPreviousBalanceTo(+0.00);
    // } 
  }, [multipleCurrencyObject, destinationCurrency, sourceCurrency]);

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
  }

  const {width,height} = Dimensions.get('window')
  const carouselRef = useRef(null)
  const RenderItem = ({item, index}) => {
    return(
      <View style={styles.balanceView}>
        <Text style={styles.balanceText}>
          TOTAL BALANCE (s)
        </Text>
        <Text style={styles.balanceValue}>
          {item.balance || '0.00'} {item.toCurrency} 
        </Text>
      </View>
    )
  }

  const handleSwapCurrency = () => {  
    // console.log('here return')
    // console.log( multipleCurrencyObject.length)
    // return
        setSubmitting(true)  
        handleMessage("")
        
        if (amount > +sourceCurrencyBalance) {
          handleMessage("You do not have sufficient funds to complete this transaction")
          alert("You do not have sufficient funds to complete this transaction")
          setSubmitting(false)
          return
        }

        if (sourceCurrency == destinationCurrency) {
          handleMessage("Your source currency and destination currency cannot be thesame")
          alert("Your source currency and destination currency cannot be thesame")
          setSubmitting(false)
          return
        }

        // console.log(multipleCurrencyObject.length, multipleCurrencyObject)

        if (multipleCurrencyObject && (multipleCurrencyObject.length > 0) && (multipleCurrencyObject[0] !== 0)) {
          let found = false;
          for(let i = 0; i < multipleCurrencyObject.length; i++) {
            if ( multipleCurrencyObject[i].sourceCurrency === destinationCurrency ||
              multipleCurrencyObject[i].destinationCurrency === sourceCurrency || multipleCurrencyObject[i].destinationCurrency === destinationCurrency
              ) {
              found = true;
              break;
            }
          }
        }
        

        if (multipleCurrencyObject.length === MULTIPLE_CURRENCY_LIMIT && (found === false)) {
          console.log('heree')
          handleMessage("You cannot hold more than 3 currencies at this time");
          alert("You cannot hold more than 3 currencies at this time");
          setSubmitting(false);
          return;
        }
    
        if ( destinationCurrency == null || sourceCurrency == null || amount == null) {
          handleMessage("Please enter destination currency and source currency to get rates")
          alert("Please enter destination currency and source currency to get rates")
          setSubmitting(false)
          return
        }
      
        var config = {
          method: 'get',
          url: `${FLUTTERWAVE_API_URL}/transfers/rates?amount=${amount}&destination_currency=${sourceCurrency}&source_currency=${destinationCurrency}`,
          headers: { 
            'Authorization': FLUTTERWAVE_SECRET_KEY, 
            'Content-Type': 'application/json'
          },
        };

        axios(config)
        .then(function (response) {
        // console.log(response.data, '----response')
        // console.log(prevBalanceFrom, prevBalanceTo, '----i got here o')
        if (response.data.status == "success") {
          const responseDestinationAmount = response.data.data.source.amount;
          const responseDestinationCurrency = response.data.data.source.currency;
          const responseSourceAmount = response.data.data.destination.amount;
          const responseSourceCurrency = response.data.data.destination.currency;
          const responseRate = response.data.data.rate;
          const responseConvertedAmount = +response.data.data.source.currency * +amount;
          const responseNewCurrency = +response.data.data.destination.currency;

            // setDestinationAmount(responseDestinationAmount)
            // setDestinationCurrency(responseDestinationCurrency)
            // setSourceAmount(responseSourceAmount)
            // setSourceCurrency(responseSourceCurrency)
            // setRate(responseRate)
            // setConvertedAmount(responseConvertedAmount)
            // setNewCurrency(responseNewCurrency)

            // console.log(
            //   responseRate,
            //   destinationCurrency,
            //   response.data.data.destination.amount,
            //   responseDestinationAmount,
            //   response.data.data.destination.currency,
            //   sourceCurrency,
            //   response.data.data.source.currency,
            //   responseSourceAmount,
            //   response.data.data.rate,
            //   '---result'
            // )
            let updatedAmount = amount; // Start with the current state value
            let isMainCurrencyDestinationTo = false;
            let isMainCurrencySourceFrom = false;
            let updatedAmountSource = '';
            let updatedAmountDestination = '';
            if (multipleCurrencyObject && (multipleCurrencyObject.length > 0) && (multipleCurrencyObject[0] !== 0)) {
              for (let i = 0; i < multipleCurrencyObject.length; i++) {
                  // const item = multipleCurrencyObject[i];
                // console.log(sourceCurrency, '--amount before');
                
                if (MAIN_CURRENCY_BALANCE === sourceCurrency) {
                  console.log('hereeeeeee')
                  isMainCurrencySourceFrom = true;
                  updatedAmountSource = updatedAmount * (updatedAmount * +responseRate);
                  break; // Exit the loop
                }
                if (MAIN_CURRENCY_BALANCE === destinationCurrency) {
                  console.log(222222)
                  isMainCurrencyDestinationTo = true;
                  // console.log(responseRate,updatedAmount,amount, '--------inside here');
                  updatedAmountDestination = updatedAmount * (updatedAmount * +responseRate);
                  // console.log(updatedAmount, '---inside updated amount')
                  break; // Exit the loop
                }
              }
            }
             
            console.log(MAIN_CURRENCY_BALANCE === sourceCurrency,'upest')
            console.log(MAIN_CURRENCY_BALANCE, destinationCurrency, sourceCurrency, '----')
            console.log(isMainCurrencySourceFrom, updatedAmountSource,  'destinaion amount')
            console.log(mainBalance, '--main balance')
            console.log(isMainCurrencyDestinationTo, '---main currrency to')
            console.log(mainBalance, updatedAmountDestination, '2 currencies')
            console.log(+(mainBalance - +updatedAmountDestination), '--what should be')
            // console.log(isMainCurrencyDestinationTo ? +(mainBalance + +updatedAmountDestination)  :  +(mainBalance - +updatedAmountDestination))
            // console.log("Updated amount destination :, ", updatedAmountDestination)
            // console.log("main currency destination to:", isMainCurrencyDestinationTo)
            // console.log(+mainBalance - +(isMainCurrencyDestinationTo ? +updatedAmountDestination :  +0.00))
            // setSubmitting(false)
            // return;

            const data = {
              transactionId: transactionId,
              email: email,
              transactionType: 'swapcurrency',
              transactionName: 'swapcurrency',
              details: "Swap Currency",
              amount: amount,
              // currencyHoldingBalance: +prevBalanceFrom,
              newBalanceFromAfterTransaction: +sourceCurrencyBalance - +amount,
              prevBalanceFrom: +sourceCurrencyBalance,
              newBalanceToAfterTransaction: +prevBalanceFrom + (amount * response.data.data.rate),
              prevBalanceTo: +prevBalanceFrom,
              mainBalanceBeforeTransaction: +mainBalance,
              // mainBalanceAfterTransaction:   +mainBalance - +(isMainCurrencyDestinationTo ? +updatedAmountDestination :  +0.00),
              mainBalanceAfterTransaction:  isMainCurrencyDestinationTo ? +(mainBalance + +updatedAmountDestination) :  
                                            isMainCurrencySourceFrom ? +(mainBalance - +amount) :
                                            (+mainBalance - amount),
              mainCurrency: mainCurrency,
              transactionCurrency: response.data.data.destination.currency,
              destinationCurrency: response.data.data.destination.currency,
              destinationAmount: response.data.data.destination.amount,
              sourceCurrency: response.data.data.source.currency,
              sourceAmount: response.data.data.source.amount,
              convertedAmount: response.data.data.rate * amount,
              rate: response.data.data.rate,
              token: `Bearer ${token}`
            }

            // console.log(data, '--data')
            // setSubmitting(false)
            // setDestinationAmount('')
            // setDestinationCurrency('')
            // setSourceAmount('')
            // setSourceCurrency('')
            // setRate('')
            // setConvertedAmount('')
            // setNewCurrency('')
            // return

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

                // console.log(result)
                // return
              if (status === 'SUCCESS') {
                handleMessage(message, status)
                setSubmitting(false)
                alert(message)

                setDestinationAmount('')
                setDestinationCurrency('')
                setSourceAmount('')
                setSourceCurrency('')
                setRate('')
                setConvertedAmount('')
                setNewCurrency('')
                setAmount('')
              } else {
                handleMessage("An error occured", 'FAILED')
                setSubmitting(false)
              }

              setDestinationAmount('')
              setDestinationCurrency('')
              setSourceAmount('')
              setSourceCurrency('')
              setRate('')
              setConvertedAmount('')
              setNewCurrency('')
              setAmount('')

            })
            .catch(function (error) {
              console.log(error.message, 'response from aff transacton');
              handleMessage(error.message, 'FAILED')
              alert(error.message)
              setSubmitting(false)
            })

              setSubmitting(false)
              setShowResult(true)

            } else {
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
          {/* {hasMultipleCurrency && <View style={{ alignItems: 'center', justifyContent: 'center'}}>
            <Carousel 
              // layout={"tinder"}
              layout={"default"}
              ref={carouselRef}
              data={multipleCurrencyObject}
              renderItem={RenderItem}
              sliderWidth={width}
              itemWidth={width}
              swipeThreshold={100}
              layoutCardOffset={-12}
              inactiveSlideOpacity={0.4}
              autoplay={true}
              autoplayDelay={1000} // Adjust the delay as needed (in milliseconds)
              autoplayInterval={3000} // Adjust the interval as needed (in milliseconds)
              // containerCustomStyle={{
              // overflow: 'visible',
              // marginVertical: 0
              // }}
              contentContainerCustomStyle={{
                paddingTop: 10,
                paddingLeft: 60
              }}
            />
          </View>} */}

        {!hasMultipleCurrency && <View style={styles.balanceView}>
            <Text style={styles.balanceText}>Hello {name || 'There !'}</Text>
            {/* <Text style={styles.balanceText}>{email || 'mosesegboh@gmail.com'}</Text> */}
            {/* <Text style={styles.balanceText}>{token || 'token'}</Text> */}
            <Text style={styles.balanceText}>
              TOTAL BALANCE
            </Text>
            <Text style={styles.balanceValue}>
              ₦{balance || '0.00'}
            </Text>
            {/* <TouchableOpacity onPress={clearLogin} style={styles.balanceValue}>
                <Text>Logout</Text>
            </TouchableOpacity> */}
        </View>}

          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <SelectDropdown
            search={true}
            data={balanceArray}
            onSelect={(selectedItem, index) => { 
              setSourceCurrency(selectedItem.split(' - ')[0])
              setSourceCurrencyBalance(selectedItem.split(' - ')[1])
            }}
            defaultButtonText = "Source Currency Balances"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
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