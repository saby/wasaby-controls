import 'Types/collection';
import { Model } from 'Types/entity';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { getSlice } from './utils';

const EMPTY_FIELD_KEY = 'Пустое поле';
const NUMBER_FIELD_KEY = 'Числовое поле';
const TEXT_FIELD_KEY = 'Текстовое поле';

const VALIDATE_FAILED_TEXT = 'Бог Валидации говорит, что ты криворук';

const getInitialData = () => ({
    [EMPTY_FIELD_KEY]: null,
    [NUMBER_FIELD_KEY]: 666,
    [TEXT_FIELD_KEY]: 'Текст',
});

const isRequired = ({ value }: unknown) => (!value ? VALIDATE_FAILED_TEXT : true);

const isNumber = ({ value }: unknown) => (Number.isNaN(value) ? VALIDATE_FAILED_TEXT : true);

const asyncValidator = async ({ value }: unknown): Promise<boolean | string> => {
    value = value?.trim();

    if (!value) {
        // Пустое значение должно быть валидным
        return true;
    }

    const lowerCaseValue = value.toLowerCase();
    return lowerCaseValue === 'текст' ? true : VALIDATE_FAILED_TEXT;
};

describe('Controls-DataEnv/dataFactory:Form VALIDATION', () => {
    describe('.registerValidators()', () => {
        let slice: FormSlice;
        beforeEach(() => {
            slice = getSlice({
                mockRecord: new Model({ rawData: getInitialData() }),
            });
        });
        afterEach(() => {
            slice = null;
            jest.restoreAllMocks();
        });

        it('should register validators', () => {
            slice.registerValidators(EMPTY_FIELD_KEY, [isRequired]);
            slice.registerValidators(NUMBER_FIELD_KEY, [isRequired, isNumber]);

            const validators = slice._validators;

            expect(validators).toHaveProperty(EMPTY_FIELD_KEY);
            expect(validators[EMPTY_FIELD_KEY].callbacks).toEqual([isRequired]);
            expect(validators).toHaveProperty(NUMBER_FIELD_KEY);
            expect(validators[NUMBER_FIELD_KEY].callbacks).toEqual([isRequired, isNumber]);
        });
    });

    describe('working with validators', () => {
        describe('.validate()', () => {
            let slice: FormSlice;
            beforeEach(() => {
                slice = getSlice({
                    mockRecord: new Model({ rawData: getInitialData() }),
                });
                slice.registerValidators(EMPTY_FIELD_KEY, [isRequired]);
                slice.registerValidators(NUMBER_FIELD_KEY, [isRequired, isNumber]);
                slice.registerValidators(TEXT_FIELD_KEY, [asyncValidator]);
            });
            afterEach(() => {
                slice = null;
                jest.restoreAllMocks();
            });

            it('should return true on valid value', async () => {
                const result = await slice.validate(NUMBER_FIELD_KEY);
                expect(result).toBeTruthy();
            });

            it('should return error string on invalid value', async () => {
                const result = await slice.validate(EMPTY_FIELD_KEY);
                expect(result.msg).toEqual(VALIDATE_FAILED_TEXT);
            });

            it('should update validationState on valid value', async () => {
                await slice.validate(NUMBER_FIELD_KEY);
                expect(slice.state.validationState).toHaveProperty(NUMBER_FIELD_KEY);
                expect(slice.state.validationState[NUMBER_FIELD_KEY]).toEqual('valid');
            });

            it('should update validationState on invalid value', async () => {
                await slice.validate(EMPTY_FIELD_KEY);
                expect(slice.state.validationState).toHaveProperty(EMPTY_FIELD_KEY);
                expect(slice.state.validationState[EMPTY_FIELD_KEY]).toEqual('invalid');
            });

            it('should validate with async validator', async () => {
                const result = await slice.validate(TEXT_FIELD_KEY);
                expect(result).toBeTruthy();

                slice.set(TEXT_FIELD_KEY, 'foo');
                const textResult = await slice.validate(TEXT_FIELD_KEY);
                expect(textResult.msg).toEqual(VALIDATE_FAILED_TEXT);
            });
        });

        describe('.isValid()', () => {
            let slice: FormSlice;
            beforeEach(() => {
                slice = getSlice({
                    mockRecord: new Model({ rawData: getInitialData() }),
                });
                slice.registerValidators(EMPTY_FIELD_KEY, [isRequired]);
                slice.registerValidators(NUMBER_FIELD_KEY, [isRequired, isNumber]);
                slice.registerValidators(TEXT_FIELD_KEY, [asyncValidator]);
            });
            afterEach(() => {
                slice = null;
                jest.restoreAllMocks();
            });

            it('should return true on init', () => {
                expect(slice.isValid()).toBeTruthy();
            });

            it('should return true after checking valid value', async () => {
                await slice.validate(NUMBER_FIELD_KEY);
                expect(slice.isValid()).toBeTruthy();
            });

            it('should return true after checking multiple valid values', async () => {
                await slice.validate(NUMBER_FIELD_KEY);
                await slice.validate(TEXT_FIELD_KEY);
                expect(slice.isValid()).toBeTruthy();
            });

            it('should return false after checking invalid value', async () => {
                await slice.validate(EMPTY_FIELD_KEY);
                expect(slice.isValid()).toBeFalsy();
            });

            it('should return false after checking multiple mixed values', async () => {
                await slice.validate(NUMBER_FIELD_KEY);
                await slice.validate(TEXT_FIELD_KEY);
                await slice.validate(EMPTY_FIELD_KEY);
                expect(slice.isValid()).toBeFalsy();
            });
        });
    });
});
