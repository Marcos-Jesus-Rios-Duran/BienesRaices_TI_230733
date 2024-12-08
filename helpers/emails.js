import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  // Enviar el correo
  await transport.sendMail({
    from: 'BienesRaices.com <no-reply@bienesraices.com>',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
      <div style="font-family: 'Times New Roman', serif; color: #000000; background-color: #E5F2FF; padding: 20px; border-radius: 10px; border: 1px solid #6F9CEB; text-align: center;">
        <img src="cid:logo" alt="Logo" style="width: 30%; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
        <h1 style="color: #6F9CEB; text-align: center;">Bienvenido(a) a BienesRaices.com</h1>
        <p>Estimado(a) ${nombre},</p>
        <p>Es un placer darle la bienvenida a BienesRaices.com, su plataforma confiable para la gestión de propiedades inmobiliarias. En <strong>InmoClick</strong>, un click puede adquirir un inmueble.</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:</p>
        <p style="text-align: center;"><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}" style="color: #6F9CEB; text-decoration: none; font-weight: bold;">Confirmar cuenta</a></p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este correo electrónico.</p>
        <p>El CEO de la empresa, Marcos Jesús Ríos Durán, le da la más cordial bienvenida al sistema de bienes raíces. Estamos comprometidos a ofrecerle el mejor servicio.</p>
        <p>Además, le invitamos a explorar nuestras características exclusivas:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;"><strong>🔍 Búsqueda avanzada de propiedades:</strong> Encuentra propiedades que se ajusten a tus necesidades.</li>
          <li style="margin-bottom: 10px;"><strong>💼 Soporte personalizado:</strong> Nuestros expertos están aquí para ayudarte en cada paso del proceso.</li>
          <li style="margin-bottom: 10px;"><strong>📈 Estadísticas de mercado:</strong> Mantente informado con las últimas tendencias del mercado inmobiliario.</li>
        </ul>
        <p>¡Gracias por unirse a nosotros!</p>
        <img src="cid:firma" alt="Firma" style="width: 30%; height: auto; margin-top: 20px; display: block; margin-left: auto; margin-right: auto;">
      </div>
    `,
    attachments: [
      {
        filename: 'logo.jpg',
        path: 'public/imgpublic/logo.jpg',
        cid: 'logo'
      },
      {
        filename: 'firma.png',
        path: 'public/imgpublic/firma.png',
        cid: 'firma'
      }
    ]
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  // Enviar el email
  await transport.sendMail({
    from: 'BienesRaices.com <no-reply@bienesraices.com>',
    to: email,
    subject: 'Restablece tu contraseña en BienesRaices.com',
    text: 'Restablece tu contraseña en BienesRaices.com',
    html: `
      <div style="font-family: 'Times New Roman', serif; color: #000000; background-color: #E5F2FF; padding: 20px; border-radius: 10px; border: 1px solid #6F9CEB; text-align: center;">
        <img src="cid:logo" alt="Logo" style="width: 30%; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
        <h1 style="color: #6F9CEB; text-align: center;">Restablece tu contraseña en BienesRaices.com</h1>
        <p>Hola ${nombre},</p>
        <p>Has solicitado restablecer tu contraseña en BienesRaices.com. Sigue el siguiente enlace para generar una nueva contraseña:</p>
        <p style="text-align: center;"><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}" style="color: #6F9CEB; text-decoration: none; font-weight: bold;">Restablecer contraseña</a></p>
        <p>Si tú no solicitaste el cambio de contraseña, puedes ignorar este correo electrónico.</p>
        <p>El CEO de la empresa, Marcos Jesús Ríos Durán, le da la más cordial bienvenida al sistema de bienes raíces. Estamos comprometidos a ofrecerle el mejor servicio.</p>
        <img src="cid:firma" alt="Firma" style="width: 30%; height: auto; margin-top: 20px; display: block; margin-left: auto; margin-right: auto;">
      </div>
    `,
    attachments: [
      {
        filename: 'logo.jpg',
        path: 'public/imgpublic/logo.jpg',
        cid: 'logo'
      },
      {
        filename: 'firma.png',
        path: 'public/imgpublic/firma.png',
        cid: 'firma'
      }
    ]
  });
};

export { emailRegistro, emailOlvidePassword };
