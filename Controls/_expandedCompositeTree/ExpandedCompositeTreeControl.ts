/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';
import { ISelectionStrategy } from 'Controls/multiselection';
import type { ICompositeViewConfig } from './display/Collection';
import { MultiSelectionStrategy } from './strategy/MultiSelection';
import { DragNDropStrategy } from './strategy/DragNDrop';
import {
    DndController,
    IDraggableCollection,
    IDraggableItem,
    IDragStrategyParams,
} from 'Controls/listDragNDrop';

export interface IExpandedCompositeTreeControlOptions extends IBaseTreeControlOptions {
    compositeViewConfig: ICompositeViewConfig;
}

export default class ExpandedCompositeTreeControl<
    TOptions extends IExpandedCompositeTreeControlOptions = IExpandedCompositeTreeControlOptions
> extends BaseTreeControl<TOptions> {
    protected _createSelectionStrategy(options: TOptions): ISelectionStrategy {
        const strategyOptions = this._getSelectionStrategyOptions(options);
        return new MultiSelectionStrategy(strategyOptions);
    }

    protected _createDndListController(
        model: IDraggableCollection,
        draggableItem: IDraggableItem
    ): DndController<IDragStrategyParams> {
        return new DndController(model, draggableItem, DragNDropStrategy);
    }
}
