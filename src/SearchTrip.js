import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Comments from './Comments';
import {Header,Card,Button, SearchBar, Icon} from 'react-native-elements';
import { string } from 'prop-types';
import { Actions } from 'react-native-router-flux';
import App from './App';

export default class SearchTrip extends Component{
    constructor(props){
        super(props)
        this.state = {
            trips: this.getTrips(),
            searchText:null,
            comments:[],
            commentEnabled:[],
            control : false,
            tripsForChange:[],
            tripsForStandStill:[],
            refresh: false,
        }
    }


    getTrips(){

        var trips = [];
        var tripsForChange = [];
        var tripsForStandStill = [];
        commentEnabled = [];
        fetch('http://nomad-server2.000webhostapp.com/getTrips.php')
        .then((response)=> response.json())
        .then((response) => {
            // console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            console.log('str:',str);
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {

                var trip = [];
                var tripForChange = [];
                var tripForStandStill = [];
                var comment;

                trip.push(element.tripID);
                tripForChange.push(element.tripID);
                tripForStandStill.push(element.tripID);
                trip.push(element.userID);
                tripForChange.push(element.userID);
                tripForStandStill.push(element.userID);
                trip.push(element.name);
                tripForChange.push(element.name);
                tripForStandStill.push(element.name);
                trip.push(element.label);
                tripForChange.push(element.label);
                tripForStandStill.push(element.label);
                trip.push(element.description);
                tripForChange.push(element.description);
                tripForStandStill.push(element.description);

                comment = [element.tripID, false]
                var random = Math.floor(Math.random() * Math.floor(3));
                tripForChange.push(random);
                tripForStandStill.push(random);

                trips.push(trip);
                tripsForChange.push(tripForChange);
                tripsForStandStill.push(tripForStandStill);

                commentEnabled.push(comment)
            });

            console.log("Comment Enabled", commentEnabled)
            this.setState({commentEnabled:commentEnabled})
            this.setState({tripsForChange:tripsForChange})
            this.setState({tripsForStandStill:tripsForStandStill})

        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });


