import * as payments from "../src/lib/payments";
import { handler } from "../src/createPayment";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("When the user attempts to create a new payment", () => {
  it("Creates the payment and returns the newly created payments ID.", async () => {
    const body = {
      currency: "AUD",
      amount: 4444,
    };
    const createPaymentMock = jest
      .spyOn(payments, "createPayment")
      .mockImplementation(() => Promise.resolve());

    const result = await handler({
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body));

    expect(createPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ ...body })
    );
  });
  it("Fails with 400 if the body is missing the amount field", async () => {
    const bodyWithoutAmount = {
      currency: "AUD",
    };

    const result = await handler({
      body: JSON.stringify(bodyWithoutAmount),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: "Missing amount or currency",
    });
  });
  it("Fails with 400 if the body is missing the currency field", async () => {
    const bodyWithoutCurrency = {
      amount: 9999,
    };

    const result = await handler({
      body: JSON.stringify(bodyWithoutCurrency),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: "Missing amount or currency",
    });
  });
  it("Fails with 422 if the currency code is not found", async () => {
    const body = {
      currency: "ZZZ",
      amount: 9999,
    };

    const result = await handler({
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({
      message: "Could not find currency code 'ZZZ'",
    });
  });
  it("Fails with 422 if the amount given is not an integer", async () => {
    const body = {
      currency: "AUD",
      amount: 99.99,
    };

    const result = await handler({
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({
      message: "Invalid amount recieved '99.99' should be an integer",
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
