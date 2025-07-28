import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Screens from '../Account/Tabscreens/Screens';
import Settings from '../Account/Tabscreens/Settings';
import Contact from '../Account/Tabscreens/Contact';
import About from '../Account/Tabscreens/About';
import { View, ImageBackground,TextInput, View as RNView } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
  screenOptions={{
  drawerStyle: { backgroundColor: "#faf7f7",width:"85%",height:"90.5%",marginTop:"6.5%",  borderTopRightRadius: 15,
      borderBottomRightRadius: 15,borderTopLeftRadius:15,borderBottomLeftRadius:15,
      overflow: 'hidden', },
  headerStyle: { 
    backgroundColor: "#7630be", 
    elevation: 0, 
    shadowOpacity: 0,      
    borderBottomWidth: 0,  
    shadowColor: 'transparent',
  },
  headerTintColor: 'black',
}}
    >
<Drawer.Screen
  name=" "
  options={({ navigation }) => ({
    headerShown: true,
    headerRight: () => (
       <View
    style={{
      flexDirection: 'row',
      backgroundColor: '#ffffffff',
      borderRadius: 10,
      paddingHorizontal: 8,
      height: 40,
      alignItems: 'center',
      width: '80%',  
      marginRight:10   
    }}
  >
             <FontAwesome
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 5 }}
        />
        <TextInput
          placeholder="Search for Number, Products"
          placeholderTextColor="#666"
          style={{
            fontSize: 12,
            color: '#000',
            marginLeft:5
          }}
        />
   
      </View>
    ),
  })}
>
        {() => (
    <ImageBackground
      source={require('../assets/theme/main.jpg')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
  <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Screens') {
                    iconName = focused ? 'th-large' : 'th';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'cogs' : 'cog';
                  } else if (route.name === 'Contact') {
                    iconName = focused ? 'address-book' : 'address-book-o';
                  } else if (route.name === 'About') {
                    iconName = focused ? 'info-circle' : 'info';
                  }
                  return <FontAwesome name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                  backgroundColor: '#ffffff',
                  height: 50,
                  width: "88%",
                  alignSelf: "center",
                  borderRadius: 30,
                  marginBottom: '3%',
                  marginTop: 2,
                },
                tabBarLabelStyle: { fontSize: 12, fontStyle: 'italic',marginLeft:10 },
              })}
            >
              <Tab.Screen
                name="Screens"
                component={Screens}
                options={{ headerShown: false, tabBarLabel: 'Dashboard' }}
              />
              <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="Contact"
                component={Contact}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="About"
                component={About}
                options={{ headerShown: false }}
              />
            </Tab.Navigator>
    </ImageBackground>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default TabNavigation;
