import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
// import { View } from 'formik';

//formik
import {Formik} from  'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

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
} from './../components/styles';

import {View} from 'react-native';

const {myButton, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;

// const white = "#fff";

const Login = () => {
    const [hidePassword, setHidePassword] = useState(true);

    return (
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
                {/* <PageLogo resizeMode="cover" source={require('./../assets/img/img1.png')} /> */}
                <PageTitle>Escrosis</PageTitle>
                <SubTitle>Account Login</SubTitle>

                <Formik 
                    initialValues={{email: '', password: ''}}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>

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
                    <MsgBox>...</MsgBox>
                    <StyledButton onPress={handleSubmit}>
                        <ButtonText>
                            Login
                        </ButtonText>
                    </StyledButton>
                    <Line />
                    <StyledButton google={true} onPress={handleSubmit}>
                        <Fontisto name="google" color={primary} size={25}/>
                        <ButtonText google={true}>Sign in with Google</ButtonText>
                    </StyledButton>
                    <ExtraView>
                        <ExtraText>Don't have account already ?</ExtraText>
                        <TextLink>
                            <TextLinkContent>Sign Up</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
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