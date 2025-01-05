# API com Mongo DB

## Como rodar
- Execute o comando `docker compose up` na pasta raíz do projeto para subir o banco de dados. (Você precisa ter o docker instalado)
- Execute `npm run dev` na pasta raiz do projeto para executar em ambiente de desenvolvimento.
- Execute `npm run build` para buildar o projeto e depois execute `node ./dist/server.js` para executar a API em ambiente de produção 

## Documentação
### `POST /users`
#### Body
|campo|tipo|obrigatório|
--|--|--
|name|string|sim|
|age|number|sim|

### `PUT /users/:id`
#### Body
|campo|tipo|obrigatório|
--|--|--
|name|string|não|
|age|number|não|

### `GET /users`
#### Query params
|param|tipo|explicação|
--|--|--
page|number| Página a ser exibida
perPage|number| Quantidade por página
query|Object| Filtro da query no estilo que o mongodb entende
fields|string| Projeção da query no estilo do mongodb, só que os campos devem ser separados por `,` em vez do espaço. Ex `name,-_id`

### `GET /users/:id`
#### Query params
|param|tipo|explicação|
--|--|--
fields|string| Funciona igual ao do `GET /users`

<hr/>

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ori1I0wD)
