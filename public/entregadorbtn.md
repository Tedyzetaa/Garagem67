# **📋 RESUMO \- COMO ALTERAR A URL DO BOTÃO "VIRE ENTREGADOR"**

## **🔧 LOCALIZAÇÃO DO CÓDIGO**

**Arquivo:** `public/index.html`  
**Seção:** Header (cabeçalho)

## **📍 ONDE ENCONTRAR**

html  
\<\!-- NO HEADER \- Linha \~85 \--\>  
\<div class="user-area"\>  
    \<\!-- Botão Vire Entregador \--\>  
    \<a href="https://wa.me/5567998668032" target="\_blank" class="btn-delivery"\>  
        \<span class="delivery-icon"\>🚚\</span\>  
        Vire Entregador  
    \</a\>  
    \<\!-- ... resto do código ... \--\>  
\</div\>

## **✏️ COMO ALTERAR A URL**

**Substitua APENAS esta parte:**

html  
href="https://wa.me/5567998668032"

**Por:**

html  
href="SUA\_NOVA\_URL\_AQUI"

### **🎯 Exemplos Práticos:**

html  
\<\!-- Para WhatsApp diferente \--\>  
href="https://wa.me/5567999999999"

\<\!-- Para formulário Google \--\>  
href="https://forms.gle/seu\_formulario"

\<\!-- Para site externo \--\>  
href="https://seusite.com/cadastro-entregador"

\<\!-- Para página interna \--\>  
href="/cadastro-entregador"

## **⚠️ IMPORTANTE**

1. **Mantenha** `target="_blank"` para abrir em nova aba  
2. **Mantenha** as classes CSS `btn-delivery`  
3. **Não altere** o ícone 🚚 nem o texto "Vire Entregador"

## **🛠 PARA ALTERAÇÕES FUTURAS**

* **Sempre faça backup** antes de modificar  
* **Teste em dispositivos móveis**  
* **Verifique se abre corretamente**

## **📁 ARQUIVOS ENVOLVIDOS**

* `public/index.html` (único arquivo a modificar)  
* `public/styles/main.css` (estilos do botão \- não modificar)

---

**💡 Dica:** Salve este resumo para consultas futuras\! O botão está totalmente funcional e responsivo.

