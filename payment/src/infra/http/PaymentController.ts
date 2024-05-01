// Interface Adapter

import ProcessPayment from "../../application/usecase/ProcessPayment";
import HttpServer from "./HttpServer";


export default class PaymentController {
  constructor(httpServer: HttpServer, processPayment: ProcessPayment) {
    httpServer.register('post', '/process_payment', async function (params: any, body: any) {
      const outputProcessPayment = await processPayment.execute(body);
      return outputProcessPayment;
    });
  }
}
