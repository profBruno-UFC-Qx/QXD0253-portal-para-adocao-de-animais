# :checkered_flag: AdoptME!

Aplicação web regional que reúne petshops em um só lugar para a adoção de animais.
Amplia o alcance dos petshops e conecta pessoas interessadas aos animais
disponíveis perto delas, tornando o processo mais simples, visível e organizado.

## :technologist: Membros da equipe

580224 DIOGO ASSUNCAO DA SILVA - Ciência da Computação
581924 JOAO DAVID BRANDAO DE ARAUJO - Ciência da Computação
579284 JOAO EDUARDO RABELO DE MEDEIROS - Ciência da Computação

## :handshake: Cliente e participação na concepção

**Cliente:** 
Petshops da região que promovem ou desejam promover a adoção de animais.
São eles os principais beneficiados pela aplicação, que lhes oferece uma vitrine digital 
e ferramentas para organizar facilmente o processo de adoção.

**Participação na concepção do sistema:**
- **Proprietários e funcionários de petshops:** são os principais interessados no sistema, 
contribuindo com sua experiência no dia a dia do atendimento e da adoção de animais. 
Suas necessidades orientam quais funcionalidades a aplicação deve oferecer, como o cadastro dos animais, 
o recebimento de solicitações e o contato com as pessoas interessadas.

- **Potenciais adotantes:** representam o público que utilizará a aplicação para buscar um novo animal. 
Suas expectativas em relação a um processo de adoção simples, claro e acessível orientam a organização da galeria, 
dos filtros de busca e do acompanhamento das solicitações.

## :bulb: Objetivo Geral

Desenvolver uma aplicação web na qual petshops possam se cadastrar e anunciar
animais para adoção, ampliando seu alcance e oferecendo uma vitrine digital e ferramentas
de gestão do processo e da equipe, e aos interessados um ambiente simples para encontrar animais
próximos de sua localidade, conhecê-los e solicitar a adoção.

A aplicação atua apenas como intermediadora: ela conecta os petshops aos adotantes
e organiza as solicitações, visitas e mensagens. Não há comercialização de animais na aplicação,
e a decisão final e a entrega do animal são combinadas diretamente entre o adotante e o petshop.

## :eyes: Público-Alvo

Petshops que desejam divulgar e gerenciar animais disponíveis para adoção
e pessoas da região interessadas em adotar um pet de forma responsável.

## :star2: Impacto Esperado

- Para os petshops: maior visibilidade dos animais, redução do trabalho manual no atendimento, organização das solicitações e visitas em um só lugar e divisão das tarefas entre os funcionários.
- Para os adotantes: acesso centralizado a diversos animais da sua região, com informações claras sobre saúde e temperamento, e acompanhamento transparente do processo, com avisos a cada mudança de status.
- Para a sociedade: aumento das adoções responsáveis e redução do abandono de animais.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

- **Visitante** (não autenticado): navega pela galeria, filtra animais e consulta detalhes e petshops parceiros.
- **Adotante** (autenticado): envia e acompanha solicitações de adoção, favorita animais, agenda visitas e avalia o atendimento.
- **Petshop (lojista)** (autenticado): cadastra seu estabelecimento e gerencia seus animais, solicitações, visitas, mensagens e funcionários.
- **Funcionário do petshop** (autenticado): acessa apenas as funções liberadas pelo petshop, como atender mensagens, gerenciar visitas ou cadastrar animais.
- **Administrador da aplicação** (autenticado): aprova o cadastro de petshops, modera conteúdo e acompanha métricas gerais.

## :triangular_flag_on_post: Principais funcionalidades da aplicação

### Acessíveis a todos
- Galeria de animais disponíveis para adoção
- Busca por localização (cidade e bairro), com ordenação por proximidade
- Filtros por espécie, porte, idade e petshop
- Ordenação dos resultados por proximidade e data de publicação
- Página de detalhes do animal (fotos, descrição, temperamento, situação de vacinação)
- Página de cada petshop parceiro (endereço, localização no mapa, contato, animais disponíveis)
- Página informativa sobre o processo de adoção responsável
- Recuperação de senha por e-mail

### Restritas a usuários logados

**Adotante**
- Cadastro com confirmação de e-mail
- Edição de perfil, incluindo a localidade de interesse
- Envio de formulário de interesse em adoção
- Acompanhamento do status das solicitações
- Lista de animais favoritos
- Agendamento de visita ao petshop para conhecer o animal
- Troca de mensagens com o petshop
- Avaliação do atendimento após a adoção
- Notificações por e-mail e na aplicação sobre mudanças de status

**Petshop**
- Cadastro do petshop na aplicação, informando a localização (sujeito à aprovação do administrador)
- Cadastro, edição e remoção de animais, com upload de fotos e registro de saúde (vacinas, vermifugação, castração)
- Gestão de solicitações (aprovar/recusar) com atualização automática do status do animal para "adotado"
- Gestão da agenda de visitas (confirmar, remarcar, cancelar)
- Caixa de mensagens com os interessados
- Gestão da equipe: cadastro de funcionários e definição do nível de permissão de cada um (por exemplo, gerente ou atendente)
- Notificações por e-mail e na aplicação sobre novas solicitações, visitas e mensagens
- Painel com indicadores (animais cadastrados, adoções realizadas, solicitações pendentes)

**Funcionário do petshop**
- Acesso às funções do petshop de acordo com o nível de permissão recebido (cadastro de animais, atendimento de solicitações, agenda de visitas ou mensagens)
- Recebimento de notificações relacionadas às funções que exerce

**Administrador da aplicação**
- Aprovação e bloqueio de petshops
- Moderação de animais, avaliações e mensagens denunciadas
- Relatórios gerais de uso e de adoções por região

## :spiral_calendar: Entidades ou tabelas do sistema

- **Usuario**: dados de autenticação, e-mail (com status de confirmação), localidade e papel (adotante, petshop, funcionário ou administrador)
- **Petshop**: dados do estabelecimento (nome, CNPJ, endereço, cidade, bairro, coordenadas, contato, status de aprovação), vinculado a um usuário responsável
- **FuncionarioPetshop**: relaciona Usuario e Petshop; inclui o nível de permissão e o status (ativo ou inativo)
- **Animal**: espécie, nome, idade, porte, descrição, temperamento, fotos, status (disponível ou adotado); pertence a um petshop
- **SolicitacaoAdocao**: relaciona Usuario e Animal; inclui data, respostas do formulário e status (pendente / aprovada / recusada)
- **AgendamentoVisita**: relaciona Usuario, Animal e Petshop; inclui data/hora e status
- **Favorito**: relaciona Usuario e Animal
- **Mensagem**: conversa entre adotante e petshop, ligada a um animal
- **Avaliacao**: nota e comentário do adotante sobre o petshop
- **Notificacao**: avisos enviados ao usuário sobre mudanças de status, por e-mail e na aplicação
- **TokenVerificacao**: código temporário usado na confirmação de e-mail e na recuperação de senha, com validade e uso único