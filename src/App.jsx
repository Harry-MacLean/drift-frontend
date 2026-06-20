
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
  const [chain, setChain] = useState([])
  const handleChain = async () => {
  const response = await fetch(`http://127.0.0.1:8000/chain/${ticker}/${date}`)
  const data = await response.json()
  setChain(data)
  }

  return (
    <div>
      <h1>Drift</h1>
      <input placeholder="Ticker e.g. AIR.NZ" value={ticker} onChange={(e) => setTicker(e.target.value)} />
      <input placeholder="Date e.g. 2026-06-09" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleExplain}>Explain</button>
      <button onClick={handleChain}>Find Chain Reaction</button>
      <ReactMarkdown>{explanation}</ReactMarkdown>
      {chain.map((item, index) => (
        <div key={index}>
          <h3>{item.ticker}</h3>
          <p>Date: {item.date} | {item.spike}%</p>
          <ul>
            {item.news.map((headline, i) => (
              <li key={i}>{headline}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default App