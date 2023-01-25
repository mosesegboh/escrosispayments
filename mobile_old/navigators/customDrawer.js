import React, {useContext} from 'react'
import {View, Text, ImageBackground, Image} from 'react-native'
import { 
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from '../components/CredentialsContext';

// import {Icon, Container, Content, Footer} from 'native-base';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

function customDrawer() {
  return (
    <View><Text>customDrawer</Text></View>
  )
}

function SideBar({...props}){
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
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

    return(
        <View style={{flex: 1, backgroundColor: "black"}}>
            <DrawerContentScrollView 
                {...props}
                contentContainerStyle={{backgroundColor: '#8200d6'}}   
            >
            {/* <ImageBackground 
                source={require('../assets/img/menu_bg.png')}
                style={{padding: 20}}
            > */}
            <View style={{padding: 20}}>
              <Image 
                      source={require('../assets/img/profile_pic.png')}
                      style={{height:80, width:80, borderRadius:40, marginBottom:10}}
                  />
                  <Text style={{color: "#fff", fontSize:18}}>John Doe</Text>
                  <Text style={{color: "#fff", fontSize:18}}>280 Coins</Text>
            </View>
                
            {/* </ImageBackground> */}
            <View style={{flex:1, backgroundColor: "#fff", paddingTop:10,}}>
                <DrawerItemList {...props}/>
                
            </View>
                

            </DrawerContentScrollView>
            <View style={{padding:20, borderTopWidth: 1, borderTopColor: '#ccc', color: '#fff'}}>
                <DrawerItem label="Log Out" icon={() =>  <Octicons name="star" size={18} color="#3B60BD" />}
                    onPress={clearLogin}
                    labelStyle={{color: '#fff'}}
                />
            </View>
        </View> 
    )  
}

export default SideBar;