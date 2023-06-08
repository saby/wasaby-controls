/**
 * @kaizen_zone 98d4b42e-2c0e-4268-a9e8-1e54d6e8ef27
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_masterDetail/Base/Base';
import { debounce } from 'Types/function';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ResizingLine } from 'Controls/dragnDrop';
import { Register } from 'Controls/event';
import {
    setSettings,
    getSettings,
} from 'Controls/Application/SettingsController';
import { IPropStorageOptions } from 'Controls/interface';
import 'css!Controls/masterDetail';
import { IContextOptionsValue } from 'Controls/_context/ContextOptions';
import { Logger } from 'UI/Utils';

const RESIZE_DELAY = 50;

export type TMasterVisibility = 'visible' | 'hidden';

export interface IMasterWidth {
    masterWidth: number | string;
    masterMinWidth: number | string;
    masterMaxWidth: number | string;
    initialMasterWidth: string;
}

interface IMasterDetail
    extends IControlOptions,
        IPropStorageOptions,
        IMasterWidth {
    master: TemplateFunction;
    detail: TemplateFunction;
    // TODO: удалить по задаче: https://online.sbis.ru/opendoc.html?guid=59b38808-e604-49a0-8873-bf324655c505
    contrastBackground: boolean;
    masterContrastBackground: boolean;
    detailContrastBackground: boolean;
    masterVisibility: TMasterVisibility;
    scrollTop?: number;
    scrollOffsetTop?: number;
    masterOffsetTop?: number;
    containerHeightWithOffsetTop?: number;
    masterPosition: 'left' | 'right';
    _dataOptionsValue?: IContextOptionsValue;
    newDesign?: boolean;
    restricted?: boolean;
    isAdaptive?: boolean;
    adaptiveContent?: boolean;
}
/**
 * Контрол, который обеспечивает связь между двумя контролами для отображения подробной информации по выбранному элементу.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/master-detail/ руководство разработчика}
 * * {@link /doc/platform/developmentapl/interface-development/application-architecture/error-handling/error-handling-controls/#error-handling-for-multiple-list-controls обработка ошибок}
 *
 * @class Controls/_masterDetail/Base
 * @extends UI/Base:Control
 * @implements Controls/interface:IPropStorage
 * @public
 * @demo Controls-demo/MasterDetail/Demo
 */

/*
 * Control that allows to implement the Master-Detail interface
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/master-detail/'>here</a>.
 * @class Controls/_masterDetail/Base
 * @extends UI/Base:Control
 *
 * @author Авраменко А.С.
 * @public
 * @demo Controls-demo/MasterDetail/Demo
 */
class Base extends Control<IMasterDetail, string> {
    /**
     * @name Controls/_masterDetail/Base#master
     * @cfg {Function} Задает шаблон контента master.
     */

    /*
     * @name Controls/_masterDetail/Base#master
     * @cfg {Function} Master content template
     */

    /**
     * @name Controls/_masterDetail/Base#detail
     * @cfg {Function} Задает шаблон контента detail.
     */

    /*
     * @name Controls/_masterDetail/Base#detail
     * @cfg {Function} Detail content template
     */

    /**
     * @name Controls/_masterDetail/Base#masterWidth
     * @cfg {Number|String} Ширина контентной области {@link master} при построении контрола.
     * @remark
     * Значение можно задавать как в пикселях, так и в процентах.
     */

    /**
     * @name Controls/_masterDetail/Base#initialMasterWidth
     * @cfg {String} Начальная ширина контентной области {@link master} при построении контрола. Опция актуальна при использовании {@link propStorageId} и обеспечивает синхронное построение контрола.
     * @remark
     * Ширина {@link master} области при построении будет установлена по значению опции, а не получена из {@link propStorageId} параметров.
     * Значением может быть число или процент.
     * @see propStorageId
     */

    /**
     * @name Controls/_masterDetail/Base#masterMinWidth
     * @cfg {Number|String} Минимальная ширина контентной области до которой может быть уменьшена ширина {@link master}.
     * @remark
     * Значение можно задавать как в пикселях, так и в процентах.
     * @see masterMaxWidth
     * @see masterWidth
     */

