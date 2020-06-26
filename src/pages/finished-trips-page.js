import React, { Component } from 'react';
import { NativeModules, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hostURL } from '../common/general';
import { Thumbnail } from 'native-base';
import {Header,Card,Button} from 'react-native-elements';

var { height, width } = Dimensions.get('window');
if(Platform.OS == 'android'){
	height = height-24;
}

export default class FinishedTripsPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
            guid:               this.props.guid,
            googleEntrance:   	this.props.googleEntrance,
            fbEntrance:    		this.props.fbEntrance,
			twitterEntrance:  	this.props.twitterEntrance,
			userChoice:         this.props.userChoice,
            userName: 			this.props.userName,
            userSurname:		this.props.userSurname,
            pic: 				this.props.pic,
            trips:              [],
            requestDone:        false,
		};
    }

    componentDidMount(){
        let {trips} = this.state;
        trips = this.getFollowedTrips();
        this.setState({trips});
    }

    getFollowedTrips(){
        let {guid} = this.state; //add more states if needed
        var trips = [];
        fetch(hostURL + 'getFollowedTrips.php', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guid: guid, //add states you want to send to php here
            })
        })
        .then((response)=> response.json())
        .then((response) => {
            //console.log('getFollowedTrips response: ', response);
            if(response.result == 1){
                let str = JSON.stringify(response.trips);
                str = str.replace(/\\/g, "");
                str = str.substr(1,str.length - 2);

                console.log('str:',str);

                let obj = JSON.parse(str);

                let array=Object.keys(obj).map(function(k){
                    return obj[k];
                })

                array.forEach(element => {

                    var trip = [];
                    trip.push(element.tripID);
                    trip.push(element.userID);
                    trip.push(element.name);
                    trip.push(element.label);
                    trip.push(element.description);
                    trip.push(element.rating);

                    trips.push(trip);

                });

                this.setState({trips, requestDone:true});

                this.forceUpdate();

            }
            else if(response.error != ""){
                alert("Followed trips were not acquired");
            }
        }).catch((error) => {
            alert('Followed trips error: ', error);
        });
        return trips;
    }

	render() {
        console.disableYellowBox = true;
        let {trips, requestDone} = this.state;
		return (
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {!requestDone &&
                    <View style={{alignItems: 'center', top: -hp(12)}}>
                        <View style={{width: wp(75),}}>
                            <Text style={[styles.text, {fontSize: 25}]}>Getting your finished trips...</Text>
                        </View>
                    </View>
                }
                {(trips.length == 0 && requestDone) &&
                    <View style={{alignItems: 'center', top: -hp(12)}}>
                        <View style={{width: wp(75),}}>
                            <Text style={[styles.text, {fontSize: 25}]}>You have not completed a trip yet, once you do, you can view, rate and comment on your finished trips in here.</Text>
                        </View>
                    </View>
                }
                {(trips.length != 0 && requestDone) &&
                    <View style={{flex:1, alignItems: 'center'}}>
                        <View style={{position: 'absolute', top: hp(3)}}>
                            <Text style={[styles.text, {fontSize: 25}]}>Your Finished Trips</Text>
                        </View>

                        <ScrollView style={{marginBottom:hp(20), top: hp(9), width:wp(100)}}>
                            {trips.map((trip, key) =>
                                <Card key={key} title={trip[2]}>
                                    <Text style={{fontWeight:"bold", marginBottom:2}}>{trip[3]}</Text>
                                    <Text style={{marginVertical:2}}>{trip[4]}</Text>
                                    {(trip[5] == "") &&
                                        <Button title='Rate and comment on this trip' onPress={() => { Actions.CommentRatePage({tripID: trip[0], tripName: trip[2], label: trip[3], description: trip[4], guid: this.state.guid}); }}></Button>
                                    }
                                    {(trip[5] != "") &&
                                        <Button title='You have already rated and commented on this trip' disabled={true}></Button>
                                    }
                                </Card>
                            )}
                        </ScrollView>
                    </View>
                }

                <View style={{ position: 'absolute', width: wp(25), top: height - hp(9) }}>
                    <TouchableOpacity style={styles.altButton}
                        onPress={()=>{Actions.pop();}}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        color: '#000',
        textAlign: 'center',
    },
    textWrapper: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 8.3,
        width: wp(75),
    },
    button: {
		borderRadius: 30,
		backgroundColor: '#BF1E2E',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	buttonText: {
		fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    buttonWrapper: {
        marginVertical: 8.3,
        width: wp(55),
    },
    altButton: {
		borderRadius: 30,
		backgroundColor: 'grey',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
});
