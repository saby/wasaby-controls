// eslint-disable max-lines

/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import {
    DestroyableMixin,
    IInstantiable,
    ISerializableState as IDefaultSerializableState,
    IVersionable,
    ObservableMixin,
    SerializableMixin,
    Model,
} from 'Types/entity';
import { IList } from 'Types/collection';
import { mixin, object } from 'Types/util';
import { isEqual } from 'Types/object';
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { InstantiableMixin } from './InstantiableMixin';
import type { StickyVerticalPosition } from 'Controls/stickyBlock';
import { ICollectionItemStyled } from './interface/ICollectionItemStyled';
import type { TAnimationState, ICollection, IItemPadding } from './interface/ICollection';
import {
    ICollectionItem,
    TBorderVisibility,
    TMarkerSize,
    TShadowVisibility,
    TBorderStyle,
} from './interface/ICollectionItem';
import IMarkable from './interface/IMarkable';
import {
    IItemCompatibilityListViewModel,
    ItemCompatibilityListViewModel,
} from './ItemCompatibilityListViewModel';
import { IEditableCollectionItem } from './interface/IEditableCollectionItem';
import Collection, { IEditingConfig, TItemActionsPosition } from 'Controls/_display/Collection';
import IItemActionsItem from './interface/IItemActionsItem';
import IEnumerableItem from './interface/IEnumerableItem';
import IEdgeRowSeparatorItem from './interface/IEdgeRowSeparatorItem';
import {
    IRoundBorder,
    TBackgroundStyle,
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TVisibility,
} from 'Controls/interface';
import type { IVirtualCollectionItem } from 'Controls/baseList';
import {
    THorizontalItemPadding,
    TVerticalItemPadding,
} from 'Controls/_display/interface/ICollection';
import InitStateByOptionsMixin from 'Controls/_display/InitStateByOptionsMixin';
import { getBorderClassName } from './utils/ClassNameUtils';
import { IItemTemplateProps } from 'Controls/baseList';

export interface IOptions<T extends Model = Model> {
    itemModule?: string;
    contents?: T;
    selected?: boolean;
    marked?: boolean;
    editing?: boolean;
    actions?: any;
    swiped?: boolean;
    editingContents?: T;
    owner?: ICollection<T, CollectionItem<T>>;
    isAdd?: boolean;
    multiSelectVisibility?: string;
    multiSelectAccessibilityProperty?: string;
    rowSeparatorSize?: string;
    backgroundStyle?: string;
    hoverBackgroundStyle?: string;
    theme?: string;
    style?: string;
    searchValue?: string;
    leftPadding?: string;
    rightPadding?: string;
    topPadding?: string;
    bottomPadding?: string;
    isLastItem?: boolean;
    isFirstItem?: boolean;
    hasMoreDataUp?: boolean;
    isFirstStickedItem?: boolean;
    stickyCallback?: Function;
    roundBorder?: object;
    isTopSeparatorEnabled?: boolean;
    isBottomSeparatorEnabled?: boolean;
    isTopSeparatorEnabledReact?: boolean;
    isBottomSeparatorEnabledReact?: boolean;
    faded?: boolean;
    directionality?: string;
}

export interface ISerializableState<T extends Model = Model> extends IDefaultSerializableState {
    $options: IOptions<T>;
    ci: number;
    iid: string;
}

export interface ICollectionItemCounters {
    [key: string]: number;
}

const DEFAULT_MULTI_SELECT_TEMPLATE = 'Controls/baseList:MultiSelectTemplate';

const ITEMACTIONS_POSITION_CLASSES = {
    bottomRight: 'controls-itemActionsV_position_bottomRight',
    topRight: 'controls-itemActionsV_position_topRight',
};

/**
 * @typedef {String} Controls/_display/CollectionItem/TItemBaseLine
 * Значения для настройки базовой линии плоского списка
 * @variant default выравнивание содержимого записи по базовой линии 17px
 * @variant none без выравнивания содержимого записи по базовой линии
 */
export type TItemBaseLine = 'default' | 'none';

/**
 * Элемент коллекции
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:OptionsMixin
 * @mixes Types/entity:InstantiableMixin
 * @mixes Types/entity:SerializableMixin
 * @public
 */
