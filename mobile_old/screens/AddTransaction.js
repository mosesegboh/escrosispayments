import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,TextInput, Button } from 'react-native';
// import { Colors, ExtraView } from './../components/styles';
import Constants from 'expo-constants';
//DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';

import {Picker} from '@react-native-picker/picker';

//services
import {randomString} from '../services/'

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  RightIcon,
  Colors,
  Line,
  MsgBox,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent
} from '../components/styles';

//Colors
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

export default function AddTransaction() {
  const [selectedValue, setSelectedValue] = useState("java");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [inputValueAmount, setInputValueAmount]= useState();
  const [transactionId, setTransactionId] = useState();

  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString);
  },[]);

  //Actual date of birth chosen by the user to be sent
  const [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setDob(currentDate);
  }

  const showDatePicker = () => {
      setShow(true);
  }

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
            placeholder="Transactionssss ID"
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
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
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
          />

          <TouchableOpacity 
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}>Add Transation</Text>
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
    }

});
