import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, PermissionsAndroid, NativeModules, } from 'react-native';
import auth from '@react-native-firebase/auth';
import RNSimData from 'react-native-sim-data';
import { useDispatch, useSelector } from 'react-redux';
import { postAuthendication } from '../../redux/action';

const Login = ({ navigation }) => {

  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const pinInputs = useRef([]);

  const {postAunthendicationEmployeeLoading,postAunthendicationEmployeeData,postAunthendicationEmployeeError,postAunthendicationEmployeeErrorInvalid} = useSelector(state => state.postAunthendicationEmployeeReducer);
console.log("data2",postAunthendicationEmployeeLoading,postAunthendicationEmployeeData,postAunthendicationEmployeeError)
  useEffect(() => {
    const handleLogin = async () => {
      if (postAunthendicationEmployeeData && !postAunthendicationEmployeeError && !postAunthendicationEmployeeErrorInvalid) {
        if (postAunthendicationEmployeeData.result === 'success') {
          try {
            const dataString = JSON.stringify(postAunthendicationEmployeeData.Data);
            const tokenString=JSON.stringify(postAunthendicationEmployeeData.AccessToken)
            navigation.navigate('TabNavigation');
          } catch (error) {
            console.error('Failed to save data to AsyncStorage:', error);
            Alert.alert('Failed to save user data.');
          }
        } else {
          Alert.alert(postAunthendicationEmployeeData.Msg);
        }
      }
    };

    handleLogin();
  }, [postAunthendicationEmployeeData, postAunthendicationEmployeeError, postAunthendicationEmployeeErrorInvalid, navigation]);

  useEffect(() => {
    if (phone.length === 10 && !otpSent) {
      const fullPhoneNumber = `+91${phone}`;
      console.log('Sending OTP to', fullPhoneNumber);
      auth()
        .signInWithPhoneNumber(fullPhoneNumber)
        .then((confirmation) => {
          setConfirm(confirmation);
          setOtpSent(true);
          console.log('OTP sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send OTP:', error);
          alert('Failed to send OTP. Please try again.');
        });
    }
  }, [phone]);


  useEffect(() => {
    if (mobileNumber && !phone) {
      setPhone(mobileNumber);
    }
  }, [mobileNumber]);

  useEffect(() => {
    const fetchSimNumber = async () => {
      if (Platform.OS === 'android') {
        const hasPermission = await requestSimPermission();
        if (hasPermission) {
          const simInfoList = await getSimNumbers();
          if (Array.isArray(simInfoList) && simInfoList.length > 0) {
            const firstSim = simInfoList.find(sim => sim.number && sim.number.length >= 10);
            if (firstSim) {
              let number = firstSim.number
                .replace(/^(\+91|91)/, '')
                .replace(/\s/g, '');
              setMobileNumber(number);
            }
          }
        }
      }
    };

    fetchSimNumber();
  }, []);

  const getSimNumbers = async () => {
    const { SimInfo } = NativeModules;
    try {
      const numbers = await SimInfo.getSimNumbers();
      return JSON.parse(numbers); 
    } catch (error) {
      console.error('Error fetching SIM numbers:', error);
      return [];
    }
  };

  const requestSimPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
      return (
        granted['android.permission.READ_PHONE_NUMBERS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardShown(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePinChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newPin = [...pin];
    newPin[index] = cleanText;
    setPin(newPin);
    if (cleanText && index < 5) {
      pinInputs.current[index + 1].focus();
    }
  };

const handleLogin = async () => {
  const code = pin.join('');
  if (code.length !== 6 || !confirm) {
    alert('Invalid OTP');
    return;
  }

  try {
    setIsVerifying(true);
    await confirm.confirm(code);
    alert('OTP verified');

    const loginPayload = {
      jsonrpc: "2.0",
      params: {
        db: "bisco_risco", 
        login: phone,         
        password: code         
      }
    };

    dispatch(postAuthendication(loginPayload));
  } catch (error) {
    console.error('OTP verification failed', error);
    alert('Incorrect OTP. Try again.');
    setPin(['', '', '', '', '', '']);
    pinInputs.current[0].focus();
  } finally {
    setIsVerifying(false);
  }
};

  const isLoginEnabled = pin.every((digit) => digit !== '');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.loginText}>Login Account</Text>
              <Text style={styles.welcomeText}>Hello, Welcome</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/user.png')} style={styles.avatar} />
            </View>
          </View>
          {/* Image */}
          <Image source={require('../../assets/girlimages.png')} style={styles.centerImage} />
          {/* Phone Input */}
          <Text style={styles.label}>Phone no..</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.flagContainer}>
              <Image source={require('../../assets/india.png')} style={styles.flag} />
            </View>
            <View style={styles.separator} />
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={phone}
              maxLength={10}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                setPhone(cleaned);
                setOtpSent(false);
                setConfirm(null);
              }}
            />
            {phone.length === 10 && (
              <Image source={require('../../assets/check.png')} style={styles.icon} />
            )}
          </View>
          <Text style={styles.pinlabel}>6 Digit OTP</Text>
          <View style={styles.pinContainer}>
            {[...Array(6)].map((_, index) => (
              <TextInput
                key={index}
                ref={(el) => (pinInputs.current[index] = el)}
                style={[
                  styles.pinInput,
                  !otpSent && { backgroundColor: '#cacacaff' },
                ]}
                maxLength={1}
                keyboardType="numeric"
                value={pin[index]}
                onChangeText={(text) => otpSent && handlePinChange(text, index)}
                editable={otpSent}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={[
              styles.loginButton,
              {
                backgroundColor: isLoginEnabled ? '#e22727ff' : '#ccc',
              },
            ]}
            disabled={!isLoginEnabled || isVerifying}>
            <Text style={styles.loginButtonText}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10%',
    marginTop: '8%',
  },
  loginText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  avatarContainer: {
    backgroundColor: '#eee',
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  centerImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginVertical: 30,
    marginTop: '20%',
  },
  label: {
    fontSize: 14,
    marginTop: '5%',
    marginBottom: '2%',
    paddingHorizontal: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#fff',
  },
  flagContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  pinlabel: {
    fontSize: 14,
    marginTop: '5%',
    paddingHorizontal: 10,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 20,
  },
  pinInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    borderRadius: 50,
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: '2%',
    fontSize: 12,
    color: '#666'
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 50,
    marginBottom: 10,

  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',

  },
});

