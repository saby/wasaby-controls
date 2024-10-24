import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import { TreeGridControl, ITreeGridControlOptions } from 'Controls/treeGrid';
import { TSearchNavigationMode } from 'Controls/interface';
import 'Controls/baseDecorator';

export interface ISearchGridControlOptions extends ITreeGridControlOptions {
    searchNavigationMode?: TSearchNavigationMode;
    containerWidth?: number;
    breadCrumbsMode?: 'row' | 'cell';
    _initBreadCrumbsMode?: 'row' | 'cell';
}

// Вся логика перенесена в View.tsx
export default class SearchGridControl<
    T extends ISearchGridControlOptions,
> extends TreeGridControl<T> {
    constructor(...args: unknown[]) {
        super(...args);
    }

    protected _notifyItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number
    ): boolean {
        const result = super._notifyItemClick(event, contents, originalEvent, columnIndex);
        // Событие клика по узлу в режиме поиска должно возвращать false,
        // _notifyItemActivate запускаться не должен.
        return contents?.get(this._options.nodeProperty) === true ? false : result;
    }

    static readonly '[Controls/searchBreadcrumbsGrid:SearchGridControl]': true = true;
}
