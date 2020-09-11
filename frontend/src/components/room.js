import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'

function Room() {

    const [pause, setPause] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const player = useRef(null);
    const [seekTime, setSeekTime] = useState(0);

    const test = () => {
        console.log(`clicked ${pause}`);
        setPause(!pause);
    }

    const playerPause = () => {
        console.log('paused');
        // setPause(true)
    }

    const checkProgress = ({ played, playedSeconds, loaded, loadedSeconds }) => {
        // console.log(`${played} + ${playedSeconds} ${loaded} + ${loadedSeconds}`);
    }

    const seeker = ( state ) => {
        console.log(`seek ${state}`);
        console.log(`seek ${~~state}`);
        setSeekTime(~~state);  // ~ inverts all te bits , while doing so, converts floats to int, ~ again inverts bits again
    }

    const rewind = () => {
        // setCurrentTime = 0;
        console.log(player.current);
        player.current.seekTo(seekTime);
    }

    return (
        <div>
            <ReactPlayer ref={player} url='https://media.w3.org/2010/05/sintel/trailer_hd.mp4' controls={true} 
            onProgress={checkProgress} playing={pause} onPause={playerPause} onSeek={seeker} />
            <br />
            <button onClick={test}>{pause ? 'Pause' : 'Play'}</button>
            <button onClick={rewind}>Rewind</button>
            <button onClick={test}>Forward</button>
        </div>
    )
}

export default Room;
