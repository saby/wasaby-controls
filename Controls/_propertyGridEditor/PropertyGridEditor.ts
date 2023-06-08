/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */

import { Control, TemplateFunction } from 'UI/Base';
import { EventUtils, SyntheticEvent } from 'UI/Events';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Memory, LOCAL_MOVE_POSITION } from 'Types/source';

import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { Move as MoveViewCommand, AtomicRemove as RemoveViewCommand } from 'Controls/viewCommands';
import { ISelectionObject, TKey } from 'Controls/interface';
import { Confirmation } from 'Controls/popup';
import { ItemsEntity } from 'Controls/dragnDrop';

import {
    IProperty as IPropertyGridItem,
    IPropertyGridMoveOptions,
    PropertyGridCollection,
    PropertyGridCollectionItem,
    IPropertyGrid,
} from 'Controls/propertyGrid';

import { IPropertyGridEditorOptions } from './IPropertyGridEditor';

import * as template from 'wml!Controls/_propertyGridEditor/PropertyGridEditor';
import * as editorColumnTemplate from 'wml!Controls/_propertyGridEditor/render/editorColumn';
import * as captionColumnTemplate from 'wml!Controls/_propertyGridEditor/render/captionColumn';

import 'css!Controls/propertyGridEditor';

type TPropertyGridEditorCollection = PropertyGridCollection<PropertyGridCollectionItem<Model>>;

/**
 * Контрол, который позволяет пользователям просматривать и редактировать свойства объекта.
 *
 * @extends UI/Base:Control
 * @demo Controls-demo/PropertyGridEditor/Caption/CaptionPosition/Index
 * @public
 */
