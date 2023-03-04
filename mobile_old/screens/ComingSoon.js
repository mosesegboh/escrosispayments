import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import {
    Line,
} from '../components/styles';

export default function ComingSoon({navigation, route}) {

  const {transactionDetails} = route.params

  console.log(transactionDetails)

  return (
    <View style={styles.container}>
        <View style={styles.innerContainer}>
        <MaterialIcons name="dangerous" size={200} color="red" />
            <Text style={styles.textHeading}>Oops!!!</Text>
            <Line />
            <Text style={styles.textBody}>Something went wrong </Text>
            <Text style={styles.textBody}>Please try again later</Text>
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
        fontSize: 50,
        marginBottom: 10,
        marginTop: 10,
    },
    textBody: {
        fontFamily: 'Nunito',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
        marginBottom: 10,
    },
    transacitonDetail: {
        color: 'white',
    },
  });
