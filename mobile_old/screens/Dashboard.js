import React, {useContext, useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, ExtraView, TextLink, TextLinkContent } from '../components/styles';
import Constants from 'expo-constants';
import  axios from 'axios'
import {trimString} from '../services/';

// Install These Packages
// import SlidingUpPanel from 'rn-sliding-up-panel'
import Carousel from 'react-native-snap-carousel'

// From Expo
import {MaterialIcons} from '@expo/vector-icons'

// Add this in your component file
// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);

//Colors
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from '../components/CredentialsContext';
import { ScrollView } from 'react-native-gesture-handler';


//you can get rid of navigation and route
export default function Dashboard ({navigation, route}) {
  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  const [userTransactions, setUserTransactions] = useState()
  const [balance, setBalance] = useState()
  const [lockedTransaction, setLockedTransaction] = useState()
  const [unLockedTransaction, setUnLockedTransaction] = useState()

  //context
  let {name, email, token,  photoUrl} = storedCredentials
  // const {name, email} = route.params
  useEffect(()=>{
    var axios = require('axios');
    var data = JSON.stringify({
      "email": email,
      "token": `Bearer ${token}`
    });

    var config = {
      method: 'post',
      url: 'https://boiling-everglades-35416.herokuapp.com/transaction/get-transactions',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      setUserTransactions(response.data.data)
      const latestIndex = response.data.data.length
      // const latest = response.data.data
      const latestValue = response.data.data[latestIndex-1]
      setBalance(latestValue.balance)
      setLockedTransaction(latestValue.lockedTransaction)
      setUnLockedTransaction(latestValue.unLockedTransaction)
      // console.log(latestValue)
      // console.log(JSON.stringify(response.data.data.length));
      // console.log(userTransactions)
    })
    .catch(function (error) {
      console.log(error);
    });


  },[]);

  
  // console.log(token)
  //const AvatarImg = photoUrl ? {uri: photoUrl} : require('./../assets/img/img1')

  //for google sign in
  name = name ? name : displayName

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
          {balance || '₦0.00'}
          </Text>
          <TouchableOpacity onPress={clearLogin} style={styles.balanceValue}>
              <Text>Logout</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.servicesIcons}>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="mail" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('PurchaseCredit')}>
            <Octicons name="megaphone" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>airtime</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="arrow-both" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>transfers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="archive" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>pay-tithes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="browser" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="zap" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>electricity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="device-desktop" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>cable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="graph" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>Tax</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="pulse" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>internet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="arrow-both" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>tolls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="credit-card" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>v-cards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.billPaymentIcon} onPress={() => navigation.navigate('AddTransaction')}>
            <Octicons name="north-star" size={18} color="#3B60BD" />
            <Text style={styles.billsText}>crypto</Text>
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
            <Octicons name="arrow-down" size={22} color="#3f9876" />
          </View>
        </View>
      </View>

      <View style={styles.recentTransactionHeading}>
          <Text style={styles.recentTransactionText}>Recent Transactions</Text>
          {/* <Text style={styles.viewAllText}>View All</Text> */}
          <TextLink onPress={() => navigation.navigate('AllTransactions', {email: email, token: token})}>
              <TextLinkContent>View All</TextLinkContent>
          </TextLink>
      </View>

      <ScrollView>
          {/* {userTransactions ? 
                userTransactions.slice(0, 5).map((item, index) => (
                  
                  <View key={item._id} style={styles.singleTransaction}>
                    <View style={styles.singleTransactionRightSide}>
                      <View style={styles.singletTransactionIconView}>
                        <Octicons name="book" size={18} color="#3f9876" />
                      </View>
                      <View>
                        <Text style={styles.recentTransactionHeadingActual}>{trimString(item.details, 10)}</Text>
                        <Text style={styles.transacitonDetail}>{item.transactionType}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionDetailRightSide}>
                      
                      <View style={styles.recentTransactionAmount}>
                        <Text style={styles.transacitonAmount}>+ {item.amount}</Text>
                      </View>
                    </View>
                  </View>
                ))
                : <ActivityIndicator size="large" color={primary}/>
            } */}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
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
    color: "white"
  },
  billsText: {
    color: "#3b60bd",
    fontSize: 10,
    fontWeight: '400',
  },
  balanceValue: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 25,
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
    fontWeight: 'bold', 
    marginTop: 50 
  },
  incomeValue: {
    color: "#fff",
    fontWeight: 'bold', 
    fontSize: 20, 
  },
  unlockedText: {
    color: "#fff",
    fontWeight: 'bold', 
    marginTop: 50 
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
    margin: 10
  },
  transacitonAmount: {
    color: 'white',
  },
  recentTransactionHeadingActual: {
    color: 'white',
  },
  transacitonDetail: {
      color: 'white',
  },
  addButton: {
    backgroundColor: '#3b60bd',
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft:310,
    marginTop: 10
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
