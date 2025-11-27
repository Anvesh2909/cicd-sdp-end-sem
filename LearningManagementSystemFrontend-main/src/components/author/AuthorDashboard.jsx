import React, { useRef, useState } from 'react'
import Sidebar from './Sidebar';
import '../../css/author.css';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AuthorDashboard = () => {

    const [isClosed, setIsClosed] = useState(true);

    const overlayRef = useRef(null);
    const wrapperRef = useRef(null);

    const handleHamburgerClick = () => {

        //Toggle
        const newState = !isClosed;
        setIsClosed(newState);

        if (overlayRef.current) {
            overlayRef.current.style.display = newState ? 'none' : 'block';
        }

        if (wrapperRef.current) {
            wrapperRef.current.classList.toggle('toggled');
        }
    }

    return (
        <div >

            <div className='row'>
                <div className='col-lg-12 '>
                    <Navbar  />
                </div>

            </div>
            <div className='col-lg-12'>



                <div id='wrapper' ref={wrapperRef}>


                    <div
                        className="overlay"
                        ref={overlayRef}
                        style={{ display: isClosed ? 'none' : 'block' }}
                    >
                    </div>
                    <Sidebar />
                    <div id='page-content-wrapper'>
                        <button type='button'
                            className={`hamburger animated fadeInLeft ${isClosed ? 'is-closed' : 'is-open'}`}
                            data-toggle="offcanvas"
                            onClick={handleHamburgerClick}
                        >
                            <span className="hamb-top"></span>
                            <span className="hamb-middle"></span>
                            <span className="hamb-bottom"></span>
                        </button>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <Outlet />
                        </div>

                    </div>

                </div>
            </div>



        </div>
    )
}

export default AuthorDashboard