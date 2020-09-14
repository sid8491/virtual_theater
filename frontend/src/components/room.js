import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/video/');

function Room() {
    const [testTest, setTestTest] = useState(5);
    const [playing, setPlaying] = useState(true);
    const player = useRef(null);

    useEffect(() => {
    socket.onopen = () => {
        console.log('WebSocket Client Connected');
      };
      socket.onclose = () => {
        console.log('WebSocket Closed!');
      };
      socket.onmessage = (message) => {
        console.log('msg came........');
        // setTestTest(testTest => testTest + 1);
        // console.log(testTest);
        const event = JSON.parse(message.data)['event']
        if (event === 'pause') {
            console.log('pause event');
            setPlaying(false);
        }
        if (event === 'play') {
            console.log('play event');
            setPlaying(true);
        }
    } 
    }, [])

    const playerPlay = () => {
        console.log('Play clicked');
        socket.send(JSON.stringify({
            'name': 'name',
            'event': 'play',
        }));
        // player.current.playing = true;
    }

    const playerPause = () => {
        console.log('paused and sending data');
        socket.send(JSON.stringify({
            'name': 'name',
            'event': 'pause',
        }));
    }


    return (
        <div>
            <ReactPlayer ref={player} url='https://media.w3.org/2010/05/sintel/trailer_hd.mp4' controls={true} 
            // <ReactPlayer ref={player} url='C:\Users\sid84\Downloads\Java.mp4' controls={true} 
            // onProgress={checkProgress} playing={pause} onPause={playerPause} onSeek={seeker} />
            playing={playing} onPause={playerPause} onPlay={playerPlay} />
            <br />
            {/* <button onClick={test}>{pause ? 'Pause' : 'Play'}</button>
            <button onClick={rewind}>Rewind</button> */}
            <button onClick={playerPlay}>Play</button>
            <br />
            <span>{testTest}</span>
        </div>
    )
}

export default Room;
