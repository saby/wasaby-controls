export type TValidatorFn = (value: unknown) => boolean | string | Promise<boolean | string>;

export interface IValidateOptions {
    validators?: TValidatorFn[];
}
