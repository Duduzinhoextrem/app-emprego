# 📝 Registro de Desenvolvimento

Este documento descreve o processo de desenvolvimento deste projeto, incluindo as decisões tomadas, desafios enfrentados e como utilizei ferramentas de IA durante o processo.

**Período de Desenvolvimento:**
- **Início**: 25 de outubro de 2025
- **Fim**: 04 de novembro de 2025
- **Documentação**: 03 a 04 de novembro de 2025 (foi a parte mais rápida do processo)

## 🗓️ Cronologia do Desenvolvimento

### Primeira Semana: Aprendizado e Mudança de Estratégia (25/10 - 31/11)

**Contexto importante:**
Antes de começar esse projeto, eu nunca tinha mexido com APIs. Isso foi um dos maiores desafios e me custou muito tempo na primeira semana. Também nunca tinha mexido com desenvolvimento Android/mobile antes - eram tecnologias completamente novas pra mim. Sempre fui mais focado em frontend, então entender o backend foi um aprendizado bem intenso.

**Início da semana:**
No começo, eu tentei seguir a abordagem tradicional de aprender pela teoria primeiro. Estudei bastante cursos na Udemy e vídeos no YouTube sobre Django REST Framework, React Native e Expo. Assisti várias horas de conteúdo, fiz anotações e tentei entender os conceitos.

**Problema identificado:**
Depois de alguns dias, percebi que só estudar teoria não estava sendo suficiente. Eu entendia os conceitos, mas quando ia colocar a mão no código, não sabia exatamente como estruturar tudo junto. Ficava meio perdido sobre como conectar as peças. O fato de nunca ter trabalhado com APIs complicava ainda mais, porque não tinha essa base de conhecimento.

**Mudança de abordagem (sábado e domingo):**
No final de semana da primeira semana, mudei completamente a estratégia. Ao invés de só assistir cursos, comecei a:
- Explorar repositórios no GitHub de projetos similares (to-do apps, Django REST API examples, React Native apps)
- Usar as IAs Manus AI e Cursor AI pra me ajudar a entender código real
- Estudar código de projetos que funcionavam, não só teoria

**O que funcionou:**
Ver código real me ajudou muito mais. Eu via como outros desenvolvedores estruturavam seus projetos, quais padrões usavam, e as IAs me explicavam o que cada parte fazia. Foi bem mais produtivo que só teoria.

### Segunda Semana: Desenvolvimento e Finalização (01/11 - 04/11)

**Começo da semana:**
Já com uma base melhor, comecei a desenvolver o projeto de verdade. Como tinha pesquisado bastante na comunidade (Stack Overflow, fóruns, GitHub), consegui avançar bem rápido. No inicio da segunda semana já estava quase finalizando tudo.

**Bugs que ficaram:**
Ainda faltavam alguns problemas visuais, principalmente um bug chato: quando eu colocava o modo escuro, o seletor de usuário (pra designar tarefas) continuava aparecendo branco/claro. Isso quebrava toda a experiência do modo escuro. Era bem visível e irritante.

**Problemas com Expo Go:**
O Expo Go deu bastante trabalho também. Teve vários erros de conexão, problemas com o QR Code, e algumas vezes o app simplesmente não carregava. Um problema específico que me irritou bastante: mesmo pegando o IP certo no terminal e configurando corretamente, não conectava no Expo. Fiquei quebrando a cabeça nisso por um tempo até conseguir resolver.

**Nota sobre iOS:**
Não consegui testar no iOS porque não tenho iPhone. Tudo foi testado e desenvolvido usando Android.

### Fase 2: Modelagem do Backend

**Modelos criados:**
- **User**: Estendi o modelo padrão do Django pra adicionar campos úteis (mas no final mantive simples e usei o padrão mesmo)
- **Task**: Modelo com título, descrição, status (pending/completed), criador e usuário designado
- **PasswordResetToken**: Modelo pra gerenciar recuperação de senha

**Decisões importantes:**
- Usei `assigned_to` como campo obrigatório porque faz sentido sempre ter alguém responsável pela tarefa
- Admin pode designar pra qualquer usuário, usuário normal só pode designar pra si mesmo (validado no serializer)
- Usei status simples (pending/completed) ao invés de um campo boolean porque é mais extensível

**Uso de IA:**
- Usei Manus AI e Cursor AI pra me ajudar a entender código de repositórios do GitHub
- Quando via algum padrão que não entendia, perguntava pras IAs explicarem
- Elas me ajudaram a entender melhor como estruturar a relação entre User e Task no Django

