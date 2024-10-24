/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { TreeItem } from 'Controls/baseTree';
import PropertyGridCollection from './PropertyGridCollection';
import {
    DEFAULT_EDITORS,
    DEFAULT_VALIDATORS_BY_TYPE,
    DEFAULT_VALIDATOR_TEMPLATE,
} from './Constants';
import { Enum } from 'Types/collection';
import * as getType from 'Core/helpers/getType';
import { Model } from 'Types/entity';
import { object } from 'Types/util';
import { IGridCollectionOptions } from 'Controls/grid';
import { TCaptionPosition } from 'Controls/_propertyGrid/IPropertyGrid';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import type { IEditorProps } from 'Controls/propertyGridEditors';

/**
 * Элемент коллеции propertyGrid
 *
 * @extends Controls/_display/TreeItem
 * @public
 */

export default class PropertyGridCollectionItem<T> extends TreeItem<T> {
    protected _$owner: PropertyGridCollection<T>;

    /**
     * Текущее значение элемента
     */
    protected _$propertyValue: unknown;

    /**
     * Имя свойства, содержащего информацию об идентификаторе элемента
     */
    protected _$keyProperty: string;

    /**
     * Функция-колбек, которая определяет необходимость отображения свойства в редакторе. В функцию первым аргументом
     * передается текущее редактируемое состояние
     */
    protected _$visibilityCallback: Function;

    constructor(options?: IGridCollectionOptions) {
        super(options);
        this._$keyProperty = options.keyProperty;
        this.setPropertyValue(options.editingObject);
    }

    isFirstNode(): boolean {
        const firstItem = this.getOwner().at(0);
        return (
            this.isNode() &&
            (this.index === 0 ||
                (this.index === 1 && (firstItem.isHiddenGroup() || !firstItem.contents)))
        );
    }

    isVisible(): boolean {
        let visible = true;
        const contents = this.getContents();
        const visibilityCallback = contents && contents.get('visibilityCallback');

        if (visibilityCallback) {
            let visibilityCallbackFn;

            if (typeof visibilityCallback === 'string') {
                visibilityCallbackFn = loadSync<Function>(visibilityCallback);
            } else {
                visibilityCallbackFn = visibilityCallback;
            }

            visible = visibilityCallbackFn(this.getOwner().getEditingObject());
        }

        return visible;
    }

    getEditorTemplateName(): string {
        if (this.isNode()) {
            return null;
        }
        const itemContents = this.getContents();
        const editorTemplateName = itemContents.get('editorTemplateName');
        const type = itemContents.get('type');
        const propertyValue = this._$propertyValue;

        if (editorTemplateName || DEFAULT_EDITORS[type]) {
            return editorTemplateName || DEFAULT_EDITORS[type];
        }
        if (getType(propertyValue) === 'object') {
            if (propertyValue instanceof Enum) {
                return DEFAULT_EDITORS.enum;
            }
        }
        return DEFAULT_EDITORS[getType(propertyValue)];
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
            classes.push('controls-PropertyGrid__editor-withoutCaption');
        }

        return classes.join(' ');
    }

    getItemPaddingClasses(
        gridColumnIndex?: number,
        templateCaptionPosition?: TCaptionPosition
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

    getCheckboxPaddingClasses(): string {
        const owner = this.getOwner();
        return `controls-PropertyGrid__editor_spacingTop_${owner.getTopPadding()}
                controls-PropertyGrid__editor_spacingBottom_${owner.getBottomPadding()}`;
    }

    isEditable(): boolean {
        return this.contents.get('isEditable') && !!(this.getEditorTemplateName() || this.isNode());
    }

    getEditorOptions(): object {
        return PropertyGridCollectionItem.getEditorOptions(this.getContents());
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
                DEFAULT_VALIDATORS_BY_TYPE[type] ||
                DEFAULT_VALIDATOR_TEMPLATE
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

    /**
     * Возвращает ключ для итерации по item в шаблонном цикле
     * FIXME: ключ возвращается только для toggled редакторов
     * https://online.sbis.ru/opendoc.html?guid=2e6f483c-6761-4a66-bdb7-a9bd52fdaa5c
     */
    getItemKey(): string | null {
        return this.isToggled()
            ? `property-grid-item-${this.getContents().get(this._$keyProperty)}`
            : null;
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

    getOwner(): PropertyGridCollection<T> {
        return super.getOwner() as PropertyGridCollection<T>;
    }

    getCaptionPosition(): TCaptionPosition {
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

    isToggled(): boolean {
        const toggledEditors = this.getOwner().getToggledEditors();
        const editorName = this.getContents().get(this._$keyProperty);
        return toggledEditors && toggledEditors.hasOwnProperty(editorName);
    }

    static getEditorOptions(item: Model): IEditorProps<unknown> {
        const editorOptionsName = item.get<string>('editorOptionsName');
        const editorOptions = item.get('editorOptions') || {};
        let resultEditorOptions = {
            ...editorOptions,
            captionOptions: item.get('captionOptions'),
        };

        if (editorOptionsName) {
            if (isLoaded(editorOptionsName)) {
                const loadedEditorOptions = loadSync<Function | object>(editorOptionsName);

                if (loadedEditorOptions instanceof Function) {
                    resultEditorOptions = {
                        ...resultEditorOptions,
                        ...loadedEditorOptions(resultEditorOptions),
                    };
                } else {
                    resultEditorOptions = {
                        ...resultEditorOptions,
                        ...loadedEditorOptions,
                    };
                }
            }
        }

        return resultEditorOptions;
    }
}

Object.assign(PropertyGridCollectionItem.prototype, {
    '[Controls/_propertyGrid/PropertyGridCollectionItem]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridCollectionItem',
});
