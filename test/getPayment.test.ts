import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/getPayment";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("When the user requests the records for a specific payment", () => {
  it("Returns the payment matching their input parameter.", async () => {
    const paymentId = randomUUID();
    const mockPayment = {
      id: paymentId,
      currency: "AUD",
      amount: 2000,
    };
    const getPaymentMock = jest
      .spyOn(payments, "getPayment")
      .mockResolvedValueOnce(mockPayment);

    const result = await handler({
      pathParameters: {
        id: paymentId,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockPayment);

    expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
  });
  it("Informs the caller when a payment ID hasn't been provided", async () => {
    const result = await handler({
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: "No payment ID provided",
    });
  });
  it("Informs the caller when a payment wasn't found in dynamodb", async () => {
    const paymentId = randomUUID();
    const getPaymentMock = jest
      .spyOn(payments, "getPayment")
      .mockResolvedValueOnce(null);

    const result = await handler({
      pathParameters: {
        id: paymentId,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({
      message: `No payment found for payment ID ${paymentId}`,
    });

    expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
