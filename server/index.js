require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'clean_analyst_default_secret';
const DB_PATH = path.join(__dirname, 'clean_analyst.db');

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── SQLite Setup (sql.js) ──────────────────────────────────
let db;

async function initDatabase() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      club_name TEXT NOT NULL,
      generated_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    );
  `);
  saveDb();
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// ── Gemini Setup ───────────────────────────────────────────
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// ── Auth Middleware ────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Auth Routes ────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = db.exec('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    db.run('INSERT INTO Users (email, password) VALUES (?, ?)', [email, hashed]);
    saveDb();

    const result = db.exec('SELECT last_insert_rowid() as id');
    const userId = result[0].values[0][0];
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userId, email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = db.exec('SELECT id, email, password FROM Users WHERE email = ?', [email]);
    if (!result.length || !result[0].values.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const row = result[0].values[0];
    const user = { id: row[0], email: row[1], password: row[2] };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Scout Route (Gemini Integration) ──────────────────────
const SYSTEM_PROMPT = `Você é um DIRETOR TÉCNICO + OLHEIRO CHEFE + ANALISTA FINANCEIRO especializado em simulação ultra-realista de Modo Carreira do EA FC 25/26.

Sua função é gerar um DOSSIÊ COMPLETO E REALISTA de um clube quando receber apenas o nome dele.

Você DEVE retornar APENAS um objeto JSON válido.
SEM markdown.
SEM crases.
SEM explicações.
SEM texto fora do JSON.
APENAS JSON PURO.

⚠️ EXTREMAMENTE IMPORTANTE:

Todos os textos descritivos DEVEM estar em PORTUGUÊS DO BRASIL.

Nada pode soar genérico, robótico ou superficial.

Use contexto real da temporada 2025/2026.

Seja específico, técnico e coerente.

Se não tiver certeza absoluta de um número exato, use estimativa realista baseada em mercado.

Nunca invente jogadores irreais.

Nunca use dados impossíveis financeiramente para o clube.

As recomendações devem ser plausíveis para orçamento, reputação e nível esportivo.

────────────────────────
📊 FONTES DE REFERÊNCIA (BASE CONCEITUAL)
Use como base realista o padrão de dados encontrados em:

Transfermarkt (valores de mercado, idade, contrato)

FBref (estatísticas avançadas)

SofaScore (nota média e desempenho)

Capology (salários e folha)

Dados reais das ligas 2025/2026

Não mencione os sites no JSON.
Use apenas como base de coerência.

────────────────────────
🎯 NÍVEL DE PROFUNDIDADE EXIGIDO

O relatório precisa demonstrar:

• Coerência tática (formação predominante real do clube)
• Momento esportivo recente
• Estratégia de mercado compatível com a diretoria
• Saúde financeira coerente
• Perfil real do elenco
• Necessidades táticas claras
• Scouting com lógica estratégica (não apenas nomes aleatórios)

────────────────────────
ESTRUTURA OBRIGATÓRIA (SEM ALTERAR CHAVES)