export default Login;



// import React, { useState, useRef, useEffect } from 'react';
// import {View,Text,TextInput,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Keyboard,
//   KeyboardAvoidingView, Platform ,
//     PermissionsAndroid,
//   NativeModules,
// } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import RNSimData from 'react-native-sim-data';

// const Login = ({ navigation }) => {
//   const [phone, setPhone] = useState(''); 
//     const [mobileNumber, setMobileNumber] = useState('');

// const [pin, setPin] = useState(['', '', '', '', '', '']);
//   const [keyboardShown, setKeyboardShown] = useState(false);
//   const [confirm, setConfirm] = useState(null);
//   const [otpSent, setOtpSent] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const pinInputs = useRef([]);

//   useEffect(() => {
//     if (phone.length === 10 && !otpSent) {
//       const fullPhoneNumber = `+91${phone}`;
//       console.log('Sending OTP to', fullPhoneNumber);

//       auth()
//         .signInWithPhoneNumber(fullPhoneNumber)
//         .then((confirmation) => {
//           setConfirm(confirmation);
//           setOtpSent(true);
//           console.log('OTP sent successfully');
//         })
//         .catch((error) => {
//           console.error('Failed to send OTP:', error);
//           alert('Failed to send OTP. Please try again.');
//         });
//     }
//   }, [phone]);

  
// useEffect(() => {
//   if (mobileNumber && !phone) {
//     setPhone(mobileNumber);
//   }
// }, [mobileNumber]);

