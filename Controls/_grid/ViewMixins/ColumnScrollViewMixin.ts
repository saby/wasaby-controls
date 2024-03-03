/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TColumnScrollViewMixin, IAbstractViewOptions } from './ColumnScroll/IColumnScroll';
import {
    ColumnScrollController,
    COLUMN_SCROLL_JS_SELECTORS,
    DragScrollController,
    DRAG_SCROLL_JS_SELECTORS,
} from 'Controls/columnScroll';
import { getChangedOptions, SyntheticEvent } from 'UI/Vdom';
import { Logger } from 'UI/Utils';
import { default as GridMixin, IOptions as IGridOptions } from 'Controls/_baseGrid/display/mixins/Grid';
import { GridLadderUtil } from 'Controls/display';
import { controller } from 'I18n/i18n';

const ERROR_MESSAGES = {
    MISSING_HEADER:
        'Невозможно отобразить горизонтальны скролл без заголовков или результатов сверху!',
    HEADER_IS_EMPTY:
        'Опция Controls/grid:View::header задана как пустой массив. Такое значение является неправльным. Горизонтальный скролл не может быть создан при такой конфигурации.',
    TOO_FREEZE:
        'Внутренняя ошибка Controls.grid:View! Ошибка ColumnScroll::IFreezable. Количество разморозок обновления размеров не равно количеству заморозок!',
    NEEDLESS_COLUMN_SCROLL_CONTROLLER_ALREADY_EXISTS:
        'Внутренняя ошибка Controls.grid:View! Горизонтальный скролл только должен появиться, но контроллер уже создан!',
    NEEDLESS_DRAG_SCROLL_CONTROLLER_ALREADY_EXISTS:
        'Внутренняя ошибка Controls.grid:View! Возможность скроллирования мышью только включилась, но контроллер уже создан!',
    CALLED_POSITION_CHANGE_HANDLER:
        'Внутренняя ошибка Controls.grid:View! Обработчик перемещения скроллбара горизонтального скролла был вызван при разрушенном контроллере скрола!',
};

const GRIDVIEW_CLASS = 'controls-Grid';
const GRIDVIEW_DRAG_CURSOR_CLASS = 'controls-Grid__DragScroll__drag-cursor';

//# region private methods

/**
 * Метод возвращает true, в случае если columnScroll можно построить. При этом нет гарантии что он будет построен.
 * Это станет достоверно известно только после подсчета размеров. Таким образом, горизонтальный скролл точно
 * отобразится при выполнении двух условий: горизонтальный скролл вцелом можно показать и контент больше
 * контейнера-обертки.
 *
 * Некоторые специфические кейсы:
 *  - не задали колонки или задали как пустой массив. Не показываем скролл, не создаем и ничего не проверяем.
 *  - таблица пустая, отображается пустое представление, шапка скрыта. Не строим контроллер, но считаем размеры.
 *      Ширины всех колонок могут быть настроены в px и их сумма будет превышать ширину контейнера-обертки.
 *      В таком случае шаблон пустого списка будет растянут на ширину всех колонок и "уедет" вправо.
 *  - таблица пустая, отображается пустое представление, шапка показывается. Аналогично предыдущему пункту, плюс
 *      шапка тоже "уедет". Следовательно нужно не только создать, но и показать.
 *  - в таблице 1 запись, шапка скрыта, результаты отобразаются в режиме 'hasData', > 1. Не показываем скролл, т.к.
 *      не можем без заголовков, однако иногда это может вызывать ошибочное поведение. Решение одно, изменить режим
 *      отображения результатов на 'visible'.
 *  FIXME: Поддержаны не все варианты. Возможно, при пустом представлении тоже нужно создавать контроллеры для
 *   консистентноси, он будет обновляться при изменении размеров, но сам скролл колонок будет скрыт.
 *
 * @param {TColumnScrollViewMixin} self текущий инстанс представления с примесью.
 * @param {IAbstractViewOptions} options опции представления с примесью.
 *
 * @return {Boolean} Флаг, указывающий, можно ли строить горизонтальный скролл.
 */
const canShowColumnScroll = (
    self: TColumnScrollViewMixin,
    options: IAbstractViewOptions
): boolean => {
    // Нет колонок, горизонтальный скролл невозможен
    if (!options.columns || !options.columns.length) {
        return false;
    }

    if (options.header instanceof Array && options.header.length === 0) {
        Logger.error(ERROR_MESSAGES.HEADER_IS_EMPTY);
        return false;
    }

    // TODO: Все пограничные случаи следует описать в аннотации метода.
    const model = self.getListModel();
    return Boolean(
        !model.destroyed &&
            (!!model.getHeader() ||
                !!(model.getResults() && model.getResults().getResultsPosition() === 'top')) &&
            (options.needShowEmptyTemplate
                ? options.headerVisibility === 'visible' ||
                  options.headerInEmptyListVisible === true
                : !!model.getCount())
    );
};

const getViewHeader = (self) => {
    let header;
    if ('header' in self._children) {
        header = self._children.header;
    } else if ('results' in self._children) {
        header = self._children.results;
    } else {
        // Здесь не ошибка не должна обрабатываться, следует "жестко" упасть, т.к. отсутствие заголовков на
        // этом этапе - внутренняя ошибка списка.
        throw Error(ERROR_MESSAGES.MISSING_HEADER);
    }
    return header;
};

