#!/usr/bin/env python3
"""
ATS Resume Studio - Local Zero-Dependency Server
100% In-Browser & Private. No external APIs or network calls.
"""
import http.server
import socketserver
import socket
import os
import sys
import time
import threading
import subprocess

# 1. Base application directory strictly on the location of serve.py (never relies on cwd)
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def find_open_port(start_port=3000, max_attempts=20):
    """Finds an available local port on 127.0.0.1 without conflicts."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start_port

class ResumeRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.mjs': 'application/javascript',
        '.js': 'application/javascript',
        '.wasm': 'application/wasm',
        '.gz': 'application/gzip',
        '.webp': 'image/webp',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Clean route mapping for static export
        clean_path = self.path.split('?')[0].split('#')[0]
        if clean_path in ('', '/', '/app'):
            self.path = '/app/'
        elif clean_path == '/privacy':
            self.path = '/privacy/'
        elif clean_path == '/terms':
            self.path = '/terms/'
        return super().do_GET()

    def log_message(self, format, *args):
        # Keep terminal output clean
        pass

def wait_and_open_browser(url, port):
    """Verifies that the server is actively listening on 127.0.0.1 before opening browser."""
    connected = False
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.2):
                connected = True
                break
        except OSError:
            time.sleep(0.05)

    if connected:
        try:
            if sys.platform == 'darwin':
                subprocess.Popen(['open', url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            elif sys.platform.startswith('win'):
                os.startfile(url)
            else:
                subprocess.Popen(['xdg-open', url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

def run():
    # Ensure working directory matches script directory
    try:
        os.chdir(DIRECTORY)
    except Exception:
        pass

    port = find_open_port(3000)
    server_address = ('127.0.0.1', port)
    
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(server_address, ResumeRequestHandler) as httpd:
            url = f"http://127.0.0.1:{port}/app/"
            python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"

            print("============================================================")
            print("   ATS RESUME STUDIO — LOCAL SERVER RUNNING")
            print("============================================================")
            print(f"   Status:        Listening on 127.0.0.1:{port} (Active)")
            print(f"   Server URL:    {url}")
            print(f"   Engine:        Python {python_version}")
            print(f"   App Directory: {DIRECTORY}")
            print("------------------------------------------------------------")
            print("   Opening your web browser automatically...")
            print("   KEEP THIS TERMINAL WINDOW OPEN while using the app.")
            print("   Press Ctrl+C to shut down the server when finished.")
            print("============================================================")
            sys.stdout.flush()

            # Trigger browser opening strictly after listener is active
            browser_thread = threading.Thread(target=wait_and_open_browser, args=(url, port), daemon=True)
            browser_thread.start()

            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nATS Resume Studio server stopped. Have a wonderful day!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Local server error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    run()