// useEffect(() => {
//   const fetchSimNumber = async () => {
//     if (Platform.OS === 'android') {
//       const hasPermission = await requestSimPermission();
//       if (hasPermission) {
//         const simInfoList = await getSimNumbers();

//         if (Array.isArray(simInfoList) && simInfoList.length > 0) {
//           const firstSim = simInfoList.find(sim => sim.number && sim.number.length >= 10);
//           if (firstSim) {
//             let number = firstSim.number
//   .replace(/^(\+91|91)/, '') 
//   .replace(/\s/g, '');       
//             setMobileNumber(number);
//           }
//         }
//       }
//     }
//   };

//   fetchSimNumber();
// }, []);

//   const getSimNumbers = async () => {
//     const { SimInfo } = NativeModules;
//     try {
//       const numbers = await SimInfo.getSimNumbers();
//       return JSON.parse(numbers); // 👈 ensure it’s parsed if returned as JSON string
//     } catch (error) {
//       console.error('Error fetching SIM numbers:', error);
//       return [];
//     }
//   };

// const requestSimPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
//       PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
//     ]);

//     return (
//       granted['android.permission.READ_PHONE_NUMBERS'] === PermissionsAndroid.RESULTS.GRANTED &&
//       granted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED
//     );
//   } catch (err) {
//     console.warn('Permission error:', err);
//     return false;
//   }
// };

//   useEffect(() => {
//     const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardShown(true));
//     const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));
//     return () => {
//       showSub.remove();
//       hideSub.remove();
//     };
//   }, []);

//   const handlePinChange = (text, index) => {
//     const cleanText = text.replace(/[^0-9]/g, '');
//     const newPin = [...pin];
//     newPin[index] = cleanText;
//     setPin(newPin);

//     if (cleanText && index < 5) {
//       pinInputs.current[index + 1].focus();
//     }
//   };

//   const handleLogin = async () => {
//     const code = pin.join('');
//     if (code.length !== 6 || !confirm) {
//       alert('Invalid OTP');
//       return;
//     }

//     try {
//       setIsVerifying(true);
//       await confirm.confirm(code); 
//       alert('Please otp verified');
//       navigation.navigate('TabNavigation'); 
//     } catch (error) {
//       console.error('OTP verification failed', error);
//       alert('Incorrect OTP. Try again.');
//       setPin(['', '', '', '','','']);
//       pinInputs.current[0].focus();
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const isLoginEnabled = pin.every((digit) => digit !== '');

//   return (
//   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//   <KeyboardAvoidingView
//     style={{ flex: 1, backgroundColor: '#fff' }}
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//   >
//     <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.topRow}>
//             <View>
//               <Text style={styles.loginText}>Login Account</Text>
//               <Text style={styles.welcomeText}>Hello, Welcome</Text>
//             </View>
//             <View style={styles.avatarContainer}>
//               <Image source={require('../../assets/user.png')} style={styles.avatar} />
//             </View>
//           </View>

//           {/* Image */}
//           <Image source={require('../../assets/girlimages.png')} style={styles.centerImage} />

//           {/* Phone Input */}
//           <Text style={styles.label}>Phone no..</Text>
//           <View style={styles.phoneInputContainer}>
//             <View style={styles.flagContainer}>
//               <Image source={require('../../assets/india.png')} style={styles.flag} />
//             </View>
//             <View style={styles.separator} />
// <TextInput
//   style={styles.phoneInput}
//   keyboardType="phone-pad"
//   placeholder="Enter phone number"
//   placeholderTextColor="#999"
//   value={phone}
//   maxLength={10}
//   onChangeText={(text) => {
//     const cleaned = text.replace(/[^0-9]/g, '');
//     setPhone(cleaned);
//     setOtpSent(false);
//     setConfirm(null);
//   }}
// />

