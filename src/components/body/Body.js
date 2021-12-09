import React from 'react';
import PropTypes from 'prop-types';

import ImageModal from '../showImageModal/modal';
import db from '../firebase';
import { FirebaseMethods } from '../firebase';

import './Body.css';

class Body extends React.PureComponent {
    constructor(props) {
        super(props);
        this.bodyRef=React.createRef();
    }

    static propTypes = {
        newMessage : PropTypes.object
    }

    state = {
        loadedMessages : [],
        bodyOffset : 0,
        showImageModal : false,
        choosedImageModalSrc : '' 
    }

    lastTimestamp = null;
    onceScroll = true;
    

    componentDidUpdate (prevProps) {
        console.log('Body did Updated');
        //console.log(this.props.newMessage, prevProps.newMessage);
        if (this.props.newMessage !== prevProps.newMessage) {
            this.state.loadedMessages.unshift(this.props.newMessage);
            
            let immutableMessagesCopy=[...this.state.loadedMessages];
            this.setState({loadedMessages : immutableMessagesCopy});
        }
        if (this.props.size !== prevProps.size) {
            console.log('prevProps.size: ', prevProps.size);
            console.log('this.props.size: ', this.props.size);
            let bodyHeight=this.bodyRef.current.clientHeight;
            console.log('bodyHeight: ', bodyHeight);
            let bodyOffset=(this.props.size / bodyHeight) * 100;
            this.setState({bodyOffset: bodyOffset}, ()=>console.log('bodyOffset %: ', this.state.bodyOffset));
            //в комп дид апдейт
        }
        

    }

    downloadMesFromDatabase = (limit) => {
        db.collection("messages").where("timestamp", "<", this.lastTimestamp)
            .orderBy("timestamp", "desc").limit(limit).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.state.loadedMessages.push({ 
                    'tweet': doc.data()['data'],
                    'timestamp' : doc.data()['timestamp']
                } );
            });
        })
        .then(()=>{
            let immutableMessagesCopy=[...this.state.loadedMessages];
            this.lastTimestamp=immutableMessagesCopy[immutableMessagesCopy.length-1]['timestamp'];
            //console.log('lastTimestamp: ', this.lastTimestamp);
            //console.log('immutableMessagesCopy: ', immutableMessagesCopy);
            this.setState({loadedMessages : immutableMessagesCopy}, ()=>this.onceScroll = true);
        });
    }

    componentDidMount () {
        console.log('Body did Mount');
        FirebaseMethods.downloadMessagesFromFirestore().then((messages)=>{ //возвращается промис и далее его заносим в стейт
            //let immutableMessagesCopy=[...this.state.loadedMessages];
            if (messages.length>0) this.lastTimestamp=messages[messages.length-1]['timestamp'];
            this.setState({loadedMessages : messages});
        })
    }

    downloadAfterScroll = (ev) => {
        //console.log(ev.target.scrollTop, document.documentElement.clientHeight, ev.target.scrollHeight);
        let scrolledToTop = ev.target.scrollTop;
        let fullHeight = ev.target.scrollHeight;
        //let lastTimestamp=this.lastTimestamp;
        if (Math.abs(scrolledToTop) + document.documentElement.clientHeight >= fullHeight && this.onceScroll) {
            //console.log(this.lastTimestamp);
            this.downloadMesFromDatabase(1);
            this.onceScroll = false; //флаг для одного запроса
            //вся высота прокрутки плюс высота клиента будет больше высоты скролла тогда подгрузка 
        }
    }
    
    cbShowImageModal = (e) => {
        let targetSource=e.target.getAttribute('src');
        console.log('targetSource: ', targetSource);
        this.setState({
            showImageModal: true,
            choosedImageModalSrc: targetSource
        });
    }

    cbCloseImage = () => {
        this.setState({showImageModal: false});
    }

    render () {
        console.log('render body', this.props.size);
        //const {allMessages} = this.props;

        let messagesToVew=this.state.loadedMessages.map((item, index)=>{
            
            let date= new Date (item.timestamp.toDate()); // часы и минуты в сообщ
            
            return (
                <section  
                        key={index} 
                        className={`tweet ${item.userID === this.props.uid ? 'my-tweets' : 'not-my-tweets' }`}>
                    <div className='tweet-writer'>{this.props.uName}</div>    
                    <div className='tweet-mes'>
                        {
                            !item.isImage
                            ? item.tweet
                            : <img src={item.tweet} onClick={this.cbShowImageModal} className='myImg' alt='Image'/>
                        }
                    </div>
                    <div className='tweet-time'>
                        {date.getHours()}:{date.getMinutes()}
                    </div>
                </section>
            )
        });

        return (
            <>
                <main onScroll={this.downloadAfterScroll} style={{height: `${85-this.state.bodyOffset}%`}} ref={this.bodyRef}>
                    {
                        messagesToVew ? messagesToVew : ''
                    }
                </main>
                {
                    this.state.showImageModal && <ImageModal src={this.state.choosedImageModalSrc} close={this.cbCloseImage} />
                }
            </>    
        )
    }
}

export default Body;
