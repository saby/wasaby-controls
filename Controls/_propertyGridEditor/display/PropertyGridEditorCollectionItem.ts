/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import { TreeGridDataRow } from 'Controls/treeGrid';
import PropertyGridEditorCollection from './PropertyGridEditorCollection';
import { Enum } from 'Types/collection';
import * as getType from 'Core/helpers/getType';
import { Model } from 'Types/entity';
import { object } from 'Types/util';
import { IGridCollectionOptions } from 'Controls/grid';
import { IPropertyGrid, Constants } from 'Controls/propertyGrid';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { TBackgroundStyle } from 'Controls/interface';
import { IItemPadding } from 'Controls/display';

/**
 * Элемент коллеции propertyGrid
 *
 * @class Controls/_propertyGrid/PropertyGridCollectionItem
 * @extends Controls/_display/TreeItem
 * @public
 */

export default class PropertyGridCollectionItem<T> extends TreeGridDataRow<T> {
    protected _$owner: PropertyGridEditorCollection<T>;

    /**
     * Текущее значение элемента
     */
    protected _$propertyValue: unknown;

    /**
     * Имя свойства, содержащего информацию об идентификаторе элемента
     */
    protected _$keyProperty: string;

    constructor(options?: IGridCollectionOptions) {
        super(options);
        this._$keyProperty = options.keyProperty;
        this.setPropertyValue(options.editingObject);
    }

    getEditorTemplateName(): string {
        if (this.isNode()) {
            return null;
        }
        const itemContents = this.getContents();
        const editorTemplateName = itemContents.get('editorTemplateName');
        const type = itemContents.get('type');
        const propertyValue = this._$propertyValue;

        if (editorTemplateName || Constants.DEFAULT_EDITORS[type]) {
            return editorTemplateName || Constants.DEFAULT_EDITORS[type];
        }
        if (getType(propertyValue) === 'object') {
            if (propertyValue instanceof Enum) {
                return Constants.DEFAULT_EDITORS.enum;
            }
        }
        return Constants.DEFAULT_EDITORS[getType(propertyValue)];
    }

    getEditorClasses(): string {
        const itemContents = this.getContents();
        const classes = [];
        const editorClass = itemContents.get('editorClass');
        const caption = itemContents.get('caption');
        const captionPosition = this.getCaptionPosition();

        if (editorClass) {
            classes.push(editorClass);
        }

        if (!caption || captionPosition === 'top' || captionPosition === 'none') {
            classes.push('controls-PropertyGridEditor__editor-withoutCaption');
        }

        return classes.join(' ');
    }

    getItemPaddingClasses(
        gridColumnIndex?: number,
        templateCaptionPosition?: IPropertyGrid.TCaptionPosition
    ): string {
        const owner = this.getOwner();
        const itemContents = this.getContents();
        const editorOptions = itemContents.get('editorOptions');
        const captionPosition = templateCaptionPosition || this.getCaptionPosition();
        const totalColumns =
            !gridColumnIndex || captionPosition === 'top' || captionPosition === 'none' ? 1 : 2;

        let classes = `controls-PropertyGrid__editor_spacingTop_${owner.getTopPadding()}
                       controls-PropertyGrid__editor_spacingBottom_${owner.getBottomPadding()}`;
        if (gridColumnIndex !== 1 || totalColumns === 1) {
            classes += ` controls-PropertyGrid__editor_spacingRight_${owner.getRightPadding()}`;
        }
        if (
            gridColumnIndex !== 2 ||
            totalColumns === 1 ||
            !(itemContents.get('caption') || itemContents.get('isEditable')) ||
            editorOptions?.jumpingLabel
        ) {
            classes += ` controls-PropertyGrid__editor_spacingLeft_${owner.getLeftPadding()}`;
        }
        return classes;
    }

