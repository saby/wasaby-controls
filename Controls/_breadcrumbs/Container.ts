/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_breadcrumbs/Container';
import { Path, NewSourceController as SourceController } from 'Controls/dataSource';
import { IDragObject } from 'Controls/dragnDrop';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import * as cInstance from 'Core/core-instance';

interface IDataOptionsValue {
    sourceController?: SourceController;
    keyProperty: string;
    parentProperty: string;
    root: string;
}

interface IContainerOptions extends IControlOptions {
    _dataOptionsValue: IDataOptionsValue;
    sourceController?: SourceController;
}

export default class BreadCrumbsContainer extends Control<IContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _sourceController: SourceController;
    protected _breadCrumbsItems: Path;
    protected _root: string;
    protected _topRoot: string;
    protected _keyProperty: string;
    protected _parentProperty: string;
    protected _hoveredBreadCrumb: string;
    protected _dragOnBreadCrumbs: boolean = false;
    protected _breadCrumbsDragHighlighter: Function;

    protected _beforeMount(options: IContainerOptions): void {
        this._breadCrumbsDragHighlighter = this._dragHighlighter.bind(this);
        this._updateBreadCrumbsItems = this._updateBreadCrumbsItems.bind(this);
        this._root = BreadCrumbsContainer._getRoot(options);
        this._keyProperty = BreadCrumbsContainer._getKeyProperty(options);
        this._parentProperty = BreadCrumbsContainer._getParentProperty(options);

        this._setBreadCrumbsItems(options);
    }

    protected _beforeUpdate(options: IContainerOptions): void {
        this._setBreadCrumbsItems(options);
    }

    protected _beforeUnmount(): void {
        this._unsubscribeItemsChanged();
    }

    protected _itemClickHandler(e: SyntheticEvent, item: Model): void {
        const result = this._notify('breadCrumbsItemClick', [item.getKey(), item], {
            bubbling: true,
        });
        if (result === false) {
            return;
        }
        if (this._sourceController && this._options.sourceController) {
            this._sourceController.setExpandedItems([]);
            this._sourceController.setRoot(item.getKey());
            this._sourceController.reload();
        } else {
            this._notify('rootChanged', [item.getKey()], { bubbling: true });
        }
    }

    protected _hoveredCrumbChanged(event: SyntheticEvent, item: Model): void {
        this._hoveredBreadCrumb = item ? item.getKey() : undefined;

        // If you change hovered bread crumb, must be called installed in the breadcrumbs highlighter,
        // but is not called, because the template has no reactive properties.
        this._forceUpdate();
    }

    protected _dragHighlighter(itemKey: TKey, hasArrow: boolean): string {
        return this._dragOnBreadCrumbs && this._hoveredBreadCrumb === itemKey && itemKey !== 'dots'
            ? 'controls-BreadCrumbsView__dropTarget_' + (hasArrow ? 'withArrow' : 'withoutArrow')
            : '';
    }

    protected _documentDragStart(event: SyntheticEvent, dragObject: IDragObject): void {
        this._hoveredBreadCrumb = undefined;

        if (
            this._options.itemsDragNDrop &&
            this._parentProperty &&
            cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')
        ) {
            this._dragOnBreadCrumbs =
                dragObject.entity.dragControlId ===
                    this._sourceController.getState().dragControlId &&
                !this._dragItemsFromRoot(dragObject.entity.getItems());
        }
    }

    protected _documentDragEnd(event: SyntheticEvent, dragObject: IDragObject): void {
        if (this._hoveredBreadCrumb !== undefined) {
            // TODO https://online.sbis.ru/doc/66393efb-415f-46f0-aed0-3921edbe3306?client=3
            this._notify('listDragEnd', [dragObject.entity, this._hoveredBreadCrumb, 'on'], {
                bubbling: true,
            });
            this._notify('customdragEnd', [dragObject.entity, this._hoveredBreadCrumb, 'on']);
        }
        this._dragOnBreadCrumbs = false;
    }

    private _getTopRoot(): string {
        // Если есть хлебные крошки, то получаем top root из них.
        // В противном случае просто возвращаем текущий root
        if (this._breadCrumbsItems && this._breadCrumbsItems.length) {
            return this._breadCrumbsItems[0].get(this._parentProperty);
        } else {
            return this._root;
        }
    }

    private _dragItemsFromRoot(dragItems: TKey[]): boolean {
        let itemFromRoot = true;
        if (this._sourceController) {
            const items = this._sourceController.getItems();

            dragItems.forEach((key) => {
                const item = items.getRecordById(key);

                if (!item || item.get(this._parentProperty) !== this._topRoot) {
                    itemFromRoot = false;
                }
            });
        }

        return itemFromRoot;
    }

    private _subscribeItemsChanged(sourceController: SourceController): void {
        this._unsubscribeItemsChanged();
        this._sourceController = sourceController;
        this._sourceController.subscribe('itemsChanged', this._updateBreadCrumbsItems);
        this._sourceController.subscribe('breadcrumbsDataChanged', this._updateBreadCrumbsItems);
    }

    private _unsubscribeItemsChanged(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('itemsChanged', this._updateBreadCrumbsItems);
            this._sourceController.unsubscribe('breadcrumbsDataChanged', this._updateBreadCrumbsItems);
        }
    }

    private _updateBreadCrumbsItems(): void {
        this._breadCrumbsItems = this._sourceController.getState().breadCrumbsItems;
        this._topRoot = this._getTopRoot();
    }

    private _setBreadCrumbsItems(options: IContainerOptions): void {
        const dataOptions = BreadCrumbsContainer._getContextOptions(options);

        const isUpdated = this._updateSourceControllerSubscribe(options, dataOptions);

        if (isUpdated) {
            this._updateBreadCrumbsItems();
        }
    }

    private _updateSourceControllerSubscribe(
        options: IContainerOptions,
        dataOptions?: IDataOptionsValue
    ): boolean {
        const sourceController = options.sourceController || dataOptions?.sourceController;
        if (this._sourceController !== sourceController && sourceController) {
            this._subscribeItemsChanged(sourceController);
            return true;
        }
    }

    private static _getContextOptions(options: IContainerOptions): IDataOptionsValue {
        if (options.id) {
            return options._dataOptionsValue.listsConfigs[options.id];
        }
        return options._dataOptionsValue?._dataSyntheticStoreId || options._dataOptionsValue;
    }

    private static _getRoot(options: IContainerOptions): string {
        return (
            BreadCrumbsContainer._getContextOptions(options)?.root ||
            (options.sourceController && options.sourceController.getRoot())
        );
    }

    private static _getKeyProperty(options: IContainerOptions): string {
        return (
            BreadCrumbsContainer._getContextOptions(options)?.keyProperty ||
            (options.sourceController && options.sourceController.getKeyProperty())
        );
    }

    private static _getParentProperty(options: IContainerOptions): string {
        return (
            BreadCrumbsContainer._getContextOptions(options)?.parentProperty ||
            (options.sourceController && options.sourceController.getParentProperty())
        );
    }
}

