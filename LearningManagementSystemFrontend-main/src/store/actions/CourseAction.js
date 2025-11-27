import axios from "axios"


export const getAllCourses = (dispatch)=>{
    const getAll = async()=>{
        const response = await axios.get("http://localhost:8082/api/course/getAll")
        console.log(response.data);
        dispatch({
            'payload': response.data,
            'type':"GET_ALL_COURSES"
        })       
    }
    getAll();
}