const hasCheckboxColumn = (
    options: Partial<IAbstractViewOptions | IGridOptions>,
    listModel?: GridMixin
): boolean => {
    return listModel
        ? listModel.hasMultiSelectColumn()
        : options.multiSelectVisibility !== 'hidden' && options.multiSelectPosition !== 'custom';
};

export const isSizeAffectsOptionsChanged = (
    newOptions: Partial<IAbstractViewOptions>,
    oldOptions: Partial<IAbstractViewOptions>
): boolean => {
    const changedOptions = getChangedOptions(newOptions, oldOptions);

    // Если ничего не изменилось, то утилита вернет null
    if (!changedOptions) {
        return false;
    }

    return Boolean(
        changedOptions.hasOwnProperty('columns') ||
            changedOptions.hasOwnProperty('header') ||
            changedOptions.hasOwnProperty('breadCrumbsMode') ||
            changedOptions.hasOwnProperty('collapsedItems') ||
            changedOptions.hasOwnProperty('expandedItems') ||
            changedOptions.hasOwnProperty('sorting') ||
            changedOptions.hasOwnProperty('source') ||
            changedOptions.hasOwnProperty('stickyColumnsCount') ||
            changedOptions.hasOwnProperty('storedColumnsWidths') ||
            hasCheckboxColumn(oldOptions) !== hasCheckboxColumn(newOptions) ||
            (changedOptions.hasOwnProperty('items') &&
                !oldOptions.items.isEqual(newOptions.items)) ||
            (changedOptions.hasOwnProperty('columnScrollViewMode') && !newOptions.isFullGridSupport)
    );
};

const disablePendingMouseEnterActivation = (self: TColumnScrollViewMixin) => {
    self._$pendingMouseEnterForActivate = false;
    if (self._$columnScrollPreRenderTransformStyles) {
        self._$columnScrollPreRenderTransformStyles = null;
    }
    if (self._$columnScrollController) {
        self._doAfterReload(() => {
            self._doOnComponentDidUpdate(() => {
                self._$columnScrollController.disableFakeRender();
            });
        });
    }
};

//# region Создание, обновление и разрушение контроллеров

const createColumnScroll = (self: TColumnScrollViewMixin, options: IAbstractViewOptions) => {
    const styleContainers = self._children.columnScrollStyleContainers.getContainers();

    self._$columnScrollController = new ColumnScrollController({
        isRtl: controller.currentLocaleConfig.directionality === 'rtl',
        isFullGridSupport: options.isFullGridSupport,
        stickyColumnsCount: options.stickyColumnsCount || 1,
        backgroundStyle: options.backgroundStyle || 'default',
        isEmptyTemplateShown: !!options.needShowEmptyTemplate,
        transformSelector: self._$columnScrollSelector,
        columnScrollViewMode: options.columnScrollViewMode || 'scrollbar',
        initialScrollPosition:
            typeof options.columnScrollStartPosition === 'number'
                ? options.columnScrollStartPosition
                : undefined,
        getFixedPartWidth: () => {
            return getFixedPartWidth(self._children.gridWrapper, getViewHeader(self));
        },
        containers: {
            scrollContainer: self._children.gridWrapper,
            contentContainer: self._children.grid,
            ...styleContainers,
        },
        toggleScrollBarCallback: (state: boolean) => {
            if ('horizontalScrollBar' in self._children) {
                self._children.horizontalScrollBar.toggleVisibility(state);
            }
        },
        useFakeRender: !!self._$columnScrollUseFakeRender,
        uniqueId: options.uniqueId,
    });

    self._notify('toggleHorizontalScroll', [true]);
};

export const destroyColumnScroll = (self: TColumnScrollViewMixin) => {
    self._$columnScrollController.destroy();
    self._$columnScrollController = null;
    self._$dragScrollStylesContainer = null;
    self._$columnScrollUseFakeRender = false;

    // Вёрстка гор.скрола(например скроллбар), находящаяся в GridView маунтится 1 раз.
    // При последующих скрытиях/появлениях, видимость регулируется стилями.
    // При удалении сролла колонок, нужно предварительно устанавливать размеры в скроллбар,
    // иначе может произойти ситуация, когда до скрытия и после появления все размеры одинаковы,
    // тогда платформенный скроллбар не пересчитает свои размеры (которые он уже пересчитал при скрытии).
    self._children.horizontalScrollBar?.setSizes({ scrollWidth: 0 });

    if (self._$dragScrollController) {
        destroyDragScroll(self);
    }
    self._notify('toggleHorizontalScroll', [false]);
};

const createDragScroll = (self: TColumnScrollViewMixin, options: IAbstractViewOptions) => {
    self._$dragScrollStylesContainer =
        self._children.columnScrollStyleContainers.getContainers().dragScrollStyles;
    self._$dragScrollController = new DragScrollController({
        canStartDragScrollCallback: (target: HTMLElement) => {
            return !target.closest(`.${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`);
        },
        canStartDragNDropCallback: (target: HTMLElement): boolean => {
            return (
                !target.closest('.controls-DragNDrop__notDraggable') &&
                !!target.closest('.controls-Grid__row')
            );
        },
        startDragNDropCallback: options.startDragNDropCallback,
        onOverlayHide(): void {
            self._$dragScrollStylesContainer.innerHTML = '';
        },
        onOverlayShown(): void {
            self._$dragScrollStylesContainer.innerHTML = `.${self._$columnScrollSelector}>.${DRAG_SCROLL_JS_SELECTORS.OVERLAY}{display: block;}`;
        },
    });
};

