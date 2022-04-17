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

import {View, TouchableOpacity} from 'react-native';
//Colors
const {myButton, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
//DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';

const SignUp = () => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));

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
                    initialValues={{ fullName: '', email: '', dateOfBirth: '', password: '', confirmPassword: ''}}
                    
                    onSubmit={(values) => {
                        console.log(values);
                    }}

                >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>

                    <MyTextInput 
                        // label="Email Address"
                        icon="person"
                        placeholder="Full Name"
                        placeholderTextColor={myPlaceHolderTextColor}
                        onChangeText={handleChange('fullName')}
                        onBlur = {handleBlur('fullName')}
                        value={values.fullName}
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

                    <MsgBox>...</MsgBox>

                    <StyledButton onPress={handleSubmit}>
                        <ButtonText>
                            Login
                        </ButtonText>
                    </StyledButton>
                    <Line />
                    
                    <ExtraView>
                        <ExtraText>Already have an account?</ExtraText>
                        <TextLink>
                            <TextLinkContent>Login</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
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