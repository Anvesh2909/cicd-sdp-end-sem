import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/author.css';
import { useSelector } from 'react-redux';
const Navbar = () => {
    const [user,] = useState(useSelector((state)=>state.user));
    const navigate = useNavigate();
    const logoutUser = () => {
        localStorage.clear();
        navigate("/");
    }
    return (
      
            <nav className="navbar navbar-light bg-light justify-content-between" style={{ paddingRight: '30px'}} >
                <div className="navbar-brand "> </div>
                <div className="form-inline mt-2 mb-4 ">
                    Welcome, {user.username}
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-outline-success" onClick={() => logoutUser()}>Logout</button>
                </div>

            </nav>
    

    )
}

export default Navbar