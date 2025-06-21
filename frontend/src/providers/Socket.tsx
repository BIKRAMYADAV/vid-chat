import React, {useMemo} from "react";
import {io} from 'socket.io-client'



const SocketContext = React.createContext<any | null>(null)

export const useSocket = () => {
    return React.useContext(SocketContext);
}

export const SocketProvider = (props:any) => {

    const socket = useMemo(() => io({
        host : 'localhost',
        port:3001
    }), [])
    return (
          <SocketContext.Provider value={{socket}}>
        {props.children}
    </SocketContext.Provider>
    )
  
}