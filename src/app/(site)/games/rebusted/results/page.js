'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Heading from '@/components/Heading/Heading';
import Navigation_Bar from '@/components/Navigation/Navigation_Bar';
import Footer from '@/components/Footer/Footer';

export default function RebustedResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('rebusted_submissions')
        .select('question_id, is_correct')
        .eq('user_id', user.id);

      setResults(data || []);
      setLoading(false);
    }

    fetchResults();
  }, []);

  const score = results.filter(r => r.is_correct).length;

  if (loading) return <p>Loading results...</p>;

  return (
    <div style={{ padding: '40px' }}>

      <h1>🧠 ReBusted Results</h1>
      <p>
        You scored <b>{score}</b> out of <b>{results.length}</b>
      </p>

      <Footer />
    </div>
  );
}
