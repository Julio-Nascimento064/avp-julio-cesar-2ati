import * as usuariosModel from '../models/usuariosModel.js';
import becrypt from 'bcrypt';

export async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    const senhaHash = await becrypt.hash(senha, 10);

    const novoUsuario = await usuariosModel.criar({
        nome,
        email,
        senhaHash
});

res.status(201).json({
    message: "Usuário cadastrado com sucesso",
    novoUsuario
});
}

export async function login(req, res) {
    const { email, senha } = req.body;
    const usuario = await usuariosModel.buscaPorEmail(email);

    if(!usuario){
        return res.status(401).json({
            message: "Usuario ou senha inválidos"
        });


    }

    const senhaCorreta = await becrypt.compare(
        senha, 
        usuario.senhaHash
    );
    
    if(!senhaCorreta){
        return res.status(401).json({
            message: "Usuario ou senha inválidos"
        });
}

  res.json({
    message: "Login realizado com sucesso",
    usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senhaHash: usuario.senhaHash
    }
  });

}
