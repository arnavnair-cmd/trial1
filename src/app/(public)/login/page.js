"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./Login.module.css";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const logo = "/assets/lingsocLogo.png";

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/home");
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h1>Welcome back!</h1>

        <p className={styles.subtitle}>
          Get along with your folks and get into creative zone!
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOGIN</button>

        </form>

        <p style={{ marginTop: "15px" }}>
          New here?{" "}
          <Link href="/signup" className="link">
            Create an Account
          </Link>
        </p>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      <div className={styles.imageBox}>
        <motion.img
          src="/assets/lingsocLogo.png"
          layoutId="lingsocLogo"
          style={{ width: "500px" }}
        />
      </div>
    </div>
  );
}