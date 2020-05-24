import React, { Component } from 'react';
import {Actions} from 'react-native-router-flux';
import { NativeModules, View, Text, TouchableOpacity, TouchableHighlight, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import MainPage from './main-page-content';
import Drawer from 'react-native-drawer'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoginManager } from 'react-native-fbsdk';
import { google_signOut  } from '../common/social/GoogleSignIn';

var { height, width } = Dimensions.get('window'); 

if(Platform.OS == 'android'){
	height = height-24;
}

//TWITTER
const { RNTwitterSignIn } = NativeModules;

export default class MainSidebar extends Component { //Actions.MainPage actually redirects here, not main page, as this is the parent of main-page-content.
	constructor(props) {
		super(props);
		
		this.state = {
			guid: 				this.props.guid,
			userName: 			this.props.userName, 
			userSurname:		this.props.userSurname,
			userChoice: 		this.props.userChoice,

			fbEntrance: 		this.props.fbEntrance,
			googleEntrance: 	this.props.googleEntrance,
			twitterEntrance: 	this.props.twitterEntrance,

			pic: 				this.props.pic, 	// picture link (of whatever login is)

			fbID:				this.props.fbID,
			googleID:			this.props.googleID,
			twitterID:			this.props.twitterID,

			fbMail: 			this.props.fbMail,
			googleMail: 		this.props.googleMail,
			twitterMail:		this.props.twitterMail,

			openDrawer: 		false,				// to open or close sidebar
			userNameIsLong: 	true,				// to format username to fit to sidebar
		};
	}

	getAdjustedUsername=(num)=>{ // this function is used to format long names to display in sidebar
		if(!this.state.userNameIsLong || this.state.userName.length <= num)
			return this.state.userName;
		else if( this.state.userName.slice(0, num+1).indexOf(' ') != -1 && this.state.userName.slice(0, num+1).indexOf(' ') <= num)
			return this.state.userName.replace(' ', '\n');
		else
			return this.state.userName.slice(0, num) + '-\n' + this.state.userName.slice(num);
	}

