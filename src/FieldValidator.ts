import { IFieldValidator, IValidatorConfig } from './interfaces';
import { action, computed, observable } from 'mobx';

export class FieldValidator implements IFieldValidator {
    id: string;
    @observable private _error: string;
    @observable private _hasSumbitted: boolean;
    private _defaultMessage: string;
    private _changeCallback: (val: string) => boolean | string;
    private _submitCallback: (val: string) => boolean | string;

    constructor(config: IValidatorConfig) {
        this.id = config.id;
        this._defaultMessage = config.defaultMessage;
        this._error = null;
        this._hasSumbitted = false;
        this._changeCallback = config.validateOnChange;
        this._submitCallback = config.validateOnSubmit;
    }

    @computed
    get isMaybeValid(): boolean {
        return !this.hasError;
    }

    @computed
    get isValid(): boolean {
        return !this.hasError && this._hasSumbitted;
    }

    @computed
    get hasError(): boolean {
        return this._error != null;
    }

    @computed
    get error(): string {
        return this._error;
    }

    @action
    init() {
        this._hasSumbitted = false;
        this._error = null;
    }

    @action
    handleChange(val: string) {
        this._hasSumbitted = false;
        this._error = null;
        if (this._changeCallback == null) return;
        const error = this._changeCallback(val);
        this._handleCallbackResponse(error);
    }

    @action
    handleSubmit(val: string) {
        this._error = null;
        this._hasSumbitted = true;
        if (this._submitCallback == null) return;
        const res = this._submitCallback(val);
        this._handleCallbackResponse(res);
    }

    @action
    private _handleCallbackResponse(res: boolean | string) {
        if (typeof res === 'boolean' && res === false) {
            this._error = this._defaultMessage;
        }

        // returned a custom message
        if (typeof res === 'string') {
            // for sure error
            this._error = res;
        }
    }
}
