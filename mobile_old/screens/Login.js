import React, {useState, useEffect, useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
// import { View } from 'formik';

//formik
import {Formik} from  'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//KeyboardAvoidingWrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'

//api
import  axios from 'axios'

//google sign-in
import * as GoogleSignIn from 'expo-google-sign-in';

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
} from '../components/styles'

import {View, ActivityIndicator, Platform} from 'react-native'

const {myButton, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors

//async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';



const Login = ({navigation}) => {
    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const [hidePassword, setHidePassword] = useState(true)
    const [message, setMessage] = useState()
    const [messageType, setMessageType] = useState()
    const [googleSubmitting, setGoogleSubmitting] = useState(false)

    //

    const handleLogin = (credentials,setSubmitting) => {
        handleMessage(null)
        const url = 'https://boiling-everglades-35416.herokuapp.com/user/signin';

        axios.post(url, credentials).then((response) => {
            token = response.token
            const result = response.data;
            const {message, status, data} = result

            if(status !== 'SUCCESS') {
                handleMessage(message, status)
            }else{
                //navigation.navigate('Dashboard', {...data[0]})
                persistLogin({...data[0]}, message, status)
                // persistLogin({...data[0],token}, message, status)
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

    //initialize google sign in
    useEffect(() => {
        initAsync()
    })

    const androidClientId = '334602610846-d1olq2nngjat20e10lapam949ibnf3m9.apps.googleusercontent.com'
    const iosClientId = '334602610846-truoiam9crqjnj41n17o4advbsnu12hf.apps.googleusercontent.com'

    const initAsync = async () => {
        try {
            await GoogleSignIn.initAsync({
                clientId: Platform.OS === 'android' ? androidClientId : iosClientId
            })
            getUserDetails()
        } catch (error) {
            console.log("Gooogle Sign in error: " + message)
        }
    }

    const getUserDetails = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync()
        setGoogleSubmitting(false)
        user && persistLogin({...user}, "Gooogle Sign in succesful", 'success')
    }

    const handleGoogleSignIn = async (signIn) => {
        try {
            setGoogleSubmitting(true)
            await GoogleSignIn.askForPlayServicesAsync()
            const {type, user} = await GoogleSignIn.signInAsync()
            if(type == "success"){
                getUserDetails();
            }else{
                handleMessage('Gooogle sign in cancelled')
                setGoogleSubmitting(false)
            }
        } catch ({message}) {
            setGoogleSubmitting(false)
            handleMessage("Gooogle Sign in error: " + message)
        }
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
                {/* <PageLogo resizeMode="cover" source={require('./../assets/img/img1.png')} /> */}
                <PageTitle>Escrosis</PageTitle>
                <SubTitle>Account Login</SubTitle>

                <Formik 
                    initialValues={{email: '', password: ''}}
                    onSubmit={(values, {setSubmitting}) => {
                        if (values.email == "" || values.password == "") {
                            handleMessage("please enter all fields")
                            setSubmitting(false)
                        }else{
                            handleLogin(values, setSubmitting)
                        }
                    }}
                >{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (<StyledFormArea>

                    <MyTextInput 
                        // label="Email Address"
                        icon="mail"
                        placeholder="myemail@domain.com"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('email')}
                        onBlur = {handleBlur('email')}
                        value={values.email}
                        keyboardtype="email-address"
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
                    <MsgBox type={messageType}>{message}</MsgBox>
                    {!isSubmitting && <StyledButton onPress={handleSubmit}>
                        <ButtonText>
                            Login
                        </ButtonText>
                    </StyledButton>}

                    {isSubmitting && <StyledButton disabled = {true}>
                        <ActivityIndicator size="large" color={primary}/>
                    </StyledButton>}

                    <Line />
                    {
                        !googleSubmitting && (
                            <StyledButton google={true} onPress={handleGoogleSignIn}>
                                <Fontisto name="google" color={primary} size={25}/>
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>
                        )
                    }

                    {
                        googleSubmitting && (
                            <StyledButton google={true} disabled={true}>
                                <ActivityIndicator size="large" color={primary}/>
                            </StyledButton>
                        )
                    }
                    
                    <ExtraView>
                        <ExtraText>Don't have account already ?</ExtraText>
                        <TextLink onPress={() => navigation.navigate('SignUp')}>
                            <TextLinkContent>Sign Up</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon,isPassword,hidePassword,setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={myButton} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight}  />
                </RightIcon>
            )}
        </View>
    )
}

export default Login;