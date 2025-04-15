import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class IsValidDocument implements ValidatorConstraintInterface {
  validate(document: string) {
    if (!document) return false;
    const cleanDoc = document.replace(/\D/g, '');
    return cleanDoc.length === 11 || cleanDoc.length === 14;
  }

  defaultMessage() {
    return 'Documento inválido (deve ser CPF ou CNPJ válido)';
  }
}
