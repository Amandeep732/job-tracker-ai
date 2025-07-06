'use client'

import { useState, useEffect } from "react"
export default function useAuth(){
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
     const cookies = document.cookie;
     const token = cookies.includes("accessToken=")
     
     setIsLoggedIn(token)
    }, [])
    return isLoggedIn;
    
}