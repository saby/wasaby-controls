/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TColumns } from 'Controls/grid';
import { Model } from 'Types/entity';
import { ISuggestListsOptions } from './interface/ISuggestListsOptions';
import { INavigationOptionValue, INavigationSourceConfig, IItemPadding } from 'Controls/interface';
import { IFilterItem } from 'Controls/filter';
import * as template from 'wml!Controls-ListEnv/_ExtSearch/SuggestTemplate';

type Key = string | number | null;

interface ISuggestTemplate extends IControlOptions {
    displayProperty?: string;
    tabsSelectedKey?: string;
    suggestListsOptions?: Record<string, ISuggestListsOptions>;
    suggestSettingsOptions?: IFilterItem[];
}

export default class SuggestTemplate extends Control<ISuggestTemplate> {
    protected _template: TemplateFunction = template;
    protected _columns: TColumns;
    protected _displayProperty: string;
    protected _keyProperty: string;
    protected _parentProperty: string;
    protected _nodeProperty: string;
    protected _source: unknown;
    protected _filter: object;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;
    protected _suggestItemTemplate: TemplateFunction;
    protected _suggestItemPadding: IItemPadding;

    protected _beforeMount(options: ISuggestTemplate): void {
        if (options.suggestListsOptions) {
            this._setProperties(options.suggestListsOptions, options.tabsSelectedKey);
        }
    }

    protected _beforeUpdate(options: ISuggestTemplate): void {
        if (
            options.suggestListsOptions &&
            options.tabsSelectedKey !== this._options.tabsSelectedKey
        ) {
            this._setProperties(options.suggestListsOptions, options.tabsSelectedKey);
        }
    }

    private _setProperties(
        suggestListsOptions: Record<string, ISuggestListsOptions>,
        tabsSelectedKey: string
    ): void {
        const currentOptions = suggestListsOptions[tabsSelectedKey];
        this._keyProperty = currentOptions.keyProperty;
        this._parentProperty = currentOptions.parentProperty;
        this._nodeProperty = currentOptions.nodeProperty;
        this._displayProperty =
            currentOptions.suggestDisplayProperty || currentOptions.displayProperty;
        this._navigation = currentOptions.suggestNavigation || currentOptions.navigation;
        this._source = currentOptions.source;
        this._filter = currentOptions.filter;
        this._suggestItemPadding = currentOptions.suggestItemPadding;
        this._columns = currentOptions.suggestColumns || [
            {
                displayProperty: this._displayProperty,
            },
        ];
        this._suggestItemTemplate = currentOptions.suggestItemTemplate;
    }

    protected _onFilterChanged(e: SyntheticEvent, filter: object): void {
        e.stopImmediatePropagation();
        this._notify('settingsChanged', [filter], { bubbling: true });
    }

    protected _onItemClick(e: SyntheticEvent, model: Model): void {
        this._notify('itemClick', [model], { bubbling: true });
    }

    protected _markedKeyChangedHandler(e: SyntheticEvent, key: Key): void {
        this._notify('markedKeyChanged', [key], { bubbling: true });
    }
}
