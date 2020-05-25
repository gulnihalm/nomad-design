import React, { Component } from 'react';
import { NativeModules, Text, View, TouchableOpacity, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hostURL } from '../common/general';
import { Thumbnail } from 'native-base';

var { height, width } = Dimensions.get('window');
if(Platform.OS == 'android'){
	height = height-24;
}

export default class ProfilePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
            guid:               this.props.guid, 			//guid of the account that will be synced
            googleEntrance:   	this.props.googleEntrance, 	//google account linked in the account that will be synced?
            fbEntrance:    		this.props.fbEntrance,		//fb account linked in the account that will be synced?
			twitterEntrance:  	this.props.twitterEntrance,	//twitter account linked in the account that will be synced?
			userChoice:         this.props.userChoice, 		//what social media option the user selected to end up here. (1=fb, 2=g, 3=tw)
            userName: 			this.props.userName,
            userSurname:		this.props.userSurname,
            pic: 				this.props.pic,
		};
    }

	render() {
		return (
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{alignItems: 'center', top: -height/2 + 125 + hp(9)}}>
                    {this.state.pic && (
                        <View style={{borderRadius: 100, overflow: 'hidden'}}>
                            <Image source={{uri: this.state.pic }} style={{width: 125, height: 125}}/>
                        </View>
                    )}
                    <View style={{marginTop: 8.3, marginBottom: 30}}>
                        <Text style={[styles.text, {fontSize: 25}]}>{this.state.userName + " " + this.state.userSurname}</Text>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={styles.button}
                            onPress={()=>{ Actions.FinishedTripsPage({
                                guid: this.state.guid, userChoice: this.state.userChoice,
                                googleEntrance: this.state.googleEntrance, fbEntrance: this.state.fbEntrance, twitterEntrance: this.state.twitterEntrance,
                                userName: this.state.userName,  pic: this.state.pic, userSurname: this.state.userSurname
                            }); }}>
                            <Text style={styles.buttonText}>Finished Routes</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textWrapper}>
                        <Text style={[styles.text,{fontWeight:'bold'}]}>Synchronized Accounts</Text>
                    </View>
                    {this.state.fbEntrance && <Text style={[styles.text,{}]}>Facebook</Text>}
                    {this.state.googleEntrance && <Text style={[styles.text,{}]}>Google</Text>}
                    {this.state.twitterEntrance && <Text style={[styles.text,{}]}>Twitter</Text>}
                </View>

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
