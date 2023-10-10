const ADD_NEW_CHAT_TOPIC = 'ADD_NEW_CHAT_TOPIC';
const TOPIC_TO_LOAD = 'TOPIC_TO_LOAD';
const CURRENT_USER = 'CURRENT_USER';
const DELETE_USER = 'DELETE_USER';
const CHOOSED_USER_FOR_CHAT = 'CHOOSED_USER_FOR_CHAT';

const addNewChatTopic = function (name) {
    return {
        type: ADD_NEW_CHAT_TOPIC,
        newTopic: name
    }
}

const topicToLoad = function (name) {
    return {
        type: TOPIC_TO_LOAD,
        topicToLoad: name
    }
}

const addUserFromFire = function (userData) {
    return {
        type: CURRENT_USER,
        user: userData
    }
}

const delCurrentUser = function () {
    return {
        type: DELETE_USER,
    }
}

const chooseUserForChat = function (userName) {
    return {
        type: CHOOSED_USER_FOR_CHAT,
        choosedUserForChat: userName
    }
}

export {addNewChatTopic, topicToLoad, addUserFromFire, delCurrentUser, chooseUserForChat, ADD_NEW_CHAT_TOPIC, TOPIC_TO_LOAD, CURRENT_USER, DELETE_USER, CHOOSED_USER_FOR_CHAT};