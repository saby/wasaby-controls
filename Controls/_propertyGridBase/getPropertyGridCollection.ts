/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import {
    Collection,
    CollectionItem,
    GroupItem,
    ItemsFactory,
    ICollectionOptions,
} from 'Controls/display';
import { TToggledEditors } from 'Controls/_propertyGridBase/PropertyGrid';
import { TCaptionPosition, TEditingObject } from 'Controls/_propertyGridBase/IPropertyGrid';
import IProperty from 'Controls/_propertyGridBase/IProperty';
import { register } from 'Types/di';
import { Model } from 'Types/entity';

export interface IPropertyGridCollectionOptions<S extends Model, T extends CollectionItem<S>>
    extends ICollectionOptions<S, T> {
    toggledEditors?: TToggledEditors;
    editingObject: TEditingObject;
    captionPosition: TCaptionPosition;
}

export function getPropertyGridCollection<
    S extends Model,
    T extends CollectionItem<S> = CollectionItem<S>,
>(
    CollectionClass: typeof Collection,
    libraryName: string,
    PropertyGridGroupItem?: typeof GroupItem
) {
    class PropertyGridCollection extends CollectionClass<S, T> {
        protected _$toggledEditors: TToggledEditors;
        protected _$editingObject: TEditingObject;
        protected _$captionPosition: TCaptionPosition;
        protected _focusedEditor: string | null;
        protected _limit: number;

        constructor(options: IPropertyGridCollectionOptions<S, T>) {
            super(options);
            this._$toggledEditors = options.toggledEditors || {};
            this._$captionPosition = options.captionPosition;
            this._limitFilter = this._limitFilter.bind(this);
        }

        protected _getGroupItemConstructor(): new () => GroupItem<T> {
            if (PropertyGridGroupItem) {
                return PropertyGridGroupItem;
            }
            return super._getGroupItemConstructor();
        }

        setToggledEditors(toggledEditors: TToggledEditors): void {
            this._$toggledEditors = toggledEditors;
            this._nextVersion();
        }

        getToggledEditors(): TToggledEditors {
            return this._$toggledEditors;
        }

        setFocusedEditor(name: string | null): void {
            this._focusedEditor = name;
            this.nextVersion();
        }

        getFocusedEditor(): string | null {
            return this._focusedEditor;
        }

        setEditingObject(editingObject: TEditingObject): void {
            this._$editingObject = editingObject;
            this._updateItemsProperty(
                'setPropertyValue',
                this._$editingObject,
                `[Controls/_${libraryName}/PropertyGridCollectionItem]`
            );
            this.nextVersion();
        }

        getEditingObject(): TEditingObject {
            return this._$editingObject;
        }

        setCaptionPosition(captionPosition: TCaptionPosition): void {
            this._$captionPosition = captionPosition;
            this.nextVersion();
        }

        getCaptionPosition(): TCaptionPosition {
            return this._$captionPosition;
        }

        setLimit(limit: number): void {
            const filtered = this.getFilter().indexOf(this._limitFilter) > -1;
            const needFilter = !!limit;

            this._limit = limit;

            if (needFilter && !filtered) {
                return this.addFilter(this._limitFilter);
            }

            if (needFilter && filtered) {
                const session = this._startUpdateSession();
                this._reFilter();
                return this._finishUpdateSession(session);
            }

            if (!needFilter && filtered) {
                this.removeFilter(this._limitFilter);
            }
        }

        getLimit(): number {
            return this._limit;
        }

        hasLimit(): boolean {
            return !!this._limit;
        }

        protected _getItemsFactory(): ItemsFactory<T> {
            const superFactory = super._getItemsFactory();
            return function CollectionItemsFactory(options?: Record<string, unknown>): T {
                options.editingObject = this._$editingObject;
                options.keyProperty = this._$keyProperty;
                return superFactory.call(this, options);
            };
        }

        private _limitFilter(item: IProperty, index: number): boolean {
            return index <= this._limit;
        }
    }

    Object.assign(PropertyGridCollection.prototype, {
        [`[Controls/_${libraryName}/PropertyGridCollection]`]: true,
        _moduleName: `Controls/${libraryName}:PropertyGridCollection`,
        _itemModule: `Controls/${libraryName}:PropertyGridCollectionItem`,
        _$editingObject: null,
    });
    register(`Controls/${libraryName}:PropertyGridCollection`, PropertyGridCollection, {
        instantiate: false,
    });

    return PropertyGridCollection;
}
