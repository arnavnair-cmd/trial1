'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RebustedManager() {
  const [questions, setQuestions] = useState([])
  const [imageurl, setImageurl] = useState('')
  const [phrase, setPhrase] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch existing questions
  async function fetchQuestions() {
    const { data } = await supabase
      .from('rebusted_questions')
      .select('*')
      .order('id')

    setQuestions(data || [])
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Add new question
  async function addQuestion(e) {
    e.preventDefault()
    setLoading(true)

    await supabase.from('rebusted_questions').insert({
      imageurl: imageurl,
      correct_phrase: phrase
    })

    setImageurl
('')
    setPhrase('')
    setLoading(false)
    fetchQuestions()
  }

  // Delete question
  async function deleteQuestion(id) {
    await supabase
      .from('rebusted_questions')
      .delete()
      .eq('id', id)

    fetchQuestions()
  }

  return (
    <div>
      <h2>🧩 Manage ReBusted Questions</h2>

      {/* Add Form */}
      <form onSubmit={addQuestion}>
        <input
          placeholder="Image URL"
          value={imageurl}
          onChange={(e) => setImageurl
        (e.target.value)}
          required
        />

        <input
          placeholder="Correct Phrase"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? 'Adding...' : 'Add Question'}
        </button>
      </form>

      <hr />

      {/* Existing Questions */}
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: 20 }}>
          <img src={q.imageurl} width={200} />
          <p><b>Answer:</b> {q.correct_phrase}</p>
          <button onClick={() => deleteQuestion(q.id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  )
}
