import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

import { FirebaseMethods } from '../firebase';
import { auth } from '../firebase';

import './login.css';

class LoginModal extends React.PureComponent {
    constructor(props){
        super(props);
        let myEvents=new EventEmitter();
        myEvents.addListener('DeleteUser', (args)=>console.log(args));
    }

    state = {
        caseLogin: '1',
        name: '',
        password: '',
        email: '' 
    }

    static propTypes= {
        closeModal : PropTypes.func
    };

    changeCase = (ev) => {
        let caseNumber = String(ev.target.getAttribute('case'));
        if (ev && ev.target.tagName==='A' && caseNumber!==this.state.caseLogin){
            this.setState({caseLogin: caseNumber});
        } 
    }

    cbClose = () => {
        this.props.closeModal();
    }

    handleChangeEmail = (ev) => {
        this.setState({email: ev.target.value});
    }

    handleChangePassword = (ev) => {
        this.setState({password: String(ev.target.value)});
    }

    handleChangeName = (ev) => {
        this.setState({name: ev.target.value});
    }

    sendUserData = (uid, name, email) => { //для отображения инфы об юзере
        this.props.currentUserData(uid, name, email);
    }

    cbLoginOrCreate = (ev) => {
        if (this.state.caseLogin === '1') {
            auth.signInWithEmailAndPassword(this.state.email, this.state.password, )
                .then((userCredential) => {
                    // Signed in
                    // сделать коллбэк для загрузки сообщений
                    // ...
                    this.props.updateAllAfterLogin();
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log('errorMessage: ', errorMessage);
                });
                this.props.closeModal();
        };
        if (this.state.caseLogin === '2') {
            auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((userCredential) => {
                    // Signed in
                    const user = auth.currentUser;
                    console.log('user: ', user);
                    user.updateProfile({
                        displayName: this.state.name,
                        photoURL: "aahhhaha"
                    }).then(() => {
                        auth.onAuthStateChanged((user) => {
                            if (user) {
                                //console.log('user_2: ', user);
                                // User is signed in, see docs for a list of available properties
                                // https://firebase.google.com/docs/reference/js/firebase.User
                                let uid = user.uid;
                                let userName = user.displayName;
                                let email = user.email;
                                this.sendUserData(uid, userName, email);
                              // ...
                            } else {
                              // User is signed out
                              // ...
                            }
                        });
                        // ...
                    }).catch((error) => {
                        // An error occurred
                    });  
                   
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode) {
                        console.log('errorMessage: ', errorMessage);
                    }
                    // ..
                });
            this.props.closeModal();
            //выдает ошибку но работает
        }
    }

    render () {

        // const user = auth.currentUser;
        // if (user !== null) {
        //     console.log('user: ', user);
        //     // The user object has basic properties such as display name, email, etc.
        //     const displayName = user.displayName;
        //     console.log('displayName: ', displayName);
        //     const email = user.email;
        //     console.log('email: ', email);
        //     //const photoURL = user.photoURL;
        //     //const emailVerified = user.emailVerified;

        //     // The user's ID, unique to the Firebase project. Do NOT use
        //     // this value to authenticate with your backend server, if
        //     // you have one. Use User.getToken() instead.
        //     //const uid = user.uid;
        // }

        return (
            <div className='user-modal-login'>
                        <div className='user-modal-container'>
                            <ul className='modal-li'>
                                <li>
                                    <a href='#' case='1' className='selected' onClick = {this.changeCase}>Sign in</a> 
                                </li>
                                <li>
                                    <a href='#' case='2' className='selected' onClick = {this.changeCase}>New account</a>
                                </li>
                                <div className="cl-btn-2" onClick={this.cbClose}>
                                    <div>
                                        <div className="leftright"></div>
                                        <div className="rightleft"></div>
                                    </div>
                                </div>
                            </ul>
                            
                            {
                                this.state.caseLogin === '1'
                                ? <div className='login'>
                                    <form className='cd-form' onSubmit={this.cbLoginOrCreate}>
                                        <p className='fieldset top-fielset'>
                                            <label htmlFor='signin-email' className='cd-email image-replace'>E-mail</label>
                                            <input type='email' 
                                                    className='full-width has-padding has-border' 
                                                    id='signin-email' 
                                                    placeholder='E-mail'
                                                    value={this.state.email}
                                                    onChange={this.handleChangeEmail}
                                            ></input>
                                            <span className='error-message'></span>
                                        </p>
                                        <p className='fieldset'>
                                            <label className="image-replace cd-password" htmlFor="signin-password">Password</label>
                                            <input className="full-width has-padding has-border" 
                                                    id="signin-password" 
                                                    type="text" 
                                                    placeholder="Password"
                                                    value={this.state.password}
                                                    onChange={this.handleChangePassword}
                                            ></input>
                                            <a href="#0" className="hide-password">Hide</a>
                                        </p>
                                        <p className="fieldset">
                                            <input type="checkbox" id="remember-me" ></input>
                                            <label htmlFor="remember-me">Remember me</label>
                                        </p>
                                        <p className='fieldset last-fieldset'>
                                            <input className="full-width" type="submit" value="Login"></input>
                                        </p>
                                    </form>
                                </div>
                                : <div className='signup'>
                                    <form className='cd-form' onSubmit={this.cbLoginOrCreate}>
                                        <p className='fieldset top-fielset'>
                                            <label htmlFor='signup-username' className='cd-username image-replace'>Username</label>
                                            <input type='text' 
                                                    className='full-width has-padding has-border' 
                                                    id='signup-username' 
                                                    placeholder='Username'
                                                    value={this.state.name}
                                                    onChange={this.handleChangeName}
                                            ></input>
                                            <span className='error-message'></span>
                                        </p>
                                        <p className='fieldset'>
                                            <label htmlFor='signin-email' className='cd-email image-replace'>E-mail</label>
                                            <input type='email' 
                                                    className='full-width has-padding has-border' 
                                                    id='signin-email' 
                                                    placeholder='E-mail'
                                                    value={this.state.email}
                                                    onChange={this.handleChangeEmail}
                                            ></input>
                                            <span className='error-message'></span>
                                        </p>
                                        <p className='fieldset'>
                                            <label className="image-replace cd-password" htmlFor="signin-password">Password</label>
                                            <input className="full-width has-padding has-border" 
                                                    id="signin-password" 
                                                    type="text" 
                                                    placeholder="Password 6 characters"
                                                    value={this.state.password}
                                                    onChange={this.handleChangePassword}
                                            ></input>
                                            <a href="#0" className="hide-password">Hide</a>
                                            
                                        </p>
                                        <p className="fieldset">
                                            <input type="checkbox" id="remember-me" ></input>
                                            <label htmlFor="remember-me">Remember me</label>
                                        </p>
                                        <p className='fieldset last-fieldset'>
                                            <input className="full-width" 
                                                    type="submit" 
                                                    value="Create account"
                                            ></input>
                                        </p>
                                    </form>
                                </div>
                            }
                            
                            
                        </div>
                    </div>
        )
    }
}

export default LoginModal;