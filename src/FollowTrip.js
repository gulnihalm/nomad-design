import React from 'react';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    Text,
    TouchableOpacity,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TextInput } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {RNCamera} from 'react-native-camera';
import { hostURL } from './common/general';
import {Actions} from 'react-native-router-flux';
import MapViewDirections from 'react-native-maps-directions';

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
      height: hp('80%'),
    },
    marker: {
      backgroundColor: "#550bbc",
      padding: 5,
      borderRadius: 5
    }
});


const DISTANCE_LIMIT = 100000; // 100 meters is close enough to collect token but right now it is close to 10km for testing
const GOOGLE_MAPS_APIKEY = 'AIzaSyAxXVF5Z4CbXiIssgfqYGYqgUuy0yzMdbM'; //google api key with directions included
export default class FollowTrip extends React.Component{

    constructor(props){
        super(props);
        this.buttonPress = this.buttonPress.bind(this);
        this.markRoute= this.markRoute.bind(this);
        this.markersChecked = [];//bollean array for tracking which marker is checked and closest. This is basically an array which can determine whole process (for example which marker is next, which are done)
        this.tokeNum =0;//token collected
        this.finished;//end toute condition, 1 is finished, 0 is not finished
        this.m=0;//marker array length
        this.coordinates = {//global variable to get closest marker coordinates for drawing
          latitude :0,
          longitude:0,
        };
        this.poss={//user position
          latitude: this.props.pos.latitude,
          longitude: this.props.pos.longitude,
        };
        const {markers} = this.props;
        this.state = {
            //flag: 0,
            //markersChecked2: this.props.markersChecked2,
            //markersClaimed: [],
            markers: [],//marker array
            markerIndex: -1,//index
            //finished2 : this.props.finished2,

        }
    }



    componentDidMount(){
        let {markers} = this.state;
//      let {coordinates} = this.state;
        markers = this.getMarkers();//get markers from DB
//        coordinates = this.markRoute();
        this.setState({markers});

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

    checkPosition(){//this function is for returning the ID of the closest marker to user within DISTANCE_LIMIT
        const {pos} = this.props;
        const {markers} = this.state;
        //let {markersChecked} = this.state;
        let count = 0;
        var distance = DISTANCE_LIMIT;
        let flag=0;
        markers.forEach( marker => {
            var diff =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )
            ///console.log("-------------DISTANCE____IF DISINDAKİ:", diff, marker.markerID);


            if ( diff < distance && !this.markersChecked[count]){// if same index for marker in question is true on bool array then that marker is checked.
                ///console.log("YOU ARE CLOSE TO MARKER IF ICINDE:",marker);
                ///console.log("DISTANCE IF ICINDE:",this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) );
                distance = diff
                flag = marker.markerID;
            }
            count++;

        });

        return flag;//ID
    }