//             {phone.length === 10 && (
//               <Image source={require('../../assets/check.png')} style={styles.icon} />
//             )}
//           </View>
//  <Text style={styles.pinlabel}>6 Digit OTP</Text>

// <View style={styles.pinContainer}>
//   {[...Array(6)].map((_, index) => (
//     <TextInput
//       key={index}
//       ref={(el) => (pinInputs.current[index] = el)}
//       style={[
//         styles.pinInput,
//         !otpSent && { backgroundColor: '#cacacaff' },
//       ]}
//       maxLength={1}
//       keyboardType="numeric"
//       value={pin[index]}
//       onChangeText={(text) => otpSent && handlePinChange(text, index)}
//       editable={otpSent}
//     />
//   ))}
// </View>
// <TouchableOpacity
//   onPress={handleLogin}
//   style={[
//     styles.loginButton,
//     {
//       backgroundColor: isLoginEnabled ? '#e22727ff' : '#ccc',
//     },
//   ]}
//   disabled={!isLoginEnabled || isVerifying}
// >
//   <Text style={styles.loginButtonText}>
//     {isVerifying ? 'Verifying...' : 'Verify OTP'}
//   </Text>
// </TouchableOpacity>
//     </View>
//   </KeyboardAvoidingView>
// </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 20,
//         backgroundColor: '#FFFFFF',
//  justifyContent: 'flex-start',
//     },
//     topRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         marginBottom: '10%',
//         marginTop: '8%',
//     },
//     loginText: {
//         fontSize: 22,
//         fontWeight: 'bold',
//     },
//     welcomeText: {
//         fontSize: 16,
//         color: '#666',
//         marginTop: 4,
//     },
//     avatarContainer: {
//         backgroundColor: '#eee',
//         borderRadius: 30,
//         overflow: 'hidden',
//     },
//     avatar: {
//         width: 40,
//         height: 40,
//     },
//     centerImage: {
//         width: 250,
//         height: 250,
//         alignSelf: 'center',
//         marginVertical: 30,
//         marginTop: '20%',
//     },
//     label: {
//         fontSize: 14,
//         marginTop: '5%',
//         marginBottom: '2%',
//         paddingHorizontal: 10,
//     },
//     phoneInputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderRadius: 50,
//         paddingHorizontal: 15,
//         height: 45,
//         backgroundColor: '#fff',
//     },
//     flagContainer: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     flag: {
//         width: 30,
//         height: 30,
//         resizeMode: 'cover',
//     },
//     separator: {
//         width: 1,
//         height: '80%',
//         backgroundColor: '#ccc',
//         marginHorizontal: 10,
//     },
//     phoneInput: {
//         flex: 1,
//         fontSize: 15,
//         color: '#000',
//     },
//     icon: {
//         width: 20,
//         height: 20,
//         marginLeft: 10,
//     },
//     pinlabel: {
//         fontSize: 14,
//         marginTop: '5%',
//         paddingHorizontal: 10,
//     },
//     pinContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginTop: 10,
//         marginBottom: 20,
//     },
//     pinInput: {
//         width: 50,
//         height: 50,
//         borderWidth: 1,
//         borderColor: '',
//         backgroundColor: '#ffffff',
//         textAlign: 'center',
//         borderRadius: 50,
//         fontSize: 20,
//     },
//     forgotPassword: {
//         alignSelf: 'center',
//         marginBottom: '2%',
//         fontSize: 12,
//         color:'#666'
//     },
//     loginButton: {
//         paddingVertical: 14,
//         borderRadius: 50,
//         marginBottom: 10, 

//     },
//     loginButtonText: {
//         color: '#fff',
//         textAlign: 'center',
//         fontSize: 16,
//         fontWeight: 'bold',

//     },
// });

// export default Login;



//now latest updates using firebase import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, PermissionsAndroid, NativeModules, } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import RNSimData from 'react-native-sim-data';
// import { useDispatch, useSelector } from 'react-redux';
// import { postAuthendication } from '../../redux/action';

