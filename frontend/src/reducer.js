export default (state, action) => {

    switch (action.type) {
        case 'USER_JOINT':
            return {...state, ...action.payload}
        
        case 'ADD_USER':
            return {...state, users: [...state.users, action.payload]}
        
        case 'NEW_MESSAGE':
            return {...state, messages: [...state.messages, action.payload]}
        
        case 'LOAD_CHAT_DATA':
            return {...state, messages: action.payload.messages,
                              users: action.payload.users}

        case 'UPDATE_USERS':
            return {...state, users: action.payload}

        default:
            return state
    }
}