import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider';
import { useNavigate } from 'react-router-dom';

interface Idata{
  email : string;
  room : string;
}

function Lobby() {
     const [email, setEmail] = useState<string | null>(null);
    const [room, setRoom] = useState<string | null>(null);

    const navigate = useNavigate()
    const socket = useSocket();

    const handleSubmit = useCallback((e:any) => {
        e.preventDefault();
        socket.emit('room:join', {email, room})
    }, [email, room, socket])

    const handleJoin = useCallback((data:Idata ) => {
      const {email, room} = data;
      navigate(`/room/${room}`)
      console.log(email, room);
    }, [navigate])

    useEffect(() => {
      socket.on("room:join",handleJoin);
      return () => {
        socket.off('room:join', handleJoin)
      }
    }, [socket, handleJoin])
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
  >
    <div>
      <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="room" className="block text-gray-700 font-semibold mb-1">
        Room No
      </label>
      <input
        type="text"
        id="room"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setRoom(e.target.value)}
      />
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
    >
      Join
    </button>
  </form>
</div>

  )
}

export default Lobby