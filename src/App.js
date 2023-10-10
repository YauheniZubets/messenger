import React from 'react';

import Header from './components/header/Header';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';

import { connect } from 'react-redux';
import { addUserFromFire } from './redux/chatAC';

import { FirebaseMethods } from './components/firebase';

import './App.css';

class App extends React.PureComponent {

  state = {
    newMessage : {},
    uid: this.props.userData.uid,
    uName: this.props.userData.displayName,
    bodySize: 0
  }

  componentDidMount () {
    if (!this.state.uid && !this.state.uName) {
      let user = FirebaseMethods.getCurrentUser();
      user.then( user => {
          if (user) this.props.dispatch(addUserFromFire(user));
      });
    };
  }

  writeMessage = (messageVal) => { //сообщение локально
    if (messageVal) {
      // this.state.allMessages.push(messageVal);
      // let immutableCopy=[...this.state.allMessages];
      this.setState({newMessage: messageVal});
    }
  }

  // cbGetUserID = (id, name) => { // uid в ooter для маркера сообщений
  //   this.setState({
  //     uid: id,
  //     uName: name
  //   });
  // }

  cbUpdateApp = () => this.setState({});

  cbNextString = (size) => this.setState({bodySize: size});

  render () {
    let currentTopic = localStorage.getItem('lastChatTopic');

    return (
        <div className="App">
          <div className="main">
            <Header uid={this.state.uid || this.props.userData.uid} uName={this.state.uName || this.props.userData.displayName} update={this.cbUpdateApp}/>
            <Body 
                newMessage={this.state.newMessage} 
                uid={this.state.uid || this.props.userData.uid} 
                size={this.state.bodySize || 0}
                newChatTopic = {this.props.stateReduxMes.newChatName}
                currentTopic = {this.props.stateReduxMes.topicToLoad || currentTopic}
            />
            <Footer 
                writeMessage={this.writeMessage} 
                uid={this.state.uid || this.props.userData.uid}
                uName={this.state.uName || this.props.userData.displayName} 
                nextString={this.cbNextString}
                newChatTopic = {this.props.stateReduxMes.newChatName}
                currentTopic = {this.props.stateReduxMes.topicToLoad || currentTopic}
            />
          </div>
        </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    stateReduxMes: state.stateMes,
    userData: state.stateMes.currentUser
  }
}

export default connect(mapStateToProps)(App) ;