    /**
     * @name Controls/_masterDetail/Base#masterMaxWidth
     * @cfg {Number|String} Максимальная ширина контентной области до которой может быть увеличена ширина {@link master}
     * @remark
     * Значение можно задавать как в пикселях, так и в процентах.
     * @see masterMinWidth
     * @see masterWidth
     */

    /**
     * @typedef {String} Controls/_masterDetail/Base/TMasterVisibility
     * @variant visible Мастер отображается.
     * @variant hidden Мастер скрыт.
     */

    /**
     * @name Controls/_masterDetail/Base#masterVisibility
     * @cfg {Controls/_masterDetail/Base/TMasterVisibility.typedef} Определяет видимость контента мастера.
     * @default visible
     * @demo Controls-demo/MasterDetail/MasterVisibility/Index
     */

    /**
     * @name Controls/_interface/IPropStorage#propStorageId
     * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
     * @remark
     * С помощью этой опции включается функционал движения границ.
     * Помимо propStorageId необходимо задать опции {@link masterWidth}, {@link masterMinWidth}, {@link masterMaxWidth}.
     */

    /**
     * @name Controls/_masterDetail/Base#detailContrastBackground
     * @cfg {Boolean} Определяет контрастность фона для области detail по отношению к окружению.
     * @variant true Контрастный фон.
     * @variant false Фон, гармонично сочетающийся с окружением.
     * @default true
     */

    /**
     * @name Controls/_masterDetail/Base#masterContrastBackground
     * @cfg {Boolean} Определяет контрастность фона для области master по отношению к окружению.
     * @variant true Контрастный фон.
     * @variant false Фон, гармонично сочетающийся с окружением.
     * @default true
     */

    /**
     * @name Controls/_masterDetail/Base#scrollTop
     * @cfg {Number} Количество пикселей, прокрученных от верха скроллируемой области, в которой лежит контрол.
     * @see scrollOffsetTop
     */

    /**
     * @name Controls/_masterDetail/Base#scrollOffsetTop
     * @cfg {Number} Определяет смещение позиции прилипания внутри скроллируемой области.
     * @remark
     * Подробнее {@link Controls/_stickyBlock/StickyBlock#offsetTop}
     * @see scrollTop
     */

    /**
     * @name Controls/_masterDetail/Base#masterOffsetTop
     * @cfg {Number} Определяет отступ от верхней части скроллируемой области, при котором колонка с мастером будет зафиксирована.
     * @see masterPosition
     */

    /**
     * @name Controls/_masterDetail/Base#containerHeightWithOffsetTop
     * @cfg {Number} Определяет общую высоту видимой части мастера с отступом от верхней части скроллируемой области, при котором колонка с мастером будет зафиксирована.
     * @default document.body.clientHeight
     * @see masterOffsetTop
     */

    /**
     * @name Controls/_masterDetail/Base#masterPosition
     * @cfg {String} Определяет положение колонки {@link master} относительно колонки {@link detail}.
     * @variant left Мастер располагается слева от детейла.
     * @variant right Мастер располагается справа от детейла.
     * @default left
     * @see masterOffsetTop
     */

    /**
     * @name Controls/_masterDetail/Base#newDesign
     * @cfg {Boolean} Флаг для настройки отображения двухколоночного реестра в новом дизайне.
     * @demo Controls-demo/MasterDetail/NewDesign/Index
     */

    /**
     * @name Controls/_masterDetail/Base#restricted
     * @cfg {Boolean} Флаг для обрезания тени по бокам двухколоночного реестра.
     * Используется в случаях, когда не нужно отображать тень с правого и левого края.
     */
    /**
     * @name Controls/_masterDetail/Base#masterScrollbarVisible
     * @cfg {Boolean} Определяет, следует ли отображать скроллбар у скрола в мастере.
     * @remark Опция актуальна при использовании {@link scrollTop}.
     */

    /**
     * @name Controls/_masterDetail/Base#masterScrollBottomShadowVisibility
     * @cfg {Controls/_scroll/Container/Interface/IShadows/SHADOW_VISIBILITY.typedef} Определяет режим отображения тени снизу у скрола в мастере.
     * @default auto
     * @remark Опция актуальна при использовании {@link scrollTop}.
     */

