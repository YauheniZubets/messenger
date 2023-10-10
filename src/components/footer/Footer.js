import React from 'react';
import PropTypes from 'prop-types';

import { storage } from '../firebase';
import db from '../firebase'; //firestore
import { StorageMethods, FirebaseMethods, storageRef } from '../firebase';

import { uid } from '../firebase';
import sendLogo from './send.svg';
import add from './add.svg';
import ProgressBar from '../progress-bar/progress-bar';

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
        areaHeight: 0,
        defaultAreaHeight: null,
        previewImage: null,
        progressUpload: 0
    }

    componentDidMount () { //после монтирования получаем высоту текстареа для дальнейшего сравнения
        let areaHeight = parseInt(getComputedStyle(this.divRef.current).height);
        this.setState({
            defaultAreaHeight: areaHeight,
            areaHeight: areaHeight
        });
    }

    // componentDidUpdate () { //вычисление высоты при картинке в инпуте
    //     if (!this.state.previewImage) {
    //         this.setState({areaHeight: this.state.defaultAreaHeight});
            
    //     }
    // }

    cbNewMessage = (ev) => { //коллбэк для смещения высоты боди при больших сообщениях и переносе каретки
        let newMessageValue = ev.target.innerText;
        const target = ev.target;
        if (target) this.offsetCalc(target);
        this.setState({messageValue: newMessageValue});
    }

    cbkeyDown = ev => {
        const key = ev.keyCode;
        if (key === 13) {
            const val = ev.target.innerText;
            const correctedVal = val + '\n' + ' ';
            this.setState({messageValue: correctedVal});
        }
    }

    offsetCalc = (targetInput) => {
        const areaHeight = parseInt(getComputedStyle(targetInput).height);
        if (areaHeight !== this.state.areaHeight) {
            const off = areaHeight - this.state.defaultAreaHeight;
            this.props.nextString(off);
            this.setState({areaHeight: areaHeight});
        };
    }

    submitMessage = (ev) => { //отправка сообщ. в чат
        ev.preventDefault();
        let tweet = this.state.messageValue;
        if (tweet && tweet[tweet.length-1] === '\n') tweet = tweet.substring(0, tweet.length-1);
        if (tweet) {
            FirebaseMethods.submitMessage(tweet, this.props.uid, false, this.props.newChatTopic || this.props.currentTopic, this.props.uName)
            .then(data=>{
                this.props.writeMessage({
                    'tweet' : data.data()['data'],
                    'timestamp' : data.data()['timestamp'],
                    'userID' : this.props.uid || 'message written with no ID',
                    'userName' : this.props.uName,
                    'isImage' : data.data()['isImage']
                });
            });
        };
    
        this.divRef.current.textContent='';
        if (this.state.areaHeight !== this.state.defaultAreaHeight) {
            this.props.nextString(0);
            this.setState({areaHeight: this.state.defaultAreaHeight});
        }
        this.setState({messageValue: ''});
    }
    
    cbAddFile = (ev) => { //запись изображения в чат
        let currentFile = ev.target.files[0];
        this.setState({previewImage: URL.createObjectURL(currentFile)});
        const timeSt = new Date();
        const imagesRef = storageRef.child(`images/${currentFile.name}_${timeSt}`);
        const uploadTask = imagesRef.put(currentFile);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({progressUpload: progress});
                console.log('height', this.divRef.current.clientHeight);
            }, 
            (error) => {
                console.log('error: ', error);
            }, 
            () => {
                try {
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => downloadURL)
                    .then(link => FirebaseMethods.submitMessage(link, this.props.uid, true, this.props.newChatTopic || this.props.currentTopic, this.props.uName)
                        .then(data=>{
                            this.props.writeMessage({
                                'tweet' : data.data()['data'],
                                'timestamp' : data.data()['timestamp'],
                                'userID' : this.props.uid || 'message written with no ID',
                                'userName' : this.props.uName,
                                'isImage' : data.data()['isImage']
                            });
                            this.setState({
                                previewImage: null,
                                areaHeight: this.state.defaultAreaHeight
                            });
                            this.props.nextString(0);
                        })
                    )
                } catch (error) {
                  console.log('error: ', error);
                }
            } 
        );
    };

    render () {
        return (
            <footer className='Footer'>
            <div className='Footer-wrapper'>
                <input type='file' id='fileUpload' onChange={this.cbAddFile}/>
                <label htmlFor='fileUpload'>
                    <img src={add} />
                </label>
                <form className='Form' onSubmit={this.submitMessage}>
                    <div 
                        className='Text-area' 
                        contentEditable={this.state.previewImage ? false: true}
                        onInput={this.cbNewMessage}
                        onKeyDown={this.cbkeyDown}
                        ref={this.divRef}
                    >
                        {
                            this.state.previewImage && 
                            <div className='mini-preview-image-wrapper'>
                                <div className='mini-preview-opacity'>
                                    <img className='mini-preview' src={this.state.previewImage} alt='mini-preview-image' 
                                        onLoad={()=>this.offsetCalc(this.divRef.current)}   
                                    />
                                </div>
                                <ProgressBar size={35}
                                    strokeWidth={5}
                                    percentage={this.state.progressUpload}
                                    color="white"
                                />
                            </div>
                        }
                    </div>
                    <input id='newmes' type='submit' value='Send' />
                </form>
                <label htmlFor='newmes' >
                    <img src={sendLogo} ></img>
                </label>
            </div>
                
                
            </footer>
        )
    }
}

export default Footer;