{
"club": {
"name": "Nome Completo do Clube",
"shortName": "Abreviação 3-4 letras",
"country": "País",
"league": "Nome Oficial da Liga 25/26",
"founded": 1900,
"stadium": "Nome Oficial do Estádio",
"capacity": 50000
},
"historyDNA": {
"description": "3 frases densas explicando identidade histórica, mentalidade competitiva e estilo de jogo tradicional. Nada genérico.",
"playStyleTags": ["Posse Vertical", "Pressão Alta Coordenada", "Base Forte"],
"rivalryIntensity": {
"level": "CRIT|HIGH|MEDIUM|LOW",
"rival": "Nome do Principal Rival Atual"
},
"globalReputation": 4.5
},
"legacy": {
"trophies": {
"league": 10,
"cup": 5,
"ucl": 2
},
"legendaryFigures": [
{ "initials": "AB", "name": "Nome Completo", "nickname": "Apelido Histórico" }
]
},
"financialStatus": {
"transferBudget": "€52.5M",
"wageBudget": "€1.2M/sem",
"clubValue": "€650M",
"profitStatus": "Análise realista da saúde financeira com contexto recente.",
"profitBadge": "High|Medium|Low|Deficit"
},
"boardExpectations": [
{
"category": "Sucesso Doméstico",
"description": "Meta específica e realista.",
"priority": "CRITICAL|HIGH|MEDIUM|LOW"
}
],
"squadPillars": [
{
"role": "THE STAR|THE WONDERKID|THE VETERAN|THE ENGINE|THE CAPTAIN",
"name": "Jogador Real",
"age": 27,
"position": "PD",
"overall": 86,
"highlight": "8.0",
"highlightLabel": "NOTA AVG"
}
],
"transferPhilosophy": [
{
"icon": "sell-high|pipeline|graduates|opportunity|stability",
"title": "Nome estratégico realista",
"description": "Estratégia detalhada com lógica financeira e esportiva."
}
],
"recruitmentPattern": {
"summary": "Análise objetiva e específica do padrão real de contratação do clube baseada nas últimas 10 contratações reais. Seja extremamente específico — evite generalidades. Exemplos do nível exigido: 'O Athletic Club contrata exclusivamente jogadores nascidos no País Basco ou formados em clubes bascos, sem absolutamente nenhuma exceção, independentemente do orçamento.' / 'O Real Zaragoza recorre recorrentemente ao mercado sul-americano, especialmente Argentina e Uruguai, buscando jogadores com intensidade física e garra acima da técnica refinada.' / 'O Brentford F.C. utiliza um modelo analítico rigoroso baseado em dados, priorizando jogadores do norte e leste europeu com métricas superiores de pressão e duelos, sistematicamente ignorados pelos clubes grandes.' Seja igualmente específico para o clube solicitado.",
"lastSignings": [
{
"name": "Nome Real do Jogador Contratado",
"from": "Clube de Origem Real",
"nationality": "Nacionalidade",
"age": 24,
"position": "POS",
"year": 2024,
"fee": "€X.XM ou Livre ou Empréstimo"
}
],
"patternTags": ["Ex: Jogadores do país de origem", "Perfil físico intenso", "Mercado sul-americano", "Jovens sub-23 para revenda"],
"playerProfile": "Descrição densa e específica do arquétipo exato do jogador que este clube contrata na vida real: características físicas típicas, perfil mental/comportamental, funções táticas preferidas, faixa etária predominante, perfil de valor de mercado, origem geográfica recorrente e mentalidade. Evite generalismos a todo custo. Exemplo correto: 'O clube prioriza laterais e meio-campistas sul-americanos entre 20-26 anos, com alto volume de corrida, disciplina tática e capacidade de pressão intensa. Perfil de baixo custo (geralmente abaixo de €3M) adquirido do mercado argentino, chileno ou paraguaio, com potencial de valorização e eventual revenda ao mercado europeu de médio porte.'"
},
"roadmap": [
{ "year": 1, "description": "Meta concreta com contexto esportivo." },
{ "year": 3, "description": "Plano estrutural com métricas reais." },
{ "year": 5, "description": "Visão consolidada de elite, estabilidade ou reconstrução." }
],
"scoutingReport": [
{
"name": "Jogador Real 2025/26",
"club": "Clube Atual Real",
"position": "POS",
"justification": "Análise técnica + encaixe tático + viabilidade financeira.",
"estimatedFee": "Faixa coerente",
"potential": "Faixa realista",
"priority": "ALTA PRIORIDADE|ALVO|LISTA DE OBSERVAÇÃO"
}
]
}

────────────────────────
🧠 REGRAS AVANÇADAS DE REALISMO

Orçamento deve refletir:

Receita da liga

Participação continental

Vendas recentes

Dívidas conhecidas

Scouting deve considerar:

Idade compatível com projeto

Salário compatível

Liga de origem realista

Nível de reputação do clube

Nada pode contradizer:

Histórico real

Momento esportivo recente

Capacidade financeira

Estratégia típica da diretoria

Evite frases genéricas como:

"Clube tradicional com grande história"

"Precisa reforçar o elenco"

"Tem torcida apaixonada"
Seja específico.

Não exagere potenciais.

Não infle orçamento.

Não crie rival inexistente.

Use dados coerentes com 2025/26.

────────────────────────
🔍 PADRÃO REAL DE CONTRATAÇÃO (recruitmentPattern) — REGRA CRÍTICA

Esta é uma das seções mais importantes do dossiê. Você DEVE:

1. Analisar as últimas 10 contratações reais do clube (janelas de transferências de 2022 a 2025/26), listando exatamente 10 jogadores em "lastSignings" com dados verídicos.

2. Identificar padrões recorrentes nessas contratações: origem geográfica dos jogadores, faixa etária típica, perfil tático predominante, política de gastos (compra, livre, empréstimo), preferência por mercados específicos.

