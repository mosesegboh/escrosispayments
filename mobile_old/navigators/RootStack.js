import React from 'react';
//react navigation
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {View, TouchableHighlight, TouchableOpacity, Platform} from 'react-native'

//components
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Dashboard from '../screens/Dashboard';
import AddTransaction from '../screens/AddTransaction';
import Transaction from '../screens/Transaction';
import PurchaseCredit from '../screens/PurchaseCredit';
import ConfirmTransaction from '../screens/ConfirmTransaction';
import Profile from '../screens/Profile';
import DrawerContent from './DrawerContent';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

// import DrawerNavigator from '../navigators/DrawerNavigator';
const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

function MyDrawer({navigation}){
    return (
       
        <Drawer.Navigator 
            initialRouteName="Dashboard"
            // drawerContent={props => <DrawerContent {...props}/>}
        >
            <Drawer.Screen 
            options={({navigation})=>({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                        <Ionicons name='menu' size={25} color='white'
                        />
                    </TouchableOpacity>
                    
                ),
                 headerStyle: {
                                    backgroundColor: "#1b181f",
                                },
                 
                })} 
            name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="Logout" component={Login} />
        </Drawer.Navigator>
    );
  }

const RootStack = () => {
    // const navigation = useNavigation();
    return(
        //unlike provider, the children of the consumer is a function which takes the component that consumes as the argument of the function
        <CredentialsContext.Consumer>
            {
                ({storedCredentials}) => (
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                                // headerStyle: {
                                //     backgroundColor: "transparent",
                                // },
                                // headerTintColor: '#131112',
                                // headerTransparent: true,
                                // headerTitle: '',
                                // headerLeftContainerStyle: {
                                //     paddingLeft: 20
                                // },
                                initialRouteName: "Login",
                            }}
                        >
                            {storedCredentials ?
                            <>
                                <Stack.Screen 
                                    name="Dashboard" 
                                    component={MyDrawer} 
                                />
                                <Stack.Screen 
                                    options={{headerShown: true, 
                                    headerTintColor: 'white', 
                                    headerStyle: {backgroundColor: "#1b181f",
                                    }, }}  
                                    name="AddTransaction" 
                                    component={AddTransaction} 
                                />
                                <Stack.Screen 
                                    options={{headerShown: true, 
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }}      
                                    name="Transaction" component={Transaction} 
                                />
                                <Stack.Screen
                                    options={{headerShown: true, 
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="PurchaseCredit" component={PurchaseCredit} 
                                />
                                <Stack.Screen options={{headerTintColor: 'white'}} name="ConfirmTransaction" component={ConfirmTransaction} />
                            </>
                                 :
                                <>
                                    <Stack.Screen name="Login" component={Login} />
                                    <Stack.Screen name="SignUp" component={SignUp} />
                                    
                                </>
                            }
                        </Stack.Navigator>
                    </NavigationContainer>
                )
            }
        </CredentialsContext.Consumer>
    )
}

export default RootStack;