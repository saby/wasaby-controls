/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/StackPageWrapper/StackPageWrapper';
import {
    BASE_WIDTH_SIZES,
    getPopupWidth,
    IStackSavedConfig,
    RIGHT_PANEL_WIDTH,
    initializationConstants,
    getMaximizedState,
    IStackItem,
} from 'Controls/_popupTemplate/Util/PopupStackUtils';
import { IPropStorage, IPropStorageOptions } from 'Controls/interface';
import { RegisterClass } from 'Controls/event';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDragObject, ResizingLine } from 'Controls/dragnDrop';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { controller } from 'I18n/i18n';
import { withAdaptiveMode, AdaptiveModeType } from 'UI/Adaptive';

interface IPageTemplate extends IControlOptions, IPropStorageOptions {
    minWidth: number;
    maxWidth: number;
    workspaceWidth: number;
    width: number;
    minSavedWidth: number;
    maxSavedWidth: number;
    adaptiveMode: AdaptiveModeType;
}

interface IReceivedState {
    width?: number;
    maxSavedWidth?: number;
    minSavedWidth?: number;
}

let themeConstants = {};

/**
 * Контрол-обертка для базовой раскладки {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ стекового окна} в отдельной вкладке.
 *
 * @class Controls/_popupTemplate/StackPageWrapper
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 */
class StackPageWrapper extends Control<IPageTemplate, IReceivedState> implements IPropStorage {
    readonly '[Controls/_interface/IPropStorage]': boolean = true;
    readonly _moduleName: string = 'Controls/popupTemplate:StackPageWrapper';
    protected _template: TemplateFunction = template;
    protected _workspaceWidth: number;
    protected _templateWorkSpaceWidth: number;
    protected _minOffset: number;
    protected _maxOffset: number;
    protected _canResize: boolean;
    protected _minWidth: number;
    protected _maximized: boolean = false;
    protected _sizesClass: string = '';
    protected _children: {
        leftResizingLine: ResizingLine;
        rightResizingLine: ResizingLine;
    };
    private _resizeRegister: RegisterClass;
    private _offsetChanged: boolean;
    private _minSavedWidth: number;
    private _maxSavedWidth: number;
    private _stackController: unknown;

    private _resizeObserver: ResizeObserverUtil;

    protected _isTablet: boolean;

    private _leftContentTemplateWidth: number = 0;

    protected _beforeMount(
        options: IPageTemplate,
        context?: object,
        receivedState?: IReceivedState
    ): void | Promise<IReceivedState> {
        this._isTablet = options.adaptiveMode?.device.isTablet();
        this._maximizeHandler = this._maximizeHandler.bind(this);
        const width = this._validateWidth(
            options,
            options.width || receivedState?.width || options.workspaceWidth
        );
        this._resizeRegister = new RegisterClass({ register: 'controlResize' });
        if (typeof width === 'number') {
            this._setSavedSizes(options.minSavedWidth, options.maxSavedWidth);
        } else {
            this._calcSizesClass(options);
            this._setSavedSizes(receivedState?.minSavedWidth, receivedState?.maxSavedWidth);
        }
        if (!this._sizesClass) {
            this._setWorkSpaceWidth(width, true, options.adaptiveMode);
            this._updateOffset(options.minWidth, options.maxWidth);
            // Вычисления minOffset и maxOffset могут отличаться на сп и кленте за счет участия в расчетах document.
            // Пользователю это не видно, но могут возникнуть ошибки гидратации, из-за того что ResizingLine при
            // нулевых значения нарисует invisible-node.
            // Поставим minOffset хотя бы 1, чтобы и на сервере и на сп рисовалась верстка ResizingLine
            if (!this._minOffset && !this._maxOffset) {
                this._minOffset = Math.max(this._minOffset, 1);
            }
            this._updateProperties(
                options.propStorageId,
                options.adaptiveMode,
                options.minWidth,
                options.maxWidth,
                options.workspaceWidth
            );
        }
        if (!receivedState && options.propStorageId && !width) {
            return new Promise((resolve) => {
                getPopupWidth(options.propStorageId).then((data?: number | IStackSavedConfig) => {
                    let resultData = data as IStackSavedConfig;
                    if (data) {
                        // Обратная совместимость со старой историей. Стали сохранять объект с настройками.
                        if (typeof data === 'number') {
                            resultData = {
                                width: data,
                            };
                        }
                        if (!this._sizesClass) {
                            if (
                                !(typeof resultData.width === 'undefined' && !this._workspaceWidth)
                            ) {
                                this._setWorkSpaceWidth(
                                    resultData.width,
                                    true,
                                    options.adaptiveMode
                                );
                            }
                            this._setSavedSizes(resultData.minSavedWidth, resultData.maxSavedWidth);
                            this._updateOffset(options.minWidth, options.maxWidth);
                        }
                    }
                    if (!this._sizesClass) {
                        this._updateProperties(
                            options.propStorageId,
                            options.adaptiveMode,
                            options.minWidth,
                            options.maxWidth,
                            options.workspaceWidth
                        );
                        this._maximized = this._getMaximizeState(options);
                    }
                    this._maximized = this._getMaximizeState(options);
                    resolve(resultData);
                });
            });
        } else {
            this._maximized = this._getMaximizeState(options);
        }
    }

