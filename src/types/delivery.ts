export type DeliveryInfo = {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  buildingNumber: string;
  apartment?: string;
  landmark?: string;
  deliveryInstructions?: string;
};

export type DeliveryFieldErrors = Partial<Record<keyof DeliveryInfo, string>>;
