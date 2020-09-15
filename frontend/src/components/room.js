import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/video/');

function Room() {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const player = useRef(null);

    useEffect(() => {
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
            setCurrentTime(data.currentTime);
            player.current.seekTo(data.currentTime);
            if (player.current.props.playing !== true) {
                setPlaying(true);
            }
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
            'currentTime': player.current.getCurrentTime()
        }));
    };


    return (
        <div>
            <ReactPlayer ref={player} url='https://www.youtube.com/watch?v=gR9xawiSy8A' controls={true} 
            playing={playing} onPause={playerPause} /* onStart={playerStart} */ onPlay={playerPlay} /* onSeek={playerSeek} */ onReady={playerReady} /* onProgress={playerProgress} */ />
            <br />
            <button onClick={playerSync}>Sync All</button>
            <br />
            {/* <button onClick={test}>Pauseandsync</button> */}
            <span>{playing}</span>
        </div>
    )
}

export default Room;
