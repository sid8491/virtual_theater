import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Chatbar from './Chatbar';
import { getName } from './Home';

let socket;

function Room(props) {
    const [playing, setPlaying] = useState(false);
    // const [currentTime, setCurrentTime] = useState(0);
    const [userName, setUserName] = useState(props.location.state ? props.location.state.userName : getName());
    // const [chat, setChat] = useState({});
    const [sendEvent, setSendEvent] = useState(true);
    const player = useRef(null);

    const storageVideoUrl = window.localStorage.getItem('video_url');
    const [videoUrl, setVideoUrl] = useState(storageVideoUrl || 'https://www.youtube.com/watch?v=TcMBFSGVi1c&ab_channel=MarvelEntertainment')

    useEffect(() => {
        const websocketUrl = `ws://127.0.0.1:8000/ws${window.location.pathname}/`;
        socket = new W3CWebSocket(websocketUrl);

        socket.onopen = () => {
            console.log('WebSocket Client Connected');
            // setChat({from: userName, event: 'joined'})
        };

        socket.onclose = () => {
            console.log('WebSocket Closed!');
        };

        socket.onmessage = (message) => {
            const data = JSON.parse(message.data)

            if (data.event === 'pause') { 
                console.log(`I am ${userName}`);
                console.log(data);
                if (userName !== data.name) {
                    console.log(`inside if by ${userName}`);
                    player.current.seekTo(data.currentTime);
                    setSendEvent(false);
                    setPlaying(false);
                }
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
        }
        // setTimeout(() => {
        //     setSendEvent(true);
        //   }, 1000);
        setSendEvent(true);
    }

    return (
        <div className='container'>
            <ReactPlayer  ref={player} url={videoUrl} controls={true} 
                playing={playing} onPause={playerPause} />
            <br />
            <button onClick={() => setPlaying(false)} className='btn btn-info btn-lg shadow p-2 m-3'>Pause</button>
        </div>
    )
}

export default Room;