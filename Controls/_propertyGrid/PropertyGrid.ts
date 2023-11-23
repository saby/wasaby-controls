/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_propertyGrid/PropertyGrid';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as cInstance from 'Core/core-instance';
import { TreeItem } from 'Controls/baseTree';
import {
    GroupItem,
    CollectionItem,
    IEditableCollectionItem,
    groupConstants,
} from 'Controls/display';
import { IObservable, RecordSet } from 'Types/collection';
import { Model, Record as entityRecord } from 'Types/entity';
import { factory } from 'Types/chain';
import { object } from 'Types/util';
import { default as renderTemplate } from 'Controls/_propertyGrid/Render';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { default as gridRenderTemplate } from 'Controls/_propertyGrid/GridRender';
import {
    IPropertyGridOptions,
    TEditingObject,
    TCollapsedGroupsElement,
} from 'Controls/_propertyGrid/IPropertyGrid';
import { Move as MoveViewCommand, AtomicRemove as RemoveViewCommand } from 'Controls/viewCommands';
import { default as IPropertyGridItem, IValidatorArgs } from './IProperty';
import {
    EDIT_IN_PLACE_CANCEL,
    PROPERTY_GROUP_FIELD,
    PROPERTY_TOGGLE_BUTTON_ICON_FIELD,
} from './Constants';
import PropertyGridCollection from './PropertyGridCollection';
import PropertyGridCollectionItem from './PropertyGridCollectionItem';
import {
    IItemAction,
    Controller as ItemActionsController,
    IItemActionsItem,
} from 'Controls/itemActions';
import { Confirmation, StickyOpener } from 'Controls/popup';
import 'css!Controls/itemActions';
import 'css!Controls/propertyGrid';
import {
    FlatSelectionStrategy,
    IFlatSelectionStrategyOptions,
    ISelectionStrategy,
    ITreeSelectionStrategyOptions,
    SelectionController,
    TreeSelectionStrategy,
} from 'Controls/multiselection';
import { isEqual } from 'Types/object';
import { ISelectionObject, TKey } from 'Controls/interface';
import { CrudEntityKey, LOCAL_MOVE_POSITION, Memory } from 'Types/source';
import { detection, constants } from 'Env/Env';
import { IDragObject, ItemsEntity } from 'Controls/dragnDrop';
import {
    DndController,
    FlatStrategy,
    IDragStrategyParams,
    TreeStrategy,
} from 'Controls/listDragNDrop';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { Logger } from 'UI/Utils';
import type {
    Controller as EditInPlaceController,
    InputHelper as EditInPlaceInputHelper,
    TAsyncOperationResult,
    IBeforeBeginEditCallbackParams,
    IBeforeEndEditCallbackParams,
    IEditInPlaceOptions,
} from 'Controls/editInPlace';
import {
    Container as ValidateContainer,
    ControllerClass as ValidationController,
    IValidateResult,
} from 'Controls/validate';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { TBeforeMoveCallback } from 'Controls/baseList';
import { activate } from 'UICore/Focus';
import { ValidateContainer as PGValidateContainer } from './ValidateContainer';

const DRAGGING_OFFSET = 10;
const DRAG_SHIFT_LIMIT = 4;
const IE_MOUSEMOVE_FIX_DELAY = 50;
const ITEM_ACTION_SELECTOR = '.js-controls-ItemActions__ItemAction';

interface IEditingUserOptions {
    item?: Model;
}

export type TToggledEditors = Record<string, boolean>;
type TPropertyGridCollection = PropertyGridCollection<Model, PropertyGridCollectionItem<Model>>;
type TValidatorResultElement = string | boolean;
type TCollectionItem = CollectionItem<Model>;

interface IPropertyGridValidatorArguments {
    item: Model;
    collectionItem?: PropertyGridCollectionItem<Model>;
    collection: TPropertyGridCollection;
    validators: Function[];
    value: unknown;
}

/**
 * Интерфейс настроек перемещения.
 * @public
 */
export interface IPropertyGridMoveOptions {
    /**
     * @cfg {Controls/list:IMovableList/TBeforeMoveCallback.typedef} Функция, вызываемая до перемещения записи
     */
    beforeMoveCallback?: TBeforeMoveCallback;
    /**
     * Шаблон пустого представления диалога перемещения.
     */
    emptyTemplate?: TemplateFunction | string;
}

/**
 * Контрол, который позволяет пользователям просматривать и редактировать свойства объекта.
 *
 * @remark
 * Вы можете использовать стандартные редакторы PropertyGrid или специальные редакторы.
 * По умолчанию propertyGrid будет автоматически генерировать все свойства для данного объекта.
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IPropertyGrid
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/list:IRemovableList
 * @implements Controls/list:IMovableList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/interface:IItemsContainerPadding
 * @demo Controls-demo/PropertyGridNew/Group/Expander/Index
 *
 * @public
 */

/*
 * Represents a control that allows users to inspect and edit the properties of an object.
 * You can use the standard editors that are provided with the PropertyGrid or you can use custom editors.
 * By default the propertyGrid will autogenerate all the properties for a given object
 * @extends UI/Base:Control
 * @implements Controls/interface/IPropertyGrid
 * @mixes Controls/propertyGrid:IPropertyGrid
 *
 * @public
 * @author Герасимов А.М.
 */
export default class PropertyGridView extends Control<IPropertyGridOptions> {
    protected _template: TemplateFunction = template;
    protected _listModel: TPropertyGridCollection;
    protected _render: TemplateFunction = renderTemplate;
    protected _collapsedGroups: Record<string, boolean> = {};
    protected _toggledEditors: TToggledEditors = {};
    private _selectionController: SelectionController;
    private _itemActionsController: ItemActionsController;
    private _itemActionSticky: StickyOpener;
    private _collapsedGroupsChanged: boolean = false;
    private _editingObject: TEditingObject = null;
    private _dndController: DndController<PropertyGridCollectionItem<Model>>;
    private _draggedKey: CrudEntityKey = null;
    private _editInPlaceController: EditInPlaceController;
    private _editInPlaceInputHelper: EditInPlaceInputHelper;
    private _isPendingDeferredSubmit: boolean;
    private _validateController: ValidationController = null;
    private _itemMouseEntered: PropertyGridCollectionItem<Model> = null;
    private _unprocessedDragEnteredItem: PropertyGridCollectionItem<Model> = null;
    private _insideDragging: boolean = false;
    private _documentDragging: boolean = false;
    private _onLastMouseUpWasDrag: boolean = false;
    private _startEvent: MouseEvent = null;
    private _dragEntity: ItemsEntity = null;
    private _endDragNDropTimer = null;
    private _limitMode: boolean = false;
    private _editorsExpanded: boolean = false;
    private _validateContainer: PGValidateContainer;
    protected _children: {
        propertyGrid: HTMLElement;
        validateController: ValidationController;
    };

