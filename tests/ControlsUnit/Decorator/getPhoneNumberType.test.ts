import { getPhoneNumberType } from 'Controls/extendedDecorator';

describe('Controls.extendedDecorator:getPhoneNumberType', () => {
    [
        {
            value: '89621239555',
            result: 'mobile',
        },
        {
            value: '+79621239555',
            result: 'mobile',
        },
        {
            value: '79621239555',
            result: 'mobile',
        },
        {
            value: '13013499233',
            result: 'mobile',
        },
        {
            value: '83013499233',
            result: 'landline',
        },
        {
            value: '+73013499233',
            result: 'landline',
        },
    ].forEach((test) => {
        it('should return correct phone number type', () => {
            const result = getPhoneNumberType(test.value);
            expect(result).toEqual(test.result);
        });
    });
});
