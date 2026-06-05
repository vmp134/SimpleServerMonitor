// Function for data updates
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        document.getElementById('cpu-value').innerText = data.CPU + "%";
        document.getElementById('tmp-value').innerText = data.TMP + "°C";
        document.getElementById('mem-value').innerText = data.MEM + "%";
        document.getElementById('sto-value').innerText = data.STO + "%";
        document.getElementById('bst-value').innerText = data.BST + " MiB";
        document.getElementById('brv-value').innerText = data.BRV + " MiB";
        document.getElementById('upt-value').innerText = data.UPT + " Days";    
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
setInterval(fetchStats, 2000);