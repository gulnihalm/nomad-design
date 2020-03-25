/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Button,Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = 1;
const LATITUDE =40.016331868381485;
const LONGITUDE = 32.81651669267004;

const styles = StyleSheet.create({
  button:{
    color: 'red'
  },
  buttonContainer: {
       margin: 20,
       alignSelf: 'flex-end',
   },
   multiButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-start',
    justifyContent: 'space-around'
  },
  map: {
    width: wp('100%'),
    height: hp('60%'),
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5
  }
});

export default class App extends React.Component {
  markerIndex = 0;
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      pos: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markers: [],
      markerPlaceEnabled: false
    }
    //this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount() {
    this.requestLocationPermission();
  };

  requestLocationPermission = async () => {
    var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (response === 'granted')
      this.locateCurrentPosition();

    };

  locateCurrentPosition = () => {
    setInterval(() => {
      Geolocation.getCurrentPosition(position => {
        //console.log(JSON.stringify(position));
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }

        if (this.state.coordinates.length > 0) {

          let coord = this.state.coordinates[this.state.coordinates.length - 1];

          if (this.measure(coord.latitude, coord.longitude, position.coords.latitude, position.coords.longitude) > 50) {
            let joined = this.state.coordinates.concat({latitude: position.coords.latitude, longitude: position.coords.longitude});
            this.setState({coordinates: joined, pos: region});
          }
        }

        else {
          let joined = this.state.coordinates.concat({latitude: position.coords.latitude, longitude: position.coords.longitude});
          this.setState({coordinates: joined, pos: region});
        }
      }, error => console.log(error.message), {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600000,
        distanceFilter: 100000
      })
    }, 1000);
  };

  measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
  }

  onPressMarker(e) {

    console.log('ONPRESSSSSSSSS');
    console.log(e.nativeEvent);

    const {markers} = this.state;////////////////////////////////////////////////////////////////////////
    asd = markers.filter((marker) => {marker.coordinate != e.nativeEvent.coordinate});

    console.log(asd);

  }

  render() {

    let button

    if(!this.state.markerPlaceEnabled)
      button = <Button title="Start" color="#bada55" onPress={(e) => this.setState({markerPlaceEnabled: true})}/>
    else
      button = <Button title="Finish" color="#ff5c5c" onPress={(e) => this.setState({markerPlaceEnabled: false})}/>
    return (
    <View style={styles.container}>
      <Header
        leftComponent={<Icon name="menu" size={40} color="white" ></Icon>}
        centerComponent={{ text: 'CREATE ROUTE', style: { color: '#fff' } }}
        rightComponent={<Button title="LogOut" color='#bada55'/> }
      />
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={this.state.pos}
              onPress={(e) => {
                console.log(e.nativeEvent.coordinate);
                if(this.state.markerPlaceEnabled)
                  this.setState({ markers: [...this.state.markers, { latlng: e.nativeEvent.coordinate }] })}}>
        {this.state.markers.map((marker, i) => (<Marker onPress= {(e) => {this.onPressMarker(e)}} coordinate={marker.latlng} key = {i}/>))}

        <Polyline coordinates={this.state.coordinates} strokeWidth={3}/>

      </MapView>

      <View style={styles.multiButtonContainer}>
        {button}
        <Button title="Add Trip" />
      </View>

      <View style= {styles.buttonContainer}>
        <Button title="Back" />
      </View>

      <View>
        <Footer style={{backgroundColor: "dodgerblue"}}/>
      </View>
    </View>
);

  }

  _onMarkerPress(markerData) {
    console.log(JSON.stringify(markerData)); //belki
  }

}
