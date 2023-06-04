import React, {useState} from 'react';
import {StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { FLUTTERWAVE_PUBLIC_KEY } from '../services';
import {BaseUrl} from '../services/'
import  axios from 'axios'
import {PayWithFlutterwave} from 'flutterwave-react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 300;

const WalletConfirmModal = (props) => {
    const [hideButton, setHideButton] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const transactionDate = new Date().toString();

    const handleAddTransaction = () => {
        setSubmitting(true);
        handleMessage(null)
        const url = `${BaseUrl}/transaction/add-transaction`;
  
        let headers = 
        {
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
  
        const credentials = props.transactionData
  
        console.log(credentials);
  
        axios.post(url, credentials, headers).then((response) => {
          // token = response.token
          const result = response.data;
          console.log(result)
          const {message, status} = result
         
          if(status == 'SUCCESS'){
            setSubmitting(false)
            // navigation.navigate('AddTransaction')
            handleMessage(message, status)
  
            //set the form to null
            setInputValueAmount(null)
          //   setDetails(null)
            setData([])
            setHideButton(false)
          //   setDate(null)
          }

          closeModal(false, 'Ok')
  
          // navigation.navigate('AddTransaction')
        }).catch((error) => {
            console.log(error)
            setSubmitting(false)
            closeModal(false, 'Cancel')
            handleMessage("An error occured and this transaction is not completed, check your network and try again")
        })
    }

    const handleMessage = (message,type="FAILED") => {
        setMessage(message)
        setMessageType(type)
    }

    const closeModal = (bool, data) => {
        props.changeModalVisible(bool)
        props.setData(data)

        //make the api call using flutterwave
    }

    const handleOnAbort = () => {
        alert ('The transaction failed. Try again later')
        return
      }
    
    return(
        <TouchableOpacity
            style={styles.container}
            disabled={true}
        >
            <View style={styles.modal}>
                <View style={styles.textView}>
                    <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                        <Text style={[styles.text, {fontSize: 20}]}>Confirm Your Transaction</Text>
                        <View style = {styles.lineStyle} />
                    <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                    <Text style={styles.text}>Transaction ID: {props.transactionData.transactionId}</Text>
                    <Text style={styles.text}>Email: {props.transactionData.email}</Text>
                    <Text style={styles.text}>Amount: {props.transactionData.amount}</Text>
                    <Text style={styles.text}>Transaction Type: {props.transactionData.transactionType}</Text>
                    <Text style={styles.text}>Transaction Name: {props.transactionData.transactionName}</Text>
                    <Text style={styles.text}>Transaction Details: {props.transactionData.details}</Text>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.touchableOpacity}
                        onPress={() => closeModal(false, 'Cancel')}
                    >
                        <Text style={[styles.text, {color: 'red'}]}>Cancel</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.touchableOpacity}
                        onPress={() => closeModal(false, 'Ok')}
                    >
                        <Text style={[styles.text, {color: 'blue'}]}>Ok</Text>
                    </TouchableOpacity> */}
                    {hideButton && !submitting && <PayWithFlutterwave
                    // style={styles.addTransactionButton}
                    onRedirect={handleAddTransaction}
                    // onWillInitialize = {handleOnRedirect}
                    options={{
                    tx_ref: props.transactionData.transactionId,
                    authorization: FLUTTERWAVE_PUBLIC_KEY,
                    customer: {
                        email: props.transactionData.email
                    },
                    amount: Number(props.transactionData.amount),
                    currency: 'NGN',
                    payment_options: 'card',
                    onAbort: {handleOnAbort}
                    }}
                    customButton={(props) => (
                    <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={props.onPress}
                        isBusy={props.isInitializing}
                        >
                        <Text style={[styles.text, {color: 'blue'}]}>Make Payment</Text>
                    </TouchableOpacity>
                    )}
                />}
                

                {hideButton && submitting && <TouchableOpacity 
            onPress={handleAddTransaction}
            style={styles.touchableOpacity}>
              <Text style={[styles.text, {color: 'blue'}]}><ActivityIndicator size="large" color={primary}/></Text>
          </TouchableOpacity>}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    modal: {
       height: HEIGHT_MODAL,
       width: WIDTH - 80,
       paddingTop: 10,
       backgroundColor: 'white',
       borderRadius: 10,
    },
    textView: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        margin: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonView: {
        width: '100%',
        flexDirection: 'row',
    },
    touchableOpacity: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center'
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    },
    addTransactionButton: {
        backgroundColor: '#3a5fbc',
        height: 50,
        width: 350,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
      },
})

export default WalletConfirmModal;