    protected _afterMount(): void {
        this._resizeObserver = new ResizeObserverUtil(
            this,
            this._resizeObserverCallback.bind(this)
        );
        this._resizeObserver.observe(this._container);
        window.addEventListener('resize', this._resizeWindow.bind(this));
    }

    private async _getStackController(): Promise<unknown> {
        if (this._stackController) {
            return this._stackController;
        }
        const res = await import('Controls/popupTemplateStrategy');
        this._stackController = res.StackController;
        return res.StackController;
    }

    private _resizeObserverCallback(entry): void {
        this._templateWorkSpaceWidth = entry[0].contentRect.width - RIGHT_PANEL_WIDTH;
        this._maximized = this._getMaximizeState(this._options);
    }

    private _resizeWindow(): void {
        const rect = this._container.getBoundingClientRect();
        this._templateWorkSpaceWidth = rect.width - RIGHT_PANEL_WIDTH;
        this._maximized = this._getMaximizeState(this._options);
    }

    protected _componentDidMount(options: IPageTemplate): void {
        if (
            this._sizesClass ||
            typeof options.minWidth === 'string' ||
            typeof options.maxWidth === 'string'
        ) {
            initializationConstants().then((result) => {
                this._sizesClass = '';
                themeConstants = result as object;
                const width = this._isLiteralWidth(options.workspaceWidth)
                    ? this._getNumberWidth(options.workspaceWidth)
                    : options.workspaceWidth;
                const minWidth = this._isLiteralWidth(options.minWidth)
                    ? this._getNumberWidth(options.minWidth)
                    : options.minWidth;
                const maxWidth = this._isLiteralWidth(options.maxWidth)
                    ? this._getNumberWidth(options.maxWidth)
                    : options.maxWidth;
                if (!this._workspaceWidth) {
                    this._setWorkSpaceWidth(
                        width || maxWidth || minWidth,
                        true,
                        this._options.adaptiveMode
                    );
                }
                this._updateOffset(minWidth, maxWidth);
                this._updateProperties(
                    options.propStorageId,
                    options.adaptiveMode,
                    minWidth,
                    maxWidth,
                    width
                );
            });
        }
        // Дублируем код из StackController'а, чтобы не грузить целую либу
        this._leftContentTemplateWidth =
            this._container?.querySelector('.controls-StackTemplate__leftArea-wrapper')
                ?.offsetWidth || 0;
        if (this._leftContentTemplateWidth) {
            const maxWidth = Math.min(
                document?.body.offsetWidth - this._leftContentTemplateWidth * 2,
                options.maxWidth
            );
            this._workspaceWidth = Math.min(this._workspaceWidth, maxWidth);
            this._updateOffset();
        }
    }

    protected _afterRender(): void {
        if (this._offsetChanged) {
            this._notify('controlResize', [], { bubbling: true });
            // Так же как в реестрах, сообщаем про смену разxмеров рабочей области.
            this._notify('workspaceResize', [this._workspaceWidth], {
                bubbling: true,
            });
            this._resizeRegister.start(new SyntheticEvent({}));
        }
    }

    protected _beforeUpdate(options: IPageTemplate): void {
        if (
            this._options.width !== options.width ||
            this._options.minWidth !== options.minWidth ||
            this._options.maxWidth !== options.maxWidth
        ) {
            const width = this._validateWidth(options, options.width);
            this._setWorkSpaceWidth(width, true, options.adaptiveMode);
            this._updateOffset(options.minWidth, options.maxWidth);
            this._updateProperties(
                options.propStorageId,
                options.adaptiveMode,
                options.minWidth,
                options.maxWidth
            );
        }
    }

