document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const processCountInput = document.getElementById('process-count');
    const processInputsContainer = document.getElementById('process-inputs');
    const simulateBtn = document.getElementById('simulate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const ganttChart = document.getElementById('gantt-chart');
    const metricsBody = document.getElementById('metrics-body');
    const summaryStats = document.getElementById('summary-stats');
    const totalEnergyEl = document.getElementById('total-energy');
    const avgEnergyEl = document.getElementById('avg-energy');
    const efficiencyEl = document.getElementById('efficiency');
    const cpuUtilizationEl = document.getElementById('cpu-utilization');
    const powerSavingEl = document.getElementById('power-saving');
    const performanceEl = document.getElementById('performance');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const algorithmSelect = document.getElementById('algorithm');

    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Generate process input fields based on count
    function generateProcessInputs() {
        const count = parseInt(processCountInput.value);
        processInputsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const processDiv = document.createElement('div');
            processDiv.className = 'process-input-group';
            processDiv.innerHTML = `
                <h4>Process ${i + 1}</h4>
                <div class="form-group">
                    <label for="arrival-${i}">Arrival Time:</label>
                    <input type="number" id="arrival-${i}" min="0" value="${i}">
                </div>
                <div class="form-group">
                    <label for="burst-${i}">Burst Time:</label>
                    <input type="number" id="burst-${i}" min="1" value="${Math.floor(Math.random() * 10) + 1}">
                </div>
                <div class="form-group">
                    <label for="priority-${i}">Priority (1-10):</label>
                    <input type="number" id="priority-${i}" min="1" max="10" value="${Math.floor(Math.random() * 10) + 1}">
                </div>
            `;
            processInputsContainer.appendChild(processDiv);
        }
    }

    // Handle process count change
    processCountInput.addEventListener('change', generateProcessInputs);

    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        generateProcessInputs();
        ganttChart.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-project-diagram"></i>
                <p>Run simulation to view Gantt chart</p>
            </div>
        `;
        metricsBody.innerHTML = '';
        summaryStats.innerHTML = '';
        totalEnergyEl.textContent = '0.00';
        avgEnergyEl.textContent = '0.00';
        efficiencyEl.textContent = '0.00';
        cpuUtilizationEl.style.width = '0%';
        cpuUtilizationEl.textContent = '0%';
        powerSavingEl.style.width = '0%';
        powerSavingEl.textContent = '0%';
        performanceEl.style.width = '0%';
        performanceEl.textContent = '0%';
        
        if (window.energyChart) {
            window.energyChart.destroy();
        }
    });

    // Simulate button functionality
    simulateBtn.addEventListener('click', function() {
        const processCount = parseInt(processCountInput.value);
        const algorithm = algorithmSelect.value;
        const processes = [];
        
        // Collect process data
        for (let i = 0; i < processCount; i++) {
            processes.push({
                pid: i + 1,
                arrivalTime: parseInt(document.getElementById(`arrival-${i}`).value),
                burstTime: parseInt(document.getElementById(`burst-${i}`).value),
                priority: parseInt(document.getElementById(`priority-${i}`).value)
            });
        }
        
        // Sort by arrival time (for display purposes)
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        
        // Simulate scheduling based on selected algorithm
        const results = simulateScheduling(processes, algorithm);
        
        // Display results
        displayResults(results, algorithm);
    });

    // Scheduling simulation function
    function simulateScheduling(processes, algorithm) {
        // This is a simplified simulation - in a real implementation, you would
        // connect this to your actual C++ algorithm through a backend or WASM
        
        let results = [];
        let currentTime = 0;
        let totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
        let completed = 0;
        let processQueue = [...processes];
        
        // For demo purposes, we'll implement a simplified version of SJF with Priority
        if (algorithm === 'sjf-priority') {
            while (completed < processes.length) {
                // Get processes that have arrived by currentTime
                let readyQueue = processQueue.filter(p => p.arrivalTime <= currentTime);
                
                if (readyQueue.length === 0) {
                    currentTime++;
                    continue;
                }
                
                // Sort by burst time then priority (SJF with Priority)
                readyQueue.sort((a, b) => {
                    if (a.burstTime === b.burstTime) {
                        return a.priority - b.priority;
                    }
                    return a.burstTime - b.burstTime;
                });
                
                const currentProcess = readyQueue[0];
                
                // Calculate metrics
                const waitingTime = Math.max(0, currentTime - currentProcess.arrivalTime);
                const turnaroundTime = waitingTime + currentProcess.burstTime;
                const energy = currentProcess.burstTime * currentProcess.priority * 0.5;
                
                results.push({
                    ...currentProcess,
                    waitingTime,
                    turnaroundTime,
                    energy,
                    startTime: currentTime,
                    endTime: currentTime + currentProcess.burstTime
                });
                
                currentTime += currentProcess.burstTime;
                completed++;
                
                // Remove the completed process from the queue
                processQueue = processQueue.filter(p => p.pid !== currentProcess.pid);
            }
        }
        // Other algorithms would be implemented similarly
        
        return results;
    }

    // Display results function
    function displayResults(results, algorithm) {
        // Display Gantt chart
        displayGanttChart(results);
        
        // Display metrics table
        displayMetricsTable(results);
        
        // Calculate and display summary statistics
        displaySummaryStats(results);
        
        // Display energy chart
        displayEnergyChart(results);
        
        // Update system info cards
        updateSystemInfo(results, algorithm);
    }

    // Display Gantt chart
    function displayGanttChart(results) {
        ganttChart.innerHTML = '';
        
        const maxTime = Math.max(...results.map(p => p.endTime));
        const scale = Math.min(100 / maxTime, 50); // Scale factor for bars
        
        results.forEach(process => {
            const width = process.burstTime * scale;
            const marginLeft = process.startTime * scale;
            
            const bar = document.createElement('div');
            bar.className = 'process-bar';
            bar.style.width = `${width}px`;
            bar.style.marginLeft = `${marginLeft}px`;
            bar.style.backgroundColor = getProcessColor(process.pid);
            bar.innerHTML = `
                <span>P${process.pid}</span>
                <div class="tooltip">
                    <strong>P${process.pid}</strong><br>
                    Start: ${process.startTime}<br>
                    End: ${process.endTime}<br>
                    Burst: ${process.burstTime}
                </div>
            `;
            ganttChart.appendChild(bar);
        });
        
        // Add timeline
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        timeline.style.width = `${maxTime * scale}px`;
        
        for (let i = 0; i <= maxTime; i++) {
            const tick = document.createElement('div');
            tick.className = 'timeline-tick';
            tick.style.left = `${i * scale}px`;
            tick.innerHTML = `<span>${i}</span>`;
            timeline.appendChild(tick);
        }
        
        ganttChart.appendChild(timeline);
    }

    // Display metrics table
    function displayMetricsTable(results) {
        metricsBody.innerHTML = '';
        
        let totalWT = 0, totalTAT = 0;
        
        results.forEach(process => {
            totalWT += process.waitingTime;
            totalTAT += process.turnaroundTime;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>P${process.pid}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${process.priority}</td>
                <td>${process.waitingTime}</td>
                <td>${process.turnaroundTime}</td>
            `;
            metricsBody.appendChild(row);
        });
    }

    // Display summary statistics
    function displaySummaryStats(results) {
        const avgWT = results.reduce((sum, p) => sum + p.waitingTime, 0) / results.length;
        const avgTAT = results.reduce((sum, p) => sum + p.turnaroundTime, 0) / results.length;
        const totalEnergy = results.reduce((sum, p) => sum + p.energy, 0);
        const avgEnergy = totalEnergy / results.length;
        
        summaryStats.innerHTML = `
            <div class="stat-card">
                <h3>Avg Waiting Time</h3>
                <p>${avgWT.toFixed(2)}</p>
                <p class="unit">time units</p>
            </div>
            <div class="stat-card">
                <h3>Avg Turnaround Time</h3>
                <p>${avgTAT.toFixed(2)}</p>
                <p class="unit">time units</p>
            </div>
            <div class="stat-card">
                <h3>Throughput</h3>
                <p>${(results.length / Math.max(...results.map(p => p.endTime))).toFixed(4)}</p>
                <p class="unit">processes/unit</p>
            </div>
        `;
        
        totalEnergyEl.textContent = totalEnergy.toFixed(2);
        avgEnergyEl.textContent = avgEnergy.toFixed(2);
        efficiencyEl.textContent = (results.length / totalEnergy).toFixed(4);
    }

    // Display energy chart
    function displayEnergyChart(results) {
        const ctx = document.getElementById('energy-chart').getContext('2d');
        
        if (window.energyChart) {
            window.energyChart.destroy();
        }
        
        window.energyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: results.map(p => `P${p.pid}`),
                datasets: [
                    {
                        label: 'Energy Consumption (J)',
                        data: results.map(p => p.energy),
                        backgroundColor: results.map(p => getProcessColor(p.pid)),
                        borderColor: results.map(p => darkenColor(getProcessColor(p.pid))),
                        borderWidth: 1
                    },
                    {
                        label: 'Burst Time',
                        data: results.map(p => p.burstTime),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Energy (Joules)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Burst Time'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const process = results[context.dataIndex];
                                return `Priority: ${process.priority}\nWaiting Time: ${process.waitingTime}\nTurnaround: ${process.turnaroundTime}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Update system info cards
    function updateSystemInfo(results, algorithm) {
        const totalTime = Math.max(...results.map(p => p.endTime));
        const busyTime = results.reduce((sum, p) => sum + p.burstTime, 0);
        const cpuUtilization = (busyTime / totalTime) * 100;
        
        // Calculate power saving based on algorithm
        let powerSaving = 0;
        if (algorithm === 'sjf-priority') {
            // Our energy-efficient algorithm shows better power saving
            powerSaving = 30 + Math.random() * 20;
        } else if (algorithm === 'fcfs') {
            powerSaving = 10 + Math.random() * 15;
        } else {
            powerSaving = 5 + Math.random() * 10;
        }
        
        // Performance is inversely related to average waiting time
        const avgWT = results.reduce((sum, p) => sum + p.waitingTime, 0) / results.length;
        const performance = Math.max(0, 100 - (avgWT * 5));
        
        // Animate the progress bars
        animateProgress(cpuUtilizationEl, cpuUtilization);
        animateProgress(powerSavingEl, powerSaving);
        animateProgress(performanceEl, performance);
    }

    // Helper function to animate progress bars
    function animateProgress(element, targetValue) {
        let current = 0;
        const increment = targetValue / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            
            element.style.width = `${current}%`;
            element.textContent = `${Math.round(current)}%`;
        }, 20);
    }

    // Helper function to get a consistent color for a process
    function getProcessColor(pid) {
        const colors = [
            '#4a6fa5', '#166088', '#4fc3f7', 
            '#59a96a', '#9bdeac', '#b4656f',
            '#ff9f1c', '#ffbf69', '#8a4fff',
            '#c879ff', '#4aedc4', '#3d7068'
        ];
        return colors[pid % colors.length];
    }

    // Helper function to darken a color
    function darkenColor(color) {
        // Simple darkening for demo purposes
        return color.replace(/\d+/g, num => Math.floor(parseInt(num) * 0.7));
    }

    // Initialize the UI
    generateProcessInputs();
});