export default class CollectionItem<T extends Model = Model>
    extends mixin<
        DestroyableMixin,
        InitStateByOptionsMixin,
        InstantiableMixin,
        SerializableMixin,
        ItemCompatibilityListViewModel,
        ObservableMixin
    >(
        DestroyableMixin,
        InitStateByOptionsMixin,
        InstantiableMixin,
        SerializableMixin,
        ItemCompatibilityListViewModel,
        ObservableMixin
    )
    implements
        IInstantiable,
        IVersionable,
        ICollectionItem,
        ICollectionItemStyled,
        IItemCompatibilityListViewModel,
        IEditableCollectionItem,
        IMarkable,
        IItemActionsItem,
        IEnumerableItem,
        IEdgeRowSeparatorItem,
        IVirtualCollectionItem
{
    // region IInstantiable

    readonly '[Types/_entity/IInstantiable]': boolean;
    readonly ActivatableItem: boolean = true;
    get Markable(): boolean {
        return true;
    }
    readonly Draggable: boolean = true;
    readonly VirtualEdgeItem: boolean = true;
    readonly Fadable: boolean = true;
    readonly SelectableItem: boolean = true;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DraggableItem: boolean = true;
    readonly SupportItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = true;
    readonly StickableItem: boolean = true;

    private _$editingColumnIndex: number;

    getInstanceId: () => string;

    /**
     * Имя сущности для идентификации в списке.
     */
    readonly listInstanceName: string = 'controls-List';

    readonly listElementName: string = 'item';

    /**
     * Коллекция, которой принадлежит элемент
     */
    protected _$owner: Collection;

    /**
     * Содержимое элемента коллекции
     */
    protected _$contents: T;

    protected _$searchValue: string;

    /**
     * Элемент выбран
     */
    protected _$selected: boolean;

    protected _$marked: boolean;

    protected _$editing: boolean;

    protected _$actions: any;

    protected _$swiped: boolean;

    /**
     * Анимация свайпа: открытие или закрытие меню опций
     */
    protected _$swipeAnimation: TAnimationState;

    protected _$animatedForSelection: boolean;

    protected _$editingContents: T;

    protected _$active: boolean;

    protected _$hovered: boolean;

    protected _$rendered: boolean;

    /**
     * Флаг означает, что запись отрисована за пределами текущего диапазона
     * @private
     */
    private _renderedOutsideRange: boolean = false;

    protected _$multiSelectVisibility: TVisibility = 'hidden';

    // Фон застиканных записей и лесенки
    protected _$backgroundStyle?: TBackgroundStyle;

    // Фон записи при наведении курсора
    protected _$hoverBackgroundStyle?: TBackgroundStyle;

    protected _$rowSeparatorSize: string;

    protected _$dragged: boolean;
    protected _$faded: boolean;
    protected _$theme: string;

    protected _$style: string;

    protected _$leftPadding: THorizontalItemPadding;

    protected _$rightPadding: THorizontalItemPadding;

    protected _$topPadding: TVerticalItemPadding;

    protected _$bottomPadding: TVerticalItemPadding;

    protected _dragOutsideList: boolean;

    protected _$multiSelectAccessibilityProperty: string;

    protected _shadowVisibility: string = 'visible';

    protected _$hasMoreDataUp: boolean;

    protected _$isFirstStickedItem: boolean;

    protected _$stickyCallback: Function;

    protected _instancePrefix: string;

    protected _$roundBorder: IRoundBorder;

    protected _$itemTemplateOptions: object;

    protected _$directionality: string;

    /**
     * Индекс содержимого элемента в коллекции (используется для сериализации)
     */
    protected _contentsIndex: number;

    readonly '[Types/_entity/IVersionable]': boolean;

    protected _version: number;

    protected _counters: ICollectionItemCounters;

    protected _$isBottomSeparatorEnabled: boolean;

    protected _$isTopSeparatorEnabled: boolean;

    protected _$isTopSeparatorEnabledReact: boolean;

    protected _$isBottomSeparatorEnabledReact: boolean;

    protected _$isFirstItem: boolean;

    protected _$isLastItem: boolean;

    readonly EditableItem: boolean = true;

    readonly isAdd: boolean;

    constructor(options?: IOptions<T>) {
        super();
        InitStateByOptionsMixin.initMixin(this, options);
        ObservableMixin.initMixin(this, options);
        this._counters = {};
        this.isAdd = (options && options.isAdd) || false;

        // Для элементов, которые создаются сразу застканными, задается shadowVisibility='initial'.
        // Это сделано для оптимизации, чтобы не было лишних прыжков теней при изначальной отрисовке,
        // когда есть данные вверх
        if (this.hasMoreDataUp() && this._$isFirstStickedItem) {
            this._shadowVisibility = 'initial';
        }

        this._initializeContentsHandlers();
    }

    // endregion

    // region IVersionable

    getVersion(): number {
        let version = this._version;

        const contents = this._$contents as unknown;
        const editingContents = this._$editingContents as unknown;

        version += this._getVersionableVersion(contents);
        version += this._getVersionableVersion(editingContents);

        return version;
    }

    protected _nextVersion(offset: number = 1): void {
        this._version += offset;
    }

    protected _getVersionableVersion(v: unknown): number {
        if (v && typeof (v as IVersionable).getVersion === 'function') {
            return (v as IVersionable).getVersion();
        }
        return 0;
    }

    // endregion

    // region Public

    /**
     * Возвращает коллекцию, которой принадлежит элемент
     */
    getOwner(): Collection {
        return this._$owner;
    }

    /**
     * Устанавливает коллекцию, которой принадлежит элемент
     * @param owner Коллекция, которой принадлежит элемент
     */
    setOwner(owner: Collection): void {
        this._$owner = owner;
    }

    /**
     * Возвращает содержимое элемента коллекции. При этом если элемент коллекции находится в режиме редактирования,
     * то вернется редактируемый инстанс элемента коллекции, а не оригинальный.
     * Что бы получить оригинальный воспользуйтесь методом {@link getOriginalContents}.
     */
    getContents(): T {
        if (this.isEditing() && this._$editingContents) {
            return this._$editingContents;
        }

        return this.getOriginalContents();
    }

    /**
     * Возвращает оригинальное содержимое элемента коллекции.
     * Отличие от {@link getContents} в том, что здесь не проверяем находится ли итем в режиме редактирования.
     * Просто возвращаем то, что передали в опции contents.
     */
    getOriginalContents(): T {
        if (this._contentsIndex !== undefined) {
            // Ленивое восстановление _$contents по _contentsIndex после десериализации
            const collection = this.getOwner().getSourceCollection();
            if (collection['[Types/_collection/IList]']) {
                this._$contents = (collection as any as IList<T>).at(this._contentsIndex);
                this._contentsIndex = undefined;
            }
        }

        return this._$contents;
    }

    // TODO Временный тестовый костыль для бинда. По итогу прикладник будет передавать
    // список опций, которые нужны для его шаблона (contents, marked и т. д.), и будет
    // в автоматическом режиме генерироваться подпроекция с нужными полями
    get contents(): T {
        // в процессе удаления, блокируются все поля класса, и метод getContents становится недоступен
        if (!this.destroyed) {
            return this.getContents();
        }
    }

    isStickyHeader(): boolean {
        return this.getOwner()?.isStickyHeader();
    }

    isStickyResults(): boolean {
        return this.getOwner()?.isStickyResults();
    }

    /**
     * Устанавливает содержимое элемента коллекции
     * @param contents Новое содержимое
     * @param [silent=false] Не уведомлять владельца об изменении содержимого
     */
    setContents(contents: T, silent?: boolean): void {
        if (this._$contents === contents) {
            return;
        }

        // CollectionItem.getVersion() = CollectionItem._version + contents.getVersion()
        // Поэтому если у нового контента версия ниже, то уменьшится и общая версия CollectionItem - что уже не логично.
        // А если версия контента уменьшится на 1, то общая версия не изменится,
        // т.к. CollectionItem._version увеличится на 1.
        // Чтобы избежать этой проблемы, корректируем CollectionItem._version на разницу между версиями контента.
        const oldContentsVersion =
            this._$contents && this._$contents['[Types/_entity/IVersionable]']
                ? this._$contents.getVersion()
                : 0;
        const newContentsVersion =
            contents && contents['[Types/_entity/IVersionable]'] ? contents.getVersion() : 0;
        const contentVersionDiff = oldContentsVersion - newContentsVersion;
        if (contentVersionDiff > 0) {
            this._nextVersion(contentVersionDiff);
        }

        this._deinitializeContentsHandlers();
        this._$contents = contents;
        this._initializeContentsHandlers();
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('contents');
            this._notify('contentsChange', this._$contents);
        }
    }

    /**
     * Возвращает псевдоуникальный идентификатор элемента коллекции, основанный на значении опции {@link contents}.
     */
    getUid(): string {
        if (!this._$owner) {
            return;
        }
        return this._$owner.getItemUid(this);
    }

    /**
     * Возвращает признак, что элемент выбран
     */
    isSelected(): boolean | null {
        return this._$selected;
    }

    /**
     * Устанавливает признак, что элемент выбран
     * @param selected Элемент выбран
     * @param [silent=false] Не уведомлять владельца об изменении признака выбранности
     */
    setSelected(selected: boolean | null, silent?: boolean): void {
        if (this._$selected === selected) {
            return;
        }
        this._$selected = selected;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('selected');
        }
    }

    setSearchValue(searchValue: string): void {
        if (this._$searchValue !== searchValue) {
            this._$searchValue = searchValue;
            this._nextVersion();
        }
    }

    getSearchValue(): string {
        return this._$searchValue;
    }

    // endregion

    // region MultiSelectAccessibility

    isReadonlyCheckbox(): boolean {
        return this._getMultiSelectAccessibility() !== true;
    }

    isVisibleCheckbox(): boolean {
        return this._getMultiSelectAccessibility() !== null && !this.isAdd;
    }

    setMultiSelectAccessibilityProperty(property: string): void {
        if (this._$multiSelectAccessibilityProperty !== property) {
            this._$multiSelectAccessibilityProperty = property;
            this._nextVersion();
            this._notifyItemChangeToOwner('multiSelectAccessibility');
        }
    }

    protected _getMultiSelectAccessibility(): boolean | null {
        const value = object.getPropertyValue<boolean | null>(
            this.getContents(),
            this._$multiSelectAccessibilityProperty
        );
        return value === undefined ? true : value;
    }

    // endregion MultiSelectAccessibility

    getDisplayProperty(): string {
        return this.getOwner().getDisplayProperty();
    }

    getDisplayValue(displayPropertyTpl?: string): string {
        const displayProperty = displayPropertyTpl || this.getDisplayProperty();
        const contentsIsRecord = this.getContents() && this.getContents().get;
        return displayProperty && contentsIsRecord ? this.getContents().get(displayProperty) : null;
    }

    getKeyProperty(): string {
        return this.getOwner().getKeyProperty();
    }

    getGivenItemsSize(itemSizeProperty: string): number {
        return this.getContents().get(itemSizeProperty);
    }

    isMarked(): boolean {
        return this._$marked;
    }

    getItemAttrs(props: IItemTemplateProps): Record<string, unknown> {
        const attrs = {
            title: props.tooltip,
            ...props.attrs,
            'data-qa': props['data-qa'] || props.attrs?.['data-qa'] || this.listElementName,
            'item-key': this.itemKeyAttribute,
        };
        const itemContents = this.contents;
        if (itemContents instanceof Model) {
            const itemGroupKey = itemContents.get(this.getOwner().getGroupProperty());
            if (itemGroupKey) {
                attrs['item-group-key'] = itemGroupKey;
            }
        }
        delete attrs.className;
        return attrs;
    }

    setMarked(marked: boolean, silent?: boolean): void {
        if (this._$marked === marked) {
            return;
        }
        this._$marked = marked;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('marked');
        }
    }

    shouldDisplayMarker(templateMarker: boolean = true): boolean {
        return templateMarker && this.isMarked() && !this.getOwner().isEditing();
    }

    getMarkerClasses(
        markerSize: TMarkerSize = 'content-xs',
        addVerticalPaddings: boolean = false
    ): string {
        let classes = '';

        const hasRoundBorder =
            this.getTopLeftRoundBorder() && this.getTopLeftRoundBorder() !== 'default';
        const hasTopSpacing = this.getTopPadding().toLowerCase() !== 'null';
        if ((addVerticalPaddings && hasTopSpacing) || (hasRoundBorder && !hasTopSpacing)) {
            const topSpacing = hasTopSpacing
                ? this.getTopPadding().toLowerCase()
                : this.getTopLeftRoundBorder();
            classes += ` controls-ListView__itemV_marker-${this.getStyle()}_topPadding-${topSpacing}`;
        }

        if (this.getEditingConfig()) {
            classes += ' controls-ListView__itemV_marker-baselineWithEditingTemplate';
        }

        if (this.getStyle() === 'master') {
            classes += ' controls-ListView__baseline_font-size';
        }

        const isImageSize = markerSize.includes('image');
        if (isImageSize) {
            classes += ' controls-ListView__itemV_marker_with_image';
        }

        return classes;
    }

    increaseCounter(name: string): number {
        if (typeof this._counters[name] === 'undefined') {
            this._counters[name] = 0;
        }
        return ++this._counters[name];
    }

    getCounters(): ICollectionItemCounters {
        return this._counters;
    }

    getMultiSelectPositionClasses(
        itemPadding: IItemPadding = {},
        baseline: TItemBaseLine = 'none'
    ): string {
        const topPadding = (itemPadding.top || this.getTopPadding() || 'l').toLowerCase();
        const position = this.getOwner().getMultiSelectPosition();
        let checkboxMargin: string;
        let classes = '';

        if (position === 'default') {
            // Если контент в записи плоского списка выравнивается по базовой линии 17px (default),
            // То у чекбокса добавляется отступ записи списка.
            // Если не выравнивается (по умолчанию), то в зависимости от отступа списка:
            // для l добавляется отступ s, а для s добавляеься отступ равный разделительной линии.
            // Это поведение исправится в рамках работ по отступам записей.
            if (baseline === 'none') {
                checkboxMargin = topPadding === 's' || topPadding === 'null' ? 'null' : 's';
            } else {
                checkboxMargin = topPadding;
            }
            classes += ` controls-ListView__checkbox_marginTop_${checkboxMargin}`;
        }
        classes += ` controls-ListView__checkbox_position-${position} `;
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

    /**
     * Базовые классы для чекбокса мультивыбора.
     * @private
     */
    protected _getMultiSelectBaseClasses(): string {
        let classes = 'js-controls-ListView__notEditable controls-List_DragNDrop__notDraggable ';
        classes += 'js-controls-ListView__checkbox js-controls-DragScroll__notDraggable ';
        classes += 'controls-CheckboxMarker_inList controls-ListView__checkbox ';
        if (this.getMultiSelectVisibility() === 'onhover' && this.isSelected() === false) {
            classes += 'controls-ListView__checkbox-onhover';
        }
        if (!this.isReadonlyCheckbox()) {
            classes += ' controls-cursor_pointer ';
        }

        classes += this.getFadedClass();

        return classes;
    }

    isEditing(): boolean {
        return this._$editing;
    }

    getEditingConfig(): IEditingConfig {
        return this.getOwner().getEditingConfig();
    }

    // TODO: Убрать columnIndex.
    //  Расположение индекса редактируемой колонки на элементе плоского списка - временное решение, до отказа от
    //  старых списков. Контроллер редактирования работает только с новой коллекцией и новыми item'ами, а
    //  функционал редактирования отдельных ячеек требуется поддержать в том числе и в старых таблицах.
    //  Такое решение оптимальнее, чем давать контроллеру редактирования старую модель, т.к. при переходе
    //  достаточно будет почистить пару мест в CollectionItem, а не вычищать целый контроллер.
    //  https://online.sbis.ru/opendoc.html?guid=b13d5312-a8f5-4cea-b88f-8c4c043e4a77
    setEditing(
        editing: boolean,
        editingContents?: T,
        silent?: boolean,
        columnIndex?: number
    ): void {
        if (this._$editing === editing && this._$editingContents === editingContents) {
            return;
        }
        /*
         * Версия CollectionItem при редактировании = локальная версия CollectionItem + версия редактируемой модели.
         * Во время изменения редактируемой записи версия поднимается на редактируемой модели - клоне оригинала.
         * При отмене редактирования нужно применять накопленные изменения версий, иначе может быть ошибочное поведение.
         * Например,
         * 1. У записи версия 10.
         * 2. Вошли в режим редактирования, +локальная версия = 11, версия клона = 0, итого 11.
         * 3. Ввели 1 знак, локальная версия = 11, +версия клона, итого 12.
         * 4. Отменили редактирование, +локальная версия = 11 + 1 = 12.
         * Итог - строка не перерисовалась, т.к. в режиме редактирования и после выхода из него версии одинаковые.
         * */
        if (!editing) {
            this._nextVersion(this._getVersionableVersion(this._$editingContents));
        }
        this._$editing = editing;
        if (typeof columnIndex === 'number' && this._$editingColumnIndex !== columnIndex) {
            this._$editingColumnIndex = columnIndex;
        }
        this._setEditingContents(editingContents);
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('editing');
        }
    }

    getEditingColumnIndex(): number {
        return this._$editingColumnIndex;
    }

    acceptChanges(): void {
        (this._$contents as unknown as Model).acceptChanges();

        if (!this._$editing) {
            return;
        }
        // Применяем изменения на обоих моделях, т.к. редактирование записи может продолжитсься.
        (this._$contents as unknown as Model).merge(this._$editingContents as unknown as Model);
        (this._$editingContents as unknown as Model).acceptChanges();
    }

    setActions(actions: any, silent?: boolean): void {
        if (this._$actions === actions) {
            return;
        }
        this._$actions = actions;
        if (!silent) {
            this._nextVersion();
            this._notifyItemChangeToOwner('actions');
        }
    }

    getActions(): any {
        return this._$actions;
    }

    isHovered(): boolean {
        return this._$hovered;
    }

    setHovered(hovered: boolean, silent?: boolean): void {
        if (this._$hovered === hovered) {
            return;
        }
        this._$hovered = hovered;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('hovered');
        }
    }

    hasVisibleActions(): boolean {
        return this._$actions && this._$actions.showed && this._$actions.showed.length > 0;
    }

    shouldDisplayItemActions(): boolean {
        const editingConfig = this.getEditingConfig();
        // Не нужно показывать блок с ItemActions, если нет ни одной видимой кнопки,
        // И в настройках редактирования отключен тулбар.
        return (
            this.hasVisibleActions() ||
            (this.isEditing() && (!editingConfig || editingConfig.toolbarVisibility === true))
        );
    }

    /**
     * Должен ли отрисоваться темплейт операций над записью, который показывается при свайпе
     */
    shouldDisplaySwipeTemplate(): boolean {
        return this.isSwiped() && this.shouldDisplayItemActions();
    }

    getItemActionsPosition(): TItemActionsPosition {
        return this.getOwner().getItemActionsPosition();
    }

    hasActionWithIcon(): boolean {
        return (
            this.hasVisibleActions() &&
            this._$actions.showed.some((action: any) => {
                return !!action.icon;
            })
        );
    }

    setAnimation(animation: string): void {
        this._animation = animation;
        this._nextVersion();
    }

    getAnimation(): string {
        return this._animation;
    }

    /**
     * Флаг, определяющий состояние анимации записи при отметке её чекбоксом.
     * Используется для анимации при свайпе вправо для multiSelect
     */
    isAnimatedForSelection(): boolean {
        return this._$animatedForSelection;
    }

    /**
     * Устанавливает состояние  анимации записи при отметке её чекбоксом.
     * Используется при свайпе вправо для multiSelect
     */
    setAnimatedForSelection(animated: boolean): void {
        if (this._$animatedForSelection === animated) {
            return;
        }
        this._$animatedForSelection = animated;
        this._nextVersion();
        this._notifyItemChangeToOwner('animated');
    }

    /**
     * Флаг, определяющий состояние свайпа влево по записи.
     * Используется при свайпе по записи для
     * отображения или скрытия панели опций записи
     */
    isSwiped(): boolean {
        return this._$swiped;
    }

    /**
     * Флаг, определяющий состояние свайпа влево по записи.
     * Используется при свайпе по записи для
     * отображения или скрытия панели опций записи
     */
    setSwiped(swiped: boolean, silent?: boolean): void {
        if (this._$swiped === swiped) {
            return;
        }
        this._$swiped = swiped;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('swiped');
        }
    }

    /**
     * Устанавливает текущую анимацию для свайпа.
     * Может быть, стоит объединить с _swipeConfig
     */
    setSwipeAnimation(animation: TAnimationState): void {
        this._$swipeAnimation = animation;
        this._nextVersion();
        this._notifyItemChangeToOwner('swipeAnimation');
    }

    /**
     * Получает еткущую анимацию для свайпа.
     * Может быть, стоит объединить с _swipeConfig
     */
    getSwipeAnimation(): TAnimationState {
        return this._$swipeAnimation;
    }

    isActive(): boolean {
        return this._$active;
    }

    setActive(active: boolean, silent?: boolean): void {
        if (this._$active === active) {
            return;
        }
        this._$active = active;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('active');
        }
    }

    getGroupViewMode(): string {
        return this._$owner.getGroupViewMode();
    }

    // region VirtualScroll

    isRendered(): boolean {
        return this._$rendered || this.isRenderedOutsideRange();
    }

    setRendered(state: boolean): void {
        this._$rendered = state;
    }

    /**
     * Флаг, который означает что эта запись отрендериться за пределами виртуального диапазона.
     * Например, это застиканная запись или редактируемая запись.
     * @constructor
     */
    isRenderedOutsideRange(): boolean {
        return this._renderedOutsideRange;
    }

    setRenderedOutsideRange(state: boolean): void {
        this._renderedOutsideRange = state;
    }

    // endregion VirtualScroll

    setBackgroundStyle(backgroundStyle: TBackgroundStyle): void {
        this._$backgroundStyle = backgroundStyle;
        this._nextVersion();
    }

    getBackgroundStyle(): TBackgroundStyle {
        return this._$backgroundStyle;
    }

    getFixedBackgroundStyle(fixedBackgroundStyle?: string): TBackgroundStyle {
        return fixedBackgroundStyle || this._$owner.getFixedBackgroundStyle();
    }

    getHoverBackgroundStyle(): TBackgroundStyle {
        return this._$hoverBackgroundStyle;
    }

    setHoverBackgroundStyle(hoverBackgroundStyle: TBackgroundStyle): void {
        if (this._$hoverBackgroundStyle !== hoverBackgroundStyle) {
            this._$hoverBackgroundStyle = hoverBackgroundStyle;
            this._nextVersion();
        }
    }

    getFadedClass(): string {
        return this.isFaded() || this.isDragged() ? ' controls-ListView__itemContent_faded ' : '';
    }

    setFaded(faded: boolean): void {
        if (this._$faded === faded) {
            return;
        }
        this._$faded = faded;
        this._nextVersion();
        this._notifyItemChangeToOwner('faded');
    }

    isFaded(): boolean {
        return this._$faded;
    }

    // region Drag-n-drop

    setDragged(dragged: boolean, silent?: boolean): void {
        if (this._$dragged === dragged) {
            return;
        }
        this._$dragged = dragged;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('dragged');
        }
    }

    isDragged(): boolean {
        return this._$dragged;
    }

    setDragOutsideList(outside: boolean): void {
        if (this._dragOutsideList !== outside) {
            this._dragOutsideList = outside;
            this._nextVersion();
        }
    }

    isDragOutsideList(): boolean {
        return this._dragOutsideList;
    }

    shouldDisplayDraggingCounter(): boolean {
        return (
            this.Draggable &&
            this.isDragged() &&
            !this.isDragOutsideList() &&
            this.getDraggedItemsCount() > 1
        );
    }

    getDraggedItemsCount(): number {
        return this.getOwner().getDraggedItemsCount();
    }

    // TODO удалить при переписывании всех item темплейтов на реакт
    getDraggedItemsCountString(): string {
        const count = this.getDraggedItemsCount();
        // В днд мы можем получить максимум 100 записей, для производительности,
        // поэтому если записей больше 99 пишем 99+
        return count > 99 ? '99+' : String(count);
    }

    // endregion Drag-n-drop

    // region Sticky

    setStickyCallback(stickyCallback: Function): void {
        if (this._$stickyCallback !== stickyCallback) {
            this._$stickyCallback = stickyCallback;
            this._nextVersion();
        }
    }

    isSticked(): boolean {
        return this._$stickyCallback
            ? !!this._$stickyCallback(this.getContents())
            : this.isMarked() && this._isSupportSticky();
    }

    getStickyHeaderPosition(): StickyVerticalPosition {
        return this.getVerticalStickyHeaderPosition();
    }

    protected getVerticalStickyHeaderPosition(): StickyVerticalPosition {
        if (this._$stickyCallback) {
            const callbackResult = this._$stickyCallback(this.getContents());
            return callbackResult === true ? 'top' : callbackResult;
        } else {
            return 'topBottom';
        }
    }

    protected _isSupportSticky(): boolean {
        return this.getOwner().isStickyMarkedItem() !== false && this.getStyle() === 'master';
    }

    // TODO Убрать после https://online.sbis.ru/opendoc.html?guid=b8c7818f-adc8-4e9e-8edc-ec1680f286bb
    isIosZIndexOptimized(): boolean {
        return true;
    }

    // endregion Sticky

    getShadowVisibility(): string {
        return this._shadowVisibility;
    }

    /**
     * Возвращает строку с классами, устанавливаемыми в шаблоне элемента для корневого div'а.
     * @param templateHighlightOnHover - подсвечивать или нет запись по ховеру
     * @param cursor - курсор мыши
     * @param backgroundColorStyle - стиль background
     * @param templateHoverBackgroundStyle - стиль background при наведении курсора на запись
     * @param showItemActionsOnHover - показывать или нет операции над записью по ховеру
     * @remark
     * Метод должен уйти в render-модель при её разработке.
     */
    getWrapperClasses(
        templateHighlightOnHover: boolean = true,
        cursor: string = 'pointer',
        backgroundColorStyle?: TBackgroundStyle,
        templateHoverBackgroundStyle?: TBackgroundStyle,
        showItemActionsOnHover: boolean = true,
        isAdaptive?: boolean
    ): string {
        const hoverBackgroundStyle =
            templateHoverBackgroundStyle || this.getHoverBackgroundStyle() || this.getStyle();
        const editingBackgroundStyle = this.getOwner().getEditingBackgroundStyle();

        let wrapperClasses = '';
        if (!this.isSticked(null, this)) {
            wrapperClasses = 'controls-ListView__itemV-relative ';
        }
        // TODO: Убрать js-controls-ListView__editingTarget' по задаче
        //  https://online.sbis.ru/opendoc.html?guid=deef0d24-dd6a-4e24-8782-5092e949a3d9
        wrapperClasses += `controls-ListView__itemV js-controls-ListView__editingTarget ${this.getCursorClasses(
            cursor
        )}`;
        wrapperClasses += ` controls-ListView__item_${this.getStyle()}`;
        if (isAdaptive) {
            wrapperClasses += ` controls-ListView__item_${this.getStyle()}-adaptive`;
        }
        if (showItemActionsOnHover !== false) {
            wrapperClasses += ' controls-ListView__item_showActions';
        }
        if (this.getMultiSelectVisibility() !== 'hidden') {
            wrapperClasses += ' controls-ListView__item_showCheckbox';
        }
        wrapperClasses += ' js-controls-ListView__measurableContainer';
        wrapperClasses += ` controls-ListView__item__${
            this.isMarked() ? '' : 'un'
        }marked_${this.getStyle()}`;
        if (templateHighlightOnHover && !this.isEditing()) {
            wrapperClasses += ' controls-ListView__item_highlightOnHover';
            wrapperClasses += ` controls-hover-background-${hoverBackgroundStyle}`;
        }

        if (this.isEditing()) {
            wrapperClasses += ` controls-ListView__item_editing controls-background-editing_${editingBackgroundStyle}`;
            wrapperClasses +=
                ' controls-List_DragNDrop__notDraggable js-controls-DragScroll__notDraggable';
            wrapperClasses += ' js-controls-ListView__item_editing';
        }
        if (this.isDragged()) {
            wrapperClasses += ' controls-ListView__item_dragging';
        }

        if (backgroundColorStyle) {
            wrapperClasses += ` controls-background-${backgroundColorStyle}`;
        } else if (this.isMarked() && this.getStyle() === 'master') {
            wrapperClasses += ` controls-background-${this.getBackgroundStyle()}`;
        }

        if (templateHighlightOnHover && this.isActive() && !this.isEditing()) {
            wrapperClasses += ' controls-ListView__item_active';
        }

        if (this._$roundBorder) {
            wrapperClasses += ' ' + this.getRoundBorderClasses();
        }

        return wrapperClasses;
    }

    getAnimationClassName(): string {
        if (this.getAnimation()) {
            return ` controls-ListView__item_animated_${this.getAnimation()} `;
        } else {
            return '';
        }
    }

    /**
     * CSS классы для блока операций над записью
     * @param itemActionsPosition
     * здесь же, возможно, стоит вызывать описанный ниже метод getItemActionPositionClasses.
     */
    getItemActionClasses(itemActionsPosition: string): string {
        let classes = `controls-itemActionsV_${itemActionsPosition}`;
        const rowSeparatorSize = this.isBottomSeparatorEnabled() && this.getRowSeparatorSize();
        if (itemActionsPosition === 'outside') {
            classes +=
                ' controls-itemActionsV__outside_bottom_size-' +
                (rowSeparatorSize ? rowSeparatorSize : 'default');
        } else {
            if (this._$roundBorder) {
                classes += ` controls-itemActionsV_roundBorder_topLeft_${this.getTopLeftRoundBorder()}`;
                classes += ` controls-itemActionsV_roundBorder_topRight_${this.getTopRightRoundBorder()}`;
                classes += ` controls-itemActionsV_roundBorder_bottomLeft_${this.getBottomLeftRoundBorder()}`;
                classes += ` controls-itemActionsV_roundBorder_bottomRight_${this.getBottomRightRoundBorder()}`;
            }
        }
        return classes;
    }

    setItemTemplateOptions(itemTemplateOptions: object): void {
        if (!isEqual(this._$itemTemplateOptions, itemTemplateOptions)) {
            this._$itemTemplateOptions = itemTemplateOptions;
            this._nextVersion();
        }
    }

    getItemTemplateOptions(): object {
        return this._$itemTemplateOptions;
    }

    // region RoundBorder

    setRoundBorder(roundBorder: IRoundBorder): void {
        if (!isEqual(this._$roundBorder, roundBorder)) {
            this._$roundBorder = roundBorder;
            this._nextVersion();
        }
    }

    getTopLeftRoundBorder(): string {
        return this._$roundBorder?.tl || 'default';
    }

    getTopRightRoundBorder(): string {
        return this._$roundBorder?.tr || 'default';
    }

    getBottomLeftRoundBorder(): string {
        return this._$roundBorder?.bl || 'default';
    }

    getBottomRightRoundBorder(): string {
        if (this.getItemActionsPosition() === 'outside' && this.shouldDisplayItemActions()) {
            return 'default';
        }
        return this._$roundBorder?.br || 'default';
    }

    getRoundBorderClasses(): string {
        let classes = `controls-ListView__item_roundBorder_topLeft_${this.getTopLeftRoundBorder()}`;
        classes += ` controls-ListView__item_roundBorder_topRight_${this.getTopRightRoundBorder()}`;
        classes += ` controls-ListView__item_roundBorder_bottomLeft_${this.getBottomLeftRoundBorder()}`;
        classes += ` controls-ListView__item_roundBorder_bottomRight_${this.getBottomRightRoundBorder()}`;
        return classes;
    }
    // endregion RoundBorder

    /**
     * Получаем направление rtl или ltr
     */
    getDirectionality(): string {
        return this._$directionality;
    }

    setBottomSeparatorEnabled(state: boolean, silent?: boolean): void {
        this._setVerticalSeparatorEnabledState('Bottom', false, state, silent);
    }

    setBottomSeparatorEnabledReact(state: boolean, silent?: boolean): void {
        this._setVerticalSeparatorEnabledState('Bottom', true, state, silent);
    }

    isBottomSeparatorEnabled(): boolean {
        return this._$isBottomSeparatorEnabled;
    }

    setTopSeparatorEnabled(state: boolean, silent?: boolean): void {
        this._setVerticalSeparatorEnabledState('Top', false, state, silent);
    }

    setTopSeparatorEnabledReact(state: boolean, silent?: boolean): void {
        this._setVerticalSeparatorEnabledState('Top', true, state, silent);
    }

    protected _setVerticalSeparatorEnabledState(
        direction: 'Top' | 'Bottom',
        isReact: boolean,
        state: boolean,
        silent: boolean
    ): boolean {
        // _$isTopSeparatorEnabled, _$isBottomSeparatorEnabled.
        if (this[`_$is${direction}SeparatorEnabled${isReact ? 'React' : ''}`] !== state) {
            this[`_$is${direction}SeparatorEnabled${isReact ? 'React' : ''}`] = state;
            if (!silent) {
                this._nextVersion();
                return true;
            }
        }
        return false;
    }

    isTopSeparatorEnabled(): boolean {
        return this._$isTopSeparatorEnabled;
    }

    // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
    setFirstItem(state: boolean, silent?: boolean): void {
        if (this._$isFirstItem !== state) {
            this._$isFirstItem = state;
            if (!silent) {
                this._nextVersion();
            }
        }
    }

    // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
    isFirstItem(): boolean {
        return this._$isFirstItem;
    }

    // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
    setLastItem(state: boolean, silent?: boolean): void {
        if (this._$isLastItem !== state) {
            this._$isLastItem = state;
            if (!silent) {
                this._nextVersion();
            }
        }
    }

    // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
    isLastItem(): boolean {
        return this._$isLastItem;
    }

    getTheme(): string {
        return this._$theme;
    }

    getStyle(): string {
        return this._$style;
    }

    hasMoreDataUp(): boolean {
        return this._$hasMoreDataUp;
    }

    /**
     * Возвращает строку с классами, устанавливаемыми в шаблоне элемента div'а, расположенного внутри корневого div'a -
     * так называемого контентного div'a.
     * @param shadowVisibility Видимость тени вокруг записи
     * @param borderVisibility Видимость рамки вокруг записи
     * @param borderStyle Стиль цвета рамки вокруг записи
     * @remark
     * Метод должен уйти в render-модель при её разработке.
     */
    getContentClasses(
        shadowVisibility: TShadowVisibility = 'hidden',
        borderVisibility: TBorderVisibility = 'hidden',
        borderStyle: TBorderStyle = 'default'
    ): string {
        const isAnimatedForSelection = this.isAnimatedForSelection();
        const rowSeparatorSize = this.getRowSeparatorSize();
        let contentClasses = `controls-ListView__itemContent ${this._getSpacingClasses()}`;
        if (this.getStyle() === 'master') {
            contentClasses += ' controls-ListView__baseline controls-ListView__baseline_font-size';
        }
        contentClasses += this.getFadedClass();

        if (rowSeparatorSize && this._$isTopSeparatorEnabled) {
            contentClasses += ` controls-ListView__rowSeparator_size-${rowSeparatorSize}`;
        }

        if (rowSeparatorSize && this._$isBottomSeparatorEnabled) {
            contentClasses += ` controls-ListView__rowSeparator_bottom_size-${rowSeparatorSize}`;
        }

        if (isAnimatedForSelection) {
            contentClasses += ' controls-ListView__item_rightSwipeAnimation';
        }

        contentClasses += getBorderClassName(borderVisibility, borderStyle, true, true);
        contentClasses += this._getShadowClasses(shadowVisibility);

        return contentClasses;
    }

    protected _getShadowClasses(shadowVisibility: TShadowVisibility = 'hidden'): string {
        if (this.isDragged()) {
            shadowVisibility = 'dragging';
        }

        if (shadowVisibility && shadowVisibility !== 'hidden') {
            return ` controls-ListView__item_shadow_${shadowVisibility}`;
        }

        return '';
    }

    /**
     * Добавляет CSS классы для стилизации текста в записи списка
     * @param fontColorStyle Цвет шрифта
     * @param fontSize Размер шрифта
     * @param fontWeight Насыщенность шрифта
     */
    getContentTextStylingClasses(
        fontColorStyle?: TFontColorStyle,
        fontSize?: TFontSize,
        fontWeight?: TFontWeight
    ): string {
        let contentClasses = '';
        if (fontColorStyle) {
            contentClasses += ` controls-text-${fontColorStyle}`;
        }
        if (fontSize) {
            contentClasses += ` controls-fontsize-${fontSize}`;
        }
        if (fontWeight) {
            contentClasses += ` controls-fontweight-${fontWeight}`;
        }
        return contentClasses;
    }

    /**
     * Стиль фона для панельки с операциями над записью.
     * @deprecated Используется для for-а нга васаби.
     */
    getItemActionsBackgroundClass(
        backgroundStyle?: TBackgroundStyle,
        itemEditBackgroundStyle: string = 'default',
        itemHoverBackgroundStyle?: TBackgroundStyle,
        highlightOnHover?: boolean,
        actionsPosition?: string,
        actionsVisibility?: string,
        viewMode?: string
    ): string {
        // В режиме редактирования фон плашки берётся из настроек редактирования
        if (this.isEditing()) {
            const editingBackground =
                itemEditBackgroundStyle !== 'default' ? itemEditBackgroundStyle : null;
            return (
                'controls-itemActionsV_editing' + (editingBackground ? '_' + editingBackground : '')
            );
        }

        if (viewMode === 'filled') {
            return 'controls-background-translucent-active-light';
        }

        // Без режима редактирования
        let classes = '';
        const hoverBackgroundStyle = itemHoverBackgroundStyle || this.getHoverBackgroundStyle();
        const useHighlightBackgroundStyle =
            highlightOnHover !== false && hoverBackgroundStyle !== 'transparent';

        // Для операций, видимых всегда фон плашки должен совпадать с записью в споконом состоянии и по ховеру
        if (actionsVisibility === 'visible') {
            classes = `controls-background-${backgroundStyle || this.getBackgroundStyle()}`;
            if (useHighlightBackgroundStyle) {
                classes = ` controls-hover-background-${hoverBackgroundStyle || this.getStyle()}`;
            }
        } else {
            if (!useHighlightBackgroundStyle && actionsPosition !== 'outside') {
                classes = `controls-background-${backgroundStyle || this.getBackgroundStyle()}`;
            } else {
                classes = `controls-itemActionsV_style_${hoverBackgroundStyle || this.getStyle()}`;
            }
        }
        return classes;
    }

    /**
     * Возвращает Класс для позиционирования опций записи.
     * Если itemPadding.top === null и itemPadding.bottom === null, то возвращает пустую строку
     * Если новая модель, то в любом случае не считается класс, добавляющий padding
     * Если опции вне строки, то возвращает класс, добавляющий padding согласно itemActionsClass и itemPadding
     * Если опции вне строки и itemActionsClass не задан, возвращает пробел
     * Если опции внутри строки и itemActionsClass не задан, возвращает класс, добавляющий выравнивание bottomRight, без padding
     * Если itemActionsClass задан, то всегда происходит попытка рассчитать класс, добавляющий Padding, независимо от itemActionsPosition
     * Иначе возвращает классы, соответствующие заданным параметрам classes и itemPadding
     * @param itemActionsPosition
     * @param itemActionsClass
     */
    getItemActionPositionClasses(itemActionsPosition: string, itemActionsClass: string): string {
        const classes = itemActionsClass || ITEMACTIONS_POSITION_CLASSES.bottomRight;
        const result: string[] = [];
        const itemPadding = {
            top: this.getOwner().getTopPadding().toLowerCase(),
            bottom: this.getOwner().getBottomPadding().toLowerCase(),
        };
        if (itemActionsPosition !== 'outside') {
            result.push(classes);
        }
        if (itemPadding.top !== 'null' || itemPadding.bottom !== 'null') {
            const themedPositionClassCompile = (position) => {
                return `controls-itemActionsV_padding-${position}_${
                    itemPadding && itemPadding[position] === 'null' ? 'null' : 'default'
                }`;
            };
            if (classes.indexOf(ITEMACTIONS_POSITION_CLASSES.topRight) !== -1) {
                result.push(themedPositionClassCompile('top'));
            } else if (classes.indexOf(ITEMACTIONS_POSITION_CLASSES.bottomRight) !== -1) {
                result.push(themedPositionClassCompile('bottom'));
            }
        }
        return result.length ? ` ${result.join(' ')} ` : ' ';
    }

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        const templateFromProperty = itemTemplateProperty
            ? this.getContents().get(itemTemplateProperty)
            : '';
        return templateFromProperty || userTemplate;
    }

    getMultiSelectVisibility(): TVisibility {
        return this._$multiSelectVisibility;
    }

    getMultiSelectTemplate(): TemplateFunction | string | React.Component {
        return this._$owner.getMultiSelectTemplate() || DEFAULT_MULTI_SELECT_TEMPLATE;
    }

    setMultiSelectVisibility(multiSelectVisibility: TVisibility): boolean {
        const multiSelectVisibilityUpdated = this._$multiSelectVisibility !== multiSelectVisibility;
        if (multiSelectVisibilityUpdated) {
            this._$multiSelectVisibility = multiSelectVisibility;
            this._nextVersion();
            this._notifyItemChangeToOwner('multiSelectVisibility');
            return true;
        }
        return false;
    }

    getMultiSelectPosition(): string {
        return this.getOwner().getMultiSelectPosition();
    }

    isMultiSelectContrastBackground(): boolean {
        return this.getStyle() === 'master';
    }

    shouldDisplayMultiSelectTemplate(): boolean {
        return (
            this.getMultiSelectVisibility() !== 'hidden' &&
            this.getMultiSelectPosition() !== 'custom'
        );
    }

    getRowSeparatorSize(): string {
        return this._$rowSeparatorSize;
    }

    setRowSeparatorSize(rowSeparatorSize: string): boolean {
        const changed = this._$rowSeparatorSize !== rowSeparatorSize;
        if (changed) {
            this._$rowSeparatorSize = rowSeparatorSize;
            this._nextVersion();
            return true;
        }
        return false;
    }

    // region ItemPadding

    getTopPadding(): TVerticalItemPadding {
        return this._$topPadding;
    }

    getBottomPadding(): TVerticalItemPadding {
        return this._$bottomPadding;
    }

    getLeftPadding(): THorizontalItemPadding {
        return this._$leftPadding;
    }

    getRightPadding(): THorizontalItemPadding {
        return this._$rightPadding;
    }

    setItemPadding(itemPadding: IItemPadding, silent?: boolean): void {
        this._setItemPadding(itemPadding);
        if (!silent) {
            this._nextVersion();
        }
    }

    getItemPadding(): IItemPadding {
        return {
            top: this.getTopPadding(),
            bottom: this.getBottomPadding(),
            left: this.getLeftPadding(),
            right: this.getRightPadding(),
        };
    }

    protected _setItemPadding(itemPadding: IItemPadding): void {
        this._$topPadding = itemPadding.top || 'default';
        this._$bottomPadding = itemPadding.bottom || 'default';
        this._$leftPadding = itemPadding.left || 'default';
        this._$rightPadding = itemPadding.right || 'default';
    }

    // endregion ItemPadding

    protected _getSpacingClasses(): string {
        let classes = '';

        const topSpacing = this.getOwner().getTopPadding().toLowerCase();
        const bottomSpacing = this.getOwner().getBottomPadding().toLowerCase();
        const rightSpacing = this.getOwner().getRightPadding().toLowerCase();

        classes += ` controls-ListView__item_${this.getStyle()}-topPadding_${topSpacing}`;
        classes += ` controls-ListView__item_${this.getStyle()}-bottomPadding_${bottomSpacing}`;

        classes += ` controls-ListView__item-rightPadding_${rightSpacing}`;

        classes += this._getLeftSpacingContentClasses();

        return classes;
    }

    // region MultiSelect
    protected _isDefaultRenderMultiSelect(): boolean {
        return (
            this.getMultiSelectVisibility() !== 'hidden' &&
            this.getMultiSelectPosition() !== 'custom'
        );
    }
    // endregion MultiSelect

    protected _getLeftSpacingContentClasses(): string {
        if (this._isDefaultRenderMultiSelect()) {
            return (
                ' controls-ListView__itemContent_withCheckboxes' +
                ' controls-ListView__itemContent_withCheckboxes_' +
                this.getStyle()
            );
        } else {
            return ` controls-ListView__item-leftPadding_${this.getOwner()
                .getLeftPadding()
                .toLowerCase()}`;
        }
    }

    getCursorClasses(cursor: string = 'pointer', clickable: boolean = true): string {
        const cursorStyle = clickable === false ? 'default' : cursor;
        return ` controls-ListView__itemV_cursor-${cursorStyle} `;
    }

    protected _setEditingContents(editingContents: T): void {
        if (this._$editingContents === editingContents) {
            return;
        }
        if (this._$editingContents && this._$editingContents['[Types/_entity/ObservableMixin]']) {
            (this._$editingContents as unknown as ObservableMixin).unsubscribe(
                'onPropertyChange',
                this._onEditingItemPropertyChange,
                this
            );
        }
        if (editingContents && editingContents['[Types/_entity/ObservableMixin]']) {
            (editingContents as unknown as ObservableMixin).subscribe(
                'onPropertyChange',
                this._onEditingItemPropertyChange,
                this
            );
        }
        this._$editingContents = editingContents;
    }

    protected _onEditingItemPropertyChange(): void {
        this._notifyItemChangeToOwner('editingContents');
    }

    destroy(): void {
        this._deinitializeContentsHandlers();
        super.destroy();
    }

    // region ContentsHandlers

    private _initializeContentsHandlers(): void {
        if (this.getContents() && this.getContents()['[Types/_entity/ObservableMixin]']) {
            this.getContents().subscribe('onPropertyChange', this._onPropertyChange, this);
        }
    }

    private _deinitializeContentsHandlers(): void {
        if (this.getContents() && this.getContents()['[Types/_entity/ObservableMixin]']) {
            this.getContents().unsubscribe('onPropertyChange', this._onPropertyChange, this);
        }
    }

    protected _onPropertyChange(event: SyntheticEvent, properties: Record<string, unknown>): void {
        // Здесь можно сделать оптимизацию - не изменять версию записи, если запись не зависит от измененных полей.
        this._nextVersion();
    }

    // endregion ContentsHandlers

    // region SerializableMixin

    _getSerializableState(state: IDefaultSerializableState): ISerializableState<T> {
        const resultState = SerializableMixin.prototype._getSerializableState.call(
            this,
            state
        ) as ISerializableState<T>;

        if (resultState.$options.owner) {
            // save element index if collections implements Types/_collection/IList
            const collection = resultState.$options.owner.getSourceCollection();
            const index = collection['[Types/_collection/IList]']
                ? (collection as any as IList<T>).getIndex(resultState.$options.contents)
                : -1;
            if (index > -1) {
                resultState.ci = index;
                delete resultState.$options.contents;
            }
        }

        // By performance reason. It will be restored at Collection::_setSerializableState
        // delete resultState.$options.owner;

        resultState.iid = this.getInstanceId();

        return resultState;
    }

    _setSerializableState(state: ISerializableState<T>): Function {
        const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
        return function (): void {
            fromSerializableMixin.call(this);
            if (state.hasOwnProperty('ci')) {
                this._contentsIndex = state.ci;
            }
            this._instanceId = state.iid;
        };
    }

    // endregion

    // region Protected

    /**
     * Генерирует событие у владельца об изменении свойства элемента
     * @param property Измененное свойство
     * @protected
     */
    protected _notifyItemChangeToOwner(property: string): void {
        if (this._$owner && !this._$owner.destroyed) {
            this._$owner.notifyItemChange(this, property as any);
        }
        this._notify('stateChanged', property);
    }

    // endregion
}

