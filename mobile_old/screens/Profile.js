import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Text, StyleSheet, View} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    InnerContainer,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage, 
    Avatar,
} from '../components/styles';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';

const Profile = () => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {username, email, photoUrl} = storedCredentials;
    const AvatarImg = photoUrl ? {uri: photoUrl} : require('./../assets/img/profile_pic.png');

    const clearLogin = () => {
        AsyncStorage.removeItem('escrosisCredentials')
        .then(() => {
            setStoredCredentials("")
        })
        .catch(error => console.log(error))
    }

    return (
        <>
            <StatusBar style="light"/>
            <InnerContainer>
                <WelcomeImage resizeMode="cover" source={require('./../assets/img/menu_bg.png')}/>
                <WelcomeContainer>
                    <Text style={styles.welcomeText}>Welcome</Text>
                    <SubTitle style={styles.nameText}>{username || 'Egboh Moses'}</SubTitle>
                    <SubTitle style={styles.nameText}>{email || 'olgasimpson@gmail.com'}</SubTitle>
                    <StyledFormArea>
                    {/* <Avatar resizeMode="cover" source={require('./../assets/img/profile_pic.png')} /> */}
                    <View style={styles.avatar}>
                    <Ionicons name="person-circle" size={70} color="#3b60bd" />
                    </View>
                    <Line />
                    <StyledButton onPress={clearLogin}>
                        <ButtonText>
                            Logout
                        </ButtonText>
                    </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
      backgroundColor: '#131112',
      padding: 8,
      fontWeight: 'bold',
    },
    welcomeText: {
        color: '#131112',
        fontSize: 30,
        fontWeight: '400',
        fontFamily: 'Nunito'
    },
    nameText: {
        color: '#131112',
        fontSize: 15,
        fontWeight: '400',
        fontFamily: 'Nunito'
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Profile;