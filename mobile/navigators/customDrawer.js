import React, {useContext} from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native'
import { 
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from '../components/CredentialsContext';
import { Feather } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

function SideBar({...props}){
    const navigation = useNavigation(); 
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    let {name, email, token,  photoUrl} = storedCredentials
    const clearLogin = async () => {
    try 
      {
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

    return(
        <View style={{flex: 1, backgroundColor: "#131112"}}>
            <DrawerContentScrollView 
                {...props}
                contentContainerStyle={{backgroundColor: '#131112"'}}   
            >
            {/* <ImageBackground 
                source={require('../assets/img/menu_bg.png')}
                style={{padding: 20}}
            /> */}
            <View style={{padding: 20}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
              >
                {/* <Image 
                  source={require('../assets/img/profile_pic.png')}
                  style={{height:40, width:40, borderRadius:40}}
                /> */}
                <Ionicons name="person-circle" size={50} color="#3b60bd" />
                <View style={{height:10, width:10, borderRadius:10,backgroundColor: "green", marginLeft: 32, marginTop: -15, marginBottom: 10 }}/>
              </TouchableOpacity>
              
              <Text style={{color: "#fff", fontSize:14, fontStyle: 'italic', fontFamily: 'Nunito'}}>{name}</Text>
            </View>
                
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <DrawerItemList {...props}/>
            </View>
                
            </DrawerContentScrollView>
              <View style={{padding:10, borderTopWidth: 1, borderTopColor: '#ccc', color: '#fff', fontFamily: 'Nunito'}}>
                  <DrawerItem label="Log Out" icon={() =>  <Feather name="power" size={24} color="#c74657" />}
                    onPress={clearLogin}
                    labelStyle={{color: '#fff'}}
                  />
              </View>
        </View> 
    )  
}

export default SideBar;