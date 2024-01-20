import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { Line } from '../components/styles'
import { MsgBox } from '../components/styles'

export default function SingleTransaction({navigation, route}) {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState()

  const {transactionDetails} = route.params

  const handleCancelTransaction = (transactFromWallet, transactFromAddedFunds) => {
    setSubmitting(true)
    handleMessage(null)

    const url = `${BaseUrl}/transaction/add-transaction`;

    let headers = {
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const credentials = {
      email: transactionDetails.email,
      transactionId: transactionDetails.transactionId,
      amount: transactionDetails.amount,
      transactionType: transactionDetails.transactionType,
      date: new Date(),
      transactionName: "cancelEscrow",
      details: transactionDetails.details,
      token: `Bearer ${token}`
    }

    axios.post(url, credentials, headers).then((response) => {
      const result = response.data;
    //   console.log(result)
      const {message, status} = result
      
      if (status == 'SUCCESS') {
        setSubmitting(false)
        handleMessage(message, status)
        alert('The transaction has been cancelled')
      }else{
        handleMessage('An error Occured')
        setSubmitting(false)
      }
    }).catch((error) => {
        console.log(error, '-error from axios')
        setSubmitting(false)
        handleMessage("An error occured and this transaction is not completed, check your network and try again")
    })
  }

  const handleMessage = (message,type="FAILED") => {
    setMessage(message)
    setMessageType(type)
  }

  const handleRedeemTransaction = () => {
    setSubmitting(true)
    handleMessage(null)

    const url = `${BaseUrl}/transaction/add-transaction`;

    let headers = {
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const credentials = {
      email: transactionDetails.email,
      transactionId: transactionDetails.transactionId,
      amount: transactionDetails.amount,
      transactionType: transactionDetails.transactionType,
      date: new Date(),
      transactionName: "redeemEscrow",
      details: transactionDetails.details,
      token: `Bearer ${token}`
    }

    axios.post(url, credentials, headers).then((response) => {
      const result = response.data;
    //   console.log(result)
      const {message, status} = result
      
      if (status == 'SUCCESS') {
        setSubmitting(false)
        handleMessage(message, status)
        alert('The transaction has been cancelled')
      }else{
        handleMessage('An error Occured')
        setSubmitting(false)
      }
    }).catch((error) => {
        console.log(error, '-error from axios')
        setSubmitting(false)
        handleMessage("An error occured and this transaction is not completed, check your network and try again")
    })
  }

  return (
    <View style={styles.container}>
        <View style={styles.innerContainer}>
            {
                transactionDetails.status == 'success' ? 
                <AntDesign style={{marginRight:10}} name="checkcircle" size={100} color="green" /> :
                transactionDetails.status == 'pending' ? 
                <AntDesign style={{marginRight:10}} name="minuscircle" size={100} color="#a87532" /> :
                transactionDetails.status == 'failed' ?
                <AntDesign style={{marginRight:10}} name="closecircle" size={100} color="#a8324a" /> :
                <AntDesign style={{marginRight:10}} name="checkcircle" size={100} color="green" />
            }
            <Text style={styles.textHeading}>Transaction Details</Text>
            <Line />
            <Text style={styles.textBody}>Status: {transactionDetails.status == 'success' ? 'Transaction Successful' :
                        transactionDetails.status == 'pending' ? 'Transaction Pending' :
                        transactionDetails.status == 'failed' ?  'Transaction Failed' : ''}</Text>
            <Text style={styles.textBody}>Transaction ID: {transactionDetails.transactionId}</Text>
            <Text style={styles.textBody}>Email: {transactionDetails.email}</Text>
            <Text style={styles.textBody}>Transaction Type: {transactionDetails.transactionType}</Text>
            <Text style={styles.textBody}>Details: {transactionDetails.details}</Text>
            <Text style={styles.textBody}>Amount: ₦{transactionDetails.amount}</Text>
            <Text style={styles.textBody}>Balance: ₦{transactionDetails.balance}</Text>

            <MsgBox type={messageType}>{message}</MsgBox>

            {transactionDetails.transactionType == "FirstLeg" ? 
            !submitting &&<TouchableOpacity
                style={styles.addTransactionButton}
                onPress={handleCancelTransaction(transactionDetails.transactionId)}
            >
            <Text style={styles.buttonText}>Cancel Transaction</Text>
            </TouchableOpacity> : 
            transactionDetails.status == "canceled" ?
            <Text>Transaction Cancelled</Text> :
            <Text></Text>}

            {transactionDetails.transactionType == "SecondLeg" ? !submitting && <TouchableOpacity
                style={styles.addTransactionButton}
                onPress={handleRedeemTransaction(transactionDetails.transactionId)}
            >
            <Text style={styles.buttonText}>Redeem Transaction</Text>
            </TouchableOpacity> : <Text></Text>}

            {submitting && <TouchableOpacity 
            style={styles.addTransactionButton}>
              <Text style={styles.buttonText}><ActivityIndicator size="large" color={primary}/></Text>
            </TouchableOpacity>}

        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
      backgroundColor: '#131112',
      padding: 8,
    },
    innerContainer: {
        backgroundColor: 'rgba(59, 96, 189, 0.2)',
        flex: 1,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        height: '70%',
        border: '10px',
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        borderTopColor: 'white',
        borderTopWidth: 2,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
        borderRightColor: 'white',
        borderRightWidth: 2,
        marginBottom: 10
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
    textHeading : {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Nunito',
        fontSize: 25,
        marginBottom: 10,
        marginTop: 10,
    },
    textBody: {
        fontFamily: 'Nunito',
        // fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
        marginBottom: 10,
    },
    transacitonDetail: {
        color: 'white',
    },
    buttonText: {
        color: "#fff",
        fontFamily: 'Nunito',
    },
  });
