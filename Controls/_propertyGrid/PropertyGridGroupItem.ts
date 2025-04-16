/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { GroupItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import {
    TPropertyGridCollection,
    TPropertyGridCollectionItem,
    Constants,
    IPropertyGrid,
} from 'Controls/propertyGridBase';

export default class PropertyGridGroupItem<
    T extends Model,
> extends GroupItem<TPropertyGridCollectionItem> {
    protected _$owner: TPropertyGridCollection;

    getToggleEditorsButtons(): T[] {
        const toggleButtons: T[] = [];

        this.getOwner()
            .getSourceCollection()
            .each((item: T) => {
                if (item.get(Constants.PROPERTY_TOGGLE_BUTTON_ICON_FIELD)) {
                    toggleButtons.push(item);
                }
            });

        return toggleButtons;
    }

    getTemplate(
        itemTemplateProperty: string,
        userItemTemplate: TemplateFunction | string,
        userGroupTemplate?: TemplateFunction | string,
        editorsToggleTemplate?: TemplateFunction
    ): TemplateFunction | string {
        if (this.getContents() === 'propertyGrid_toggleable_editors_group') {
            return editorsToggleTemplate;
        } else {
            return super.getTemplate(itemTemplateProperty, userItemTemplate, userGroupTemplate);
        }
    }

    isEditable(): boolean {
        return this.EditableItem;
    }

    getUid(): string {
        return `group-${this.getContents()}`;
    }

    /**
     * Возвращает ключ для итерации по item в шаблонном цикле
     * FIXME: ключ возвращается только для toggled редакторов
     */
    getItemKey(): string | null {
        return null;
    }

    getOwner(): TPropertyGridCollection {
        return super.getOwner() as TPropertyGridCollection;
    }

    getCaptionPosition(): IPropertyGrid.TCaptionPosition {
        return this.getOwner().getCaptionPosition();
    }
}

Object.assign(GroupItem.prototype, {
    '[Controls/_propertyGrid/PropertyGridGroupItem]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridGroupItem',
});
