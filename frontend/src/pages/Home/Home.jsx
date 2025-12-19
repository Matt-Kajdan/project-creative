import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { getHomeData } from "../../services/home";

export function Home() {
  const [user, setUser] = useState(null)
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (!user) navigate("/login")
    })
    return unsub
  }, [navigate])

useEffect(() => {
  if (!user) return;

  async function loadHome() {
    try {
      const data = await getHomeData()
      setHomeData(data)
    } catch (err) {
      console.error("Failed to load home data", err)
    }
  }

  loadHome()
}, [user])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div>
      <h1>You are authenticated</h1>

      {homeData ? (
      <>
        <p>{homeData.sample.welcome}</p>
        <p>{homeData.sample.status}</p>
      </>
    ) : (
      <p>Loading dashboard data...</p>
    )}
{/*      <p>Email: {user.email}</p>
      <p>UID: {user.uid}</p> */}
      <button type="button" onClick={() => signOut(auth)}>Sign out</button>
    </div>
  )
}



