
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [ticker, setTicker] = useState('')
  const [date, setDate] = useState('')
  const [explanation, setExplanation] = useState('')
  const handleExplain = async () => {
  const response = await fetch(`http://127.0.0.1:8000/explain/${ticker}/${date}`)
  const data = await response.json()
  setExplanation(data)
}
  return (
    <div>
      <h1>Drift</h1>
      <input placeholder="Ticker e.g. AIR.NZ" value={ticker} onChange={(e) => setTicker(e.target.value)} />
      <input placeholder="Date e.g. 2026-06-09" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleExplain}>Explain</button>
      <ReactMarkdown>{explanation}</ReactMarkdown>
    </div>
  )
}

export default App