import { ICrud } from 'Types/source';
import { IFormDataFactoryArguments } from './IFormDataFactory';

export function createLoader<T extends ICrud>(config: IFormDataFactoryArguments): T {
    const { source, sourceOptions } = config;

    if (!source) {
        //@ts-ignore
        return;
    }

    if (isConstructor(source)) {
        //@ts-ignore
        return new source(sourceOptions);
    }
    //@ts-ignore
    return source(sourceOptions);
}

// TODO: найти что используют в платформе, наверняка есть аналог
function isConstructor(obj: any): boolean {
    if (typeof obj !== 'function') {
        return false;
    }
    if (!obj.prototype) {
        return false;
    }
    if (!obj.prototype.constructor) {
        return false;
    }
    return obj === obj.prototype.constructor;
}
