export interface IValidatedFieldConfig {
    trimOnSubmit?: boolean;
    required?: boolean;
}

export interface IValidatedField {
    value: string;
    hasError: boolean;
    isPristine: boolean;
    isDirty: boolean;
    isMaybeValid: boolean;
    isValid: boolean;
    firstErrorMessage: string;
    wasSubmitted: boolean;
    errors: IFieldValidator[];
    validators: IFieldValidator[];
    addValidators(configs: IValidatorConfig[]): void;
    handleChange(val: string): void;
    handleSubmit(): void;
}

export interface IValidatorConfig {
    id: string;
    defaultMessage: string;
    validateOnChange?: (val: string) => boolean | string;
    validateOnSubmit?: (val: string) => boolean | string;
}

export interface IFieldValidator {
    id: string;
    isMaybeValid: boolean;
    isValid: boolean;
    hasError: boolean;
    error: string;
    handleChange(val: string): void;
    handleSubmit(val: string): void;
}
