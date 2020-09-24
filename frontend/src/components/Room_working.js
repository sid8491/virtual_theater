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
    const [videoUrl, setVideoUrl] = useState(storageVideoUrl || 'https://www.youtube.com/watch?v=TcMBFSGVi1c&ab_channel=MarvelEntertainment')

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
    }, [])

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
        const abc = 'https://www.youtube.com/watch?v=6ZfuNTqbHE8&ab_channel=MarvelEntertainment'
        // if (document.querySelector('#videoUrl').value || abc) {
        if (abc) {
            socket.send(JSON.stringify({
                'name': userName,
                'event': 'addVideo',
                'videoUrl': abc
            }));
        }
        // document.querySelector('#videoUrl').value = '';
    }

    const playerReady = () => {
        if (currentTime !== 0) {
            player.current.seekTo(currentTime);
            setPlaying(true);
        }
    }

    return (
        <div className='container'>
            <ReactPlayer  ref={player} url={videoUrl} controls={true}
                playing={playing} onPause={playerPause} onPlay={playerPlay} onSeek={() => {alert('seek')}} onReady={playerReady} />
                {/* playing={playing} onPause={()=>console.log('pause')} onPlay={()=>console.log('play')} onSeek={()=>console.log('seek')}/> */}
            <br />
            <button onClick={() => setPlaying(false) } className='btn btn-info btn-lg shadow p-2 m-3'>Pause</button>
            <button onClick={playerSync} className='btn btn-info btn-lg shadow p-2 m-3'>Sync All</button>
            <button onClick={addVideo} className='btn btn-info btn-lg shadow p-2 m-3'>Add video</button>
            <br />
            <span>Send Event State : {String(sendEvent)}</span><br />
            <span>Chat State : {JSON.stringify(chat)}</span><br />
            <span>Username State : {String(userName)}</span><br />
            <span>Playing State : {String(playing)}</span><br />
        </div>
    )
}

export default Room;