"use client"

import { Children, createContext, useState } from "react"

export const WalletContext = createContext();

export const WalletContextProvider = ({children}) =>{
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [signer, setSigner] = useState();

    return(
        <WalletContext.Provider
            value = {{
                isConnected,
                setIsConnected,
                userAddress,
                setUserAddress,
                signer,
                setSigner
            }}

        >
            {children}
        </WalletContext.Provider>
    )
}

export const useWallet = () => useContext(WalletContext);