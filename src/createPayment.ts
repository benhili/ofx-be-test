import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, isValidCurrencyCode, Payment } from "./lib/payments";
import { randomUUID } from "crypto";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { amount, currency } = parseInput(event.body || "{}");
  if (!amount || !currency) {
    return buildResponse(400, { message: "Missing amount or currency" });
  }

  if (!isValidCurrencyCode(currency)) {
    return buildResponse(422, {
      message: `Could not find currency code '${currency}'`,
    });
  }
  if (!Number.isInteger(amount)) {
    return buildResponse(422, {
      message: `Invalid amount recieved '${amount}' should be an integer`,
    });
  }

  const payment: Payment = {
    paymentId: randomUUID(),
    amount: amount,
    currency: currency,
  };
  await createPayment(payment);
  return buildResponse(201, { result: payment.paymentId });
};
