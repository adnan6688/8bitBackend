import axios from "axios";
import config from "../../config";
import { generateHash } from "../../utils/Payments/generateHashKey";
import { paymentMarcentId } from "../../utils/Payments/payment";

const getTokens = async (xHash: string) => {
  try {
    const payLoad = {
      userName: config.EPS_USER_NAME?.trim(),
      password: config.EPS_PASSWORD?.trim(),
    };

    const response = await axios.post(
      "https://sandboxpgapi.eps.com.bd/v1/Auth/GetToken",
      payLoad,
      {
        headers: {
          "Content-Type": "application/json",
          "x-hash": xHash,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("EPS Token Error:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        "Failed to retrieve EPS Token!",
    );
  }
};

const paymentInitialize = async (payloadData?: any) => {
  const xHashHeaderValue = generateHash(
    config.EPS_HASH_KEY as string, // Hash Key
    config.EPS_USER_NAME as string, // Data (userName)
  );

  const tokenData = await getTokens(xHashHeaderValue);
  const token = tokenData?.token;

  const merchantTxnId = await paymentMarcentId();

  try {
    const info = {
      storeId: config.EPS_Store_Id,
      merchantTransactionId: merchantTxnId,
      CustomerOrderId: String(payloadData?.bookingId),
      transactionTypeId: 10,
      financialEntityId: 0,
      transitionStatusId: 0,
      totalAmount: payloadData?.totalAmount || 99.99,
      ipAddress: "127.0.0.1",
      version: "1.0",

      // Callback URLs
      successUrl: `https://www.eps.com.bd/api/v1/payments/success`,
      failUrl: `'https://www.eps.com.bd/api/v1/payments/fail`,
      cancelUrl: `https://www.eps.com.bd/api/v1/payments/cancel`,

      // Customer Info
      customerName: payloadData?.customerName || "Adnan",
      customerEmail: payloadData?.customerEmail || "customer@gmail.com",
      customerAddress: "Dhaka, Bangladesh",
      customerAddress2: "Dhaka",
      customerCity: "Dhaka",
      customerState: "Dhaka",
      customerPostcode: "1200",
      customerCountry: "Bangladesh",
      customerPhone: payloadData?.customerPhone || "01700000000",

      // Shipping Details
      shipmentName: payloadData?.customerName || "Adnan",
      shipmentAddress: "Dhaka",
      shipmentAddress2: "Dhaka",
      shipmentCity: "Dhaka",
      shipmentState: "Dhaka",
      shipmentPostcode: "1200",
      shipmentCountry: "Bangladesh",

      // Custom identification (যেমন: GAME নাকি FOOD)
      valueA: payloadData?.paymentType || "GAME",
      valueB: payloadData?.userId || "user_id_here",
      valueC: "string",
      valueD: "string",

      shippingMethod: "N/A",
      noOfItem: "1",
      productName: payloadData?.productName || "Game Booking",
      productProfile: "General",
      productCategory: "Entertainment",

      ProductList: [
        {
          ProductName: payloadData?.productName || "Game Slot",
          NoOfItem: "1",
          ProductProfile: "General",
          ProductCategory: "Gaming",
          ProductPrice: String(payloadData?.totalAmount || 1),
        },
      ],
    };

    const initXHash = generateHash(
      config.EPS_HASH_KEY?.trim() as string,
      info.merchantTransactionId,
    );

    const response = await axios.post(
      "https://sandboxpgapi.eps.com.bd/v1/EPSEngine/InitializeEPS",
      info,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-hash": initXHash,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "EPS Payment Initialization Error:",
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message ||
        "Failed to initialize EPS Payment Gateway!",
    );
  }
};

export const paymentSerivce = {
  paymentInitialize,
};
