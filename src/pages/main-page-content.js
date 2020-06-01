import React, { Component } from 'react';
import {Actions} from 'react-native-router-flux';
import { NativeModules, View, Text, TouchableOpacity, TouchableHighlight, ScrollView, StyleSheet, Image } from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import { LoginManager } from 'react-native-fbsdk';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { google_signOut  } from '../common/social/GoogleSignIn';
import RegisterModal from '../modals/RegisterModal';
import DeleteModal from '../modals/DeleteModal';
import TabBarIcons from '../common/TabBarIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import App from '../App';

const NUMBER_OF_TABS = 4;

//TWITTER
const { RNTwitterSignIn } = NativeModules;

export default class MainPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			guid: 				this.props.guid,
			userName: 			this.props.userName,
			userSurname:		this.props.userSurname,
			userEmail: 			this.props.userEmail,
			userPassword:		this.props.userPassword,
			userChoice: 		this.props.userChoice,

			fbEntrance: 		this.props.fbEntrance,
			googleEntrance: 	this.props.googleEntrance,
			twitterEntrance: 	this.props.twitterEntrance,
			emailEntrance: 		this.props.emailEntrance,

			fbID:				this.props.fbID,
			googleID:			this.props.googleID,
			twitterID:			this.props.twitterID,

			fbMail: 			this.props.fbMail,
			googleMail: 		this.props.googleMail,
			twitterMail:		this.props.twitterMail,

			register: 			this.props.register,	//to display RegisterModal
			deleteAcc:			false, 					//to display DeleteModal
			viewInfo: 			false, 					//to display "Kullanıcı Bilgilerini Göster"
			viewConfigInfo:		false, 					//to display "Kullanıcı Bilgilerini Ayarla"

			lock: 				false,  //locks sliding of scrollabletabview- related to the tab sliding problem.
			activeTab: 			1, 		//again, related to tab stuff, shows the current tab.
		};
	}

	render() {
		return(
			<View style={{backgroundColor: "#E7E6EC", flex:1}}>
				<ScrollableTabView
					contentProps={{bounces: false}}
					style={{marginTop: 10}}
					initialPage={this.state.register ? (3):(1)}
					locked={this.state.lock}
					onChangeTab={({i}) => this.setState({activeTab: i})}
					onScroll={()=>{
						if(this.state.activeTab == 1){
							this.setState({lock:true});}
						else{
							this.setState({lock:false});}
					}}
					renderTabBar={() => <TabBarIcons/>}>

					{//extra tab that is being replaced by sidebar button, user should never see this or be able to reach this tab
					<ScrollView tabLabel="ios-bug"/>}


					<ScrollView tabLabel="ios-notifications" style={styles.tabView} keyboardShouldPersistTaps='always' //keyboardDismissMode='on-drag'
					>

						<View style={styles.card2}>
							<ScrollView tabLabel="ios-notifications" style={styles.tabView} keyboardShouldPersistTaps='always' //keyboardDismissMode='on-drag'
							>
								<Text style={styles.textStyle}>WELCOME TO NOMAD</Text>
								<Text style={styles.textStyle2}>Thank you for joining us! Nomad allows users to experience each other's voyages and trips.</Text>

										<Icon name = 'ios-menu' size={30} color= '#BF1E2E' />
										<Text style={styles.textStyle3}> By pressing menu button you can choose to create a route, view achievement list, Synchronize your accounts or log out. You can go to your profile page and see your finished trips, rate them, send comments.</Text>
										<Image style={styles.iconStyle} source={require('../images/nav.png')}/>
										<Text style={styles.textStyle3}> You can press the navigaton button to see all available trips, search for a trip you would like to follow and see their comments.
										 Choose a trip, tap Follow Route button.On the map, you can determine a driving or a walking route. Your distance to your destination and estimated duration of the route will be shown.
										  Additionally, helpful information will be shown to you when you are following a route.</Text>
										<Image style={styles.iconStyle} source={require('../images/gear.png')}/>
										<Text style={styles.textStyle3}> By pressing the gear button, you can see and edit you account information, you can log out or delete your account.</Text>
										<Text style={styles.textStyle3}> Your preferred way of login is shown below.</Text>

								<View style={styles.card}>
									{this.state.twitterEntrance.toString()==="false" &&
											<Image style={styles.markerStyle} source={require('../images/tblack.png')}/>
									}
									{this.state.twitterEntrance.toString()==="true" &&
											<Image style={styles.markerStyle} source={require('../images/tcolor.png')}/>
									}
									{this.state.googleEntrance.toString()==="false" &&
											<Image style={styles.markerStyle} source={require('../images/gblack.png')}/>
									}
									{this.state.googleEntrance.toString()==="true" &&
											<Image style={styles.markerStyle} source={require('../images/gcolor.png')}/>
									}
									{this.state.fbEntrance.toString()==="false" &&
											<Image style={styles.markerStyle} source={require('../images/fblack.png')}/>
									}
									{this.state.fbEntrance.toString()==="true" &&
											<Image style={styles.markerStyle} source={require('../images/fcolor.png')}/>
									}
									{this.state.emailEntrance.toString()==="false" &&
											<Image style={styles.markerStyle} source={require('../images/eblack.png')}/>
									}
									{this.state.emailEntrance.toString()==="true" &&
											<Image style={styles.markerStyle} source={require('../images/ecolor.png')}/>
											//<Text>Active Tab:		{this.state.activeTab}</Text>
									}
								</View>
							</ScrollView>
						</View>

					</ScrollView>

                    {//LOOK HERE FOR APP
                    }
					<ScrollView tabLabel="ios-navigate" style={styles.tabView} keyboardShouldPersistTaps='always'>
                        <App guid = {this.state.guid} userEmail = {this.state.userEmail} userName = {this.state.userName} userPassword = {this.state.userPassword} page = {9}/>
					</ScrollView>

					<ScrollView tabLabel="ios-settings" style={styles.tabView} keyboardShouldPersistTaps='always'>

						{this.state.viewInfo ? ( //SHOW PERSONAL INFO
							<View style={[styles.card4, {height: hp(27) +
								(this.state.emailEntrance && hp(3)) + (this.state.fbEntrance && hp(6)) +
								(this.state.googleEntrance && hp(6)) + (this.state.twitterEntrance && hp(6))
							}]}>
								<Text>Name: {this.state.userName}</Text>
								<Text>Surname: {this.state.userSurname}</Text>
								<Text>E-mail: {this.state.userEmail}</Text>
								<Text>User Choice: {this.state.userChoice}</Text>
								<Text>guid: {this.state.guid}</Text>
								{(this.state.emailEntrance) && <Text>Password: {this.state.userPassword}</Text>}
								{(this.state.fbEntrance) && <View><Text>fbID: {this.state.fbID}</Text><Text>fbMail: {this.state.fbMail}</Text></View>}
								{(this.state.googleEntrance) && <View><Text>googleID: {this.state.googleID}</Text><Text>googleMail: {this.state.googleMail}</Text></View>}
								{(this.state.twitterEntrance) && <View><Text>twitterID: {this.state.twitterID}</Text><Text>twitterMail: {this.state.twitterMail}</Text></View>}
								<View style={{top: 5, width: wp(25)}}>
									<TouchableOpacity style={styles.altButton}
										onPress={()=>{this.setState({ viewInfo: false });}}>
										<Text style={styles.buttonText}>Hide</Text>
									</TouchableOpacity>
								</View>
							</View>
							):(
							<View style={[styles.card4, {justifyContent: 'center', height: hp(12)}]}>
								<View style={{width: wp(75)}}>
									<TouchableOpacity style={styles.button}
										onPress={()=>{this.setState({ viewInfo: true });}}>
										<Text style={styles.buttonText}>Display User Information</Text>
									</TouchableOpacity>
								</View>
							</View>) // END OF PERSONAL INFO
						}


						{// REGISTER/CHANGE EMAIL AND PASSWORD
						<View style={[styles.card4, {justifyContent: 'center', height: hp(12) + (this.state.viewConfigInfo && hp(9))}]}>
							<View style = {{flex: 1, flexDirection: 'row'}}>
								<View style={{width: wp(67.5)}}>
									<TouchableOpacity style={styles.button}
										onPress={()=>{this.setState({ register: true }); }}>
										<Text style={styles.buttonText}>Change User Information</Text>
									</TouchableOpacity>
								</View>
								<View style={{left: 5, width: wp(12.5)}}>
									<TouchableOpacity style={styles.button}
										onPress={()=>{this.setState({ viewConfigInfo: !this.state.viewConfigInfo });}}>
											<Icon name="ios-information-circle-outline" size={25} color="white"/>
									</TouchableOpacity>
								</View>
							</View>

							{this.state.viewConfigInfo && (
								<Text>You can change your e-mail address registered in our system, and you can set a password to login faster in future.</Text>
							)}

							<RegisterModal
								userEmail		= {this.state.userEmail}
								fbMail			= {this.state.fbMail}
								googleMail		= {this.state.googleMail}
								twitterMail		= {this.state.twitterMail}
								register 		= {this.state.register}
								guid			= {this.state.guid}
								fbEntrance		= {this.state.fbEntrance}
								googleEntrance	= {this.state.googleEntrance}
								twitterEntrance	= {this.state.twitterEntrance}

								onRegister={( userPassword, userEmail, register, emailEntrance )=>{
									this.setState({
										userPassword: userPassword,
										register: register,
										userEmail: userEmail,
										emailEntrance: emailEntrance
									});
								}}/>
						</View> //END OF REGISTRATION
						}
						{//DELETE ACCOUNT
						<View style={[styles.card, {justifyContent: 'center', height: hp(12)}]}>
							<View style={{width: wp(75)}}>
								<TouchableOpacity style={styles.button}
									onPress={()=>{this.setState({ deleteAcc: true });}}>
									<Text style={styles.buttonText}>Delete Account</Text>
								</TouchableOpacity>
							</View>
							<DeleteModal
								guid			= {this.state.guid}
								userChoice		= {this.state.userChoice}
								deleteAcc		= {this.state.deleteAcc}

								onDelete={( deleteAcc )=>{
									this.setState({ deleteAcc: deleteAcc });
								}}/>
						</View> //END OF DELETE
						}

						<View style={[styles.card, {justifyContent: 'center', height: hp(12)}]}>
							{ this.state.userChoice == "0" ? ( //LOG OUT FACEBOOK
									<View style={{width: wp(30)}}>
										<TouchableOpacity style={styles.altButton}
											onPress={()=>{ LoginManager.logOut(); Actions.LoginPage({type: 'reset'}); }}>
											<Text style={styles.buttonText}>Log out</Text>
										</TouchableOpacity>
									</View>
								):( this.state.userChoice == "1" ? ( //LOG OUT GOOGLE
										<View style={{width: wp(30)}}>
											<TouchableOpacity style={styles.altButton}
												onPress={()=>{ google_signOut(); Actions.LoginPage({type: 'reset'}); }}>
												<Text style={styles.buttonText}>Log out</Text>
											</TouchableOpacity>
										</View>
									):( this.state.userChoice == "2" ? ( //LOG OUT TWITTER
											<View style={{width: wp(30)}}>
												<TouchableOpacity style={styles.altButton}
													onPress={()=>{ RNTwitterSignIn.logOut(); Actions.LoginPage({type: 'reset'}); }}>
													<Text style={styles.buttonText}>Log out</Text>
												</TouchableOpacity>
											</View>
										):( //LOG OUT EMAIL
											<View style={{width: wp(30)}}>
												<TouchableOpacity style={styles.altButton}
													onPress={()=>{ Actions.LoginPage({type: 'reset'}); }}>
													<Text style={styles.buttonText}>Log out</Text>
												</TouchableOpacity>
											</View>
										)
									)
								) // END OF LOG OUT
							}
						</View>
					</ScrollView>
				</ScrollableTabView>

				<TouchableHighlight style={{ position: 'absolute', height: 55, width: wp(100/NUMBER_OF_TABS), backgroundColor: '#BF1E2E', justifyContent: 'center', alignItems: 'center' }}
					onPress={()=>{
						this.props.onChangeDrawer(true);
					}}>
						<Icon name = 'ios-menu' size={30} color= 'white' />
				</TouchableHighlight>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	tabView: {
		flex: 1,
		padding: 10,
		backgroundColor: 'rgba(0,0,0,0.01)',
	},
	tabView2: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.01)',
	},
	card4: {
		flexDirection: 'column',
		borderWidth: 1,
		backgroundColor: '#fff',
		borderColor: '#ffffff',
		margin: 5,
		height: hp('9%'),
		width: wp('90%'),
		padding: 15,
		shadowColor: '#ccc',
		shadowOffset: { width: 2, height: 2, },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
	card: {
		flexDirection: 'row',
		borderWidth: 1,
		backgroundColor: '#fff',
		borderColor: '#ffffff',
		margin: 5,
		height: hp('9%'),
		width: wp('90%'),
		padding: 15,
		shadowColor: '#ccc',
		shadowOffset: { width: 2, height: 2, },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
	card2: {
		flexDirection: 'column',
		borderWidth: 0,
		backgroundColor: '#fff',
		borderColor: '#ffffff',
		margin: 5,
		height: hp('85%'),
		width: wp('95%'),
		padding: 15,
		shadowColor: '#ccc',
		shadowOffset: { width: 2, height: 2, },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
	card3: {
		flexDirection: 'column',
		borderWidth: 1,
		backgroundColor: '#fff',
		borderColor: '#ffffff',
		margin: 5,
		height: hp('50%'),
		width: wp('90%'),
		padding: 15,
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
	textStyle: {
		fontSize:35,
		marginRight : 15,
		fontWeight: 'bold',
		textAlign: 'center',
		fontFamily: "sans-serif-medium",
		color: "#000000",
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 1
	},
	textStyle2: {
		fontSize:17,
		marginRight : 15,
		textAlign: 'center',
		color: "#000000",
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: {width: -1, height: 1},
	},
	textStyle3: {
		fontSize:15,
		textAlign: 'center',
		color: "#000000",
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 0
	},
	buttonStyle: {
		alignItems: 'center',
		width: wp('32%'),
		padding:10,
		backgroundColor: '#BF1E2E',
		borderRadius:3,
		borderColor: "#d3d3d3",
		borderWidth: 1
	},
	buttonStyle2: {
		alignItems: 'center',
		width: wp('48%'),
		padding:10,
		backgroundColor: '#BF1E2E',
		borderRadius:3,
		borderColor: "#d3d3d3",
		borderWidth: 1
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		justifyContent: 'space-around'
	},
	marker: {
		backgroundColor: "#550bbc",
		padding: 5,
		borderRadius: 5
	},
	markerStyle: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconStyle: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	markerStyle2: {
		width: 80,
		height: 55,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userStyle: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userStyle2: {
		width: 60,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	}
});
