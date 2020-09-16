import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className='container'>
            <div className="jumbotron bg-light text-dark text-center shadow ">
                <div className="container">
                    <h1 className="card-title h1">Virtual Theater</h1>
                    <p className="lead">Watching videos with friends have never been simpler than this. <br />
                    Just create a room and share the link with your friends. <br />
                    When your friends join your room you will be able to watch the videos <br /> together without any interruption. </p>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                <button type="button" className="btn btn-primary btn-lg font-weight-bold">
                    <Link to={`/room/${getRoomId()}`} className="text-light text-decoration-none">
                        CREATE YOUR ROOM
                    </Link>
                </button>
                </div>
            </div>
        </div>
    )
}

function getRoomId() {
    var length = 20;
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export default Home
