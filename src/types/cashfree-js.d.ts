declare module "@cashfreepayments/cashfree-js" {
    export function load(options: {
      mode: "production" | "sandbox";
    }): Promise<{
      checkout: (params: {
        paymentSessionId: string;
        redirectTarget?: "popup" | "_self";
      }) => void;
    }>;
  }
  