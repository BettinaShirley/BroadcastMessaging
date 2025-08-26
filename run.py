import subprocess
import sys
import threading
import time
import socket

def cleanup():
    try:
        subprocess.run(["backend/./clearCache.sh"], check=True)
        print("Cache Clear executed successfully.")
    except subprocess.CalledProcessError as e:
        print("Error while running clearCache.sh")
        print(e)

def run_backend():
    subprocess.Popen(['node', 'whatsapp.js'], cwd='backend')
    print("WhatsApp backend started")

def run_server():
    subprocess.Popen(['node', 'server.js'], cwd='backend')
    print("Express server started")

def run_frontend():
    subprocess.Popen(['npm', 'run', 'dev', '--', '--host'], cwd='frontend')
    print("Frontend started")

def main():
    print("Starting Whatsapp Broadcaster...")

    cleanup()

    # Start Express server
    threading.Thread(target=run_server).start()
    time.sleep(2)

    # Start Frontend
    threading.Thread(target=run_frontend).start()
    time.sleep(3)

    # Remove the automatic start of WhatsApp backend
    # run_backend()

if __name__ == "__main__":
    main()