    protected _beforeMount(options: IPropertyGridOptions): void {
        const { selectedKeys } = options;
        this._collapsedGroups = this._getCollapsedGroups(options.collapsedGroups);
        this._toggledEditors = this._getToggledEditors(options);

        this._collectionChangedHandler = this._collectionChangedHandler.bind(this);
        this._limitFilter = this._limitFilter.bind(this);
        this._listModel = this._getCollection(options);
        this._subscribeOnModelChanged();

        if (options.captionColumnOptions || options.editorColumnOptions) {
            this._render = gridRenderTemplate;
        }
        if (options.multiSelectVisibility !== 'hidden' && selectedKeys?.length > 0) {
            this._getSelectionController(options).setSelection({
                selected: selectedKeys,
                excluded: options.excludedKeys,
            });
        }
        this._editingObject = options.editingObject;
        if (options.limit) {
            this._cutEditors(options.limit);
        }
    }

    protected _beforeUpdate(newOptions: IPropertyGridOptions): void {
        const {
            editingObject,
            typeDescription,
            itemPadding,
            collapsedGroups,
            captionPosition,
            multiSelectAccessibilityProperty,
            limit,
        } = newOptions;

        if (editingObject !== this._options.editingObject) {
            this._listModel.setEditingObject(editingObject);
            this._editingObject = editingObject;
        }

        if (typeDescription !== this._options.typeDescription) {
            const focusedEditor = this._listModel.getFocusedEditor();
            this._toggledEditors = this._getToggledEditors(newOptions);
            this._listModel = this._getCollection(newOptions);
            this._listModel.setFocusedEditor(focusedEditor);
            if (!!this._editInPlaceController) {
                this._editInPlaceController.updateOptions(this._getEditInPlaceControllerOptions());
            }
            if (!!this._itemActionsController && this._itemActionsController?.isActionsAssigned()) {
                this._updateItemActions(this._listModel, newOptions);
            }
            this._subscribeOnModelChanged();
        } else if (itemPadding !== this._options.itemPadding) {
            this._listModel.setItemPadding(itemPadding || {});
        }
        if (collapsedGroups !== this._options.collapsedGroups) {
            this._collapsedGroups = this._getCollapsedGroups(collapsedGroups);
            this._listModel.setCollapsedGroups(this._getCollapsedGroupsAsArray());
        }
        if (captionPosition !== this._options.captionPosition) {
            this._listModel.setCaptionPosition(captionPosition);
        }

        if (multiSelectAccessibilityProperty !== this._options.multiSelectAccessibilityProperty) {
            this._listModel.setMultiSelectAccessibilityProperty(multiSelectAccessibilityProperty);
        }

        if (limit !== this._listModel.getLimit() && !this._editorsExpanded) {
            this._cutEditors(limit);
        }

        this._limitMode = !!limit && limit < this._listModel.getCount();
        this._updateSelectionController(newOptions);
    }

    protected _afterUpdate(oldOptions: IPropertyGridOptions): void {
        if (this._collapsedGroupsChanged) {
            this._notify('controlResize', [], { bubbling: true });
            this._collapsedGroupsChanged = false;
        }

        // Запустить валидацию, которая была заказана методом commit у редактирования по месту, после
        // применения всех обновлений реактивных состояний.
        if (this._isPendingDeferredSubmit && this._validateController) {
            this._validateController.resolveSubmit();
            this._isPendingDeferredSubmit = false;
        }

        if (this._listModel.getFocusedEditor()) {
            this.activate();
            this._listModel.setFocusedEditor(null);
        }
    }

    protected _afterMount(): void {
        this._notify('register', ['documentDragStart', this, this._documentDragStart], {
            bubbling: true,
        });
        this._notify('register', ['documentDragEnd', this, this._documentDragEnd], {
            bubbling: true,
        });
        if (this._limitMode) {
            this._validateContainer = new PGValidateContainer({
                validateCallback: this._validate.bind(this),
            });
            this._notify('validateCreated', [this._validateContainer], {
                bubbling: true,
            });
        }
    }

    protected _afterRender(oldOptions?: IPropertyGridOptions, oldContext?: unknown): void {
        // Активация поля ввода должна происходить после рендера.
        if (
            this._editInPlaceController &&
            this._editInPlaceController.isEditing() &&
            !this._editInPlaceController.isEndEditProcessing()
        ) {
            this._activateEditingRow();
        }

        this._dndController?.afterRenderListControl();
    }

    protected _beforeUnmount(): void {
        if (this._options.itemsDragNDrop) {
            this._notify('_removeDraggingTemplate', [], { bubbling: true });
        }
        this._notify('unregister', ['documentDragStart', this], {
            bubbling: true,
        });
        this._notify('unregister', ['documentDragEnd', this], {
            bubbling: true,
        });
        if (this._validateController) {
            this._validateController.destroy();
            this._validateController = null;
        }
        this._notify('validateDestroyed', [this._validateContainer], {
            bubbling: true,
        });
        if (this._validateContainer) {
            this._validateContainer.destroy();
            this._validateContainer = null;
        }
    }

    private _getCollection(options: IPropertyGridOptions): TPropertyGridCollection {
        const propertyGridItems = this._getPropertyGridItems(
            options.typeDescription,
            options.keyProperty
        );
        return new PropertyGridCollection({
            collection: propertyGridItems,
            editingObject: options.editingObject,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty,
            keyProperty: propertyGridItems.getKeyProperty(),
            root: null,
            group: this._groupCallback.bind(this, options.groupProperty),
            filter: this._displayFilter.bind(this),
            toggledEditors: this._toggledEditors,
            itemPadding: options.itemPadding,
            multiSelectAccessibilityProperty: options.multiSelectAccessibilityProperty,
            multiSelectTemplate: options.multiSelectTemplate,
            multiSelectVisibility: options.multiSelectVisibility,
            multiSelectPosition: options.multiSelectPosition
                ? options.multiSelectPosition
                : 'default',
            jumpingLabel: options.jumpingLabel,
            captionPosition: options.captionPosition,
            collapsedGroups: this._getCollapsedGroupsAsArray(),
            unique: true,
        });
    }

    private _getToggledEditors({
        typeDescription,
        keyProperty,
        toggledEditors,
    }: IPropertyGridOptions): TToggledEditors {
        const result = {};
        let key;

        typeDescription.forEach((item) => {
            if (object.getPropertyValue(item, PROPERTY_TOGGLE_BUTTON_ICON_FIELD)) {
                key = object.getPropertyValue<string>(item, keyProperty);
                result[key] = toggledEditors ? toggledEditors.includes(key) : false;
            }
        });
        return result;
    }

    private _groupCallback(groupProperty: string, item: Model): string {
        return item.get(PROPERTY_TOGGLE_BUTTON_ICON_FIELD)
            ? 'propertyGrid_toggleable_editors_group'
            : item.get(groupProperty);
    }

    private _displayFilter(itemContents: Model | string): boolean {
        if (itemContents instanceof Model) {
            const name = itemContents.get(itemContents.getKeyProperty());
            return this._toggledEditors[name] !== false;
        }
        return itemContents !== groupConstants.hiddenGroup;
    }