const updateSizesInDragScrollController = (self: TColumnScrollViewMixin): void => {
    const { contentSize, containerSize } = self._$columnScrollController.getSizes();
    self._$dragScrollController.setScrollPosition(
        self._$columnScrollController.getScrollPosition()
    );
    self._$dragScrollController.setScrollLength(contentSize - containerSize);
};

const destroyDragScroll = (self: TColumnScrollViewMixin): void => {
    self._$dragScrollController.destroy();
    self._$dragScrollController = null;
};

function manageControllersOnDidUpdate(
    self: TColumnScrollViewMixin,
    oldOptions: IAbstractViewOptions,
    forcedCheckSizes: boolean
): void {
    // Горизонтальный скролл выключен. Если он раньше был, то разрушился на beforeUpdate.
    if (
        !self._options.columnScroll ||
        !canShowColumnScroll(self, self._options) ||
        self._isColumnScrollFrozen()
    ) {
        return;
    }

    let shouldCheckSizes = false;
    let shouldCreateDragScroll = false;
    let shouldResetColumnScroll = false;

    // Опции, при смене которых в любом случае придется пересчитать размеры
    shouldCheckSizes = forcedCheckSizes || isSizeAffectsOptionsChanged(self._options, oldOptions);

    // Включили горизонтальный скролл, либо изменили опции, при которых скролл
    // недопустим, например пустой список без зеголовков. Не факт что он будет нужен.
    // Необходимо взять размеры.
    if (
        !shouldCheckSizes &&
        ((self._options.columnScroll && !oldOptions.columnScroll) ||
            (!self._$columnScrollController &&
                !canShowColumnScroll(self, oldOptions) &&
                canShowColumnScroll(self, self._options)))
    ) {
        shouldCheckSizes = true;
        shouldResetColumnScroll = true;
        if (self._$columnScrollController) {
            Logger.error(ERROR_MESSAGES.NEEDLESS_COLUMN_SCROLL_CONTROLLER_ALREADY_EXISTS);
            destroyColumnScroll(self);
        }
    }

    // Включили dragScroll.
    // Про исмене dragScrolling нужно быть хитрее.
    // Нужно проверить что разньше он был недоступен по опциям, а сейчас доступен.
    // И даже так его создание сейчас не обязывает нас пересчитывать размеры,
    // если это единственное изменение опций. Его включение не меняет размеров.
    if (
        !shouldCheckSizes &&
        self._options.columnScroll &&
        self._isDragScrollEnabledByOptions(self._options) &&
        !self._isDragScrollEnabledByOptions(oldOptions)
    ) {
        shouldCreateDragScroll = true;
        if (self._$dragScrollController) {
            Logger.error(ERROR_MESSAGES.NEEDLESS_DRAG_SCROLL_CONTROLLER_ALREADY_EXISTS);
            destroyColumnScroll(self);
        }
    }

    if (shouldCheckSizes) {
        const calcResult = (
            self._$columnScrollController || ColumnScrollController
        ).shouldDrawColumnScroll(
            self._children,
            getFixedPartWidth,
            self._options.isFullGridSupport,
            self._options.task1184956815
        );

        if (!calcResult.status) {
            // Оказалось, что по размерам горизонтальный скролл не требуется
            if (self._$columnScrollController) {
                destroyColumnScroll(self);
            }
            return;
        }

        if (!self._$columnScrollController) {
            // Создания контроллера
            shouldResetColumnScroll = true;
            createColumnScroll(self, self._options);
        }

        if (self._isDragScrollEnabledByOptions(self._options) && !self._$dragScrollController) {
            createDragScroll(self, self._options);
            updateSizesInDragScrollController(self);
        }

        recalculateSizes(self, self._options, calcResult.sizes);

        self._notify('controlResize', [], { bubbling: true });

        if (shouldResetColumnScroll) {
            self._resetColumnScroll(self._options.columnScrollStartPosition);
        }

        if (self._$pendingMouseEnterForActivate) {
            disablePendingMouseEnterActivation(self);
        }
    } else if (self._$columnScrollController && shouldCreateDragScroll) {
        // Скроллирование перетаскиванеим - это часть горизонтального скролла,
        // которая не может без него существовать. Создаем, только если горизонтальный скролл есть и
        // включили/стало доступно скролливование перетаскиванием. В остальных случаях, контроллер создастся
        // при включении горизонтального скролла.
        createDragScroll(self, self._options);
        updateSizesInDragScrollController(self);
    }
}

//# endregion

//# region Изменение позиции скролла

const scrollToEnd = (self: TColumnScrollViewMixin) => {
    const { contentSize, containerSize } = self._$columnScrollController.getSizes();
    setScrollPosition(self, contentSize - containerSize, true);
};

const scrollToColumnEdge = (self): void => {
    const oldScrollPosition = self._$columnScrollController.getScrollPosition();
    const newScrollPosition = self._$columnScrollController.getScrollPositionWithinContainer(
        getViewHeader(self)
    );
    if (oldScrollPosition !== newScrollPosition) {
        setScrollPosition(self, newScrollPosition);
    }
};

