import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    WelcomeContainer,
    WelcomeImage, 
    Avatar,
} from '../components/styles';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';


//the below was a parameter in the welcome function before the persis login function was created
//{
    // navigation, route
    //}

const Profile = () => {
    //route parameter will enable us get the data that was passed when navigating to the current page.
        // const {username, email, photoUrl} = route.params

        //thesame thing as the context consumer
    //destructure our stored credentials from the context
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
                    <PageTitle welcome={true}>Welcome Escrosis User</PageTitle>
                    <SubTitle welcome={true}>{username || 'Egboh Moses'}</SubTitle>
                    <SubTitle welcome={true}>{email || 'olgasimpson@gmail.com'}</SubTitle>
                    <StyledFormArea>
                    <Avatar resizeMode="cover" source={require('./../assets/img/profile_pic.png')} />
                       
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

export default Profile;