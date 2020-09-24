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
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <span className='font-weight-light'>You are:</span> <span className='font-weight-bold'>{props.userName}</span> <hr />
                </div>
                <div id="chat-log" className="col-12 overflow-auto" style={{height: '60vh'}}>
                    {renderMessages()}
                </div>
            </div>
            <div className="row">
                <div className="col-10">
                    <textarea id='inputText' className="form-control form-control-lg my-2" type="text" placeholder="Type here ..." />
                </div>
                <div className="col-2">
                    <button className='btn btn-lg btn-info mt-4' onClick={addMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbar
