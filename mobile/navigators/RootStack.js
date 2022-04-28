import React from 'react';
//react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//components
import Login from './../screens/Login';
import SignUp from './../screens/SignUp';
import Dashboard from './../screens/Dashboard';
import AddTransaction from './../screens/AddTransaction';
import Transaction from './../screens/Transaction';

const Stack = createNativeStackNavigator();

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
    return(
        //unlike provider, the children of the consumer is a function which takes the component that consumes as the argument of the function
        <CredentialsContext.Consumer>
            {
                ({storedCredentials}) => (
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: "transparent",
                                },
                                headerTintColor: '#131112',
                                headerTransparent: true,
                                headerTitle: '',
                                headerLeftContainerStyle: {
                                    paddingLeft: 20
                                },
                                initialRouteName: "Login"
                            }}
                        >
                            {storedCredentials ?
                                <Stack.Screen options={{headerTintColor: 'white'}} name="Dashboard" component={Dashboard} /> :
                                <>
                                    <Stack.Screen name="Login" component={Login} />
                                    <Stack.Screen name="SignUp" component={SignUp} />
                                    <Stack.Screen name="AddTransaction" component={AddTransaction} />
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