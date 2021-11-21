import React from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import db from '../firebase'; //firestore

import { uid } from '../firebase';
import sendLogo from './send.svg';

import './Footer.css';

class Footer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.divRef=React.createRef();
        
    }

    static propTypes = {
        writeMessage : PropTypes.func
    }

    state = {
        messageValue: '',
        areaHeight: 0
    }

    cbNewMessage = (ev) => { //коллбэк для смещения высоты боди при больших сообщениях и переносе каретки
        let newMessageValue=ev.target.textContent;
        let areaHeight = getComputedStyle(ev.target)['height'];
        let numericHeight=parseInt(areaHeight, 10);
        console.log('numericHeight: ', numericHeight);
        if (numericHeight !== this.state.areaHeight) {
            //Math.abs(numericHeight) > Math.abs(this.state.areaHeight) && (numericHeight*=(-1)) ; 
            let off = numericHeight - this.state.areaHeight;
            console.log('off: ', off);
            this.props.nextString(off);
            this.setState({areaHeight: numericHeight})
        }
        this.setState({messageValue: newMessageValue});

    }

    cbKey = (ev) => { //валидировать первый enter
        //if (ev.keyCode === 13) this.props.nextString();
    }

    submitMessage = (ev) => { //отправка сообщ. в чат
        ev.preventDefault();
        let tweet=this.state.messageValue;
        if (tweet) {
            db.collection("messages").add({
                data: tweet,
                timestamp: firebase.firestore.Timestamp.now(),
                userID: this.props.uid || 'message written with no ID'
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            var unsubscribe = db.collection("messages").orderBy("timestamp", "desc").limit(1)
            .onSnapshot((doc) => {
                doc.forEach((data) => {
                    var source = data.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log("Snapshoted: ", data.data()['data']);
                    if (source === "Local")  {
                        this.props.writeMessage({
                            'tweet' : data.data()['data'],
                            'timestamp' : data.data()['timestamp'],
                            'userID' : this.props.uid || 'message written with no ID'
                        });
                    }
                });
                unsubscribe(); // убираем слушатель состояния снапшота
            });
            
        }
        this.setState({messageValue: ''});
        this.divRef.current.textContent='';
        console.log(this.divRef.current.textContent);
    }

    componentDidMount () { //после монтирования получаем высоту текстареа для дальнейшего сравнения
        let areaHeight = getComputedStyle(this.divRef.current)['height'];
        let numericHeight=parseInt(areaHeight, 10);
        this.setState({areaHeight: numericHeight});
        
    }

    render () {
        console.log('Footer render');
        return (
            <footer className='Footer'>
                <form className='Form' onSubmit={this.submitMessage}>
                    {/* <input type='text' /> */}
                    <div 
                        className='Text-area' 
                        contentEditable
                        onInput={this.cbNewMessage}
                        ref={this.divRef}
                        onKeyDown={this.cbKey}
                    ></div>
                    <input id='newmes' type='submit' value='Send' />
                    <label htmlFor='newmes'>
                        <img src={sendLogo} ></img>
                    </label>
                </form>
            </footer>
        )
    }
}

export default Footer;