        return trips;
    }


    onPressFollow( tripID ){
        console.log("Trip Followed :",tripID);
        this.props.setTrip( tripID );
    }


    searchTrip(){
        var trips = [];
        var tripsForChange = []
        var {tripsForStandStill} = this.state
        fetch('http://nomad-server2.000webhostapp.com/searchTrip.php',
        {
            method: 'POST',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                searchText:this.state.searchText
            })

        })
        .then((response)=> response.json())
        .then((response) => {
            console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            console.log('str:',str);
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {

                var trip = [];
                for(let row in tripsForStandStill){
                    if(element.tripID === tripsForStandStill[row][0]){
                        tripsForChange.push(tripsForStandStill[row])
                    }
                }
                trip.push(element.tripID);
                trip.push(element.userID);
                trip.push(element.name);
                trip.push(element.label);
                trip.push(element.description);


                trips.push(trip);

            });

            this.setState({tripsForChange:tripsForChange})
            this.setState({trips});
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });


    }
    refreshS(){
      this.refresh=true;
    }

    updateSearch = searchText => {
        this.setState({ searchText });
        console.log(searchText)

    };
    onSearch = () => {

        return new Promise((resolve, reject) => {

            this.searchTrip(this.state.searchText)
            resolve();
        });
    }
    onChangeText = (searchText) => {
        return new Promise((resolve, reject) => {
            this.updateSearch(searchText)

            resolve();
        });
    }
    seeComments = (tripID) => {
        var comments = [];
        console.log("TripID sent : ",tripID)

        fetch('http://nomad-server2.000webhostapp.com/seeComments.php',
        {
            method: 'POST',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                tripID:tripID[0]
            })

        })
        .then((response)=> response.json())
        .then((response) => {
            console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            console.log('str:',str);
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })
            if(array.length !== 0){
            array[0].forEach(element => {

                var comment = [];
                comment.push(element.name);
                comment.push(element.surname)
                comment.push(element.tripID);
                comment.push(element.comment);
                console.log(comment)
                comments.push(comment);

            });}else{alert("This trip has no comment")}
            console.log("GELDİ")
            this.setState({control:true,comments:comments})


            let kv = this.state.commentEnabled
            let kvNew = []
            for(let row in kv){
                console.log("In For",kv[row][0],(tripID[0]+""))
                if((kv[row][0]) === (tripID[0]+""))
                    kvNew.push([kv[row][0],true])
                else
                    kvNew.push([kv[row][0],false])
            }
            this.setState({commentEnabled:kvNew})
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });
    }
    getRandom(label,random){


        if(label === "historical"){
            if(random === 0){
                return require("./images/historical1.jpg")
            }else if(random === 1){
                return require("./images/historical2.jpg")
            }else if(random === 2){
                return require("./images/historical3.jpg")
            }
        }else if(label === "winter"){
            if(random === 0){
                return require("./images/winter1.jpg")
            }else if(random === 1){
                return require("./images/winter2.jpg")
            }else if(random === 2){
                return require("./images/winter3.jpg")
            }
        }else if(label === "summer"){
            if(random === 0){
                return require("./images/summer1.jpg")
            }else if(random === 1){
                return require("./images/summer2.jpg")
            }else if(random === 2){
                return require("./images/summer3.jpg")
            }
        }else if(label === "fun stuff"){
            if(random === 0){
                return require("./images/fun1.jpg")
            }else if(random === 1){
                return require("./images/fun2.jpg")
            }else if(random === 2){
                return require("./images/fun3.jpg")
            }
        }else if(label === "nature"){
            if(random === 0){
                return require("./images/nature1.jpg")
            }else if(random === 1){
                return require("./images/nature2.jpg")
            }else if(random === 2){
                return require("./images/nature3.jpg")
            }
        }else if(label === "mixed"){
            if(random === 0){
                return require("./images/mixed1.jpg")
            }else if(random === 1){
                return require("./images/mixed2.jpg")
            }else if(random === 2){
                return require("./images/mixed3.jpg")
            }
        }
    }
    render(){

        const { comments } = this.state
        const {user} = this.props;
        const {tripsForChange} = this.state;
        const { searchText } = this.state;
        const obj = JSON.parse(user);

        const { commentEnabled } = this.state;
        if (this.state.refresh===true){
          return(
            <App guid = {obj.userID} userEmail = {obj.email} userName = {obj.username} userPassword = {obj.password} page = {9}/>
          );
        }
        if ( tripsForChange.length == 0 )
            return (
                <Text>Getting Available Trips...</Text>
            );

        if(this.state.control === false){
            return (
                <ScrollView style={styles.scrollView}>
                <View>
                    <SearchBar
                      lightTheme
                      placeholder="Type Here..."
                      onChangeText = {(searchText) => this.updateSearch(searchText)}
                      value = {searchText}
                    />
                    <Button title='Search' onPress={() => this.searchTrip()}> </Button>
                    <Button title='Refresh' onPress={() =>this.setState({refresh:true})}> </Button>
                    {tripsForChange.map((trip, index) =>{

                        var req = this.getRandom(trip[3],trip[5]);

                        return(
                        <Card title={trip[2]}
                              image={req}>

                            <Text style={{fontWeight:"bold"}}>{trip[3]}</Text>
                            <Text>{trip[4]}</Text>
                            <Button title="See Comments" style = {styles.button} onPress={() => {this.seeComments([trip[0]])}}></Button>
                            <Button title='Follow This Trip' onPress={() => this.onPressFollow(trip[0])}> </Button>

                        </Card>)
                        }

                    )}

                </View>
                <Text> {"\n"}  </Text>
                </ScrollView>

            );
        }
        else if (this.state.control === true){
            console.log("ACTUAL COMMENT", comments)
            return(<Comments comments = {comments} user = {user} ></Comments>)

        }


}


}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button:{
    padding:20,
    borderWidth:1,
  },

  textField:{
	  width:200,
	  margin:10
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  myButton:{
    padding: 5,
    height: 20,
    width: 20,  //The Width must be the same as the height
    borderRadius:40, //Then Make the Border Radius twice the size of width or Height
    backgroundColor:'red'

  }
})