    /**
     * @name Controls/_masterDetail/Base#adaptiveContent
     * @cfg {Boolean} Определяет видимость мастер области в адаптивном режиме отображения
     * Используется в случае, когда контент мастер области умеет отображаться в адаптивном режиме и его можно показать сразу
     * @default false
     */

    /**
     * @name Controls/_masterDetail/Base#masterWidthChanged
     * @event Происходит при изменении ширины мастера.
     * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
     * @param {String} width Ширина мастера.
     * @remark Событие провоцируется через движение границ, или после изменения размеров родительским контролом.
     * @see propStorageId
     */

    protected _template: TemplateFunction = template;
    protected _children: {
        master: HTMLElement;
        detail: HTMLElement;
        resizingLine: ResizingLine;
        resizeDetectMaster: Register;
        resizeDetectDetail: Register;
    };
    protected _selected: boolean | null;
    protected _canResizing: boolean = false;
    protected _minOffset: number;
    protected _maxOffset: number;
    protected _prevCurrentWidth: string;
    protected _currentWidth: string;
    protected _detailWidth: number;
    protected _currentMaxWidth: string;
    protected _currentMinWidth: string;
    protected _containerWidth: number;
    protected _masterFixed: boolean = false;
    protected _adaptiveMasterVisible: boolean;
    private _touchstartPosition: number;
    protected _newDesign: boolean = false;
    private _savedWidth: number; // Защита от множ. вызова БЛ

    protected _beforeMount(
        options: IMasterDetail,
        context: object,
        receivedState: string
    ): Promise<string> | string | void {
        this._updateOffsetDebounced = debounce(
            this._updateOffsetDebounced.bind(this),
            RESIZE_DELAY
        );
        this._canResizing = this._isCanResizing(options);
        this._masterFixed = this._isMasterFixed(options);
        this._adaptiveMasterVisible = !options.isAdaptive;
        this._prepareLimitSizes(options);
        this._newDesign =
            options._dataOptionsValue?.newDesign || options.newDesign;
        if (receivedState) {
            this._currentWidth = this._getWidthByType(receivedState);
            this._savedWidth = parseInt(receivedState, 10);
        } else if (options.propStorageId) {
            if (options.initialMasterWidth) {
                this.initCurrentWidth(options.initialMasterWidth);
                return this._currentWidth;
            }
            return new Promise((resolve) => {
                this._getSettings(options).then((storage) => {
                    this._updateSizesByPropStorageId(storage, options);
                    this._prepareLimitSizes(options);
                    resolve(this._currentWidth);
                });
            });
        } else {
            this.initCurrentWidth(options.masterWidth);
        }
    }

    private _getSettings(options: IMasterDetail): Promise<object> {
        return getSettings([options.propStorageId]);
    }
    protected _dragStartHandler(): void {
        this._beginResize();
    }

    private _beginResize(): void {
        if (!this._minOffset && !this._maxOffset && this._canResizing) {
            this._updateOffset(this._options);
        }
    }

    private _setSettings(width: number | string): void {
        const propStorageId = this._options.propStorageId;
        if (propStorageId) {
            if (this._savedWidth !== width) {
                this._savedWidth = this._getWidthByType(width);
                setSettings({ [propStorageId]: this._savedWidth });
            }
        }
    }

    private _prepareLimitSizes(options: IMasterDetail): void {
        // Если _currentWidth задан в процентах, а minWidth и maxWidth в пикселях, может получиться ситуация, что
        // _currentWidth больше допустимого значения. Узнаем мы это только на клиенте, когда будут размеры контрола.
        // Чтобы верстка визуально не прыгала после оживления, вешаю minWidth и maxWidth сразу на контейнер мастера.
        if (this._isPercentValue(options.masterMaxWidth)) {
            this._currentMaxWidth = options.masterMaxWidth as string;
        } else if (options.masterMaxWidth !== undefined) {
            this._currentMaxWidth = `${options.masterMaxWidth}px`;
        }

        if (this._isPercentValue(options.masterMinWidth)) {
            this._currentMinWidth = options.masterMinWidth as string;
        } else if (options.masterMinWidth !== undefined) {
            this._currentMinWidth = `${options.masterMinWidth}px`;
        }
    }

