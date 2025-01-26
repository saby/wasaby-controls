import {
    checkIsBaseSize,
    changeSize,
    changeAspectRatio,
} from 'Controls-editors/_sizeEditor/changeSize';
import { BaseSizes, LimitSizes } from 'Controls-editors/_sizeEditor/constants';

describe('Controls-editors/_sizeEditor/changeSize', () => {
    describe('checkIsBaseSize', () => {
        it('type from BaseSizes ~> true', () => {
            Object.values(BaseSizes).forEach((type) => {
                expect(checkIsBaseSize(type)).toBeTruthy();
            });
        });

        it('type from LimitSizes ~> false', () => {
            Object.values(LimitSizes).forEach((type) => {
                expect(checkIsBaseSize(type)).toBeFalsy();
            });
        });
    });

    describe('changeSize', () => {
        it('without changes', () => {
            const value = {
                width: '100px',
                height: '50px',
            };

            expect(changeSize(BaseSizes.width, '100px', value)).toEqual(value);
        });

        it('without changes with aspectRatio', () => {
            const value = {
                width: '100px',
                height: '50px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.width, '100px', value)).toEqual(value);
        });

        it('without changes with not corrects sizes by aspectRatio', () => {
            const value = {
                width: '100px',
                height: '60px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.width, '100px', value)).toEqual({
                ...value,
                height: '50px',
            });
        });

        it('change width with aspectRatio and height in other unit', () => {
            const value = {
                width: '100px',
                height: '50%',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '200px',
                height: '100px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.width, '200px', value)).toEqual(expectedValue);
        });

        it('change width with not base unit and aspectRatio', () => {
            const value = {
                width: '100px',
                height: '50px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.width, 'auto', value)).toEqual({ ...value, width: 'auto' });
        });

        /* TODO: тут особый случай, когда 100% это fill, мож так не надо
         * @see Controls-editors/_sizeEditor/SizeEditorField.tsx - parseStyleValue
         */
        it.skip('change height with aspectRatio and width in other units', () => {
            const value = {
                width: '100px',
                height: '10%',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '200%',
                height: '100%',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.height, '100%', value)).toEqual(expectedValue);
        });

        it('change height with aspectRatio and width in other units', () => {
            const value = {
                width: '100px',
                height: '10%',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '50%',
                height: '25%',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.height, '25%', value)).toEqual(expectedValue);
        });

        it('change width with corrects all sizes', () => {
            const value = {
                width: '100px',
                height: '60px',
                maxWidth: '50px',
                minWidth: '150px',
                maxHeight: '50px',
                minHeight: '100px',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '110px',
                height: '55px',
                maxWidth: '110px',
                minWidth: '110px',
                maxHeight: '55px',
                minHeight: '55px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.width, '110px', value)).toEqual(expectedValue);
        });

        it('change height with corrects all sizes', () => {
            const value = {
                width: '100px',
                height: '60px',
                maxWidth: '50px',
                minWidth: '150px',
                maxHeight: '50px',
                minHeight: '100px',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '140px',
                height: '70px',
                maxWidth: '140px',
                minWidth: '140px',
                maxHeight: '70px',
                minHeight: '70px',
                aspectRatio: 2,
            };

            expect(changeSize(BaseSizes.height, '70px', value)).toEqual(expectedValue);
        });

        it('change maxWidth corrects width and height by aspectRatio', () => {
            const value = {
                width: '100px',
                height: '100%',
                maxWidth: '150px',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '80px',
                height: '40px',
                maxWidth: '80px',
                aspectRatio: 2,
            };

            expect(changeSize(LimitSizes.maxWidth, '80px', value)).toEqual(expectedValue);
        });

        it('change minWidth corrects width and height by aspectRatio', () => {
            const value = {
                width: '50%',
                height: '100px',
                minWidth: '10%',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '60%',
                height: '30%',
                minWidth: '60%',
                aspectRatio: 2,
            };

            expect(changeSize(LimitSizes.minWidth, '60%', value)).toEqual(expectedValue);
        });

        it('change maxHeight corrects height and width by aspectRatio', () => {
            const value = {
                width: '100px',
                height: '50%',
                maxHeight: '150px',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '50%',
                height: '25%',
                maxHeight: '25%',
                aspectRatio: 2,
            };

            expect(changeSize(LimitSizes.maxHeight, '25%', value)).toEqual(expectedValue);
        });

        it('change minHeight corrects height and width by aspectRatio', () => {
            const value = {
                width: '50%',
                height: '20px',
                minHeight: '',
                aspectRatio: 2,
            };
            const expectedValue = {
                width: '60px',
                height: '30px',
                minHeight: '30px',
                aspectRatio: 2,
            };

            expect(changeSize(LimitSizes.minHeight, '30px', value)).toEqual(expectedValue);
        });
    });

    describe('changeAspectRatio', () => {
        it('width is not in basic units', () => {
            const value = {
                width: 'auto',
                height: '100px',
                maxWidth: '300px',
                maxHeight: '200px',
            };

            expect(changeAspectRatio(2, value)).toEqual(value);
        });

        it('height is not in basic units', () => {
            const value = {
                width: '150px',
                height: 'auto',
                maxWidth: '300px',
                maxHeight: '200px',
            };

            expect(changeAspectRatio(2, value)).toEqual(value);
        });

        it('height is not in basic units', () => {
            const value = {
                width: '150px',
                height: '50%',
                maxWidth: '100px',
                maxHeight: '50px',
                aspectRatio: 5,
            };
            const expectedValue = {
                width: '150px',
                height: '75px',
                maxWidth: '150px',
                maxHeight: '75px',
                aspectRatio: 2,
            };

            expect(changeAspectRatio(2, value)).toEqual(expectedValue);
        });
    });
});
