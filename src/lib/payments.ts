import { DocumentClient } from "./dynamodb";
import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const getPayment = async (
  paymentId: string
): Promise<Payment | null> => {
  const result = await DocumentClient.send(
    new GetCommand({
      TableName: "PaymentsTable",
      Key: { paymentId },
    })
  );

  return (result.Item as Payment) || null;
};

export const listPayments = async (): Promise<Payment[]> => {
  const result = await DocumentClient.send(
    new ScanCommand({
      TableName: "PaymentsTable",
    })
  );

  return (result.Items as Payment[]) || [];
};

export const listPaymentsByCurrency = async (
  currency?: CountryCurrencyCode
): Promise<Payment[]> => {
  const result = await DocumentClient.send(
    new ScanCommand({
      TableName: "PaymentsTable",
      FilterExpression: "currency = :currency",
      ExpressionAttributeValues: {
        ":currency": currency,
      },
    })
  );

  return (result.Items as Payment[]) || [];
};

export const createPayment = async (payment: Payment) => {
  await DocumentClient.send(
    new PutCommand({
      TableName: "PaymentsTable",
      Item: payment,
    })
  );
};

export const isValidCurrencyCode = (currencyCode: string) => {
  return Object.values(CountryCurrencyCode).includes(currencyCode);
};
// TODO: there's probably a library for this or you could just
// copy paste the whole currency code list, this is just a stub
export enum CountryCurrencyCode {
  "AUD",
  "SGD",
}

export type Payment = {
  paymentId: string;
  amount: number;
  currency: CountryCurrencyCode;
};
