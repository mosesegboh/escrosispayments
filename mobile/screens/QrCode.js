import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {randomString} from '../services/';
import { CredentialsContext } from '../components/CredentialsContext';
// import { QRCode } from 'react-native-custom-qr-codes-expo';
import { StyledContainer } from '../components/styles';
import {PaymentsUrl} from '../services/'
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'


export default function QrCode({}) {
  const {storedCredentials} = useContext(CredentialsContext)
  let {email} = storedCredentials
  const [transactionId, setTransactionId] = useState();
  
  useEffect(()=>{
    var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    setTransactionId(rString.toUpperCase());
  },[]);

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <Text>Scan for payment</Text>
        <View style={styles.input}>
          {/* <QRCode 
            color="#fff" 
            content = {`${PaymentsUrl}?email=${email}&transactionId=${transactionId}`}
          /> */}
        </View>
      </StyledContainer>
      </KeyboardAvoidingWrapper>  
  );
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
});
