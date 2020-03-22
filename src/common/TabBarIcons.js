import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class TabBarIcons extends React.Component {
  tabIcons = [];

  constructor(props) {
    super(props);
    this.tabIcons = [];
  }

	componentDidMount() {
		this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
	}

	setAnimationValue({ value, }) {
		this.tabIcons.forEach((icon, i) => {
			const progress = Math.min(1, Math.abs(value - i))
			icon.setNativeProps({
				style: {
					color: this.iconColor(progress),
				},
			});
		});
	}

	//color between rgb(191,30,46) and rgb(204,204,204)
	iconColor(progress) {
		const red = 191 + (204 - 191) * progress;
		const green = 30 + (204 - 30) * progress;
		const blue = 46 + (204 - 46) * progress;
		return `rgb(${red}, ${green}, ${blue})`;
	}

	render() {
		return(
			<View style={[styles.tabs, this.props.style, ]}>
				{this.props.tabs.map((tab, i) => {
					return (
						<TouchableOpacity 
							key={tab} 
							onPress={() => this.props.goToPage(i)} 
							style={styles.tab}>
							<Icon
								name={tab}
								size={30}
								color={this.props.activeTab === i ? 'rgb(191,30,46)' : 'rgb(204,204,204)'}
								ref={(icon) => { this.tabIcons[i] = icon; }}
							/>
						</TouchableOpacity>
					);})
				}
    		</View>
    	);
	}
}

const styles = StyleSheet.create({
	tab: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 10,
	},
	tabs: {
		height: 45,
		flexDirection: 'row',
		paddingTop: 5,
		borderWidth: 1,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderBottomColor: 'rgba(0,0,0,0.05)',
	},
});