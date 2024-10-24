/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data';
import { default as CompatibleContainer } from 'Controls/_baseList/Data/compatible/ListContainerConnectedCompatible';
import { RecordSet } from 'Types/collection';
import { INavigationSourceConfig } from 'Controls/interface';
import { IDataOptions } from './interface/IDataOptions';
import { Logger } from 'UI/Utils';
import { isEqual } from 'Types/object';

// сюда будем добавлять список опций, которые надо проверять, что они заданы на списке, а не на Browser'e
const optionsToValidate = [
    'source',
    'filter',
    'sorting',
    'selectFields',
    'deepReload',
    'navigation',
    'parentProperty',
    'nodeProperty',
    'root',
    'sourceController',
];

function getControlName(options: IDataOptions): string {
    return options.__browserOptions.__isBrowser
        ? 'Controls/browser:Browser'
        : 'Controls/listDataOld:DataContainer';
}

function getLogMsg(controlName: string, optionName: string): string {
    return `Список лежит внутри ${controlName}, но опция ${optionName} задаётся на списке.
            Для корректной работы списка, опцию ${optionName} надо задавать на ${controlName}`;
}

function isInvalid(options: IDataOptions, optionName: string): boolean {
    const optionValue = options[optionName];
    const browserOptionValue = options.__browserOptions[optionName];
    // проверка, что опция задана на списке, а должна задаваться на Browser'e
    const isOptionsOnlyOnList = optionValue !== undefined && browserOptionValue === undefined;
    // проверка, что опция задана и на списке и на Browser'e и значение этих опций отличается
    const isOptionsValuesNotEqual =
        optionValue !== undefined &&
        browserOptionValue !== undefined &&
        !isEqual(optionValue, browserOptionValue);

    return isOptionsOnlyOnList || isOptionsValuesNotEqual;
}

function allowLog(): boolean {
    // Не будем логировать на демках
    const url = document?.URL;
    const conditions: string[] = [];

    return !(url && conditions.some((str) => url.includes(str)));
}

export default class Data extends Control<IDataOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        data: typeof CompatibleContainer;
    };

    protected _beforeMount(options: IDataOptions): Promise<void> | void {
        if (options.__browserOptions && allowLog()) {
            optionsToValidate.forEach((optionName) => {
                // Пока простейшая проверка, что опция задаётся на списке, а не на Browser'e
                if (isInvalid(options, optionName)) {
                    const controlName = getControlName(options);
                    Logger.error(getLogMsg(controlName, optionName), this);
                }
            });
        }
    }

    reload(config?: INavigationSourceConfig): Promise<RecordSet | Error> {
        // Если cписок строится асинхронно и через старую схему,
        // то внутренний DataContainer построится только после загрузки данных
        // до этого он будет недоступен в _children
        if (this._children.data) {
            return this._children.data?.reload?.(config);
        } else {
            return Promise.reject();
        }
    }
}