    protected _getContentStyle(adaptiveMode?: AdaptiveModeType): string {
        const defaultStyle = `min-width: ${this._minWidth + RIGHT_PANEL_WIDTH}px; max-width: ${
            this._workspaceWidth
        }px;`;
        if (this._isTablet || !this._sizesClass) {
            return 'width:100vw;' + defaultStyle;
        }
        return defaultStyle;
    }

    protected _getResizeDirection(direction: string): string {
        if (controller.currentLocaleConfig.directionality === 'rtl') {
            if (direction === 'reverse') {
                return 'direct';
            }
            return 'reverse';
        }
        return direction;
    }

    protected _isLiteralWidth(value: string | number): boolean {
        return BASE_WIDTH_SIZES.includes(value);
    }

    protected _getNumberWidth(value: string): number {
        return themeConstants[value];
    }

    protected _calcSizesClass(options: IPageTemplate): void {
        if (this._isLiteralWidth(options.workspaceWidth)) {
            this._sizesClass += `controls-PageTemplate_content_width_${options.workspaceWidth}`;
        }
        if (this._isLiteralWidth(options.minWidth)) {
            this._sizesClass += ` controls-PageTemplate_content_minWidth_${options.minWidth}`;
        }
        if (this._isLiteralWidth(options.maxWidth)) {
            this._sizesClass += ` controls-PageTemplate_content_maxWidth_${options.maxWidth}`;
        }
    }

    protected _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void {
        this._resizeRegister.register(event, registerType, component, callback, config);
    }

    protected _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        config: object
    ): void {
        this._resizeRegister.unregister(event, registerType, component, config);
    }

    protected _dragMoveHandler(
        event: Event,
        resizingLinePosition: string,
        dragObject: IDragObject
    ): void {
        const reversedOffset = -dragObject.offset.x;
        if (resizingLinePosition === 'right') {
            this._children.leftResizingLine.fakeDrag(reversedOffset);
        } else {
            this._children.rightResizingLine.fakeDrag(reversedOffset);
        }
    }

    protected _offsetHandler(event: Event, offset: number): void {
        this._getStackController().then((StackController) => {
            const fullOffset = offset * 2;
            const newWidth = Math.min(this._workspaceWidth, document.body.clientWidth) + fullOffset;

            const item = this._generateControllerItem();
            StackController.popupMovingSize(item, { x: fullOffset });
            this._minSavedWidth = item.minSavedWidth;
            this._maxSavedWidth = item.maxSavedWidth;

            this._setWorkSpaceWidth(newWidth, false, this._options.adaptiveMode);
            // offsetChanged нужно только в 4100, пока в ЭДО полностью не перейдут на работу через нашу обертку.
            this._notify('offsetChanged', [fullOffset]);

            this._updateOffset();
            this._maximized = this._getMaximizeState(this._options);
            this._offsetChanged = true;
        });
    }

    protected _maximizeHandler(): void {
        this._getStackController().then((StackController) => {
            const item = this._generateControllerItem();
            StackController.elementMaximized(item, false, null, false);
            this._offsetChanged = true;
            this._setWorkSpaceWidth(item.popupOptions.width, true, this._options.adaptiveMode);

            this._updateOffset();
            this._maximized = this._getMaximizeState(this._options);
        });
    }

    private _getMaximizeState(options: IPageTemplate): boolean {
        const item = this._generateControllerItem(options);
        return getMaximizedState(item, false);
    }

    private _generateControllerItem(options: IPageTemplate = this._options): Partial<IStackItem> {
        return {
            minSavedWidth: this._minSavedWidth,
            maxSavedWidth: this._maxSavedWidth,
            popupOptions: {
                minWidth: this._isLiteralWidth(options.minWidth)
                    ? themeConstants[options.minWidth]
                    : options.minWidth,
                maxWidth: this._isLiteralWidth(options.maxWidth)
                    ? themeConstants[options.maxWidth]
                    : options.maxWidth,
                width: this._templateWorkSpaceWidth,
                propStorageId: options.propStorageId,
                templateOptions: {},
            },
            position: {},
        };
    }

    private _updateProperties(
        propStorageId: string | undefined,
        adaptiveMode: AdaptiveModeType,
        minWidth: number,
        maxWidth: number,
        workspaceWidth?: number
    ): void {
        this._canResize = StackPageWrapper._canResize(
            propStorageId,
            adaptiveMode,
            this._workspaceWidth,
            minWidth,
            maxWidth
        );
        this._minWidth = minWidth;
        // Если размер фиксирован
        if (this._workspaceWidth && !minWidth && !maxWidth) {
            this._minWidth = workspaceWidth;
        }
    }

    private _updateOffset(
        minWidth: number = this._options.minWidth,
        maxWidth: number = this._options.maxWidth
    ): void {
        if (this._isLiteralWidth(minWidth)) {
            minWidth = this._getNumberWidth(minWidth);
        }
        if (this._isLiteralWidth(maxWidth)) {
            maxWidth = this._getNumberWidth(maxWidth);
        }
        maxWidth = Math.min(document?.body.offsetWidth, maxWidth);
        // protect against wrong options
        this._maxOffset = Math.max(
            (maxWidth - this._workspaceWidth) / 2 - this._leftContentTemplateWidth,
            0
        );
        this._minOffset = Math.max(this._workspaceWidth - (minWidth + RIGHT_PANEL_WIDTH), 0) / 2;
    }

    private _validateWidth(options: IPageTemplate, width: number): number {
        if (width < options.minWidth) {
            width = options.minWidth;
        }
        if (width > options.maxWidth) {
            width = options.maxWidth;
        }
        return width || options.minWidth || options.maxWidth;
    }

    private _setWorkSpaceWidth(
        width: number,
        withRightPanel: boolean = true,
        adaptiveMode: AdaptiveModeType
    ): void {
        let trueWidth = this._isTablet ? adaptiveMode.width.value : width;
        // Ширина складывается из установленной ширины + ширины правой панели
        if (!withRightPanel || this._isTablet) {
            trueWidth -= RIGHT_PANEL_WIDTH;
        }
        this._workspaceWidth = trueWidth ? trueWidth + RIGHT_PANEL_WIDTH : undefined;
        this._templateWorkSpaceWidth = trueWidth;
    }

    private _setSavedSizes(minSavedWidth: number, maxSavedWidth: number): void {
        this._maxSavedWidth = maxSavedWidth;
        this._minSavedWidth = minSavedWidth;
    }

    private static _canResize(
        propStorageId: string | undefined,
        adaptiveMode: AdaptiveModeType,
        width: number,
        minWidth: number,
        maxWidth: number
    ): boolean {
        const canResize =
            propStorageId &&
            width &&
            minWidth &&
            maxWidth &&
            maxWidth !== minWidth &&
            !adaptiveMode?.device.isTablet();
        return !!canResize;
    }
}
export default withAdaptiveMode(StackPageWrapper);

