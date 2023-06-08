/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { ItemsFactory } from 'Controls/display';
import { ITreeCollectionOptions, Tree } from 'Controls/baseTree';
import PropertyGridCollectionItem from 'Controls/_propertyGrid/PropertyGridCollectionItem';
import PropertyGridGroupItem from 'Controls/_propertyGrid/PropertyGridGroupItem';
import TToggledEditors from './PropertyGrid';
import {
    TCaptionPosition,
    TEditingObject,
} from 'Controls/_propertyGrid/IPropertyGrid';
import IProperty from 'Controls/_propertyGrid/IProperty';

export interface IPropertyGridCollectionOptions<S, T>
    extends ITreeCollectionOptions<S, T> {
    toggledEditors?: TToggledEditors;
    editingObject: TEditingObject;
    captionPosition: TCaptionPosition;
}

export default class PropertyGridCollection<
    S,
    T extends PropertyGridCollectionItem<S> = PropertyGridCollectionItem<S>
> extends Tree<S, PropertyGridCollectionItem<S>> {
    protected _$toggledEditors: TToggledEditors;
    protected _$editingObject: TEditingObject;
    protected _$captionPosition: TCaptionPosition;
    protected _focusedEditor: string;
    protected _limit: number;

    constructor(options?: IPropertyGridCollectionOptions<S, T>) {
        this._$toggledEditors = options.toggledEditors || {};
        super(options);
        this._$captionPosition = options.captionPosition;
        this._limitFilter = this._limitFilter.bind(this);
    }

    protected _getGroupItemConstructor(): new () => PropertyGridGroupItem<S> {
        return PropertyGridGroupItem;
    }

    setToggledEditors(toggledEditors: TToggledEditors): void {
        this._$toggledEditors = toggledEditors;
        this._nextVersion();
    }

    getToggledEditors(): TToggledEditors {
        return this._$toggledEditors;
    }

    setFocusedEditor(name: string): void {
        this._focusedEditor = name;
        this.nextVersion();
    }

    getFocusedEditor(): string {
        return this._focusedEditor;
    }

    setEditingObject(editingObject: TEditingObject): void {
        this._$editingObject = editingObject;
        this._updateItemsProperty(
            'setPropertyValue',
            this._$editingObject,
            '[Controls/_propertyGrid/PropertyGridCollectionItem]'
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
        return function CollectionItemsFactory(
            options?: Record<string, unknown>
        ): T {
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
    '[Controls/_propertyGrid/PropertyGridCollection]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridCollection',
    _itemModule: 'Controls/propertyGrid:PropertyGridCollectionItem',
    _$editingObject: null,
});
