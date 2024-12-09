import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js';
import { unlink } from 'node:fs/promises';
import { esVendedor, formatearFecha } from '../helpers/index.js';

const admin = async (req, res) => {
    const { pagina: paginaActual } = req.query;
    const expresion = /^[0-9]$/;

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1');
    }

    try {
        const { id } = req.usuario;

        const limit = 10;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioID: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ],
            }),
            Propiedad.count({
                where: {
                    usuarioID: id
                }
            })
        ]);

        res.render('propiedades/admin', {
            pagina: 'Mis propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit,
        });

    } catch (error) {
        console.log(error);
    }
};

const crear = async (req, res) => {
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
};

const guardar = async (req, res) => {
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioID, categoria: categoriaID, tipo_establecimiento } = req.body;
    const { id: usuarioID } = req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento: estacionamiento || 0,
            wc,
            calle,
            lat,
            lng,
            precioID,
            categoriaID,
            usuarioID,
            tipo_establecimiento,
            imagen: ''
        });

        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
        console.log(error);
    }
};


const agregarImagen = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    if (req.usuario.id.toString() !== propiedad.usuarioID.toString()) {
        return res.redirect('/mis-propiedades');
    }

    return res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    });
};

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }
    if (req.usuario.id.toString() !== propiedad.usuarioID.toString()) {
        return res.redirect('/mis-propiedades');
    }

    try {
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        await propiedad.save();
        next();
    } catch (error) {
        console.log(error);
        res.redirect('/mis-propiedades');
    }
};

const editar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    if (propiedad.usuarioID.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    });
};

const guardarCambios = async (req, res) => {
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    if (propiedad.usuarioID.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioID, categoria: categoriaID, tipo_establecimiento } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento: estacionamiento || 0,
            wc,
            calle,
            lat,
            lng,
            precioID,
            categoriaID,
            tipo_establecimiento
        });

        await propiedad.save();

        res.redirect('/mis-propiedades');
    } catch (error) {
        console.log(error);
    }
};


const eliminar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    if (propiedad.usuarioID.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    await unlink(`public/uploads/${propiedad.imagen}`);
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    if (propiedad.usuarioID.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    propiedad.publicado = !propiedad.publicado;
    await propiedad.save();

    res.json({
        resultado: 'true'
    });
};

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });

    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioID)
    });
};

const enviarMensaje = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });

    if (!propiedad) {
        return res.redirect('/404');
    }

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioID),
            errores: resultado.array()
        });
    }

    const { mensaje } = req.body;
    const { id: propiedadID } = req.params;
    const { id: usuarioID } = req.usuario;

    await Mensaje.create({
        mensaje,
        propiedadID,
        usuarioID
    });

    res.redirect('/');
};

//Leer mensajes recibidos

const verMensajes = async (req, res) => {
    const { id } = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario' }
                ]
            },
        ],
    })

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Revisar quin visita la URL sea dueño de la propeidd
    if (propiedad.usuarioID.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    editar,
    agregarImagen,
    almacenarImagen,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
    cambiarEstado
}

