import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export type FieldValidationError = {
  field: string;
  message: string;
};

// i did this file becasue i usualy do response normalizations for inputs fields for backend validation and i always show an error under the input for better UX
function collectValidationErrors(
  errors: ValidationError[],
  parent = '',
): FieldValidationError[] {
  const result: FieldValidationError[] = [];

  for (const error of errors) {
    const field = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      const errorsConstraints = Object.values(error.constraints);
      for (const message of errorsConstraints) {
        result.push({
          field,
          message,
        });
      }
    }

    if (error.children && error.children.length > 0) {
      const validationErrors = collectValidationErrors(error.children, field);
      result.push(...validationErrors);
    }
  }

  return result;
}

export function createValidationException(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException(collectValidationErrors(errors));
}
