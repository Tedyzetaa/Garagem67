# Garagem 67 - Bar e Conveniência

Sistema web completo para o bar "Garagem 67", incluindo cardápio interativo, carrinho de compras, sistema de pedidos, cadastro de clientes e histórico de pedidos.

## 📋 Histórico de Versões

### Versão 1.13.0 - Atual
**Data:** Março 2025  
**Mudanças Principais:**
✅ **Sistema de Endereço Inteligente** - Modal centralizado com verificação automática de dados  
✅ **Fluxo Otimizado de Checkout** - Verificação de dados antes de pedir endereço  
✅ **Integração Completa com Google** - Dados preenchidos automaticamente do login  
✅ **Persistência de Dados** - Informações salvas entre sessões  
✅ **Design Responsivo Aprimorado** - Modal centralizado e bem espaçado  
✅ **Centralização de Configurações** - Chaves e configurações centralizadas no app.py

**Novas Funcionalidades:**
🔍 **Verificação Inteligente** - Sistema verifica se usuário já tem dados completos antes de pedir  
📝 **Preenchimento Automático** - Dados do Google preenchem formulário automaticamente  
💾 **Persistência Local** - Dados salvos no localStorage para próximos pedidos  
🎯 **Fluxo Direto** - Se dados completos, vai direto para WhatsApp sem modal  
📱 **UX Otimizada** - Loading states, validação visual e feedback melhorado  
🔧 **Configuração Centralizada** - Todas as chaves e configurações no app.py para fácil manutenção

### Versão 1.12.0 - Versão Anterior
**Data:** Março 2025  
**Mudanças Principais:**
✅ Sistema de Login Redesenhado - Fluxo simplificado com botão único  
✅ Correção da API Key do Firebase - Resolvido erro de autenticação  
✅ Otimização do Modal de Login - Interface mais limpa e intuitiva  
✅ Melhoria na Experiência do Usuário - Fluxo mais direto para autenticação

**Novas Funcionalidades:**
🔐 Fluxo de login simplificado: Modal com botão principal "Fazer Login" que expande para opções  
🎨 Design aprimorado: Interface mais limpa com apenas um botão inicial  
🚀 Correção de autenticação: API Key do Firebase corrigida e funcionando  
⚡ Otimização de performance: Código JavaScript mais eficiente

### Versão 1.11.0 - Versão Anterior
**Data:** Março 2025  
**Mudanças Principais:**
✅ Implementação completa do backend para autenticação Google  
✅ Separação de arquivos (HTML, CSS, JS modularizado)  
✅ Botão "Fazer Pedido via WhatsApp" na seção de cadastro  
✅ Remoção do Streamlit para deploy no Vercel  
✅ Sistema de autenticação JWT  
✅ API REST completa  
✅ Melhoria na organização do código  
✅ Design responsivo aprimorado

**Novas Funcionalidades:**
🔐 Autenticação Google com backend próprio  
📱 Botão direto de pedido via WhatsApp  
🗂 Estrutura de arquivos organizada  
🚀 Pronto para deploy no Vercel  
📊 Sistema de histórico de pedidos  
💾 Persistência de dados local

### Versão 1.10.03 - Versão Anterior
**Data:** Março 2025  
**Mudanças:**
🔄 Correção de bugs no sistema de carrinho  
🔄 Melhoria na validação de formulários  
🔄 Otimização de performance do JavaScript  
🔄 Ajustes na responsividade mobile

### Versão 1.10.02 - Sistema de Cadastro e Histórico
**Data:** Março 2025  
**Mudanças:**
✅ Implementação do sistema completo de cadastro de clientes  
✅ Histórico de pedidos com status  
✅ Menu do usuário logado  
✅ Integração com localStorage  
✅ Formulário de dados de entrega  
✅ Seção "Meus Dados" e "Meus Pedidos"

