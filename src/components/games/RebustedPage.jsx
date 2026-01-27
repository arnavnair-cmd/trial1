'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Heading from "@/components/Heading/Heading";
import Navigation_Bar from "@/components/Navigation/Navigation_Bar";
import Footer from "@/components/Footer/Footer";

import style from "./RebustedPage.module.css";

/* Supabase */
import { supabase } from "@/lib/supabase";

/* Page-specific components */
import QuestionItem from "@/components/Rebusted_comp/QuestionItem";
import ErrorMessage from "@/components/Rebusted_comp/ErrorMessage";
import LoadingScreen from "@/components/Rebusted_comp/LoadingScreen";

export default function RebustedPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  // -------- INITIAL LOAD --------
  useEffect(() => {
    const init = async () => {
      // 1️⃣ Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to play ReBusted");
        setLoading(false);
        return;
      }

      setUser(user);

      // 2️⃣ Check if user already submitted
      const { data: existing, error: checkError } = await supabase
        .from("rebusted_submissions")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (checkError) {
        setError(checkError.message);
        setLoading(false);
        return;
      }

      if (existing?.length > 0) {
        setAlreadySubmitted(true);
        setLoading(false);
        return;
      }

      // 3️⃣ Fetch questions
      const { data, error } = await supabase
        .from("rebusted_questions")
        .select("id, imageurl, correct_phrase")
        .order("id");

      if (error) {
        setError(error.message);
      } else {
        setQuestions(data || []);
      }

      setLoading(false);
    };

    init();
  }, []);

  // -------- ANSWER CHANGE --------
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // -------- SUBMIT --------
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!user) {
      setError("User not authenticated");
      setSubmitting(false);
      return;
    }

    const submissions = questions.map((q) => {
      const userAnswer = answers[q.id] || "";

      return {
        question_id: q.id,
        user_id: user.id,
        submitted_answer: userAnswer,
        is_correct:
          userAnswer.trim().toLowerCase() ===
          q.correct_phrase.trim().toLowerCase(),
      };
    });

    const { error } = await supabase
      .from("rebusted_submissions")
      .insert(submissions);

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      router.push("/games/rebusted/results");
    }
  };


  // -------- UI STATES --------
  if (loading) return <LoadingScreen />;

  if (alreadySubmitted) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Quiz Already Submitted</h2>
        <p>You have already completed this quiz.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: "url('/assets/bg_rebusted2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmitAll}>
        <div className={style.questionsGrid}>
          {questions.map((q, index) => (
            <QuestionItem
              key={q.id}
              index={index}
              question={q}
              answer={answers[q.id] || ""}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {questions.length > 0 && (
          <button
            type="submit"
            disabled={submitting}
            className={style.submitBtn}
          >
            {submitting ? "Submitting..." : "Submit All"}
          </button>
        )}
      </form>

      <Footer />
    </div>
  );
}