    private _getCollapsedGroups(
        collapsedGroups: TCollapsedGroupsElement[] = []
    ): Record<string, boolean> {
        return collapsedGroups.reduce(
            (acc: Record<string, boolean>, key: string): Record<string, boolean> => {
                acc[key] = true;
                return acc;
            },
            {}
        );
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

    protected _updatePropertyValue(
        editingObject: TEditingObject,
        name: string,
        value: unknown
    ): Record<string, unknown> | entityRecord {
        let resultEditingObject;
        if (editingObject instanceof entityRecord) {
            resultEditingObject = editingObject;

            if (!resultEditingObject.has(name)) {
                const newEditingObject = factory(editingObject).toObject();
                newEditingObject[name] = value;
                const format = Model.fromObject(
                    newEditingObject,
                    resultEditingObject.getAdapter()
                ).getFormat();
                const propertyFormat = format.at(format.getFieldIndex(name));
                resultEditingObject.addField({
                    name: propertyFormat.getName(),
                    type: propertyFormat.getType(),
                    defaultValue: value,
                });
            }
            resultEditingObject.set(name, value);
            this._listModel.setEditingObject(resultEditingObject);
        } else {
            resultEditingObject = object.clone(editingObject);
            resultEditingObject[name] = value;
        }
        return resultEditingObject;
    }

    protected _propertyValueChanged(
        event: SyntheticEvent<Event>,
        item: Model,
        value: unknown
    ): void {
        const name = item.get(this._listModel.getKeyProperty());
        this._editingObject = this._updatePropertyValue(this._editingObject, name, value);
        this._notify('editingObjectChanged', [this._editingObject]);
    }

    protected _groupClick(
        event: SyntheticEvent<Event>,
        displayItem: GroupItem<Model> | PropertyGridCollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const isExpandClick = clickEvent?.target.closest('.controls-PropertyGrid__groupExpander');
        if (isExpandClick) {
            const groupName = displayItem.getContents();
            const collapsed = this._collapsedGroups[groupName];
            displayItem.toggleExpanded();
            this._collapsedGroups[groupName] = !collapsed;
            this._listModel.setCollapsedGroups(this._getCollapsedGroupsAsArray());
            this._collapsedGroupsChanged = true;
        }
    }

    // FIXME Для совместимости в 3100, надо перейти полностью на collapsedGroups в модели
    protected _getCollapsedGroupsAsArray(): TKey[] {
        return Object.keys(this._collapsedGroups).reduce((res, groupName) => {
            if (this._collapsedGroups[groupName]) {
                res.push(groupName);
            }
            return res;
        }, []);
    }

    protected _itemMouseDown(
        event: SyntheticEvent<Event>,
        displayItem: PropertyGridCollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (!!clickEvent.target.closest(ITEM_ACTION_SELECTOR)) {
            event.stopPropagation();
            return;
        }
        if (this._unprocessedDragEnteredItem) {
            this._unprocessedDragEnteredItem = null;
        }
        this._startDragNDrop(clickEvent, displayItem);
    }

    protected _itemMouseUp(e, displayItem, domEvent): void {
        this._draggedKey = null;
        if (this._dndController && !this._dndController.isDragging()) {
            this._dndController = null;
        }

        this._onLastMouseUpWasDrag = this._dndController && this._dndController.isDragging();
    }

    protected _itemMouseEnter(
        event: SyntheticEvent<Event>,
        displayItem: PropertyGridCollectionItem<Model>,
        domEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (this._dndController) {
            if (this._dndController.isDragging()) {
                this._listModel.setHoveredItem(null);
            }
            if (this._itemMouseEntered !== displayItem) {
                this._itemMouseEntered = displayItem;
                this._unprocessedDragEnteredItem = displayItem;
                this._processItemMouseEnterWithDragNDrop(domEvent, displayItem);
            }
        } else {
            if (!this._editInPlaceController?.isEditing()) {
                this._listModel.setHoveredItem(displayItem);
            }
        }
    }

    _itemMouseMove(event, displayItem, nativeEvent) {
        if (this._dndController && this._dndController.isDragging()) {
            this._draggingItemMouseMove(displayItem, nativeEvent);
        }
    }

    protected _itemMouseLeave() {
        if (!this._editInPlaceController?.isEditing()) {
            this._listModel.setHoveredItem(null);
        }
        if (this._dndController) {
            this._unprocessedDragEnteredItem = null;
        }
    }

    protected _mouseEnterHandler(): void {
        if (this._listModel) {
            this._dragEnter(this._getDragObject());
        }
        if (!this._editInPlaceController || !this._editInPlaceController.isEditing()) {
            this._getItemActionsController().then(() => {
                this._updateItemActions(this._listModel, this._options);
            });
        }
    }

    protected _itemActionMouseDown(
        event: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const contents: Model = item.getContents();
        if (action && !action['parent@'] && action.handler) {
            action.handler(contents);
        } else {
            this._openItemActionMenu(item, action, clickEvent);
        }
    }

    protected _itemContextMenu(
        event: SyntheticEvent<Event>,
        item: CollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        clickEvent.stopSyntheticEvent();
        this._openItemActionMenu(item, null, clickEvent);
    }

    protected _toggleEditor(event: SyntheticEvent, item: Model, value: boolean): void {
        const currentEditorName: string = item.get(this._listModel.getKeyProperty());
        this._toggledEditors = { ...this._toggledEditors };
        const oldToggledEditors = Object.keys(this._toggledEditors).reduce((acc, key) => {
            return !this._toggledEditors[key] ? acc.concat([key]) : acc;
        }, []);

        this._toggledEditors[currentEditorName] = value;
        this._listModel.setToggledEditors(this._toggledEditors);

        const newToggledEditors = Object.keys(this._toggledEditors).reduce((acc, key) => {
            return !this._toggledEditors[key] ? acc.concat([key]) : acc;
        }, []);

        const diff = ArraySimpleValuesUtil.getArrayDifference(oldToggledEditors, newToggledEditors);
        if (diff.removed && diff.removed.length === 1) {
            this._listModel.setFocusedEditor(diff.removed[0]);
        }
        this._notify('toggledEditorsChanged', [newToggledEditors, diff.added, diff.removed]);
        this._listModel.setFilter(this._displayFilter.bind(this));
    }

    private _openItemActionMenu(
        item: CollectionItem<Model>,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const isContextMenu = !action;
        const menuConfig = this._itemActionsController.prepareActionsMenuConfig(
            item,
            clickEvent,
            action,
            this,
            isContextMenu
        );
        if (menuConfig) {
            if (isContextMenu) {
                clickEvent.preventDefault();
            }
            if (!this._itemActionSticky) {
                this._itemActionSticky = new StickyOpener();
            }
            menuConfig.eventHandlers = {
                onResult: this._onItemActionsMenuResult.bind(this),
                onClose: () => {
                    this._itemActionsController.setActiveItem(null);
                },
            };
            this._itemActionSticky.open(menuConfig);
            this._itemActionsController.setActiveItem(item);
        }
    }

    private _getItemActionsController(): Promise<ItemActionsController> {
        if (!this._itemActionsController) {
            return import('Controls/itemActions').then(({ Controller }) => {
                this._itemActionsController = new Controller();
                return this._itemActionsController;
            });
        }
        return Promise.resolve(this._itemActionsController);
    }

    private _onItemActionsMenuResult(eventName: string, actionModel: Model): void {
        if (eventName === 'itemClick') {
            const action = actionModel && actionModel.getRawData();
            if (action && !action['parent@']) {
                const item = this._itemActionsController.getActiveItem();
                if (action.handler) {
                    action.handler(item.getContents());
                }
                this._itemActionSticky.close();
            }
        }
    }

    private _updateItemActions(
        listModel: TPropertyGridCollection,
        options: IPropertyGridOptions,
        editingItem?: IEditableCollectionItem & IItemActionsItem
    ): void {
        const itemActions: IItemAction[] = options.itemActions;
        if (!itemActions && !editingItem) {
            return;
        }
        this._itemActionsController.update({
            collection: listModel,
            itemActions,
            editingToolbarVisible: !!editingItem,
            itemActionsPosition: !!editingItem ? 'outside' : 'inside',
            contextMenuConfig: options.contextMenuConfig,
            editingItem,
            visibilityCallback: options.itemActionVisibilityCallback,
            style: 'default',
            theme: options.theme,
        });
    }

    private _getSelectionController(
        options: IPropertyGridOptions = this._options
    ): SelectionController {
        if (!this._selectionController) {
            const strategy = this._createSelectionStrategy(options, this._listModel);
            this._selectionController = new SelectionController({
                model: this._listModel,
                selectedKeys: options.selectedKeys,
                excludedKeys: options.excludedKeys,
                strategy,
            });
        }

        return this._selectionController;
    }

    private _updateSelectionController(newOptions: IPropertyGridOptions): void {
        const { selectedKeys, excludedKeys } = newOptions;
        const isTypeDescriptionChanged =
            newOptions.typeDescription !== this._options.typeDescription;
        const isUpdateNeeded =
            !isEqual(this._options.selectedKeys, selectedKeys) ||
            !isEqual(this._options.excludedKeys, excludedKeys) ||
            isTypeDescriptionChanged;

        if (isTypeDescriptionChanged || newOptions.multiSelectVisibility === 'hidden') {
            this._destroySelectionController();
        }

        if (isUpdateNeeded) {
            const controller = this._getSelectionController(newOptions);
            const newSelection =
                selectedKeys === undefined
                    ? controller.getSelection()
                    : {
                          selected: selectedKeys,
                          excluded: excludedKeys || [],
                      };
            controller.setSelection(newSelection);
        }
    }

    private _createSelectionStrategy(
        options: IPropertyGridOptions,
        collection: TPropertyGridCollection
    ): ISelectionStrategy {
        const strategyOptions = this._getSelectionStrategyOptions(options, collection);
        if (options.parentProperty) {
            return new TreeSelectionStrategy(strategyOptions as ITreeSelectionStrategyOptions);
        } else {
            return new FlatSelectionStrategy(strategyOptions);
        }
    }

    private _getSelectionStrategyOptions(
        { parentProperty, selectionType }: IPropertyGridOptions,
        collection: TPropertyGridCollection
    ): ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions {
        if (parentProperty) {
            return {
                rootKey: null,
                model: collection,
                selectionType: selectionType || 'all',
                recursiveSelection: false,
            };
        } else {
            return { model: collection };
        }
    }

    protected _checkboxClick(event: SyntheticEvent, item: PropertyGridCollectionItem<Model>): void {
        if (!item.isReadonlyCheckbox()) {
            const newSelection = this._getSelectionController().toggleItem(
                item.getContents().getKey()
            );
            this._changeSelection(newSelection);
        }
    }

    private _changeSelection(selection: ISelectionObject): void {
        const selectionController = this._getSelectionController();
        const selectionDifference = selectionController.getSelectionDifference(selection);

        if (this._options.selectedKeys === undefined) {
            this._getSelectionController().setSelection(selection);
        }

        const selectedDiff = selectionDifference.selectedKeysDifference;
        if (selectedDiff.added.length || selectedDiff.removed.length) {
            this._notify('selectedKeysChanged', [
                selectedDiff.keys,
                selectedDiff.added,
                selectedDiff.removed,
            ]);
        }

        const excludedDiff = selectionDifference.excludedKeysDifference;
        if (excludedDiff.added.length || excludedDiff.removed.length) {
            this._notify('excludedKeysChanged', [
                excludedDiff.keys,
                excludedDiff.added,
                excludedDiff.removed,
            ]);
        }
    }

    private _destroySelectionController(): void {
        if (this._selectionController) {
            this._selectionController.destroy();
            this._selectionController = null;
        }
    }

    private _subscribeOnModelChanged(): void {
        this._listModel.subscribe('onCollectionChange', this._collectionChangedHandler);
    }

    private _collectionChangedHandler(
        event: SyntheticEvent,
        action: string,
        newItems: TCollectionItem[],
        newItemsIndex: number,
        removedItems: TCollectionItem[]
    ): void {
        const options = this._options || {};
        const handleSelection =
            action === IObservable.ACTION_RESET &&
            options.selectedKeys &&
            options.selectedKeys.length &&
            options.multiSelectVisibility !== 'hidden';

        if (handleSelection) {
            const selectionController = this._getSelectionController();

            let newSelection;
            switch (action) {
                case IObservable.ACTION_REMOVE:
                    newSelection = selectionController.onCollectionRemove(...removedItems);
                    break;
                case IObservable.ACTION_REPLACE:
                    selectionController.onCollectionReplace(newItems);
                    break;
                case IObservable.ACTION_MOVE:
                    selectionController.onCollectionMove();
                    break;
            }

            if (newSelection) {
                this._changeSelection(newSelection);
            }
        }
    }

    _documentDragStart(dragObject: IDragObject): void {
        if (
            this._options.readOnly ||
            !this._options.itemsDragNDrop ||
            !(dragObject && dragObject.entity)
        ) {
            return;
        }

        if (this._insideDragging && this._draggedKey !== null) {
            this._dragStart(dragObject, this._draggedKey);
        }
        this._documentDragging = true;
    }

    _dragStart(dragObject: IDragObject, draggedKey: CrudEntityKey): void {
        this._dndController.startDrag(dragObject.entity);

        if (this._unprocessedDragEnteredItem) {
            this._processItemMouseEnterWithDragNDrop(
                dragObject.domEvent,
                this._unprocessedDragEnteredItem
            );
        }

        if (this._options.draggingTemplate && this._listModel.isDragOutsideList()) {
            this._notify('_updateDraggingTemplate', [dragObject, this._options.draggingTemplate], {
                bubbling: true,
            });
        }
    }

    _dragLeave(): void {
        this._insideDragging = false;
        if (this._dndController && this._dndController.isDragging()) {
            const draggableItem = this._dndController.getDraggableItem();
            if (
                draggableItem &&
                this._listModel.getItemBySourceKey(draggableItem.getContents().getKey())
            ) {
                const newPosition = this._dndController.calculateDragPosition({
                    targetItem: null,
                });
                this._dndController.setDragPosition(newPosition);
            } else {
                this._dndController.endDrag();
            }
        }
        this._listModel.setDragOutsideList(true);
    }

    _dragEnter(dragObject: IDragObject): void {
        this._insideDragging = true;
        if (this._documentDragging) {
            this._notify('_removeDraggingTemplate', [], { bubbling: true });
        }
        this._listModel.setDragOutsideList(false);

        if (this._dndController?.isDragging()) {
            return;
        }

        if (this._documentDragging) {
            if (
                dragObject &&
                cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')
            ) {
                const dragEnterResult = this._notify('customdragEnter', [dragObject.entity]);

                if (cInstance.instanceOfModule(dragEnterResult, 'Types/entity:Record')) {
                    const draggableItem = this._listModel.createItem({
                        contents: dragEnterResult,
                    });
                    this._dndController = this._createDndController(
                        this._listModel,
                        draggableItem,
                        this._options
                    );
                    this._dndController.startDrag(dragObject.entity);

                    let startPosition;
                    if (this._listModel.getCount()) {
                        const lastItem = this._listModel.getLast();
                        startPosition = {
                            index: this._listModel.getIndex(lastItem),
                            dispItem: lastItem,
                            position: 'after',
                        };
                    } else {
                        startPosition = {
                            index: 0,
                            dispItem: draggableItem,
                            position: 'before',
                        };
                    }

                    this._dndController.setDragPosition(startPosition);
                } else if (dragEnterResult === true) {
                    this._dndController = this._createDndController(
                        this._listModel,
                        null,
                        this._options
                    );
                    this._dndController.startDrag(dragObject.entity);
                }
            }
        }
    }

    _documentDragEnd(dragObject: IDragObject): void {
        this._documentDragging = false;

        if (!this._listModel || !this._dndController || !this._dndController.isDragging()) {
            return;
        }

        let dragEndResult: Promise<unknown> | undefined;
        if (this._insideDragging && this._dndController) {
            const targetPosition = this._dndController.getDragPosition();
            if (targetPosition && targetPosition.dispItem) {
                dragEndResult = this._notify('customdragEnd', [
                    dragObject.entity,
                    targetPosition.dispItem.getContents(),
                    targetPosition.position,
                ]);
            }
        }

        const endDrag = () => {
            this._dndController.endDrag();
            this._dndController = null;
        };

        if (this._dndController) {
            if (dragEndResult instanceof Promise) {
                dragEndResult.finally(() => {
                    endDrag();
                });
            } else {
                endDrag();
            }
        }

        this._insideDragging = false;
        this._draggedKey = null;
        this._listModel.setDragOutsideList(false);
    }

    private _startDragNDrop(
        event: SyntheticEvent<MouseEvent>,
        draggableItem: PropertyGridCollectionItem<Model>
    ): void {
        if (
            DndController.canStartDragNDrop(
                this._options.readOnly,
                this._options.itemsDragNDrop,
                undefined,
                event,
                this._dndController && this._dndController.isDragging()
            )
        ) {
            const draggableKey = draggableItem.getContents().getKey();

            this._dndController = this._createDndController(
                this._listModel,
                draggableItem,
                this._options
            );
            let dragStartResult = this._notify('customdragStart', [[draggableKey], draggableKey]);

            if (dragStartResult === undefined) {
                dragStartResult = new ItemsEntity({ items: [draggableKey] });
            }

            if (dragStartResult) {
                if (this._options.dragControlId) {
                    dragStartResult.dragControlId = this._options.dragControlId;
                }

                this._dragEntity = dragStartResult;
                this._draggedKey = draggableKey;
                this._startEvent = event.nativeEvent;

                this._clearSelectedText(this._startEvent);
                if (this._startEvent && this._startEvent.target) {
                    this._startEvent.target.classList.add('controls-DragNDrop__dragTarget');
                }

                this._registerMouseMove();
                this._registerMouseUp();
            }
        }
    }

    private _clearSelectedText(event): void {
        if (event.type === 'mousedown') {
            const selection = window.getSelection();
            if (selection.removeAllRanges) {
                selection.removeAllRanges();
            } else if (selection.empty) {
                selection.empty();
            }
        }
    }

    private _dragNDropEnded(event: SyntheticEvent): void {
        if (this._dndController && this._dndController.isDragging()) {
            const dragObject = this._getDragObject(event.nativeEvent, this._startEvent);
            this._notify('_documentDragEnd', [dragObject], { bubbling: true });
        } else {
            this._dndController = null;
        }
        if (this._startEvent && this._startEvent.target) {
            this._startEvent.target.classList.remove('controls-DragNDrop__dragTarget');
        }
        this._unregisterMouseMove();
        this._unregisterMouseUp();
        this._dragEntity = null;
        this._startEvent = null;
    }

    private _getDragObject(mouseEvent?, startEvent?): IDragObject {
        const result: IDragObject = {
            entity: this._dragEntity,
        };
        if (mouseEvent && startEvent) {
            result.domEvent = mouseEvent;
            result.position = this._getPageXY(mouseEvent);
            result.offset = this._getDragOffset(mouseEvent, startEvent);
            result.draggingTemplateOffset = DRAGGING_OFFSET;
        }
        return result;
    }

    private _registerMouseMove(): void {
        this._notify('register', ['mousemove', this, this._onMouseMove], {
            bubbling: true,
        });
        this._notify('register', ['touchmove', this, this._onTouchMove], {
            bubbling: true,
        });
    }

    private _unregisterMouseMove(): void {
        this._notify('unregister', ['mousemove', this], { bubbling: true });
        this._notify('unregister', ['touchmove', this], { bubbling: true });
    }

    private _registerMouseUp(): void {
        this._notify('register', ['mouseup', this, this._onMouseUp], {
            bubbling: true,
        });
        this._notify('register', ['touchend', this, this._onMouseUp], {
            bubbling: true,
        });
    }

    private _unregisterMouseUp(): void {
        this._notify('unregister', ['mouseup', this], { bubbling: true });
        this._notify('unregister', ['touchend', this], { bubbling: true });
    }

    private _onMouseMove(event): void {
        if (event.nativeEvent) {
            if (detection.isIE) {
                this._onMouseMoveIEFix(event);
            } else {
                if (!event.nativeEvent.buttons) {
                    this._dragNDropEnded(event);
                }
            }
            if (event.nativeEvent.buttons) {
                this._onMove(event.nativeEvent);
            }
        }
    }

    private _onMove(nativeEvent): void {
        if (this._startEvent) {
            const dragObject = this._getDragObject(nativeEvent, this._startEvent);
            if (
                (!this._dndController || !this._dndController.isDragging()) &&
                this._isDragStarted(this._startEvent, nativeEvent)
            ) {
                this._insideDragging = true;
                this._notify('_documentDragStart', [dragObject], {
                    bubbling: true,
                });
            }
            if (this._dndController && this._dndController.isDragging()) {
                const moveOutsideList = !this._container.contains(nativeEvent.target);
                if (moveOutsideList !== this._listModel.isDragOutsideList()) {
                    this._listModel.setDragOutsideList(moveOutsideList);
                }

                this._notify('dragMove', [dragObject]);
                if (this._options.draggingTemplate && this._listModel.isDragOutsideList()) {
                    this._notify(
                        '_updateDraggingTemplate',
                        [dragObject, this._options.draggingTemplate],
                        { bubbling: true }
                    );
                }
            }
        }
    }

    private _getPageXY(event): object {
        return DimensionsMeasurer.getMouseCoordsByMouseEvent(
            event.nativeEvent ? event.nativeEvent : event
        );
    }

    private _isDragStarted(startEvent, moveEvent): boolean {
        const offset = this._getDragOffset(moveEvent, startEvent);
        return Math.abs(offset.x) > DRAG_SHIFT_LIMIT || Math.abs(offset.y) > DRAG_SHIFT_LIMIT;
    }

    private _getDragOffset(moveEvent, startEvent): object {
        const moveEventXY = this._getPageXY(moveEvent);
        const startEventXY = this._getPageXY(startEvent);

        return {
            y: moveEventXY.y - startEventXY.y,
            x: moveEventXY.x - startEventXY.x,
        };
    }

    private _onMouseUp(event): void {
        if (this._startEvent) {
            this._dragNDropEnded(event);
        }
    }

    private _onMouseMoveIEFix(event): void {
        if (!event.nativeEvent.buttons && !this._endDragNDropTimer) {
            this._endDragNDropTimer = setTimeout(() => {
                this._dragNDropEnded(event);
            }, IE_MOUSEMOVE_FIX_DELAY);
        } else {
            clearTimeout(this._endDragNDropTimer);
            this._endDragNDropTimer = null;
        }
    }

    private _createDndController(
        model: TPropertyGridCollection,
        draggableItem: CollectionItem,
        options: unknown
    ): DndController<IDragStrategyParams> {
        let strategy;
        if (options.parentProperty) {
            strategy = TreeStrategy;
        } else {
            strategy = FlatStrategy;
        }
        return new DndController(model, draggableItem, strategy);
    }

    private _processItemMouseEnterWithDragNDrop(
        event: SyntheticEvent<MouseEvent>,
        item: any
    ): void {
        let dragPosition;
        const targetItem = item;
        if (this._dndController.isDragging()) {
            const targetElement = this._getTargetRow(event);
            const mouseOffsetInTargetItem = this._calculateMouseOffsetInItem(event, targetElement);
            dragPosition = this._dndController.calculateDragPosition({
                targetItem,
                mouseOffsetInTargetItem,
            });
            if (dragPosition) {
                const changeDragTarget = this._notify('changeDragTarget', [
                    this._dndController.getDragEntity(),
                    dragPosition.dispItem.getContents(),
                    dragPosition.position,
                ]);
                if (changeDragTarget !== false) {
                    this._dndController.setDragPosition(dragPosition);
                }
            }
            this._unprocessedDragEnteredItem = null;
        }
    }

    private _calculateMouseOffsetInItem(
        event: SyntheticEvent<MouseEvent>,
        targetElement: Element
    ): { top: number; bottom: number } {
        let result = null;

        if (targetElement) {
            const dragTargetRect = targetElement.getBoundingClientRect();
            result = { top: null, bottom: null };

            const mouseCoords = DimensionsMeasurer.getMouseCoordsByMouseEvent(event.nativeEvent);
            result.top = (mouseCoords.y - dragTargetRect.top) / dragTargetRect.height;
            result.bottom =
                (dragTargetRect.top + dragTargetRect.height - mouseCoords.y) /
                dragTargetRect.height;
        }

        return result;
    }

    private _draggingItemMouseMove(itemData: TreeItem, event: SyntheticEvent<MouseEvent>): void {
        const dispItem = itemData;
        const targetIsNotDraggableItem =
            this._dndController.getDraggableItem()?.getContents() !== dispItem.getContents();
        if (
            dispItem['[Controls/_display/TreeItem]'] &&
            dispItem.isNode() !== null &&
            targetIsNotDraggableItem
        ) {
            const targetElement = this._getTargetRow(event);
            const mouseOffsetInTargetItem = this._calculateMouseOffsetInItem(event, targetElement);
            const dragTargetPosition = this._dndController.calculateDragPosition({
                targetItem: dispItem,
                mouseOffsetInTargetItem,
            });

            if (dragTargetPosition) {
                const result = this._notify('changeDragTarget', [
                    this._dndController.getDragEntity(),
                    dragTargetPosition.dispItem.getContents(),
                    dragTargetPosition.position,
                ]);

                if (result !== false) {
                    this._dndController.setDragPosition(dragTargetPosition);
                }
            }
        }
    }

    private _getTargetRow(event: SyntheticEvent): Element {
        if (
            !event.target ||
            !event.target.classList ||
            !event.target.parentNode ||
            !event.target.parentNode.classList
        ) {
            return event.target;
        }

        const startTarget = event.target;
        let target = startTarget;

        const condition = () => {
            return !target.parentNode.classList.contains('controls-ListView__itemV');
        };

        while (condition()) {
            target = target.parentNode;

            // Условие выхода из цикла, когда controls-ListView__itemV не нашелся в родительских блоках
            if (
                !target.classList ||
                !target.parentNode ||
                !target.parentNode.classList ||
                target.classList.contains('controls-BaseControl')
            ) {
                target = startTarget;
                break;
            }
        }
        return target;
    }

    _getRemoveViewCommand(
        removeViewCommandClass: RemoveViewCommand,
        selection: ISelectionObject
    ): RemoveViewCommand {
        return new removeViewCommandClass({
            keyProperty: this._listModel.getKeyProperty(),
            items: this._listModel.getSourceCollection(),
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
            collection: this._listModel.getSourceCollection(),
            items: keys,
            root: null,
            direction,
            target,
            keyProperty: this._listModel.getKeyProperty(),
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
            keyProperty: this._listModel.getKeyProperty(),
            data: this._listModel.getSourceCollection().getRawData(),
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
                        keyProperty: this._listModel.getKeyProperty(),
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

    setFocusedEditor(editorName: string): void {
        this._listModel.setFocusedEditor(editorName);
    }

    // region limit
    private _limitFilter(item: IPropertyGridItem, index: number): boolean {
        return index <= this._options.limit ? true : false;
    }

    private _handleExpanderClick(): void {
        if (this._editorsExpanded) {
            this._cutEditors();
        } else {
            this._expandEditors();
        }
    }

    private _expandEditors(): void {
        this._listModel.setLimit(null);
        this._editorsExpanded = true;
    }

    private _cutEditors(limit: number = this._options.limit): void {
        if (limit >= this._listModel.getCount()) {
            return;
        }
        this._listModel.setLimit(limit);
        this._limitMode = true;
        this._editorsExpanded = false;
    }
    // endregion limit

    // region validate
    startValidation({
        item,
        collection,
        collectionItem,
        validators = [],
        value,
    }: IPropertyGridValidatorArguments): Promise<TValidatorResultElement[] | boolean> | boolean {
        let validatorResult: Promise<TValidatorResultElement[] | boolean> | boolean = true;

        if (!validators || !Array.isArray(validators)) {
            return validatorResult;
        }

        collection = collection ? collection : collectionItem.getOwner();

        // Когда запущено редактирование, то валидация должна запускаться у редактируемой записи
        if (!collection.isEditing() || (collectionItem && collectionItem.isEditing())) {
            const validatorArgs: IValidatorArgs = {
                value,
                item,
                items: collection.getSourceCollection(),
                editingObject: collection.getEditingObject(),
            };
            if (validators.length) {
                validatorResult = PropertyGridView._prepareValidators(validators).then(
                    (loadedValidators) => {
                        const errors = [];
                        loadedValidators.forEach((validatorFunc) => {
                            const localValidatorResult = validatorFunc(validatorArgs);
                            if (typeof localValidatorResult === 'string') {
                                errors.push(localValidatorResult);
                            }
                        });
                        return errors;
                    }
                );
            }
        }
        return validatorResult;
    }

    /**
     * Колбек для запуска валидации редакторов, скрытых по опции limit.
     * @remark Используется только для внутренних механизмов.
     * @return {Promise<string[] | null>}
     * @private
     */
    private async _validate(): Promise<string[] | null> {
        if (!this._limitMode) {
            return;
        }

        const validationResult = await this._children.validateController.submit();

        if (validationResult instanceof Error) {
            return [validationResult.message];
        }

        if (validationResult.hasErrors) {
            return validationResult;
        }

        if (!this._listModel.hasLimit()) {
            return;
        }
        const collection = this._listModel;
        const collectionIterator = collection.getSourceCollection().getEnumerator();
        const editingObject = collection.getEditingObject();
        const keyProperty = collection.getKeyProperty();
        while (collectionIterator.moveNext()) {
            const item = collectionIterator.getCurrent();

            if (
                item.get('editorOptions')?.readOnly === true ||
                item.get('validateTemplateOptions')?.readOnly === true
            ) {
                // не запускаем валидатор для редакторов с readOnly = true
                continue;
            }

            const validators = item.get('validators');
            if (validators && validators.length) {
                const value = object.getPropertyValue(editingObject, item.get(keyProperty));
                const errors = await this.startValidation({
                    item,
                    validators,
                    value,
                    collection,
                });

                if (Array.isArray(errors) && errors.length > 0) {
                    this._expandEditors();
                    return this._children.validateController.submit();
                }
            }
        }
    }

    protected _onValidateCreated(e: Event, control: ValidateContainer): void {
        if (this._limitMode) {
            // Останавливаем всплытие валидаторов, т.к. в режиме лимита валидируем весь PropertyGrid самостоятельно
            return e.stopPropagation();
        }
        this._getValidationController()
            .then((controller: ValidationController) => {
                controller.addValidator(control);
            })
            .catch((error) => {
                return error;
            });
    }

    protected _onValidateDestroyed(e: Event, control: ValidateContainer): void {
        if (this._validateController) {
            this._validateController.removeValidator(control);
        }
    }
    // endregion validate

    // region editInPlace
    protected _commitEditActionHandler(): TAsyncOperationResult {
        return this._commitEdit();
    }

    protected _cancelEditActionHandler(): TAsyncOperationResult {
        return this._cancelEdit();
    }

    protected _itemClick(e: SyntheticEvent, item: Model, originalEvent: SyntheticEvent): void {
        const collectionItem = this._listModel.getItemBySourceItem(item);
        const canEditByClick = !this._options.readOnly && collectionItem.isEditable();
        if (canEditByClick) {
            e.stopPropagation();

            this._beginEdit({ item }).then((result) => {
                if (!(result && result.canceled)) {
                    this._editInPlaceInputHelper.setClickInfo(originalEvent.nativeEvent, item);
                }
                return result;
            });
        } else {
            if (this._editInPlaceController) {
                this._commitEdit();
            }
            if (this._onLastMouseUpWasDrag) {
                // Если на mouseUp, предшествующий этому клику, еще работало перетаскивание,
                // то мы не должны нотифаить itemClick
                this._onLastMouseUpWasDrag = false;
                e.stopPropagation();
                return;
            }
            this._notify('itemClick', [item, originalEvent]);
        }
    }

    beginAdd(userOptions: IEditingUserOptions): Promise<void | { canceled: true }> {
        if (this._options.readOnly) {
            return PropertyGridView._rejectEditInPlacePromise('beginAdd');
        }
        return this._getItemActionsController().then(() => {
            this._updateItemActions(this._listModel, this._options);
            return this._beginAdd(userOptions);
        });
    }

    beginEdit(userOptions: IEditingUserOptions): Promise<void | { canceled: true }> {
        return this._beginEdit(userOptions);
    }

    private _cancelEdit(force: boolean = false): TAsyncOperationResult {
        if (!this._editInPlaceController) {
            return Promise.resolve();
        }
        if (this._options.readOnly) {
            return PropertyGridView._rejectEditInPlacePromise('cancelEdit');
        }
        return this._getEditInPlaceController().then((controller) => {
            controller.cancel(force).finally(() => {
                if (this._selectionController) {
                    this._selectionController.setSelection(
                        this._selectionController.getSelection()
                    );
                }
            });
        });
    }

    private _commitEdit(commitStrategy?: 'hasChanges' | 'all'): TAsyncOperationResult {
        if (!this._editInPlaceController) {
            return Promise.resolve();
        }
        if (this._options.readOnly) {
            return PropertyGridView._rejectEditInPlacePromise('commitEdit');
        }
        return this._getEditInPlaceController().then((controller) => {
            return controller.commit(commitStrategy);
        });
    }

    /**
     * Метод, фактически начинающий редактирование
     * @param userOptions
     * @private
     */
    private _beginEdit(userOptions: IEditingUserOptions): TAsyncOperationResult {
        this._listModel.setHoveredItem(null);
        return this._getEditInPlaceController()
            .then((controller) => {
                return controller.edit(userOptions);
            })
            .then((result) => {
                if (!result?.canceled) {
                    this._editInPlaceInputHelper.shouldActivate();
                    this._forceUpdate();
                }
                return result;
            });
    }

    /**
     * Метод, фактически начинающий добавление по месту
     * @param userOptions
     * @private
     */
    private _beginAdd(userOptions: IEditingUserOptions): TAsyncOperationResult {
        return this._getEditInPlaceController()
            .then((controller) => {
                return controller.add(userOptions, {
                    addPosition: 'bottom',
                    columnIndex: 0,
                    targetItem: undefined,
                });
            })
            .then((addResult) => {
                if (addResult && addResult.canceled) {
                    return addResult;
                }
                this._editInPlaceInputHelper.shouldActivate();
                this._forceUpdate();
            });
    }

    protected _onKeyDown(event: SyntheticEvent<KeyboardEvent>): TAsyncOperationResult {
        const editingItem =
            this._editInPlaceController && this._editInPlaceController.getEditableItem();
        if (!editingItem) {
            return;
        }
        // TODO: нужно реализовать полноценную поддержку управления с клавиатуры при редактировании по месту
        // https://online.sbis.ru/opendoc.html?guid=e93793bc-dc45-44f1-8d4f-8e33be5a158b&client=3
        switch (event.nativeEvent.keyCode) {
            case constants.key.enter:
                return this._commitEdit('all');
            case constants.key.esc:
                return this._cancelEdit();
        }
    }

    private _activateEditingRow(): void {
        const activator = () => {
            const editingItem = this._editInPlaceController.getEditableItem();
            const editingItemContainer = this._getElementByKeyFromContainer(editingItem.getUid());
            return editingItemContainer ? activate(editingItemContainer) : null;
        };

        this._editInPlaceInputHelper.activateInput(activator, this._listModel.beforeRowActivated);
    }

    private _getElementByKeyFromContainer(key: any): HTMLElement {
        const container = this._children.propertyGrid._container;
        const selector = `[item-key="${key}"]`;
        return container.querySelector(selector);
    }

    private _getEditInPlaceController(): Promise<EditInPlaceController> {
        if (!this._editInPlaceController) {
            return import('Controls/editInPlace').then(({ InputHelper, Controller }) => {
                this._editInPlaceInputHelper = new InputHelper();
                this._editInPlaceController = new Controller(
                    this._getEditInPlaceControllerOptions()
                );
                return this._editInPlaceController;
            });
        }
        return Promise.resolve(this._editInPlaceController);
    }

    private _getEditInPlaceControllerOptions(): IEditInPlaceOptions {
        return {
            mode: 'row',
            collection: this._listModel,
            onBeforeBeginEdit: this._beforeBeginEditCallback.bind(this),
            onAfterBeginEdit: this._afterBeginEditCallback.bind(this),
            onBeforeEndEdit: this._beforeEndEditCallback.bind(this),
            onAfterEndEdit: this._afterEndEditCallback.bind(this),
        };
    }

    private _beforeBeginEditCallback(params: IBeforeBeginEditCallbackParams): Promise<void> {
        // Если к нам не пришел новый добавляемый итем, то ругаемся
        if (!params.options?.item) {
            throw new Error(
                'You use list without source. So you need to manually create new item when processing an event beforeBeginEdit'
            );
        }
        return;
    }

    private _afterBeginEditCallback(item: IEditableCollectionItem, isAdd: boolean): Promise<void> {
        item.getContents().addField({
            name: 'editingValue',
            type: 'string',
            defaultValue: item.getPropertyValue(),
        });
        return this._getItemActionsController().then(() => {
            this._updateItemActions(this._listModel, this._options, item);
        });
    }

    private _beforeEndEditCallback(params: IBeforeEndEditCallbackParams): Promise<unknown> {
        if (!params.willSave) {
            return;
        }
        const oldName = params.item.getKey();
        return this._getValidationController()
            .then((controller: ValidationController) => {
                const submitPromise = controller.deferSubmit();
                this._isPendingDeferredSubmit = true;
                this._forceUpdate();
                return submitPromise;
            })
            .then((validationResult) => {
                for (const key in validationResult) {
                    if (validationResult.hasOwnProperty(key) && validationResult[key]) {
                        return EDIT_IN_PLACE_CANCEL;
                    }
                }
                this._notify('beforeEndEdit', params.toArray());
                const editingObject = this._listModel.getEditingObject();
                const name = params.item.getKey();
                const currentValue =
                    editingObject instanceof entityRecord
                        ? editingObject.get(name)
                        : editingObject[name];
                if (oldName !== name) {
                    if (editingObject instanceof entityRecord) {
                        if (editingObject.has(oldName)) {
                            editingObject.removeField(oldName);
                        }
                    } else if (editingObject[oldName]) {
                        delete editingObject[oldName];
                    }
                }
                const editingValue = params.item.get('editingValue');
                if (params.item.getFormat().getFieldIndex('editingValue') !== -1) {
                    params.item.removeField('editingValue');
                }

                if (params.willSave && params.isAdd) {
                    const collection =
                        this._listModel.getSourceCollection() as undefined as RecordSet;
                    if (typeof params.sourceIndex === 'number') {
                        collection.add(params.item, params.sourceIndex);
                    } else {
                        collection.append([params.item]);
                    }
                }
                if (params.willSave && (editingValue !== currentValue || oldName !== name)) {
                    this._propertyValueChanged(
                        null,
                        params.item,
                        editingValue !== undefined ? editingValue : ''
                    );
                }
            });
    }

    private _afterEndEditCallback(
        item: IEditableCollectionItem,
        isAdd: boolean,
        willSave: boolean
    ): void {
        this._notify('afterEndEdit', [item, isAdd, willSave]);
        this._notify('typeDescriptionChanged', [this._listModel.getSourceCollection()]);
        if (this._itemActionsController) {
            this._updateItemActions(this._listModel, this._options, item);
        }
    }

    private _getValidationController(): Promise<ValidationController> {
        if (!this._validateController) {
            return import('Controls/validate').then(({ ControllerClass }) => {
                if (!this._destroyed) {
                    return (this._validateController = new ControllerClass());
                } else {
                    return Promise.reject();
                }
            });
        }
        return Promise.resolve(this._validateController);
    }

    static defaultProps: Partial<IPropertyGridOptions> = {
        keyProperty: 'name',
        groupProperty: PROPERTY_GROUP_FIELD,
        levelPadding: false,
        itemsContainerPadding: {
            top: 'm',
            bottom: 'm',
            left: 'm',
            right: 'm',
        },
    };

    private static _rejectEditInPlacePromise(methodName: string): Promise<void> {
        const msg = `PropertyGrid is in readOnly mode. Can't use ${methodName}()!`;
        Logger.warn(msg);
        return Promise.reject(msg);
    }

    // endregion editInPlace

    private static _prepareValidators(validators: (string | Function)[] = []): Promise<Function[]> {
        const resultValidators = [];
        const loadingValidators = [];
        validators.forEach((validator) => {
            if (typeof validator === 'string') {
                loadingValidators.push(loadAsync(validator));
            } else {
                resultValidators.push(validator);
            }
        });
        return Promise.all(loadingValidators).then((loadedValidators) => {
            return resultValidators.concat(loadedValidators);
        });
    }

    static getDefaultPropertyGridItem(): IPropertyGridItem {
        return {
            name: undefined,
            caption: undefined,
            editorTemplateName: undefined,
            editorOptions: undefined,
            editorClass: undefined,
            type: undefined,
            group: groupConstants.hiddenGroup,
            propertyValue: undefined,
        };
    }
}
