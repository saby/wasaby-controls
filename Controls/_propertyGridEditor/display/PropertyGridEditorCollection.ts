/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import { ItemsFactory } from 'Controls/display';
import { ITreeCollectionOptions } from 'Controls/baseTree';
import { TreeGridCollection } from 'Controls/treeGrid';
import { default as CollectionItem } from './PropertyGridEditorCollectionItem';
import { IPropertyGrid } from 'Controls/propertyGrid';

export interface IPropertyGridCollectionOptions<S, T>
    extends ITreeCollectionOptions<S, T> {
    toggledEditors?: TToggledEditors;
    editingObject: IPropertyGrid.TEditingObject;
    captionPosition: IPropertyGrid.TCaptionPosition;
    jumpingLabel: boolean;
}

export type TToggledEditors = Record<string, boolean>;

export default class PropertyGridEditorCollection<
    S,
    T extends CollectionItem<S> = CollectionItem<S>
> extends TreeGridCollection<S, CollectionItem<S>> {
    protected _$toggledEditors: TToggledEditors;
    protected _$editingObject: IPropertyGrid.TEditingObject;
    protected _$captionPosition: IPropertyGrid.TCaptionPosition;
    protected _$jumpingLabel: boolean;
    protected _focusedEditor: string;

    constructor(options?: IPropertyGridCollectionOptions<S, T>) {
        super(options);
        this._$toggledEditors = options.toggledEditors || {};
        this._$captionPosition = options.captionPosition;
        this._$jumpingLabel = options.jumpingLabel;
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

    setEditingObject(editingObject: IPropertyGrid.TEditingObject): void {
        this._$editingObject = editingObject;
        this._updateItemsProperty(
            'setPropertyValue',
            this._$editingObject,
            '[Controls/_propertyGridEditor/PropertyGridEditorCollectionItem]'
        );
        this.nextVersion();
    }

    getEditingObject(): IPropertyGrid.TEditingObject {
        return this._$editingObject;
    }

    setCaptionPosition(captionPosition: IPropertyGrid.TCaptionPosition): void {
        this._$captionPosition = captionPosition;
        this.nextVersion();
    }

    getCaptionPosition(): IPropertyGrid.TCaptionPosition {
        return this._$captionPosition || 'left';
    }

    setJumpingLabel(active: boolean): void {
        this._$jumpingLabel = active;
    }

    getJumpingLabel(): boolean {
        return this._$jumpingLabel;
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
}

Object.assign(PropertyGridEditorCollection.prototype, {
    '[Controls/_propertyGridEditor/PropertyGridEditorCollection]': true,
    _moduleName: 'Controls/propertyGridEditor:PropertyGridEditorCollection',
    _itemModule: 'Controls/propertyGridEditor:PropertyGridEditorCollectionItem',
    _$editingObject: null,
});
