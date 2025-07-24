import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'

interface Idata{
  email : string;
  id : string;
}

function Room() {
    const [connectedSocket, setConnectedSocket] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<any | null>(null);
    const socket = useSocket();

    const handleUserJoined = useCallback(({email, id}:Idata) => {
        console.log(`Email user ${email} joined room ${id}`)
        setConnectedSocket(id);
    },[])
    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video: true
        })
        setMyStream(stream);
    }, [])
useEffect(() => {
    socket.on("user:joined", handleUserJoined)

    return () => {
        socket.off('user:joined', handleUserJoined)
    }
}, [socket, handleUserJoined])
  return (
    <div>
        <h1>Room</h1>
        {connectedSocket ? <h4>connected</h4> : <h4>No one in the room</h4>}
        {
            connectedSocket && <button onClick={handleCallUser}>CALL</button>
        }
    </div>

  )
}

export default Room