    markRoute(){// This funtion is for getting the coordinates of closest marker to user no matter where the user is for route drawing
        const {pos} = this.props;
        const {markers} = this.state;
//        let {coordinates} = this.state;
        var count =0;
        var temp=1000000; //this funtion will for markers closer than 1000km
        var flag2 =0;
//        let finished2= this.state;
//        var m;
        for(let i = 0; i<this.m; i++){//loop for determining if route is finished
            if (this.markersChecked[i]){// if all bool array true route finished
              this.finished= 1;//finished
            }
            else {
              this.finished =0;//not finished
            }
        }
        markers.forEach(marker => {
            var distance =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )

            if (distance <= temp && !this.markersChecked[count]){// if same index for marker in question is true on bool array then that marker is checked.
              temp=distance;
              flag2=count;//index of closest marker to user in the marker array
//            m=marker;
              this.coordinates= marker.latlng;//coordinates of closest marker under 1000km
//            console.log(this.markersChecked,"GİRDİİİİİİİİİİİİİ")


            }
            count++;
        });
//      coordinates=marker.latlng
//      return coordinates;
//        return m;


    }

    markClose(closeEnough){//this function is for getting the index of closest marker within DISTANCE_LIMIT, which is found by ID(from checkposition)
      const {pos} = this.props;
      const {markers} = this.state;

      let count = 0;
      let index= -1;
      markers.forEach( marker => {

          if ( marker.markerID === closeEnough){
              index = count;
          }
          count++;

      });
      return index;
    }

    buttonPress = (closeEnough) => {//this funtion is for button.
      const {pos} = this.props;
      let {markersChecked2}=this.state;
      //let {finished2}=this.state;
      const {markers} = this.state;
      //let mchecked = markersChecked;
      let mindex = this.markClose(closeEnough);// get Index of closest marker within DISTANCE_LIMIT
      this.markersChecked[mindex]=true;//make the same index in bool array true
      this.tokeNum=this.tokeNum+1;//collected one token
      //this.setState({markersChecked: mchecked ,markerIndex: mindex});
      ///console.log(mindex,"_________");
      ///console.log(this.markersChecked,"_________");
      Actions.ARpage();//go to AR
    }


    getMarkers(){//get markers from DB and also form bool array, filled with false.
        //let {markersChecked, markersClaimed} = this.state;
        myMarkers = [];
        tripID = this.props.trip;
        fetch( hostURL + 'getMarkers.php')
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

                ///console.log("->",element);
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
                    this.markersChecked.push(false);//put exactly one false for one marker. No of markers and "false"s will be same
                    this.m=this.m+1;//increase the size by one
                    //markersClaimed.push(false);
                    ///console.log("marker found:",element);
                }
            });

        }).catch((error) => {
            alert('The error is',JSON.stringify(error.message));
        });
        //this.setState({markersChecked, markersClaimed});

        return myMarkers;
    }

    finishTrip=()=>{
        console.log(this.props.user);
        console.log(this.props.trip);
        
        fetch(hostURL + 'finishTrip.php', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: this.props.user,
                trip: this.props.trip
            })
        })
        .then((response)=> response.json())
        .then((response) => {
            console.log('finishTrip response: ', response);
            if(response.result == 1){
                this.props.onBack(9);
            }
            else if(response.result == -1){
                alert("Finished trip could not be saved");
            }
        }).catch((error) => {
            alert('Finish trip error: ', error);
        });
    }

    render(){

        ///console.log(this.props.user);//for tracking
        ///console.log(this.props.trip);//for tracking



        const {markers} = this.state;
        const {pos} = this.props




        var closeEnough = this.checkPosition();//close enough is the ID of marker which is under DISTANCE_LIMIT
        this.markRoute();// draw route and check if route is completed
//        this.coordinates = m.latlng;

        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log(this.finished,"22222222222222222222222");                                                 //for tracking
        ///console.log(this.markersChecked,"111111111111111111111111111");                                       //for tracking
        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log("My markers for trip:",this.props.trip,"----->",markers);                                 //for tracking
        ///console.log(this.coordinates,"***************************");                                          //for tracking
        ///console.log(this.markersChecked[1]);                                                                  //for tracking




        return (

            <View style={{flex: 1, justifyContent: 'space-between',alignItems:'center' , width:  wp('100%'),height:  hp('100%')}}>
              <View style={{flex: 1, width: wp('100%'),height:  hp('80%')}}>
                <MapView style={styles.map}  provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>

                    {markers.map((marker, i) => (<Marker coordinate={marker.latlng} title={marker.text} key = {i}/>))}
                    {this.finished<1 &&//if route is not finished keep drawing to next marker
                    <MapViewDirections
                      origin={this.poss}//from user location to
                      destination={this.coordinates}//closest maker
                      apikey={GOOGLE_MAPS_APIKEY}
                      mode="WALKING"//walking route
                      strokeWidth= {3}//kalınlık
                      strokeColor = "#BF1E2E"//renk
                    />}
                </MapView>
                {closeEnough>0 &&//if distance to closest marker under DISTANCE_LIMIT show AR button
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>Close to a checkpoint! Please STAY STILL and look for a Token with your camera!</Text>
                      <Button title = "Get Token" color="#BF1E2E"  onPress= { () => {this.buttonPress(closeEnough)}}></Button>
                    </View>
                }
                {closeEnough<1 &&
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>Follow the route and go to the next checkpoint!</Text>
                    </View>
                }
                {this.finished>0 &&//if route is finished show finish button
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>Route FINISHED! Tap button to proceed.</Text>
                      <Button title = "FINISH" color="#BF1E2E"
                        onPress={this.finishTrip}/>
                    </View>



                //Burada bize yakın veya geçtiğimiz (token aldığımız) maerker ın index i ve ID si dahil sahip olduğu her veriye erişimimiz var ve istediğimiz gibi kullanabiliyoruz.
                //DB de ayrı token yerine user in üstünden geçtiği marker ları ayrıca tutabiliriz veya her rota için bool array i DB ye gidebilir. Çünkü bütün rota takibi ve user nerde kaldı
                //bir tane bool array ile anlaşılabilyor.
                }

              </View>


            </View>
        );


    }

}
