// Predefined interval
const time = 2000;
let prevBST = 0;
let prevBRV = 0;
let isFirstRun = true;

// Function for data updates
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        // CPU
        const cpuPercent = data.CPU ?? null;
        if (cpuPercent !== null) {
            let color = "#4ade80";
            if (cpuPercent >= 75) color = "#f87171"
            else if (cpuPercent >= 50) color = "#fbbf24"

            document.getElementById('cpu-value').innerText = cpuPercent.toFixed(1) + "%";
            document.getElementById('cpu-circle').style.setProperty('--progress', (cpuPercent * 3.6) + 'deg');
            document.getElementById('cpu-circle').style.setProperty('--circle-color', color)
        } else {
            document.getElementById('cpu-value').innerText = "N/A";
            document.getElementById('cpu-circle').style.setProperty('--progress', '0deg');
            document.getElementById('cpu-circle').style.setProperty('--circle-color', '#555')
        }

        // Temp
        document.getElementById('tmp-value').innerText = data.TMP !== null ? data.TMP.toFixed(1) + "°C" : "N/A";

        // Memory
        const memPercent = data.MEM ?? null;
        if (memPercent !== null) {
            document.getElementById('mem-value').innerText = memPercent.toFixed(1) + "%";
            document.getElementById('mem-circle').style.setProperty('--progress', (memPercent * 3.6) + 'deg');
        } else {
            document.getElementById('mem-value').innerText = "N/A";
            document.getElementById('mem-circle').style.setProperty('--progress', '0deg');
        }

        // Storage
        const stoPercent = data.STO ?? null;
        if (stoPercent !== null) {
            document.getElementById('sto-value').innerText = stoPercent.toFixed(1) + "%";
            document.getElementById('sto-circle').style.setProperty('--progress', (stoPercent * 3.6) + 'deg');
        } else {
            document.getElementById('sto-value').innerText = "N/A";
            document.getElementById('sto-circle').style.setProperty('--progress', '0deg');
        }

        // Network
        if (data.BST !== null && data.BRV !== null) {
            if (isFirstRun) {
                // On the first load, just save the baselines and display "Loading..."
                prevBST = data.BST;
                prevBRV = data.BRV;
                isFirstRun = false;
                document.getElementById('bst-value').innerText = "Calculating...";
                document.getElementById('brv-value').innerText = "Calculating...";
            } else {
                // Calculate speed based on the difference from 2 seconds ago
                const bstPS = (data.BST - prevBST) / (time / 1000);
                const brvPS = (data.BRV - prevBRV) / (time / 1000);

                document.getElementById('bst-value').innerText = bstPS.toFixed(0) + " B/s";
                document.getElementById('brv-value').innerText = brvPS.toFixed(0) + " B/s";

                // Update baselines for the next tick
                prevBST = data.BST;
                prevBRV = data.BRV;
            }
        } else {
            document.getElementById('bst-value').innerText = "N/A";
            document.getElementById('brv-value').innerText = "N/A";
        }

        //Uptime
        document.getElementById('upt-value').innerText = data.UPT !== null ? data.UPT.toFixed(1) + " Days": "N/A";    
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        document.getElementById('cpu-value').innerText = "Error";
        document.getElementById('tmp-value').innerText = "Error";
        document.getElementById('mem-value').innerText = "Error";
        document.getElementById('sto-value').innerText = "Error";
        document.getElementById('bst-value').innerText = "Error";
        document.getElementById('brv-value').innerText = "Error";
        document.getElementById('upt-value').innerText = "Error";
    }
}

// Run the function when page loads
fetchStats();

// Run the function every 2 seconds
setInterval(fetchStats, time);