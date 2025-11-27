const initialState = {
    courses: []
}
const CourseReducer = (state=initialState, action)=>{

    if(action.type === "GET_ALL_COURSES"){
        return{
            ...state,
            courses: action.payload
        }
    }
    return state;

}

export default CourseReducer;