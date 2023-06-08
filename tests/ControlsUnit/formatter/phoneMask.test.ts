import { phoneMask } from 'Controls/extendedDecorator';

describe('Controls/formatter:phoneMask', () => {
    it('dddd', () => {
        const expectedMask = 'dddd';

        expect(phoneMask('1')).toEqual(expectedMask);
        expect(phoneMask('12')).toEqual(expectedMask);
        expect(phoneMask('123')).toEqual(expectedMask);
        expect(phoneMask('1234')).toEqual(expectedMask);
    });
    it('d-dd-dd', () => {
        const expectedMask = 'd-dd-dd';

        expect(phoneMask('12345')).toEqual(expectedMask);
    });
    it('dd-dd-dd', () => {
        const expectedMask = 'dd-dd-dd';

        expect(phoneMask('123456')).toEqual(expectedMask);
    });
    it('ddd-dd-dd', () => {
        const expectedMask = 'ddd-dd-dd';

        expect(phoneMask('1234567')).toEqual(expectedMask);
    });
    it('(ddd)-ddd-dd-dd', () => {
        const expectedMask = '(ddd)-ddd-dd-dd';

        expect(phoneMask('12345678')).toEqual(expectedMask);
        expect(phoneMask('123456789')).toEqual(expectedMask);
        expect(phoneMask('1234567890')).toEqual(expectedMask);
    });
    it('Russian phone', () => {
        expect(phoneMask('89159721161')).toEqual('+\\?d (ddd) ddd-dd-dd');
        expect(phoneMask('83012721161')).toEqual('+\\?d (dddd) dd-dd-dd');
        expect(phoneMask('83013021161')).toEqual('+\\?d (ddddd) d-dd-dd');
    });
    it('International phone', () => {
        expect(phoneMask('+3900125125')).toEqual('+dd ddd ddd dd dd');
        expect(phoneMask('+38001251255')).toEqual('+ddd ddd ddd dd dd');
    });
});
