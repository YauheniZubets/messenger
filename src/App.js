import React from 'react';

import Header from './components/header/Header';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';


import './App.css';


class App extends React.PureComponent {

  state = {
    newMessage : {},
    uid: '',
    uName:'',
    bodySize: 0
  }

  writeMessage = (messageVal) => { //сообщение локально
    if (messageVal) {
      // this.state.allMessages.push(messageVal);
      // let immutableCopy=[...this.state.allMessages];
      this.setState({newMessage: messageVal});
    }
  }

  cbGetUserID = (id, name) => { // uid в footer для маркера сообщений
    console.log('id: ', id);
    this.setState({
      uid: id,
      uName: name
    });
  }

  cbUpdateApp = () => {
    this.setState({});
    console.log('toupdate');
  }

  cbNextString = (size) => {
    console.log('смещение в App стейт: ', size);
    this.setState({bodySize: size});
  }

  render () {
    console.log('render App');
    return (
      <div className="App">
        <div className="main">
          <Header takeUserID={this.cbGetUserID} update={this.cbUpdateApp}/>
          <Body 
              newMessage={this.state.newMessage} 
              uid={this.state.uid} 
              size={this.state.bodySize || 0}
              uName={this.state.uName || 'Аноним'}
          />
          <Footer 
              writeMessage={this.writeMessage} 
              uid={this.state.uid} 
              nextString={this.cbNextString}
          />
        </div>
      </div>
    )
  }
}



export default App;
