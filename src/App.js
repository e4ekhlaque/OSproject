import React, { useState } from "react";
import "./App.css";
function App() {
  const [processes, setProcesses] = useState([]);
  const [pid, setPid] = useState("");
  const [arrival, setArrival] = useState("");
  const [burst, setBurst] = useState("");
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [averages, setAverages] = useState(null);

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (!pid || !arrival || !burst) return;
    const newProcess = {
      pid,
      arrival: parseInt(arrival),
      burst: parseInt(burst),
    };

    setProcesses([...processes, newProcess]);
    setPid("");
    setArrival("");
    setBurst("");
  };

  const handleSimulateFCFS = () => {
    const sortedProcesses = [...processes].sort(
      (a, b) => a.arrival - b.arrival
    );

    let currentTime = 0;
    let totalWT = 0;
    let totalTAT = 0;

    const calculatedResults = [];
    const calculatedGantt = [];

    sortedProcesses.forEach((p) => {
      if (currentTime < p.arrival) {
        currentTime = p.arrival;
      }

      const start = currentTime;
      const finish = start + p.burst;
      const tat = finish - p.arrival;
      const wt = tat - p.burst;

      totalWT += wt;
      totalTAT += tat;

      calculatedResults.push({ ...p, start, finish, wt, tat });
      calculatedGantt.push({ pid: p.pid, burst: p.burst, start: start });

      currentTime = finish;
    });

    setResults(calculatedResults);
    setGanttChart(calculatedGantt);
    setAverages({
      avgWT: (totalWT / processes.length).toFixed(2),
      avgTAT: (totalTAT / processes.length).toFixed(2),
    });
  };

  return (
    <>
      <h1>FCFS Scheduling Algorithm Simulator</h1>
      <div className="container">
        <h2>Input Data</h2>
        <form id="processForm" onSubmit={handleAddProcess}>
          <label>
            Process ID:
            <input
              className="input"
              type="text"
              placeholder="Process id"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              required
            />
          </label>
          <label>
            Arrival Time:
            <input
              className="input"
              type="number"
              placeholder="Arrival time"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              required
            />
          </label>
          <label>
            Burst Time:
            <input
              type="number"
              placeholder="Burst time"
              value={burst}
              onChange={(e) => setBurst(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Process</button>
        </form>
      </div>

      <div className="container">
        <h2>Processes</h2>
        <table id="processTable">
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival</th>
              <th>Burst</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, index) => (
              <tr key={index}>
                <td>{p.pid}</td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <div id="btn">
          <button onClick={handleSimulateFCFS}>Simulate FCFS</button>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className="container">
            <h2>Result</h2>
            <table id="resultTable">
              <thead>
                <tr>
                  <th>PID</th>
                  <th>Arrival</th>
                  <th>Burst</th>
                  <th>Start</th>
                  <th>Finish</th>
                  <th>Waiting</th>
                  <th>Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p, index) => (
                  <tr key={index}>
                    <td>{p.pid}</td>
                    <td>{p.arrival}</td>
                    <td>{p.burst}</td>
                    <td>{p.start}</td>
                    <td>{p.finish}</td>
                    <td>{p.wt}</td>
                    <td>{p.tat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="container">
            <h2>Gantt Chart</h2>
            <div className="gantt" id="ganttChart">
              {ganttChart.map((p, index) => (
                <div
                  key={index}
                  className="process"
                  style={{ width: p.burst * 40 + "px" }}
                >
                  {p.pid}
                </div>
              ))}
            </div>
            {averages && (
              <h3 id="averages">
                Average Waiting Time: {averages.avgWT} | Average Turnaround
                Time: {averages.avgTAT}
              </h3>
            )}
          </div>
        </>
      )}
    </>
  );
}
export default App;
