import { string, addMethod } from 'yup';

/**
 * ExtendYupValidation
 * @constructor
 */
function ExtendYupValidation(): void {
  addMethod(string, 'stripEmptyString', function () {
    return this.transform((value: string) => (value === '' ? null : value));
  });
}

export default ExtendYupValidation;
