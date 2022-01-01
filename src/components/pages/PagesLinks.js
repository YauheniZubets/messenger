import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './PagesLinks.css';

class PagesLinks extends React.Component {

  state = {
    showModal : false
  }

  cbShowModal = () => {
    !this.state.showModal ? this.setState({showModal: true}) : this.setState({showModal: false});
  }
          
  render() {

    return (
      <>
        <div className='pages-ul'>
            <NavLink to="/" exact className="PageLink" ><span>Список чатов</span></NavLink>
            <div className={`PageLink ${this.state.showModal ? 'active' : ''}`} onClick={this.cbShowModal}><span>Создать чат</span></div>
            {this.state.showModal &&
              <div className='New-topic'>
                <input className='New-topic-input' type='text' placeholder='Тема нового чата...' />
                <NavLink to="/app" className="PageLink"><span>Ок</span></NavLink>
              </div>
            }
        </div>

        
      </>
    );
    
  }

}
    
export default PagesLinks;
    