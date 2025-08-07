import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { CountryCurrencyCode, createPayment, Payment } from "./lib/payments";
import { randomUUID } from "crypto";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { amount, currency } = parseInput(event.body || "{}");
  if (!amount || !currency) {
    return buildResponse(400, { message: "Missing amount or currency" });
  }

  if (!Object.values(CountryCurrencyCode).includes(currency)) {
    return buildResponse(422, {
      message: `Unsupported currency code '${currency}'`,
    });
  }

  const payment: Payment = {
    id: randomUUID(),
    amount: amount,
    currency: currency,
  };
  await createPayment(payment);
  return buildResponse(201, { result: payment.id });
};
