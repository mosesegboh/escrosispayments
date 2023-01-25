import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native'
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Dashboard from '../screens/Dashboard';
import AddTransaction from '../screens/AddTransaction';
import Transaction from '../screens/Transaction';
import PurchaseCredit from '../screens/PurchaseCredit';
import ConfirmTransaction from '../screens/ConfirmTransaction';
import Profile from '../screens/Profile';
import AllTransactions from '../screens/AllTransactions';
import OTPVerification from '../screens/OTPVerification';
import DrawerContent from './DrawerContent';
import SideBar from './customDrawer';
import AddToWallet from '../screens/AddToWallet';
import Transfer from '../screens/Transfer';
import {Ionicons} from '@expo/vector-icons';

// import DrawerNavigator from '../navigators/DrawerNavigator';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

function MyDrawer({navigation}){
    return (
       
        <Drawer.Navigator 
            initialRouteName="Dashboard"
            drawerContent={props => <SideBar {...props}/>}
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
                        backgroundColor: "#3b60bd",
                    },
                    
                    })} 
                name="Dashboard" component={Dashboard} 
            />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="OTPVerification" component={OTPVerification} />
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
                                        headerTitle:"Add An Escrow Transaction",
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
                                        headerTitle:"Purchase Credit",
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="PurchaseCredit" component={PurchaseCredit} 
                                />
                                <Stack.Screen
                                    options={{headerShown: true, 
                                        headerTitle:"All Your Transactions",
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="AllTransactions" component={AllTransactions} 
                                />
                                <Stack.Screen
                                    options={{headerShown: true, 
                                        headerTitle:"Add To Your Wallet",
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="AddToWallet" component={AddToWallet} 
                                />
                                <Stack.Screen
                                    options={{headerShown: true, 
                                        headerTitle:"Make A Transfer",
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="Transfer" component={Transfer} 
                                />
                                <Stack.Screen options={{headerTintColor: 'white'}} name="ConfirmTransaction" component={ConfirmTransaction} />
                            </>
                            :
                            <>
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="SignUp" component={SignUp} />
                                <Stack.Screen
                                    options={{headerShown: true, 
                                        headerTitle:"Verify Your Account",
                                        headerTintColor: 'white', 
                                        headerStyle: {backgroundColor: "#1b181f",
                                        }, }} 
                                    name="OTPVerification" component={OTPVerification} 
                                />
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