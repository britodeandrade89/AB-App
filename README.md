# AB Fit - Sistema de Assessoria Esportiva

![AB Fit Logo](https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png)

Sistema completo de assessoria esportiva desenvolvido para personal trainer André Brito. Aplicativo PWA com funcionalidades avançadas de acompanhamento de treinos, avaliações físicas e atividades outdoor.

## 🚀 Funcionalidades

### ✅ Treinamento Completo
- **Treinos A/B** - Sistema periodizado com exercícios específicos
- **Controle de Carga** - Evolução progressiva com histórico
- **Calendarização** - Controle de frequência e presença
- **Periodização** - Ciclos de 13 semanas organizados

### 🏃‍♂️ Corrida Especializada
- **Treinos Personalizados** - Planos específicos por aluno
- **Métodos Variados** - Fartlek, Intervalado, Longão, Tiros, Ritmo
- **Controle de FC** - Frequência cardíaca alvo individualizada
- **Log de Performance** - Registro de distância, pace e tempo

### ⚖️ Controle Corporal
- **Acompanhamento de Peso** - Evolução com gráficos
- **Avaliação Física** - Sistema completo de antropometria
- **Bioimpedância** - Análise de composição corporal
- **Cálculos Automáticos** - IMC, % gordura, massa magra

### 🗺️ Atividades Outdoor
- **GPS Tracking** - Rastreamento em tempo real
- **4 Modalidades** - Caminhada, Corrida, Ciclismo, Remo
- **Métricas Avançadas** - Distância, velocidade, ritmo, elevação
- **Histórico de Rotas** - Mapas interativos com trajetos

### 📊 Sistema Inteligente
- **IA Integrada** - Dicas diárias com Gemini API
- **Offline First** - Funciona sem internet
- **Sincronização** - Dados em nuvem quando online
- **PWA** - Instalação como app nativo

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework**: Tailwind CSS
- **Ícones**: Feather Icons, Font Awesome
- **Mapas**: Leaflet.js
- **Gráficos**: Chart.js
- **Armazenamento**: LocalStorage API
- **GPS**: Geolocation API
- **PWA**: Service Workers, Web App Manifest

## 📦 Instalação e Uso

### Opção 1: Servidor Local Simples
```bash
# Clone o projeto
git clone [url-do-repositorio]
cd ab-fit-webapp

# Sirva com Python
python3 -m http.server 8000
# Acesse: http://localhost:8000