const setScrollPosition = (
    self: TColumnScrollViewMixin,
    position: number,
    immediate?: boolean,
    useAnimation?: boolean
): boolean => {
    const oldScrollPosition = self._$columnScrollController.getScrollPosition();
    const newPosition = self._$columnScrollController.setScrollPosition(
        position,
        immediate,
        useAnimation
    );
    if (oldScrollPosition !== newPosition) {
        self._children.horizontalScrollBar.setScrollPosition(newPosition);
        if (self._$dragScrollController) {
            self._$dragScrollController.setScrollPosition(newPosition);
        }
        self._notify('columnScroll', [newPosition], { bubbling: true });
        self._children.scrollDetect.start([
            new SyntheticEvent(null, {
                type: 'horizontalScroll',
                target: self._children.gridWrapper,
                currentTarget: self._children.gridWrapper,
                _bubbling: false,
            }),
            newPosition,
        ]);
        return true;
    }
    return false;
};
//# endregion

//# region Изменение, обновление размеров

const recalculateSizes = (self: TColumnScrollViewMixin, viewOptions, calcedSizes?) => {
    // Подсчет размеров, стилей с предпосчитанными размерами
    const wasUpdated = self._$columnScrollController.updateSizes(calcedSizes);

    const updateScrollBar = () => {
        const { contentSizeForHScroll, scrollWidth, containerSize, contentSize } =
            self._$columnScrollController.getSizes();
        const scrollPosition = self._$columnScrollController.getScrollPosition();

        // Установка размеров и позиции в скроллбар
        self._children.horizontalScrollBar.setSizes({
            contentSize: contentSizeForHScroll,
            maxScrollPosition: contentSize - containerSize,
            scrollWidth,
            scrollPosition,
        });
    };

    if (wasUpdated) {
        self._$columnScrollEmptyViewMaxWidth =
            self._$columnScrollController.getSizes().containerSize;

        updateScrollBar();

        // Установка размеров и позиции в контроллер скроллирования мышью
        if (self._$dragScrollController) {
            updateSizesInDragScrollController(self);
        }
    } else if (!viewOptions.isFullGridSupport && viewOptions.columnScrollViewMode === 'arrows') {
        updateScrollBar();
    }
};

const getFixedPartWidth = (gridWrapper: HTMLDivElement, header: HTMLDivElement) => {
    // Находим последнюю фиксированную ячейку заголовка / результата
    const fixedElements = header.querySelectorAll(`.${COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT}`);
    const lastFixedCell = fixedElements[fixedElements.length - 1] as HTMLElement;

    let fixedCellOffset: number;
    if (controller.currentLocaleConfig.directionality === 'rtl') {
        fixedCellOffset =
            gridWrapper.getBoundingClientRect().right - lastFixedCell.getBoundingClientRect().right;
    } else {
        fixedCellOffset =
            lastFixedCell.getBoundingClientRect().left - gridWrapper.getBoundingClientRect().left;
    }
    // Ширина фиксированной части должна учитывать отступ таблицы от внешнего контейнера
    return fixedCellOffset + lastFixedCell.offsetWidth;
};
//# endregion

//# endregion

export abstract class ColumnScrollViewMixin {
    '[Controls/_grid/ViewMixins/ColumnScroll]': true;
    protected _$columnScrollSelector: string = null;
    protected _$columnScrollController: ColumnScrollController = null;
    protected _$dragScrollController: DragScrollController = null;
    protected _$dragScrollStylesContainer: HTMLStyleElement = null;
    protected _$columnScrollFreezeCount: number = 0;
    protected _$columnScrollIsMounted: boolean = false;
    protected _$columnScrollEmptyViewMaxWidth: number = 0;
    protected _$columnScrollUseFakeRender: boolean | 'partial' = false;
    protected _$pendingMouseEnterForActivate: boolean = false;
    protected _$columnScrollPreRenderTransformStyles: string = null;
    protected _$oldOptionsForPendingUpdate: object = null;

    protected _$relativeCellContainers: HTMLElement[] = null;

    // Стейт для отслеживания видимости грида и инициализации скролла после ее изменения.
    protected _gridVisibilityState: string = 'visible';

    static initMixin(instance) {
        instance['[Controls/_grid/ViewMixins/ColumnScroll]'] = true;
        instance._$columnScrollSelector = null;
        instance._$columnScrollController = null;
        instance._$dragScrollController = null;
        instance._$dragScrollStylesContainer = null;
        instance._$columnScrollFreezeCount = 0;
        instance._$columnScrollIsMounted = false;
        instance._$columnScrollEmptyViewMaxWidth = 0;
        instance._$columnScrollUseFakeRender = false;
        instance._$pendingMouseEnterForActivate = false;
        instance._$columnScrollPreRenderTransformStyles = null;
        instance._$oldOptionsForPendingUpdate = null;
        instance._$relativeCellContainers = null;
        instance._gridVisibilityState = 'visible';
    }

    _relativeCellContainersUpdateCallback(newContainers: HTMLElement[]): void {
        this._$relativeCellContainers = newContainers;
    }

    //# region IFreezable

    _freezeColumnScroll(): void {
        this._$columnScrollFreezeCount++;
    }

    _unFreezeColumnScroll(): void {
        this._$columnScrollFreezeCount--;
        if (this._$columnScrollFreezeCount < 0) {
            Logger.error(ERROR_MESSAGES.TOO_FREEZE);
            this._$columnScrollFreezeCount = 0;
        }
    }

    _isColumnScrollFrozen(): boolean {
        return !!this._$columnScrollFreezeCount;
    }

    //# endregion

    //# region HOOKS