// const Login = ({ navigation }) => {

//   const dispatch = useDispatch();
//   const [phone, setPhone] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [pin, setPin] = useState(['', '', '', '', '', '']);
//   const [keyboardShown, setKeyboardShown] = useState(false);
//   const [confirm, setConfirm] = useState(null);
//   const [otpSent, setOtpSent] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const pinInputs = useRef([]);

//   const {postAunthendicationEmployeeLoading,postAunthendicationEmployeeData,postAunthendicationEmployeeError,postAunthendicationEmployeeErrorInvalid} = useSelector(state => state.postAunthendicationEmployeeReducer);
// console.log("data2",postAunthendicationEmployeeLoading,postAunthendicationEmployeeData,postAunthendicationEmployeeError)

// useEffect(() => {
//   if (!otpSent) return;

//   const hasResult = postAunthendicationEmployeeData?.result;

//   if (hasResult && !postAunthendicationEmployeeError && !postAunthendicationEmployeeErrorInvalid) {
//     const result = postAunthendicationEmployeeData.result.uid;
//     if (result) {
//       console.log('✅ API login success, UID:', result);
//       navigation.navigate('TabNavigation');
//     } else {
//       console.warn('⚠️ UID not found in response');
//       alert('Login failed: invalid user data');
//     }
//   } else if (postAunthendicationEmployeeError || postAunthendicationEmployeeErrorInvalid) {
//     console.warn('❌ API login error');
//     alert('Login failed: Invalid username or password');
//   }
// }, [
//   postAunthendicationEmployeeData,
//   postAunthendicationEmployeeError,
//   postAunthendicationEmployeeErrorInvalid,
//   otpSent
// ]);

//   useEffect(() => {
//     if (phone.length === 10 && !otpSent) {
//       const fullPhoneNumber = `+91${phone}`;
//       console.log('Sending OTP to', fullPhoneNumber);
//       auth()
//         .signInWithPhoneNumber(fullPhoneNumber)
//         .then((confirmation) => {
//           setConfirm(confirmation);
//           setOtpSent(true);
//           console.log('OTP sent successfully');
//         })
//         .catch((error) => {
//           console.error('Failed to send OTP:', error);
//           alert('Failed to send OTP. Please try again.');
//         });
//     }
//   }, [phone]);


//   useEffect(() => {
//     if (mobileNumber && !phone) {
//       setPhone(mobileNumber);
//     }
//   }, [mobileNumber]);

//   useEffect(() => {
//     const fetchSimNumber = async () => {
//       if (Platform.OS === 'android') {
//         const hasPermission = await requestSimPermission();
//         if (hasPermission) {
//           const simInfoList = await getSimNumbers();
//           if (Array.isArray(simInfoList) && simInfoList.length > 0) {
//             const firstSim = simInfoList.find(sim => sim.number && sim.number.length >= 10);
//             if (firstSim) {
//               let number = firstSim.number
//                 .replace(/^(\+91|91)/, '')
//                 .replace(/\s/g, '');
//               setMobileNumber(number);
//             }
//           }
//         }
//       }
//     };

//     fetchSimNumber();
//   }, []);

//   const getSimNumbers = async () => {
//     const { SimInfo } = NativeModules;
//     try {
//       const numbers = await SimInfo.getSimNumbers();
//       return JSON.parse(numbers); 
//     } catch (error) {
//       console.error('Error fetching SIM numbers:', error);
//       return [];
//     }
//   };

//   const requestSimPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
//         PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
//       ]);
//       return (
//         granted['android.permission.READ_PHONE_NUMBERS'] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED
//       );
//     } catch (err) {
//       console.warn('Permission error:', err);
//       return false;
//     }
//   };

//   useEffect(() => {
//     const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardShown(true));
//     const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));
//     return () => {
//       showSub.remove();
//       hideSub.remove();
//     };
//   }, []);

