import 'Types/collection';
import { Model } from 'Types/entity';
import { getSlice } from './utils';

const EMPTY_FIELD_KEY = 'Пустое поле';
const NUMBER_FIELD_KEY = 'Числовое поле';
const TEXT_FIELD_KEY = 'Текстовое поле';

const VALIDATE_FAILED_TEXT = 'Бог Валидации говорит, что ты криворук';

const mockData: Record<string, unknown> = {
    [EMPTY_FIELD_KEY]: null,
    [NUMBER_FIELD_KEY]: 666,
    [TEXT_FIELD_KEY]: 'Текст',
};

const isRequired = ({ value }: unknown) => (!value ? VALIDATE_FAILED_TEXT : true);
const isNumber = ({ value }: unknown) => (Number.isNaN(value) ? VALIDATE_FAILED_TEXT : true);
const asyncValidator = async ({ value }: unknown): Promise<boolean | string> => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    value = value?.trim();
    await wait(2000);

    // Пустое значение должно быть валидным
    if (!value) {
        return true;
    }

    const lowerCaseValue = value.toLowerCase();
    return lowerCaseValue === 'Текстовое поле' ? true : VALIDATE_FAILED_TEXT;
};

describe('Controls-DataEnv/dataFactory:Form VALIDATION', () => {
    describe('.registerValidators()', () => {
        const slice = getSlice({
            mockRecord: new Model({ rawData: mockData }),
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
        let slice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockRecord: new Model({ rawData: mockData }),
            });
            slice.registerValidators(EMPTY_FIELD_KEY, [isRequired]);
            slice.registerValidators(NUMBER_FIELD_KEY, [isRequired, isNumber]);
            slice.registerValidators(TEXT_FIELD_KEY, [asyncValidator]);
        });

        describe('.validate()', () => {
            it('should return true on valid value', () => {
                slice.validate(NUMBER_FIELD_KEY).then((result) => expect(result).toBeTruthy());
            });
            it('should return error string on invalid value', () => {
                slice
                    .validate(EMPTY_FIELD_KEY)
                    .then((result) => expect(result).toEqual(VALIDATE_FAILED_TEXT));
            });
            it('should update validationState on valid value', () => {
                slice.validate(NUMBER_FIELD_KEY).then(() => {
                    expect(slice.state.validationState).toHaveProperty(NUMBER_FIELD_KEY);
                    expect(slice.state.validationState[NUMBER_FIELD_KEY]).toEqual('valid');
                });
            });
            it('should update validationState on invalid value', () => {
                slice.validate(EMPTY_FIELD_KEY).then(() => {
                    expect(slice.state.validationState).toHaveProperty(EMPTY_FIELD_KEY);
                    expect(slice.state.validationState[EMPTY_FIELD_KEY]).toEqual('invalid');
                });
            });
            it('should validate with async validator', () => {
                slice.validate(TEXT_FIELD_KEY).then((result) => {
                    expect(result).toBeTruthy();

                    slice.set(EMPTY_FIELD_KEY, 'foo');

                    slice.validate(TEXT_FIELD_KEY).then((result) => {
                        expect(result).toEqual(VALIDATE_FAILED_TEXT);
                    });
                });
            });
        });

        describe('.isValid()', () => {
            it('should return true on init', () => {
                expect(slice.isValid()).toBeTruthy();
            });

            it('should return true after checking valid value', () => {
                slice.validate(NUMBER_FIELD_KEY).then(() => expect(slice.isValid()).toBeTruthy());
            });

            it('should return false after checking invalid value', () => {
                slice.validate(EMPTY_FIELD_KEY).then(() => expect(slice.isValid()).toBeFalsy());
            });

            it('should return true after checking multiple valid values', () => {
                slice.validate(NUMBER_FIELD_KEY).then(() => {
                    slice.validate(TEXT_FIELD_KEY).then(() => {
                        expect(slice.isValid()).toBeTruthy();
                    });
                });
            });

            it('should return false after checking multiple mixed values', () => {
                slice.validate(NUMBER_FIELD_KEY).then(() => {
                    slice.validate(TEXT_FIELD_KEY).then(() => {
                        slice.valid(EMPTY_FIELD_KEY).then(() => {
                            expect(slice.isValid()).toBeFalsy();
                        });
                    });
                });
            });
        });
    });
});
