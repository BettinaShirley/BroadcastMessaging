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
    print("Backend started")

def run_frontend():
    subprocess.Popen(['npm', 'run', 'dev', '--', '--host'], cwd='frontend')
    print("Frontend started")

def main():
    print("Starting Whatsapp Broadcaster...")

    cleanup()

    # Start Frontend
    threading.Thread(target=run_frontend).start()
    time.sleep(3)

    # Start Backend
    run_backend()

if __name__ == "__main__":
    main()

