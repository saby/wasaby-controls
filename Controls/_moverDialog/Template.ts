/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { Model, descriptor } from 'Types/entity';
import { ICrudPlus, CrudEntityKey, QueryWhereExpression } from 'Types/source';
import { create as diCreate } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'Vdom/Vdom';
import rk = require('i18n!Controls');

import { TColumns, ColumnTemplate, IColumn } from 'Controls/grid';
import { Direction, IHierarchyOptions, TKeysSelection } from 'Controls/interface';

import * as Template from 'wml!Controls/_moverDialog/Template/Template';
import * as MoverColumnTemplate from 'wml!Controls/_moverDialog/Template/CellTemplate';
import * as EmptyTemplate from 'wml!Controls/_moverDialog/Template/EmptyTemplate';

import 'css!Controls/moverDialog';

export interface IMoverDialogTemplateOptions extends IControlOptions, IHierarchyOptions {
    displayProperty?: string;
    root?: string | number;
    searchParam: string;

    // @deprecated
    showRoot?: boolean;

    rootVisible?: boolean;
    columns: TColumns;
    expandedItems: [];
    movedItems: TKeysSelection;
    source: ICrudPlus;
    keyProperty: string;
    nodeProperty: string;
    parentProperty: string;
    filter?: QueryWhereExpression<unknown>;
    headingCaption?: string;
    rootTitle: string;
    rootLabelVisible?: boolean;
    dataLoadCallback?: (items: RecordSet, direction?: Direction) => void;
}

interface IMoverColumnTemplateOptions {
    rootLabelVisible?: boolean;
    defaultColumnTemplate?: TemplateFunction | string;
    rootKey: number;
}

/**
 * Ключ рутовой записи. Должен быть числовым, т.к. при добавлении в рекордсет
 * всегда происходит попытка привести значение к типу.
 * При неправильном приведении типов в рекордсет добавится Null
 */
const ROOT_KEY = 3141592653589793;

/**
 * Шаблон диалогового окна, используемый в списках при перемещении элементов для выбора целевой папки.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FtreeGridNew%2FMover%2FExtended%2FIndex демо-пример с расширенным окном перемещения}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/commands/move/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_moveDialog.less переменные тем оформления}
 *
 * @class Controls/_moverDialog/Template
 * @extends UI/Base:Control
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISource
 * @implements Controls/grid:IGridControl
 * @implements Controls/tree:ITree
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/explorer:IExplorer
 * @implements Controls/interface:INavigation
 *
 * @public
 */

export default class MoverDialogTemplate extends Control<IMoverDialogTemplateOptions> {
    protected _template: TemplateFunction = Template;
    protected _root: string | number;
    protected _expandedItems: any[];
    protected _searchValue: string = '';
    protected _filter: QueryWhereExpression<unknown>;
    private _columns: TColumns;
    private _width: number = 0;

    get columns(): TColumns {
        return this._columns;
    }