    // _beforeMount
    _columnScrollOnViewBeforeMount(options: IAbstractViewOptions): void {
        this._relativeCellContainersUpdateCallback =
            this._relativeCellContainersUpdateCallback.bind(this);
        if (options.columnScroll) {
            this._$columnScrollSelector = ColumnScrollController.createUniqSelector(
                options.uniqueId
            );

            // Серверная верстка проскроленной таблицы.
            if (options.isFullGridSupport && !options.preventServerSideColumnScroll) {
                if (typeof options.columnScrollStartPosition === 'number') {
                    this._$columnScrollUseFakeRender = 'partial';
                    this._$columnScrollPreRenderTransformStyles =
                        ColumnScrollController.getPreRenderTransformStyles(
                            this._$columnScrollSelector,
                            options.columnScrollStartPosition,
                            controller.currentLocaleConfig.directionality === 'rtl'
                        );
                } else if (options.columnScrollStartPosition === 'end') {
                    this._$columnScrollUseFakeRender = true;
                }
            }
        }
    }

    // _componentDidMount
    _columnScrollOnViewDidMount(): void {
        this._$columnScrollIsMounted = true;

        // Скролл выключен через опции
        if (!this._options.columnScroll) {
            return;
        }

        const disablePendingRedraw = () => {
            this._$columnScrollUseFakeRender = false;
            this._$pendingMouseEnterForActivate = false;
            if (this._$columnScrollPreRenderTransformStyles) {
                this._$columnScrollPreRenderTransformStyles = null;
            }
        };

        this._gridVisibilityState = this._children.gridWrapper.closest('.ws-hidden')
            ? 'hidden'
            : 'visible';

        // Пустой список, с запретом на показ шапки. Пустое представление должно быть ограничено по ширине,
        // т.к. колонки все могут быть заданы фиксированно.
        // TODO: Подумать над этим, возможно стоит при пустом представлении
        //  показывать 1 колонку(grid-template-columns: 1fr;)?
        if (!canShowColumnScroll(this, this._options)) {
            if (this._options.needShowEmptyTemplate) {
                this._$columnScrollEmptyViewMaxWidth = ColumnScrollController.getEmptyViewMaxWidth(
                    this._children,
                    this._options
                );
            }
            if (this._$columnScrollUseFakeRender) {
                disablePendingRedraw();
            }
            return;
        }

        // Проверяем, нужен ли горизонтальный скролл по размерам таблицы.
        // Не создаем, если не нужен
        const shouldDrawResult = ColumnScrollController.shouldDrawColumnScroll(
            this._children,
            getFixedPartWidth,
            this._options.isFullGridSupport,
            this._options.task1184956815
        );
        if (!shouldDrawResult.status) {
            if (this._$columnScrollUseFakeRender && this._gridVisibilityState !== 'hidden') {
                disablePendingRedraw();
            }
            return;
        }

        // Создания контроллера
        createColumnScroll(this, this._options);

        if (this._isDragScrollEnabledByOptions(this._options)) {
            createDragScroll(this, this._options);
        }

        // Запуск контроллера, подсчет размеров, отрисовка
        recalculateSizes(this, this._options, shouldDrawResult.sizes);

        if (this._options.columnScrollStartPosition === 'end') {
            scrollToEnd(this);
        }

        if (this._$columnScrollUseFakeRender) {
            this._$columnScrollUseFakeRender = false;
            this._$pendingMouseEnterForActivate = true;
        }
    }

    // _beforeUpdate
    _columnScrollOnViewBeforeUpdate(newOptions: IAbstractViewOptions): void {
        if (newOptions.columnScroll && !this._$columnScrollSelector) {
            this._$columnScrollSelector = ColumnScrollController.createUniqSelector(
                newOptions.uniqueId
            );
        }

        // Скроллирование мышью отключили -> разрушаем контроллер скроллирования мышью
        if (this._$dragScrollController && !this._isDragScrollEnabledByOptions(newOptions)) {
            destroyDragScroll(this);
        }
        // Горизонтальный скролл отключили -> разрушаем оба контроллера при наличии
        if (
            this._$columnScrollController &&
            (!newOptions.columnScroll || !canShowColumnScroll(this, newOptions))
        ) {
            destroyColumnScroll(this);
        }

        // Снимаем ограничитель ширины пустого представления, если горизонтальный скролл выключился по опции
        if (!newOptions.columnScroll && this._$columnScrollEmptyViewMaxWidth) {
            this._$columnScrollEmptyViewMaxWidth = null;
        }

        // FIXME: Удалить, при следующем этапе рефакторинга, когда пойду внутрь контроллера, нужно от этого избавиться,
        //  как и от большинства стейтов. #should_refactor
        if (
            this._$columnScrollController &&
            this._options.needShowEmptyTemplate !== newOptions.needShowEmptyTemplate
        ) {
            this._$columnScrollController.setIsEmptyTemplateShown(newOptions.needShowEmptyTemplate);
        }

        if (this._options.stickyColumnsCount !== newOptions.stickyColumnsCount) {
            this.getListModel().setStickyColumnsCount(newOptions.stickyColumnsCount);
        }

        if (this._options.columnScrollViewMode !== newOptions.columnScrollViewMode) {
            if (this._$columnScrollController) {
                this._$columnScrollController.setColumnScrollViewMode(
                    newOptions.columnScrollViewMode
                );
            }
            this.getListModel().setColumnScrollViewMode(
                newOptions.columnScrollViewMode || 'scrollbar'
            );
        }
    }