    private initCurrentWidth(width: string | number): void {
        if (
            width !== undefined &&
            typeof width !== 'string' &&
            typeof width !== 'number'
        ) {
            Logger.error(
                'MasterDetail:Base: Опция initialMasterWidth имеет некорректный тип.' +
                    'В качестве значения опции нужно передавать процент или число.',
                this
            );
        }
        this._currentWidth = this._getWidthByType(width);
    }

    protected _setCurrentWidthByValue(
        initialMasterWidth: string | number,
        masterWidth: string | number
    ): void {
        if (
            this._isPercentValue(masterWidth) &&
            !this._isPercentValue(initialMasterWidth) &&
            this._getContainerWidth()
        ) {
            const masterRecalculatedWidth =
                this._getWidthValueInPercents(initialMasterWidth);
            this._setSettings(masterRecalculatedWidth);
            this._currentWidth = masterRecalculatedWidth;
        }
    }

    private _getWidthByType(width: string | number): string {
        if (this._isPercentValue(width)) {
            return String(width);
        }
        if (width !== undefined) {
            return parseFloat(width) + 'px';
        }
    }

    private _updateOffsetDebounced(): void {
        this._updateOffset(this._options);
        this._setSettings(this._currentWidth);
        this._notify('masterWidthChanged', [this._currentWidth]);
    }

    protected _afterMount(options: IMasterDetail): void {
        this._prevCurrentWidth = this._currentWidth;
        // TODO: удалить вызов метода для перерасчета ширины мастера, после пересхранения значения в процентах
        //  во всех местах использования masterDetail.
        if (options.propStorageId && options.initialMasterWidth) {
            this._setCurrentWidthByValue(
                options.initialMasterWidth,
                options.masterWidth
            );
        }
    }

    protected _beforeUpdate(options: IMasterDetail): void | Promise<unknown> {
        this._newDesign =
            options._dataOptionsValue?.newDesign || options.newDesign;

        this._masterFixed = this._isMasterFixed(options);

        // Если изменилась текущая ширина, то сбросим состояние, иначе работаем с тем, что выставил пользователь
        if (options.masterWidth !== this._options.masterWidth) {
            this._currentWidth = null;
        }

        if (this._isSizeOptionsChanged(options, this._options)) {
            this._canResizing = this._isCanResizing(options);
            this._prepareLimitSizes(options);
            this._updateOffset(options);
        }

        if (options.propStorageId !== this._options.propStorageId) {
            return this._getSettings(options).then((storage) => {
                this._updateSizesByPropStorageId(storage, options);
            });
        }

        if (options.masterVisibility !== this._options.masterVisibility) {
            this._updateOffset(options);
        }
    }

    protected _afterUpdate(oldOptions?: IMasterDetail): void {
        if (oldOptions.masterVisibility !== this._options.masterVisibility) {
            this._startResizeRegister();
        }
    }

    protected _getMasterStyle(
        scrollTop: number = 0,
        scrollOffsetTop: number,
        masterOffsetTop: number,
        containerHeightWithOffsetTopParam: number
    ): string {
        if (this._container && document) {
            const containerHeightWithOffsetTop =
                containerHeightWithOffsetTopParam || document.body.clientHeight;
            const normalHeight = scrollOffsetTop + masterOffsetTop;
            const containerClientRect = this._container.getBoundingClientRect();

            let offset = 0;
            if (containerClientRect.height) {
                offset = Math.max(
                    containerHeightWithOffsetTop - containerClientRect.bottom,
                    0
                );
            }
            const height =
                containerHeightWithOffsetTop -
                Math.max(normalHeight - scrollTop, masterOffsetTop) -
                offset;
            return `max-height: ${height}px;`;
        }
        return `max-height: calc(100vh - ${masterOffsetTop}px);`;
    }

    private _isMasterFixed(options: IMasterDetail): boolean {
        return options.scrollTop !== undefined;
    }

    private _updateSizesByPropStorageId(
        storage: object,
        options: IMasterDetail
    ): void {
        const width = storage && storage[options.propStorageId];
        if (width) {
            this._currentWidth = this._getWidthByType(width);
            this._savedWidth = width;
            this._updateOffset(options);
        } else {
            this.initCurrentWidth(options.masterWidth);
        }
    }

    protected _afterRender(): void {
        if (this._prevCurrentWidth !== this._currentWidth) {
            this._prevCurrentWidth = this._currentWidth;
            this._startResizeRegister();
        }
    }