    protected _beforeMount(options: IMoverDialogTemplateOptions): void {
        this._root = options.root;
        this._filter = options.filter;
        // expandedItems могут передавать из вне (и менять его).
        // При этом expandedItems могут и не передать, но при этом должен работать разворот папок
        this._expandedItems = options.expandedItems;

        // Пока поддерживаем обе опции
        if (options.showRoot) {
            Logger.error(
                'MoverDialog: Опция showRoot устарела и будет удалена в 5100. Необходимо использовать опцию rootVisible',
                this
            );
        }

        this._columns = this._initColumns(options);

        this._onItemClick = this._onItemClick.bind(this);
        this._itemsFilterMethod = this._itemsFilterMethod.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    protected _afterMount(options?: IMoverDialogTemplateOptions, context?: object): void {
        this._setMinWidth();
    }

    protected _beforeUpdate(options: IMoverDialogTemplateOptions): void {
        if (this._options.expandedItems !== options.expandedItems) {
            this._expandedItems = options.expandedItems;
        }
    }

    protected _afterUpdate(oldOptions?: IMoverDialogTemplateOptions, oldContext?: object): void {
        this._setMinWidth();
    }

    resetSearch(): void {
        this._searchValue = '';
    }

    // Перезагрузить внутренний explorer
    reload(...args: unknown[]): void {
        return this._children.explorer.reload.call(this, ...args);
    }

    // Перезагрузить элемент списка
    reloadItem(...args: unknown[]): void {
        return this._children.explorer.reloadItem.call(this, ...args);
    }

    // Возвращает ключ родителя, в котором по-умолчанию следует начинать добавление по месту.
    getMarkedNodeKey(): CrudEntityKey {
        return this._children.explorer.getMarkedNodeKey();
    }

    protected _itemsFilterMethod(items: Model | Model[]): boolean {
        let result = true;
        const item = Array.isArray(items) ? items[items.length - 1] : items;

        if (item.get) {
            result = this._options.movedItems.indexOf(item.get(this._options.keyProperty)) === -1;
        }

        return result;
    }

    protected _onItemClick(event: SyntheticEvent<MouseEvent>, item: Model): void {
        this._applyMove(item.getKey() === ROOT_KEY ? this._options.root : item);
    }

    protected _onMarkedKeyChanged(
        event: SyntheticEvent<null>,
        newKey: string | number | null
    ): void {
        return this._notify('markedKeyChanged', [newKey]);
    }

    protected _onBeforeMarkedKeyChanged(
        event: SyntheticEvent<null>,
        newKey: string | number | null
    ): void {
        return this._notify('beforeMarkedKeyChanged', [newKey]);
    }

    protected _onAfterItemCollapse(
        event: SyntheticEvent<null>,
        items: string[] | number[]
    ): unknown {
        return this._notify('afterItemCollapse', [items]);
    }

    protected _onAfterItemExpand(event: SyntheticEvent<null>, items: string[] | number[]): unknown {
        return this._notify('afterItemExpand', [items]);
    }

    // Сбрасываем текущую ширину у контейнера, чтобы он поменял ширину
    protected _resetWidth(): void {
        this._container.style.width = null;
    }

    // Устанавливаем новую ширину только если она больше, чем предыдущая
    protected _setMinWidth(): void {
        const width = this._container.getBoundingClientRect().width;
        const cssWidth = parseInt(getComputedStyle(this._container).width, 10);
        if (width > this._width) {
            this._width = width;
            // Устанавливаем минимальную ширину, потому что мы не должны ни при каких обстоятельствах уменьшать окно.
            // Иначе будут прыжки при переходе в режим поиска.
            this._container.style.minWidth = `${this._width}px`;
        }
        if (cssWidth !== this._width) {
            this._container.style.width = `${this._width}px`;
        }
    }

    protected _applyMove(item: Model | string | number): void {
        this._notify('sendResult', [item], { bubbling: true });
        this._notify('close', [], { bubbling: true });
    }

    protected _dataLoadCallback(items: RecordSet, direction: Direction): void {
        if (
            (!this._searchValue || this._searchValue.length === 0) &&
            (this._options.showRoot || this._options.rootVisible) &&
            !items.getRecordById(ROOT_KEY) &&
            items.getFormat().getCount()
        ) {
            items.add(this._getRootRecord(items), 0);
        }
        if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback(items, direction);
        }
    }

    protected _getEmptyTemplate(): TemplateFunction {
        return this._options.emptyTemplate || EmptyTemplate;
    }

    /**
     * Возвращает корневую запись для списка
     * @param items
     * @private
     */
    private _getRootRecord(items: RecordSet): Model {
        const record = this._getItemModel(items);
        const keyProperty = this._options.keyProperty || items.getKeyProperty();
        record.set({
            [this._options.parentProperty]: this._root,
            [this._options.nodeProperty]: null,
            [keyProperty]: ROOT_KEY,
            [this._columns[0].displayProperty]: this._options.rootTitle || rk('В корень'),
        });
        return record;
    }

    /**
     * Получает объект по конструктору модели для текущего рекордсета
     * @param items
     * @private
     */
    private _getItemModel(items: RecordSet): Model {
        const modelCtor = items.getModel();
        const modelConfig = {
            keyProperty: items.getKeyProperty(),
            format: items.getFormat(),
            adapter: items.getAdapter(),
        };
        return typeof modelCtor === 'string'
            ? diCreate(modelCtor, modelConfig)
            : new modelCtor(modelConfig);
    }

