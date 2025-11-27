const initialState = {
    "username": "",
    "role": ""
}

const UserReducer = (state = initialState, action)=>{

    if(action.type === "SET_USER_DETAILS"){
        let user = action.payload;

        return{
            ...state,
            username: user.username,
            role: user.role
        }
    }
    return state;

}

export default UserReducer;

/*
1. The userReducer function has initialState set to empty values of fields that we want persist
2. It also has action which get's injected through dispatch function in action and the type in the action is checked to perform the function mentioned in that type
*/

