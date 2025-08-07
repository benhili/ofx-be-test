import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse } from "./lib/apigateway";
import {
  CountryCurrencyCode,
  isValidCurrencyCode,
  listPayments,
  listPaymentsByCurrency,
} from "./lib/payments";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const currency = event.queryStringParameters?.currency;
  if (currency && isValidCurrencyCode(currency)) {
    const payments = await listPaymentsByCurrency(
      currency as unknown as CountryCurrencyCode
    );
    return buildResponse(200, { data: payments });
  } else if (currency && !isValidCurrencyCode(currency)) {
    return buildResponse(422, {
      message: `Could not find currency code '${currency}'`,
    });
  } else {
    // return all payments unfiltered
    const payments = await listPayments();
    return buildResponse(200, { data: payments });
  }
};
