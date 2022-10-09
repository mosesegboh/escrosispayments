import React, {useContext} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextLink } from 'react-native';
import { Colors, ExtraView } from '../components/styles';
import Constants from 'expo-constants';

// Add this in your component file
// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);

//Colors
const {myButton,grey, myWhite, myPlaceHolderTextColor, darkLight, primary} = Colors;

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

//you can get rid of navigation and route
export default function Dashboard ({navigation, route}) {
  // const {name, email} = route.params

  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

  //context
  let {name, email, photoUrl} = storedCredentials
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
          <Text style={styles.balanceText}>
              TOTAL BALANCE
          </Text>
          <Text style={styles.balanceText}>Hello {name || 'Egboh Moses jjjj'}</Text>
          <Text style={styles.balanceText}>{email || 'mosesegboh@gmail.com'}</Text>
          <Text style={styles.balanceValue}>
              ₦0.00
          </Text>
          <TouchableOpacity onPress={clearLogin} style={styles.balanceValue}>
              <Text>Logout</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.inflows}>
        <View style={styles.income}>
          <View>
            <Text style={styles.incomeText}>
              LOCKED
            </Text>
            <Text style={styles.incomeValue}>
              ₦0.00
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
              ₦0.00
            </Text>
          </View>
          <View style={styles.unlockedIconBckground}>
            <Octicons name="arrow-down" size={22} color="#3f9876" />
          </View>
        </View>
      </View>

      <View style={styles.recentTransactionHeading}>
          <Text style={styles.recentTransactionText}>Recent Transactions</Text>
          <Text style={styles.viewAllText}>View All</Text>
      </View>

      <View style={styles.singleTransaction}>
        <View style={styles.singletTransactionIconView}>
          <Octicons name="book" size={22} color="#3f9876" />
        </View>
        <View style={styles.transactionDetailRightSide}>
          <View>
            <Text style={styles.recentTransactionHeadingActual}>Metro Railway</Text>
            <Text style={styles.transacitonDetail}>Transaction</Text>
          </View>
          <View style={styles.recentTransactionAmount}>
            <Text style={styles.transacitonAmount}>+₦0.00</Text>
          </View>
        </View>
      </View>

      <View style={styles.singleTransaction}>
        <View style={styles.singletTransactionIconView}>
          <Octicons name="book" size={22} color="#3f9876" />
        </View>
        <View style={styles.transactionDetailRightSide}>
          <View>
            <Text style={styles.recentTransactionHeadingActual}>Metro Railway</Text>
            <Text style={styles.transacitonDetail}>Transaction</Text>
          </View>
          <View style={styles.recentTransactionAmount}>
            <Text style={styles.transacitonAmount}>+₦0.00</Text>
          </View>
        </View>
      </View>

      <View style={styles.singleTransaction}>
        <View style={styles.singletTransactionIconView}>
          <Octicons name="book" size={22} color="#3f9876" />
        </View>
        <View style={styles.transactionDetailRightSide}>
          <View>
            <Text style={styles.recentTransactionHeadingActual}>Metro Railway</Text>
            <Text style={styles.transacitonDetail}>Transaction</Text>
          </View>
          <View style={styles.recentTransactionAmount}>
            <Text style={styles.transacitonAmount}>+₦0.00</Text>
          </View>
        </View>
      </View>

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
    backgroundColor: '#1b181f',
    height: 130,
    width: 400,
    flexDirection: 'column',
    alignSelf: 'center',
    borderRadius: 3,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    color: "white"
  },
  balanceValue: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 25,
  },
  inflows: {
    height: 150,
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  income: {
    height: '100%',
    width: '48%',
    backgroundColor: '#1b181f',
    marginRight: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 3
  },
  locked: {
    height: '100%',
    width: '48%',
    backgroundColor: '#1b181f',
    alignSelf: 'center',
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
    marginTop: 70 
  },
  incomeValue: {
    color: "#fff",
    fontWeight: 'bold', 
    fontSize: 25, 
  },
  unlockedText: {
    color: "#fff",
    fontWeight: 'bold', 
    marginTop: 70 
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
    paddingTop: 10,
  },
  recentTransactionText: {
    fontWeight: 'bold',
    color: "#fff",
  },
  viewAllText: {
    fontWeight: 'bold',
    color: "#fff",
  },
  singleTransaction: {
    flexDirection: 'row',
    backgroundColor: "#1b181f",
    height: 100,
    width: '98%',
    marginTop: 10,
    borderRadius: 5,
  },
  singletTransactionIconView: {
    backgroundColor: "#2f2b33",
    height: 70,
    width: 70,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  transactionDetailRightSide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTransactionAmount: {
    justifyContent: 'flex-end',
    marginLeft: 150
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
  }
});