    getMultiSelectClasses(
        backgroundColorStyle: TBackgroundStyle = 'default',
        cursor: string = 'pointer',
        templateHighlightOnHover: boolean = true,
        itemPadding: IItemPadding = {},
        baseline: 'none' | 'default' = 'none'
    ): string {
        let classes = this._getMultiSelectBaseClasses();
        classes += this.getMultiSelectPositionClasses(itemPadding, baseline);
        return classes;
    }

    getCheckboxPaddingClasses(): string {
        const owner = this.getOwner();
        return `controls-PropertyGrid__editor_spacingTop_${owner.getTopPadding()}
                controls-PropertyGrid__editor_spacingBottom_${owner.getBottomPadding()}`;
    }

    isEditable(): boolean {
        return this.contents.get('isEditable') && !!(this.getEditorTemplateName() || this.isNode());
    }

    getEditorOptions(): object {
        const editorOptionsName = this.getContents().get('editorOptionsName');
        const editorOptions = this.getContents().get('editorOptions') || {};
        let resultEditorOptions;

        if (editorOptionsName) {
            if (isLoaded(editorOptionsName)) {
                const loadedEditorOptions = loadSync<Function | object>(editorOptionsName);

                if (loadedEditorOptions instanceof Function) {
                    resultEditorOptions = {
                        ...editorOptions,
                        ...loadedEditorOptions(editorOptions),
                    };
                } else {
                    resultEditorOptions = {
                        ...editorOptions,
                        ...loadedEditorOptions,
                    };
                }
            } else {
                resultEditorOptions = editorOptions;
            }
        } else {
            resultEditorOptions = editorOptions;
        }

        return resultEditorOptions;
    }

    getEditorReadOnly(templateReadOnly: boolean): boolean {
        const editorOptions = this.getEditorOptions();
        return editorOptions.hasOwnProperty('readOnly') ? editorOptions.readOnly : templateReadOnly;
    }

    getValidateTemplateName(): string {
        const type = this.getContents().get('type');
        const validators = this.getEditorValidators();
        if (validators) {
            return (
                this.getContents().get('validateTemplateName') ||
                Constants.DEFAULT_VALIDATORS_BY_TYPE[type] ||
                Constants.DEFAULT_VALIDATOR_TEMPLATE
            );
        }
        return '';
    }

    getValidateTemplateOptions(): Record<string, unknown> {
        return this.getContents().get('validateTemplateOptions') || {};
    }

    getEditorValidators(): Function[] | null {
        return this.getContents().get('validators');
    }

    getCaptionValidators(): (string | Function)[] {
        return this.getContents().get('captionValidators');
    }

    getUid(): string {
        return `property-grid-item-${this.getContents().get(this._$keyProperty)}`;
    }

    getPropertyValue(): unknown {
        return this._$propertyValue;
    }

    setPropertyValue(editingObject: Object | Model | Record<string, unknown>): void {
        const itemContents = this.getContents();
        this._$propertyValue = object.getPropertyValue(
            editingObject,
            itemContents.get(this._$keyProperty)
        );
        this._nextVersion();
    }

    getOwner(): PropertyGridEditorCollection<T> {
        return super.getOwner() as PropertyGridEditorCollection<T>;
    }

    getCaptionPosition(): IPropertyGrid.TCaptionPosition {
        const itemCaptionPosition = this.getContents().get('captionPosition');

        if (!!itemCaptionPosition) {
            return itemCaptionPosition;
        }

        return this.getOwner().getCaptionPosition();
    }

    isFocused(): boolean {
        const editorName = this.getOwner().getFocusedEditor();
        const currentName = this.getContents().get(this.getOwner().getKeyProperty());
        return editorName === currentName;
    }

    getJumpingLabel(): boolean {
        const itemJumpingLabel = this.contents.get('editorOptions')?.jumpingLabel;
        const collectionJumpingLabel = this.getOwner().getJumpingLabel();
        return itemJumpingLabel || collectionJumpingLabel;
    }
}

Object.assign(PropertyGridCollectionItem.prototype, {
    '[Controls/_propertyGridEditor/PropertyGridCollectionItem]': true,
    _moduleName: 'Controls/propertyGridEditor:PropertyGridCollectionItem',
});
