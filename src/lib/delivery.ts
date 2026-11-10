import type { DeliveryFieldErrors, DeliveryInfo } from "@/types/delivery";

const EGYPTIAN_MOBILE_REGEX = /^01[0125]\d{8}$/;

export function normalizeEgyptianPhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function validateDeliveryInfo(info: DeliveryInfo): DeliveryFieldErrors {
  const errors: DeliveryFieldErrors = {};

  if (!info.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  const normalizedPhone = normalizeEgyptianPhone(info.phone);
  if (!info.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!EGYPTIAN_MOBILE_REGEX.test(normalizedPhone)) {
    errors.phone = "Enter a valid Egyptian mobile number (e.g. 01012345678).";
  }

  if (!info.city.trim()) {
    errors.city = "City is required.";
  }

  if (!info.area.trim()) {
    errors.area = "Area / neighborhood is required.";
  }

  if (!info.street.trim()) {
    errors.street = "Street name is required.";
  }

  if (!info.buildingNumber.trim()) {
    errors.buildingNumber = "Building number is required.";
  }

  return errors;
}

export function hasDeliveryErrors(errors: DeliveryFieldErrors) {
  return Object.keys(errors).length > 0;
}
