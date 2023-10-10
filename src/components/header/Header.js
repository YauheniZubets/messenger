import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserDataModal } from '../userDataModal/userDataModal';

import logo from './userlogo.svg';
import { FirebaseMethods } from '../firebase';

import { connect } from 'react-redux';

import './Header.css';


const Header = (props) => {

    const {currentUser, newChat, currentChat, choosedUserForChat} = props;

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [userPhoto, setUserPhoto] = useState(false);
    const [uid, setUid] = useState(props.uid);
    const [userName, setUserName] = useState(props.uName);
    const [email, setEmail] = useState('');
    const [userDataModal, toogleUserDataModal] = useState(false);


    const cbShowUserData = () => {
        toogleUserDataModal(!userDataModal);
    };

    useEffect(()=>{
        if (currentUser?.photoURL?.includes('https:')) setUserPhoto(true);
    }, [currentUser])

    return (
        <header>
            <div>
                <div className='username-logo' onClick = {cbShowUserData}>
                    <div>
                        <img className='user-photo' src={userPhoto ? currentUser.photoURL  : logo} alt='logo' />
                    </div>
                </div>
            </div>
            <div>
                <span>{newChat || `Чат`}</span>
            </div>
            <div>
                <div>
                    <Link to ='/' className='menubtn'>Меню</Link>
                </div>
                <div className='user-hello'>
                    {
                        currentUser 
                        ? `Ты в сети, ${currentUser.displayName}!`
                        : 'Press Login button'
                    }
                </div>
            </div>
            {
                userDataModal &&
                <UserDataModal closeModal={()=>toogleUserDataModal(!userDataModal)} user={props.currentUser}/>
            }
        </header>
    )
}

const mapStateToProps = function (state) {
    return {
      newChat: state.stateMes.newChatName,
      currentChat: state.stateMes.topicToLoad,
      currentUser: state.stateMes.currentUser,
      choosedUserForChat: state.stateMes.choosedUserForChat
    }
  }

export default connect(mapStateToProps)(Header);