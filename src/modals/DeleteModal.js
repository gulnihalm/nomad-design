import React, { Component } from 'react';
import { Text, View, NativeModules, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LoginManager } from 'react-native-fbsdk';
import { google_signOut  } from '../common/social/GoogleSignIn';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { hostURL } from '../common/general';

const { RNTwitterSignIn } = NativeModules;
var {height, width} = Dimensions.get('window');

if(Platform.OS == 'android'){
	height = height-24;
}

export default class DeleteModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			guid:   		this.props.guid,
			userChoice:		this.props.userChoice,
			disable: 		false,
		};
	}

	deletion() {
		let { guid, userChoice } = this.state;

        fetch( hostURL + 'user_deletion.php', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guid: guid,
            })
        })
        .then((res) => res.json())
        .then((res) => {
            //console.log(res);
            if (res.result == 1){
                alert("Kaydınız başarıyla silindi" );
				Actions.LoginPage({type: 'reset'});
				if( userChoice == "0" ){
					LoginManager.logOut();
				}
				if( userChoice == "1" ){
					google_signOut();
				}
				if( userChoice == "2" ){
					RNTwitterSignIn.logOut();
				}
            }
            else if (res.result == -1 ){
				alert("Kaydınız silinemedi: " + res.error);
				this.setState({ disable: false });
			}
        })
        .catch((err) => {
			alert("DEL " + err);
			this.setState({ disable: false });
        })
	}

	resetDeleteModal = () => {
		this.props.onDelete( false );
		this.setState({ disable: false });
	}

	render() {
		return(
			<Modal
                style = {{ marginVertical: hp(35) }}
				isVisible={this.props.deleteAcc}
				onBackdropPress={this.resetDeleteModal}
				onBackButtonPress={this.resetDeleteModal}
				>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E7E6EC' }}>

                    <View style={{ margin: 8.3 , width: wp(75) }}>
                        <Text style={{ textAlign: 'left' }}>Are you sure you want to delete this account?</Text>
                        <Text style={{ textAlign: 'left' }}>This can not be undone.</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View
                            style={{ margin: 8.3, width: wp(25) }}>
                            <TouchableOpacity style={styles.button}
                                onPress={this.deletion.bind(this)}
								onPressOut={()=>{this.setState({disable: true});}}
								disabled={this.state.disable}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ margin: 8.3, width: wp(25)}}>
                            <TouchableOpacity style={styles.altButton}
                                onPress={this.resetDeleteModal}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	altButton: {
		borderRadius: 30,
		backgroundColor: 'grey',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
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
		color: '#fff'
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
});

DeleteModal.propTypes = {
	onDelete: 		    PropTypes.func,
	deleteAcc: 			PropTypes.bool,
	guid: 				PropTypes.string,
	userChoice: 		PropTypes.string,
};
