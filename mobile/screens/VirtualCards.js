import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, 
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput, 
        ActivityIndicator,
        TouchableWithoutFeedback,
        Dimensions,
        Image,
        Animated,
        Platform,
        Modal,
      } from 'react-native';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {randomString} from '../services/';
const {myButton, darkLight, primary, myPlaceHolderTextColor} = Colors;
import {Octicons} from '@expo/vector-icons';
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import { CredentialsContext } from '../components/CredentialsContext';
// import SlidingUpPanel from 'rn-sliding-up-panel'
import Carousel from 'react-native-snap-carousel'
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown'
import  {allCountriesAbbreviations}  from '../services/index';
import {BaseUrl, trimString} from '../services/';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
  StyledContainer
} from '../components/styles';

export default function VirtualCard({route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params
  //date
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState()
  const [dob, setDob] = useState();

  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState();
  const [message, setMessage] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [messageType, setMessageType] = useState()
  const [currency, setCurrency] = useState()
  const [debitCurrency, setDebitCurrency] = useState()
  const [billingName, setBillingName] = useState()
  const [billingAddress, setBillingAddress] = useState()
  const [billingCity, setBillingCity] = useState()
  const [billingState, setBillingState] = useState()
  const [billingPostalCode, setBillingPostalCode] = useState()
  const [billingCountry, setBillingCountry] = useState()
  const [title, setTitle] = useState()
  const [gender, setGender] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [showForm, setShowForm] = useState(false)
  const [cards, setCards] = useState([
    {id: '38c9201a-fcb2-48fd-875e-6494ed79a6bb', cardName: 'Test  Name', CardNumber: '1234567789101112', expiryDate: '2/12', cvv: '123', status: 'active', key: '1', is_active: true, currency: 'USD' },
    {id: '38c9201a-fcb2-48fd-875e-6494ed79a6bb', cardName: 'Test  Name', CardNumber: '1234567789101112', expiryDate: '2/12', cvv: '123', status: 'active', key: '2', is_active: true, currency: 'USD'},
    {id: '38c9201a-fcb2-48fd-875e-6494ed79a6bb', cardName: 'Test  Name', CardNumber: '1234567789101112', expiryDate: '2/12', cvv: '123', status: 'active', key: '3', is_active: true, currency: 'USD'},
    {id: '38c9201a-fcb2-48fd-875e-6494ed79a6bb', cardName: 'Test  Name', CardNumber: '1234567789101112', expiryDate: '2/12', cvv: '123', status: 'blocked', key: '4', is_active: true, currency: 'USD'},
    {id: '38c9201a-fcb2-48fd-875e-6494ed79a6bb', cardName: 'Test  Name', CardNumber: '1234567789101112', expiryDate: '2/12', cvv: '123', status: 'blocked', key: '5', is_active: true, currency: 'USD'}
  ])
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cardName, setCardName] = useState()
  const [cardNumber, setCardNumber] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const [cvv, setCvv] = useState()
  const [cardId, setCardId] = useState()
  const [isActive, setIsActive] = useState()
  const [currentCardCurrency, setCurrentCardCurrency] = useState()

  const showDialog = (cardName, cardNumber, expiryDate, cvv, cardId, isActive, currentCardCurrency) => {
    // console.log(cardName, '--item')
    setCardName(cardName)
    setCardNumber(cardNumber)
    setExpiryDate(expiryDate)
    setCvv(cvv)
    setCardId(cardId)
    setDialogVisible(true)
    setIsActive(isActive)
    setCurrentCardCurrency(currentCardCurrency)
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };
  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
    // automatically start playing when component munts
    carouselRef.current.startAutoplay();
  },[isActive]);

  // Carousel data
  const Images= [
    {
      image: require('../assets/img/card2.png'),
    },
    {
      image: require('../assets/img/card1.png'),
    },
    {
      image: require('../assets/img/card3.png'),
    },
    {
      image: require('../assets/img/card4.png'),
    },
  ];
  const {width,height} = Dimensions.get('window')
  const carouselRef = useRef(null)
  const RenderItem = ({item}) => {
    return(
      <TouchableWithoutFeedback>
        <Image source={item.image} style={{width: 310, height: 180, borderRadius: 10}} />
      </TouchableWithoutFeedback>
    )
  }


  // SLIDING PANEL
  const [dragRange,setDragRange] = useState({
    top:height - 80,
    bottom: 160
  })
  const _draggedValue = new Animated.Value(180);
  const ModalRef = useRef(null);

  
  //date
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

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
  }

  const handleCreateVirtualCards = () => {
    // console.log(selectedValue, 'selected value')
    if ( email == null || inputValueAmount == null || inputValuePhone == null 
      || selectedValue == null || transactionId == null || billingAddress
      || billingCity == null || billingCountry == null || firstName
      || billingState == null || billingPostalCode == null || billingCountry
      || lastName == null || dob == null || title || gender
      ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {
      // console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insufficient balance to complete this transaction")
      alert("You have insufficient balance to complete this transaction")
      return
    }

    setSubmitting(true)

    var data = JSON.stringify({
      amount: inputValueAmount,
      debit_currency: debitCurrency,
      billing_name: billingName,
      billing_address: billingAddress,
      billing_city: billingCity,
      billing_state: billingState,
      billing_postal_code: billingPostalCode,
      billing_country: billingCountry,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email: email,
      phone: inputValuePhone,
      title: title,
      gender: gender,
      country: 'NG',
      reference: transactionId,
      callback_url: `${BaseUrl}/webhook/virtualcardfeedback`
    });

    console.log(data, '---this is data')
          
    var config = {
      method: 'post',
      url: `${FLUTTERWAVE_API_URL}/virtual-cards`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };
          
    axios(config)
    .then(function (response) {
      const result = response.data
      const { status, message, data} = result;
      
      if(status === 'success') {
        data.transactionType = 'virtualcards'
        data.transactionName = 'virtualcards'
        data.details = 'virtualcards'
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`
        data.data = data

        //make another api call to update client account
        var config = {
          method: 'post',
          url: `${BaseUrl}/transaction/virtual-card`,
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
            alert(error.message)
          }
        })
        .catch(function (error) {
          console.log(error.message, 'response from aff transacton');
          handleMessage(error.message, 'FAILED')
          alert(error.message)
          setSubmitting(false)
        })

      }else{
        handleMessage("An error occured from API", 'FAILED')
        setSubmitting(false)
        console.log('--backend call failed')
      }
    })
    .catch(function (error) {
      console.log(error.response.data.message, '---response fom api call');
      handleMessage(error.response.data.message, 'FAILED')
      alert(error.message)
      setSubmitting(false)
    });      
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 30}}>
       <Carousel 
          // layout={"tinder"}
          layout={"default"}
          ref={carouselRef}
          data={Images}
          renderItem={RenderItem}
          sliderWidth={width}
          itemWidth={width - 10}
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
      </View>

        <View style={{
            height: 380,
            width:'95%',
            backgroundColor: 'rgba(59, 96, 189, 0.2)',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            // borderRadius: 10,
          }}
        >

          {cards.map((item, index) => (
            <View style={{flexDirection:'row', margin: 8, padding: 5, borderRadius: 0}}>
              <Text style={{color: 'white', fontFamily: 'Nunito', textTransform: 'capitalize'}} key={item.id}>{trimString(item.cardName, 10)}</Text>
                <Text style={{color: 'white', fontFamily: 'Nunito', marginLeft: 40}} key={item.id}>{item.CardNumber.replace(/\d(?=\d{4})/g, '*')}</Text>
              <TouchableOpacity style={{marginLeft: 45}} onPress={() => showDialog(item.cardName, item.CardNumber, item.expiryDate, item.cvv, item.id, item.is_active, item.currency)}>
                <Octicons name="kebab-horizontal" size={24} color="white" />
              </TouchableOpacity>
            </View>    
          ))}

          <View>
            <DialogBox visible={dialogVisible} onClose={closeDialog}  cardName={cardName} cardNumber={cardNumber} expiryDate={expiryDate} cvv={cvv}/>
          </View>

          <TouchableOpacity 
            onPress={() => {setShowForm(!showForm)}}
            style={{
              backgroundColor: '#3a5fbc',
              height: 50,
              width: '95%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              flexDirection: 'row'
            }}>
            <Text style={{marginLeft: 10}}>Add a Card</Text>
            {(showForm == false) && <MaterialIcons name="keyboard-arrow-right" size={40} color="white" />}
            {(showForm == true) && <MaterialIcons name="keyboard-arrow-down" size={40} color="white" />}
          </TouchableOpacity>

        </View>
        
        {showForm && <View>
          <TextInput
            style={styles.input}
            value = {transactionId}
            editable={false}
          />

          <SelectDropdown
            data= {["Naira", "Dollar"]}
            // search={true}
            onSelect={(selectedItem, index) => { 
              // setSenderCountry(selectedItem)
              setCurrency(selectedItem)
            }}
            defaultButtonText="Currency"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <SelectDropdown
            data= {["NGN"]}
            // search={true}
            onSelect={(selectedItem, index) => { 
              // setSenderCountry(selectedItem)
              setDebitCurrency(selectedItem)
            }}
            defaultButtonText="Debit Currency"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <SelectDropdown
            data= {["Mr", "Mrs", "Master"]}
            // search={true}
            onSelect={(selectedItem, index) => { 
              setTitle(selectedItem)
              // setSelectedItem(selectedItem)
            }}
            defaultButtonText="Title"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <SelectDropdown
            data= {["M", "F"]}
            // search={true}
            onSelect={(selectedItem, index) => { 
              setGender(selectedItem)
              // setSelectedItem(selectedItem)
            }}
            defaultButtonText="Gender"
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
            placeholder="First Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={phone => setFirstName(phone)}
            value={firstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#949197"
            type="text"
            onChangeText={phone => setLastName(phone)}
            value={lastName}
          />

          <TextInput
            style={styles.input}
            placeholder="email"
            placeholderTextColor="#949197"
            type="text"
            onChangeText={phone => setEmail(phone)}
            value={email}
          />

          <TextInput
            style={styles.input}
            placeholder="Billing City"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={phone => setBillingCity(phone)}
            value={billingCity}
          />

          <TextInput
            style={styles.input}
            placeholder="Billing Name"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={phone => setBillingName(phone)}
            value={billingName}
          />

          <TextInput
            style={styles.input}
            placeholder="Billing State"
            placeholderTextColor="#949197" 
            type="text"
            onChangeText={phone => setBillingState(phone)}
            value={billingState}
          />

          <TextInput
            style={styles.input}
            placeholder="Billing Address"
            placeholderTextColor="#949197" 
            multiline = {true}
            numberOfLines = {3}
            type="text"
            onChangeText={phone => setBillingAddress(phone)}
            value={billingAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Billing Postal Code"
            placeholderTextColor="#949197" 
            multiline = {true}
            numberOfLines = {3}
            type="text"
            onChangeText={phone => setBillingPostalCode(phone)}
            value={billingPostalCode}
          />

          <SelectDropdown
            data={allCountriesAbbreviations}
            search={true}
            onSelect={(selectedItem, index) => { 
              setBillingCountry(selectedItem)
            }}
            defaultButtonText="Billing Country"
            buttonStyle={styles.dropDownButtonStyle}
            renderDropdownIcon = {renderDropdownIcon}
            rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
            buttonTextStyle={styles.dropDownButtonTextStyle}
            rowTextStyle={{ marginLeft: 0 }}
            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
            rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
          />

          <MyTextInput 
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
          />

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
            // display="default"
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
            placeholder="Phone Number"
            placeholderTextColor="#949197" 
            type="number"
            // keyboardType={'numeric'}
            onChangeText={phone => setInputValuePhone(phone)}
            value={inputValuePhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            keyboardType={'numeric'}
            onChangeText={text => setInputValuePhone(text)}
            value={inputValuePhone}
          />

          <MsgBox type={messageType}>{message}</MsgBox>

          {submitting && <TouchableOpacity 
          onPress={handleCreateVirtualCards}
          style={styles.addTransactionButton}>
            <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}

          {!submitting &&<TouchableOpacity 
          onPress={handleCreateVirtualCards}
          style={styles.addTransactionButton}>
            <Text style={styles.buttonText}>Create Card</Text>
          </TouchableOpacity>}
        </View>}

      </StyledContainer>      
    </KeyboardAvoidingWrapper>
  );
}

const DialogBox = ({ visible, onClose, cardName, cardNumber, expiryDate, cvv, cardId, isActive, currentCardCurrency }) => {
  const [showAddFundsInput, setShowAddFundsInput] = useState(false)
  const [addedCardFunds, setAddedCardFunds] = useState()
  const [blockedSubmitting, setBlockedSubmitting] = useState(false)
  const [terminateSubmitting, setTerminateSubmitting] = useState(false)
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState()
  // const [currentCardStatus, setCurrentCardStatus] = useState()

  useEffect(()=>{
  },[isActive])

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const handleBlockCard = (cardId, status) => {
    // return;
    setBlockedSubmitting(true)

    // const cardBlockStatus = (status == "block") ? "block" : "unblock"

    var config = {
      method: 'PUT',
      url: `${BaseUrl}/virtual-cards/${cardId}/${status}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    };

    axios(config)
    .then(function (response) {
      const result = response.data

      const { status, message } = result;

      if (status === 'success') {
        handleMessage(message, "SUCCESS")
        setBlockedSubmitting(false)
        setAddedCardFunds(false)
        alert(message)
        //make another call update our backend
      }else{
        handleMessage("An error occured", 'FAILED')
        setBlockedSubmitting(false)
        alert(error.message)
      }
    })
    .catch(function (error) {
      console.log(error.message, '---response from blocking card');
      handleMessage(error.message, 'FAILED')
      alert(error.message)
      setBlockedSubmitting(false)
    })
  }

  const handleAddFunds = (response) => {
    if (addedCardFunds == null) {
      return
    }

    setBlockedSubmitting(true)

    var data = JSON.stringify({
      amount: addedCardFunds,
      debit_currency: currentCardCurrency,
    });

    var config = {
      method: 'POST',
      url: `${BaseUrl}/virtual-cards/${cardId}/fund`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
      data: data
    };


    axios(config)
    .then(function (response) {
      const result = response.data

      const { status, message } = result;

      if (status === 'success') {


        data.transactionType = 'virtualcards'
        data.transactionName = 'virtualcardsaddfunds'
        data.details = 'virtualcardsaddfunds'
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`
        data.data = data

        //make another api call to update client account
        var config = {
          method: 'post',
          url: `${BaseUrl}/transaction/virtual-card`,
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
            handleMessage(message, "SUCCESS")
            setBlockedSubmitting(false)
            setAddedCardFunds(false)
            alert(message)
          }else{
            handleMessage("An error occured", 'FAILED')
            setBlockedSubmitting(false)
            alert(error.message)
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
        setBlockedSubmitting(false)
        alert(error.message)
      }
      setBlockedSubmitting(false)
    })
    .catch(function (error) {
      console.log(error.message, '---response from blocking card');
      handleMessage(error.message, 'FAILED')
      alert(error.message)
      setBlockedSubmitting(false)
    })
  }

  const handleTerminateCard = (cardId) => {
    // return;
    setTerminateSubmitting(true)

    var config = {
      method: 'PUT',
      url: `${BaseUrl}/virtual-cards/${cardId}/terminate`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };

    axios(config)
    .then(function (response) {
      const result = response.data

      const { status, message } = result;

      if (status === 'success') {
        //make another call to our backend

        data.transactionType = 'virtualcards'
        data.transactionName = 'virtualcardsaddfunds'
        data.details = 'virtualcardsaddfunds'
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`
        data.data = data

        //make another api call to update client account
        var config = {
          method: 'post',
          url: `${BaseUrl}/transaction/virtual-card`,
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
            handleMessage(message, "SUCCESS")
            setBlockedSubmitting(false)
            setAddedCardFunds(false)
            alert(message)
          }else{
            handleMessage("An error occured", 'FAILED')
            setBlockedSubmitting(false)
            alert(error.message)
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
        setBlockedSubmitting(false)
        alert(error.message)
      }
      setBlockedSubmitting(false)
    })
    .catch(function (error) {
      console.log(error.message, '---response from blocking card');
      handleMessage(error.message, 'FAILED')
      alert(error.message)
      setBlockedSubmitting(false)
    })
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>

        <View style={styles.dialog}>
          <Text>Card Details</Text>
          <Text>{cardName}</Text>
          <Text>{cardNumber}</Text>
          <Text>{expiryDate}</Text>
          <Text>{cvv}</Text>
          <Text>{isActive}</Text>
          <Text>{currentCardCurrency}</Text>
          <Text style={{display: 'none'}}>{cardId}</Text>

          {(blockedSubmitting && isActive == true) 
          && <TouchableOpacity onPress={(cardId) => handleBlockCard(cardId, 'block')} style={styles.modalButton}>
            <Text>Block Card</Text> 
            <MaterialIcons name="block-helper" size={24} color="white" />
          </TouchableOpacity>}

          {(blockedSubmitting && isActive == false) 
          && <TouchableOpacity onPress={(cardId) => handleBlockCard(cardId, 'unblock')} style={styles.modalButton}>
            <Text>Unblock Card</Text> 
            <MaterialIcons name="checkcircleo" size={24} color="white" />
          </TouchableOpacity>}

          {(!blockedSubmitting && isActive == true) && <TouchableOpacity onPress={handleBlockCard} style={styles.modalButton}>
            <ActivityIndicator size="large" color={primary}/>
          </TouchableOpacity>}


          {blockedSubmitting && <TouchableOpacity onPress={handleAddFunds} style={styles.modalButton}>
            <Text>Add Funds</Text>
          </TouchableOpacity>}

          {!blockedSubmitting && <TouchableOpacity onPress={handleAddFunds} style={styles.modalButton}>
            <ActivityIndicator size="large" color={primary}/>
          </TouchableOpacity>}


          {terminateSubmitting && <TouchableOpacity onPress={(cardId) => handleBlockCard(cardId, 'terminate')} style={styles.modalButton}>
            <Text>Terminate Card</Text>
            <MaterialIcons name="checkcircleo" size={24} color="trash" />
          </TouchableOpacity>}

          {!terminateSubmitting && <TouchableOpacity onPress={(cardId) => handleBlockCard(cardId, 'terminate')} style={styles.modalButton}>
            <ActivityIndicator size="large" color={primary}/>
          </TouchableOpacity>}

          {showAddFundsInput && <TextInput 
            style={styles.inputModal}
            placeholder="Amount"
            placeholderTextColor="#949197" 
            keyboardType={'numeric'}
            onChangeText={text => setAddedCardFunds(text)}
            value={addedCardFunds}
          />}

          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <MsgBox type={messageType}>{message}</MsgBox>
        </View>
      </View>
    </Modal>
  )
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
    inputModal: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 30,
      // backgroundColor: '#1b181f',
      borderBottomColor: '#949197',
      borderBottomWidth: 1,
      borderRadius: 3,
      color: '#fff',
      margin: 10,
      width: '50%'
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
    PanelButton: {
      padding:14,
      width: 200,
      justifyContent: 'center',
      backgroundColor: '#1c1c1c',
      borderRadius: 10
    },
    PanelButtonText: {
      fontSize: 16,
      color: '#fff',
      alignSelf: 'center'
    },
    PanelHandle: {
      height: 6,
      width: 50,
      backgroundColor: '#666',
      borderRadius: 6,
      alignSelf: 'center',
      marginTop: 6
    },
    PanelItemContainer: {
      borderWidth: 0.4,
      borderColor: '#131112',
      padding: 14,
      borderRadius: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    PanelImage: {
      width: 30,
      height: 30,
      backgroundColor: '#000',
      borderRadius: 40
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
    },
    cardList: {

    },
    addACardButton: {

    },
    dialog: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '90%',
      alignSelf: 'center'
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      marginTop: 10,
    },
    closeButtonText: {
      color: 'blue',
      fontSize: 16,
    },
    modalButton: {
      backgroundColor: '#3a5fbc',
      height: 30,
      width: 100,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      marginTop: 30
    },
    modalButtonText: {
      
    }
});


// return (
//   <View style={styles.container}>
//     <View  style={{ alignItems: 'center', justifyContent: 'center', }}>
//       <Carousel 
//         layout={"tinder"}
//         ref={carouselRef}
//         data={Images}
//         renderItem={RenderItem}
//         sliderWidth={width}
//         itemWidth={width - 10}
//         swipeThreshold={100}
//         layoutCardOffset={-12}
//         inactiveSlideOpacity={0.4}
//         containerCustomStyle={{
//         overflow: 'visible',
//         marginVertical: 0
//         }}
//         contentContainerCustomStyle={{
//         paddingTop: 10
//         }}
//       />
//     </View>

//     <View>
//       <Text style={styles.input}>Your List Of Cards</Text>

//       <Text>You do not currently have any cards</Text>

//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode='date'
//           is24Hour={true}
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View>


//     <View style={{flex: 1}}>
//       <SlidingUpPanel 
//         ref={ModalRef}
//         draggableRange={dragRange}
//         animatedValue={_draggedValue}
//         backdropOpacity={0}
//         snappingPoints={[360]}
//         height={height + 20}
//         friction={0.9}
//       >

//         <View style={{flex: 1, backgroundColor: '#0c0c0c', borderRadius: 24, padding: 14}}>
//           <View style={styles.PanelHandle}></View>
//           <View>
//             <Text style={{marginVertical: 16, color: '#fff', justifyContent: 'center'}}>Add A Card</Text>

//             <TextInput
//               style={styles.input}
//               value = {transactionId}
//               editable={false}
//             />

//             <SelectDropdown
//               data= {["Naira", "Dollar"]}
//               // search={true}
//               onSelect={(selectedItem, index) => { 
//                 // setSenderCountry(selectedItem)
//                 setCurrency(selectedItem)
//               }}
//               defaultButtonText="Currency"
//               buttonStyle={styles.dropDownButtonStyle}
//               renderDropdownIcon = {renderDropdownIcon}
//               rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
//               buttonTextStyle={styles.dropDownButtonTextStyle}
//               rowTextStyle={{ marginLeft: 0 }}
//               buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
//               rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
//             />

//             <SelectDropdown
//               data= {["NGN"]}
//               // search={true}
//               onSelect={(selectedItem, index) => { 
//                 // setSenderCountry(selectedItem)
//                 setDebitCurrency(selectedItem)
//               }}
//               defaultButtonText="Debit Currency"
//               buttonStyle={styles.dropDownButtonStyle}
//               renderDropdownIcon = {renderDropdownIcon}
//               rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
//               buttonTextStyle={styles.dropDownButtonTextStyle}
//               rowTextStyle={{ marginLeft: 0 }}
//               buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
//               rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
//             />

//             <SelectDropdown
//               data= {["Mr", "Mrs", "Master"]}
//               // search={true}
//               onSelect={(selectedItem, index) => { 
//                 setTitle(selectedItem)
//                 // setSelectedItem(selectedItem)
//               }}
//               defaultButtonText="Title"
//               buttonStyle={styles.dropDownButtonStyle}
//               renderDropdownIcon = {renderDropdownIcon}
//               rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
//               buttonTextStyle={styles.dropDownButtonTextStyle}
//               rowTextStyle={{ marginLeft: 0 }}
//               buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
//               rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
//             />

//             <SelectDropdown
//               data= {["M", "F"]}
//               // search={true}
//               onSelect={(selectedItem, index) => { 
//                 setGender(selectedItem)
//                 // setSelectedItem(selectedItem)
//               }}
//               defaultButtonText="Gender"
//               buttonStyle={styles.dropDownButtonStyle}
//               renderDropdownIcon = {renderDropdownIcon}
//               rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
//               buttonTextStyle={styles.dropDownButtonTextStyle}
//               rowTextStyle={{ marginLeft: 0 }}
//               buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
//               rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="First Name"
//               placeholderTextColor="#949197" 
//               type="text"
//               onChangeText={phone => setFirstName(phone)}
//               value={firstName}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Last Name"
//               placeholderTextColor="#949197"
//               type="text"
//               onChangeText={phone => setLastName(phone)}
//               value={lastName}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="email"
//               placeholderTextColor="#949197"
//               type="text"
//               onChangeText={phone => setEmail(phone)}
//               value={email}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Billing City"
//               placeholderTextColor="#949197" 
//               type="text"
//               onChangeText={phone => setBillingCity(phone)}
//               value={billingCity}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Billing Name"
//               placeholderTextColor="#949197" 
//               type="text"
//               onChangeText={phone => setBillingName(phone)}
//               value={billingName}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Billing State"
//               placeholderTextColor="#949197" 
//               type="text"
//               onChangeText={phone => setBillingState(phone)}
//               value={billingState}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Billing Address"
//               placeholderTextColor="#949197" 
//               multiline = {true}
//               numberOfLines = {3}
//               type="text"
//               onChangeText={phone => setBillingAddress(phone)}
//               value={billingAddress}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Billing Postal Code"
//               placeholderTextColor="#949197" 
//               multiline = {true}
//               numberOfLines = {3}
//               type="text"
//               onChangeText={phone => setBillingPostalCode(phone)}
//               value={billingPostalCode}
//             />

//             <SelectDropdown
//               data={allCountriesAbbreviations}
//               search={true}
//               onSelect={(selectedItem, index) => { 
//                 setBillingCountry(selectedItem)
//               }}
//               defaultButtonText="Billing Country"
//               buttonStyle={styles.dropDownButtonStyle}
//               renderDropdownIcon = {renderDropdownIcon}
//               rowStyle={{ fontSize: 5, fontFamily: 'Nunito' }}
//               buttonTextStyle={styles.dropDownButtonTextStyle}
//               rowTextStyle={{ marginLeft: 0 }}
//               buttonTextAfterSelection={(selectedItem, index) => { return selectedItem  }}// text represented after item is selected // if data array is an array of objects then return selectedItem.property to render after item is selected
//               rowTextForSelection={(item, index) => {  return item }}// text represented for each item in dropdown // if data array is an array of objects then return item.property to represent item in dropdown
//             />

//             <MyTextInput 
//               icon="calendar"
//               placeholder=" ID expiry - YYYY - MM - DD"
//               placeholderTextColor={myPlaceHolderTextColor}
//               value={dob ? dob.toDateString() : ''}
//               isDate={true}
//               editable = {false}
//               showDatePicker = {showDatePicker}
//               onPress={() => showMode('date')}
//               style={styles.input}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               placeholderTextColor="#949197" 
//               type="number"
//               // keyboardType={'numeric'}
//               onChangeText={phone => setInputValuePhone(phone)}
//               value={inputValuePhone}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Amount"
//               placeholderTextColor="#949197" 
//               keyboardType={'numeric'}
//               onChangeText={text => setInputValuePhone(text)}
//               value={inputValuePhone}
//             />

//             <MsgBox type={messageType}>{message}</MsgBox>

//             {submitting && <TouchableOpacity 
//             onPress={handleCreateVirtualCards}
//             style={styles.addTransactionButton}>
//               <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
//             </TouchableOpacity>}

//             {!submitting &&<TouchableOpacity 
//             onPress={handleCreateVirtualCards}
//             style={styles.addTransactionButton}>
//               <Text style={styles.buttonText}>Create Card</Text>
//             </TouchableOpacity>}

//           </View>
//         </View>
//       </SlidingUpPanel>
//     </View>
//   </View>
// );


{/* {!show && (<Pressable
            onPress={toggleDatePicker}
          >
            <TextInput 
              placeholder=" ID expiry - YYYY - MM - DD"
              value={dob ? dob : ''}
              isDate={true}
              editable = {false}
              onChangeText={setDob}
              placeholderTextColor={myPlaceHolderTextColor}
              onPressIn={toggleDatePicker}
              style={styles.input}
            />
          </Pressable>)} */}
