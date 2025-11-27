
export const setUserDetails = (dispatch)=>(user)=>{

    dispatch({
        'payload': user,
        'type': "SET_USER_DETAILS"
    })

}

/*
Functions in the action file get called by the components, 
here setUserDetails is being called to save the userdetails(username, role) in the store so that they can be accessed from anywhere
1.This function passes the dispatch to action where the type is checked if the type matches then the user details are saved in the store and returned.
*/