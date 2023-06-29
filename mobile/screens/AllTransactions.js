import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {Octicons} from '@expo/vector-icons'
import { CredentialsContext } from '../components/CredentialsContext'
import { ScrollView } from 'react-native-gesture-handler'
import { Colors } from '../components/styles'
import {trimString} from '../services/'
import { AntDesign } from '@expo/vector-icons'

const {primary} = Colors;

export default function AllTransactions({navigation, route}) {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    let {name, email, token,  photoUrl} = storedCredentials
    const [userTransactions, setUserTransactions] = useState()

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
          const transactions = response.data.data.reverse()
          setUserTransactions(transactions)
        })
        .catch(function (error) {
          console.log(error);
        });
    
    
      },[]);

    return (
        <View style={styles.container}>
            <ScrollView>
            {userTransactions ? 
                userTransactions.map((item, index) => (
                  
                  <View key={item._id} style={styles.singleTransaction}>
                    <View style={styles.singleTransactionRightSide}>
                      <View style={styles.singletTransactionIconView}>
                        <Octicons name="book" size={18} color="#3f9876" />
                      </View>
                      <View>
                        <Text style={styles.recentTransactionHeadingActual}>{trimString(item.details == undefined ? item.transactionName : item.details, 15)}</Text>
                        <Text style={{textTransform: 'capitalize', color: 'white', fontFamily: 'Nunito'}}>{item.transactionType}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionDetailRightSide}>
                      <View style={styles.recentTransactionAmount}>
                        <Text style={styles.transacitonAmount}>
                          {item.transactionType == 'transfer' ? '-' : '+'} ₦{item.amount}  
                        </Text>
                      </View>
                      {
                        item.status == 'success' ? 
                        <AntDesign style={{marginRight:10}} name="checkcircle" size={13} color="green" /> :
                        item.status == 'pending' ? 
                        <AntDesign style={{marginRight:10}} name="minuscircle" size={13} color="#a87532" /> :
                        item.status == 'failed' ?
                        <AntDesign style={{marginRight:10}} name="closecircle" size={13} color="#a8324a" /> :
                        <AntDesign style={{marginRight:10}} name="checkcircle" size={13} color="green" />
                      }
                    </View>
                  </View>
                ))
                : <ActivityIndicator size="large" color={primary}/>
            }
            </ScrollView>
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
        margin: 10,
        fontFamily: 'Nunito'
      },
      transacitonAmount: {
        color: 'white',
        fontFamily: 'Nunito'
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
  
