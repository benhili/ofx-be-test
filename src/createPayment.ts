import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, Payment } from "./lib/payments";
import { randomUUID } from "crypto";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const input = parseInput(event.body || "{}");
  if (!input?.amount || !input?.currency) {
    return buildResponse(400, { message: "Missing amount or currency" });
  }
  const payment: Payment = {
    id: randomUUID(),
    amount: input.amount,
    currency: input.currency,
  };
  await createPayment(payment);
  return buildResponse(201, { result: payment.id });
};
