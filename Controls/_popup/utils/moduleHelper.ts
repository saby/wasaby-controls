/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
import { parse as parserLib, load } from 'WasabyLoader/Library';
import * as isEmpty from 'Core/helpers/Object/isEmpty';

export const getModuleByName = (module: string | Control) => {
    if (typeof module === 'string') {
        const parsedModule = parserLib(module);
        const isDefined = require.defined(parsedModule.name);
        let moduleClass = isDefined && require(parsedModule.name);
        // Если кто-то позвал загрузку модуля, но она еще не отстрелила, require может вернуть пустой объект
        if (!isDefined || isEmpty(moduleClass)) {
            return null;
        }
        if (parsedModule.path.length) {
            parsedModule.path.forEach((property) => {
                if (moduleClass && typeof moduleClass === 'object' && property in moduleClass) {
                    moduleClass = moduleClass[property];
                }
            });
        }

        // It's not a library notation so mind the default export for ES6 modules
        if (moduleClass && moduleClass.__esModule && moduleClass.default) {
            moduleClass = moduleClass.default;
        }
        return moduleClass;
    }
    return module;
};

export const loadModule = (module: string | Control): Promise<Control> => {
    const moduleClass = getModuleByName(module);
    if (moduleClass) {
        return Promise.resolve(moduleClass);
    } else if (!module) {
        return Promise.reject('Не задано имя модуля для загрузки');
    }
    return load(module);
};
