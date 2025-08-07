import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/listPayments";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CountryCurrencyCode, Payment } from "../src/lib/payments";

describe("When the user requests all records", () => {
  it("Returns all payments if no currency code is provided", async () => {
    const mockPayments: Payment[] = [
      {
        paymentId: "95691abe-ca4e-4d08-8b78-3f077c3d87f3",
        amount: 1234,
        currency: CountryCurrencyCode.AUD,
      },
      {
        paymentId: "1ef900c4-2f5e-47ef-bc24-6b8e14856578",
        amount: 10000,
        currency: CountryCurrencyCode.AUD,
      },
      {
        paymentId: "a731acd8-586e-4c31-a804-62ca0f40a805",
        amount: 222,
        currency: CountryCurrencyCode.SGD,
      },
    ];

    const getPaymentMock = jest
      .spyOn(payments, "listPayments")
      .mockResolvedValueOnce(Promise.resolve(mockPayments));

    const result = await handler({
      queryStringParameters: {},
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ data: mockPayments });

    expect(getPaymentMock).toHaveBeenCalled();
  });
  it("Returns filtered currency by currency code if provided", async () => {
    const mockAUDPayments: Payment[] = [
      {
        paymentId: "95691abe-ca4e-4d08-8b78-3f077c3d87f3",
        amount: 1234,
        currency: CountryCurrencyCode.AUD,
      },
      {
        paymentId: "1ef900c4-2f5e-47ef-bc24-6b8e14856578",
        amount: 10000,
        currency: CountryCurrencyCode.AUD,
      },
    ];

    const getPaymentMock = jest
      .spyOn(payments, "listPaymentsByCurrency")
      .mockResolvedValueOnce(Promise.resolve(mockAUDPayments));

    const result = await handler({
      queryStringParameters: { currency: "AUD" },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      data: mockAUDPayments,
    });
    expect(getPaymentMock).toHaveBeenCalledWith("AUD");
  });
  it("If a currency code is provided but it isn't valid returns a 422", async () => {
    const currency = "ZZZ";
    const result = await handler({
      queryStringParameters: {
        currency,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({
      message: `Could not find currency code '${currency}'`,
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
