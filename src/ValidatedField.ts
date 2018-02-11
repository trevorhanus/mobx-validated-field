import { action, computed, observable, ObservableMap } from 'mobx';
import { IValidatedField, IFieldValidator, IValidatorConfig, IValidatedFieldConfig } from './interfaces';
import { FieldValidator } from './FieldValidator';
import { isOr } from './utils';

export class ValidatedField implements IValidatedField {
    @observable private _isDirty: boolean;
    @observable private _value: string;
    @observable private _wasSubmitted: boolean;
    @observable private _errorMessage: string;
    private _validators: ObservableMap<IFieldValidator>;
    private _trimOnSubmit: boolean;

    constructor(config: IValidatedFieldConfig = {}) {
        this._isDirty = false;
        this._validators = observable.map<IFieldValidator>();
        this._value = '';
        this._wasSubmitted = false;
        this._errorMessage = null;
        this._trimOnSubmit = isOr(config.trimOnSubmit, false);
    }

    @computed
    get value(): string {
        return this._value;
    }

    @computed
    get hasError(): boolean {
        return this._errorMessage != null || this.validators.some(validator => validator.hasError);
    }

    @computed
    get isPristine(): boolean {
        return !this._isDirty;
    }

    @computed
    get isDirty(): boolean {
        return this._isDirty;
    }

    @computed
    get isMaybeValid(): boolean {
        return this._validators.values().every(validator => {
            return validator.isMaybeValid;
        });
    }

    @computed
    get isValid(): boolean {
        const allValidatorsAreValid = this._validators.values().every(validator => {
            return validator.isValid;
        });
        return allValidatorsAreValid && this.wasSubmitted;
    }

    @computed
    get wasSubmitted(): boolean {
        return this._wasSubmitted;
    }

    @computed
    get errors(): IFieldValidator[] {
        return this.validators.filter(validator => validator.hasError);
    }

    @computed
    get firstErrorMessage(): string {
        if (this._errorMessage != null) {
            return this._errorMessage;
        }

        return this.hasError
            ? this.errors[0].error
            : null;
    }

    @computed
    get validators(): IFieldValidator[] {
        return this._validators.values();
    }

    @action
    addValidators(configs: IValidatorConfig[]) {
        configs.forEach(config => {
            const validator = new FieldValidator(config);
            this._validators.set(validator.id, validator);
        });
    }

    @action
    init(val: string) {
        this._isDirty = false;
        this._wasSubmitted = false;
        this._errorMessage = null;
        this._value = val;
        this.validators.forEach(validator => validator.init());
    }

    @action
    handleChange(val: string) {
        this._isDirty = true;
        this._errorMessage = null;

        this._validators.forEach(validator => {
            validator.handleChange(val);
        });

        this._value = val;
    }

    @action
    handleSubmit() {
        let value = this._value;

        if (this._trimOnSubmit) {
            value = value.trim();
            this._value = value;
        }

        this._validators.forEach(validator => {
            validator.handleSubmit(value);
        });

        this._wasSubmitted = true;
    }

    @action
    setError(message: string) {
        this._errorMessage = message;
    }

    // for testing

    @computed
    get stateForTesting(): string {
        return [
            `prist:${this.isPristine}`,
            `dirty:${this.isDirty}`,
            `maybe:${this.isMaybeValid}`,
            `valid:${this.isValid}`,
            `sub:${this.wasSubmitted}`,
            `err:${this.firstErrorMessage}`,
        ].join(',');
    }
}