	render() {
		return(
			<Drawer 
				open={this.state.openDrawer} 
				type='overlay'
				openDrawerOffset={0.5}
				captureGestures={true}
				tapToClose={true}
				tweenDuration={100}
				panOpenMask={0.5}
				tweenHandler={(ratio) => {
					return {
						mainOverlay: { opacity: ratio/1.5, backgroundColor: 'black' }
					}
				}}
				content={ //sidebar content
					<View style={{ flex: 1, backgroundColor: "#E7E6EC"}}>
						<TouchableHighlight //sidebar button
							style={{ 
								height: 55, width: wp(50), backgroundColor: '#BF1E2E', 
								justifyContent: 'center', alignItems: 'center'
							}} 
							onPress={()=>{ this.setState({openDrawer: false}); }}>
								<Icon style={{left: -wp(12.5)}} name = 'ios-menu' size={30} color= 'white' />
						</TouchableHighlight>
						
						<TouchableOpacity //name and pic
							style={[styles.card, {flexDirection: 'row' }]}
                            onPress={()=>{
                                Actions.ProfilePage({ 
                                    guid: this.state.guid, userChoice: this.state.userChoice,
                                    googleEntrance: this.state.googleEntrance, fbEntrance: this.state.fbEntrance, twitterEntrance: this.state.twitterEntrance,
                                    userName: this.state.userName,  pic: this.state.pic, userSurname: this.state.userSurname
                                }); 
                            }}>
							{this.state.pic && (
								<Image source={{uri: this.state.pic }} style={{width: 50, height: 50}}/>
							)}

							<View 
								onLayout={(event)=>{
									if(event.nativeEvent.layout.width < 85 ){
										this.setState({ userNameIsLong: false });
									}									
								}}>
								<Text numberOfLines={(this.state.userNameIsLong) ? 2:1} style={{ marginLeft: 10, top: (this.state.userNameIsLong) ? 7:15 }}>
									{this.getAdjustedUsername(7)}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity //Create Trip Button
                            style={styles.sidebarButton}
                            onPress={()=>{
                                Actions.CreateTripPage({guid: this.state.guid, userEmail: this.props.userEmail, userName: this.state.userName, userPassword: this.props.userPassword});
                            }}>
                            <Text adjustsFontSizeToFit={true} style={{color: '#fff', textAlign: 'center'}}>Create Trip</Text>
                        </TouchableOpacity>
						<View style={{ position: 'absolute', top: hp(100) - 80, left: wp(25)-45 }}>
							{ this.state.userChoice == "0" ? ( //LOG OUT FACEBOOK
								<View style={{width: wp(25)}}>
									<TouchableOpacity style={styles.altButton}
										onPress={()=>{ LoginManager.logOut(); Actions.LoginPage({type: 'reset'}); }}>
										<Text style={styles.buttonText}>Çıkış</Text>
									</TouchableOpacity>
								</View>
								):( this.state.userChoice == "1" ? ( //LOG OUT GOOGLE
									<View style={{width: wp(25)}}>
										<TouchableOpacity style={styles.altButton} 
											onPress={()=>{ google_signOut(); Actions.LoginPage({type: 'reset'}); }}>
											<Text style={styles.buttonText}>Çıkış</Text>
										</TouchableOpacity>
									</View>
									):( this.state.userChoice == "2" ? ( //LOG OUT TWITTER
										<View style={{width: wp(25)}}>
											<TouchableOpacity style={styles.altButton} 
												onPress={()=>{ RNTwitterSignIn.logOut(); Actions.LoginPage({type: 'reset'}); }}>
												<Text style={styles.buttonText}>Çıkış</Text>
											</TouchableOpacity>
										</View>
										):( //LOG OUT EMAIL
											<View style={{width: wp(25)}}>
												<TouchableOpacity style={styles.altButton} 
													onPress={()=>{ Actions.LoginPage({type: 'reset'}); }}>
													<Text style={styles.buttonText}>Çıkış</Text>
												</TouchableOpacity>
											</View>
										)
									)
								) // END OF LOG OUT
							}
						</View>
						
						{(!this.state.fbEntrance || !this.state.googleEntrance || !this.state.twitterEntrance ) &&
							<TouchableOpacity //SYNC BUTTON
								style={styles.sidebarButton}
								onPress={()=>{
									Actions.SyncPage({ 
										guid: this.state.guid, userChoice: this.state.userChoice,
										googleEntrance: this.state.googleEntrance, fbEntrance: this.state.fbEntrance, twitterEntrance: this.state.twitterEntrance, 
									}); 
								}}>
								<Text adjustsFontSizeToFit={true} style={{color: '#fff', textAlign: 'center'}}>Hesaplarını Senkronize Et</Text>
							</TouchableOpacity>
						}
						
						
					</View>
				}>
				<MainPage 
					userName		= {this.state.userName}
					userSurname		= {this.state.userSurname}
					userEmail		= {this.props.userEmail}
					userPassword	= {this.props.userPassword}
					userChoice		= {this.state.userChoice}
					fbEntrance		= {this.state.fbEntrance}
					googleEntrance	= {this.state.googleEntrance}
					twitterEntrance	= {this.state.twitterEntrance}
					emailEntrance 	= {this.props.emailEntrance} 
					pic				= {this.state.pic}
					fbID			= {this.state.fbID}
					googleID		= {this.state.googleID}
					twitterID		= {this.state.twitterID}
					fbMail			= {this.state.fbMail}
					googleMail		= {this.state.googleMail}
					twitterMail		= {this.state.twitterMail}
					guid			= {this.state.guid}
					register 		= {this.props.register}
					onChangeDrawer 	= {(openDrawer)=>{this.setState({openDrawer: openDrawer});}}
				/>
			</Drawer>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		height: 60,
		borderWidth: 1,
		backgroundColor: '#fff',
		borderColor: 'rgba(0,0,0,0.1)',
		margin: 5,
		padding: 5,
		shadowColor: '#ccc',
		shadowOffset: { width: 2, height: 2, },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
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
	sidebarButton: {
		borderWidth: 1,
		backgroundColor: '#BF1E2E',
		borderColor: 'rgba(0,0,0,0.1)',
		margin: 5,
		padding: 5,
		shadowColor: '#ccc',
		shadowOffset: { width: 2, height: 2, },
		shadowOpacity: 0.5,
		shadowRadius: 3,
		height: 60, 
		justifyContent: 'center', 
		alignItems: 'center'
	},
});