    protected _touchstartHandler(e: SyntheticEvent<TouchEvent>): void {
        const needHandleTouch: boolean = this._needHandleTouch(e);
        if (needHandleTouch) {
            this._touchstartPosition = this._getTouchPageXCoord(e);
            this._beginResize();
            this._children.resizingLine.startDrag();
        }
    }

    protected _touchMoveHandler(e: SyntheticEvent<TouchEvent>): void {
        if (this._touchstartPosition) {
            const touchendPosition: number = this._getTouchPageXCoord(e);
            const touchOffset: number =
                touchendPosition - this._touchstartPosition;
            if (touchOffset !== 0) {
                this._children.resizingLine.drag(touchOffset);
            }
        }
    }

    /**
     * Если кто-то пометил событие тача, как обработанное, то не запускаем ресайз по тачу
     * Например, чтобы не ресайзить во время скролла списка
     * @param event
     * @private
     */
    private _needHandleTouch(event: SyntheticEvent<TouchEvent>): boolean {
        return !event.nativeEvent.processed;
    }

    protected _touchendHandler(e: SyntheticEvent<TouchEvent>): void {
        if (this._touchstartPosition && this._canResizing) {
            const touchendPosition: number = this._getTouchPageXCoord(e);
            const touchOffset: number =
                touchendPosition - this._touchstartPosition;
            this._touchstartPosition = null;
            this._children.resizingLine.endDrag(touchOffset);
        }
    }

    private _getTouchPageXCoord(e: SyntheticEvent<TouchEvent>): number {
        return e.nativeEvent.changedTouches[0].pageX;
    }

    private _startResizeRegister(): void {
        const eventCfg = {
            type: 'controlResize',
            target: this._container,
            _bubbling: true,
        };
        // https://online.sbis.ru/opendoc.html?guid=8aa1c2d6-f471-4a7e-971f-6ff9bfe72079
        // Это защита от случаев, когда при разрушении мастер области компонент внутри может вызвать resize,
        // при этом сам мастер ещё разрушен не до конца
        if (
            this._options.masterVisibility !== 'hidden' &&
            this._children.hasOwnProperty('resizeDetectMaster')
        ) {
            this._children.resizeDetectMaster.start(
                new SyntheticEvent(null, eventCfg)
            );
        }
        this._children.resizeDetectDetail.start(
            new SyntheticEvent(null, eventCfg)
        );
    }

    private _isSizeOptionsChanged(
        oldOptions: IMasterDetail,
        newOptions: IMasterDetail
    ): boolean {
        return (
            oldOptions.masterMinWidth !== newOptions.masterMinWidth ||
            oldOptions.masterWidth !== newOptions.masterWidth ||
            oldOptions.masterMaxWidth !== newOptions.masterMaxWidth
        );
    }

    protected _selectedMasterValueChangedHandler(
        event: Event,
        value: boolean
    ): void {
        this._selected = value;
        event.stopPropagation();
    }

    private _updateOffset(options: IMasterDetail): void {
        if (
            options.masterWidth !== undefined &&
            options.masterMaxWidth !== undefined &&
            options.masterMinWidth !== undefined
        ) {
            const currentMasterWidth = parseFloat(this._currentWidth)
                ? this._currentWidth
                : options.masterWidth;
            const isMasterWidthInPercents =
                this._isPercentValue(currentMasterWidth);
            let currentWidth = this._getOffsetValue(currentMasterWidth);
            this._currentWidth = this._getWidthByType(currentMasterWidth);

            const masterWidth =
                options.masterVisibility === 'visible' ? currentWidth : 0;
            this._detailWidth = this._getContainerWidth()
                ? this._getContainerWidth() - masterWidth
                : 0;

            // Если нет контейнера(до маунта) и значение задано в процентах, то мы не можем высчитать в px maxOffset
            // Пересчитаем после маунта в px, чтобы работало движение
            if (
                this._getContainerWidth() ||
                !this._isPercentValue(options.masterMaxWidth)
            ) {
                this._maxOffset =
                    this._getOffsetValue(options.masterMaxWidth) - currentWidth;
                // Protect against window resize
                if (this._maxOffset < 0) {
                    currentWidth += this._maxOffset;
                    this._maxOffset = 0;
                }
            }

            // Если нет контейнера(до маунта) и значение задано в процентах, то мы не можем высчитать в px minOffset
            // Пересчитаем после маунта в px, чтобы работало движение
            if (
                this._getContainerWidth() ||
                !this._isPercentValue(options.masterMinWidth)
            ) {
                this._minOffset =
                    currentWidth - this._getOffsetValue(options.masterMinWidth);
                // Protect against window resize
                if (this._minOffset < 0) {
                    currentWidth -= this._minOffset;
                    this._minOffset = 0;
                }
                this._currentWidth = isMasterWidthInPercents
                    ? this._getContainerWidth()
                        ? this._getWidthValueInPercents(currentWidth)
                        : currentMasterWidth
                    : currentWidth + 'px';
            }
        }
    }

