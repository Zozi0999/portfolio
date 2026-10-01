import http.server
import socketserver
import webbrowser
import os
import sys

# Pindah ke direktori tempat script ini berada
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORTS_TO_TRY = [5500, 3000, 8080, 5000, 8888, 9000]

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[PORTFOLIO-SERVER] {self.address_string()} - {format % args}")

def run_server():
    server = None
    selected_port = None

    for port in PORTS_TO_TRY:
        try:
            server = socketserver.TCPServer(("127.0.0.1", port), QuietHandler)
            selected_port = port
            break
        except (PermissionError, OSError):
            continue

    if not server:
        print("[ERROR] Tidak dapat menemukan port yang tersedia.")
        sys.exit(1)

    url = f"http://127.0.0.1:{selected_port}"
    print("=" * 60)
    print("🚀 PORTOFOLIO DIGITAL ZOZI ATUL AZIMI BERJALAN")
    print(f"🔗 URL: {url}")
    print("=" * 60)
    print("Tekan Ctrl + C di terminal ini untuk menghentikan server.\n")

    # Buka browser otomatis
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Server dihentikan.")
        server.server_close()

if __name__ == "__main__":
    run_server()
