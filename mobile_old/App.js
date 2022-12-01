import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, {useState} from 'react';

//screens
// import Login from './screens/Login';
// import SignUp from './screens/SignUp';
// import Dashboard from './screens/Dashboard';
// import AddTransaction from './screens/AddTransaction';
// import Transaction from './screens/Transaction';

//import Apploading
import Apploading from 'expo-app-loading'

// import { createDrawerNavigator } from '@react-navigation/drawer';

import { NavigationContainer } from '@react-navigation/native';

//async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

//credentials context
import { CredentialsContext } from './components/CredentialsContext';

// const Drawer = createDrawerNavigator();

//React Navigation Stack
import RootStack from './navigators/RootStack'

export default function App() {
  //to persist login
  const [appReady, setAppReady] = useState(false)
  const [storedCredentials, setStoredCredentials] = useState("")

  const checkLoginCredentials = () => {
    AsyncStorage.getItem('escrosisCredentials').then((result) => {
      if(result !== null) {
        //you cant store anything apart from a string in aync storage, so when getting aan item from there, stringify it back to an object
        setStoredCredentials(JSON.parse(result))
      }else{
        setStoredCredentials(null)
      }

    }).catch(err => {
      console.log(err)
    })
  }

  if (!appReady) {
    return (
      <Apploading 
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <CredentialsContext.Provider  value={{storedCredentials, setStoredCredentials}}>
      <RootStack />
    </CredentialsContext.Provider>
    
  );
}
