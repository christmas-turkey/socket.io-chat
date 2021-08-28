import React, { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../context/SocketContext'
import StateContext from '../../context/StateContext'
import cls from './Chat.module.scss'
import sound from './Tritone.mp3'

export function Chat() {

    const {state, dispatch} = useContext(StateContext)
    const {socket} = useContext(SocketContext)
    const messageContainerRef = useRef()

    const [message, setMessage] = useState('')

    const msgSound = new Audio(sound)

    useEffect(() => {
        socket.on('USER_JOINT', ({username}) => {

            dispatch({
                type: 'ADD_USER',
                payload: username
            })
        })

        socket.on('NEW_MESSAGE', ({message}) => {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight)
            
            if (message.user_id !== socket.id) {
                msgSound.play()
            }

            dispatch({
                type: 'NEW_MESSAGE',
                payload: message
            })
        })

        socket.on('UPDATE_USERS', ({users}) => {
            dispatch({
                type: 'UPDATE_USERS',
                payload: users
            })
        })

    }, [])

    useEffect(() => {

        fetch(`/rooms/${state.room_data.room_id}`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: 'LOAD_CHAT_DATA',
                    payload: data
                })
            })

    }, [])

    const sendMessage = event => {

        event.preventDefault()

        socket.emit('NEW_MESSAGE', {room_id: state.room_data.room_id, username: state.room_data.username, message})

    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.usersBlock}>
                <div className={cls.online}>Online: ({state.users.length})</div>
                {state.users.map((user, index) => {
                    return (
                      <div key={index} className={cls.user}>
                          {user}
                      </div>
                    )
                })}
            </div>

            <div ref={messageContainerRef} className={cls.messages}>
                {state.messages.map((msg, index) => {
                    return (
                        <div className={`${cls.msg} ${msg.user_id === socket.id ? cls.myMsg : ''}`} key={index}>
                            <div className={cls.msgBlock}>
                                <div className={cls.msgText}>{msg.text}</div>
                                <div className={cls.msgAuthor}>{msg.user_id === socket.id ? '' : msg.user}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className={cls.sendMsg}>
                <textarea rows={5} placeholder='Message' name="message" onChange={event => setMessage(event.target.value)} />
                <button disabled={!message} className="btn" onClick={sendMessage}>Send message</button>
            </div>

        </div>
    )
}