**Funcionalidades:**
Cadastro de nome, telefone, endereço completo  
Cidade, estado, CEP e complemento  
Visualização de pedidos anteriores  
Status dos pedidos (pendente, confirmado, etc.)  
Dados persistentes entre sessões

### Versão 1.10.01 - Base do Sistema
**Data:** Março 2025  
**Mudanças:**
✅ Estrutura HTML básica do sistema  
✅ Sistema de cardápio com categorias  
✅ Carrinho de compras interativo  
✅ Design com paleta de cores escura e dourado  
✅ Layout responsivo para mobile e desktop  
✅ Integração inicial com Firebase  
✅ Sistema de autenticação simplificado

### Versão 1.10
**Data:** Março 2025  
**Mudanças Principais:**
✅ Redesign completo para estilo sofisticado de bar de drinks  
✅ Paleta de cores escura com destaque dourado (#d4af37)  
✅ Layout do header com nome no canto esquerdo (pronto para logo)  
✅ Imagens temáticas de alta qualidade  
✅ Efeitos visuais refinados (hover, sombras, transições)  
✅ Textos atualizados para linguagem mais premium  
✅ Manutenção de todas as funcionalidades do sistema de pedidos

### Versão 1.09.08 - Versão Anterior
**Data:** Março 2025  
**Mudanças:**
🔄 Otimização de performance do JavaScript  
🔄 Correção de bugs no sistema de carrinho  
🔄 Melhoria na responsividade para tablets

### Versão 1.09.07 - Sistema de Pedidos Aprimorado
**Data:** Fevereiro 2025  
**Mudanças:**
✅ Implementação de modal de checkout  
✅ Validação de formulário de pedido  
✅ Sistema de confirmação de pedidos  
✅ Melhoria na experiência do usuário no fluxo de compra

### Versão 1.09.06 - Carrinho Interativo
**Data:** Fevereiro 2025  
**Mudanças:**
✅ Sistema completo de carrinho de compras  
✅ Botões de adicionar/remover itens  
✅ Cálculo automático do total  
✅ Botão "Limpar Carrinho"  
✅ Validação de carrinho vazio

### Versão 1.09.05 - Navegação por Categorias
**Data:** Janeiro 2025  
**Mudanças:**
✅ Sistema de abas para categorias (Bebidas, Comidas, Drinks)  
✅ Transições suaves entre categorias  
✅ Design responsivo das abas  
✅ Estados ativos/inativos visuais

### Versão 1.09.04 - Controles de Quantidade
**Data:** Janeiro 2025  
**Mudanças:**
✅ Botões +/- para ajuste de quantidade  
✅ Limite mínimo (1) e máximo (10) por item  
✅ Design consistente com a identidade visual  
✅ Feedback visual nas interações

### Versão 1.09.03 - Estrutura de Cardápio
**Data:** Dezembro 2024  
**Mudanças:**
✅ Layout de cardápio com produtos organizados  
✅ Informações: nome, descrição, preço  
✅ Botões "Adicionar" funcionais  
✅ Design inicial do sistema de itens

### Versão 1.09.02 - Design Responsivo
**Data:** Dezembro 2024  
**Mudanças:**
✅ Adaptação para dispositivos móveis  
✅ Breakpoints para tablets e smartphones  
✅ Menu hamburger para mobile  
✅ Otimização de imagens e carregamento

### Versão 1.09.01 - Estrutura Base
**Data:** Novembro 2024  
**Mudanças:**
✅ Criação da estrutura HTML básica  
✅ Sistema de header com navegação  
✅ Seções: Hero, Menu, Sobre, Contato  
✅ Integração inicial do Firebase  
✅ Estilos CSS fundamentais

## 🚀 Como Usar

### 1. Execução Local
```bash
# Clonar o projeto
git clone <url-do-repositorio>
cd garagem67

# Instalar dependências do backend
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do Firebase

# Executar backend
npm start

# Abrir o frontend
# Abra o arquivo index.html no navegador ou use um servidor local
python -m http.server 8000
# Acesse: http://localhost:8000"# Garagem67" 
