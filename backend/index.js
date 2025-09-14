const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.listen(PORT,()=> console.log(`Server is running on port : ${PORT}`));

app.post("/api/processes",(req,res)=>{
    let processes = req.body.processes;
    if (!Array.isArray(processes)) {
        return res.status(400).json({error:"Processes should be an array"});
    }

    for (let i = 0; i < processes.length; i++) {
        if (typeof processes[i].arrival_time!=='number'||typeof processes[i].burst_time!=='number') {
            return res.status(400).json({error:"Arrivals and burst times must be integers"});
        }
    }

    for(let i=0;i<processes.length;i++){
        processes[i].id="P"+(i+1);

    }

    processes.sort((a,b)=> a.arrival_time - b.arrival_time);

    let current_time = 0;
    let total_waiting_time = 0;
    let total_turnaround_time = 0;
    let gantt_chart = [];

    for(let i = 0;i<processes.length;i++){
        let process = processes[i];
        if (current_time<process.arrival_time) {
            current_time=process.arrival_time;
        }
        process.start_time = current_time;
        process.completion_time = process.start_time + process.burst_time;
        process.turnaround_time = process.completion_time - process.arrival_time;
        process.waiting_time = process.turnaround_time - process.burst_time;

        total_waiting_time += process.waiting_time;
        total_turnaround_time += process.turnaround_time;

        current_time = process.completion_time;
        
        gantt_chart.push({
            process_id: process.id,
            start: process.start_time,
            end: process.completion_time
        })

        
    }

    let average_waiting_time = total_waiting_time / processes.length;
    let average_turnaround_time = total_turnaround_time / processes.length;

    res.json({
    processes: processes,
    average_waiting_time: average_waiting_time,
    average_turnaround_time: average_turnaround_time,
    gantt_chart: gantt_chart
    });



})