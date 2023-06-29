import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from  'formik';
import {Octicons, Ionicons} from '@expo/vector-icons';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import {
    StyledContainer,
    InnerContainer,
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
import {View, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Text} from 'react-native';
const {myButton, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from '../components/CredentialsContext';
import { BaseUrl } from '../services';

const SignUp = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState()
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

     //date
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState()
  const [dob, setDob] = useState();

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

const handleSignUp = async (credentials,setSubmitting) => {
    console.log(credentials, '--credentials')
    handleMessage(null)
    const url = `${BaseUrl}/user/signup`;

    axios.post(url, credentials).then((response) => {
        
        const result = response.data;
        const {message, status, data} = result

        console.log(result, '--result to plan')

        // if(status !== 'SUCCESS') {
        if(status !== 'PENDING') {
            // console.log('inside pending')
            handleMessage(message, status)
        }else{
            
            // navigation.navigate('Dashboard', {...data})
            //former one
            // persistLogin({...data}, message, status)
            // console.log(email, '--email')
            //the former before the instant login is just below this line below:
            // temporaryUserPersist({email, name, dateOfBirth} = credentials)
            console.log(result.data, '--inside handle signup')
            temporaryUserPersist({email, name, dateOfBirth, token} = data)
            // temporaryUserPersist(credentials)
            // console.log(email, 'inside elseemail')
            navigation.navigate('OTPVerification', {...data})
        }
        setSubmitting(false)
    }).catch((error) => {
        console.log(error, '--this is the axio error')
        setSubmitting(false)
        handleMessage("An error occured, check your network and try again.")
    })
}

const temporaryUserPersist = async (credentials) => {
    try {
        await AsyncStorage.setItem('tempUser', JSON.stringify(credentials))
    } catch (error) {
        handleMessage("Error with initial handling")
    }
}

const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
}

const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('escrosisCredentials', JSON.stringify(credentials)).then(() => {
        handleMessage(message, status)
        setStoredCredentials(credentials)
    }).catch(error => {
        console.log(error)
        handleMessage('Persisting Login Failed')
    })
}



return (
    <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
                
                {/* <PageTitle>Escrosis</PageTitle>
                <SubTitle>Account SignUp</SubTitle> */}
                <Image 
                source={require('./../assets/img/escrosis-low-trans-bg.png')}
                style={{height:20, width:210, marginTop:100}}
            />

                <Formik 
                    initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: ''}}
                    
                    onSubmit={(values, {setSubmitting}) => {
                        values = {...values, dateOfBirth: dob}
                        if (values.email == "" || values.password == "" || values.dateOfBirth == "" || values.confirmPassword == "") {
                            handleMessage("please enter all fields")
                            setSubmitting(false)
                        }else if (values.password !== values.confirmPassword) {
                            handleMessage("Passwords do not match")
                            setSubmitting(false)
                        }else{
                            handleSignUp(values, setSubmitting)
                        }
                    }}

                >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (<StyledFormArea>

                    <MyTextInput 
                        // label="Email Address"
                        icon="person"
                        placeholder="Full Name"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('name')}
                        onBlur = {handleBlur('name')}
                        value={values.name}
                    />

                    <MyTextInput 
                        icon="mail"
                        placeholder="myemail@domain.com"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('email')}
                        onBlur = {handleBlur('email')}
                        value={values.email}
                        keyboardtype="email-address"
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

                    <MyTextInput 
                        icon="lock"
                        placeholder="**********"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('password')}
                        onBlur = {handleBlur('password')}
                        value={values.password}
                        secureTextEntry={hidePassword}
                        isPassword = {true}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                    />

                    <MyTextInput 
                        icon="lock"
                        placeholder="**********"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur = {handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                        secureTextEntry={hidePassword}
                        isPassword = {true}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                    />

                    <MsgBox type={messageType}>{message}</MsgBox>

                    {!isSubmitting && <StyledButton onPress={handleSubmit}>
                    <ButtonText>
                        Sign Up
                    </ButtonText>
                    </StyledButton>}

                    {isSubmitting && <StyledButton disabled = {true}>
                        <ActivityIndicator size="large" color={primary}/>
                    </StyledButton>}

                    <Line />
                    
                    <ExtraView>
                        <ExtraText>Already have an account ? </ExtraText>
                        <TextLink onPress={() => navigation.navigate('Login')}>
                            <TextLinkContent>  Login</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    </KeyboardAvoidingWrapper>
);
}

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

const styles = StyleSheet.create({
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
    }
})

export default SignUp;