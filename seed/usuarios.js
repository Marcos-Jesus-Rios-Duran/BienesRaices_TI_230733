import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Esperanza',
        email: 'esperanza@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios 