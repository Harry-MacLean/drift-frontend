
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [moveDate, setMoveDate] = useState([])
  const [ticker, setTicker] = useState('')
  const [date, setDate] = useState('')
  const [explanation, setExplanation] = useState('')
  const [explainLoading, setExplainLoading] = useState(false)
  const handleExplain = async () => {
  setExplainLoading(true)
  const response = await fetch(`http://127.0.0.1:8000/explain/${ticker}/${date}`)
  const data = await response.json()
  setExplanation(data)
  setExplainLoading(false)
  }
  const [chain, setChain] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [chainLoading, setChainLoading] = useState(false)
  const [movers, setMovers] = useState([])
  const handleChain = async () => {
  setChainLoading(true)
  const response = await fetch(`http://127.0.0.1:8000/chain/${ticker}/${date}`)
  const data = await response.json()
  setChain(data)
  setHasSearched(true)
  setChainLoading(false)
}

 useEffect(() => {
    fetch('http://127.0.0.1:8000/recent')
      .then(res => res.json())
      .then(data => setMovers(data))

  }, [])

  useEffect(() => {
    if (ticker) {
      const timer = setTimeout(() => {
        fetch(`http://127.0.0.1:8000/detect/${ticker}`)
          .then(res => res.json())
          .then(data => setMoveDate(Object.keys(data["PCT Change %"])))
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [ticker])



  return (
    <div>
      <h1>Drift</h1>
      <select onChange={(e) => setTicker(e.target.value)}>
        <option value="">-- Select a recent mover --</option>
        {movers.map((mover, index) => (
          <option key={index} value={mover.ticker}>
            {mover.ticker} | {mover.pct_change}% | {mover.date}
          </option>
        ))}
      </select>
      <input placeholder="Ticker e.g. AIR.NZ" value={ticker} onChange={(e) => setTicker(e.target.value)} />
      <select onChange={(e) => setDate(e.target.value)}>
        <option value="">-- Select a spike date --</option>
        {moveDate.map((d, index) => (
          <option key={index} value={d}>{d}</option>
        ))}
      </select>
      <input placeholder="Date e.g. 2026-06-09" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleExplain}>Explain</button>
      {explainLoading && <p>Loading explanation...</p>}
      <button onClick={handleChain}>Find Chain Reaction</button>
      {chainLoading && <p>Loading chain reaction...</p>}
      <ReactMarkdown>{explanation}</ReactMarkdown>
      
      {hasSearched && chain.length === 0 ? (
        <p>No chain reaction found for {ticker} on {date}.</p>
      ) : (
      
      chain.map((item, index) => (
        <div key={index}>
          <h3>{item.ticker}</h3>
          <p>Date: {item.date} | {item.spike}%</p>
          <ul>
            {item.news.map((headline, i) => (
              <li key={i}>{headline}</li>
            ))} 
          </ul> 
        </div> 
      )))}
    </div>
  )
}

export default App