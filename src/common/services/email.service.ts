import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';
import { ForgetPasswordDTO } from 'src/modules/auth/dtos/forget-password.dto';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendPasswordReset(body: ForgetPasswordDTO) {
    if (!body.token) throw new BadRequestException();

    /* Test link */
    const link: string = `http://localhost:4200/reset-password?token=${body.token}&id=${body.tokenId}`;

    await this.transporter.sendMail({
      to: body.email,
      subject: 'Redefinir senha',
      html: `
        <p>Clique no link abaixo para redefinir o seu acesso na iStore:</p>
        <a href="${link}">Resetar senha</a>
        <p>Se por algum motivo você recebeu este email por engano, apenas ignore.</p>
        <p> -- iStore powered by Douglas C. -- </p>
        `,
    });
  }
}