    // _componentDidUpdate
    _columnScrollOnViewDidUpdate(oldOptions: IAbstractViewOptions): void {
        // Обновляем состояния горизонтального скролла/создаем его в следующем цикле, т.к. при
        // перезагрузке с обновлением опций может отработать хук с уже новыми опциями и в контроле
        // и в модели, при этом отрисовка новых состояний будет в следующем цикле.
        // При первом завершении обновления принудительно вызываем повторуную синхронизацию
        // с помощью _forceUpdate(), по завершению которой произойдет пересчет скролла.
        // При этом, игнорируем, если горизонтального скролл был выключен и до и после всех перерисовок.
        // Все перерисовки учитываются через отслеживание наличия сохраненных опций. Если их нет, то скролл
        // всегда был выключен, а не только в последнюю перерисовку.

        // FIXME: https://online.sbis.ru/opendoc.html?guid=bc40e794-c5d4-4381-800f-a98f2746750a
        // Данное поведение будет исправлено в рамках проекта по переходу на нативный горизонтальный скролл,
        // посе создания модели горизонтального скролла с поддержкой версионирования. При таком подходе
        // будет возможно добиться честной реактивности, избегая мануальных forceUpdate'ов.
        const isScrollDisabled =
            !this._$oldOptionsForPendingUpdate &&
            !this._options.columnScroll &&
            !this._options.columnScroll === !oldOptions.columnScroll;

        this._gridVisibilityState = this._children.gridWrapper?.closest('.ws-hidden')
            ? 'hidden'
            : this._gridVisibilityState === 'hidden'
            ? 'showed'
            : 'visible';

        if (!isScrollDisabled) {
            if (!this._$oldOptionsForPendingUpdate && this._gridVisibilityState !== 'showed') {
                this._forceUpdate();
                this._$oldOptionsForPendingUpdate = oldOptions;
            } else {
                manageControllersOnDidUpdate(
                    this,
                    this._$oldOptionsForPendingUpdate || oldOptions,
                    this._gridVisibilityState === 'showed'
                );
                if (this._gridVisibilityState === 'showed') {
                    if (this._$columnScrollUseFakeRender) {
                        this._$columnScrollUseFakeRender = false;
                        this._$pendingMouseEnterForActivate = this.isColumnScrollVisible();
                    }
                    this._gridVisibilityState = 'visible';
                }
                this._$oldOptionsForPendingUpdate = null;
            }
        }
    }

    // _beforeUnmount
    _columnScrollOnViewBeforeUnmount(): void {
        if (this._$columnScrollController) {
            destroyColumnScroll(this);
        }
    }

    //# endregion

    //# region METHODS

    isColumnScrollVisible(): boolean {
        return !!this._$columnScrollController;
    }

    scrollToLeft(): void {
        this._doAfterReload(() => {
            this._doOnComponentDidUpdate(() => {
                this._resetColumnScroll();
            });
        });
    }

    scrollToRight(): void {
        this._doAfterReload(() => {
            this._doOnComponentDidUpdate(() => {
                this._resetColumnScroll('end');
            });
        });
    }

    scrollToColumn(columnIndex: number): void {
        this._doAfterReload(() => {
            this._doOnComponentDidUpdate(() => {
                if (
                    this._$columnScrollController &&
                    this._$relativeCellContainers &&
                    this._$relativeCellContainers[columnIndex]
                ) {
                    this._columnScrollScrollIntoView(this._$relativeCellContainers[columnIndex]);
                }
            });
        });
    }

    _resetColumnScroll(position?: IAbstractViewOptions['columnScrollStartPosition']): void {
        if (!this._$columnScrollController) {
            return;
        }
        if (position === 'end') {
            scrollToEnd(this);
        } else if (this._$columnScrollController.getScrollPosition() !== 0) {
            setScrollPosition(this, 0, true);
        }
    }

    _isDragScrollEnabledByOptions(options: IAbstractViewOptions): boolean {
        if (typeof options.dragScrolling === 'boolean') {
            return options.dragScrolling;
        } else {
            return !options.itemsDragNDrop;
        }
    }

    _getColumnScrollThumbStyles(options: IAbstractViewOptions): string {
        // TODO: Посмотреть на экшены, если не custom то добавить.
        const hasMultiSelectColumn = hasCheckboxColumn(options, this.getListModel());
        const hasItemActionsCell = this._hasItemActionsCell(options);
        const stickyColumnsCount = this._getStickyLadderCellsCount(options);

        // Пока обновление горизонтального скролла замороженно, актуальные колонки, по которым рисуется таблица
        // находятся в модели, а не в опциях.
        const columns = this._isColumnScrollFrozen()
            ? this.getListModel().getGridColumnsConfig()
            : options.columns;
        const columnsLength = columns.length;

        const startColumn =
            +hasMultiSelectColumn +
            stickyColumnsCount +
            +!!options.resizerVisibility +
            (options.stickyColumnsCount || 1) +
            1;
        const endColumn =
            +hasMultiSelectColumn +
            +hasItemActionsCell +
            +!!options.resizerVisibility +
            stickyColumnsCount +
            columnsLength +
            +!!options.useSpacingColumn +
            1;

        return `grid-column: ${startColumn} / ${endColumn};`;
    }

