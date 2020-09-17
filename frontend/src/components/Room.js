import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from "websocket";

let socket;

function Room() {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=gR9xawiSy8A')
    const player = useRef(null);
    
    useEffect(() => {
        const websocketUrl = `ws://127.0.0.1:8000/ws${window.location.pathname}/`;
        socket = new W3CWebSocket(websocketUrl);
        
        socket.onopen = () => {
            console.log('WebSocket Client Connected');
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
                    setPlaying(false);
                }
            }
            if (data.event === 'play') {
                if (player.current.props.playing !== true) {
                    setPlaying(true);
                }
                setCurrentTime(data.currentTime);
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
            }
            if (data.event === 'addVideo') {
                setVideoUrl(data.videoUrl);
            }
        }
    }, [])

    const playerPlay = () => {
        socket.send(JSON.stringify({
            'name': 'name',
            'event': 'play',
            'currentTime': player.current.getCurrentTime()
        }));
    }

    const playerPause = () => {
        socket.send(JSON.stringify({
            'name': 'name',
            'event': 'pause',
            'currentTime': player.current.getCurrentTime()
        }));
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
            'name': 'name',
            'event': 'syncAll',
            'videoUrl': videoUrl,
            'currentTime': player.current.getCurrentTime()
        }));
    };

    const addVideo = (e) => {
        e.preventDefault();
        if (document.querySelector('#videoUrl').value) {
            socket.send(JSON.stringify({
                'name': 'name',
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
                                <button className='btn btn-lg btn-primary mb-2' onClick={addVideo}>Add Video</button>
                            </div>
                        </div>
                        <br />
                        <ReactPlayer height='50vh' width='100%' ref={player} url={videoUrl} controls={true} 
                            playing={playing} onPause={playerPause} /* onStart={playerStart} */ onPlay={playerPlay} /* onSeek={playerSeek} */ 
                            onReady={playerReady} /* onProgress={playerProgress} */ />
                    </div>
                    <div className="col-4">
                        One of three columns
                    </div>
            </div>
            <br />
            <div className='w-50 text-center'>
            <button onClick={playerSync} className='btn btn-info btn-lg shadow p-2'>Sync Video</button>
            </div>
            <br /><br />
            <div className="alert alert-info alert-dismissible fade show w-50" role="alert">
                <strong> If video in the room is out of sync, you can click the "Sync Video" button to instantly sync video for all the users in the room! </strong>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="alert alert-info alert-dismissible fade show w-50" role="alert">
                <strong> When we forward the video, it will forward it for all the users in the room but it pause the video as well. <br />
                You need to play it again. </strong>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    )
}

export default Room;