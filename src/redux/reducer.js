import { ADD_NEW_CHAT_TOPIC, TOPIC_TO_LOAD, CURRENT_USER, DELETE_USER, CHOOSED_USER_FOR_CHAT } from "./chatAC";

const initState = {
    currentUser: ''
};

function mesReducer(state=initState, action) {
    switch (action.type) {
        case ADD_NEW_CHAT_TOPIC: {
            let newState = {...state, newChatName: action.newTopic, topicToLoad: null};
            return newState;
        };

        case TOPIC_TO_LOAD: {
            let newState = {...state, topicToLoad: action.topicToLoad, newChatName: null};
            return newState;
        };

        case CURRENT_USER: {
            let newState = {...state, currentUser: action.user };
            return newState;
        };

        case DELETE_USER: {
            let newState = {...state, currentUser: null };
            return newState;
        }

        case CHOOSED_USER_FOR_CHAT: {
            let newState = {...state, choosedUserForChat: action.choosedUserForChat };
            console.log('newState: ', newState.choosedUserForChat);
            return newState;
        }

        default: return state
    }
}

export default mesReducer;