    _getColumnScrollWrapperClasses(options: IAbstractViewOptions): string {
        let classes = '';
        if (options.columnScroll) {
            classes += this._$columnScrollSelector;
            if (this._$columnScrollUseFakeRender === true) {
                classes += ' controls-Grid__ColumnScrollWrapper_withFakeRender';
            }
        }
        return classes;
    }

    _getColumnScrollContentClasses(
        options: IAbstractViewOptions,
        columnScrollPartName?: 'fixed' | 'scrollable'
    ): string {
        let classes = '';
        if (options.columnScroll) {
            classes += `${COLUMN_SCROLL_JS_SELECTORS.CONTENT}`;

            if (this._$columnScrollUseFakeRender === true && columnScrollPartName === 'fixed') {
                classes += ' controls-Grid__ColumnScroll__fakeFixedPart';
            }

            if (this._isDragScrollEnabledByOptions(options) && this.isColumnScrollVisible()) {
                classes += ` ${GRIDVIEW_DRAG_CURSOR_CLASS}`;
            }
        }
        return classes;
    }

    /**
     * В качестве таргета для прокрутки может выступать любой элемент.
     */
    _columnScrollScrollIntoView(target: HTMLElement): void {
        if (this._$columnScrollController) {
            if (
                target.className.indexOf(COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT) !== -1 ||
                target.closest(`.${COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT}`)
            ) {
                return;
            }
            // Стили должны быть применены незамедлительно, в не через requestAnimationFrame,
            // иначе нативный подскролл сработает раньше, затем подскролл горизонтального скролла.
            const currentPosition = this._$columnScrollController.getScrollPosition();
            const newScrollPosition =
                this._$columnScrollController.getScrollPositionToColumnRectEdge(
                    target.getBoundingClientRect()
                );

            if (currentPosition !== newScrollPosition) {
                setScrollPosition(this, newScrollPosition, true);
            }
        }
    }

    /**
     * Возвращает наиболее полный набор колонок таблицы, включая дополнительные ячейки(например, лесенка) и без учета колспана.
     * Необходим для корректного подскрола к колонке при лююбой верной конфигурации таблицы.
     * Например, в шапке может не быть ячейки данной колонки, ровно как и в первых N записях.
     * Для избежания поиска строки с нужной нам ячейкой, при горизонтальном скролле выводится фейковая строка нулевой высоты
     * со всеми ячейками без колспанов.
     * @param options
     * @private
     */
    _getViewColumns(
        options: IGridOptions,
        withResizer: boolean = true
    ): { type: string; width?: string }[] {
        const hasMultiSelect = hasCheckboxColumn(options, this.getListModel());
        let ladderCellsIndexes = [];
        const gridColumns = [...this.getListModel().getColumnWidths()];

        if (!withResizer && options.resizerVisibility) {
            gridColumns.splice(options.stickyColumnsCount || 1, 1);
        }

        if (options.isFullGridSupport) {
            const columns = this.getListModel()
                ? this.getListModel().getGridColumnsConfig()
                : options.columns;
            const ladderStickyColumn = GridLadderUtil.getStickyColumn({
                columns,
            });

            // Во время днд отключаем лесенку, а контент отображаем принудительно с помощью visibility: visible
            if (ladderStickyColumn && !this.getListModel().isDragging()) {
                ladderCellsIndexes.push(0);
                if (ladderStickyColumn.property.length === 2) {
                    ladderCellsIndexes.push(1);
                }
                if (hasMultiSelect) {
                    ladderCellsIndexes = ladderCellsIndexes.map((idx) => {
                        return ++idx;
                    });
                }
            }
        }

        return gridColumns
            .map((width, idx, arr) => {
                if (idx === 0 && hasMultiSelect) {
                    return { type: 'CHECKBOX' };
                } else if (this._hasItemActionsCell(options) && idx === arr.length - 1) {
                    return { type: 'ITEM_ACTIONS' };
                } else if (ladderCellsIndexes.indexOf(idx) !== -1) {
                    return { type: 'LADDER' };
                } else {
                    return { type: 'DATA', width };
                }
            })
            .concat(options.useSpacingColumn ? [{ type: 'SPACING' }] : []);
    }

    _getTableColumnScrollThumbWrapperStyles(contentWidth?: number): string {
        let styles = '';
        if (contentWidth) {
            styles += `max-width: ${contentWidth}px;`;
        }
        return styles;
    }

    _getTableColumnScrollThumbWrapperClasses(): string {
        return `${COLUMN_SCROLL_JS_SELECTORS.FIXED_ELEMENT} controls-Grid__columnScrollBar__wrapper_table`;
    }

    //# endregion

    //# region EVENT HANDLERS

    _onColumnScrollThumbPositionChanged(e: SyntheticEvent<null>, newScrollPosition: number): void {
        if (!this._$columnScrollController) {
            throw Error(ERROR_MESSAGES.CALLED_POSITION_CHANGE_HANDLER);
        }
        // Если скроллим за скроллбар, то класс GRIDVIEW_DRAG_CURSOR_CLASS не нужен.
        // При этом _getColumnScrollContentClasses не запрашивается во время скролла,
        // т.к. GridView не перерисовывается целиком. Поэтому удаляем и добавляем класс прямо по месту.
        const gridViewContent: HTMLDivElement = this._container.querySelector(`.${GRIDVIEW_CLASS}`);
        if (gridViewContent.classList.contains(GRIDVIEW_DRAG_CURSOR_CLASS)) {
            gridViewContent.classList.remove(GRIDVIEW_DRAG_CURSOR_CLASS);
        }
        setScrollPosition(
            this,
            newScrollPosition,
            false,
            this._options.columnScrollViewMode === 'arrows'
        );
    }

