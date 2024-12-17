import { BaseAction, IActionOptions } from 'Controls/actions';
import * as rk from 'i18n!Controls-ListEnv';
import type { ListSlice } from 'Controls/dataFactory';
import { loadSync, loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { TStoreImport, IStoreId } from 'Controls/interface';
import type { IFilterItem } from 'Controls/filter';
import { getRootRouter, IRouter } from 'Router/router';
import { URL as PageUrl } from 'Browser/Transport';
import { getShortLink } from './CopyUtils';

export interface ICopyPageUrlWithListParams extends IActionOptions, IStoreId {}

interface IListParams {
    filterDescription: IFilterItem[];
    expandedItems?: string[];
    root?: string;
}

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
        // В старых версия nodejs URL не глобальный объект
        const URLConstructor =
            typeof window !== undefined && typeof window?.URL !== undefined && window?.URL;
        if (PageUrl.getQueryParam('listParams') && URLConstructor) {
            const Router: IRouter = getRootRouter();
            const url = new URLConstructor(window.location.href);

            url.searchParams.delete('listParams');
            url.search = decodeURIComponent(url.search.replace(/\+/g, '%20'));
            const href = url.toString();
            Router.history.replaceState({
                state: href,
                href,
            });
        }
    }

    private _getFabricId(storeFilterDescription: IFilterItem[]): string[] | undefined {
        return Object.keys(this._options.context).filter((key) => {
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

    private _getListParams(
        fabricId: string | string[],
        minFilterDescription: IFilterItem[],
        expandedItems: string[],
        root: string,
        viewMode: string
    ): IListParams {
        const listParams = {};
        const idsArray = Array.isArray(fabricId) ? fabricId : [fabricId];
        const listConfig = {
            filterDescription: minFilterDescription,
            root,
        };
        if (viewMode !== 'search') {
            listConfig.expandedItems = expandedItems;
        }
        const filteredListConfig = Object.fromEntries(
            Object.entries(listConfig).filter(([key, value]) => value !== undefined)
        );
        idsArray.forEach((id) => {
            listParams[id || COMPATIBLE_STORE_ID] = filteredListConfig;
        });
        return listParams;
    }

    async execute(): Promise<void> {
        let filterDescription;
        let expandedItems;
        let root;
        let viewMode;
        let fabricId: string | string[];

        const { FilterHistory } = await loadAsync<typeof import('Controls/filter')>(
            'Controls/filter'
        );
        if (!this._options.storeId) {
            const state = getStore().getState();
            filterDescription = state.filterSource;
            fabricId = this._getFabricId(filterDescription);
            expandedItems = state.expandedItems;
            root = state.root;
            viewMode = state.viewMode;
        }
        if (this._options.storeId || !filterDescription) {
            fabricId = this._getListSliceId();
            const slice = this._options.context?.[fabricId] as ListSlice;
            filterDescription = slice.state.filterDescription;
            expandedItems = slice.state.expandedItems;
            root = slice.state.root;
            viewMode = slice.state.viewMode;
        }
        const minFilterDescription = FilterHistory.minimizeFilterDescription(
            filterDescription as IFilterItem[]
        );

        const Router: IRouter = getRootRouter();
        const configToSave = {
            listParams: this._getListParams(
                fabricId,
                minFilterDescription,
                expandedItems,
                root,
                viewMode
            ),
        };

        const href = Router.maskResolver.calculateQueryHref(configToSave, Router.url.location.href);
        const resultLink = await getShortLink(href);
        // navigator.clipboard доступен только при подключении через HTTPS
        if (isLoaded('Clipboard/clipboards')) {
            const { Clipboard } = loadSync('Clipboard/clipboards');
            new Clipboard().setText(resultLink);
        } else if (navigator?.clipboard) {
            navigator.clipboard.writeText(resultLink);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = resultLink;
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
    tooltip: rk('Скопировать ссылку'),
    title: rk('Скопировать ссылку'),
    order: 20000,
});
