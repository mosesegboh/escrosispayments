 import styled from "styled-components";
 import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
 import Constants from 'expo-constants';

 const StatusBarHeight = Constants.statusBarHeight;

 //colors
 export const Colors = {
    grey: "#1b181f",
    dark: "#131112",
    myWhite: "#e3e0e4",
    myGreen: "#376556",
    myTextColor: "#6e6b70",
    myPlaceHolderTextColor: "#67646b",
    myButton: "#3b61bf",
    red: "#7f2b3a",
    primary: "#ffffff",
    secondary: "#E5E7EB",
    tertiary: "#1F2937",
    darkLight: "#9CA3AF",
    brand: "#6D28D9",
    green: "#10B981",
    red: "#EF4444"
 };

 const {grey, dark, myWhite, myGreen, red, primary, secondary,myPlaceHolderTextColor, myButton, tertiary, darkLight, brand, green} = Colors;

 export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 10}px;
    background-color: ${dark}
 `
export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`
export const PageLogo = styled.Image`
    width: 250px;
    height: 200px;
`
export const PageTitle = styled.Text`
    font-size: 15px;
    text-align: center;
    font-weight: bold; 
    color: ${myWhite};
    padding: 10px;

    ${(props) => props.welcome &&`
      font-size: 35px;
   `}
`
export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${myWhite};

    ${(props) => props.welcome &&`
      margin-bottom: 5px;
      font-weight: normal;
   `}
`
export const StyledFormArea = styled.View`
    width: 90%;
`
export const StyledTextInput = styled.TextInput`
   background-color: ${grey};
   padding: 15px;
   padding-left: 55px;
   padding-right: 55px;
   border-radius: 0px;
   border-bottom-width: 1px;
   border-bottom-color: '#949197;
   font-size: 16px;
   height: 60px;
   margin-vertical: 0px;
   margin-bottom: 0px;
   margin-top: 10px;
   color: ${myWhite}
   border-bottom-color: ${myWhite}
`
export const StyledInputLabel = styled.Text`
   color: ${tertiary};
   font-size: 13px;
   text-align: left;
   font-family: 'Nunito';
`
export const LeftIcon = styled.View`
   left: 15px;
   top: 38px;
   position: absolute;
   z-index: 1;
`
export const RightIcon = styled.TouchableOpacity`
   right: 15px;
   top: 38px;
   position: absolute;
   z-index: 1;
`
export const StyledButton = styled.TouchableOpacity`
   padding: 10px;
   background-color: ${myButton};
   justify-content: center;
   align-items: center;
   border-radius: 0px;
   margin-vertical: 0px;
   height: 60px;

   ${(props) => props.google == true && `
      background-color: ${green};
      flex-direction: row;
      justify-content: center;

   `}
`

export const ButtonText = styled.Text`
   color: ${myWhite};
   font-size: 16px;

   ${(props) => props.google == true && `
      padding: 25px;
      color: ${myWhite};
   `}
`

export const MsgBox = styled.Text`
   text-align: center
   font-size: 13px; 
   color: ${props => props.type == 'SUCCESS' ? green : red}
`

export const Line = styled.View`
   height: 1px;
   width: 100%;
   background-color: ${darkLight}
   margin-vertical: 10px
`

export const ExtraView = styled.View`
   justify-content: center;
   flex-direction: row;
   align-items: center;
   padding: 10px;
`

export const ExtraText = styled.Text`
   justify-content: center;
   align-content: center;
   color: ${myWhite};
   font-size: 15px;
   font-family: 'Nunito';
`

export const TextLink = styled.TouchableOpacity`
   justify-content: center;
   align-items: center;
`

export const TextLinkContent = styled.Text`
   color: ${myButton};
   font-size: 15px;
   font-family: 'Nunito';

   ${(props) => {
      const {resendStatus} = props;
      if (resendStatus === 'Failed!') {
         return `color: ${Colors.red}`;
      }else if (resendStatus === 'Sent!') {
         return `color: ${Colors.green}`;
      }
   }}
`

//verification components
export const TopHalf = styled.View`
   flex: 1;
   justify-content: center;
   padding: 20px;
`

export const IconBg = styled.View`
   width: 300px;
   height: 300px;
   background-color: ${Colors.myGreen};
   border-radius: 250px;
   justify-content: center;
   align-items: center;
   margin-top: 30px;
`

export const BottomHalf = styled(TopHalf)`
   justify-content: space-around;
`

export const InfoText = styled.Text`
   color: white;
   font-size: 15px;
   text-align: center;
   font-family: Nunito;
`

export const EmphasizeText = styled.Text`
   font-weight: bold;
   font-style: italic;
   font-family: 'Nunito';
`

export const CodeInputSection = styled.View`
      flex: 1;
      align-items: center;
      justify-content: center;
      margin-vertical: 30px;
`
// position: absolute;
//       width: 1px;
//       height: 1px;
//       opacity: 0;
export const HiddenTextInput = styled.Text`
      border-color: ${green};
      border-width: 2px;
      border-radius: 5px;
      padding: 12px;
      margin-top: 15px;
      width: 300px;
      color: ${myWhite};
`

export const CodeInputContainer = styled.Pressable`
   width: 70%;
   flex-direction: row;
   justify-content: space-between;
`

export const CodeInput = styled.View`
   border-color:${Colors.green};
   min-width: 15%;
   border-width: 2px;
   border-radius: 5px;
   padding: 12px;
`

export const CodeInputText = styled.Text`
   font-size: 22px;
   font-weight: bold;
   text-align; center;
   color: ${Colors.brand};
`

export const CodeInputFocused = styled(CodeInput)`
   border-color: ${Colors.green}
`

export const InlineGroup = styled.View`
   flex-direction: row;
   padding: 10px;
   justify-content: center;
   align-items: center;
`

export const ModalContainer = styled(StyledContainer)`
   justify-content: center;
   align-items: center;
   background-color: rgba(0, 0, 0, 0.7);
`

export const ModalView = styled.View`
   margin: 20px;
   background-color: white;
   border-radius: 20px;
   padding: 35px;
   align-items: center;
   elevation: 5;
   shadow-color: #000;
   shadow-offset: 0px 2px;
   shadow-opacity: 0.25;
   shadow-radius: 4px;
   width: 100%;
`

export const WelcomeContainer = styled(InnerContainer)`
   padding: 25px;
   padding-top: 10px;
   justify-content: center;
`;

export const Avatar = styled.Image`
   width: 80px
   height: 80px;
   margin: auto;
   border-radius: 50px;
   border-width: 2px;
   border-color: ${secondary};
   margin-bottom: 10px
   margint-top: 10px;
`

export const WelcomeImage = styled.Image`
   height: 50%;
   min-width: 100%;
`




