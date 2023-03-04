import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, {useState} from 'react';
import { useFonts } from 'expo-font';
import Apploading from 'expo-app-loading'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CredentialsContext } from './components/CredentialsContext';
import RootStack from './navigators/RootStack'

//screens
// import Login from './screens/Login';
// import SignUp from './screens/SignUp';
// import Dashboard from './screens/Dashboard';
// import AddTransaction from './screens/AddTransaction';
// import Transaction from './screens/Transaction';
// const Drawer = createDrawerNavigator();

export default function App() {
  //to persist login
  const [appReady, setAppReady] = useState(false)
  const [storedCredentials, setStoredCredentials] = useState("")

  const [loaded] = useFonts({
    Nunito: require('./assets/fonts/Nunito-VariableFont_wght.ttf'),
  });

  if (!loaded) {
    return null;
  }
  

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
