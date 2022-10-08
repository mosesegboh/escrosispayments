import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
// import { View } from 'formik';

//formik
import {Formik} from  'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//KeyboardAvoidingWrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'

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

import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
//Colors
const {myButton, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
//DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';

//API Client
import axios from 'axios'

//async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';



const SignUp = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));

    //context
const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const [message, setMessage] = useState()
    const [messageType, setMessageType] = useState()

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

    //handle signup
    const handleSignUp = (credentials,setSubmitting) => {
        handleMessage(null)
        const url = 'https://boiling-everglades-35416.herokuapp.com/user/signup';

        axios.post(url, credentials).then((response) => {
            const result = response.data;
            const {message, status, data} = result

            if(status !== 'SUCCESS') {
                handleMessage(message, status)
            }else{
                // navigation.navigate('Dashboard', {...data})
                persistLogin({...data}, message, status)
            }
            setSubmitting(false)
        }).catch((error) => {
            console.log(error)
            setSubmitting(false)
            handleMessage("An error occured, check your network and try again")
        })
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
                    
                    <PageTitle>Escrosis</PageTitle>
                    <SubTitle>Account SignUp</SubTitle>

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

                        <MyTextInput 
                            icon="calendar"
                            placeholder="YYYY - MM - DD"
                            placeholderTextColor={myPlaceHolderTextColor}
                            onChangeText={handleChange('dateOfBirth')}
                            onBlur = {handleBlur('dateOfBirth')}
                            value={dob ? dob.toDateString() : ''}
                            isDate={true}
                            editable = {false}
                            showDatePicker = {showDatePicker}
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
                            Login
                        </ButtonText>
                        </StyledButton>}

                        {isSubmitting && <StyledButton disabled = {true}>
                            <ActivityIndicator size="large" color={primary}/>
                        </StyledButton>}

                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>
                                Sign Up
                            </ButtonText>
                        </StyledButton>
                        <Line />
                        
                        <ExtraView>
                            <ExtraText>Already have an account?</ExtraText>
                            <TextLink onPress={() => navigation.navigate('Login')}>
                                <TextLinkContent>Login</TextLinkContent>
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

export default SignUp;