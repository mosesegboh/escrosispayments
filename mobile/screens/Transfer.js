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
// import { allowedAfricanCountries } from '../services/';
import {BaseUrl} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import { StyledContainer, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, Colors, MsgBox, myButton} from '../components/styles';
import SelectDropdown from 'react-native-select-dropdown'
// import DatePicker from 'react-native-date-picker'
import {Picker} from '@react-native-picker/picker';

export default function Transfer({route}) {
  const { storedCredentials } = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params
  const transferScopeOptions = ['local', 'International']
  // const [selectedValue, setSelectedValue] = useState();
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
  // const [africanTransfer, setAfricanTransfer] = useState(false)
  const [internationalTransfer, setInternationalTransfer] = useState(false)
  const [internationBankName, setInternationalBankName] = useState()
  const [beneficiaryName, setBeneficiaryName] = useState()
  const [routingNumber, setRoutingNumber] = useState()
  const [swiftCode, setSwiftCode] = useState()
  const [destinationCurrency, setDestinationCurrency] = useState()
  const [destinationAmount, setDestinationAmount] = useState()
  const [sourceAmount, setSourceAmount] = useState();
  const [showRateDetails, setShowRateDetails] = useState(false)
  // const [destinationBranchCode, setDestinationBranchCode] = useState()
  // const [destinationCountry, setDestinationCountry] = useState()
  const [postalCode, setPostalCode] = useState()
  const [streetNumber, setStreetNumber] = useState()
  // const [streetName, setStreetName] = useState()
  // const [city, setCity] = useState()
  const [countryData, setCountryData] = useState()
  const [isLocalTransfer, setIsLocalTransfer] = useState(true)
  // const [getBanks, setGetBanks] = useState()
  const [branchCode, setBranchCode] = useState()
  // const [mobileNumber, setMobileNumber] = useState()
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
  const [isFcmbDorm, setIsFcmbDorm] = useState(false);
  const [isUnionDorm, setIsUnionDorm] = useState(false)
  const [isFidelityDorm, setIsFidelityDorm] = useState(false)
  const [senderOccupation, setSenderOccupation] = useState()
  const [senderCity, setIsSenderCity] = useState()
  const [merchantName, setMerchantName] = useState()
  const [beneficiaryStreetName, setBeneficiaryStreetName] = useState()
  const [senderIdType, setSenderIdType] = useState('')
  const [date, setDate] = useState(new Date())
  // const [open, setOpen] = useState(false)
  const [transferPurpose, setTransferPurpose] = useState() 
  const [senderIdExpiryDate, setSenderIdExpiryDate] = useState()
  const [senderIdNumber, setSenderIdNumber] = useState()
  const [dob, setDob] = useState()
  const [senderAddress, setSenderAddress] = useState()
  const [senderBeneficiaryRelationship, setSenderBeneficiaryRelationship] = useState()
  const [beneficiaryCountry, setBeneficiaryCountry] = useState()
  const [beneficiaryOccupation, setBeneficiaryOccupation] = useState()
  const [mode, setMode] = useState()
  // const [text, setText] = useState()
  const [isLocalDomiciliary, setIsLocalDomiciliary] = useState(false);
  const [isAfricanTransfer, setIsAfricanTransfer] = useState(false);
  const [isZarAccount, setIsZarAccount] = useState(false)
  const [isKesAccount, setIsKesAccount] = useState(false)
  const [sourceCountry, setSourceCountry] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState(false)
  const [beneficiaryCity, setBeneficiaryCity] = useState(false)
  const [localBankName, setLocalBankName] = useState()
 
  // const toggleSwitch = () => {
  //   // setIsLocalDomiciliary(!isLocalDomiciliary)
  //   if (isLocalDomiciliary == true) {
  //     setIsLocalDomiciliary(true);
  //     console.log(isLocalDomiciliary, '--is local dorm')
  //   } else {
  //     setIsLocalDomiciliary(false)
  //     console.log(isLocalDomiciliary, '--is local other')
  //   }
  //   // console.log(isLocalDomiciliary, 'this is local')
  // };

  const toggleSwitch = () => {
    setIsLocalDomiciliary(previousState => !previousState);

    console.log(isFcmbDorm, isUnionDorm, isFidelityDorm, '--dorm status')

    if (localBankName == 'First City Monument Bank') {
      setIsFcmbDorm(true); setIsUnionDorm(false); setIsFidelityDorm(false);
    } else if (localBankName == 'Fidelity Bank') {
      setIsFcmbDorm(false); setIsUnionDorm(false); setIsFidelityDorm(true);
    }else if (localBankName == 'Union Bank') {
      setIsFcmbDorm(false); setIsUnionDorm(true); setIsFidelityDorm(false);
    }
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
    // console.log(isLocalDomiciliary, isFcmbDorm)

    if ( email == null || inputValueAmount == null || inputValueAccount == null || transactionId == null ) {
      // console.log(email,'i am inside here')
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if ( (isLocalDomiciliary == true) 
      && (localBanks == null 
        || beneficiaryFirstName == null || beneficiaryLastName == null
        || beneficiaryEmail == null || beneficiaryCountry == null
        || beneficiaryMobile == null || sender == null || sourceCurrency == null)) 
    {
        // console.log(beneficiaryMobile,  'mobile-number')
        setSubmitting(false)
        handleMessage("Please enter all fields")
        alert("Please enter all fields")
        return
    } else if ((isLocalDomiciliary == true && isFcmbDorm == true) 
      && (routingNumber == null || beneficiaryCountry == null
          || beneficiaryName == null || senderAddress == null
          || senderIdNumber == null || senderIdType == null 
          || senderIdExpiryDate == null || senderMobile == null
          || senderOccupation == null || senderBeneficiaryRelationship == null 
          || transferPurpose == null || sourceCurrency == null || senderCountry == null ))
    {
      // console.log(routingNumber,beneficiaryCountry,senderIdNumber, beneficiaryName, senderAddress
      // ,senderIdType,senderIdExpiryDate,senderMobile,senderOccupation, senderBeneficiaryRelationship,
      // transferPurpose,sourceCurrency, senderCountry,'--i am inside here')
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if ( (isLocalDomiciliary == true && (isFidelityDorm == true || isUnionDorm == true)) 
        && (senderCity == null || sourceCurrency == null) ) 
    {
      // console.log('is union or fideity')
        setSubmitting(false)
        handleMessage("Please enter all fields")
        alert("Please enter all fields")
        return
    } else if ((isUsdAccount == true) && ( routingNumber == null 
        || beneficiaryCountry == null || swiftCode == null
        || internationBankName == null || beneficiaryName == null || beneficiaryAddress == null)) 
    {
        // console.log(internationBankName, '999ii')
        setSubmitting(false)
        handleMessage("Please enter all fields")
        alert("Please enter all fields")
        return
    } else if ((isEurGbp == true) && ( routingNumber == null 
      || beneficiaryCountry == null || swiftCode == null
      || internationBankName == null || beneficiaryName == null || beneficiaryStreetName == null
      || streetNumber == null || postalCode == null || beneficiaryStreetName == null|| beneficiaryCity == null)) 
    {
      // console.log(beneficiaryStreetName, beneficiaryCity, postalCode, streetNumber, 
      // internationBankName, '---european submission')
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if ((isGUZT == true) && ( branchCode == null || beneficiaryName == null))
    {
      // console.log(branchCode, beneficiaryName, '--guzt submission')
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if ((isKesAccount == true) && ( sender == null || senderCountry == null || senderMobile == null))
    {
      // console.log(sender, senderCountry, senderMobile, '---kes submission')
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    } else if ((isZarAccount == true) && ( 
      beneficiaryFirstName == null || beneficiaryLastName == null || beneficiaryMobile == null || 
       recipientAddress == null))
    {
      // console.log(beneficiaryFirstName,beneficiaryLastName, beneficiaryMobile,
      // recipientAddress,  '--zar account submission')
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

    var data = {
      account_bank: localBanks,
      account_number: inputValueAccount,
      amount: inputValueAmount,
      narration: narration,
      currency: sourceCurrency,
      reference: transactionId,
      transferScope: transferScope,
      callback_url: `${BaseUrl}/webhook/feedback`,
      debit_currency: sourceCurrency,
      transactionType: transferScope,
      ...(isGUZT ? { destination_branch_code: branchCode, beneficiary_name: beneficiaryName } : {}),
      ...(((isLocalDomiciliary === true && isFcmbDorm === true) || isUsdAccount || isEurGbp) ? { beneficiary_name: beneficiaryName } : {}),
      ...(isLocalDomiciliary ? { meta: [{
        first_name: beneficiaryFirstName,
        last_name: beneficiaryLastName,
        email: beneficiaryEmail,
        beneficiary_country: beneficiaryCountry,
        mobile_number: beneficiaryMobile,
        sender: sender,
        merchant_name: merchantName
      }] } : {}),
      ...((isLocalDomiciliary === true && isFcmbDorm === true) ? { meta: [{
        email: beneficiaryEmail,
        beneficiary_country: beneficiaryCountry,
        beneficiary_occupation: beneficiaryOccupation,
        recipient_address: recipientAddress,
        mobile_number: beneficiaryMobile,
        sender: sender,
        sender_country: senderCountry,
        sender_id_number: senderIdNumber,
        sender_id_type: senderIdType,
        sender_id_expiry: senderIdExpiryDate,
        sender_mobile_number: senderMobile,
        sender_address: senderAddress,
        sender_occupation: senderOccupation,
        sender_beneficiary_relationship: senderBeneficiaryRelationship,
        transfer_purpose: transferPurpose
      }] } : {}),
      ...(isUsdAccount ? { meta: [{
        AccountNumber: inputValueAccount,
        RoutingNumber: routingNumber,
        SwiftCode: swiftCode,
        BankName: internationBankName,
        BeneficiaryName: beneficiaryName,
        BeneficiaryAddress: beneficiaryAddress,
        BeneficiaryCountry: beneficiaryCountry,
      }]} : {}),
      ...(isEurGbp ? { meta: [{
        AccountNumber: inputValueAccount,
        RoutingNumber: routingNumber,
        SwiftCode: swiftCode,
        BankName: internationBankName,
        BeneficiaryName: beneficiaryName,
        BeneficiaryCountry: beneficiaryCountry,
        PostalCode: postalCode,
        StreetNumber: streetNumber,
        StreetName: beneficiaryStreetName,
        City: beneficiaryCity
      }]} : {}),
      ...(isKesAccount ? { meta: [{
          sender: sender,
          sender_country: senderCountry,
          mobile_number: senderMobile
      }]} : {}),
      ...(isZarAccount ? { meta: [{
        first_name: beneficiaryFirstName,
        last_name: beneficiaryLastName,
        email: beneficiaryEmail,
        mobile_number: beneficiaryMobile,
        recipient_address: recipientAddress
    }]} : {}),

    } 
    
    
    console.log(data, '--this is the data')
    // return
          
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

      console.log(result, 'this is result flutterwave')
      // return

      const { status, message} = result;

      // console.log(status, '--status')
      if (status === 'success') {
        // console.log('i got inside here')
        data.email = email
        data.transactionType = 'transfer'
        data.transactionName = 'transfer'
        data.transferType = isUsdAccount ? 'isUsdAccount' 
        : isEurGbp ? 'isEurGbp'
        : isGUZT ? 'isGUZT'
        : isKesAccount ? 'isKesAccount'
        : isZarAccount ? 'isZarAccount'
        : isLocalDomiciliary && isFcmbDorm ? 'isLocalDomiciliaryandisFcmbDorm'
        : isLocalDomiciliary && (isFidelityDorm || isUnionDorm) ? 'isLocalDomiciliaryandisFidelityUnionDorm'
        : isLocalDomiciliary && (isFidelityDorm || isUnionDorm) ? 'isLocalDomiciliaryandisFidelityUnionDorm'
        : 'general'

        data.transferScope = transferScope
        data.details = narration
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`
        data.isLocalDomiciliary = isLocalDomiciliary
        data.beneficiaryCountry = countrySelected
        console.log(data, '--this is success')

        
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
    setSenderIdExpiryDate(currentDate);
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

    console.log(inputValueAmount, destinationCurrency, sourceCurrency, '--currency')
  
    if (inputValueAmount ) {
      if ( inputValueAmount == null || destinationCurrency == null || sourceCurrency == null ) {
        handleMessage("Please enter amount, destination currency and source currency to get rates")
        alert("Please enter amount, destination currency and source currency to get rates")
        return
      }
    }

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
    // console.log(country, '--country')
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
      // console.log(response.data.data, '--response from banks'),
      setBanks(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleSelectedBanks = (banks) => {
    //do conditions for not checking the bank code API's here
    //if its not local or arica
    setLocalBanks(banks.code)
    // console.log(banks.code, '--this is bank code')
    // if (transferScope !== "local") {
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
        // console.log(JSON.stringify(response.data.data[0].branch_code), 'this is branch code');
        setBranchCode(response.data.data[0].branch_code)
      })
      .catch(function (error) {
        console.log(error);
      });
    // }
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
                setIsUsdAccount(false)
                setTransferScope('local')
                setIsLocalTransfer(true)
                setIsKesAccount(false); setIsZarAccount(false); setIsNigerianDorm(false);
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

          {!isLocalTransfer && <SelectDropdown
            data={countries}
            search={true}
            onSelect={(selectedItem, index) => {
              setDestinationCurrency(getCountryCurrency(countriesAndCurrencies , selectedItem, "currency"))
              handleSelectedCountry(getCountryCurrency(countriesAndCurrencies , selectedItem, "country")); 
              setSourceCountry(selectedItem); 
              if (selectedItem == 'ZAR') {
                setIsZarAccount(true); setIsEurGbp(false); setIsGUZT(false); setIsKesAccount(false); setIsFidelityDorm(false); setIsUnionDorm(false); setIsUsdAccount(false); setIsAfricanTransfer(true);
              } else if (selectedItem == 'KES') {
                setIsKesAccount(true); setIsZarAccount(false); setIsNigerianDorm(false); setIsFidelityDorm(false); setIsGUZT(false); setIsUnionDorm(false); setIsUsdAccount(false); setIsAfricanTransfer(true);
              } else if (selectedItem == 'GHS' || selectedItem == 'UGX' || selectedItem == 'ZMW' || selectedItem == 'TZS') {
                setIsGUZT(true); setIsKesAccount(false); setIsZarAccount(false); setIsFidelityDorm(false); setIsUnionDorm(false); setIsEurGbp(false); setIsUsdAccount(false); setIsAfricanTransfer(true);
              } else if (selectedItem == 'EUR' || selectedItem == 'GBP') {
                setIsEurGbp(true); setIsGUZT(false); setIsKesAccount(false); setIsZarAccount(false); setIsFidelityDorm(false); setIsUnionDorm(false); setIsUsdAccount(false); setIsAfricanTransfer(false);
              } else if ((selectedItem == 'USD')) {
                setIsUsdAccount(true); setIsEurGbp(false); setIsGUZT(false); setIsKesAccount(false); setIsZarAccount(false); setIsFidelityDorm(false); setIsUnionDorm(false); setIsAfricanTransfer(false);
              } else {
                setIsUsdAccount(false); setIsEurGbp(false); setIsGUZT(false); setIsKesAccount(false); setIsZarAccount(false); setIsFidelityDorm(false); setIsUnionDorm(false); setIsAfricanTransfer(false);
              }
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


          {(!internationalTransfer || isNigerianDorm || isLocalDomiciliary || isGUZT || isKesAccount) && <SelectDropdown
            data={banks}
            search={true}
            onSelect={(selectedItem, index) => { 
              // console.log(selectedItem.name, '--local comiciliary')
              // console.log('i am here')
              setLocalBankName(selectedItem.name)
              // console.log(localBankName, '--local')

              // setTimeout(() => {
              //   console.log(localBankName, 'testtest'); // Log the updated localBankName value after a short delay
              // }, 5000);
              
              handleSelectedBanks(selectedItem)
              if ( selectedItem.name == 'Fidelity Bank' && isLocalDomiciliary == true ) {
                setIsFidelityDorm(true); setIsFcmbDorm(false); setIsUnionDorm(false)
              }else if (selectedItem.name == 'Union Bank' && isLocalDomiciliary == true) {
                setIsUnionDorm(true); setIsFidelityDorm(false); setIsFcmbDorm(false);
              }else if (selectedItem.name == 'First City Monument Bank') {
                setIsFcmbDorm(true); setIsUnionDorm(false); setIsFidelityDorm(false);
              }else{
                setIsUnionDorm(false); setIsFidelityDorm(false); setIsFcmbDorm(false);
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

          {!internationalTransfer && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{color: '#949197', marginLeft: 10, fontFamily: 'Nunito'}}>Local Domiciliary Account: </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isLocalDomiciliary ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isLocalDomiciliary}
            />
          </View>}

          {(isLocalDomiciliary || transferScope == "International" ) && <SelectDropdown
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

          {(isGUZT) && <TextInput
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

          {((isEurGbp || isUsdAccount) && (transferScope == "International")) && <TextInput
            style={styles.input}
            placeholder="Swift Code"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={code => setSwiftCode(code)}
            value={swiftCode}
          />}

          {(isEurGbp || isUsdAccount || (isLocalDomiciliary && isFcmbDorm)) && <TextInput
            style={styles.input}
            placeholder="Routing Number"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={routing => setRoutingNumber(routing)}
            value={routingNumber}
          />}

          {((isEurGbp || isUsdAccount) && transferScope == "International") && <TextInput
            style={styles.input}
            placeholder="Bank Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={bank => setInternationalBankName(bank)}
            value={internationBankName}
          />}

          <TextInput
            style={styles.input}
            placeholder="Narration"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={narration => setNarration(narration)}
            value={narration}
          />

          {(isZarAccount || isNigerianDorm || isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryFirstName(text)}
            value={beneficiaryFirstName}
          />}

          {(isZarAccount || isNigerianDorm || isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryLastName(text)}
            value={beneficiaryLastName}
          />}

          {(isZarAccount || isFcmbDorm || isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryEmail(text)}
            value={beneficiaryEmail}
          />}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Sender Occupation"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setSenderOccupation(text)}
            value={senderOccupation}
          />}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.textAreaStyle}
            placeholder="Sender Address"
            multiline = {true}
            numberOfLines = {3}
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setSenderAddress(text)}
            value={senderAddress}
          />}

          {((isFidelityDorm || isUnionDorm) && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Sender City"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setIsSenderCity(text)}
            value={senderCity}
          />}

          {(isNigerianDorm || isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Merchant Name - Optional"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setMerchantName(text)}
            value={merchantName}
          />}

          {(isFcmbDorm && isLocalDomiciliary) && <Picker
            selectedValue={senderIdType}
            style={styles.picker}
            onValueChange={(senderIdType, itemIndex) => setSenderIdType(senderIdType)}
          >
            <Picker.Item label="Drivers Liscence" value="drivers license" />
            <Picker.Item label="Passport" value="passport" />
            <Picker.Item label="National ID" value="national id" />
          </Picker>}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Transfer Purpose"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setTransferPurpose(text)}
            value={transferPurpose}
          />}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Sender ID number"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setSenderIdNumber(text)}
            value={senderIdNumber}
          />}

          {(isLocalDomiciliary && isFcmbDorm) && <TextInput
            style={styles.input}
            placeholder="Recipient Address"
            multiline = {true}
            numberOfLines = {3}
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setRecipientAddress(text)}
            value={recipientAddress}
          />}

          

          {(isFcmbDorm && isLocalDomiciliary) && <MyTextInput 
            icon="calendar"
            placeholder=" ID expiry - YYYY - MM - DD"
            placeholderTextColor={myPlaceHolderTextColor}
            value={dob ? dob.toDateString() : ''}
            isDate={true}
            editable = {false}
            showDatePicker = {showDatePicker}
            onPress={() => showMode('date')}
            style={styles.input}
          />}

          {show && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}

          {(isLocalDomiciliary || isZarAccount) && <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType={'numeric'}
            onChangeText={text => setBeneficiaryMobile(text)}
            value={beneficiaryMobile}
          />}

          {(isZarAccount || isUsdAccount || isFcmbDorm) && <TextInput
            style={styles.input}
            placeholder="Beneficiary Address"
            multiline = {true}
            numberOfLines = {3}
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryAddress(text)}
            value={beneficiaryAddress}
          />}

          {(isKesAccount || isNigerianDorm || isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Sender Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setSender(text)}
            value={sender}
          />}

          {(isKesAccount || isFcmbDorm) && <TextInput
            style={styles.input}
            placeholder="Sender Mobile Number"
            placeholderTextColor="#949197" 
            keyboardType={'numeric'}
            onChangeText={text => setSenderMobile(text)}
            value={senderMobile}
          />}

          {((isFcmbDorm && isLocalDomiciliary) || isKesAccount) && <SelectDropdown
            data={allCountriesAbbreviations}
            search={true}
            onSelect={(selectedItem, index) => { 
              setSenderCountry(selectedItem)
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

          {( isUsdAccount || isFcmbDorm || isLocalDomiciliary) && <SelectDropdown
            data={allCountriesAbbreviations}
            search={true}
            onSelect={(selectedItem, index) => { 
              setBeneficiaryCountry(selectedItem)
            }}
            defaultButtonText = "Beneficiary Country"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />}

          {(isGUZT || isEurGbp || isUsdAccount || (isLocalDomiciliary && isFcmbDorm)) && <TextInput
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
                  setBeneficiaryCountry(selectedItem)
                }}
                defaultButtonText="Country"
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
                  placeholderTextColor:"#949197"
                }}
                renderDropdownIcon = {renderDropdownIcon}
                rowStyle={{
                  fontSize: 5,
                  fontFamily: 'Nunito',
                  placeholderTextColor:"#949197"
                }}
                buttonTextStyle={{
                  color: '#fff',
                  fontFamily: 'Nunito',
                  fontSize: 13,
                  placeholderTextColor:"#949197" 
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

          {(isEurGbp) && <View style={styles.rowDirection}>
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
              onChangeText={text => setBeneficiaryCity(text)}
              value={beneficiaryCity}
            />
          </View>}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Beneficiary Occupation"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={text => setBeneficiaryOccupation(text)}
            value={beneficiaryOccupation}
          />}

          {(isFcmbDorm && isLocalDomiciliary) && <TextInput
            style={styles.input}
            placeholder="Sender Beneficiary Relationship"
            placeholderTextColor="#949197" 
            type="text"
            keyboardType='number'
            onChangeText={text => setSenderBeneficiaryRelationship(text)}
            value={senderBeneficiaryRelationship}
          />}

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
  textAreaStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#1b181f',
    borderBottomColor: '#949197',
    borderBottomWidth: 1,
    borderRadius: 3,
    color: '#fff',
    margin: 10,
    fontFamily: 'Nunito',
    textAlignVertical: 'top'
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
    width: '28%',
    fontFamily: 'Nunito'
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
    width: '44%',
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