import React from 'react'

function Chatbar() {
    return (
        <div className="container h-100 shadow">
            <h1>Chat</h1> <hr />
            <div id="chat-log" className="chat-log scrollbar scrollbar-near-moon h-75">
            </div>
            <div className="row">
                <div className="col-10">
                    <textarea id='inputText' className="form-control form-control-lg" type="text" placeholder="Type here ..." />
                </div>
                <div className="col-2">
                    <button className='btn btn-lg btn-info mt-2 p-3' onClick={() => alert('click')}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbar
