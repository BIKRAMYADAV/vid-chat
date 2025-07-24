import React, { useEffect, useRef } from 'react'

function RoomVideo({stream}:{stream:MediaStream}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if(videoRef.current){
            videoRef.current.srcObject = stream;
        }
    }, [stream])


  return (
    <video ref={videoRef} autoPlay muted playsInline height={100} width={200}/>
  )
}

export default RoomVideo