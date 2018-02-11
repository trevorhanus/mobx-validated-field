import { autorun } from 'mobx';
import { expect } from 'chai';
import { ValidatedField } from '../src/ValidatedField';

describe('Validated Field', () => {

    describe('constructor', () => {

        it('works', () => {
            const vf = new ValidatedField();
            expect(vf).to.be.ok;
            const state = vf.stateForTesting;
            expect(state).to.equal('prist:true,dirty:false,maybe:true,valid:false,sub:false,err:null');
        });
    });

    describe('state', () => {

        it('handleChange sets dirty', () => {
            const vf = new ValidatedField();
            let state = '';

            autorun(() => {
                state = vf.stateForTesting;
            });

            expect(state).to.equal('prist:true,dirty:false,maybe:true,valid:false,sub:false,err:null');
            vf.handleChange('test');
            expect(state).to.equal('prist:false,dirty:true,maybe:true,valid:false,sub:false,err:null');
        });

        it('handleSubmit sets wasSubmitted and isValid', () => {
            const vf = new ValidatedField();
            let state = '';

            autorun(() => {
                state = vf.stateForTesting;
            });

            expect(state).to.equal('prist:true,dirty:false,maybe:true,valid:false,sub:false,err:null');
            vf.handleSubmit();
            expect(state).to.equal('prist:true,dirty:false,maybe:true,valid:true,sub:true,err:null');
        });
    });

    describe('validators', () => {

        it('custom message', () => {
            const notEmpty = {
                id: 'empty',
                defaultMessage: 'must not be empty',
                validateOnSubmit: (val: string) => {
                    if (val === '') return 'custom message';
                },
            };

            const myField = new ValidatedField();
            myField.addValidators([notEmpty]);

            myField.handleSubmit();
            expect(myField.isValid).to.be.false;
            expect(myField.isMaybeValid).to.be.false;
            expect(myField.firstErrorMessage).to.equal('custom message');
        });
    });
});
