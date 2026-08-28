import psutil
import time
from flask import Flask, render_template, jsonify
from collections import deque

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/stats')
def getUsage():
    # CPU Info
    try:
        cpu = psutil.cpu_percent()
    except Exception:
        cpu = None

    # Memory Info
    try:
        mem = psutil.virtual_memory().percent
    except Exception:
        mem = None

    # Uptime Info
    try:
        upt = round((time.time() - psutil.boot_time())/(60*60*24), 2)
    except Exception: 
        upt = None

    # Storage Info
    try:
        sto = psutil.disk_usage('/').percent
    except Exception:
        sto = None
    
    # Network Info
    try:
        net = psutil.net_io_counters()
        brv = net.bytes_recv
        bst = net.bytes_sent
    except Exception:
        brv = None
        bst = None

    # Temperature Info
    try:
        temps = psutil.sensors_temperatures()
        tmp = 0
        count = 0
        if 'coretemp' in temps:
            for core in temps['coretemp']:
                tmp += core.current
                count += 1
        tmp = round(tmp/count, 1)
    except Exception:
        tmp = None

    return jsonify({"CPU": cpu, "MEM": mem, "UPT": upt, "STO": sto, "BRV": brv, "BST": bst, "TMP": tmp})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)