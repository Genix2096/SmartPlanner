import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {

  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setMessage("Account created successfully! Please login.");
      setIsSignup(false);
    } else {
      setError("Signup failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl">
              SmartPlanner
            </span>
          </div>

          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Back
          </Button>

        </div>
      </header>


      {/* Auth Form */}
      <main className="flex flex-1 items-center justify-center px-4">

        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold font-display">
              {isSignup ? "Create Account" : "Login"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignup
                ? "Sign up to start planning your studies"
                : "Login to manage your tasks"}
            </p>
          </div>


          {/* Error message */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
              {message}
            </div>
          )}


          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-white placeholder:text-gray-400"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-white placeholder:text-gray-400"
              required
            />

            {isSignup && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-white placeholder:text-gray-400"
                required
              />
            )}

            <Button type="submit" className="w-full">
              {isSignup ? "Sign Up" : "Login"}
            </Button>

          </form>

          <div className="text-center text-sm text-muted-foreground">

            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-primary font-medium"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-primary font-medium"
                >
                  Sign Up
                </button>
              </>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}