    private _isCanResizing(options: IMasterDetail): boolean {
        if (
            options.propStorageId &&
            (!options.masterWidth ||
                !options.masterMaxWidth ||
                !options.masterMinWidth)
        ) {
            Logger.warn(
                'Для движения границ заданы не все настройки. Проверьте опции masterWidth, masterMaxWidth, masterMinWidth.',
                this
            );
        }
        const canResizing =
            options.masterWidth &&
            options.masterMaxWidth &&
            options.masterMinWidth &&
            options.masterMaxWidth !== options.masterMinWidth &&
            options.propStorageId;
        return !!canResizing;
    }

    protected _offsetHandler(event: Event, offset: number): void {
        if (offset !== 0) {
            this._changeOffset(offset);
        }
    }

    private _changeOffset(offset: number): void {
        const isMasterWidthInPercents = this._isPercentValue(
            this._currentWidth
        );
        const currentWidth = this._getOffsetValue(this._currentWidth);
        const newOffsetValue = currentWidth + offset;
        this._currentWidth = isMasterWidthInPercents
            ? this._getWidthValueInPercents(newOffsetValue)
            : newOffsetValue + 'px';
        this._updateOffset(this._options);
        this._notify('masterWidthChanged', [this._currentWidth]);
        this._setSettings(this._currentWidth);
    }

    private _isPercentValue(value: string | number): boolean {
        return `${value}`.includes('%');
    }

    private _getOffsetValue(value: string | number): number {
        const MaxPercent: number = 100;
        const intValue: number = parseFloat(String(value));
        if (!this._isPercentValue(value)) {
            return intValue;
        }
        return (this._getContainerWidth() * intValue) / MaxPercent;
    }

    private _getWidthValueInPercents(value: string | number): string {
        const MaxPercent: number = 100;
        const intValue: number = parseFloat(String(value));
        const calculatedWidth: number =
            (intValue / this._getContainerWidth()) * MaxPercent;
        return calculatedWidth.toFixed(2) + '%';
    }

    private _getContainerWidth(): number {
        if (!this._containerWidth) {
            this._containerWidth = this._container
                ? this._container.getBoundingClientRect().width
                : 0;
        }
        return this._containerWidth;
    }

    protected _resizeHandler(): void {
        // TODO https://online.sbis.ru/doc/a88a5697-5ba7-4ee0-a93a-221cce572430
        // Не запускаем реакцию на ресайз, если контрол скрыт
        // (к примеру лежит внутри скпытой области switchableArea) и когда нет движения границ
        if (!this._container.closest('.ws-hidden')) {
            if (this._options.propStorageId) {
                this._containerWidth = null;
                this._updateOffsetDebounced(this._options);
            }

            // Нужно чтобы лисенеры, лежащие внутри нашего регистратора, реагировали на ресайз страницы.
            // Код можно будет убрать, если в регистраторах дадут возможность не стопать событие регистрации лисенера,
            // чтобы лисенер мог регистрироваться в 2х регистраторах.
            this._startResizeRegister();
        }
    }

    static getDefaultOptions(): Partial<IMasterDetail> {
        return {
            masterWidth: '27%',
            masterMinWidth: 30,
            masterMaxWidth: '50%',
            contrastBackground: true,
            detailContrastBackground: true,
            masterContrastBackground: true,
            masterPosition: 'left',
            masterVisibility: 'visible',
        };
    }
}

export default Base;
