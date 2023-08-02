import { IFormDataFactoryArguments, RecordLoader } from './IFormDataFactory';

export function createLoader<T = RecordLoader>(config: IFormDataFactoryArguments): T {
    const { source, sourceOptions } = config;

    if (isConstructor(source)) {
        return new source(sourceOptions);
    }
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
    if (obj !== obj.prototype.constructor) {
        return false;
    }
    return true;
}
