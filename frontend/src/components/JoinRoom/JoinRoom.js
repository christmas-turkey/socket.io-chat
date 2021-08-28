import React, { useContext, useState } from 'react'
import SocketContext from '../../context/SocketContext'
import StateContext from '../../context/StateContext'
import cls from './JoinRoom.module.scss'

export function JoinRoom() {

    const [form, setForm] = useState({})
    const {dispatch} = useContext(StateContext)
    const {socket} = useContext(SocketContext)

    const formHandler = event => {
        setForm(prevForm => {
            return {...prevForm, [event.target.name]: event.target.value}
        })
    }

    const joinRoom = event => {
        event.preventDefault()


        socket.emit('USER_JOINT', {username: form.username, room_id: form.room_id})

        dispatch({
            type: 'USER_JOINT',
            payload: {
                joint: true,
                room_data: {
                    username: form.username,
                    room_id: form.room_id
                }
            }
        })

    }

    return (
            <div className={cls.wrapper}>
                <h2>Join Room</h2>
                <div className={cls.inputFields}>
                    <input placeholder='Username' onChange={formHandler} name="username" />
                    <input placeholder="Room ID" onChange={formHandler} name="room_id" />
                    <button disabled={!(form.username && form.room_id)} className="btn" onClick={joinRoom}>Join room</button>
                </div>
            </div>
    )
}