/**
 * @name Controls/_popupTemplate/StackPageWrapper#minWidth
 * @cfg {Number} Минимальная ширина, до которой может уменьшиться содержимое.
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 */

/**
 * @name Controls/_popupTemplate/StackPageWrapper#maxWidth
 * @cfg {Number} Максимальная ширина, до которой может увеличиться содержимое.
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 */

/**
 * @name Controls/_popupTemplate/StackPageWrapper#workspaceWidth
 * @cfg {Number} Ширина рабочей области при построении. Если пользователь менял размеры с помощью движения границ, то
 * ширина будет взята из истории.
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 */

/**
 * @name Controls/_popupTemplate/StackPageWrapper#width
 * @cfg {Number} Ширина, которую пользователь выставил с помощью дивжения границ.
 * @remark
 * Значение нужно презагрузить из хранилища и передать в контрол для избавления от асинхронного _beforeMount
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 * @see Controls/_popupTemplate/Utils/PopupWidthSettings#getPopupWidth
 */

/**
 * @name Controls/_popupTemplate/StackPageWrapper#minSavedWidth
 * @cfg {Number} Минимальная ширина, которую пользователь выставил с помощью дивжения границ.
 * @remark
 * Будет использоваться при нажатии пользователем на кнопку свернуть/развернуть
 * Значение нужно презагрузить из хранилища и передать в контрол для избавления от асинхронного _beforeMount
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 * @see Controls/_popupTemplateStrategy/Utils/PopupWidthSettings#getPopupWidth
 */

/**
 * @name Controls/_popupTemplate/StackPageWrapper#maxSavedWidth
 * @cfg {Number} Максимальная ширина, которую пользователь выставил с помощью дивжения границ.
 * @remark
 * Будет использоваться при нажатии пользователем на кнопку свернуть/развернуть
 * Значение нужно презагрузить из хранилища и передать в контрол для избавления от асинхронного _beforeMount
 * @demo Controls-demo/Popup/StackPageWrapper/Index
 * @see Controls/_popupTemplateStrategy/Utils/PopupWidthSettings#getPopupWidth
 */
