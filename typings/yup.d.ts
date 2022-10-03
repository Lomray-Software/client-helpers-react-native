/* eslint-disable @typescript-eslint/naming-convention */
import type { StringSchema as BaseStringSchema } from 'yup';

declare module 'yup' {
  interface StringSchema {
    stripEmptyString(): BaseStringSchema;
  }
}
