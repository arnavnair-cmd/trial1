"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./SignUp.module.css";


export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const logo = "/assets/lingsocLogo.png";

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created successfully! Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h1>Sign Up</h1>

        <p>
          Already signed up?{" "}
          <Link href="/login" className={styles.link}>
            Login here
          </Link>
        </p>

        <form onSubmit={handleRegister}>

          

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your 6-8 character password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Repeat Password</label>
          <input
            type="password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>

        </form>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      <div className={styles.imageBox}>
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
}