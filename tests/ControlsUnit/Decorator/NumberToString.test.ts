import { numberToString } from 'Controls/baseDecorator';

const options = {
    useGrouping: false,
    maximumFractionDigits: 10,
};
describe('Controls._decorator.numberToString', () => {
    it('should return 3450', () => {
        const result = numberToString(3.45e3, options);
        expect(result).toEqual('3450');
    });

    it('should return -0.00345', () => {
        const result = numberToString(-3.45e-3, options);
        expect(result).toEqual('-0.00345');
    });

    it('should exponential return 3450', () => {
        const exp = 3450;
        const result = numberToString(exp.toExponential(3), options);
        expect(result).toEqual(exp.toString());
    });

    it('should exponential return -0.00345', () => {
        const exp = -0.00345;
        const result = numberToString(exp.toExponential(3), options);
        expect(result).toBe('-0.00345');
    });

    it('should return 0', () => {
        const result = numberToString(0);
        expect(result).toEqual('0');
    });
});
