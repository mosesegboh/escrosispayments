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

const RootStack = () => {
    return(
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
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="AddTransaction" component={AddTransaction} />
                <Stack.Screen options={{headerTintColor: 'white'}} name="Dashboard" component={Dashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;