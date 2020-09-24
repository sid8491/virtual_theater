import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Chatbar from './Chatbar';
import { getName } from './Home';

let socket;

function Room(props) {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [userName, setUserName] = useState(props.location.state ? props.location.state.userName : getName());
    const [chat, setChat] = useState({});
    const [sendEvent, setSendEvent] = useState(true);
    const player = useRef(null);

    const storageVideoUrl = window.localStorage.getItem('video_url');
    const [videoUrl, setVideoUrl] = useState(storageVideoUrl || 'https://www.youtube.com/watch?v=gR9xawiSy8A')

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
                player.current.seekTo(data.currentTime);
                setCurrentTime(data.currentTime);
                if (player.current.props.playing !== false) {
                    setSendEvent(false);
                    setPlaying(false);
                }
                setChat({from: data.name, event: 'paused'})
            }
            if (data.event === 'play') {
                if (player.current.props.playing !== true) {
                    setPlaying(true);
                }
                setCurrentTime(data.currentTime);
                setChat({from: data.name, event: 'played'})
            }
            if (data.event === 'progress') {
                setCurrentTime(data.seconds)
            }
            if (data.event === 'syncAll') {
                setVideoUrl(data.videoUrl)
                setCurrentTime(data.currentTime);
                player.current.seekTo(data.currentTime);
                if (player.current.props.playing !== true) {
                    setPlaying(true);
                }
                setChat({from: data.name, event: 'synced'})
            }
            if (data.event === 'addVideo') {
                setVideoUrl(data.videoUrl);
                window.localStorage.setItem('video_url', data.videoUrl);
                setChat({from: data.name, event: 'added_video'})
            }
            if (data.event === 'addUserMessage') {
                setChat({from: data.name, message: data.text})
            }
            return () => {
                socket.close();
                socket = null;
            }
        }
    }, [])

    const playerPlay = () => {
        socket.send(JSON.stringify({
            'name': userName,
            'event': 'play',
            'currentTime': player.current.getCurrentTime()
        }));
    }

    const playerPause = () => {
        if (sendEvent == true) {
            socket.send(JSON.stringify({
                'name': userName,
                'event': 'pause',
                'currentTime': player.current.getCurrentTime()
            }));
        }
        setSendEvent(true);
    }

    // const playerSeek = () => {
    //     console.log('seeeeeek');
    // }

    // const playerStart = () => {
    //     console.log('start');
    // }

    const playerReady = () => {
        if (currentTime !== 0) {
            player.current.seekTo(currentTime);
            setPlaying(true);
        }
    }

    // const playerProgress = ({ played, playedSeconds, loaded, loadedSeconds }) => {
    //     socket.send(JSON.stringify({
    //         'name': 'name',
    //         'event': 'progress',
    //         'seconds': playedSeconds
    //     }));
    // }

    const playerSync = () => {
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

    return (
        <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        <div className="row">
                            <div className="col-8">
                                <input id='videoUrl' className="form-control form-control-lg" type="text" placeholder="Enter Video URL ..." />
                            </div>
                            <div className="col-4">
                                <button className='btn btn-lg btn-info mb-2' onClick={addVideo}>Add Video</button>
                            </div>
                        </div>
                        <br />
                        <ReactPlayer height='50vh' width='100%' ref={player} url={videoUrl} controls={true} 
                            playing={playing} onPause={playerPause} /* onStart={playerStart} */ onPlay={playerPlay} /* onSeek={playerSeek} */ 
                            onReady={playerReady} /* onProgress={playerProgress} */ />
                        <div className='w-100 text-center btn-group btn-group-lg'>
                            <button onClick={playerSync} className='btn btn-info btn-lg shadow p-2 m-3'>Sync Video</button>
                            <button onClick={() => setPlaying(true)} className='btn btn-info btn-lg shadow p-2 m-3'>Play</button>
                            <button onClick={() => setPlaying(false)} className='btn btn-info btn-lg shadow p-2 m-3'>Pause</button>
                        </div>
                        <br />
                        <div className="alert alert-info alert-dismissible fade show w-100" role="alert">
                            <strong> If video in the room is out of sync, you can click the "Sync Video" button to instantly sync video for all the users in the room! </strong>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="alert alert-info alert-dismissible fade show w-100" role="alert">
                            <strong> When we forward the video, it will forward it for all the users in the room but it pause the video as well. <br />
                            You need to play it again. </strong>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>

                    <div className="col-4">
                        <span className='font-weight-light'>You are:</span> <span className='font-weight-bold'>{userName}</span>
                        <Chatbar userName={userName} socket={socket} chatData={chat} />
                    </div>
            </div>
        </div>
    )
}

export default Room;
