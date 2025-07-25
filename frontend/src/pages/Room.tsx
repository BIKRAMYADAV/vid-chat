import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import RoomVideo from '../components/RoomVideo';
import peer from '../service/peer'


interface Idata{
  email : string;
  id : string;
}

function Room() {
    const [connectedSocket, setConnectedSocket] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
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
        const offer = await peer.getOffer();
        socket.emit("user:call", {to:connectedSocket, offer})
        setMyStream(stream);
    }, [socket, connectedSocket])

    const handleIncomingCall = useCallback(async ({from, offer}:any) => {
      console.log('incoming call ', from, offer);
         setConnectedSocket(from)
         const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video: true
        })
        setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit('call:accepted',{to:from, ans});
    },[socket])

    const handleCallAccepted = useCallback(async ({from, ans}:any) => {
          if (!myStream) return;
    if (!peer.peer) return;
     await peer.setLocalDescription(ans);
     for(const track of myStream?.getTracks()){
        peer.peer?.addTrack(track, myStream);
     }
      console.log('call accepted', from, ans);
    } ,[myStream])


    useEffect(() => {
      peer.peer?.addEventListener('track', async ev => {
        const remoteStream = ev.streams
        setRemoteStream(remoteStream);
      })
    }, [])

useEffect(() => {
    socket.on("user:joined", handleUserJoined)
    socket.on('incoming:call', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    return () => {
        socket.off('user:joined', handleUserJoined)
        socket.off('incoming:call', handleIncomingCall);
        socket.off('call:accepted', handleCallAccepted);

    }
}, [socket, handleUserJoined, handleIncomingCall])

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
       {
        remoteStream && (
            <>
            <h4>Remote Stream</h4>
            {/* <ReactPlayer muted playing height={100} width={200} url={myStream}/> */}
            <RoomVideo stream={remoteStream}/>
            </>
        )
      }
    </div>

  )
}

export default Room