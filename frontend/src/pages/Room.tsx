import React, { useCallback, useDebugValue, useEffect, useState } from 'react'
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


    const sendStreams = useCallback(() => {
        if (!myStream) return;
    if (!peer.peer) return;
        for(const track of myStream?.getTracks()){
        peer.peer?.addTrack(track, myStream);
     }
    }, [myStream])

    const handleCallAccepted = useCallback(async ({from, ans}:any) => {
     await peer.setLocalDescription(ans);
    sendStreams();
      console.log('call accepted', from, ans);
    } ,[sendStreams])

    const handleNegoNeeded = useCallback(async () => {
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', {offer, to:connectedSocket});
    }, [connectedSocket, socket])

    const handleNegoNeedIncoming = useCallback(async ({from, offer}:any) => {
      const ans = await peer.getAnswer(offer);
      socket.emit('peer:nego:done', {to:from, ans});
    }, [])

    const handleNegoNeedFinal = useCallback(async ({ans}:any) => {
      await peer.setLocalDescription(ans);
    }, []);

 
    useEffect(() => {
      peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);

      return () => {
        peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
      }
    }, [handleNegoNeeded])


    useEffect(() => {
      peer.peer?.addEventListener('track', async ev => {
        const remoteStream = ev.streams
        setRemoteStream(remoteStream[0]);
      })
    }, [])

useEffect(() => {
    socket.on("user:joined", handleUserJoined)
    socket.on('incoming:call', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('peer:nego:needed', handleNegoNeedIncoming);
    socket.on('peer:nego:final', handleNegoNeedFinal);
    return () => {
        socket.off('user:joined', handleUserJoined)
        socket.off('incoming:call', handleIncomingCall);
        socket.off('call:accepted', handleCallAccepted);
        socket.off('peer:nego:needed', handleNegoNeedIncoming);
        socket.off('peer:nego:final', handleNegoNeedFinal);

    }
}, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedFinal, handleNegoNeedIncoming])

  return (
    <div>
        <h1>Room</h1>
        {connectedSocket ? <h4>connected</h4> : <h4>No one in the room</h4>}
        {
          remoteStream && <button onClick={sendStreams}>send stream</button>
        }
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