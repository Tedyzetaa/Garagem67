import http.server
import socketserver
import webbrowser
import os
import sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def run_server(port=8000):
    # Muda para o diretório onde o script está localizado
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"📍 Diretório atual: {os.getcwd()}")
    print(f"📁 Arquivos no diretório: {os.listdir('.')}")
    
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"🚀 Servidor da Garagem 67 rodando em http://localhost:{port}")
        print("📱 Acesse pelo navegador para testar o sistema")
        print("⏹️  Pressione Ctrl+C para parar o servidor\n")
        
        # Abre o navegador automaticamente
        try:
            webbrowser.open(f'http://localhost:{port}')
        except:
            print("⚠️  Não foi possível abrir o navegador automaticamente")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor parado pelo usuário")

if __name__ == "__main__":
    PORT = 8000
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("⚠️  Porta inválida. Usando porta padrão 8000")
    
    run_server(PORT)    