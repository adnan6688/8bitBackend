import crypto from "crypto";

export const paymentMarcentId = async () => {
 const merchantTxnId = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

  return merchantTxnId;
};
