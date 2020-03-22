import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

export default class PasswordTextInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            showPass: false
        };
    }

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    style={{ width: wp(75)-30, borderBottomColor: this.props.borderColor, borderBottomWidth: 1}}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    autoCorrect = {false} 
                    autoCapitalize = "none" 
                    autoCompleteType = "off"
                    secureTextEntry={!this.state.showPass}
                    />
                <View style={{ width: 30, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={()=>{this.setState({showPass: !this.state.showPass});}}>
                        <Icon
                            name={this.state.showPass ? ("ios-eye-off"):("ios-eye") } size={20} color="#BF1E2E"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

PasswordTextInput.propTypes = {
    borderColor: PropTypes.string,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string
};