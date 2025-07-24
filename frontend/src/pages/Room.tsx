import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import ReactPlayer from 'react-player'
import RoomVideo from '../components/RoomVideo';
interface Idata{
  email : string;
  id : string;
}

function Room() {
    const [connectedSocket, setConnectedSocket] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
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
      {
        myStream && (
            <>
            <h4>My Stream</h4>
            {/* <ReactPlayer muted playing height={100} width={200} url={myStream}/> */}
            <RoomVideo stream={myStream}/>
            </>
        )
      }
    </div>

  )
}

export default Room