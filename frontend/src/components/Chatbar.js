import React from 'react'

function Chatbar(props) {

    const addMessage = (e) => {
        e.preventDefault();
        if (document.querySelector('#inputText').value) {
            props.socket.send(JSON.stringify({
                'name': props.userName,
                'event': 'addUserMessage',
                'text': document.querySelector('#inputText').value
            }));
        }
        document.querySelector('#inputText').value = '';
    };
    
    const renderMessages = () => {
        const eventMapping = {
            'joined' : 'has joined the room!',
            'paused' : 'has paused the video!',
            'played' : 'has played the video!',
            'synced' : 'has synced all users in the room!',
            'addVideo': 'has added new video!'
        }
        if (props.chatData.message !== undefined) {
            // add message parsing here
            document.querySelector('#chat-log').innerHTML += `<div>${props.chatData.from}: ${props.chatData.message}</div><br />`
        } else if (props.chatData.event !== undefined) {
            // add events parsing here
            document.querySelector('#chat-log').innerHTML += `<div>${props.chatData.from} ${eventMapping[props.chatData.event]}</div><br />`
        }
    }
                return (
                    <div className="container shadow mt-3" style={{height: '100%', minHeight: '100%', position: 'relative'}}>
            <h1>Chat</h1> <hr />
            <div id="chat-log" className="col overflow-auto mb-2" style={{height: '75%', minHeight: '75%', maxHeight: '75%'}}>
                Chat box <br />
                {props.userName} <br />
                {renderMessages()}
            </div>
            <div className="row w-100" style={{position: 'absolute', bottom: '10px'}}>
                <div className="col-10">
                    <textarea id='inputText' className="form-control form-control-lg" type="text" placeholder="Type here ..." />
                </div>
                <div className="col-2">
                    <button className='btn btn-lg btn-info mt-2 p-3' onClick={addMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbar
