import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getPayment } from "./lib/payments";
import { buildResponse } from "./lib/apigateway";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const paymentId = event.pathParameters?.id;
  if (!paymentId) {
    return buildResponse(400, { message: "No payment ID provided" });
  }

  const payment = await getPayment(paymentId);
  if (!payment) {
    return buildResponse(404, {
      message: `No payment found for payment ID ${paymentId}`,
    });
  }
  return buildResponse(200, payment);
};