### Fase 3: API REST

**Endpoints criados:**
- Autenticação: register, login, profile, password reset
- Tarefas: CRUD completo + ações customizadas (complete/reopen)

**Desafios:**
- Implementar filtros por data foi mais complicado que pensei - tive que criar um filtro customizado usando `django-filter` e pesquisar bastante na documentação
- A renovação automática de tokens no frontend foi um desafio - precisei ajustar os interceptors do Axios várias vezes até funcionar direito
- Isolamento de dados: tive que cuidar pra usuários normais só verem suas tarefas, mas admin ver tudo - isso exigiu atenção nos serializers e views

**Uso de IA:**
- Consultei as IAs quando ficava travado em algum problema específico (como refresh token automático)
- Elas me ajudaram a entender exemplos de código que encontrava no GitHub

### Fase 4: Frontend Mobile

**Telas desenvolvidas:**
- Login e Registro (bem direto)
- Lista de tarefas com filtros
- Criar/Editar tarefa
- Recuperação de senha (duas telas: solicitar e redefinir)

**Decisões importantes:**
- Usei Context API do React pra gerenciar autenticação e tema (sem Redux porque era simples demais pra justificar)
- Implementei modo escuro porque achei que ia ficar legal e mostrava que pensei na UX
- Criei um modal customizado pro seletor de usuários porque o Picker nativo não respeitava o tema escuro no Android

**Desafios principais:**
- **O bug do modo escuro no seletor**: Esse foi o problema mais chato visualmente. No Android, o componente Picker nativo sempre aparecia branco mesmo quando o app estava no modo escuro. Isso quebrava completamente a experiência. Resolvi criando um modal customizado com FlatList que respeita o tema
- **Telas vermelhas (erros) quando mudava coisas visuais**: Tinha hora que eu mudava algo visual, como um botão ou a troca de usuários, e apareciam telas vermelhas com erros. Ficava bem irritado, mas mesmo assim continuei. Isso acontecia bastante, especialmente quando estava aprendendo React Native
- Gerenciar o estado de loading em várias telas foi trabalhoso, mas importante pra UX
- Validação de formulários: tentei fazer no frontend e backend pra ter certeza

**Uso de IA:**
- Usei bastante IA pra debugar erros de TypeScript que não estava entendendo
- Consultei as IAs quando estava criando o ThemeContext e tinha dúvidas sobre Context API
- Elas me ajudaram a entender melhor como formatar os interceptors do Axios quando estava complicado

### Fase 5: Melhorias e Ajustes

**O que melhorei:**
- Adicionei filtros por data na lista de tarefas
- Implementei modo escuro completo em todas as telas
- Melhorei tratamento de erros pra não logar erros esperados (tipo login errado)
- Adicionei feedback visual em todas as ações

**Uso de IA:**
- As IAs me ajudaram a revisar partes do código e sugerir melhorias de organização
- Consultei sobre boas práticas de tratamento de erros em React Native quando tinha dúvidas
- Elas me ajudaram a identificar alguns componentes que estavam renderizando demais

### Fase 6: Documentação e Testes (03/11 - 04/11)

**A parte mais rápida:**
A documentação foi a fase mais rápida de todo o projeto. Comecei no dia 03 de novembro e terminei no dia 04 de novembro. Como já tinha todo o código feito e entendia bem o que tinha desenvolvido, foi bem mais direto documentar tudo.

**Documentação:**
- Escrevi um README bem completo e detalhado, tentando pensar em quem vai rodar o projeto pela primeira vez
- Comentei o código nas partes que achei importantes, explicando o "porquê" além do "o quê"

**Testes:**
- Criei alguns testes básicos no backend (não fiz muitos porque o tempo foi limitado)
- Testei manualmente todas as funcionalidades no app

**Uso de IA na Documentação:**
- **Manus AI e Cursor AI me ajudaram muito na documentação e README**: Passei os dados reais do projeto pra elas e elas me ajudaram a organizar tudo de forma clara
- Eu revisava o que elas sugeriam, avaliando se estava correto e bem organizado
- Elas me ajudaram a estruturar melhor o README, deixando mais claro e objetivo
- Consultei exemplos de estrutura de README pra projetos similares, mas sempre revisando criticamente com as IAs

## 🤔 Decisões Importantes e Justificativas

### Por que Expo ao invés de React Native CLI?
Tempo e praticidade. Com Expo consigo testar direto no celular sem configurar ambiente complexo. Pra um teste técnico, isso foi essencial.

