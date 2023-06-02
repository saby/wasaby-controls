import { ListView, IListViewOptions } from 'Controls/baseList';
import * as React from 'react';
import { BaseTileViewTemplate as template, For } from 'Controls/baseTile';
import 'css!Controls/adaptiveTile';
import { TemplateFunction } from 'UI/base';
import Collection from '../display/Collection';

interface IAdaptiveTileViewOptions extends IListViewOptions {
    minItemHeight: number;
    maxItemHeight: number;
    minItemWidth: number;
    maxItemWidth: number;
    availableHeight: number;
}

export default class View extends ListView {
    protected _template: TemplateFunction = template;
    protected _forTemplate: React.ReactElement = For;
    protected _listModel: Collection;
    protected _options: IAdaptiveTileViewOptions;
    protected _orientation: string = 'horizontal';

    protected _beforeMount(newOptions: IAdaptiveTileViewOptions): void {
        super._beforeMount(newOptions);
        this._forTemplate = For;
    }

    protected _getViewClasses(): string {
        return 'controls-AdaptiveTileView';
    }

    protected _getItemsContainerClasses(): string {
        return 'controls-ListViewV controls-TileView controls-AdaptiveTileView_itemsContainer';
    }

    protected _getTriggerClasses(): string {
        return 'controls-AdaptiveTile__loadingTrigger_horizontal';
    }

    protected _getLoadingIndicatorClasses(): string {
        return 'controls-AdaptiveTile__loadingIndicator';
    }

    protected _getViewStyles(): string {
        return `height: ${this._options.availableHeight}px`;
    }
}
