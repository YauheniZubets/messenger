import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Users } from '../users/users';
import ImageModal from '../showImageModal/modal';
import db from '../firebase';
import { FirebaseMethods } from '../firebase';
import { isLoading, successLoading } from '../../redux/preloaderAC';


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
    currentDate = new Date ();
    monthA = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
    

    componentDidUpdate (prevProps) {
        if (this.props.newMessage !== prevProps.newMessage) {
            this.state.loadedMessages.unshift(this.props.newMessage);
            let immutableMessagesCopy=[...this.state.loadedMessages];
            this.setState({loadedMessages : immutableMessagesCopy});
        }
        if (this.props.size !== prevProps.size) {
            let bodyHeight = parseInt(getComputedStyle(this.bodyRef.current).height);
            let bodyOffset=(this.props.size / bodyHeight) * 100;
            this.setState({bodyOffset: bodyOffset});
        }
        if (this.props.topicToLoad !== prevProps.topicToLoad) { //выбор темы по пользователю
            this.downloadChoosedTopic(this.props.topicToLoad);
        }
    }

    downloadMesFromDatabase = (limit) => { // подгрузка по скроллу
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
            this.setState({loadedMessages : immutableMessagesCopy}, ()=>this.onceScroll = true);
        });
    }

    componentDidMount () {
        if (this.props.newChatTopic) {
            //если есть в редаксе новая тема чата, то грузим пустую страницу
        } else { //из App а туда из редакса приходит выбраная тема
            this.downloadChoosedTopic(this.props.currentTopic);
        }
        
    };

    downloadChoosedTopic = (topic) => { //загрузка сообщений по выбранной теме
        this.props.dispatch(isLoading());
        FirebaseMethods.downloadMessagesFromFirestore(topic).then((messages)=>{ //возвращается промис и далее его заносим в стейт
            if (messages.length > 0) {
                this.lastTimestamp=messages[messages.length-1]['timestamp'];
                this.props.dispatch(successLoading());
            }
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
        this.setState({
            showImageModal: true,
            choosedImageModalSrc: targetSource
        });
    }

    cbCloseImage = () => this.setState({showImageModal: false});

    // cbClickOnApp = (e) => {
    //     console.log('e: ', e);
    //     e.stopPropagation();
    //     e.preventDefault();
    // } 

    render () {
        const messagesToVew=this.state.loadedMessages.map((item, index)=>{
            const date= new Date(item.timestamp.toDate()); // часы и минуты в сообщ
            return (
                <section  
                        key={index} 
                        className={`tweet ${item.userID === this.props.uid ? 'my-tweets' : 'not-my-tweets' }`}>
                    <div className='tweet-writer'>{item.userName || 'Noname'}</div>    
                    <div className='tweet-mes'>
                        {   
                            !item.isImage
                            ? item.tweet
                            : <img src={item.tweet} onClick={this.cbShowImageModal} className='myImg' alt='Image'/>
                        }
                    </div>
                    <div className='tweet-time'>
                        {
                            this.currentDate - date > 86400000
                            ? `${date.getDate()} ${this.monthA[date.getMonth()]}`
                            : `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}`: date.getMinutes()}`
                        }
                    </div>
                </section>
            )
        });
        
        return (
            <>
                <main className='main-data' 
                    style={{height: `${81-this.state.bodyOffset}%`}} ref={this.bodyRef}
                >
                    {
                        this.props.preloader.isLoading &&
                        <div className='main-preloader'>
                            <span className="main-loader"></span>
                        </div>
                    }
                    <div className='users'>
                        <Users />
                    </div>
                    <div className='chats' onScroll={this.downloadAfterScroll}>
                        {
                            messagesToVew.length ? messagesToVew : <div className='no-messages'>История сообщений пуста</div>
                        }
                    </div>
                </main>
                {
                    this.state.showImageModal && <ImageModal src={this.state.choosedImageModalSrc} close={this.cbCloseImage} />
                }
            </>    
        )
    }
};

function mapStateToProps (state) {
    return {
      topicToLoad: state.stateMes.topicToLoad,
      preloader: state.preloaders
    }
  }

export default connect(mapStateToProps)(Body);
