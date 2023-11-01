# Freetube

Este projeto tem como objetivo ser um aplicativo para download de musicas fácil e seguro. O aplicativo conta com a utilização de uma API como principal ferramenta de pesquisa e download dos videos fornecidos pelo YouTube. A API em questão é de minha autoria e pode ser encontrada em <a href="https://github.com/dudrt/Youtube_API">Youtube API</a>.

# 🔧 Este é um projeto que está em desenvolvimento. 
Atualmente estou trabalhando em suas funcionalidades e logo irei começar a trabalhar no desempenho e design do aplicativo.

# TO-DO List

- Notificação para mostrar que está tocando. ❌ (Notificação da biblioteca com problema)
- Fazer a parte do looping no menu da música. ✔
- Caso as músicas estejam sendo tocadas e uma delas for deletada, remover da fila. ✔
- Identificar se já existe uma música igual na playlist de baixados. ✔

# Principais Funcionalidades

O aplicativo possui diversas funcionalidades e opções, deixando assim, caso fosse tudo abordado, um documento muito longo.<br>Aqui será abordado as principais funções e na as demais funcionalidades serão abordadas em <a href="#opções-e-funcionalidades-secundárias">Opções e Funcionalidades secundárias</a>.<br>

- <a href='procurar-videos-do-youtube'>Procurar videos do Youtube</a>.
- <a href='baixar-musicas'>Baixar músicas</a>.
- <a href='criar-playlist'>Criar Playlists</a>.




# Procurar videos do Youtube
Este aplicativo tem como função principal buscar e fazer o download de videos do youtube. Para isso, você não precisa copiar o link do vídeo, basta pesquisar diretamente dentro do aplicativo e os 10 primeiros resultados serão mostrados na tela.<br>

<img src="github_img/img_principal.png">

<br>
# Baixar músicas
Após a procura do video ser feito, basta apenas clicar em cima da musica desejada e uma notificação na parte inferior da tela aparecerá.Esta notificação poderá ser de:
`Esta música já foi baixada!`
`Música Salva!`
Caso a mensagem seja:
`Erro, entre em contato com o suporte!`
É possivel que seja algum problema de conexão a internet.

# Navegação de Telas

Para navegar entre telas é utilizado o menu inferior no qual um botão vai para a tela principal e o outro para a tela de playlists.<br>
<img src="github_img/menu_navegar.png">


# Criar Playlists

Na tela ´Biblioteca´ pode-se criar uma nova playlist clicando no botão `Nova Playlist`.<br>
<img src="github_img/"><br>
Todas as músicas baixadas podem ser encontradas em `Musicas Baixadas`.<br>

# Dentro da Playlist

Ao entrar em uma playlist pode ser visto as músicas nela contidas e um botão em cima que irá rodar toda a playlist, ou então clicando em cima da musica, irá tocar a playlist partindo da música escolhida.

# Opções e Funcionalidades secundárias