/**
 * Контейнер для Controls.breadcrumbs:HeadingPath. Используется для работы с хлебными крошками вне {@link Controls/explorer:View}
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать хлебные крошки со списком, используйте {@link Controls-ListEnv/breadcrumbs:View}.
 * @class Controls/_breadcrumbs/Container
 * @public
 */

/**
 * Экземпляр класса загрузчика данных {@link Controls/dataSource:NewSourceController}.
 * @name Controls/_breadcrumbs/Container#sourceCotroller
 * @cfg {Controls/dataSource/NewSourceController.typedef}
 * @remark
 * Если вы используете {@link Controls/_browser/interface/IBrowser Browser}, то sourceController следует указывать в его опциях.
 * Если ваша страница строится на технологии sabyPage, то sourceController необходимо получить из результатов {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/ предзагрузки}.
 */

/**
 * Определяет, может ли пользователь перемещать элементы в хлебные крошки с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ drag'n'drop}. Когда опция установлена в значение true, перемещение разрешено.
 * @name Controls/_breadcrumbs/Container#itemsDragNDrop
 * @cfg {Boolean}
 * @default false
 */

/**
 * @event Controls/_breadcrumbs/Container#rootChanged Происходит при изменении корня иерархии.
 * @param {eventObject} event Дескриптор события.
 * @param {String|Number} root Идентификатор корневой записи.
 */

/**
 * @event Controls/_breadcrumbs/Container#breadCrumbsItemClick Происходит при клике по хлебной крошке.
 * @param {eventObject} event Дескриптор события.
 * @param {String|Number} key Идентификатор записи крошки.
 * @param {Types/entity:Record} item Запись крошки.
 */

/**
 * @event Controls/_breadcrumbs/Container#customdragEnd Происходит при завершении перемещения элемента списка в крошку.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Объект перемещения.
 * @param {Types/entity:Record} target Запись крошки, в которую перемещают объект.
 * @param {MovePosition} position Положение перемещения.
 */
