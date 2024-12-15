import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import usuariooRoutes from './routes/usuariooRoutes.js';
import db from './config/db.js';
import identificarUsuario from './middleware/identificarUsuario.js';
import session from 'express-session';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

try {
    await db.authenticate();
    await db.sync();
    console.log('Conexión a la BD exitosa!');
} catch (error) {
    console.error('Error al conectar a la BD:', error);
}

app.use(identificarUsuario);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

app.use('/', appRoutes);
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);
app.use('/usuario', usuariooRoutes);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [result] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.usuarioId = user.id;
                console.log('usuarioId guardado en la sesión:', req.session.usuarioId);
                res.redirect('/usuario');
            } else {
                res.status(401).send('Credenciales incorrectas');
            }
        } else {
            res.status(401).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error('Error al intentar iniciar sesión:', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/usuario', async (req, res) => {
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) {
        return res.status(400).send('Usuario no autenticado');
    }

    console.log('ID de usuario en sesión:', usuarioId);

    try {
        const [result] = await db.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);

        console.log('Resultado de la consulta:', result);

        if (result.length > 0) {
            const usuario = result[0];
            res.render('perfil', { usuario });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        res.status(500).send('Error al obtener datos');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});
