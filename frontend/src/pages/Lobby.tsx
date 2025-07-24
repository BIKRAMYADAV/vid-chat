import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider';

interface Idata{
  email : string;
  room : string;
}

function Lobby() {
     const [email, setEmail] = useState<string | null>(null);
    const [room, setRoom] = useState<string | null>(null);

    const socket = useSocket();

    const handleSubmit = useCallback((e:any) => {
        e.preventDefault();
        socket.emit('room:join', {email, room})
    }, [email, room, socket])

    const handleJoin = useCallback((data:Idata ) => {
      const {email, room} = data;
      console.log(email, room);

    }, [])

    useEffect(() => {
      socket.on("room:join",handleJoin);
      return () => {
        socket.off('room:join', handleJoin)
      }
    }, [socket, handleJoin])
  return (
   
    <div>
        <form onSubmit={handleSubmit}>
            <label >Email</label>
            <input type="email" id='email' 
            onChange={(e) => setEmail(e.target.value)}/>
            <label >Room No</label>
            <input type="text" id='room'
               onChange={(e) => setRoom(e.target.value)}/>
            <button type='submit'>join</button>
        </form>
    </div>
  )
}

export default Lobby