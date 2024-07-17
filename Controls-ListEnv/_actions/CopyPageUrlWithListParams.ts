import { BaseAction, IActionOptions } from 'Controls/actions';
import * as rk from 'i18n!Controls';
import type { ListSlice } from 'Controls/dataFactory';
import { loadSync, loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { TStoreImport, IStoreId } from 'Controls/interface';
import type { IFilterItem } from 'Controls/filter';
import { getRootRouter, IRouter } from 'Router/router';
import { query } from 'Application/Env';
import { URL } from 'Browser/Transport';

export interface ICopyPageUrlWithListParams extends IActionOptions, IStoreId {}

const COMPATIBLE_STORE_ID = 'compatibleListParamsId';

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

/**
 * Действие копирования ссылки на страницу, в ссылку сохраняются примененные фильтры, развернутые папки списка, корень списка.
 * Для того чтобы связать действие со списком, задайте опцию storeId.
 * @control
 * @extends Controls/actions:BaseAction
 * @public
 * @demo Controls-ListEnv-demo/Actions/CopyPageUrlWithListParams/Index
 * @remark
 * Подробнее о настройке тулбара на странице читайте {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/toolbar-config/ здесь}.
 */
export default class CopyPageUrlWithListParams extends BaseAction<ICopyPageUrlWithListParams> {
    constructor(options: ICopyPageUrlWithListParams) {
        super(options);
        this._validateOptions(options);
        this._clearUrl();
    }

    protected _validateOptions(options: ICopyPageUrlWithListParams): void {
        if (options.storeId) {
            const slice = options.context?.[options.storeId] as ListSlice;
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

    private _clearUrl(): void {
        if (URL.getQueryParam('listParams')) {
            const Router: IRouter = getRootRouter();
            const state = Router.maskResolver.calculateQueryHref({
                ...query.get,
                listParams: undefined,
            });

            Router.history.replaceState({
                state,
            });
        }
    }

    private _getFabricId(storeFilterDescription: IFilterItem[]): string | undefined {
        return Object.keys(this._options.context).find((key) => {
            const contextItem = this._options.context[key];
            if (contextItem instanceof Object && contextItem['[IListSlice]']) {
                const filterDescription = contextItem.state?.filterDescription;
                return (
                    filterDescription &&
                    storeFilterDescription &&
                    filterDescription.every((filter) => {
                        return storeFilterDescription.find((storeFilter) => {
                            return filter.name === storeFilter.name;
                        });
                    })
                );
            }
            return false;
        });
    }

    private _getListSliceId(): string {
        if (this._options.storeId) {
            return this._options.storeId;
        }
        return Object.keys(this._options.context).find((contextItemKey) => {
            const contextItem = this._options.context[contextItemKey];
            const filterDescription = contextItem.state?.filterDescription;
            return (
                contextItem['[IListSlice]'] &&
                filterDescription &&
                Object.keys(filterDescription).length
            );
        });
    }

    async execute(): Promise<void> {
        let filterDescription;
        let expandedItems;
        let root;
        let fabricId;

        const { FilterHistory } = await loadAsync<typeof import('Controls/filter')>(
            'Controls/filter'
        );
        if (!this._options.storeId) {
            const state = getStore().getState();
            filterDescription = state.filterSource;
            fabricId = this._getFabricId(filterDescription);
        }
        if (this._options.storeId || !filterDescription) {
            fabricId = this._getListSliceId();
            const slice = this._options.context?.[fabricId] as ListSlice;
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
                [fabricId || COMPATIBLE_STORE_ID]: {
                    filterDescription: minFilterDescription,
                    expandedItems,
                    root,
                },
            },
        };

        const href = Router.maskResolver.calculateQueryHref(configToSave, Router.url.location.href);
        // navigator.clipboard доступен только при подключении через HTTPS
        if (isLoaded('Clipboard/clipboards')) {
            const { Clipboard } = loadSync('Clipboard/clipboards');
            new Clipboard().setText(href);
        } else if (navigator?.clipboard) {
            navigator.clipboard.writeText(href);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = href;
            textArea.style.opacity = '0';
            textArea.style.top = '0';
            textArea.style.position = 'absolute';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }
}

Object.assign(CopyPageUrlWithListParams.prototype, {
    id: 'copyListParamsUrl',
    icon: 'icon-Link',
    tooltip: rk('Скопировать ссылку на страницу'),
    title: rk('Скопировать ссылку на страницу'),
    order: 20000,
});
