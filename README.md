# Mobx ValidatedField

This library provides an extensible ValidatedField class whose properties are all made observable using mobx.

## Usage

```typescript
import { ValidatedField } from './ValidatedField';
  
// instantiate
const nameField = new ValidatedField();
  
// add validators
nameField.addValidators([
    {
        id: 'fieldIsNotEmpty', // used to keep track of the failing validation
        defaultMessage: 'this field cannot be empty', // message to return when a validation fails
        validateOnChange: (val: string) => {
            // callback that runs on every change
            // returning false indicates an error
            // you can also return a string that will indicate an error and 
            // override the defaultMessage
            // this callback is not required
        },
        validateOnSubmit: (val: string) => {
            // same as validateOnChange but runs when the field is submitted as opposed to every change
            // allows for a final validation of the field
            if (val === '') return false;
        }
    }
]);
```

## ValidatedField Class

```typescript
interface IValidatedField {
    new (config: IValidatedFieldConfig): IValidatedField;
    value: string;
    hasError: boolean;
    isPristine: boolean;
    isDirty: boolean;
    isMaybeValid: boolean;
    isValid: boolean;
    wasSubmitted: boolean;
    errors: IFieldValidator[];
    validators: IFieldValidator[];
    addValidators(configs: IValidatorConfig[]): void;
    handleChange(val: string): void;
    handleSubmit(): void;
}
```

### Constructor

The constructor accepts a config object. See the ValidatedFieldConfig section to see the available options.

### Member Descriptions

`addValidators(config: IValidatorConfig[]): void`
> method for adding validators to the field. Each config is used to instantiate a `FieldValidator` instance. A list of these validators is accessible at `ValidatedField#validators`

`value: string`
> The current value of the field.

`hasError: boolean`
> True when any of the validators failed. This is not necessarily the opposite of `isValid` since an error could occur before the field is submitted.

`isPristine: boolean`
> True when the field has not yet changed. ie `handleChange` has not been called.

`isDirty: boolean`
> True when the field has changed. ie `handleChange` *has* been called.

`isMaybeValid: boolean`
> True when all validators are either `maybeValid` or `valid`

`isValid: boolean`
> True when all validators are valid and field has been submitted.

`wasSubmitted: boolean`
> Only true after `handleSubmit` was called.

`errors: IFieldValidator[]`
> returns a list of all validators that have errors.

`validators: IFieldValidator[]`
> returns a list of all validators.

`handleChange(val: string): void`
> Should be called any time the value of the field changes. Invokes the `validateOnChange` callback on each validator.

`handleSubmit(): void`
> Should be called when the field is done being edited. Invokes the `validateOnSubmit` callback on each validator.

## ValidatedField Config

You can pass a config object to the ValidatedField constructor function. Here are the available options.

```typescript
interface IValidatedFieldConfig {
    trimOnSubmit: boolean;
}
```

### Property Descriptions

`trimOnSubmit: boolean`
> Trim the value before invoking the `validateOnSubmit` callback. Defaults to false.

### Example Using Config

```typescript
import { ValidatedField } from './ValidatedField';
  
// instantiate
const trimmedField = new ValidatedField({trimOnSubmit: true});
  
// add validators
trimmedField.addValidators([
    {
        id: 'fieldIsNotEmpty', // used to keep track of the failing validation
        defaultMessage: 'this field is required', // message to return when a validation fails
        validateOnSubmit: (val: string) => {
            // same as validateOnChange but runs when the field is submitted as opposed to every change
            // allows for a final validation of the field
            if (val === '') return false;
        }
    }
]);
```


## FieldValidator Config

Config that is passed to `ValidatedField#addValidators`

```typescript
interface IValidatorConfig {
    id: string;
    defaultMessage: string;
    validateOnChange?: (val: string) => boolean | string;
    validateOnSubmit?: (val: string) => boolean | string;
}
```

### Property Descriptions

`id: string`
> Unique id for the validation. Can be used to determine which validation is failing.

`defaultMessage: string`
> The message that is returned when a validation callback has failed. ie returned false

`validateOnChange: (val: string) => void`
> Callback that runs on every change. Returning false indicates a validation error. You can also return a string that will indicate and error and override the `defaultMessage`

`validateOnSubmit: (val: string) => void`
> same as validateOnChange but runs when the field is submitted as opposed to every change. This allows for a final validation on the value the user wants to submit.


## FieldValidator Class

```typescript
interface IFieldValidator {
    id: string;
    isMaybeValid: boolean;
    isValid: boolean;
    hasError: boolean;
    error: string;
    handleChange(val: string): void; // used internally, should not be called by user
    handleSubmit(val: string): void; // used internally, should not be called by user
}
```

### Member Descriptions

`id: string`
> Unique id for the validation. Can be used to determine which validation is failing.

`isMaybeValid: boolean`
> True when validation has passed.

`isValid: boolean`
> True when the validation passes on validatedOnSubmit

`hasError: boolean`
> True when either a validateOnChange or validateOnSumbit validation fails

`error: string`
> The actual error message when hasError is true, null if not

## Using with React

This library was intended for use with React and Mobx. Here's a simple example implementing it.

```typescript
// TODO: add this.
```

## Extending the class 

You could also extend the ValidatedField class if you wanted to add additional custom functionality.

```typescript
import { ValidatedField } from './ValidatedField';
  
export class MyValidatedField extends ValidatedField {
    
    constructor() {
        super();
        this.addValidators([
            {
                id: 'not empty',
                defaultMessage: 'this field cannot be empty',
                validateOnSubmit: (val: string) => {
                    if (val === '') return false;
                },
            },
        ]);
    }
}
  
const myField = new MyValidatedField();
  
myField.handleChange('stuff');
myField.handleSubmit();
  
console.log(myField.isValid); // true
```