### Por que não usei Redux?
Pra esse projeto, Context API foi suficiente. Redux adicionaria complexidade desnecessária. Se fosse crescer muito, aí sim consideraria.

### Por que modais customizados ao invés de componentes nativos?
O Picker nativo do React Native não respeitava o tema escuro no Android. Criei modais customizados pra ter controle total do design.

### Por que SQLite e não PostgreSQL?
Pra desenvolvimento local, SQLite é suficiente. Em produção, claro que usaria PostgreSQL ou similar.

### Por que JWT e não sessões?
JWT é mais adequado pra APIs REST e mobile apps. Permite escalabilidade e não precisa manter estado no servidor.

## 🎯 Funcionalidades Extras Implementadas

Além dos requisitos obrigatórios, adicionei:

1. **Modo Escuro**: Implementação completa com persistência da preferência
2. **Filtros Avançados**: Filtro por data além do filtro por status
3. **Designação de Tarefas**: Admin pode designar tarefas para outros usuários
4. **Recuperação de Senha**: Sistema completo de reset via token
5. **Validações Robustas**: Validação tanto no frontend quanto no backend
6. **Tratamento de Erros**: Mensagens amigáveis e logs úteis pra debug
7. **Renovação Automática de Token**: Token expira mas renova automaticamente

## 🐛 Principais Desafios Enfrentados

1. **Conexão Mobile com Backend**: Foi complicado no começo entender que precisava usar `0.0.0.0` ao invés de `127.0.0.1` e configurar o IP corretamente. Perdi um tempo nisso.

2. **Picker no Modo Escuro**: O componente nativo não respeitava o tema. Resolvi criando modal customizado, o que acabou sendo até melhor.

3. **Renovação Automática de Token**: Fazer o interceptor do Axios renovar o token e refazer a requisição foi trabalhoso, mas ficou funcionando bem.

4. **Filtros por Data**: Implementar filtros customizados no Django REST Framework exigiu estudar a biblioteca django-filter melhor.

5. **Validações Consistentes**: Garantir que as validações no frontend e backend fossem consistentes levou alguns ajustes.

## 💡 Como Usei IA Durante o Desenvolvimento

### Por que usei IA:
Eu usei a IA como uma parceira, porque precisava. Como já mencionei, nunca havia mexido com essas tecnologias antes (APIS, desenvolvimento mobile, Django REST Framework, React). Eram todas novas pra mim. Além disso, sempre fui muito de frontend, então as IAs me ajudaram muito a entender melhor o backend - conceitos, estrutura, como conectar tudo.

### Ferramentas que usei:
- **Manus AI**: Me ajudou principalmente na segunda semana, quando já estava desenvolvendo. Usei muito pra entender código de repositórios do GitHub e pra ajudar na documentação
- **Cursor AI**: Usei bastante também, especialmente quando tinha erros ou não sabia como implementar algo específico
- **GitHub Copilot**: Usei esporadicamente pra sugestões de código enquanto digitava

### Quando usei:
- **Estudando código de outros projetos**: No fim de semana da primeira semana, usei as IAs pra me explicar código de repositórios do GitHub que eu não entendia completamente
- **Debugging**: Quando tinha erros que não entendia, principalmente de TypeScript ou configuração, perguntava pras IAs
- **Consultas de Boas Práticas**: Pra entender como implementar coisas que não tinha certeza (tipo Context API, interceptors)
- **Documentação**: **Manus AI e Cursor AI me ajudaram muito no README e documentação** - eu passava os dados reais do projeto e elas me ajudavam a organizar. Eu sempre revisava pra ver se estava correto e bem organizado
- **Revisão de Código**: Pedi pra IAs revisar e sugerir melhorias de organização

### Quando NÃO usei:
- **Lógica de Negócio**: As regras principais (isolamento de dados, permissões) foram pensadas e implementadas por mim
- **Decisões Arquiteturais**: Escolhas de tecnologia e estrutura do projeto foram minhas
- **Design da Interface**: Layout e UX foram pensados por mim

### Senso Crítico Aplicado:
Sempre revisei as sugestões das IAs. Não aceitava tudo cegamente. Algumas coisas que elas sugeriram não faziam sentido pro contexto do projeto ou adicionavam complexidade desnecessária. Por exemplo:
- Elas sugeriram usar Redux em alguns momentos, mas achei desnecessário pra esse projeto
- Algumas validações muito complexas que elas sugeriram eu simplifiquei
- Na documentação, eu sempre revisava o que elas escreviam, avaliando se estava correto e se fazia sentido com o que eu realmente tinha feito
- Muitas vezes eu tinha que corrigir ou ajustar o que elas geravam, porque não refletia exatamente o que eu tinha desenvolvido

