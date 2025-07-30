import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import PagerView from 'react-native-pager-view';

const PagerContent = ({ currentTab }) => {
  switch (currentTab) {
    case 'sales':
      return (
        <PagerView style={styles.pagerView} initialPage={0}>
          <View key="1" style={styles.pagerPage}>
            <Text>Sales Overview</Text>
          </View>
          <View key="2" style={styles.pagerPage}>
            <Text>Sales Reports</Text>
          </View>
        </PagerView>
      );
    case 'purchase':
      return (
        <PagerView style={styles.pagerView} initialPage={0}>
          <View key="1" style={styles.pagerPage}>
            <Text>Purchase Overview</Text>
          </View>
          <View key="2" style={styles.pagerPage}>
            <Text>Purchase Reports</Text>
          </View>
        </PagerView>
      );
    case 'order':
      return (
        <PagerView style={styles.pagerView} initialPage={0}>
          <View key="1" style={styles.pagerPage}>
            <Text>Order Overview</Text>
          </View>
          <View key="2" style={styles.pagerPage}>
            <Text>Order Reports</Text>
          </View>
        </PagerView>
      );
    case 'unorder':
      return (
        <PagerView style={styles.pagerView} initialPage={0}>
          <View key="1" style={styles.pagerPage}>
            <Text>Unordered Items</Text>
          </View>
          <View key="2" style={styles.pagerPage}>
            <Text>Unordered Reports</Text>
          </View>
        </PagerView>
      );
    default:
      return null;
  }
};

const Screens = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'sales', title: 'Sales' },
    { key: 'purchase', title: 'Purchase' },
    { key: 'order', title: 'Order' },
    { key: 'unorder', title: 'Unorder' },
  ]);

  return (
    <ImageBackground
      source={require('../../assets/theme/main.jpg')}
      style={styles.container}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={() => null}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'white' }}
              scrollEnabled
              style={{ backgroundColor:'#7630be', borderRadius: 10 }}
              renderLabel={({ route, focused }) => (
                <Text style={{ color: focused ? 'black' : 'gray', fontWeight: 'bold' }}>
                  {route.title.toUpperCase()}
                </Text>
              )}
            />
          )}
        />

        <PagerContent currentTab={routes[index].key} />

        <View style={styles.animatedCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/workinggirl.png')}
              style={styles.largeImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Hello, Biztechnovations</Text>
            <Text style={styles.subText}>
              Ready to start your day with some pitch decks?
            </Text>
          </View>
        </View>
        <View style={styles.boxContainer}>

          <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#8cc443' }]}>
            <View style={styles.curveShape1}>
              <Text style={styles.curveText}>03</Text>
            </View>
            <Text style={styles.boxText}>Open Enquiry</Text>
          </TouchableOpacity>

          {/* Box 2 */}
          <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#f0af3e' }]}>
            <View style={styles.curveShape2}>
              <Text style={styles.curveText}>10</Text>
            </View>
            <Text style={styles.boxText}>Approval Pending</Text>
          </TouchableOpacity>

          {/* Box 3 */}
          <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#e34444ff' }]}>
            <View style={styles.curveShape3}>
              <Text style={styles.curveText}>08</Text>
            </View>
            <Text style={styles.boxText}>Order Pending</Text>
          </TouchableOpacity>

          {/* Box 4 */}
          <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#3966c2ff' }]}>
            <View style={styles.curveShape4}>
              <Text style={styles.curveText}>02</Text>
            </View>
            <Text style={styles.boxText}>Order Completed</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
    </ImageBackground >
  );
};

export default Screens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pagerView: {
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  pagerPage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingLeft: 20,
    paddingVertical: 20,
    paddingRight: 20,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: '5%',
    elevation: 3,
    overflow: 'visible',
    position: 'relative',
  },
  imageWrapper: {
    position: 'absolute',
    right: 1,
    bottom: 10,
    zIndex: 1,
  },
  largeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 10,
    color: '#555',
    marginTop: 5,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorBox: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 10,
    marginBottom: '5%',
    overflow: 'hidden',
    position: 'relative',
  },
  curveShape1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: '#6aa123',
    borderBottomLeftRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  curveShape2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: '#c98d24',
    borderBottomLeftRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  curveShape3: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: '#cb3535ff',
    borderBottomLeftRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  curveShape4: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: '#2b45c8ff',
    borderBottomLeftRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  curveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    position: 'absolute',
    bottom: '50%',
    left: '60%',
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#b3e7ebff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    alignItems: 'center',
  },
});
