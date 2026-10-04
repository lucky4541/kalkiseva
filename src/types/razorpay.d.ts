export {};

declare global {
  interface RazorpayResponse {
    error: any;
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  interface RazorpayErrorResponse {
    error: {
      code: string;
      description: string;
      reason: string;
      source: string;
      step: string;
      metadata: {
        order_id: string;
        payment_id: string;
      };
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
    modal: {
      ondismiss: () => void;
    };
  }

  interface RazorpayInstance {
    open(): void;
    on(event: "payment.failed", handler: (response: RazorpayErrorResponse) => void): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
