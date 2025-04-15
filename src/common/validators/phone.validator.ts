import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsValidPhone implements ValidatorConstraintInterface {
  validate(phone: string) {
    return /^(\+\d{1,3}?)?\s*(\(?\d{2}\)?)?\s*(\d{4,5}-?\d{4})$/.test(phone);
  }

  defaultMessage() {
    return 'Telefone inválido (formato esperado: (XX) XXXX-XXXX)';
  }
}
