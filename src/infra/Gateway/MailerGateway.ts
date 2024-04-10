// Driven/Port 
export interface MailerGateway {
  send(recipient: string, subject: string, content: string): Promise<void>;
}

// Driven/Adapter 
export class MailgerGatewayMemory implements MailerGateway {
  async send(recipient: string, subject: string, content: string): Promise<void> {
    console.log(recipient, subject, content);
  }
}
