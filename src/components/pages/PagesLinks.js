import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { addNewChatTopic, topicToLoad, addUserFromFire, delCurrentUser } from '../../redux/chatAC';

import { FirebaseMethods } from '../firebase';
import LoginModal from '../loginModal/Login';

import arrBack from './img/arr-back.svg';

import './PagesLinks.css';

class PagesLinks extends React.Component {

  state = {
    showModal : false,
    newChatName: '',
    allChatsFromFire: [],
    showAllChatsFieldModal: false,
    allChatsPreloader: false,
    showLoginModal: false,
    userPhoto: true,
    uid: '',
    userName: '',
    email: ''
  }

  componentDidMount() {
    let user = FirebaseMethods.getCurrentUser();
    user.then((user)=> {
        if (user) {
            this.props.dispatch(addUserFromFire(user));
            this.setState({
                uid: user.uid,
                userName: user.displayName,
                email: user.email
            })
        }
    });
  }

  cbShowModal = () => {
    !this.state.showModal ? this.setState({showModal: true}) : this.setState({showModal: false});
  }

  cbNewChatName =  (ev) => {
    let newChatName=String(ev.target.value);
    this.setState({newChatName: newChatName});
  }

  cbAllChats = () => {
    if (!this.state.showAllChatsFieldModal) {
      this.setState({
        allChatsPreloader: true,
        showAllChatsFieldModal: true
      });
      FirebaseMethods.getAllChats()
      .then(res => {
        let copy = [...res];
        this.setState({
          allChatsFromFire: copy,
          allChatsPreloader: false
        });
      })
    } else {
      this.setState({showAllChatsFieldModal: false});
    }
    
  }

  cbCreateNewChat = () => {
    this.props.dispatch(addNewChatTopic(this.state.newChatName));
    localStorage.setItem('lastChatTopic', String(this.state.newChatName)); // запись выбранного чата в local-storage, чтобы не потерять чат при обновлении
    FirebaseMethods.createNewChatTopic(this.state.newChatName);
    !this.state.showModal ? this.setState({showModal: true}) : this.setState({showModal: false});
  }

  cbChooseCurChat = (ev) => {
    let current = ev.target.getAttribute('value');
    this.props.dispatch(topicToLoad(String(current)));
    this.setState({showAllChatsFieldModal: false});
    localStorage.setItem('lastChatTopic', String(current)); // запись выбранного чата в local-storage, чтобы не потерять чат при обновлении
  }

  cbLogOut = () => {
    FirebaseMethods.deleteUs();
    this.props.dispatch(delCurrentUser());
    this.setState({
        uid: '',
        userName: '',
        email: ''
    })
  }

  cbLogin = () => {
    console.log('showLogin');
    this.setState({showLoginModal : true});
  }

  closeModal = () => {
    console.log('closeLogin');
    this.setState({showLoginModal : false});
  }

  cbUpdateAfterLogin = () => {
    this.setState({});
    console.log('log again');
  }
//  ошибка после логина старого юзера

          
  render() {
    let chatsFields = this.state.allChatsFromFire.map((item, index) => {
      return (
        <Link to='/app' className='pages-ul-list-field' key={index} onClick={this.cbChooseCurChat}
              value={item}
        > 
          {item}
        </Link>
      )
    });

    const {user} = this.props;

    return (
      <> 
        <div className='Link-back'>
          
          <div className='Link-back-link'>
            {
              user &&
              <Link to='/app'>
                <img src={arrBack} alt='arr-back' />
                Назад
              </Link>
            }
          </div>
        </div>
        <input type='button' className={`PageLink ${this.state.showLoginModal && 'PageLink-active'}`} 
              onClick={!this.state.uid ? this.cbLogin : this.cbLogOut}  
              value={this.state.uid ? 'Выйти' : 'Войти'} />
        <input type='button' className={`PageLink ${this.state.showAllChatsFieldModal && 'PageLink-active'}`} 
              value='Список чатов' onClick={this.cbAllChats} disabled={this.state.showModal}/>
        {
          this.state.showAllChatsFieldModal &&
          <div className='pages-ul-list'>
            {
                this.state.allChatsPreloader 
              ? <div className='pages-preloader'>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              
              : chatsFields
            }              
          </div>
        }
        <input type='button' value='Создать чат' className={`PageLink ${this.state.showModal && 'PageLink-active'}`} 
            onClick={this.cbShowModal} disabled={this.state.showAllChatsFieldModal}/>
        {this.state.showModal &&
          <div className='New-topic'>
            <input 
              className='New-topic-input' 
              type='text' 
              placeholder='Тема нового чата...'
              onChange={this.cbNewChatName}
            />
            <Link to="/app" className="PageLink-ok">
              <span onClick={this.cbCreateNewChat}>
                Ок
              </span>
            </Link>
          </div>
        }
        {
          this.state.showLoginModal && 
          <LoginModal 
              closeModal={this.closeModal} 
              updateAllAfterLogin={this.cbUpdateAfterLogin} 
          />
        }
        
      </>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    user: state.stateMes.currentUser
  }
}

export default connect(mapStateToProps)(PagesLinks);
    