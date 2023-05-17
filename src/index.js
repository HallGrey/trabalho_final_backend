const express = require('express')

//import express from 'express';

const app = express();
app.use(express.json());

app.listen(8080, () => console.log("Servidor iniciado"));

const pessoas = []
const recadinhos = []

app.get('/', (request, response) => {

    //return response.json('OK');
    return response.status(200).send('<h1>🚀X4BL4U🚀</h1><p>Se voce não X4BL0U não des-X4BL9 o meu X4BL4UM9NT0 ! </p>');
});

app.get('/listaRecados/:id', (request, response) => {

        const id = parseInt(request.params.id)

        if (isNaN(id) || id <= 0) {
          return response.status(400).send('Informe um id válido');
        }
        response.status(200).json(recadinhos);
});

app.put('/recados/update/:id', (request, response) => {
    const idAtualiza = request.params.id;
    const atualizaRecado = request.body

    const recadoNovo = recadinhos.findIndex(recado => recado.id == idAtualiza)
    if(recadoNovo < 0){
        return response.status(400).json('Recado não encontrado.')
    }else{
        recadinhos.titulo = atualizaRecado.titulo
        recadinhos.descricao = atualizaRecado.descricao
    }
    console.log(recadinhos)
    return response.json('Recado alterado com sucesso.')
});

app.delete('/recados/delete/:id', (request, response) => {
    const idDelete = request.params.id;

    const recadoExiste = recadinhos.findIndex(recado => recado.id == idDelete)

    if(recadoExiste < 0){
        return response.status(400).json('Recado não encontrado.')
    }

    recadinhos.splice(recadoExiste, 1)

    console.log(recadinhos)

    return response.json('Recado deletado.')
});

app.post('/recados',(request, response) => {
    const dados = request.body

    const user = pessoas.find(user => user.logado === true)

    if(!user){
        return response.status(400).json({
            sucesso: false,
            mensagem: "Precisa estar logado!",
            data:{}
        })
    }

    const recado = {
        id:new Date().getTime(),
        titulo: dados.titulo,
        descricao: dados.descricao,
        autor: user
    }

    recadinhos.push(recado)
    console.log(recadinhos)

    return response.json({
        sucesso: true,
        mensagem: "Recado inserido",
        data:recado
    })

})

app.post('/login',(request, response) => {
    const data = request.body

    const usuario = pessoas.some((user) => user.email === data.email)
    const senha = pessoas.some((user) => user.senha === data.senha)

    if(!usuario || !senha){
        return response.status(400).json({
            sucesso: false,
            mensagem: 'Email ou senha incorreto.',
            dado: {}
        })
    }
    pessoas.forEach(user => user.logado = false)

    const user = pessoas.find((user) => user.email === data.email)

    user.logado = true

    return response.status(201).json({
        sucesso: true,
        mensagem: 'Logado com sucesso.',
        dado: {}
    })
}) 

app.post('/create', (request,responde) => {

    const dados = request.body

    const novoUsuario = {
        id:new Date().getTime(),
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        logado:false
    }

    if(!dados.nome){
        return responde.status(400).json("O campo nome é obrigatório!")
    }
    if (!dados.email){
        return responde.status(400).json("O campo E-mail é obrigatório!")
    }
    if (!dados.senha){
        return responde.status(400).json("O campo senha é obrigatório!")
    }
    if(dados.senha.length < 6){
        return responde.status(400).json("A senha é muito curta.")
    }

    if (!dados.email || !dados.email.includes('@') || !dados.email.includes('.com')){
        return responde.status(400).json({
            sucesso: false,
            dados: null,
            mensagem: 'É obrigatório informar um e-mail válido para cadastro.'
        })
    }

    if (pessoas.some((users) => users.email === dados.email)){
        return responde.status(400).json({
            sucesso: false,
            mensagem: 'Usuario já cadastrado.'
        })
    }


    pessoas.push(novoUsuario)
    console.log(pessoas)
    return responde.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso.',
        dado: novoUsuario
    })
})

