import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { usersList, searchUser, getLastMessageOfAllUsers } from '../firebaseUsers';
import { FirebaseMethods } from '../firebase';

import { topicToLoad, chooseUserForChat } from '../../redux/chatAC';

import noUser from '../userDataModal/img/no-user.svg';

import './users.css';

export const Users = (props) => {

    const [users, setUsers] = useState([]);
    const [allChatsArr, setAllChatsArr] = useState([]);
    const [findVal, setFindVal] = useState('');
    const [chatsLastMes, setchatsLastMes] = useState({});
    const [usersLastMes, setusersLastMes] = useState({});
    const dispatch = useDispatch();

    // useEffect(async () => {
    //     const list = await FirebaseMethods.getLastMessageOfAllChats();
    //     console.log('list: ', list);
    //     if (list) setchatsLastMes(list);
    // }, [])

    useEffect(async () => {
        const listOfUsers = await usersList();
        if (listOfUsers.length) setUsers(listOfUsers);
        const list = await getLastMessageOfAllUsers(listOfUsers);
        if (list) setusersLastMes(list);
    }, [usersList]);

    useEffect(async () => {
        const allChatsCollection = await FirebaseMethods.getAllChats();
        const list = await FirebaseMethods.getLastMessageOfAllChats(allChatsCollection);
        if (allChatsCollection) setAllChatsArr(allChatsCollection);
        if (list) setchatsLastMes(list);
    }, [FirebaseMethods]);

    useEffect(() => {
        const findedUs = new Promise(res => res(searchUser(findVal)));
        findedUs.then(us => setUsers([us]))
        .catch( async er => {
            const listOfUsers = await usersList();
            if (listOfUsers.length) setUsers(listOfUsers);
            return er;
        });
    }, [findVal]);

    const cbChooseUser = (ev) => {
        const target = ev.target;
        let currentUid = null;
        let currentName = null;
        if (target) {
            const attributedTag = target.closest('.user');
            currentUid = attributedTag.getAttribute('owner');
            currentName = attributedTag.getAttribute('nameuser');
        }
        if (currentUid) {
            const dowloadTopiOnUser = async (uid) => {
                await FirebaseMethods.downloadMessagesFromFirestore(uid).then(mess => mess);
                dispatch(topicToLoad(currentUid));
                dispatch(chooseUserForChat(currentName));
            };
            dowloadTopiOnUser(currentUid);
        }  
    };

    const cbChooseCurChat = (ev) => {
        const target = ev.target;
        let current = null;
        if (target) {
            const attributedTag = target.closest('.user');
            current = attributedTag.getAttribute('value');
            dispatch(topicToLoad(String(current)));
        localStorage.setItem('lastChatTopic', String(current)); // запись выбранного чата в local-storage, чтобы не потерять чат при обновлении
        }
    }

    const usersArr = users.map((item, index) => {
        const hasHttpBoolean = item.photoURL.includes('https:');
        return (
            <div className='user' key = {index} onClick={cbChooseUser} owner = {item.uid} nameuser = {item.displayName}>
                <div className='user-photo'>
                    <img src={hasHttpBoolean ? item.photoURL : noUser} alt='user-photo'/>
                </div>
                <div className='user-mes-data'>
                    <div className='user-mes-data-name'>{item.displayName}</div>
                    <div className='user-mes-data-message'>{usersLastMes[item.uid]}...</div>
                </div>
            </div>
        )
    });

    const chatsArr = allChatsArr.map((item, index) => {
        return (
            <div className='user' key = {index} value={item} onClick={cbChooseCurChat}>
                <div></div>
                <div className='user-mes-data'>
                    <div className='user-mes-data-name'>{item}</div>
                    <div className='user-mes-data-message'>{chatsLastMes[item]}...</div>
                </div>
            </div>
        )
    });

    return (
        <section className='User-comp'>
            <input type='text' value={findVal} placeholder='Найти пользователя' 
                className='User-findbar' onChange={e=>setFindVal(e.target.value)}
            />
            {chatsArr}
            {usersArr}
        </section>
    )
}