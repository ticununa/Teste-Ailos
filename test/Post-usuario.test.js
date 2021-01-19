const { assert } = require('chai')
const chai = require('chai')
const rotaCarrinhos = '/carrinhos'
const rotaUsuarios = '/usuarios'
const faker = require('faker')
const rotaProdutos = '/produtos'
const rotaLogin = '/login'

function dadosProduto () {
    return {
      nome: faker.commerce.productName(),
      preco: faker.random.number(),
      descricao: faker.random.words(),
      quantidade: faker.random.number(),
      imagem: faker.random.words()
    }
  }

describe('Realizar testes no endpoint ' + rotaUsuarios, () => {
           
    it('Cadastro com sucesso de novo usuario ', async () => {
        
       const usuario = {
        nome: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: `${faker.random.boolean()}`
        }

            const {body: bodyUsuario } = await request.post(rotaUsuarios).send( usuario ).expect(201)

            chai.assert.deepEqual(bodyUsuario, { message: "Cadastro realizado com sucesso", _id: bodyUsuario._id})

            const { body } = await request.get(rotaUsuarios).query({ _id: bodyUsuario._id }).expect(200)
            
        chai.assert.deepEqual( body, {
            quantidade : 1,
            usuarios: [{
                nome: usuario.nome,
               email: usuario.email,
               password: usuario.password,
               administrador: usuario.administrador,
               _id: bodyUsuario._id
            }]
        })


    })


    it('Edição de cadastro', async () => {
            
        const usuario = {
            nome: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: `${faker.random.boolean()}`
        }

        const { body } = await request.post(rotaUsuarios).send(usuario).expect(201)
        const { body: bodyPut } = await request.put(`${rotaUsuarios}/${body._id}`).send(usuario).expect(200)
    
        chai.assert.deepEqual(bodyPut, { message: 'Registro alterado com sucesso' })
      })

    it('Validar usuário cadastrado com sucesso ', async () => {



        const usuario = {
            nome: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                administrador: `${faker.random.boolean()}`
        }
        const {body: bodyUsuario } = await request.post(rotaUsuarios).send( usuario ).expect(201)

        chai.assert.deepEqual(bodyUsuario, { message: "Cadastro realizado com sucesso", _id: bodyUsuario._id })
        

       const { body } = await request.get(rotaUsuarios).query({ _id: bodyUsuario._id }).expect(200)
       console.log(body)


       chai.assert.deepEqual(body, {
           quantidade : 1,
           usuarios: [{
               nome: usuario.nome,
               email: usuario.email,
               password: usuario.password,
               administrador: usuario.administrador,
               _id: bodyUsuario._id
           }]
       })

    })
    
    it('Registro excluído com sucesso', async () => {
        
        const { body } = await request.post(rotaUsuarios).send({
        
          nome: faker.name.firstName() + ' ' + faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          administrador: `${faker.random.boolean()}`
        }).expect(201)
    
        const { body: bodyDel } = await request.del(`${rotaUsuarios}/${body._id}`).expect(200)
        const { body: bodyGet } = await request.get(rotaUsuarios).query({ _id: body._id })
    
        chai.assert.deepEqual(bodyDel, { message: 'Registro excluído com sucesso' })
        chai.assert.deepEqual(bodyGet, { quantidade: 0, usuarios: [] })

      })
        
      it('Mensagem: Este email já está sendo usado ', async () => {
            
            const usuario = {
                nome: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                administrador: `${faker.random.boolean()}`
            }
            
            const { body } = await request.post(rotaUsuarios).send( usuario ).expect(201)
            
            chai.assert.deepEqual(body, { message: "Cadastro realizado com sucesso", _id: body._id })
            
            const { body: bodyUsuario } = await request.post(rotaUsuarios).send( usuario ).expect(400)

            chai.assert.deepEqual(bodyUsuario, {
                message: "Este email já está sendo usado"
            })


    })


    async function login (email, password) {
        const { body } = await request.post('/login').send({
          email,
          password
        }).expect(200)
        return body

    }

         
    it('Get Carrinhos <5 ', async () => {
            
            const usuario = {
            nome: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
            }
        
            const { body: bodyUsuario } = await request.post(rotaUsuarios).send( usuario ).expect(201)
        
            const { body: bodyLogin } = await request.post(rotaLogin).send({ email: usuario.email, password: usuario.password }).expect(200)

            console.log(bodyLogin)
            chai.assert.deepEqual(bodyLogin, {
              message: 'Login realizado com sucesso',
              authorization: 'Bearer ' + bodyLogin.authorization.split(' ')[1]})

            const produto1 = dadosProduto()
            const produto2 = dadosProduto()
            const produto3 = dadosProduto()
            const produto4 = dadosProduto()
            const produto5 = dadosProduto()

            
            
            const { body: body_Produto1 } = await request.post(rotaProdutos).send(produto1).set('authorization', bodyLogin.authorization).expect(201)
            const { body: body_Produto2 } = await request.post(rotaProdutos).send(produto2).set('authorization', bodyLogin.authorization).expect(201)
            const { body: body_Produto3 } = await request.post(rotaProdutos).send(produto3).set('authorization', bodyLogin.authorization).expect(201)
            const { body: body_Produto4 } = await request.post(rotaProdutos).send(produto4).set('authorization', bodyLogin.authorization).expect(201)
            const { body: body_Produto5 } = await request.post(rotaProdutos).send(produto5).set('authorization', bodyLogin.authorization).expect(201)
            
            
            const { body: bodyCarrinho } = await request.post(rotaCarrinhos).set('authorization', bodyLogin.authorization).send({
                produtos: [{
                  idProduto: body_Produto5._id,
                  quantidade: '10'
                }] }).expect(201)
                
                console.log(bodyCarrinho)
                chai.assert.deepEqual(bodyCarrinho,{
                  message: 'Cadastro realizado com sucesso' ,
                  _id: bodyCarrinho._id
              })
            
            

  })

           
       


})