//   const handlePinChange = (text, index) => {
//     const cleanText = text.replace(/[^0-9]/g, '');
//     const newPin = [...pin];
//     newPin[index] = cleanText;
//     setPin(newPin);
//     if (cleanText && index < 5) {
//       pinInputs.current[index + 1].focus();
//     }
//   };

// const handleLogin = async () => {
//   const code = pin.join('');
//   if (code.length !== 6 || !confirm) {
//     alert('Invalid OTP');
//     return;
//   }
//   try {
//     setIsVerifying(true);
//     await confirm.confirm(code);
//     alert('OTP verified');

//     const loginPayload = {
//       jsonrpc: "2.0",
//       params: {
//         db: "bisco_risco", 
//         login: phone,         
//         password: code         
//       }
//     };

//     dispatch(postAuthendication(loginPayload));
//     navigation.navigate('TabNavigation');

//   } catch (error) {
//     console.error('OTP verification failed', error);
//     alert('Incorrect OTP. Try again.');
//     setPin(['', '', '', '', '', '']);
//     pinInputs.current[0].focus();
//   } finally {
//     setIsVerifying(false);
//   }
// };

//   const isLoginEnabled = pin.every((digit) => digit !== '');
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         style={{ flex: 1, backgroundColor: '#fff' }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.topRow}>
//             <View>
//               <Text style={styles.loginText}>Login Account</Text>
//               <Text style={styles.welcomeText}>Hello, Welcome</Text>
//             </View>
//             <View style={styles.avatarContainer}>
//               <Image source={require('../../assets/user.png')} style={styles.avatar} />
//             </View>
//           </View>
//           {/* Image */}
//           <Image source={require('../../assets/girlimages.png')} style={styles.centerImage} />
//           {/* Phone Input */}
//           <Text style={styles.label}>Phone no..</Text>
//           <View style={styles.phoneInputContainer}>
//             <View style={styles.flagContainer}>
//               <Image source={require('../../assets/india.png')} style={styles.flag} />
//             </View>
//             <View style={styles.separator} />
//             <TextInput
//               style={styles.phoneInput}
//               keyboardType="phone-pad"
//               placeholder="Enter phone number"
//               placeholderTextColor="#999"
//               value={phone}
//               maxLength={10}
//               onChangeText={(text) => {
//                 const cleaned = text.replace(/[^0-9]/g, '');
//                 setPhone(cleaned);
//                 setOtpSent(false);
//                 setConfirm(null);
//               }}
//             />
//             {phone.length === 10 && (
//               <Image source={require('../../assets/check.png')} style={styles.icon} />
//             )}
//           </View>
//           <Text style={styles.pinlabel}>6 Digit OTP</Text>
//           <View style={styles.pinContainer}>
//             {[...Array(6)].map((_, index) => (
//               <TextInput
//                 key={index}
//                 ref={(el) => (pinInputs.current[index] = el)}
//                 style={[
//                   styles.pinInput,
//                   !otpSent && { backgroundColor: '#cacacaff' },
//                 ]}
//                 maxLength={1}
//                 keyboardType="numeric"
//                 value={pin[index]}
//                 onChangeText={(text) => otpSent && handlePinChange(text, index)}
//                 editable={otpSent}
//               />
//             ))}
//           </View>
//           <TouchableOpacity
//             onPress={handleLogin}
//             style={[
//               styles.loginButton,
//               {
//                 backgroundColor: isLoginEnabled ? '#e22727ff' : '#ccc',
//               },
//             ]}
//             disabled={!isLoginEnabled || isVerifying}>
//             <Text style={styles.loginButtonText}>
//               {isVerifying ? 'Verifying...' : 'Verify OTP'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'flex-start',
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: '10%',
//     marginTop: '8%',
//   },
//   loginText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   welcomeText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 4,
//   },
//   avatarContainer: {
//     backgroundColor: '#eee',
//     borderRadius: 30,
//     overflow: 'hidden',
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//   },
//   centerImage: {
//     width: 250,
//     height: 250,
//     alignSelf: 'center',
//     marginVertical: 30,
//     marginTop: '20%',
//   },
//   label: {
//     fontSize: 14,
//     marginTop: '5%',
//     marginBottom: '2%',
//     paddingHorizontal: 10,
//   },
//   phoneInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderRadius: 50,
//     paddingHorizontal: 15,
//     height: 45,
//     backgroundColor: '#fff',
//   },
//   flagContainer: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   flag: {
//     width: 30,
//     height: 30,
//     resizeMode: 'cover',
//   },
//   separator: {
//     width: 1,
//     height: '80%',
//     backgroundColor: '#ccc',
//     marginHorizontal: 10,
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#000',
//   },
//   icon: {
//     width: 20,
//     height: 20,
//     marginLeft: 10,
//   },
//   pinlabel: {
//     fontSize: 14,
//     marginTop: '5%',
//     paddingHorizontal: 10,
//   },
//   pinContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   pinInput: {
//     width: 50,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '',
//     backgroundColor: '#ffffff',
//     textAlign: 'center',
//     borderRadius: 50,
//     fontSize: 20,
//   },
//   forgotPassword: {
//     alignSelf: 'center',
//     marginBottom: '2%',
//     fontSize: 12,
//     color: '#666'
//   },
//   loginButton: {
//     paddingVertical: 14,
//     borderRadius: 50,
//     marginBottom: 10,

