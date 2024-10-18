import { Control } from 'UI/Base';

type TControls<T> = new (...args: any[]) => T;

interface IProxyControl {
    proxy?: Function;
    proxyState?: Function;

    // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    [name: string]: any;
}

export function getProxyClass<T extends TControls<Control>>(baseClass: T): IProxyControl {
    class ProxyControl extends baseClass {
        // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        proxy(methodName: string, ...args): any {
            return this[methodName](...args);
        }

        // eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        proxyState(name: string): any {
            return this[name];
        }
    }

    return new ProxyControl({});
}
