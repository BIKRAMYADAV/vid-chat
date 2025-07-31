import React, { useCallback, useDebugValue, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useParams } from 'react-router-dom';
import RoomVideo from '../components/RoomVideo';
import peer from '../service/peer'
import EmailModal from '../components/EmailModal';


interface Idata{
  email : string;
  id : string;
}

function Room() {
    const [connectedSocket, setConnectedSocket] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
     const [inviteLink, setInviteLink] = useState<string | null>(null);
     const [modalOpen, setModalOpen] = useState<boolean>(false);
    
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


const { roomId } = useParams<{ roomId: string }>();
console.log(roomId); // will log "1" for URL /room/1

const handleInvite = useCallback(() => {
    console.log('handle invite was called')
    if (!roomId) return;
    const link = `${window.location.origin}/room/${roomId}`;
    setInviteLink(link);
    setModalOpen(true);
}, [roomId]);

    
 
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
  <h1 className="text-3xl font-bold mb-4">Room</h1>

  <div
    className={`mb-6 text-lg font-semibold px-4 py-2 rounded-lg ${
      connectedSocket ? 'bg-green-600' : 'bg-red-600'
    }`}
  >
    {connectedSocket ? 'Connected' : 'No one in the room'}
  </div>
       <div className="text-sm text-gray-700 mt-4">
    <button className="mt-1 p-2 bg-gray-200 rounded break-all hover:cursor-pointer"
    onClick={handleInvite}>share meeting link</button>
        </div>

  <div className="flex gap-4 mb-6">
    {remoteStream && (
      <button
        onClick={sendStreams}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Send Stream
      </button>
    )}

    {connectedSocket && (
      <button
        onClick={handleCallUser}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Call
      </button>
    )}
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
    {myStream && (
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
        <h4 className="text-lg font-medium mb-2">My Stream</h4>
        <RoomVideo stream={myStream} />
      </div>
    )}

    {remoteStream && (
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
        <h4 className="text-lg font-medium mb-2">Remote Stream</h4>
        <RoomVideo stream={remoteStream} />
      </div>
    )}
    {
      modalOpen && (
        <EmailModal setModalOpen={setModalOpen} inviteLink={inviteLink}/>
      )
    }
  </div>
</div>


  )
}

export default Room