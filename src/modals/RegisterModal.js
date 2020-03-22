import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PasswordTextInput from '../common/PasswordTextInput';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import { hostURL } from '../common/general';

var {height, width} = Dimensions.get('window');

if(Platform.OS == 'android'){
	height = height-24;
}

export default class RegisterModal extends Component {

	constructor(props) {
		super(props);

		this.state = {			
			userEmail: 			this.props.userEmail,
			fbEntrance: 		this.props.fbEntrance,
			googleEntrance: 	this.props.googleEntrance,
			twitterEntrance: 	this.props.twitterEntrance,
			fbMail: 			this.props.fbMail,
			googleMail: 		this.props.googleMail,
			twitterMail:		this.props.twitterMail,
			guid: 				this.props.guid,
			
			userPassword: 	"",
			selectedEmail:  -1,
			options:		[],

			disable: false,
			password: "",
			confirmPassword: "",
			passCheck: false,
			confPassCheck: false,
			passBorderColor: 'black',
			confPassBorderColor: 'black',
		};
		this.checker = this.checker.bind(this);
	}

	componentWillMount() {
		let options = [];
		if( this.props.fbEntrance ){
			options.push( {email: this.props.fbMail} );
		}
		if( this.props.googleEntrance && this.props.googleMail != this.props.fbMail ){
			options.push( {email: this.props.googleMail} );
		}
		if( this.props.twitterEntrance && this.props.twitterMail != this.props.fbMail ){
			if( this.props.twitterMail != this.props.googleMail ){
				options.push( {email: this.props.twitterMail} );
			}
		}
		this.setState({ options: options });
	}

	registration() {
		let { password, confirmPassword, passCheck, confPassCheck, guid, options, selectedEmail } = this.state;
		
		let newMail = "";
		if( selectedEmail != -1 ){
			newMail = options[selectedEmail].email;
		}
		
		if ( password == "" || confirmPassword == "" ) {
			alert("Alanları boş bırakamazsınız");
		}
		else if( !passCheck ){
			alert("Şifreniz en az 6 karakterden oluşmalı ve en az 1 sayı ile en az bir harf bulundurmalıdır");
		}
		else if( !confPassCheck ){
			alert("Girilen şifreler aynı değil");
		}
		else {
			fetch( hostURL + 'user_registration.php', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					password: password,
					guid: guid,
					email: newMail,
				})
			})
			.then((res) => res.json())
			.then((res) => {
				if (res.result == 1){
					alert('İşlem başarıyla yapıldı');
					this.setState({ 
						userPassword: res.password, userEmail: res.email,
						password: "", confirmPassword: "", selectedEmail:  -1,
						passCheck: false, confPassCheck: false,
						passBorderColor: 'black', confPassBorderColor: 'black',
					});
					this.props.onRegister( res.password, res.email, false, true ); //pw, email, reg, emailEntrance
				}
				else if (res.result == -1 ){
					alert("İşlem yapılamadı: " + res.error);
				}
			})
			.catch((err) => {
				alert("SIGNUP " + err);
			})
		}
		this.setState({ disable: false });
	}

	checker( type ){ //password and confirmpassword verifier
		if( type == "password" || type == "confirmpassword" ){
			setTimeout(()=>{
				if(this.state.confirmPassword == this.state.password ){
					this.setState({ confPassCheck: true, confPassBorderColor: 'black' });
				}
				else{
					this.setState({ confPassCheck: false });
					if( this.state.confirmPassword != "" )
						this.setState({ confPassBorderColor: 'red' });
					else
						this.setState({ confPassBorderColor: 'black' });
				}	
				if(type == "password"){
					let re = /^(?=.*[A-Za-z])(?=.*[\d]).{6,}$/
					if( re.test(this.state.password) ){
						this.setState({ passCheck: true, passBorderColor: 'black' });
					}
					else{
						this.setState({ passCheck: false });
						if( this.state.password != "" )
							this.setState({ passBorderColor: 'red' });
						else
							this.setState({ passBorderColor: 'black' });
					}
				}						
			}, 100);
		}
	}

	resetRegisterModal = () => { //reset on cancel
		let { userPassword, userEmail } = this.state;
		this.setState({ 
			password: "", confirmPassword: "", selectedEmail:  -1,
			passCheck: false, confPassCheck: false, disable: false,
			passBorderColor: 'black', confPassBorderColor: 'black',
		});
		this.props.onRegister( userPassword, userEmail, false, false );
	}

	render() {
		return(
			<Modal
				isVisible={this.props.register}
				onBackdropPress={this.resetRegisterModal}
				onBackButtonPress={this.resetRegisterModal}
				>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E7E6EC' }}>
					
					{this.state.options.length > 1 &&
						<View>
							<View style={{ margin: 8.3 , width: wp(75) }}>
								<Text style={{ textAlign: 'left' }}>E-mail: (değiştirmek istemiyorsanız hiçbirine basmayabilirsiniz)</Text>
							</View>
							{this.state.options.map((emails, index)=>{  
								return ( 
									<View key = {index} style={{ margin: 8.3 }}>
										<TouchableOpacity style={styles.button} 
											onPress={()=>{ this.setState({ selectedEmail: index }); }}
											disabled={this.state.disable}>
											<Text style={styles.buttonText}>{emails.email}</Text>
										</TouchableOpacity>
									</View>
								)})
							}
							<View style={{ width: wp(75) }}>
								<Text style={{ fontSize: 10, textAlign: 'center' }}>(Şu anki e-mailiniz: {this.state.userEmail})</Text>
							</View>
						</View>
					}

					<PasswordTextInput
						borderColor={this.state.passBorderColor}
						onChangeText={(value, type = "password" ) => {
							this.setState({password: value});
							this.checker( type );
						}}
						value={this.state.password}
						placeholder="Şifre"/>
					
					<PasswordTextInput
						borderColor={this.state.confPassBorderColor}
						onChangeText={(value, type = "confirmpassword" ) => { 
							this.setState({confirmPassword: value});
							this.checker( type );
						}}
						value={this.state.confirmPassword}
						placeholder="Şifre (tekrar)"/>

					<View
						style={{ top: hp(3), width: wp(25) }}>
						<TouchableOpacity style={styles.button} 
							onPress={this.registration.bind(this)}
							onPressOut={()=>{this.setState({disable: true});}}
							disabled={this.state.disable}>
							<Text style={styles.buttonText}>Kayıt Ol</Text>
						</TouchableOpacity>
					</View>
					
					<View style={{top: height/2 - hp(22.5) - (this.state.options.length * hp(6.875)), width: wp(25)}}>
						<TouchableOpacity style={styles.altButton} 
							onPress={this.resetRegisterModal}>
							<Text style={styles.buttonText}>İptal</Text>
						</TouchableOpacity>
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

RegisterModal.propTypes = {
    userEmail:			PropTypes.string,
    onRegister: 		PropTypes.func,
	register: 			PropTypes.bool,
	fbMail: 			PropTypes.string,
	googleMail: 		PropTypes.string,
	twitterMail:		PropTypes.string,
	guid: 				PropTypes.string,
	fbEntrance:			PropTypes.bool,
	googleEntrance:		PropTypes.bool,
	twitterEntrance:	PropTypes.bool,
};