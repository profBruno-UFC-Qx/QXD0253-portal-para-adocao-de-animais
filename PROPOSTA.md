# :checkered_flag: Projeto Aumigo
Aplicação web que conecta tutores e responsáveis por cães e gatos ao petshop para **consultar serviços, ver horários e valores e agendar** banho, tosa e outros cuidados, e que oferece ao proprietário um **sistema completo de gestão da agenda e administração financeira**.


## :technologist: Membros da equipe
| Matrícula | Nome | Curso |
|---|---|---|
| 580224 | DIOGO ASSUNCAO DA SILVA | Ciência da Computação |
| 581924 | JOAO DAVID BRANDAO DE ARAUJO | Ciência da Computação |
| 579284 | JOAO EDUARDO RABELO DE MEDEIROS | Ciência da Computação |


## :bulb: Objetivo Geral
Desenvolver uma aplicação web que permita ao petshop expor seus serviços (com duração e valores por porte do animal), receber agendamentos online sem conflito de horários e controlar o financeiro do negócio, substituindo agendas de papel, planilhas e conversas soltas de WhatsApp.


## :dart: Objetivos Específicos
- Disponibilizar uma vitrine pública de serviços, com horários livres e valores transparentes para cães e gatos.
- Automatizar o agendamento, evitando conflitos de horário e respeitando a duração de cada serviço.
- Dar ao proprietário visão financeira clara: quanto entrou, quanto saiu e quanto cada serviço rende.
- Reduzir faltas e esquecimentos com confirmações e lembretes por e-mail.
- Manter o histórico de atendimentos de cada animal, facilitando a fidelização do cliente.


## :eyes: Público-Alvo
- **Proprietário do petshop**, que precisa organizar a agenda e as finanças do negócio.
- **Tutores e responsáveis por cães e gatos**, que querem agendar serviços de forma rápida, sabendo o valor e o horário antes de sair de casa.


## :star2: Impacto Esperado
Profissionalizar a gestão do petshop, reduzindo horários vagos, conflitos de agenda e faltas; dar ao proprietário controle financeiro que hoje costuma ser informal; e tornar a experiência de quem cuida de cães e gatos mais prática, com agendamento a qualquer hora e acompanhamento do histórico do animal.


## :people_holding_hands: Papéis ou tipos de usuário da aplicação
- **Visitante** (não autenticado): navega pelo catálogo de serviços, valores e horários disponíveis; pode se cadastrar.
- **Cliente** (autenticado): tutor ou responsável por cães e gatos; cadastra seus animais, agenda, remarca e cancela serviços, acompanha o histórico e avalia atendimentos.
- **Proprietário** (autenticado): administra o petshop (serviços, preços, agenda) e tem acesso exclusivo ao módulo financeiro.

> Cada papel possui permissões diferentes: o Cliente só enxerga os próprios animais e agendamentos, e somente o Proprietário acessa a agenda geral e o financeiro.


## :triangular_flag_on_post: Principais funcionalidades da aplicação

### Acessíveis a todos
- Página do petshop (endereço, horário de funcionamento, serviços e avaliações)
- Catálogo de serviços (banho, tosa, banho e tosa, hidratação, corte de unhas, etc.) com descrição, duração e **valor por porte** do animal
- Consulta de horários livres por serviço e data
- Cadastro, login, confirmação de e-mail e recuperação de senha

### Restritas a usuários logados

**Cliente**
- Cadastro e edição dos próprios animais (nome, espécie, raça, porte, tipo de pelagem, idade, observações como alergias, temperamento e cuidados especiais)
- Agendamento de serviço em horário livre, com duração e valor calculados automaticamente conforme o porte do animal
- Remarcação e cancelamento, respeitando uma antecedência mínima
- Acompanhamento do status do agendamento (pendente, confirmado, em atendimento, concluído, cancelado, falta)
- Histórico de atendimentos e gastos por animal
- Avaliação (nota e comentário) após atendimento concluído
- Lembretes e confirmações por e-mail

**Proprietário**
- *Tela principal (hub)*: agenda diária e semanal, com visão dos agendamentos dos próximos dias do mês e de quem está agendado (cliente, animal, serviço e horário)
- *Serviços e preços*: CRUD de serviços, com duração, valor por porte e ativação/desativação
- *Agenda geral*: criação de agendamentos manuais (cliente que ligou ou veio ao balcão), bloqueio de horários, remarcações, atualização de status e controle de faltas
- *Módulo financeiro*:
  - Registro de pagamentos por atendimento (dinheiro, PIX, cartão)
  - Registro de gastos gerais do petshop, como compra de produtos para tratamento animal, com descrição, valor, data e categoria
  - Fluxo de caixa diário e mensal (entradas x saídas) e fechamento de caixa
  - Painel (dashboard) com faturamento, lucro, serviços mais vendidos e taxa de faltas
  - Relatórios por período e por serviço
  - Metas mensais de faturamento e comparação com o realizado
  - Acompanhamento de valores a receber e atendimentos não pagos


## :spiral_calendar: Entidades ou tabelas do sistema
- **Usuario** — dados de autenticação, e-mail confirmado e papel (cliente ou proprietário)
- **Animal** — nome, espécie (cão ou gato), raça, porte, pelagem, idade e observações; pertence a um cliente (Usuario)
- **Servico** — nome, descrição, duração, valor por porte (pequeno, médio e grande) e status ativo/inativo
- **Agendamento** — relaciona Cliente, Animal e Servico; data/hora, status e valor cobrado
- **Pagamento** — receita vinculada a um Agendamento: forma de pagamento, valor, data e status
- **Despesa** — saída financeira com descrição, valor, data e categoria (ex.: produtos para tratamento, materiais)
- **Avaliacao** — nota e comentário do cliente sobre um Agendamento concluído