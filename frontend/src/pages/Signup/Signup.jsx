import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/authentication";
import { apiFetch } from "../../services/api";

//const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; (removed as currently unused
// pls see note on line 35 for more info)

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/")
    })  
    return unsub
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      if (!username.trim()) {
        setError("Username is required");
        return;
      }
//const availabilityRes = await fetch( 
// ${BACKEND_URL}/users/availability?username=${encodeURIComponent(username)} );
// two lines of code changed: await fetch replaced with apiFetch to follow README rule never call fetch() directly for our API
      const availabilityRes = await apiFetch(
        `/users/availability?username=${encodeURIComponent(username)}`
      );
      const availabilityBody = await availabilityRes.json().catch(() => ({}));
      if (!availabilityRes.ok) {
        throw new Error(availabilityBody.message || "Unable to check username");
      }
      const { available } = availabilityBody;
      if (!available) {
        setError("Username already taken");
        return;
      }

      await signup(email, password); // creates user + signs them in
      const res = await apiFetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Unable to create user");
      }
      // onAuthStateChanged redirects on its own, but to be safe:
      // navigate("/")
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  }

  return (
<div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
  </div>

<div className="relative flex min-h-dvh items-center justify-center px-4 py-10">


      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
            Welcome to Quiz.app
          </span>
        </h1>

        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 border border-white/20">

          <h2 className="text-lg font-medium">Sign up</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label htmlFor="username" className="block text-sm text-white/80">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-purple-400/60" />
            <label htmlFor="email" className="block text-sm text-white/80">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-purple-400/60" />
            <label htmlFor="password" className="block text-sm text-white/80">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-purple-400/60" />
            <input role="submit-button" id="submit" type="submit" value="Sign up" className="mt-2 w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95" />
          </form>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          )}

          <p className="mt-4 text-sm text-white/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-300 hover:text-pink-200 underline underline-offset-4"
            >
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
</div>
  );
}
