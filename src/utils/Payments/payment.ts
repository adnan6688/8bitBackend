import crypto from "crypto";

export const paymentMarcentId = async () => {
  const merchantTxnId = `TXN-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

  return merchantTxnId;
};