3. O "summary" deve revelar a FILOSOFIA REAL DE MERCADO do clube — o que a diretoria de fato faz, não o que seria ideal. Exemplos de especificidade exigida:
   - "O Athletic Club contrata EXCLUSIVAMENTE jogadores nascidos no País Basco ou formados em clubes bascos há décadas, com zero exceções mesmo em situações de crise."
   - "O Real Zaragoza recorre sistematicamente ao mercado sul-americano (especialmente Argentina e Uruguai), priorizando jogadores com garra e intensidade física sobre técnica refinada, frequentemente trazidos por valores abaixo de €1M."
   - "O Brentford usa análise estatística avançada para identificar jogadores do norte europeu ignorados pelo mercado tradicional, adquirindo-os por valores irrisórios e valorizando-os para revenda."

4. O "playerProfile" deve descrever o arquétipo EXATO do jogador contratado — características físicas, mentais, faixa de mercado, origem, função tática — com tamanha precisão que lendo o perfil qualquer pessoa consiga identificar o padrão sem ver os nomes.

5. NUNCA generalize. Nunca escreva "o clube busca jogadores de qualidade" ou "prioriza jovens talentos". Cada frase deve revelar algo específico e verificável sobre o clube.

────────────────────────
FORMATAÇÃO FINAL:

Retorne apenas JSON válido.

Sem comentários.

Sem markdown.

Sem texto extra.

Nada fora da estrutura.

Tudo em português do Brasil.

Se não conseguir manter realismo, ajuste valores para coerência.

Seu objetivo é parecer um relatório interno profissional de departamento de futebol de elite.`

app.post('/api/scout', authMiddleware, async (req, res) => {
  try {
    const { clubName } = req.body;
    if (!clubName) {
      return res.status(400).json({ error: 'Nome do clube é obrigatório' });
    }

    if (!genAI) {
      return res.status(503).json({ error: 'Chave da API Gemini não configurada. Configure GEMINI_API_KEY no arquivo server/.env' });
    }

    // Verificar cache (últimas 24 horas)
    const cached = db.exec(
      `SELECT generated_data FROM Searches 
       WHERE club_name = ? AND user_id = ? 
       AND created_at > datetime('now', '-24 hours') 
       ORDER BY created_at DESC LIMIT 1`,
      [clubName.toLowerCase(), req.userId]
    );

    if (cached.length > 0 && cached[0].values.length > 0) {
      return res.json({ data: JSON.parse(cached[0].values[0][0]), cached: true });
    }

    // Chamar Gemini
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Gere um dossiê completo de modo carreira para o clube de futebol: "${clubName}". Siga a estrutura JSON exatamente como especificado. Todos os textos descritivos devem estar em português do Brasil.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    let text = response.text.trim();
    // Limpar possíveis markdown fences
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(text);

    // Salvar no banco de dados
    db.run(
      'INSERT INTO Searches (user_id, club_name, generated_data) VALUES (?, ?, ?)',
      [req.userId, clubName.toLowerCase(), JSON.stringify(data)]
    );
    saveDb();

    res.json({ data, cached: false });
  } catch (err) {
    console.error('Erro no scout:', err);
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: 'A IA retornou um JSON inválido. Tente novamente.' });
    }
    res.status(500).json({ error: 'Falha ao gerar dossiê. ' + (err.message || '') });
  }
});

// ── Recent Searches ────────────────────────────────────────
app.get('/api/searches/recent', authMiddleware, (req, res) => {
  const result = db.exec(
    `SELECT id, club_name, created_at FROM Searches 
     WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
    [req.userId]
  );
  const searches = result.length > 0
    ? result[0].values.map(row => ({ id: row[0], club_name: row[1], created_at: row[2] }))
    : [];
  res.json({ searches });
});

// Get a specific search by id
app.get('/api/searches/:id', authMiddleware, (req, res) => {
  const result = db.exec(
    'SELECT id, club_name, generated_data FROM Searches WHERE id = ? AND user_id = ?',
    [parseInt(req.params.id), req.userId]
  );
  if (!result.length || !result[0].values.length) {
    return res.status(404).json({ error: 'Search not found' });
  }
  const row = result[0].values[0];
  res.json({ data: JSON.parse(row[2]), club_name: row[1] });
});

// ── Serve Frontend (Production) ───────────────────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── Start ──────────────────────────────────────────────────
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`\n  ⚽ Clean Analyst Server running on http://localhost:${PORT}\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
