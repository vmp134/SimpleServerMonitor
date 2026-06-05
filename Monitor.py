import psutil
import time
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/stats')
def getUsage():
    # One-line getters, for formatting
    cpu = psutil.cpu_percent()
    mem = psutil.virtual_memory().percent
    upt = round((time.time() - psutil.boot_time())/(60*60*24), 2)
    sto = psutil.disk_usage('/').percent
    
    # Block to deal with network
    net = psutil.net_io_counters()
    brv = net.bytes_recv/125000
    bst = net.bytes_sent/125000

    # Block to deal with temperatures
    temps = psutil.sensors_temperatures()
    tmp = 0
    count = 0
    if 'coretemp' in temps:
        for core in temps['coretemp']:
            tmp += core.current
            count += 1
    tmp = round(tmp/count, 1)

    return jsonify({"CPU": cpu, "MEM": mem, "UPT": upt, "STO": sto, "BRV": brv, "BST": bst, "TMP": tmp})

if __name__ == '__main__':
    app.run()