Object.assign(CollectionItem.prototype, {
    '[Controls/_display/CollectionItem]': true,
    _moduleName: 'Controls/display:CollectionItem',
    _instancePrefix: 'collection-item-',
    _$owner: null,
    _$searchValue: '',
    _$contents: null,
    _$selected: false,
    _$marked: false,
    _$editing: false,
    _$actions: null,
    _$swiped: false,
    _$editingContents: null,
    _$itemTemplateOptions: null,
    _$active: false,
    _$hovered: false,
    _$dragged: false,
    _$multiSelectAccessibilityProperty: '',
    _$multiSelectVisibility: null,
    _$rowSeparatorSize: null,
    _$backgroundStyle: null,
    _$hoverBackgroundStyle: null,
    _$theme: 'default',
    _$style: 'default',
    _$leftPadding: 'default',
    _$rightPadding: 'default',
    _$topPadding: 'default',
    _$bottomPadding: 'default',
    _$hasMoreDataUp: false,
    _$isFirstStickedItem: false,
    _$stickyCallback: undefined,
    _$faded: false,
    _contentsIndex: undefined,
    _version: 0,
    _counters: null,
    _$editingColumnIndex: null,
    _$roundBorder: null,
    _$isBottomSeparatorEnabled: false,
    _$isTopSeparatorEnabled: false,
    _$isTopSeparatorEnabledReact: false,
    _$isBottomSeparatorEnabledReact: false,
    _$isFirstItem: false,
    _$isLastItem: false,
    _$directionality: null,
});
