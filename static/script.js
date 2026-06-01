// Function for data updates
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        document.getElementById('cpu-value').innerText = data.CPU + "%";
        document.getElementById('mem-value').innerText = data.MEM + "%";
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        document.getElementById('cpu-value').innerText = "Error";
    }
}

// Run the function when page loads
fetchStats();

// Run the function every 2 seconds
setInterval(fetchStats, 2000);