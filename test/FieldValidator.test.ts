import { expect } from 'chai';
import { FieldValidator } from '../src/FieldValidator';

describe('Field Validator', () => {

    describe('constructor', () => {

        it('works', () => {
            const fv = new FieldValidator(containsLetterAValidator);
            expect(fv).to.be.ok;
            expect(fv.isValid).to.be.false;
            expect(fv.isMaybeValid).to.be.true;
            expect(fv.hasError).to.be.false;
            expect(fv.error).to.be.null;
        });
    });

    describe('validate on change', () => {

        it('validator explicitly returns true', () => {
            const fv = new FieldValidator(containsLetterAValidator);
            fv.handleChange('bcerewr');
            expect(fv.isMaybeValid).to.be.true;
            expect(fv.hasError).to.be.false;
            fv.handleChange('bcerewra');
            expect(fv.isValid).to.be.true;
            expect(fv.isMaybeValid).to.be.true;
            expect(fv.hasError).to.be.false;
        });

        it('validator explicitly returns undefined then false', () => {
            const fv = new FieldValidator(doesNotContainB);
            fv.handleChange('ac');
            expect(fv.isMaybeValid).to.be.true;
            expect(fv.hasError).to.be.false;
            fv.handleChange('abc');
            expect(fv.isValid).to.be.false;
            expect(fv.isMaybeValid).to.be.false;
            expect(fv.hasError).to.be.true;
        });
    });

    describe('validate on submit', () => {

        it('should be valid', () => {
            const fv = new FieldValidator(containsLetterAValidator);
            fv.handleSubmit('7Charac');
            expect(fv.isValid).to.be.true;
            expect(fv.hasError).to.be.false;
            expect(fv.error).to.be.null;
        });
    });
});

const doesNotContainB = {
    id: 'does_not_contain_letter_b',
    defaultMessage: `must not contain the letter 'b'`,
    validateOnChange: (val: string) => {
        if (val.indexOf('b') > -1) return false;
    },
    validateOnSubmit: (val: string) => {
        if (val.indexOf('b') < -1) return true;
    },
};

const containsLetterAValidator = {
    id: 'contains_letter_a',
    defaultMessage: `must contain the letter 'a'`,
    validateOnChange: (val: string) => {
        if (val.indexOf('a') > -1) return true;
    },
    validateOnSubmit: (val: string) => {
        if (val.indexOf('a') < -1) return false;
    },
};
