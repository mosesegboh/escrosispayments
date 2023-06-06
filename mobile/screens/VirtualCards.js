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
        FlatList
      } from 'react-native';
import  axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {randomString} from '../services/';
const {myButton, darkLight, primary} = Colors;
import {Octicons, Ionicons} from '@expo/vector-icons';
import  {FLUTTERWAVE_SECRET_KEY}  from '../services/index';
import  {FLUTTERWAVE_API_URL}  from '../services/index';
import { CredentialsContext } from '../components/CredentialsContext';
import SlidingUpPanel from 'rn-sliding-up-panel'
import Carousel from 'react-native-snap-carousel'
import { MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import  {allCountriesAbbreviations}  from '../services/index';
import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  Colors,
  MsgBox,
} from '../components/styles';


export default function VirtualCard({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  let {email, token} = storedCredentials
  const {balance} = route.params

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount] = useState();
  const [inputValuePhone, setInputValuePhone] = useState();
  const [transactionId, setTransactionId] = useState();
  const [secondLeg, setSecondLeg] = useState();
  const [details, setDetails] = useState();
  const [data, setData] = useState([]);
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
  
  useEffect(()=>{
    //generate transaction ID
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());

    //make api call to get all the available bill services
    // const url = 'https://api.flutterwave.com/v3/bill-categories?airtime=1';
    // const token = FLUTTERWAVE_SECRET_KEY;

    // axios.get(url, { headers: { Authorization: token } }).then((response) => {
    // //   console.log(response, 'this is the response')
    //   const {message, status, data} = response.data

    //   console.log(data, 'this is data')
     
    //   if(status == 'success'){
    //     console.log('it was successful')
    //     setbillData(data)
    //   }else{
    //     handleMessage('An error occured while getting services', 'FAILED')
    //   }
    // }).catch((error) => {
    //     console.log(error)
    //     handleMessage('An error occured while getting services', 'FAILED')
    // })
  },[]);

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

  const handleCreateVirtualCards = () => {
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

  const renderDropdownIcon = () => {
    return(
      <Octicons name="triangle-down" size={22} color="black" />
    )
  }

  const handleAirtimePurchase = (text) => {
    console.log(selectedValue, 'selected value')
    if ( email == null || inputValueAmount == null || inputValuePhone == null || selectedValue == null || transactionId == null ) {
      setSubmitting(false)
      handleMessage("Please enter all fields")
      alert("Please enter all fields")
      return
    }

    if (inputValueAmount > balance) {
      console.log('i was clicked!')
      setSubmitting(false)
      handleMessage("You have insufficient balance to complete this transaction")
      alert("You have insufficient balance to complete this transaction")
      return
    }

    setSubmitting(true)

    var data = JSON.stringify({
      country: 'NG',
      customer: inputValuePhone,
      amount: inputValueAmount,
      type: 'AIRTIME',
      reference: transactionId,
    });

    console.log(data, 'this is the data')
          
    var config = {
      method: 'post',
      url: `${FLUTTERWAVE_API_URL}/bills`,
      headers: { 
        'Authorization': FLUTTERWAVE_SECRET_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };
          
    axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      // const result = JSON.stringify(response.data)
      const result = response.data
      const { status, message} = result;
      
      if(status === 'success') {
        data.email = email
        data.transactionType = 'airtime'
        data.transactionName = 'airtime'
        data.details = 'airtime purchase'
        data.date = new Date()
        data.transactionId = transactionId
        data.transactFromAddedFunds = "none"
        data.transactFromWallet = "yes"
        data.currency = currency
        data.token = `Bearer ${token}`

        //make another api call to update client account
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
          // console.log(JSON.stringify(response.data), 'response from acios');
          // const result = JSON.stringify(response.data)
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
        handleMessage("An error occured", 'FAILED')
        setSubmitting(false)
      }
      
      console.log(response, 'response from 11');
    })
    .catch(function (error) {
      console.log(error.response.data.message, 'response fom api call');
      handleMessage(error.response.data.message, 'FAILED')
      alert(error.message)
      setSubmitting(false)
    });      
  }

  return (
    <View style={styles.container}>
      <View  style={{ alignItems: 'center', justifyContent: 'center', }}>
        <Carousel 
          layout={"tinder"}
          ref={carouselRef}
          data={Images}
          renderItem={RenderItem}
          sliderWidth={width}
          itemWidth={width - 10}
          swipeThreshold={100}
          layoutCardOffset={-12}
          inactiveSlideOpacity={0.4}
          containerCustomStyle={{
          overflow: 'visible',
          marginVertical: 0
          }}
          contentContainerCustomStyle={{
          paddingTop: 10
          }}
        />
      </View>

      <View>
        <Text style={styles.input}>Your List Of Cards</Text>

        <Text>You do not currently have any cards</Text>

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
      </View>


        <View style={{flex: 1}}>
          <SlidingUpPanel 
            ref={ModalRef}
            draggableRange={dragRange}
            animatedValue={_draggedValue}
            backdropOpacity={0}
            snappingPoints={[360]}
            height={height + 20}
            friction={0.9}
          >

            <View style={{flex: 1, backgroundColor: '#0c0c0c', borderRadius: 24, padding: 14}}>
              <View style={styles.PanelHandle}></View>
              <View>
                <Text style={{marginVertical: 16, color: '#fff', justifyContent: 'center'}}>Add A Card</Text>

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
                    setTitle(selectedItem)
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
                  value={dob ? dob.toDateString() : ''}
                  isDate={true}
                  editable = {false}
                  showDatePicker = {showDatePicker}
                  onPress={() => showMode('date')}
                  style={styles.input}
                />

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
                  onChangeText={phone => setInputValuePhone(phone)}
                  value={inputValuePhone}
                />

                <MsgBox type={messageType}>{message}</MsgBox>

                {submitting && <TouchableOpacity 
                onPress={handleAirtimePurchase}
                style={styles.addTransactionButton}>
                  <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
                </TouchableOpacity>}

                {!submitting &&<TouchableOpacity 
                onPress={handleAirtimePurchase}
                style={styles.addTransactionButton}>
                  <Text style={styles.buttonText}>Create Card</Text>
                </TouchableOpacity>}

              </View>
            </View>
          </SlidingUpPanel>
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
    }
});
