import React from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import db from '../firebase'; //firestore
import { StorageMethods, FirebaseMethods } from '../firebase';

import { uid } from '../firebase';
import sendLogo from './send.svg';
import add from './add.svg';

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
        // if (ev.keyCode === 13) {
        //     let target=ev.target;
        //     console.log(target.innerHTML);
        //     let space=document.createElement('br');
        //     target.append(space);
        //     console.log('newTweet: ', newTweet);
        // };
    }

    submitMessage = (ev) => { //отправка сообщ. в чат
        ev.preventDefault();
        let tweet=this.state.messageValue;
        if (tweet) {
            FirebaseMethods.submitMessage(tweet, this.props.uid)
            .then(data=>{
                this.props.writeMessage({
                    'tweet' : data.data()['data'],
                    'timestamp' : data.data()['timestamp'],
                    'userID' : this.props.uid || 'message written with no ID',
                    'isImage' : data.data()['isImage']
                });
            });
        };
    
        this.setState({messageValue: ''});
        this.divRef.current.textContent='';
        console.log(this.divRef.current.textContent);
    }

    cbAddFile = (ev) => { //запись изображения в чат
        let currentFile = ev.target.files[0];
        console.log('currentFile: ', currentFile);
        StorageMethods.uploadImage(currentFile, currentFile.name)
            .then((res)=>{
                //let image = new Image();
                //image.src=res;
                FirebaseMethods.submitMessage(res, this.props.uid, true)
                    .then(data=>{
                        
                        this.props.writeMessage({
                            'tweet' : data.data()['data'],
                            'timestamp' : data.data()['timestamp'],
                            'userID' : this.props.uid || 'message written with no ID',
                            'isImage' : data.data()['isImage']
                        });
                    });
            });

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
                    <input type='file' id='fileUpload' onChange={this.cbAddFile}/>
                    <label htmlFor='fileUpload'>
                        <img src={add} ></img>
                    </label>
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
                    <label htmlFor='newmes' className='label-send'>
                        <img src={sendLogo} ></img>
                    </label>
                </form>
            </footer>
        )
    }
}

export default Footer;