    _onColumnScrollThumbDragEnd(e: SyntheticEvent<null>): void {
        // Если скроллим за скроллбар, то класс GRIDVIEW_DRAG_CURSOR_CLASS не нужен.
        // При этом _getColumnScrollContentClasses не запрашивается во время скролла,
        // т.к. GridView не перерисовывается целиком. Поэтому удаляем и добавляем класс прямо по месту.
        const gridViewContent: HTMLDivElement = this._container.querySelector(`.${GRIDVIEW_CLASS}`);
        if (
            !gridViewContent.classList.contains(GRIDVIEW_DRAG_CURSOR_CLASS) &&
            this._isDragScrollEnabledByOptions(this._options) &&
            this.isColumnScrollVisible()
        ) {
            gridViewContent.classList.add(GRIDVIEW_DRAG_CURSOR_CLASS);
        }
        scrollToColumnEdge(this);
    }

    _onColumnScrollViewMouseEnter(e: SyntheticEvent): void {
        if (this._$pendingMouseEnterForActivate) {
            disablePendingMouseEnterActivation(this);
        }
    }

    _onColumnScrollViewWheel(e: SyntheticEvent<WheelEvent>): void {
        if (this._$columnScrollController) {
            // Игнорируем вращение колеса мыши над скроллбаром. Это обработает скроллбар.
            const target = e.nativeEvent.target as HTMLDivElement;
            if (target && target.closest('.js-controls-ColumnScroll__thumb')) {
                return;
            }
            const newScrollPosition = this._$columnScrollController.scrollByWheel(e);

            if (this._$columnScrollController.getScrollPosition() !== newScrollPosition) {
                setScrollPosition(this, newScrollPosition);
            }
        }
    }

    _onColumnScrollViewResized(): void {
        if (this._options.columnScroll && this._$columnScrollIsMounted) {
            if (canShowColumnScroll(this, this._options)) {
                // Считаем размеры, если горизонтальный скролл не нужен, то удаляем.
                // Если нужен, то запомним размеры, они пригодятся для обновления.
                // Подсчет производится:
                //  + простым сравнением размеров, если горизонтального скролла нет в данный момент.
                //  + с предварительным сбросом текущего состояния прокрутки, если скролл есть.
                const controller = this._$columnScrollController || ColumnScrollController;
                const shouldDrawResult = controller.shouldDrawColumnScroll(
                    this._children,
                    getFixedPartWidth,
                    this._options.isFullGridSupport,
                    this._options.task1184956815
                );

                if (!shouldDrawResult.status) {
                    if (this._$columnScrollController) {
                        destroyColumnScroll(this);
                    }
                    return;
                }

                let shouldResetColumnScroll: boolean = false;
                if (!this._$columnScrollController) {
                    shouldResetColumnScroll = true;
                    createColumnScroll(this, this._options);
                }

                if (
                    this._isDragScrollEnabledByOptions(this._options) &&
                    !this._$dragScrollController
                ) {
                    createDragScroll(this, this._options);
                }

                recalculateSizes(this, this._options, shouldDrawResult.sizes);

                if (shouldResetColumnScroll) {
                    this._resetColumnScroll(this._options.columnScrollStartPosition);
                }

                if (this._$pendingMouseEnterForActivate) {
                    disablePendingMouseEnterActivation(this);
                }
            } else if (this._options.needShowEmptyTemplate) {
                this._$columnScrollEmptyViewMaxWidth = ColumnScrollController.getEmptyViewMaxWidth(
                    this._children,
                    this._options
                );
            }
        }
    }

    _onColumnScrollStartDragScrolling(e: SyntheticEvent<TouchEvent | MouseEvent>): void {
        // DragScrolling нужен только чтобы тащить скроллируемые колонки.
        this._$dragScrollController?.startDragScroll(e.nativeEvent);
    }

    _onColumnScrollDragScrolling(e: SyntheticEvent<TouchEvent | MouseEvent>): void {
        // TODO: Поправить пахины правки, здесь не работает скорее всего на IPAD.
        if (this._$dragScrollController) {
            const newPosition = this._$dragScrollController.moveDragScroll(e.nativeEvent);

            if (newPosition !== null) {
                e.stopImmediatePropagation();
                e.nativeEvent.stopImmediatePropagation();
                setScrollPosition(this, newPosition);
            }
        }
    }

    _onColumnScrollStopDragScrolling(): void {
        // TODO: Поправить пахины правки, здесь не работает скорее всего на IPAD.
        if (this._$dragScrollController) {
            const isScrolled = this._$dragScrollController.isScrolled();
            this._$dragScrollController.stopDragScroll();

            if (isScrolled) {
                scrollToColumnEdge(this);
            }
        }
    }

    _onColumnScrollViewArrowKeyDown(direction: 'left' | 'right'): boolean {
        if (this._$columnScrollController) {
            const { scrollWidth } = this._$columnScrollController.getSizes();
            const newScrollPosition =
                this._$columnScrollController.getScrollPosition() +
                (direction === 'left' ? -scrollWidth : scrollWidth);

            if (setScrollPosition(this, newScrollPosition, false, true)) {
                return true;
            }
        }
        return false;
    }

    //# endregion
}
