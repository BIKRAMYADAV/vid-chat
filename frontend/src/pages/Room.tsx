import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../contexts/SocketProvider'

interface Idata{
  email : string;
  id : string;
}

function Room() {
    const socket = useSocket();

    const handleUserJoined = useCallback(({email, id}:Idata) => {
        console.log(`Email user ${email} joined room ${id}`)
    },[])
    
useEffect(() => {
    socket.on("user:joined", handleUserJoined)

    return () => {
        socket.off('user:joined', handleUserJoined)
    }
}, [socket, handleUserJoined])
  return (
    <div>Room</div>
  )
}

export default Room