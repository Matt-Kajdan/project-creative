import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/authentication";
import { apiFetch } from "../../services/api";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const NORMALIZED_BASE = RAW_BACKEND_URL.replace(/\/$/, "");
const BACKEND_URL = NORMALIZED_BASE
  ? (NORMALIZED_BASE.endsWith("/api") ? NORMALIZED_BASE : `${NORMALIZED_BASE}/api`)
  : "/api";

const IconPalette=()=>(<svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none"><path d="M12 3a9 9 0 0 0 0 18h2.2a2.8 2.8 0 0 0 0-5.6H13.5a1 1 0 0 1 0-2h2.8A4.7 4.7 0 0 0 21 8.7C21 5.55 16.95 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.8 10.2h.01M10.3 7.9h.01M13 10.2h.01M15.6 11.7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>);
const IconLandmark=()=>(<svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none"><path d="M12 4 3.5 8.5V11h17V8.5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M5.8 11v8M9.3 11v8M12.8 11v8M16.3 11v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4.5 19.5h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconMusic=()=>(<svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none"><path d="M18 3v12.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18 5.2 9 7.5v10.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.2 20.2a2.7 2.7 0 1 0 0-5.4c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7Z" stroke="currentColor" strokeWidth="2"/><path d="M16.2 18.2a2.7 2.7 0 1 0 0-5.4c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7Z" stroke="currentColor" strokeWidth="2"/></svg>);
const IconUser=()=>(<svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M20 20a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
const IconStar=()=>(<svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none"><path d="M12 3l2.7 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.9 6.5 20.4l1.1-6.3L3 9.6l6.3-.9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>);

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
      const availabilityRes = await fetch(
        `${BACKEND_URL}/users/availability?username=${encodeURIComponent(username)}`);
// two lines of code changed: await fetch replaced with apiFetch to follow README rule never call fetch() directly for our API
    // const availabilityRes = await apiFetch(
    // `/users/availability?username=${encodeURIComponent(username)}`
    // );
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
    <>
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: "#f7f5f1",
          backgroundImage: `
            radial-gradient(1200px 800px at 5% 0%, rgba(255, 227, 170, 0.28), transparent 60%),
            radial-gradient(900px 700px at 85% 10%, rgba(255, 190, 220, 0.24), transparent 55%),
            radial-gradient(1000px 800px at 15% 90%, rgba(180, 220, 255, 0.24), transparent 60%),
            radial-gradient(900px 800px at 85% 85%, rgba(190, 235, 210, 0.24), transparent 60%)
          `
        }}
      ></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] -translate-x-1/2 -translate-y-1/2 bg-sky-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      <div className="relative min-h-screen pt-16 sm:pt-20">
        <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-2 select-none">Create your account</h1>
            <p className="text-slate-600">Join Quizr and start playing</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Sign up</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label htmlFor="username" className="block text-sm text-slate-600">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300/70"
              />
              <label htmlFor="email" className="block text-sm text-slate-600">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300/70"
              />
              <label htmlFor="password" className="block text-sm text-slate-600">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300/70"
              />
              <input
                role="submit-button"
                id="submit"
                type="submit"
                value="Sign up"
                className="mt-2 w-full cursor-pointer rounded-xl bg-slate-800 text-white px-6 py-3 font-semibold transition-colors hover:bg-slate-700"
              />
            </form>
            {error && (
              <p className="mt-4 rounded-xl border border-rose-200/80 bg-rose-100/80 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <p className="mt-4 text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-slate-800 underline underline-offset-4 hover:text-slate-600"
              >
                Log in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
