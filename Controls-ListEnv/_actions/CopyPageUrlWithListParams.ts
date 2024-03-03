import { BaseAction, IActionOptions } from 'Controls/actions';
import * as rk from 'i18n!Controls';
import { ListSlice } from 'Controls/dataFactory';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport, IStoreId } from 'Controls/interface';
import { FilterHistory, IFilterItem } from 'Controls/filter';
import { getRootRouter, IRouter } from 'Router/router';

export interface ICopyPageUrlWithListParams extends IActionOptions, IStoreId {}

const COMPATIBLE_STORE_ID = 'compatibleListParamsId';

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

/**
 * Действие копирования ссылки на страницу, в ссылку сохраняются применнные фильтры, развернутые папки списка, корень страницы.
 * Для того чтобы связать действие со списком, задайте опцию storeId. В конфигурации списочной фабрики задайте listConfigStoreId, такой же, как и storeId у списка.
 * @remark
 * Если вы используете устаревшую схему без storeId, задайте listConfigStoreId как 'compatibleListParamsId'.
 * Подробнее о настройке тулбара на странице читайте {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/toolbar-config/ здесь}.
 * @public
 */
export default class CopyPageUrlWithListParams extends BaseAction<ICopyPageUrlWithListParams> {
    constructor(options: ICopyPageUrlWithListParams) {
        super(options);
        this._validateOptions(options);
    }

    protected _validateOptions(options: ICopyPageUrlWithListParams): void {
        if (options.storeId) {
            const slice = options.context[options.storeId] as ListSlice;
            if (!slice) {
                throw new Error(
                    `CopyPageUrlWithListParams::Указан неверный storeId ${options.storeId}`
                );
            } else if (!slice['[IListSlice]']) {
                throw new Error(
                    `CopyPageUrlWithListParams::Слайс ${options.storeId} должен быть наследником cлайса списка`
                );
            }
        }
    }

    execute(): void {
        let filterDescription;
        let expandedItems;
        let root;
        if (!this._options.storeId) {
            const state = getStore().getState();
            filterDescription = state.filterSource;
        } else {
            const slice = this._options.context[this._options.storeId] as ListSlice;
            filterDescription = slice.state.filterDescription;
            expandedItems = slice.state.expandedItems;
            root = slice.state.root;
        }
        const minFilterDescription = FilterHistory.minimizeFilterDescription(
            filterDescription as IFilterItem[]
        );

        const Router: IRouter = getRootRouter();
        const configToSave = {
            listParams: {
                [this._options.storeId || COMPATIBLE_STORE_ID]: {
                    filterDescription: minFilterDescription,
                    expandedItems,
                    root,
                },
            },
        };

        const href = Router.maskResolver.calculateQueryHref(configToSave, Router.url.location.href);
        navigator.clipboard.writeText(href);
    }
}

Object.assign(CopyPageUrlWithListParams.prototype, {
    id: 'copyListParamsUrl',
    icon: 'icon-Link',
    tooltip: rk('Скопировать ссылку на страницу'),
    title: rk('Скопировать ссылку на страницу'),
    order: 20000,
});