//   },
//   loginButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: 'bold',

//   },
// });

// export default Login;
import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Animatable from 'react-native-animatable';
import { Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Stage1 = () => {
    const [visitType, setVisitType] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [purposeOfVisit, setPurposeOfVisit] = useState('');
    const [brand, setBrand] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [quantityTons, setQuantityTons] = useState('');
    const [visitOutcome, setVisitOutcome] = useState('');
    const [lostReason, setLostReason] = useState('');
    const [remarks, setRemarks] = useState('');
    const [showReminderModal, setShowReminderModal] = useState(false);
const [reminderDate, setReminderDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
    const visitTypes = [
        { label: 'Visit A', value: 'A' },
        { label: 'Visit B', value: 'B' },
        { label: 'search engine', value: 'C' },
    ];
    const customerSegmentOptions = [
        { label: 'Retail', value: 'Retail' },
        { label: 'Wholesale', value: 'Wholesale' },
        { label: 'Distributor', value: 'Distributor' },
    ];
    const visitOutcomes = [
        { label: 'Retail', value: 'Retail' },
        { label: 'Wholesale', value: 'Wholesale' },
        { label: 'Distributor', value: 'Distributor' },
        { label: 'Reminder', value: 'Reinder' }
    ];

    return (
        
        <ImageBackground
            source={require('../../assets/backgroundimg.png')}
            style={{ flex: 1, resizeMode: 'cover', padding: 20 }}>
            <View >
   
       <Modal
  animationType="slide"
  transparent={true}
  visible={showReminderModal}
  onRequestClose={() => setShowReminderModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>Select a reminder date:</Text>

      <TouchableOpacity
        style={[styles.dateButton, { marginBottom: 15 }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {reminderDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={reminderDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || reminderDate;
            setShowDatePicker(Platform.OS === 'ios'); // on Android, hide after select
            setReminderDate(currentDate);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowReminderModal(false)}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <Text style={styles.title}>Stage1</Text>

                    {/* Visit Type */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.dropdowntitle, { justifyContent: 'flex-start' }]}>Is Customer</Text>
                        <Text style={[styles.dropdowntitle, { marginLeft: '32%' }]}>Enquiry Channel</Text>
                    </View>
                    <Animatable.View animation="fadeInUp" duration={1000} delay={500}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={styles.dropdownmain}
                                data={visitTypes}
                                labelField="label"
                                valueField="value"
                                placeholder="Is Customer"
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                                value={visitType}
                                onChange={item => setVisitType(item.value)}
                            />
                            <Dropdown
                                style={styles.dropdownmain}
                                data={visitTypes}
                                labelField="label"
                                valueField="value"
                                placeholder="Is Customer"
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                                value={visitType}
                                onChange={item => setVisitType(item.value)}
                            />
                        </View>
                    </Animatable.View>
                    {/* Customer Name */}
                    <Text style={styles.dropdowntitle}>Customer Name</Text>
                    <Animatable.View animation="fadeInUp" duration={1000} delay={100}>
                        <TextInput
                            style={styles.inputBoxcustomerfield}
                            placeholder="Customer Name"
                            placeholderTextColor="#c6c4c4"
                            value={customerName}
                            onChangeText={setCustomerName}
                        />
                    </Animatable.View>

                    {/* Purpose of Visit & Brand */}
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={[styles.dropdowntitle, { justifyContent: 'flex-start' }]}>Purpose of Visit</Text>
                        <Text style={[styles.dropdowntitle, { marginLeft: '26%' }]}>Brand</Text>
                    </View>
                    <Animatable.View animation="fadeInUp" duration={1000} delay={300}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={styles.dropdownmain}
                                data={customerSegmentOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Purpose of Visit"
                                value={purposeOfVisit}
                                onChange={item => setPurposeOfVisit(item.value)}
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                            />
                            <Dropdown
                                style={styles.dropdownmain}
                                data={customerSegmentOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Brand"
                                value={brand}
                                onChange={item => setBrand(item.value)}
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                            />
                        </View>
                    </Animatable.View>

                    {/* Product Category & Qty */}
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={[styles.dropdowntitle, { justifyContent: 'flex-start' }]}>Product Category</Text>
                        <Text style={[styles.dropdowntitle, { marginLeft: '23%' }]}>Qty (Tons)</Text>
                    </View>
                    <Animatable.View animation="fadeInUp" duration={1000} delay={500}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={styles.dropdownmain}
                                data={customerSegmentOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Product Category"
                                value={productCategory}
                                onChange={item => setProductCategory(item.value)}
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                            />
                            <Dropdown
                                style={styles.dropdownmain}
                                data={customerSegmentOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Qty"
                                value={quantityTons}
                                onChange={item => setQuantityTons(item.value)}
                                placeholderStyle={{ color: '#c6c4c4ff', fontSize: 11.5 }}
                            />
                        </View>
                    </Animatable.View>

                    {/* Submit */}
                    <TouchableOpacity style={styles.button} onPress={() => console.log('Submitted')}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>        </ImageBackground>

    );
};
export default Stage1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        color: '#b816b5ff',
        marginTop: '15%',
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: '10%'
    },
    dropdowntitle: {
        fontSize: 11.5,
        color: '#fffefeff',
        marginTop: '2%',
        fontWeight: 'bold',
    },
    dropdowntitle1: {
        fontSize: 11.5,
        color: '#dcdadaff',
        fontWeight: 'bold',

    },
    dropdownmain: {
        height: 40,
        width: '48%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: '2%',
    },
    dropdown: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: '2%'

    },
    dropdown1: {
        height: 40,
        width: '48%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        marginBottom: '2%'

    },
    dateButton: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '43%',
        height: 40,
        marginBottom: '2%'

    },
    dateText: {
        fontSize: 11.5,
        color: '#333',
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        width: '48%',
        marginBottom: '2%'

    },
    inputBoxcustomerfield: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        width: '100%',
        marginBottom: '2%'

    },
    inputBox1: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        width: '100%',
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#020e94ff',
        width: '50%',
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '10%',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputBoxMulti: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        height: 180, // adjust as needed to match 3 stacked inputs
        textAlignVertical: 'top',
        marginBottom: '2%',
    },
    inputBox3: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        width: '100%',
        height: 100,
        marginBottom: '2%',
        textAlign: 'top'
    },
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  alignItems: 'center',
},
modalText: {
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'center',
  color: '#333',
},
});