export default class PropertyGridEditor extends Control<IPropertyGridEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _editingConfig: object = null;
    protected _items: RecordSet<IPropertyGridItem>;
    protected _columns: IColumn[];
    protected _captionPosition: string;
    protected _notifyHandler: Function = EventUtils.tmplNotify;

    protected _beforeMount(options: IPropertyGridEditorOptions): void {
        this._colspanCallback = this._colspanCallback.bind(this);

        const { typeDescription, keyProperty, captionPosition } = options;

        this._items = this._getPropertyGridItems(typeDescription, keyProperty);
        this._columns = this._getGridColumns(
            options.captionColumnOptions,
            options.editorColumnOptions
        );
        this._captionPosition = captionPosition;
    }

    protected _beforeUpdate(options: IPropertyGridEditorOptions): void {
        const { typeDescription, editingObject, keyProperty, captionPosition, jumpingLabel } =
            options;

        if (captionPosition !== this._captionPosition) {
            this._captionPosition = captionPosition;
            this._getViewModel().setCaptionPosition(captionPosition);
        }
        if (typeDescription !== this._options.typeDescription) {
            this._items = this._getPropertyGridItems(typeDescription, keyProperty);
        }
        if (editingObject !== this._options.editingObject) {
            this._getViewModel().setEditingObject(editingObject);
        }
        if (jumpingLabel !== this._options.jumpingLabel) {
            this._getViewModel().setJumpingLabel(jumpingLabel);
        }
    }

    private _getPropertyGridItems(
        items: IPropertyGridItem[] | RecordSet<IPropertyGridItem>,
        keyProperty: string
    ): RecordSet<IPropertyGridItem> {
        if (items instanceof RecordSet) {
            return items;
        }
        return new RecordSet({
            rawData: items,
            keyProperty,
        });
    }

    private _getGridColumns(
        captionColumnOptions: IPropertyGrid.IPropertyGridColumnOptions,
        editorColumnOptions: IPropertyGrid.IPropertyGridColumnOptions
    ): IColumn[] {
        return [
            {
                displayProperty: 'caption',
                template: captionColumnTemplate,
                width: captionColumnOptions?.width,
                compatibleWidth: captionColumnOptions?.compatibleWidth,
                textOverflow: 'ellipsis',
                fontSize: 'm',
            },
            {
                displayProperty: 'type',
                template: editorColumnTemplate,
                editable: false,
                width: editorColumnOptions?.width,
                compatibleWidth: editorColumnOptions?.compatibleWidth,
                fontSize: 'm',
            },
        ];
    }

    private _getViewModel(): TPropertyGridEditorCollection {
        return this._children.listRender.getViewModel();
    }

    /**
     * Рассчитывает необходимость расширения первой колонки таблицы.
     * @param item
     * @protected
     */
    protected _colspanCallback(item: Model): TColspanCallbackResult {
        if (
            this._captionPosition === 'top' ||
            this._captionPosition === 'none' ||
            this._options.jumpingLabel
        ) {
            return 'end';
        }
        const collectionItem = this._getViewModel().getItemBySourceItem(item);
        if (collectionItem && !collectionItem.getEditorTemplateName()) {
            return 'end';
        }
    }

    protected _typeDescriptionChanged(typeDescription: any): void {
        this._notify('typeDescriptionChanged', typeDescription);
    }

    protected _onDragStart(
        event: SyntheticEvent,
        items: string[],
        draggedKey: string
    ): ItemsEntity | void {
        event.stopPropagation();
        return this._notify('customdragStart', [[draggedKey], draggedKey]) as ItemsEntity | void;
    }

    protected _onDragEnd(
        event: SyntheticEvent,
        items: string[],
        target: Model,
        position: string
    ): ItemsEntity | void {
        event.stopPropagation();
        return this._notify('customdragEnd', [items, target, position]) as ItemsEntity | void;
    }

    removeItems(
        selection: ISelectionObject,
        removeConfirmationText?: string
    ): Promise<void | boolean> {
        const resultSelection = {
            selected: selection.selected || [],
            excluded: selection.excluded || [],
        };

        const callViewCommand = (result) => {
            return this._executeRemoveViewCommand(resultSelection).then(() => {
                return result;
            });
        };

        // Будет поправлено по: https://online.sbis.ru/opendoc.html?guid=3fa1742e-6d85-4689-b7d1-c08d7923a15a
        if (removeConfirmationText) {
            return Confirmation.openPopup({
                type: 'yesno',
                style: 'default',
                message: removeConfirmationText,
            }).then((result) => {
                if (result) {
                    return callViewCommand(result);
                } else {
                    return result;
                }
            });
        }
        return callViewCommand(true);
    }

    moveItems(keys: TKey[], target: Model, position: LOCAL_MOVE_POSITION): void {
        return this._executeMoveViewCommand(keys, position, target);
    }

    moveItemUp(key: TKey): void {
        return this._executeMoveViewCommand([key], LOCAL_MOVE_POSITION.Before);
    }

    moveItemDown(key: TKey): void {
        return this._executeMoveViewCommand([key], LOCAL_MOVE_POSITION.After);
    }

    moveWithDialog(
        selection: ISelectionObject,
        moveOptions?: IPropertyGridMoveOptions
    ): Promise<void> {
        let movedItems = [];
        let resultTarget = null;
        const displayProperty = 'caption';
        const source = new Memory({
            keyProperty: this._getViewModel().getKeyProperty(),
            data: this._getViewModel().getSourceCollection().getRawData(),
            filter: (item, where): boolean => {
                const searchFilterValue = where[displayProperty];
                return (
                    !!item.get(this._options.nodeProperty) &&
                    (!searchFilterValue ||
                        item
                            .get(displayProperty)
                            ?.toLowerCase()
                            .includes(searchFilterValue.toLowerCase()))
                );
            },
        });

        const beforeMoveCallback = (
            currentSelection: ISelectionObject,
            target: Model
        ): boolean | Promise<void> => {
            movedItems = currentSelection.selected;
            resultTarget = target;

            if (moveOptions?.beforeMoveCallback) {
                return moveOptions.beforeMoveCallback(currentSelection, target);
            }
        };

        return import('Controls/listCommands').then(({ MoveWithDialog }) => {
            const moveCommand = new MoveWithDialog({
                source,
                selection,
                parentProperty: this._options.parentProperty,
                popupOptions: {
                    template: 'Controls/moverDialog:Template',
                    opener: this,
                    templateOptions: {
                        parentProperty: this._options.parentProperty,
                        nodeProperty: this._options.nodeProperty,
                        keyProperty: this._getViewModel().getKeyProperty(),
                        rootVisible: true,
                        displayProperty,
                        columns: [
                            {
                                displayProperty,
                            },
                        ],
                        searchParam: displayProperty,
                        source,
                        emptyTemplate: moveOptions?.emptyTemplate,
                    },
                    beforeMoveCallback,
                },
            });
            return moveCommand.execute({}).then(() => {
                this._executeMoveViewCommand(movedItems, LOCAL_MOVE_POSITION.On, resultTarget);
            });
        });
    }

    _getRemoveViewCommand(
        removeViewCommandClass: RemoveViewCommand,
        selection: ISelectionObject
    ): RemoveViewCommand {
        return new removeViewCommandClass({
            keyProperty: this._getViewModel().getKeyProperty(),
            items: this._getViewModel().getSourceCollection(),
            selection,
        });
    }

    _getMoveViewCommand(
        moveViewCommandClass: MoveViewCommand,
        keys: TKey[],
        direction: LOCAL_MOVE_POSITION,
        target?: Model
    ): MoveViewCommand {
        return new moveViewCommandClass({
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            collection: this._getViewModel().getSourceCollection(),
            items: keys,
            root: null,
            direction,
            target,
            keyProperty: this._getViewModel().getKeyProperty(),
        });
    }

    _executeMoveViewCommand(keys: TKey[], direction: LOCAL_MOVE_POSITION, target?: Model): void {
        if (!isLoaded('Controls/viewCommands:Move')) {
            loadAsync<MoveViewCommand>('Controls/viewCommands:Move').then(
                (moveViewCommandClass) => {
                    this._getMoveViewCommand(
                        moveViewCommandClass,
                        keys,
                        direction,
                        target
                    ).execute();
                }
            );
        } else {
            const moveViewCommandClass = loadSync<MoveViewCommand>('Controls/viewCommands:Move');
            this._getMoveViewCommand(moveViewCommandClass, keys, direction, target).execute();
        }
    }

    _executeRemoveViewCommand(selection: ISelectionObject): Promise<unknown> {
        if (!isLoaded('Controls/viewCommands:AtomicRemove')) {
            return loadAsync<RemoveViewCommand>('Controls/viewCommands:AtomicRemove').then(
                (removeViewCommandClass) => {
                    return this._getRemoveViewCommand(removeViewCommandClass, selection).execute(
                        {}
                    );
                }
            );
        } else {
            const removeViewCommandClass = loadSync<RemoveViewCommand>(
                'Controls/viewCommands:AtomicRemove'
            );
            return this._getRemoveViewCommand(removeViewCommandClass, selection).execute({});
        }
    }

    static defaultProps: Partial<IPropertyGridEditorOptions> = {
        keyProperty: 'name',
    };
}
