import { useEffect, useReducer } from 'react';
import io from 'socket.io-client'
import {JoinRoom} from './components/JoinRoom'
import {Chat} from './components/Chat'
import reducer from './reducer'
import StateContext from './context/StateContext'
import SocketContext from './context/SocketContext'

const socket = io('/')

function App() {

  const [state, dispatch] = useReducer(reducer, {
    joint: false,
    users: [],
    messages: [],
    room_data: {}
  })

  return (
    <SocketContext.Provider value={{socket}}>
      <StateContext.Provider value={{state, dispatch}}>

        <div>
          {state.joint ? <Chat /> : <JoinRoom />}
        </div>

      </StateContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
