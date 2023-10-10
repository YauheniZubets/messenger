import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

import { connect } from 'react-redux';
import { addUserFromFire } from '../../redux/chatAC';

import { auth } from '../firebase';
import { addNewUserToList } from '../firebaseUsers';

import './login.css';

class LoginModal extends React.PureComponent {
    constructor(props){
        super(props);
        let myEvents=new EventEmitter();
        myEvents.addListener('DeleteUser', (args)=>console.log(args));
    }

    state = {
        caseLogin: '2',
        name: '',
        password: '',
        email: '',
        checkbox: false 
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

    cbCheckbox = () => {
        this.state.checkbox ? this.setState({checkbox: false}) : this.setState({checkbox: true});
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
                .then(() => {
                    const user = auth.currentUser;
                    user.updateProfile({
                        displayName: this.state.name,
                        photoURL: "aahhhaha"
                    }).then(() => {
                        if (user) {
                            addNewUserToList(user);
                            console.log('user: ', user);
                            const uid = user.uid;
                            const userName = user.displayName;
                            const email = user.email;
                            this.props.dispatch(addUserFromFire(user))
                            // this.sendUserData(uid, userName, email);
                        } 
                    }).catch((error) => {
                        console.log('error: ', error);
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

        return (
            <div className='user-modal-login'>
                        <div className='user-modal-container'>
                            <ul className='modal-li'>
                                <li>
                                    <a href='#' case='1' className={this.state.caseLogin === '1' ? `selected` : ''} onClick = {this.changeCase}>Sign in</a> 
                                </li>
                                <li>
                                    <a href='#' case='2' className={this.state.caseLogin === '2' ? `selected` : ''} onClick = {this.changeCase}>New account</a>
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
                                            <input type="checkbox" id="remember-me" checked={this.state.checkbox} onChange={this.cbCheckbox}></input>
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
                                            <input type="checkbox" id="remember-me" checked={this.state.checkbox} onChange={this.cbCheckbox}></input>
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

function mapStateToProps (state) {
    return 
}
  
export default connect(mapStateToProps)(LoginModal) ;
