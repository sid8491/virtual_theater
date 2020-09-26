import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Chatbar from './Chatbar';
import { getName } from './Home';

let socket;

function Room(props) {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [chat, setChat] = useState({});
    const [userName, setUserName] = useState(props.location.state ? props.location.state.userName : getName());
    const [sendEvent, setSendEvent] = useState(true);
    const player = useRef(null);

    const storageVideoUrl = window.localStorage.getItem('video_url');
    const [videoUrl, setVideoUrl] = useState(storageVideoUrl || 'https://www.youtube.com/watch?v=gR9xawiSy8A');

    useEffect(() => {
        const websocketUrl = `ws://127.0.0.1:8000/ws${window.location.pathname}/`;
        socket = new W3CWebSocket(websocketUrl);

        socket.onopen = () => {
            console.log('WebSocket Client Connected');
            setChat({from: userName, event: 'joined'})
        };

        socket.onclose = () => {
            console.log('WebSocket Closed!');
        };

        socket.onmessage = (message) => {
            const data = JSON.parse(message.data)

            if (data.event === 'pause') {
                console.log(`pause event. I am ${userName}`);
                console.log(data);
                if (userName !== data.name) {
                    console.log(`inside if by ${userName}`);
                    player.current.seekTo(data.currentTime);
                    setCurrentTime(data.currentTime);
                    setSendEvent(false);
                    setPlaying(false);
                }
                setChat({from: data.name, event: 'paused'})
            }

            if (data.event === 'play') {
                console.log(`play event. I am ${userName}`);
                console.log(data);
                if (userName !== data.name) {
                    console.log(`inside if by ${userName}`);
                    player.current.seekTo(data.currentTime);
                    setCurrentTime(data.currentTime);
                    setSendEvent(false);
                    setPlaying(true);
                }
                setChat({from: data.name, event: 'played'})
            }

            if (data.event === 'syncAll') {
                console.log(`syncAll event. I am ${userName}`);
                console.log(data);
                if (userName !== data.name) {
                    setVideoUrl(data.videoUrl);
                    player.current.seekTo(data.currentTime);
                    setCurrentTime(data.currentTime);
                    if (player.current.props.playing === false) {
                        setSendEvent(false);
                        setPlaying(true);
                    }
                }
                setChat({from: data.name, event: 'synced'})
            }

            if (data.event === 'addVideo') {
                setVideoUrl(data.videoUrl);
                window.localStorage.setItem('video_url', data.videoUrl);
                setChat({from: data.name, event: 'added_video'})
            }

            if (data.event === 'progress') {
                setCurrentTime(data.seconds)
            }

            return () => {
                socket.close();
                socket = null;
            }
        }
    }, []);

    const playerPause = () => {
        console.log(`trying to pause by ${userName} with sendEvent: ${sendEvent}`);
        if (sendEvent === true) {
            socket.send(JSON.stringify({
                'name': userName,
                'event': 'pause',
                'currentTime': player.current.getCurrentTime()
            }));
        } else {
            setTimeout(() => {
                setSendEvent(true);
                }, 1000);
        }
    }

    const playerPlay = () => {
        console.log(`trying to play by ${userName} with sendEvent: ${sendEvent}`);
        if (sendEvent === true) {
            socket.send(JSON.stringify({
                'name': userName,
                'event': 'play',
                'currentTime': player.current.getCurrentTime()
            }));
        } else {
            setTimeout(() => {
                setSendEvent(true);
                }, 1000);
        }
    }

    const playerSync = () => {
        console.log(`trying to sync by ${userName} with sendEvent: ${sendEvent}`);
        socket.send(JSON.stringify({
            'name': userName,
            'event': 'syncAll',
            'videoUrl': videoUrl,
            'currentTime': player.current.getCurrentTime()
        }));
    };

    const addVideo = (e) => {
        e.preventDefault();
        if (document.querySelector('#videoUrl').value) {
            socket.send(JSON.stringify({
                'name': userName,
                'event': 'addVideo',
                'videoUrl': document.querySelector('#videoUrl').value
            }));
        }
        document.querySelector('#videoUrl').value = '';
    }

    const playerReady = () => {
        if (currentTime !== 0) {
            player.current.seekTo(currentTime);
            setPlaying(true);
        }
    }

    return (
        <div className="container-fluid" style={{height: '90vh'}}>
            <div className="row">
                <div className="col-lg-8 col-12">
                    <div className="row p-4" style={{height: '10vh'}}>
                        <div className="col-7">
                            <input id='videoUrl' className="form-control form-control-lg shadow" type="text" placeholder="Enter Video URL ..." />
                        </div>
                        <div className="col-3">
                            <button className='btn btn-lg btn-info shadow' onClick={addVideo}>Add Video</button>
                        </div>
                        <div className="col-2">
                            {
                                (sendEvent)
                                ? ``
                                : <div class="spinner-grow text-danger ml-5" role="status"><span class="sr-only">Loading...</span></div>
                            }
                        </div>
                    </div>
                    <div className="row" style={{height: '80vh'}}>
                        <div className="col-12">
                            <ReactPlayer height='50vh' width='100%' ref={player} url={videoUrl} controls={true}
                                playing={playing} onPause={playerPause} onPlay={playerPlay} onReady={playerReady}
                            />
                        </div>
                        <div className="col-12">
                            <div className='w-100 text-center btn-group btn-group-lg'>
                                <button onClick={playerSync} className='btn btn-info btn-lg shadow p-2 mx-4'>Sync Video</button>
                                <button onClick={() => setPlaying(true)} className='btn btn-info btn-lg shadow p-2 mx-4'>Play</button>
                                <button onClick={() => setPlaying(false)} className='btn btn-info btn-lg shadow p-2 mx-4'>Pause</button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="alert alert-info alert-dismissible fade show w-100 shadow" role="alert">
                                <strong> If video in the room is out of sync, you can click the "Sync Video" button to instantly sync video for all the users in the room! </strong>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="alert alert-info alert-dismissible fade show w-100 shadow" role="alert">
                                <strong>Do not perform any action if RED DOT is glowing, othewise it will not reflect in other users.</strong>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-12 my-5 shadow" style={{height: '75vh'}}>
                    <Chatbar userName={userName} socket={socket} chatData={chat} />
                </div>
            </div>
        </div>
    )
    // return (
    //     <div className="container-fluid">
    //             <div className="row">
    //                 <div className="col-8">
    //                     <div className="row">
    //                         <div className="col-8">
    //                             <input id='videoUrl' className="form-control form-control-lg" type="text" placeholder="Enter Video URL ..." />
    //                         </div>
    //                         <div className="col-4">
    //                             <button className='btn btn-lg btn-info mb-2' onClick={console.log('add video')}>Add Video</button>
    //                         </div>
    //                     </div>
    //                     <br />
    //                     <ReactPlayer height='50vh' width='100%' ref={player} url={videoUrl} controls={true}  />
    //                     <div className='w-100 text-center btn-group btn-group-lg'>
    //                         <button onClick={console.log('playerSync')} className='btn btn-info btn-lg shadow p-2 m-3'>Sync Video</button>
    //                         <button onClick={() => setPlaying(true)} className='btn btn-info btn-lg shadow p-2 m-3'>Play</button>
    //                         <button onClick={() => setPlaying(false)} className='btn btn-info btn-lg shadow p-2 m-3'>Pause</button>
    //                     </div>
    //                     <br />
    //                     <div className="alert alert-info alert-dismissible fade show w-100" role="alert">
    //                         <strong> If video in the room is out of sync, you can click the "Sync Video" button to instantly sync video for all the users in the room! </strong>
    //                         <button type="button" className="close" data-dismiss="alert" aria-label="Close">
    //                             <span aria-hidden="true">&times;</span>
    //                         </button>
    //                     </div>
    //                     <div className="alert alert-info alert-dismissible fade show w-100" role="alert">
    //                         <strong> When we forward the video, it will forward it for all the users in the room but it pause the video as well. <br />
    //                         You need to play it again. </strong>
    //                         <button type="button" className="close" data-dismiss="alert" aria-label="Close">
    //                             <span aria-hidden="true">&times;</span>
    //                         </button>
    //                     </div>
    //                 </div>

    //                 <div className="col-4">
    //                     <span className='font-weight-light'>You are:</span> <span className='font-weight-bold'>{userName}</span>
    //                     <Chatbar userName={userName} socket={socket} chatData={chat} />
    //                 </div>
    //         </div>
    //     </div>
    // )
}

export default Room;
