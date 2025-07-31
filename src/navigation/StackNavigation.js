import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Account/Accounts/Login';
import Loading from '../Account/Accounts/Loading';
import TabNavigation from './TabNavigation';
import DrawerNavigation from './DrawerNavigation';
import CreateCustomer from '../Account/dashboard/CreateCustomer';
import CreateVisit from '../Account/dashboard/CreateVisit';
import Stage1 from '../Account/dashboard/Stage1';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNavigation">
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Loading" component={Loading} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen options={{ headerShown: false }} name="CreateCustomer" component={CreateCustomer} />
        <Stack.Screen options={{ headerShown: false }} name="CreateVisit" component={CreateVisit} />
        <Stack.Screen options={{ headerShown: false }} name="Stage1" component={Stage1} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;