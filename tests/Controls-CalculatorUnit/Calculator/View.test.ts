import View from 'Controls-Calculator/View';
import { getProxyClass } from 'ControlsUnit/Utils/ProxyClass';

describe('Controls-Calculator/View', () => {
    describe('_handleKey', () => {
        [
            {
                value: '8',
                result: '8',
            },
            {
                value: '111111',
                result: '111 111',
            },
            {
                value: '1e+26',
                result: '1e+26',
            },
            {
                value: '111111.11111',
                result: '111 111.11111',
            },
            {
                value: '123456789012345',
                result: '1.23457e+14',
            },
        ].forEach((test) => {
            it('should set correct value', () => {
                const control = getProxyClass(View);
                control.proxy('_beforeMount', { value: '' });
                const key = {
                    value: test.value,
                };

                control.proxy('_handleKey', key);
                expect(test.result).toEqual(control.proxyState('_inputValue'));
            });
        });
    });
});
