import React from 'react';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    Text,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TextInput } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {RNCamera} from 'react-native-camera';
import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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

      flex: 1,
      justifyContent: 'flex-start',
      justifyContent: 'space-around'
    },
    map: {
      width: wp('100%'),
      height: hp('50%'),
    },
    marker: {
      backgroundColor: "#550bbc",
      padding: 5,
      borderRadius: 5
    }
});


const DISTANCE_LIMIT = 12000; // 100 meters is close enough to collect token

export default class FollowTrip extends React.Component{

    constructor(props){
        super(props);
        const {markers} = this.props;
        this.state = {
            markers: this.getMarkers(),

        }

    }

    measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000; // meters
    }

    checkPosition(){

        const {pos} = this.props;
        const {markers} = this.state;

        var flag = 0

        markers.forEach( marker => {

            console.log("-------------DISTANCE:",this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) );


            if ( this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) < DISTANCE_LIMIT ){
                console.log("YOU ARE CLOSE TO MARKER:",marker);
                console.log("DISTANCE:",this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) );
                flag = marker.markerID;
            }
        });

        return flag;

    }


    getMarkers(){
        myMarkers = [];
        tripID = this.props.trip;
        fetch('http://nomad-server2.000webhostapp.com/getMarkers.php')
        .then((response)=> response.json())
        .then((response) => {
            // console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {

                console.log("->",element);
                if ( element.tripID === tripID ){

                    m = {
                        text: element.text,
                        latlng:{
                            latitude: parseFloat(element.latitude),
                            longitude: parseFloat(element.longitude)
                        },
                        tripID: element.tripID,
                        markerID: parseInt(element.markerID)
                    }


                    myMarkers.push(m);
                    console.log("marker found:",element);
                }

            });

        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

        return myMarkers;

    }


    render(){

        console.log(this.props.user);
        console.log(this.props.trip);



        const {markers} = this.state;
        const {pos} = this.props

        closeEnough = this.checkPosition();
        console.log(closeEnough,"__________________________________________________________________________");
        console.log(closeEnough,"__________________________________________________________________________");
        console.log(closeEnough,"__________________________________________________________________________"); 
        console.log("My markers for trip:",this.props.trip,"----->",markers);

        return (

            <View style={{flex: 1, justifyContent: 'space-between',alignItems:'center' , width:  wp('100%'),height:  hp('100%')}}>
              <View style={{flex: 1, width: wp('100%'),height:  hp('80%')}}>
                <MapView style={styles.map}  provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>

                    {markers.map((marker, i) => (<Marker coordinate={marker.latlng} title={marker.text} key = {i}/>))}
                </MapView>
                {closeEnough>0 &&
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>You are close to a checkpoint! TAP button to collect your Token!</Text>
                      <Button title = "Get Token" onPress={() => Actions.ARpage({type:'reset'})}></Button>
                    </View>
                }

              </View>


            </View>
        );


    }

}
