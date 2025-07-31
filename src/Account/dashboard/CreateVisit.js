import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Animatable from 'react-native-animatable';
import { Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateVisit = ({ navigation }) => {
    const [visitType, setVisitType] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [purposeOfVisit, setPurposeOfVisit] = useState('');
    const [brand, setBrand] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [quantityTons, setQuantityTons] = useState('');

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

                    <Text style={styles.title}>Create Visit</Text>

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
                           <TextInput
                            style={styles.inputBoxcustomerfieldqty}
                            placeholder="Qty"
                            placeholderTextColor="#c6c4c4"
                            value={quantityTons}
                            onChangeText={setQuantityTons}
                        />
                        </View>
                    </Animatable.View>
                    {/* Submit */}
<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Stage1', {
  customerName,
purposeOfVisit,brand,productCategory,quantityTons
})}>
                    <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>        </ImageBackground>

    );
};
export default CreateVisit;

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
      inputBoxcustomerfieldqty: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 10,
        width: '48%',
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
        height: 180, 
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
