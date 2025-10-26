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

def run_server():
    # PORT do Railway ou 8000 local
    PORT = int(os.environ.get('PORT', 8000))
    
    # Muda para o diretório onde o script está localizado
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"📍 Diretório atual: {os.getcwd()}")
    print(f"📁 Arquivos no diretório: {os.listdir('.')}")
    print(f"🚀 Servidor da Garagem 67 rodando na porta {PORT}")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🌐 Acesse: http://localhost:{PORT}")
        print("⏹️  Pressione Ctrl+C para parar o servidor\n")
        
        # Só abre navegador localmente
        if os.environ.get('RAILWAY_ENV') is None:
            try:
                webbrowser.open(f'http://localhost:{PORT}')
            except:
                print("⚠️  Não foi possível abrir o navegador automaticamente")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor parado pelo usuário")

if __name__ == "__main__":
    run_server()