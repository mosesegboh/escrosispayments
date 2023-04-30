import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Platform, Switch } from 'react-native';
import {Octicons} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {randomString} from '../services/';
const { primary, myPlaceHolderTextColor } = Colors;
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {allCountriesAbbreviations}  from '../services/index';
import  {allowedInternationalCurrencies}  from '../services/index'; 
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import {getCountryCurrency} from '../services/index';
import {countriesAndCurrencies} from '../services/index';
import { allowedAfricanCountries } from '../services/';
import {BaseUrl} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import { StyledContainer, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, Colors, MsgBox, myButton} from '../components/styles';
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from 'react-native-date-picker'
import {Picker} from '@react-native-picker/picker';

export default function Transfer({route}) {
  const { storedCredentials } = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params
  const transferScopeOptions = ['local', 'International']
  const [selectedValue, setSelectedValue] = useState("ONCE");
  const [show, setShow] = useState(false);
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValueAccount, setInputValueAccount] = useState();
  const [transactionId, setTransactionId] = useState();
  const [narration, setNarration] = useState(false);
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [banks, setBanks] = useState()
  const [countries, setCountries] = useState(['NG'])
  const [currency, setCurrency] = useState();
  const [sourceCurrency, setSourceCurrency] = useState();
  const [transferScope, setTransferScope] = useState();
  const [rate, setRate] = useState();
  const [countrySelected, setCountrySelected] = useState();
  const [localBanks, setLocalBanks] = useState(true);
  const [availableCurrency, setAvailableCurrency] = useState(['NGN']);
  const [localCountries, setLocalCountries] = useState(['NG']);
  const [africanTransfer, setAfricanTransfer] = useState(false)
  const [internationalTransfer, setInternationalTransfer] = useState(false)
  const [internationBankName, setInternationalBankName] = useState()
  const [beneficiaryName, setBeneficiaryName] = useState()
  const [routingNumber, setRoutingNumber] = useState()
  const [swiftCode, setSwiftCode] = useState()
  const [destinationCurrency, setDestinationCurrency] = useState()
  const [destinationAmount, setDestinationAmount] = useState()
  const [sourceAmount, setSourceAmount] = useState();
  const [showRateDetails, setShowRateDetails] = useState(false)
  const [destinationBranchCode, setDestinationBranchCode] = useState()
  const [destinationCountry, setDestinationCountry] = useState()
  const [postalCode, setPostalCode] = useState()
  const [streetNumber, setStreetNumber] = useState()
  const [streetName, setStreetName] = useState()
  const [city, setCity] = useState()
  const [countryData, setCountryData] = useState()
  const [isLocalTransfer, setIsLocalTransfer] = useState(true)
  const [getBanks, setGetBanks] = useState()
  const [branchCode, setBranchCode] = useState()
  const [mobileNumber, setMobileNumber] = useState()
  const [isGUZT, setIsGUZT] = useState(false)
  const [isEurGbp, setIsEurGbp] = useState(false)
  const [beneficiaryFirstName, setBeneficiaryFirstName] = useState()
  const [beneficiaryLastName, setBeneficiaryLastName] = useState()
  const [beneficiaryEmail, setBeneficiaryEmail] =useState()
  const [beneficiaryMobile, setBeneficiaryMobile] =useState()
  const [beneficiaryAddress, setBeneficiaryAddress] = useState()
  const [sender, setSender] = useState()
  const [senderCountry, setSenderCountry] = useState()
  const [senderMobile, setSenderMobile] = useState()
  const [isUsdAccount, setIsUsdAccount] = useState(false)
  const [isNigerianDorm, setIsNigerianDorm] = useState(false)
  const [isFcmbDorm, setIsFcmbDorm] = useState();
  const [isUnionDorm, setIsUnionDorm] = useState(false)
  const [isFidelityDorm, setIsFidelityDorm] = useState(false)
  const [senderOccupation, setSenderOccupation] = useState()
  const [senderCity, setIsSenderCity] = useState()
  const [merchantName, setMerchantName] = useState()
  const [beneficiaryStreetName, setBeneficiaryStreetName] = useState()
  const [senderIdType, setSenderIdType] = useState()
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [transferPurpose, setTransferPurpose] = useState() 
  const [senderIdExpiryDate, setSenderIdExpiryDate] = useState()
  const [senderIdNumber, setSenderIdNumber] = useState()
  const [dob, setDob] = useState()
  const [senderAddress, setSenderAddress] = useState()
  const [senderBeneficiaryRelationship, setSenderBeneficiaryRelationship] = useState()
  const [beneficiaryCountry, setBeneficiaryCountry] = useState()
  const [beneficiaryOccupation, setBeneficiaryOccupation] = useState()
  const [mode, setMode] = useState()
  const [text, setText] = useState()
  const [isLocalDomiciliary, setIsLocalDomiciliary] = useState(false);

  const toggleSwitch = () => {
    // setIsLocalDomiciliary(!isLocalDomiciliary)
    if(isLocalDomiciliary == true){
      setIsLocalDomiciliary(false);
    }else{
      setIsLocalDomiciliary(true)
    }
    console.log(isLocalDomiciliary, 'this is local')
  };
  
  useEffect(()=>{
    setCountryData(allCountriesAbbreviations)
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
    
    var config = {
    method: 'get',
    url: `${FLUTTERWAVE_API_URL}/banks/${localCountries[0]}`,
    headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
    };

    axios(config)
    .then(function (response) {// console.log(JSON.stringify(response.data.data), 'this is data');
      setBanks(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  },[]);

  const handleMessage = (message,type="FAILED") => {
      setMessage(message)
      setMessageType(type)    
  }

  const handleTransfer = (text) => {
    if ( email == null || inputValueAmount == null || inputValueAccount == null || selectedValue == null || transactionId == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {
      // console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insufficient balance to complete this transaction, Kindly add funds to your wallet")
      alert("You have insufficient balance to complete this transaction, Kindly add funds to your wallet")
      return
    }

    setSubmitting(true)

    var data = transferScope == 'local' ? 
    {
      account_bank: localBanks,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      currency: sourceCurrency,
      reference: transactionId,
      callback_url: `${BaseUrl}/webhook/feedback`,
      debit_currency: currency,
      transactionType: transferScope,
    } 
    
    : 
    transferScope == 'African' ?  {
      account_bank: localBanks,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      currency: sourceCurrency,
      reference: transactionId,
      transactionType: transferScope,
      callback_url: `${BaseUrl}/webhook/feedback`,
      debit_currency: destinationCurrency,
      destination_branch_code: branchCode,
      transferType: transferScope,
      ...(1 >= 18 ? { isAdult: true, canVote: true } : {}),
      meta: {
        AccountNumber: inputValueAccount,
        RoutingNumber: routingNumber,
        SwiftCode: swiftCode,
        BankName: internationBankName,
        BeneficiaryName: beneficiaryName,
        BeneficiaryCountry: destinationCountry,
        PostalCode: postalCode,
        StreetNumber: streetNumber,
        StreetName: streetName,
        City: city,
        mobile_number: mobileNumber,
        sender: sender,
        sender_country: sourceCountry,
      }
    } 
    :
    transferScope == 'International' ? 
    {
      account_bank: localBanks,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      currency: sourceCurrency,
      reference: transactionId,
      transactionType: transferScope,
      callback_url: `${BaseUrl}/webhook/feedback`,
      debit_currency: sourceCurrency,
      destination_branch_code: branchCode,
      transferType: transferScope,
      meta: {
        AccountNumber: inputValueAccount,
        RoutingNumber: routingNumber,
        SwiftCode: swiftCode,
        BankName: internationBankName,
        BeneficiaryName: beneficiaryName,
        BeneficiaryCountry: destinationCountry,
        PostalCode: postalCode,
        StreetNumber: streetNumber,
        StreetName: streetName,
        City: city
      }
    } 
    :
    '';

    console.log(data, 'this is the data')
    return
          
    var config = {
      method: 'post',
      url: `${FLUTTERWAVE_API_URL}/transfers`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data.data));
      const result = response.data

      // console.log(result, 'this is result')
      const { status, message} = result;

      // console.log(status, '--status')
      
      if (status === 'success') {
        // console.log('i got inside here')
        data.email = email
        data.transactionType = 'transfer'
        data.transactionName = 'transfer'
        data.details = narration
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`
        // console.log(data, '--this is success')
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

      }else{
        handleMessage("An error occured", 'FAILED')
        setSubmitting(false)
      }
    })
    .catch(function (error) {
      // console.log(error.response.data.message, 'response fom api call');
      // handleMessage(error.response.data.message, 'FAILED')
      alert(error.message)
      setSubmitting(false)
    });      
  }

  const showDatePicker = () => {
    setShow(true);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform === 'ios');
    setDate(currentDate);
    setDob(currentDate);
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  // const handleChange = (name, value) => {
  //   setFormValues(prevState => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleGetRate = () => {    
    if (transferScope == 'local') {
      return
    }
  
    if (inputValueAmount ) {
      if ( inputValueAmount == null || destinationCurrency == null || sourceCurrency == null ) {
        handleMessage("Please enter amount, destination currency and source currency to get rates")
        alert("Please enter amount, destination currency and source currency to get rates")
        return
      }
    }

    console.log(`${FLUTTERWAVE_API_URL}/transfers/rates?amount=${inputValueAmount}&destination_currency=${destinationCurrency}&source_currency=${sourceCurrency}`)
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
      console.log(response.data)
      if (response.data.status == "success") {
        setDestinationAmount(response.data.data.destination.amount)
        setDestinationCurrency(response.data.data.destination.currency)
        setSourceAmount(response.data.data.source.amount)
        setSourceCurrency(response.data.data.source.currency)
        setRate(response.data.data.rate)
        setShowRateDetails(true)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
  )
  }

  const handleSelectedCountry = (country) => {
    setCountrySelected(country)
    setLocalCountries([country])
    var config = {
      method: 'get',
      url: `${FLUTTERWAVE_API_URL}/banks/${country}`,
      headers: { 
          'Authorization': FLUTTERWAVE_SECRET_KEY, 
          'Content-Type': 'application/json'
      },
    };
  
    axios(config)
    .then(function (response) {
    // console.log(JSON.stringify(response.data.data), 'this is data');
      setBanks(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleSelectedBanks = (banks) => {
    setLocalBanks(banks.code)
    if (transferScope == "African") {
      var config = {//make api call to get the list of banks branch codes.
        method: 'get',
        url: `${FLUTTERWAVE_API_URL}/banks/${banks.id}/branches`,
        headers: { 
            'Authorization': FLUTTERWAVE_SECRET_KEY, 
            'Content-Type': 'application/json'
          },
        };
    
        axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data.data[0].branch_code), 'this is data');
          setBranchCode(response.data.data[0].branch_code)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark"/>
          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <SelectDropdown
            data={transferScopeOptions}
            onSelect={(selectedItem, index) => {// console.log(selectedItem, index)
              if (selectedItem == "International") {
                setInternationalTransfer(true)
                setTransferScope('International')
                setIsLocalTransfer(false)
                setCountries(allowedInternationalCurrencies)
              } else {
                setInternationalTransfer(false)
                setCountries(['NG'])
                setTransferScope('local')
                setIsLocalTransfer(true)
              }
            }}
            defaultButtonText="Transfer Scope"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: -20 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}// text represented after item is selected--if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => { return item }}// text represented for each item in dropdown// if data array is an array of objects then return item.property to represent item in dropdown 
          />

          {(internationalTransfer || isAfricanTransfer) && <SelectDropdown
            data={availableCurrency}
            onSelect={(selectedItem, index) => { setSourceCurrency(selectedItem) }}
            defaultButtonText="Source Currency"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 5 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}// text represented after item is selected--if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => { return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown 
          />}

          {!isLocalTransfer && <SelectDropdown
            data={countries}
            search={true}
            onSelect={(selectedItem, index) => {
              setDestinationCurrency(getCountryCurrency(countriesAndCurrencies , selectedItem))
              handleSelectedCountry(selectedItem); 
              setSourceCountry(selectedItem); 
              if(selectedItem == 'ZAR'){
                setIsZarAccount(true)
              }else if (selectedItem == 'KES') {
                setIsKesAccount(true); setIsZarAccount(false);
              }else if (selectedItem == 'GHS' || selectedItem == 'UGX' || selectedItem == 'ZMW' || selectedItem == 'TZS') {
                setIsGUZT(true); setIsKesAccount(false); setIsZarAccount(false); setIsZarAccount(false);
              }else if (selectedItem == 'EUR' || selectedItem == 'GBP') {
                setIsEurGbp(true); setIsGUZT(false); setIsKesAccount(false); setIsZarAccount(false); setIsZarAccount(false);
              }else if (selectedItem == 'USD') {
                setIsUsdAccount(true); setIsEurGbp(false); setIsGUZT(false); setIsKesAccount(false); setIsZarAccount(false); setIsZarAccount(false);
              }else{}
            }}
            defaultButtonText="Recipient Currency"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          {(!internationalTransfer || isNigerianDorm) && <SelectDropdown
            data={banks}
            search={true}
            onSelect={(selectedItem, index) => { 
              console.log(selectedItem)
              handleSelectedBanks(selectedItem)
              if ( selectedItem.name == 'Fidelity Bank') {
                setIsFidelityDorm(true); setIsFcmbDorm(false);
              }else if (selectedItem.name == 'Union Bank') {
                setIsUnionDorm(true); setIsFidelityDorm(false); setIsFcmbDorm(false);
              }else if (selectedItem.name == 'First City Monument Bank' && isLocalDomiciliary == true) {
                setIsFcmbDorm(true); setIsUnionDorm(false); setIsFidelityDorm(false);
              }else{
                setIsUnionDorm(true); setIsFidelityDorm(false); setIsFcmbDorm(false);
              }
            }}
            defaultButtonText="Local Banks"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito',}}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0}}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem.name  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => { return item.name }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{color: '#949197', marginLeft: 10, fontFamily: 'Nunito'}}>Local Domiciliary Account: </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isLocalDomiciliary ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isLocalDomiciliary}
            />
          </View>

          {isGUZT && <TextInput
              editable={false}
              style={styles.input}
              placeholder="Branch Code"
              placeholderTextColor="#949197" 
              type="text"
              value={branchCode}
          />}

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={amount => setInputValueAmount(amount)}
            value={inputValueAmount}
            onBlur={handleGetRate}
            onEndEditing={handleGetRate}
          />

          {showRateDetails && <Text style={styles.rateText}> {sourceAmount} will be deduced from your account and the receiver gets {destinationAmount} at rate: {rate} </Text>}

          <TextInput
            style={styles.input}
            placeholder="Recipient Account Number"
            placeholderTextColor="#949197" 
            type="number"
            keyboardType={'numeric'}
            onChangeText={account => setInputValueAccount(account)}
            value={inputValueAccount}
          />

          <TextInput
            style={styles.input}
            placeholder="Narration"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={narration => setNarration(narration)}
            value={narration}
          />

          {(isZarAccount || isNigerianDorm) && <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryFirstName(text)}
            value={beneficiaryFirstName}
          />}

          {(isZarAccount || isNigerianDorm) && <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryLastName(text)}
            value={beneficiaryLastName}
          />}

          {(isZarAccount || (isFcmbDorm && isLocalDomiciliary)) && <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryEmail(text)}
            value={beneficiaryEmail}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Sender Occupation"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setSenderOccupation(text)}
            value={senderOccupation}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Sender Address"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryOccupation(text)}
            value={beneficiaryOccupation}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Beneficiary Occupation"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryOccupation(text)}
            value={beneficiaryOccupation}
          />}

          {(isFidelityDorm || isUnionDorm) && <TextInput
            style={styles.input}
            placeholder="Sender City"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setIsSenderCity(text)}
            value={senderCity}
          />}

          {isNigerianDorm && <TextInput
            style={styles.input}
            placeholder="Merchant Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setMerchantName(text)}
            value={merchantName}
          />}

          {isFcmbDorm && <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSenderIdType(itemValue)}
          >
            <Picker.Item label="Drivers Liscence" value="drivers license" />
            <Picker.Item label="Passport" value="passport" />
            <Picker.Item label="National ID" value="national id" />
          </Picker>}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Transfer Purpose"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setTransferPurpose(text)}
            value={transferPurpose}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Sender ID number"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setSenderIdNumber(text)}
            value={senderIdNumber}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Sender Address"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setSenderAddress(text)}
            value={senderAddress}
          />}

          {isFcmbDorm && <TextInput
            style={styles.input}
            placeholder="Sender Beneficiary Relationship"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setSenderBeneficiaryRelationship(text)}
            value={senderBeneficiaryRelationship}
          />}

          {isFcmbDorm && <MyTextInput 
            icon="calendar"
            placeholder="YYYY - MM - DD"
            placeholderTextColor={myPlaceHolderTextColor}
            // onChangeText={handleChange('dateOfBirth')}
            // onBlur = {handleBlur('dateOfBirth')}
            value={dob ? dob.toDateString() : ''}
            isDate={true}
            editable = {false}
            showDatePicker = {showDatePicker}
            onPress={() => showMode('date')}
          />}

          {show && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}

          {(isZarAccount || isFcmbDorm) && <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setBeneficiaryMobile(text)}
            value={beneficiaryMobile}
          />}

          {(isZarAccount || isUsdAccount) && <TextInput
            style={styles.input}
            placeholder="Beneficiary Address"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryAddress(text)}
            value={beneficiaryAddress}
          />}

          {(isKesAccount || isNigerianDorm) && <TextInput
            style={styles.input}
            placeholder="Sender Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setSender(text)}
            value={sender}
          />}

          {isKesAccount && <TextInput
            style={styles.input}
            placeholder="Sender Mobile Number"
            placeholderTextColor="#949197" 
            keyboardType="number"
            onChangeText={text => setSenderMobile(text)}
            value={sender}
          />}

          {(isKesAccount || isEurGbp || isUsdAccount || isFcmbDorm) && <SelectDropdown
            data={allCountriesAbbreviations}
            search={true}
            onSelect={(selectedItem, index) => { 
              setSenderCountry(selectedItem)
              selectedItem == 'NG' ? setIsNigerianDorm(true) 
              : '' 
            }}
            defaultButtonText="Sender Country"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          {isFcmbDorm && <SelectDropdown
            data={allCountriesAbbreviations}
            search={true}
            onSelect={(selectedItem, index) => { 
              setBeneficiaryCountry(selectedItem)
              selectedItem == 'NG' ? setIsNigerianDorm(true) 
              : '' 
            }}
            defaultButtonText="Beneficiary Country"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          {(isEurGbp || isUsdAccount) && <TextInput
            style={styles.input}
            placeholder="Swift Code"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={code => setSwiftCode(code)}
            value={swiftCode}
          />}

          {(isEurGbp || isUsdAccount) && <TextInput
            style={styles.input}
            placeholder="Routing Number"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={routing => setRoutingNumber(routing)}
            value={routingNumber}
          />}

          {(isEurGbp || isUsdAccount) && <TextInput
            style={styles.input}
            placeholder="Bank Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={bank => setInternationalBankName(bank)}
            value={inputValueAccount}
          />}

          {(isGUZT || isEurGbp || isUsdAccount) && <TextInput
            style={styles.input}
            placeholder="Beneficiary Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={name => setBeneficiaryName(name)}
            value={beneficiaryName}
          />}

          {isEurGbp && <View style={styles.rowDirection}>
            <TextInput
                style={styles.inputHalf}
                placeholder="Street Number"
                placeholderTextColor="#949197" 
                type="number"
                onChangeText={number => setStreetNumber(number)}
                value={streetNumber}
              />

              <TextInput
                style={styles.inputHalf}
                placeholder="Postal Code"
                placeholderTextColor="#949197" 
                type="number"
                onChangeText={code => setPostalCode(code)}
                value={setPostalCode}
              />

              <SelectDropdown
                data={countryData}
                search={true}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index)
                  setDestinationCountry(selectedItem)
                }}
                defaultButtonText="country"
                buttonStyle={{
                  paddingTop: 30,
                  backgroundColor: '#1b181f',
                  borderBottomColor: '#949197',
                  borderBottomWidth: 1,
                  borderRadius: 3,
                  color: '#fff',
                  margin: 10,
                  paddingTop: 10,
                  fontFamily: 'Nunito',
                  fontSize: 5,
                  width: '25%',
                  height: '75%',
                }}
                renderDropdownIcon = {renderDropdownIcon}
                rowStyle={{
                  fontSize: 5,
                  fontFamily: 'Nunito',
                }}
                buttonTextStyle={{
                  color: '#fff',
                  fontFamily: 'Nunito',
                  fontSize: 14,
                }}
                rowTextStyle={{
                  marginLeft: 0
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
              />
          </View>}

          {(isEurGbp || isUsdAccount) && <View style={styles.rowDirection}>
            <TextInput
              style={styles.inputHalf50}
              placeholder="Street Name"
              placeholderTextColor="#949197"   
              type="text"
              onChangeText={text => setBeneficiaryStreetName(text)}
              value={beneficiaryStreetName}
            />

            <TextInput
              style={styles.inputHalf50}
              placeholder="Beneficiary City"
              placeholderTextColor="#949197"   
              type="text"
              onChangeText={text => setBeneficiaryStreetName(text)}
              value={beneficiaryStreetName}
            />
          </View>}

          <MsgBox type={messageType}>{message}</MsgBox>

          {submitting && <TouchableOpacity 
            onPress={handleTransfer}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
            onPress={handleTransfer}
            style={styles.addTransactionButton}>
            <Text style={styles.buttonText}>Transfer</Text>
          </TouchableOpacity>}
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    backgroundColor: '#131112',    
    justifyContent: 'center',
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
  inputHalf: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#1b181f',
    borderBottomColor: '#949197',
    borderBottomWidth: 1,
    borderRadius: 3,
    color: '#fff',
    margin: 10,
    width: '28%'
  },
  inputHalf50: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#1b181f',
    borderBottomColor: '#949197',
    borderBottomWidth: 1,
    borderRadius: 3,
    color: '#fff',
    margin: 10,
    width: '44%'
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
  rateText: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomColor: '#949197',
    // borderBottomWidth: 1,
    borderRadius: 3,
    color: '#949197',
    margin: 10,
    marginBottom: 5,
    fontFamily: 'Nunito'
  },
  rowDirection: {
    flexDirection: 'row',
  },
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
  dropDownButtonStyleQuarter: {
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
    fontSize: 5,
    width: '25%',
    height: '75%',
  },
  dropDownButtonTextStyle: {
    color: '#949197',
    // marginLeft: -35,
    // marginRight: 150,
    fontFamily: 'Nunito',
    fontSize: 15,
  }
});


const MyTextInput = ({label, icon,isPassword,hidePassword,setHidePassword, 
  isDate, showDatePicker,...props}) => {
  return (<View>
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
      </View>)
}


         {/* <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            {clientCurrencies ? 
                clientCurrencies.map((item, index) => (
                    <Picker.Item key={item.id} label={item} value={item} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

          {/* <Picker
            selectedValue={transferScope}
            style={styles.picker}
            onValueChange={(transferScope, itemIndex) => handleSelectedTransfer(transferScope)}
          >
            <Picker.Item label="local" value="local" />
            <Picker.Item label="International" value="international" />
          </Picker> */}

          {/* <Picker
            selectedValue={currency}
            style={styles.picker}
            onValueChange={(currency, itemIndex) => handleSelectedValue(currency)}
          >
            {countries ? 
                countries.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

          {/* <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            {banks ? 
                banks.map((item, index) => (
                    <Picker.Item key={item.id} label={item.name} value={item.code} />
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
          </Picker> */}

// const handleSelectedTransfer = (text) => {
//   // console.log(typeof(text), 'this is inside function')
//   // setTransferScope(text)
//   if (text == "International") {
//   setInternationalTransfer(true)
//   setTransferScope('International')
//   setCountries(allowedInternationalCurrencies)
//     // setCountries([
//     //     'GH', 'KE', 'UG', 'ZA', 'TZ', 
//     //     'USD','AED', 'ARS', 'AUD', 'CAD', 
//     //     'CHF','CZK', 'ETB', 'EUR', 'GBP', 
//     //     'GHS', 'ILS', 'INR', 'JPY', 'KES', 
//     //     'MAD', 'MUR', 'MYR', 'NGN', 'NOK', 
//     //     'NZD', 'PEN', 'PLN', 'RUB', 'RWF', 
//     //     'SAR', 'SEK', 'SGD', 'SLL', 'TZS', 
//     //     'UGX', 'USD', 'XAF', 'XOF', 'ZAR', 
//     //     'ZMK', 'ZMW', 'MWK', 'GBP'
//     // ])
//     //   setCountries([
//     //     // 'NG', 'GH', 'KE', 'UG', 'ZA', 'TZ', 'US'
//     //     'USD','EUR','GBP'
//     // ])
//   }else if(text == "African"){
//     setInternationalTransfer(false)
//     setAfricanTransfer(true)
//     setCountries(['NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'])
//     setTransferScope('African')
//   }else{
//     setInternationalTransfer(false)
//     setCountries(['NG'])
//     setTransferScope('local')
//   }
// }

{/* {showRateDetails && <TextInput
            style={styles.input}
            placeholder="Destination Amount"
            placeholderTextColor="#949197" 
            // type="number"
            keyboardType={'numeric'}
            onChangeText={amount => setDestinationAmount(amount)}
            value={destinationAmount}
            onBlur={reverseHandleGetRate}
          />} */}

// if (selectedItem == "African"){
//   setInternationalTransfer(false)
//   setIsAfricanTransfer(true)
//   setCountries(allowedAfricanCountries)
//   setTransferScope('African')
//   setIsLocalTransfer(false)
// } 

{/* {africanTransfer && <TextInput
              style={styles.input}
              placeholder="Destination Branch Code"
              placeholderTextColor="#949197" 
              type="text"
              onChangeText={branchCode => setDestinationBranchCode(branchCode)}
              value={destinationBranchCode}
            />} */}