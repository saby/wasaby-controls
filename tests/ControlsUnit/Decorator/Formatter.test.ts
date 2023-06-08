import { Formatter } from 'Controls/baseDecorator';

describe('Controls decorator Formatter', () => {
    it('abbreviateNumber', () => {
        let result = Formatter.abbreviateNumber(null, 'long');
        expect(result).toEqual('0');

        result = Formatter.abbreviateNumber('512', 'long');
        expect(result).toEqual('512');
        result = Formatter.abbreviateNumber('64', 'short');
        expect(result).toEqual('64');

        result = Formatter.abbreviateNumber('1000', 'long');
        expect(result).toEqual('1 тыс');
        result = Formatter.abbreviateNumber('999.99', 'long');
        expect(result).toEqual('1 тыс');
        result = Formatter.abbreviateNumber('999.99', 'short');
        expect(result).toEqual('1К');
        result = Formatter.abbreviateNumber(999.99, 'long');
        expect(result).toEqual('1 тыс');

        result = Formatter.abbreviateNumber('1000000000000', 'long');
        expect(result).toEqual('1 трлн');
        result = Formatter.abbreviateNumber('1000000000000', 'short');
        expect(result).toEqual('1Т');

        result = Formatter.abbreviateNumber('1000000000', 'long');
        expect(result).toEqual('1 млрд');
        result = Formatter.abbreviateNumber('1000000000', 'short');
        expect(result).toEqual('1Г');

        result = Formatter.abbreviateNumber('1000000', 'long');
        expect(result).toEqual('1 млн');
        result = Formatter.abbreviateNumber('1000000', 'short');
        expect(result).toEqual('1М');

        result = Formatter.abbreviateNumber('1200000000000', 'long');
        expect(result).toEqual('1.2 трлн');
        result = Formatter.abbreviateNumber('1230000000000', 'short');
        expect(result).toEqual('1.2Т');

        result = Formatter.abbreviateNumber('1200000000', 'long');
        expect(result).toEqual('1.2 млрд');
        result = Formatter.abbreviateNumber('1230000000', 'short');
        expect(result).toEqual('1.2Г');

        result = Formatter.abbreviateNumber('1200000', 'long');
        expect(result).toEqual('1.2 млн');
        result = Formatter.abbreviateNumber('1230000', 'short');
        expect(result).toEqual('1.2М');

        result = Formatter.abbreviateNumber('999999', 'long');
        expect(result).toEqual('1 000 тыс');

        result = Formatter.abbreviateNumber('1200', 'long');
        expect(result).toEqual('1.2 тыс');
        result = Formatter.abbreviateNumber('1230', 'short');
        expect(result).toEqual('1.2К');

        result = Formatter.abbreviateNumber(-1200, 'long');
        expect(result).toEqual('-1.2 тыс');

        result = Formatter.abbreviateNumber(999.99, 'long', {}, true);
        expect(result).toEqual('1.0 тыс');
        result = Formatter.abbreviateNumber(-1000, 'long', {}, true);
        expect(result).toEqual('-1.0 тыс');
        result = Formatter.abbreviateNumber('1000', 'long', {}, true);
        expect(result).toEqual('1.0 тыс');
        result = Formatter.abbreviateNumber('1200', 'long', {}, true);
        expect(result).toEqual('1.2 тыс');
    });
});