## 📚 Recursos que Mais Usei

- **Documentação oficial do Django REST Framework**: Principalmente pra entender ViewSets e Serializers
- **Documentação do Expo**: Pra configurar e entender como funciona o desenvolvimento
- **Stack Overflow**: Pra resolver problemas específicos que apareciam
- **Comunidade React Native**: Pra entender padrões e boas práticas

## ✅ Checklist Final

- [x] Backend Django com DRF funcionando
- [x] Autenticação JWT completa
- [x] CRUD de tarefas completo
- [x] Isolamento de dados por usuário
- [x] Filtros por status e data
- [x] Frontend React Native funcional
- [x] Interface intuitiva e responsiva
- [x] Modo escuro implementado
- [x] Recuperação de senha
- [x] Tratamento de erros adequado
- [x] README completo e claro
- [x] Arquivo .env.example configurado
- [x] Scripts de população de dados
- [x] Logs úteis para debugging

## 🎓 O que Aprendi

### Sobre Aprendizado:
- **Teoria sozinha não é suficiente**: Estudar cursos e vídeos é importante, mas ver código real e praticar foi muito mais eficaz pra mim
- **Explorar código de outros projetos**: Ver como outros desenvolvedores resolveram problemas similares me ajudou muito mais que só teoria
- **Comunidade é essencial**: Stack Overflow, fóruns e GitHub foram fundamentais pra resolver problemas específicos

### Sobre Uso de IA:
- **IA como ferramenta de apoio, não substituto**: Manus AI e Cursor AI me ajudaram muito, mas sempre revisei criticamente o que elas sugeriam
- **Contexto é importante**: Tinha que passar informações corretas pras IAs e revisar se o resultado fazia sentido pro meu projeto
- **Documentação precisa de revisão**: Mesmo quando as IAs ajudavam na documentação, eu sempre revisava pra garantir que estava correto e refletia o que eu realmente tinha feito

### Sobre Desenvolvimento:
- **Começar simples funciona**: Não tentei fazer tudo perfeito de primeira, fui ajustando conforme precisava
- **Bugs visuais importam**: O bug do modo escuro no seletor me mostrou como pequenos detalhes podem quebrar a experiência do usuário
- **Ferramentas têm suas limitações**: Expo Go teve problemas, mas consegui resolver pesquisando na comunidade
- **Persistência vale a pena**: Trabalhei alguns dias umas 12 horas por dia, porque quando achava um erro e não conseguia resolver, dizia "amanhã eu continuo", mas sempre dava uns 30 minutos a 1 hora e eu já estava de novo quebrando a cabeça pra resolver o problema. Tenho um lema que fala "se existe eu consigo resolver de qualquer maneira" - pode parecer meio bobo ou engraçado, mas eu sempre resolvo meus problemas. E isso funcionou mesmo quando as telas vermelhas apareciam e eu ficava irritado - eu parava, respirava, e voltava a trabalhar até resolver.

### Tecnologias que Aprofundei:
- Django REST Framework, especialmente filtros customizados
- Context API e gerenciamento de estado em React Native
- Interceptors do Axios e renovação automática de tokens
- Temas dinâmicos em React Native
- Habilidades de documentação e organização de código

## 🚀 Próximos Passos (se fosse continuar o projeto)

- Adicionar testes automatizados mais completos (backend e frontend)
- Implementar notificações push quando tarefas são designadas
- Adicionar busca por texto nas tarefas
- Melhorar a UI com animações
- Adicionar categorias/tags nas tarefas
- Implementar upload de arquivos nas tarefas
- Adicionar data de vencimento e lembretes

---

**Nota Final**: Desenvolvi esse projeto começando com teoria (cursos Udemy e YouTube na primeira semana), mas mudando pra uma abordagem mais prática quando percebi que só teoria não era suficiente (explorar código de repositórios do GitHub + IAs). Usei Manus AI e Cursor AI como ferramentas de apoio, principalmente pra entender código de outros projetos, debugar problemas e ajudar na documentação. Sempre revisei criticamente tudo que elas sugeriam, garantindo que as decisões arquiteturais e implementações principais fossem minhas e fizessem sentido pro contexto do projeto. O processo foi bem mais produtivo quando combinei prática, código real e IA ao invés de só estudar teoria.