    private _initColumns(options: IMoverDialogTemplateOptions): IColumn[] {
        const columns = options.columns?.slice() ?? [{} as IColumn];
        const column = columns[0];
        column.textOverflow = 'ellipsis';

        if (!column.displayProperty) {
            Logger.warn(
                'MoverDialog: В колонках диалога перемещения необходимо указать displayProperty',
                this
            );
            column.displayProperty = options.displayProperty;
        }

        if (options.rootVisible || options.showRoot) {
            if (!options.rootTitle) {
                Logger.warn(
                    'MoverDialog: Для диалога перемещения необходимо указать опцию rootTitle',
                    this
                );
            }
            const templateOptions: IMoverColumnTemplateOptions = {
                ...column.templateOptions,
                rootLabelVisible: options.rootLabelVisible !== false && !!options.rootTitle,
                rootKey: ROOT_KEY,
            };

            if (!templateOptions.defaultColumnTemplate) {
                templateOptions.defaultColumnTemplate = column.template || ColumnTemplate;
            }

            column.templateOptions = templateOptions;
            column.template = MoverColumnTemplate;
        }
        return columns;
    }

    static getDefaultOptions = (): object => {
        return {
            root: null,
            displayProperty: 'title',
            filter: {},
        };
    };

    static getOptionTypes(): object {
        return {
            parentProperty: descriptor(String).required(),
            nodeProperty: descriptor(String).required(),
        };
    }
}

/**
 * @name Controls/_moverDialog/Template#displayProperty
 * @cfg {String} Имя поля элемента, данные которого используются для правильной работы <a href="/doc/platform/developmentapl/interface-development/controls/bread-crumbs/">Хлебных крошек</a>.
 * @remark По умолчанию title. Свойство не должно быть readonly.
 */

/**
 * @name Controls/_moverDialog/Template#root
 * @cfg {String} Идентификатор корневого узла.
 * @default null
 */

/**
 * @name Controls/_moverDialog/Template#searchParam
 * @cfg {String} Имя поля, по данным которого происходит поиск.
 * @remark
 * Настройка нужна для правильной работы строки поиска.
 * Значение опции передаётся в контроллер поиска {@link Controls/search:Controller}.
 * Подробнее о работе поиска и фильтрации в Wasaby читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/">руководстве разработчика</a>.
 */

/**
 * @name Controls/_moverDialog/Template#rootVisible
 * @cfg {Boolean} Разрешить перемещение записей в корень иерархии.
 * @default false
 * @remark
 * - true Отображается кнопка "В корень" над списком. Клик по кнопке перемещает записи в корень иерархии (см. {@link /materials/DemoStand/app/Controls-demo%2FOperationsPanel%2FDemo демо-пример}).
 * - false Кнопка скрыта.
 */

/**
 * @name Controls/_moverDialog/Template#rootTitle
 * @cfg {String} Заголовок корневой записи.
 */

/**
 * @name Controls/_moverDialog/Template#rootLabelVisible
 * @cfg {Boolean} Флаг, позволяющий включить или отключить пометку "(в корень)"
 * @default true
 */

/**
 * @name Controls/_moverDialog/Template#headingCaption
 * @cfg {String} Заголовок окна перемещения.
 * @default 'Куда переместить'
 */

/**
 * @name Controls/_moverDialog/Template#sendResult
 * @event Происходит при выборе раздела для перемещения записей.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Раздел, куда перемещаются выбранные записи.
 * @remark
 * Выбор раздела производится кликом по записи или хлебной крошке.
 * Клик по папке не производит выбора раздела для перемещения.
 * Событие всплываемое (см. <a href="/doc/platform/developmentapl/interface-development/ui-library/events/">Работа с событиями</a>).
 * Событие происходит непосредственно перед событием {@link close}.
 * @see close
 */

/**
 * @name Controls/_moverDialog/Template#close
 * @event Происходит при закрытии диалога перемещения записей.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @remark
 * Событие всплываемое (см. <a href="/doc/platform/developmentapl/interface-development/ui-library/events/">Работа с событиями</a>).
 * Событие происходит непосредственно после события sendResult.
 * @see sendResult
 */
