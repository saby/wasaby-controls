/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { TemplateFunction } from 'UI/Base';
import {
    PropertyGrid,
    TPropertyGridCollectionConstructor,
    IPropertyGridOptions,
} from 'Controls/propertyGridBase';
import { default as gridRenderTemplate } from 'Controls/_propertyGrid/GridRender';
import * as groupTemplate from 'wml!Controls/_propertyGrid/Render/resources/groupTemplate';
import * as toggleEditorsTemplate from 'wml!Controls/_propertyGrid/Render/resources/toggleEditorsGroupTemplate';
import PropertyGridCollection from 'Controls/_propertyGrid/PropertyGridCollection';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

export default class PropertyGridView extends PropertyGrid {
    protected _groupTemplate: TemplateFunction = groupTemplate;
    protected _toggleEditorsTemplate: TemplateFunction = toggleEditorsTemplate;
    protected getRenderTemplate(options: IPropertyGridOptions): TemplateFunction {
        if (options.captionColumnOptions || options.editorColumnOptions) {
            return gridRenderTemplate;
        }
        return super.getRenderTemplate(options);
    }

    protected getPropertyGridCollectionConstructor(): TPropertyGridCollectionConstructor {
        return PropertyGridCollection;
    }

    protected _setExpandedItemsToValidate(validateItemKey: TKey): void {
        const expandedItems = this._getExpandedItems();
        if (!expandedItems.includes(validateItemKey)) {
            expandedItems.push(validateItemKey);
        }
        const expandedItemParents = this._getItemParentsKeys(
            validateItemKey,
            [],
            this._listModel.getSourceCollection()
        );
        this._listModel.setExpandedItems(expandedItems.concat(expandedItemParents));
    }

    private _getItemParentsKeys(itemKey: TKey, itemsKeys: TKey[], collection: RecordSet): TKey[] {
        const parentKey = collection
            .getRecordById(itemKey as string)
            .get(this._options.parentProperty as string) as TKey;
        if (parentKey) {
            itemsKeys.push(parentKey);
            return this._getItemParentsKeys(parentKey, itemsKeys, collection);
        }
        return itemsKeys;
    }
}
