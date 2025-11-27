import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/UserReducer";
import CourseReducer from "./reducers/CourseReducer";

//Configuring store here
//1. Register the user
const store = configureStore({
    reducer:{
        user: UserReducer,
        courses: CourseReducer
    }
});

export default store;


/*
This is the store for different states that we can save by using the UserReducer
Here using UserReducer we are saving the details of the user in the store.
By calling the selector we can use the state and set the details of the user using state.user.
*/
