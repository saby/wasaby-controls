/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_propertyGridBase/Render/Render';
import * as itemTemplate from 'wml!Controls/_propertyGridBase/Render/resources/itemTemplate';
import { SyntheticEvent } from 'UI/Events';
import { EventUtils } from 'UI/Events';
import { CollectionItem } from 'Controls/display';
import 'wml!Controls/_propertyGridBase/Render/resources/for';
import { TPropertyGridCollection } from 'Controls/_propertyGridBase/PropertyGridCollection';
import { TPropertyGridCollectionItem } from 'Controls/_propertyGridBase/PropertyGridCollectionItem';
import { Model } from 'Types/entity';

interface IPropertyGridRenderOptions extends IControlOptions {
    itemTemplate: TemplateFunction;
    groupTemplate: TemplateFunction;
    listModel: TPropertyGridCollection;
}

export default class PropertyGridRender extends Control<IPropertyGridRenderOptions> {
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _template: TemplateFunction = template;

    protected _onItemActionMouseEnter(): void {
        /**/
    }
    protected _onItemActionMouseLeave(): void {
        /**/
    }
    protected _onItemActionsMouseEnter(): void {
        /**/
    }

    protected _mouseEnterHandler(
        e: SyntheticEvent<Event>,
        item: TPropertyGridCollectionItem
    ): void {
        this._notify('itemMouseEnter', [item, e]);
    }

    protected _mouseMoveHandler(e: SyntheticEvent<Event>, item: TPropertyGridCollectionItem): void {
        this._notify('itemMouseMove', [item, e]);
    }

    protected _mouseLeaveHandler(
        e: SyntheticEvent<Event>,
        item: TPropertyGridCollectionItem
    ): void {
        this._notify('itemMouseLeave', [item, e]);
    }

    protected _onItemActionMouseDown(
        e: SyntheticEvent<MouseEvent>,
        action: unknown,
        item: CollectionItem<Model>
    ): void {
        e.stopPropagation();
        this._notify('itemActionMouseDown', [item, action, e]);
    }

    protected _onItemActionClick(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    protected _onItemActionMouseUp(e: SyntheticEvent<MouseEvent>): void {
        /* For override */
    }

    protected _itemContextMenu(e: SyntheticEvent<MouseEvent>, item: CollectionItem<Model>): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemContextMenu', [item, e]);
        }
    }

    protected _itemClick(e: SyntheticEvent<MouseEvent>, item: TPropertyGridCollectionItem): void {
        if (e.target.closest('.js-controls-ListView__checkbox')) {
            this._notify('checkBoxClick', [item, e]);
        } else if (item['[Controls/_display/GroupItem]']) {
            this._notify('groupClick', [item, e]);
        } else if (item['[Controls/_display/TreeItem]']) {
            this._notify('captionClick', [item, e]);
        } else if (!item.isEditing()) {
            this._notify('propertyItemClick', [item.getContents(), e]);
        }
    }

    protected _itemMouseDown(
        e: SyntheticEvent<MouseEvent>,
        item: TPropertyGridCollectionItem
    ): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemMouseDown', [item, e]);
        }
    }

    protected _itemMouseUp(e: SyntheticEvent<MouseEvent>, item: TPropertyGridCollectionItem): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemMouseUp', [item, e]);
        }
    }

    protected _toggleEditor(_event: SyntheticEvent, item: Model, value: boolean): void {
        this._notify('toggleEditor', [item, value]);
    }

    protected _propertyValueChanged(e: SyntheticEvent<Event>, item: Model, value: unknown): void {
        e.stopImmediatePropagation();
        this._notify('propertyValueChanged', [item, value]);
    }

    protected _validateFinished(_e: SyntheticEvent, name: string, validationResult: any): void {
        this._notify('validateFinished', [name, validationResult]);
    }

    static getDefaultOptions(): object {
        return {
            itemTemplate,
        };
    }
}
