export interface MailerGateway {
  send(recipient: string, subject: string, content: string): Promise<void>;
}

export class MailgerGatewayMemory implements MailerGateway {
  async send(recipient: string, subject: string, content: string): Promise<void> {
    console.log(recipient, subject, content);
  }
}
