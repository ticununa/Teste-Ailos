const { assert } = require('chai')
const chai = require('chai')
const rotaUsuarios = '/usuarios'

const faker = require('faker')
const { cadastrarCarrinho } = require('.')





describe('Validar GET no endpoint ' + rotaUsuarios, () => {
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

    
})