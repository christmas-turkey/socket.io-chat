const express = require('express')
const http = require('http')
const socket_io = require('socket.io')

const app = express()

const server = http.createServer(app)

const io = new socket_io.Server(server)

const PORT = 5000

const rooms = new Map()

app.get('/rooms/:id', (req, res) => {

    if (rooms.has(req.params.id)) {

        return res.json({
            users: [...rooms.get(req.params.id).get('users').values()],
            messages: rooms.get(req.params.id).get('messages')
        })
    }

    return res.json({
        users: [],
        messages: []
    })
})

io.on('connection', socket => {
    
    socket.on('USER_JOINT', ({username, room_id}) => {

        if (!rooms.has(room_id)) {
            rooms.set(room_id, new Map([
                ['users', new Map()],
                ['messages', []]
            ]))
        }

        rooms.get(room_id).get('users').set(socket.id, username)

        socket.join(room_id)
        socket.broadcast.to(room_id).emit('USER_JOINT', {username})
    })

    socket.on('NEW_MESSAGE', ({room_id, username, message}) => {
        
        const message_data = {
            user_id: socket.id,
            user: username,
            text: message
        }
        
        rooms.get(room_id).get('messages').push(message_data)
        io.to(room_id).emit('NEW_MESSAGE', {message: message_data})
    })

    socket.on('disconnect', () => {
        rooms.forEach((room, room_id) => {
            if (room.get('users').delete(socket.id)) {
                const users = [...room.get('users').values()]

                io.to(room_id).emit('UPDATE_USERS', {users})
            }
        })
    })
})

server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))