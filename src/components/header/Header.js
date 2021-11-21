import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

import LoginModal from '../loginModal/Login';
import logo from './userlogo.svg';

import { auth } from '../firebase';
import {FirebaseMethods} from '../firebase';
import firebase from 'firebase';

import './Header.css';

class Header extends React.PureComponent {

    static propTypes= {
        word : PropTypes.string
    };

    state = {
        showLoginModal: false,
        userPhoto: true,
        uid: '',
        userName: '',
        email: ''
    }

    cbLogin = () => {
        console.log('logged');
        this.setState({showLoginModal : !this.state.showLoginModal});
    }

    closeModal = () => {
        this.setState({showLoginModal : !this.state.showLoginModal});
    }

    currentUserData = (uid, name, email) => {
        if (uid && name && email) { 
            this.setState({
                uid: uid,
                userName: name,
                email: email
            })
        }
    }

    cbLogOut = () => {
        FirebaseMethods.deleteUs();
        this.setState({
            uid: '',
            userName: '',
            email: ''
        })
    };

    cbUpdateAfterLogin = () => this.props.update();

    componentDidMount() {
        let user = FirebaseMethods.getCurrentUser();
        user.then((user)=> {
            if (user) {
                this.props.takeUserID(user.uid);
                this.setState({
                    uid: user.uid,
                    userName: user.displayName,
                    email: user.email
                })
            }
        });
    }

    componentDidUpdate() {
    }

    render () {
        console.log('Header render');
        return (
            <header>
                <div>
                    <div className='username-logo'>
                        {
                            this.state.userPhoto &&
                            <div>
                                <img className='user-photo' src={logo} alt='logo' />
                            </div>
                        }
                    </div>
                </div>
                <div>
                    <span>Общий чат</span>
                </div>
                <div>
                    <div>
                        <input type='button' className='loginbtn' 
                            onClick={!this.state.uid ? this.cbLogin : this.cbLogOut}  
                            value={this.state.uid ? 'Log out' : 'Log in'}
                        />
                    </div>
                    <div className='user-hello'>
                        {
                            this.state.uid 
                            ? `Hello, ${this.state.userName}!`
                            : 'Press Login button'
                        }
                    </div>
                </div>
                
                {
                    this.state.showLoginModal && 
                    <LoginModal 
                        closeModal={this.closeModal} 
                        currentUserData={this.currentUserData}
                        updateAllAfterLogin={this.cbUpdateAfterLogin} 
                    />
                }
            </header>
        )
    }
}

export default Header;