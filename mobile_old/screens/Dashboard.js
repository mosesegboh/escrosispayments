import React, {useContext, useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, TextLink, TextLinkContent } from '../components/styles';
import {trimString} from '../services/';
import { useIsFocused } from '@react-navigation/native'
import {Octicons} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from '../components/CredentialsContext';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 
import { BaseUrl } from '../services/';
const { primary} = Colors;

//you can get rid of navigation and route
export default function Dashboard ({navigation, route}) {
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  const [userTransactions, setUserTransactions] = useState([])
  const [isUserTransactions, setIsUserTransactions] = useState()
  const [balance, setBalance] = useState()
  const [lockedTransaction, setLockedTransaction] = useState()
  const [unLockedTransaction, setUnLockedTransaction] = useState()
  const isFocused = useIsFocused()

  let {name, email, token,  photoUrl} = storedCredentials
  // console.log(name, email, token, 'Name and email')
  // console.log(storedCredentials, 'this is the stored credentials')
  // const {name, email} = route.params
  useEffect(()=>{
    var axios = require('axios');
    var data = JSON.stringify({
      "email": email,
      "token": `Bearer ${token}`
    });

    var config = {
      method: 'post',
    url: `${BaseUrl}/transaction/get-transactions`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data : data
    };

    // console.log(config, '--config')
    // return

    axios(config)
    .then(function (response) {
      // console.log(response)
      if (response.data.status == "SUCCESS") {
        
        var transactions = response.data.data;
        // console.log(transactions, '--transactions')
        // return
        // console.log(response.data.data)
        // return
        const latestIndex = transactions.length
        const latestValue = transactions[latestIndex-1]
        setBalance(transactions.length > 0 ? latestValue.balance : 0.00)
        setLockedTransaction(transactions.length > 0 ? latestValue.lockedTransaction : 0.00)
        setUnLockedTransaction(transactions.length > 0 ? latestValue.unLockedTransaction : 0.00)
        console.log(response.data.data.length === 0)
        setIsUserTransactions(response.data.data.length === 0)
        setUserTransactions(response.data.data.reverse())
      }else{
        alert('kindly login again')
        clearLogin()
        // navigation.navigate('Login')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },[isFocused]);

  
  // console.log(token)
  //const AvatarImg = photoUrl ? {uri: photoUrl} : require('./../assets/img/img1')

  //for google sign in
  // name = name ? name : displayName

  const clearLogin = async () => {
    try {
      if (!__DEV__) {
        await GoogleSignIn.signOutAsync()
        await  AsyncStorage.removeItem('escrosisCredentials')
      }else{
        await  AsyncStorage.removeItem('escrosisCredentials')
      }
      setStoredCredentials('')
    }catch (message) {
      alert('Logout Error: ' + message)
    }
    // AsyncStorage.removeItem('escrosisCredentials').then(() =>{
    //   setStoredCredentials("")
    // }).catch(err => {
    //   console.error(err)
    // })
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceView}>
          <Text style={styles.balanceText}>Hello {name || 'Egboh Moses'}</Text>
          {/* <Text style={styles.balanceText}>{email || 'mosesegboh@gmail.com'}</Text> */}
          {/* <Text style={styles.balanceText}>{token || 'token'}</Text> */}
          <Text style={styles.balanceText}>
              TOTAL BALANCE
          </Text>
          <Text style={styles.balanceValue}>
          ₦{balance || '0.00'}
          </Text>
          {/* <TouchableOpacity onPress={clearLogin} style={styles.balanceValue}>
              <Text>Logout</Text>
          </TouchableOpacity> */}
      </View>

      <View style={styles.servicesIcons}>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddToWallet', {email: email, token: token, balance: balance})}>
          <Ionicons name='wallet' size={24} color='green' />
          <Text style={styles.billsText}>wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('PurchaseCredit', {email: email, token: token, balance: balance})}>
          <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="green" />
          <Text style={styles.billsText}>airtime</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('Transfer', {email: email, token: token, balance: balance})}>
          <MaterialCommunityIcons name="bank-transfer-out" size={32} color="green" />
          <Text style={styles.billsText}>transfers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'electricity'})}>
          <Octicons name="zap" size={22} color="green" />
          <Text style={styles.billsText}>electricity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'internet'})}>
          <Octicons name="browser" size={22} color="green" />
          <Text style={styles.billsText}>internet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance,  bill: 'data'})}>
          <MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={24} color="green" />
          <Text style={styles.billsText}>data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'tithe'})}>
          <FontAwesome5 name="church" size={24} color="green" />
          <Text style={styles.billsText}>pay tithes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'cable'})}>
          <Ionicons name="tv" size={24} color="green" />
          <Text style={styles.billsText}>cable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'tax'})}>
          <MaterialIcons name="payments" size={24} color="green" />
          <Text style={styles.billsText}>pay tax</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('BillPayment', {email: email, token: token, balance: balance, bill: 'dhl'})}>
          <MaterialCommunityIcons name="cash" size={26} color="green" />
          <Text style={styles.billsText}>shipping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('ComingSoon', {email: email, token: token, balance: balance})}>
          <MaterialCommunityIcons name="earth-arrow-right" size={20} color="green" />
          <Text style={styles.billsText}>int. transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('VirtualCard', {email: email, token: token, balance: balance})}>
          <Ionicons name="card" size={24} color="green" />
          <Text style={styles.billsText}>v-cards</Text>
        </TouchableOpacity> 
      </View>

      <View style={styles.inflows}>
        <View style={styles.income}>
          <View>
            <Text style={styles.incomeText}>
              LOCKED
            </Text>
            <Text style={styles.incomeValue}>
              ₦{lockedTransaction || 0.00}
            </Text>
          </View>
          <View style={styles.lockedIconBckground}>
            <Octicons name="lock" size={22} color="#c74657" />
          </View>
        </View>
        <View style={styles.income}>
          <View>
            <Text style={styles.unlockedText}>
              UNLOCKED
            </Text>
            <Text style={styles.incomeValue}>
              ₦{unLockedTransaction || 0.00} 
            </Text>
          </View>
          <View style={styles.unlockedIconBckground}>
            <Octicons name="unlock" size={22} color="#3f9876" />
          </View>
        </View>
      </View>

      <View style={styles.recentTransactionHeading}>
        <Text style={styles.recentTransactionText}>Recent Transactions</Text>
        <TextLink onPress={() => navigation.navigate('AllTransactions', {email: email, token: token})}>
            <TextLinkContent>View All</TextLinkContent>
        </TextLink>
      </View>

      <ScrollView>
          {userTransactions.length > 0 ? 
            userTransactions.slice(0, 5).map((item, index) => (
              <TouchableOpacity onPress={() => navigation.navigate('SingleTransaction', {transactionDetails: item})} key={item._id} style={styles.singleTransaction}>
                <View style={styles.singleTransactionRightSide}>
                  <View style={styles.singletTransactionIconView}>
                    <Octicons name="book" size={18} color="#3f9876" />
                  </View>
                  <View>
                    <Text style={styles.recentTransactionHeadingActual}>{trimString(item.details == undefined ? item.transactionName : item.details, 10)}</Text>
                    <Text style={{textTransform: 'capitalize', color: 'white', fontFamily: 'Nunito'}}>{item.transactionType}</Text>
                  </View>
                </View>
                
                <View style={styles.transactionDetailRightSide}>
                    
                  <View style={styles.recentTransactionAmount}>
                    <Text style={styles.transacitonAmount}>
                      {item.transactionType == 'transfer' ? '-' : '+'} ₦{item.amount}  
                    </Text>
                  </View>
                  <AntDesign name="checkcircle" size={13} color="green" />
                </View>
              </TouchableOpacity>
            ))
              : (isUserTransactions) ?  
              <View style={{alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: 20}}>
                <MaterialIcons name="hourglass-empty" size={36} color="green" />
                <Text style={{alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: 20}}>You do not have any transactions at the moment!</Text>
              </View>
              :
              <ActivityIndicator size="large" color={primary}/> 
            }
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction', {balance: balance})}>
          <Octicons name="plus" size={22} color="#fff" />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#131112',
    padding: 8,
  },
  transacitonDetail: {
      color: 'white',
      textTransform: 'capitalize'
  },
  balanceView: {
    backgroundColor: 'rgba(59, 96, 189, 0.2)',
    height: 130,
    width: '99%',
    flexDirection: 'column',
    alignSelf: 'center',
    // borderRadius: 3,
    marginTop: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    color: "white",
    fontFamily: 'Nunito',
    fontSize: 15,
  },
  billsText: {
    color: "#3b60bd",
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Nunito'
  },
  balanceValue: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 25,
    fontFamily: 'Nunito'
  },
  inflows: {
    height: 150,
    width: '99%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  income: {
    height: '80%',
    width: '49.7%',
    backgroundColor: 'rgba(59, 96, 189, 0.2)',
    marginRight: 0,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    // borderRadius: 5
  },
  locked: {
    height: '100%',
    width: '49.7%',
    backgroundColor: '#1b181f',
    alignSelf: 'center',
  },
  servicesIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    JustifyContent: 'center',
  },
  lockedIconBckground: {
    height:40,
    width: 40,
    backgroundColor: "#381a22",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeText: {
    color: "#fff",
    // fontWeight: 'bold', 
    marginTop: 50,
    fontFamily: 'Nunito'
  },
  incomeValue: {
    color: "#fff",
    fontWeight: 'bold', 
    fontSize: 20,
    fontFamily: 'Nunito'
  },
  unlockedText: {
    color: "#fff",
    // fontWeight: 'bold', 
    marginTop: 50,
    fontFamily: 'Nunito'
  },
  unlockedIconBckground: {
    height:40,
    width: 40,
    backgroundColor: "#0e3026",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTransactionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    paddingTop: 0,
  },
  recentTransactionText: {
    fontWeight: 'bold',
    color: "#fff",
    // fontWeight: '400',
  },
  viewAllText: {
    fontWeight: 'bold',
    color: "#fff",
  },
  singleTransaction: {
    flexDirection: 'row',
    backgroundColor: "rgba(59, 96, 189, 0.2)",
    height: 70,
    width: '98%',
    marginTop: 3,
    justifyContent: 'space-between',
    // borderRadius: 5,
  },
  singleTransactionRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  singletTransactionIconView: {
    backgroundColor: "#2f2b33",
    height: 50,
    width: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  transactionDetailRightSide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginLeft: 0
  },
  recentTransactionAmount: {
    justifyContent: 'flex-end',
    margin: 10,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  transacitonAmount: {
    color: 'white',
  },
  recentTransactionHeadingActual: {
    color: 'white',
    fontFamily: 'Nunito',
    textTransform: 'capitalize'
  },
  transacitonDetail: {
      color: 'white',
      fontFamily: 'Nunito'
  },
  addButton: {
    backgroundColor: '#3b60bd',
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft:310,
    marginTop: -60,
    elevation: 5
  },
  billPaymentIcon: {
    backgroundColor: 'rgba(59, 96, 189, 0.2)',
    height: 60,
    width: '16.1%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 1,
    opacity: 5,
    marginRight: 2
  }
});
