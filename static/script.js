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
            if (cpuPercent >= 75) color = "#f87171";
            else if (cpuPercent >= 50) color = "#fbbf24";

            document.getElementById('cpu-value').innerText = cpuPercent.toFixed(1) + "%";
            document.getElementById('cpu-circle').style.setProperty('--progress', (cpuPercent * 3.6) + 'deg');
            document.getElementById('cpu-circle').style.setProperty('--circle-color', color);
        } else {
            document.getElementById('cpu-value').innerText = "N/A";
            document.getElementById('cpu-circle').style.setProperty('--progress', '0deg');
            document.getElementById('cpu-circle').style.setProperty('--circle-color', '#555');
        }

        // Temp
        const temperature = data.TMP ?? null;
        if (temperature !== null) {
            let color = "#4ade80";
            if (temperature >= 75) color = "#f87171";
            else if (temperature >= 50) color = "#fbbf24";

            document.getElementById('tmp-value').innerText = temperature.toFixed(1) + "°C";
            document.getElementById('tmp-circle').style.setProperty('--progress', (temperature * 3.6) + 'deg');
            document.getElementById('tmp-circle').style.setProperty('--circle-color', color);            
        } else {
            document.getElementById('tmp-value').innerText = "N/A";
            document.getElementById('tmp-circle').style.setProperty('--progress', '0deg');
            document.getElementById('tmp-circle').style.setProperty('--circle-color', '#555');            
        }

        // Memory
        const memPercent = data.MEM ?? null;
        if (memPercent !== null) {
            let color = "#4ade80";
            if (memPercent >= 75) color = "#f87171";
            else if (memPercent >= 50) color = "#fbbf24";

            document.getElementById('mem-value').innerText = memPercent.toFixed(1) + "%";
            document.getElementById('mem-circle').style.setProperty('--progress', (memPercent * 3.6) + 'deg');
            document.getElementById('mem-circle').style.setProperty('--circle-color', color);
        } else {
            document.getElementById('mem-value').innerText = "N/A";
            document.getElementById('mem-circle').style.setProperty('--progress', '0deg');
            document.getElementById('mem-circle').style.setProperty('--circle-color', '#555');
        }

        // Storage
        const stoPercent = data.STO ?? null;
        if (stoPercent !== null) {
            let color = "#4ade80";
            if (stoPercent >= 75) color = "#f87171";
            else if (stoPercent >= 50) color = "#fbbf24";

            document.getElementById('sto-value').innerText = stoPercent.toFixed(1) + "%";
            document.getElementById('sto-circle').style.setProperty('--progress', (stoPercent * 3.6) + 'deg');
            document.getElementById('sto-circle').style.setProperty('--circle-color', color);
        } else {
            document.getElementById('sto-value').innerText = "N/A";
            document.getElementById('sto-circle').style.setProperty('--progress', '0deg');
            document.getElementById('sto-circle').style.setProperty('--circle-color', "#555");
        }

        // Network
        if (data.BST !== null && data.BRV !== null) {
            if (isFirstRun) {
                // On the first load, just save the baselines and display "Loading..."
                prevBST = data.BST;
                prevBRV = data.BRV;
                isFirstRun = false;
                document.getElementById('bst-value').innerText = "...";
                document.getElementById('brv-value').innerText = "...";
            } else {
                // Calculate speed based on the difference from 2 seconds ago
                const bstPS = (data.BST - prevBST) / (time / 1000);
                const brvPS = (data.BRV - prevBRV) / (time / 1000);

                document.getElementById('bst-value').innerText = formatSpeed(bstPS);
                document.getElementById('brv-value').innerText = formatSpeed(brvPS);

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

// Helper function outside fetchStats
function formatSpeed(bytesPerSec) {
    const units = [" B/s", " KB/s", " MB/s", " GB/s"];
    let speed = Math.max(0, bytesPerSec); // Safety check for negative values
    let unitIndex = 0;

    while (speed >= 1024 && unitIndex < units.length - 1) {
        speed /= 1024;
        unitIndex++;
    }

    return speed.toFixed(1) + units[unitIndex];
}

// Run the function when page loads
fetchStats();

// Run the function every 2 seconds
setInterval(fetchStats, time);