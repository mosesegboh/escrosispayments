import React, {useState, useEffect, useContext, useRef} from 'react'
import {Text, StatusBar, ActivityIndicator, TextInput, StyleSheet, View} from 'react-native'
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import {
    StyledContainer,
    TopHalf,
    IconBg,
    BottomHalf,
    Colors,
    PageTitle,
    InfoText,
    EmphasizeText,
    StyledButton,
    ButtonText
} from '../components/styles'
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import CodeInputField from '../components/CodeInputField';
import ResendTimer from '../components/ResendTimer';
import VerificationModal from '../components/VeirficationModal';
import axios from 'axios';
// import {testBaseUrl} from '../services'
import {BaseUrl} from '../services'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {CredentialsContext} from '../components/CredentialsContext'

const {brand, primary, grey} = Colors

export default function OTPVerification({route}) {
    // const [code, setCode] = useState("");
    const [pinReady, setPinReady] = useState(false)
    const [verifying, setVerifying] = useState(false)

    //web client id:   334602610846-0cuqj82v9lg1eea4b8vpgstik6nk68ts.apps.googleusercontent.com
    //secret: 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

    //state used by the resend timer the
    const [timeLeft, setTimeLeft] = useState(null)
    const [targetTime, setTargetTime] = useState(null)
    const [activeResend, setActiveResend] = useState(false)

    const [resendingEmail, setResendingEmail] = useState(false)
    const [resendStatus, setResendStatus] = useState('Resend')
    //states for the modal
    const [modalVisible, setModalVisible] = useState(false)
    const [verificationSuccessful, setVerificationSuccessful] = useState(false)
    const [requestMessage, setRequestMessage] = useState('')

    const [pin1, setPin1] = useState("");
    const [pin2, setPin2] = useState("");
    const [pin3, setPin3] = useState("");
    const [pin4, setPin4] = useState("");

    const [pinText1, setPinText1] = useState("");

    const pin1Ref = useRef(null)
    const pin2Ref = useRef(null)
    const pin3Ref = useRef(null)
    const pin4Ref = useRef(null)

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext) 

    const {email, userId} =  route?.params;

    let resendTimerInterval;

    const MAX_CODE_LENGTH = 4

    const triggerTimer = (targetTimeInSeconds = 30) => {
        setTargetTime(targetTimeInSeconds)
        setActiveResend(false)
        const finalTime = +new Date() + targetTimeInSeconds * 1000;
        resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000)
    }

    const calculateTimeLeft = (finalTime) => {
        const difference = finalTime - +new Date().getTime();

        if (difference >= 0) {
            setTimeLeft(Math.round(difference/1000));
        }else{
            clearInterval(resendTimerInterval);
            setActiveResend(true)
            setTimeLeft(null)
        }
    }

    useEffect(()=>{
        triggerTimer();

        return() => {
            clearInterval(resendTimerInterval);
        }
    },[])

    const resendEmail = async () => {
        setResendingEmail(true)
        const url = `${BaseUrl}/user/resendVerificationCode/`
        try {
            await axios.post(url, {email, userId});
            setResendStatus('Sent')
        } catch (error) {
            setResendStatus('Failed!')
            alert('Resending Verificaiton email failed')
        }
        setResendingEmail(false)
        //hold on to te mesage
        setTimeout(()=>{
            setResendStatus('Resend')
            setActiveResend(false)
            triggerTimer()
        }, 5000)
    }

    const submitOTPVerification = async () => {
        try {
            setVerifying(true)
            code = '' + pinText1 + pin2 + pin3 + pin4;
            // console.log(code, 'this is the code', typeof(code))
            const url = `${BaseUrl}/user/verifyOTP/`
            const result = await axios.post(url, {userId, otp: code})
            const {data} = result

            console.log(data)

            if(data.status !== "VERIFIED") {
                setVerificationSuccessful(false)
                setRequestMessage(data.message)
            }else{
                setVerificationSuccessful(true)
                 //move on
            }

            setModalVisible(true)
            setVerifying(false)
        } catch (error) {
            setRequestMessage(error.message)
            setVerificationSuccessful(false)
            setModalVisible(true)
            setVerifying(false)
        }
    }

    const persistLoginAfterOTPVerification = async () => {
        try {
            const tempUser = await AsyncStorage.getItem('tempUser')
            await AsyncStorage.setItem('escrosisCredentials', JSON.stringify(tempUser))
            setStoredCredentials(JSON.parse(tempUser))
        }catch(error) {
            alert(`Error with persisting user data.`)
        }
    }


  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer 
            style={{ 
                alignItems: 'center',
            }}
        >
            <TopHalf>
                <IconBg>
                    <StatusBar style="dark" />
                    <Octicons name="lock" size={125} />
                </IconBg>

            </TopHalf>

            <BottomHalf>
                <PageTitle style={{ fontSize:25 }}>Account Verification</PageTitle>

                <InfoText>
                    Please enter the 4-digit code sent to <EmphasizeText>{`${email}`}</EmphasizeText>
                </InfoText>

                {/* <CodeInputField 
                    setPinReady={setPinReady}
                    code={code}
                    setCode={setCode}
                    maxLength={MAX_CODE_LENGTH}
                /> */}
                <View
                    style={{ 
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        // justifyContent: "space-around",4
                    }}
                >
                    <View style={styles.TextInputView}>
                        <TextInput 
                            ref={pin1Ref}
                            keyboardType={'number-pad'}
                            maxLength={1}
                            onChange={(pin1) => {
                                setPin1(pin1)
                                if (pin1 != "") {
                                    pin2Ref.current.focus()
                                }
                            }}
                            value={pin1} 
                            style={styles.TextInputText}
                            onChangeText={pinText1 => setPinText1(pinText1)}
                        />
                    </View>
                    <View style={styles.TextInputView}>
                        <TextInput 
                            ref={pin2Ref}
                            keyboardType={'number-pad'}
                            maxLength={1}
                            onChange={(pin2) => {
                                setPin2(pin2)
                                if (pin2 != "") {
                                    pin3Ref.current.focus()
                                }
                            }}
                            value={pin2} 
                            style={styles.TextInputText}
                            onChangeText={pin2 => setPin2(pin2)}
                        />
                    </View>
                    <View style={styles.TextInputView}>
                        <TextInput 
                            ref={pin3Ref}
                            keyboardType={'number-pad'}
                            maxLength={1}
                            onChange={(pin3) => {
                                setPin3(pin3)
                                if (pin3 != "") {
                                    pin4Ref.current.focus()
                                }
                            }}
                            style={styles.TextInputText}
                            value={pin3} 
                            onChangeText={pin3 => setPin3(pin3)}
                        />
                    </View>
                    <View style={styles.TextInputView}>
                        <TextInput 
                            ref={pin4Ref}
                            keyboardType={'number-pad'}
                            maxLength={1}
                            onChange={(pin4) => {
                                setPin4(pin4)
                                if (pin4 != "") {
                                    // console.log('i was ere o')
                                    setPinReady(true)
                                    setVerifying(false)
                                }
                            }}
                            style={styles.TextInputText}
                            value={pin4} 
                            onChangeText={pin4 => setPin4(pin4)}
                        />
                    </View>
                </View>
                
               
                {!verifying && pinReady && (
                        <StyledButton style={{
                            backgroundColor: 'green',
                            flexDirection: 'row'
                        }}
                        onPress={submitOTPVerification}
                >
                    <ButtonText>Verify</ButtonText>
                    <Ionicons name="checkmark-circle" size={20} color={primary}/>
                </StyledButton>
                )}

                {!verifying && !pinReady && (
                        <StyledButton 
                            disabled={true}
                            style={{
                            backgroundColor: 'grey',
                            flexDirection: 'row'
                        }}
                >
                    <ButtonText style={{color: grey}}>Verify</ButtonText>
                    <Ionicons name="checkmark-circle" size={20} color={primary}/>
                </StyledButton>
                )}

                {verifying && (
                        <StyledButton 
                            disabled={true}
                            style={{
                            backgroundColor: 'grey',
                            flexDirection: 'row'
                        }}
                >
                    <ActivityIndicator size="large" color={primary} />
                </StyledButton>
                )}

                <ResendTimer 
                    activeResend={activeResend}
                    resendingEmail={resendingEmail}
                    resendStatus={resendStatus}
                    timeLeft={timeLeft}
                    targetTime={targetTime}
                    resendEmail={resendEmail}
                />

            </BottomHalf>

            <VerificationModal 
                successful={verificationSuccessful}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                requestMessage={requestMessage}
                persistLoginAfterOTPVerification={persistLoginAfterOTPVerification}
            />
        </StyledContainer>
    </KeyboardAvoidingWrapper>
  )
}

const styles = StyleSheet.create({
    TextInputView:{
        borderBottomWidth: 1,
        width: 50,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "white"
    },
    TextInputText: {
        fontSize: 30,
        color: "#fff",
    }
})
