/**
 * @kaizen_zone 98d4b42e-2c0e-4268-a9e8-1e54d6e8ef27
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { debounce } from 'Types/function';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ResizingLine } from 'Controls/dragnDrop';
import { Listener, Register } from 'Controls/event';
import { getSettings, setSettings } from 'Controls/Application/SettingsController';
import { IPropStorageOptions } from 'Controls/interface';
import 'css!Controls/masterDetail';
import { Logger } from 'UI/Utils';
import ToggleButton from 'Controls/ToggleButton';
import { Container as ScrollContainer } from 'Controls/scroll';
import { AdaptiveContainer } from 'UI/Adaptive';
import { __notifyFromReact, checkWasabyEvent } from 'UI/Events';
import { DesignContext } from 'Controls/design';
import { isEqual } from 'Types/object';
import { Guid } from 'Types/entity';

const TOGGLE_BUTTON_CUSTOM_EVENTS = ['onValueChanged'];
const MASTER_FROM_PROPS_CUSTOM_EVENTS = ['onSelectedMasterValueChanged'];
const RESIZE_LINE_CUSTOM_EVENTS = ['onOffset', 'onCustomdragStart', 'onTouchStart'];
const DETAIL_TEMPLATE_CUSTOM_EVENTS = [
    'onControlResize',
    'onEnableVirtualNavigation',
    'onDisableVirtualNavigation',
];
const LISTENER_CUSTOM_EVENTS = ['onControlResize'];

const RESIZE_DELAY = 50;

export type TMasterVisibility = 'visible' | 'hidden';

export interface IMasterWidth {
    masterWidth?: number | string;
    masterMinWidth?: number | string;
    masterMaxWidth?: number | string;
    initialMasterWidth?: string | number;
}

interface IMasterDetail extends IControlOptions, IPropStorageOptions, IMasterWidth {
    master: TemplateFunction;
    detail: TemplateFunction;
    // TODO: удалить по задаче: https://online.sbis.ru/opendoc.html?guid=59b38808-e604-49a0-8873-bf324655c505
    forwardedRef: React.ForwardedRef<any>;
    contrastBackground?: boolean;
    masterContrastBackground?: boolean;
    detailContrastBackground?: boolean;
    masterVisibility?: TMasterVisibility;
    scrollTop?: number;
    scrollOffsetTop?: number;
    masterOffsetTop?: number;
    containerHeightWithOffsetTop?: number;
    masterPosition?: 'left' | 'right';
    newDesign?: boolean;
    restricted?: boolean;
    isAdaptive?: boolean;
    adaptiveContent?: boolean;
    masterClassName?: string;
    detailHeaderTemplate?: TemplateFunction;
    masterScrollbarVisible?: boolean;
    masterScrollBottomShadowVisibility?: boolean;
    onMasterWidthChanged?: (val: string | undefined) => void;
    isReactContent?: boolean;
}

interface IMasterDetailState extends IMasterWidth {
    canResizing: boolean;
    virtualNavigationEnabled: boolean;
    masterFixed: boolean;
    adaptiveMasterVisible: boolean;
    newDesign: boolean;
    scrollTop: number;
    selected?: string | null;
    minOffset?: number;
    maxOffset?: number;
    prevCurrentWidth?: string;
    currentWidth?: string;
    detailWidth?: number;
    currentMaxWidth?: string;
    currentMinWidth?: string;
    containerWidth?: number;
    touchstartPosition?: number;
    initialMasterWidth?: IMasterDetail['initialMasterWidth'];
}

function isMasterFixed({
    scrollTop,
    scrollOffsetTop,
    masterOffsetTop,
    isAdaptive,
}: IMasterDetail): boolean {
    return (
        !isAdaptive &&
        (scrollTop !== undefined ||
            (scrollOffsetTop !== undefined && masterOffsetTop !== undefined))
    );
}

function isSizeOptionsChanged(oldOptions: IMasterWidth, newOptions: IMasterWidth): boolean {
    return (
        oldOptions.masterMinWidth !== newOptions.masterMinWidth ||
        oldOptions.masterWidth !== newOptions.masterWidth ||
        oldOptions.masterMaxWidth !== newOptions.masterMaxWidth
    );
}

function isPercentValue(value: string | number | undefined): boolean {
    return `${value}`.includes('%');
}

function getWidthByType(width: string | number | undefined): string {
    if (isPercentValue(width)) {
        return String(width);
    }
    if (width !== undefined) {
        return parseFloat(width as string) + 'px';
    }
}

function getInitCurrentWidth(width: string | number, state: IMasterDetailState): string | void {
    if (width !== undefined && typeof width !== 'string' && typeof width !== 'number') {
        Logger.error(
            'MasterDetail:Base: Опция initialMasterWidth имеет некорректный тип.' +
                'В качестве значения опции нужно передавать процент или число.'
        );

        return state.currentWidth;
    }

    return getWidthByType(width);
}

function isCanResizing({
    propStorageId,
    masterWidth,
    masterMinWidth,
    masterMaxWidth,
}: IMasterDetail): boolean {
    if (propStorageId && (!masterWidth || !masterMaxWidth || !masterMinWidth)) {
        Logger.warn(
            'Для движения границ заданы не все настройки. Проверьте опции masterWidth, masterMaxWidth, masterMinWidth.'
        );
    }
    const canResizing =
        masterWidth &&
        masterMaxWidth &&
        masterMinWidth &&
        masterMaxWidth !== masterMinWidth &&
        propStorageId;
    return !!canResizing;
}

function getPreparedLimitSizes({ masterMaxWidth, masterMinWidth }: IMasterDetail): {
    currentMaxWidth?: string;
    currentMinWidth?: string;
} {
    // Если _currentWidth задан в процентах, а minWidth и maxWidth в пикселях, может получиться ситуация, что
    // _currentWidth больше допустимого значения. Узнаем мы это только на клиенте, когда будут размеры контрола.
    // Чтобы верстка визуально не прыгала после оживления, вешаю minWidth и maxWidth сразу на контейнер мастера.
    const newMaxSizes: Partial<IMasterDetailState> = {};

    if (isPercentValue(masterMaxWidth)) {
        newMaxSizes.currentMaxWidth = masterMaxWidth as string;
    } else if (masterMaxWidth !== undefined) {
        newMaxSizes.currentMaxWidth = getWidthByType(masterMaxWidth);
    }

    if (isPercentValue(masterMinWidth)) {
        newMaxSizes.currentMinWidth = masterMinWidth as string;
    } else if (masterMinWidth !== undefined) {
        newMaxSizes.currentMinWidth = getWidthByType(masterMinWidth);
    }

    return newMaxSizes;
}

function isMasterWidthEqualAuto(masterWidth): boolean {
    return masterWidth === 'auto';
}

/**
 * Контрол, который обеспечивает связь между двумя контролами для отображения подробной информации по выбранному элементу.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/master-detail/ руководство разработчика}
 * * {@link /doc/platform/developmentapl/interface-development/application-architecture/error-handling/error-handling-controls/#error-handling-for-multiple-list-controls обработка ошибок}
 *
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
class Base extends React.Component<IMasterDetail, IMasterDetailState> {
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
     * @variant auto ширина мастера берется по контенту.
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
     * @name Controls/_masterDetail/Base#masterClassName
     * @cfg {string} Класс, который повесится на область master
     * @remark Используется для решения задачи добавления "воздуха" сверху области master.
     * Используйте класс controls-air-m, чтобы добавить "воздуха"
     * @example
     * <MasterDetail
     *    masterClassName={'controls-air-m'}
     *    master={
     * 		<ScrollContainer>
     * 			<GridView/>
     * 		</ScrollContainer>
     * 	}
     * />
     */

    private _container: HTMLDivElement | null;
    private _containerWidth: number;
    // Защита от множ. вызова БЛ
    private _savedWidth: string;
    private _prevCurrentWidth: string;
    private _children: {
        master?: HTMLElement;
        detail?: HTMLElement;
        resizingLine?: ResizingLine;
        resizeDetectMasterScrollContainer?: Register;
        resizeDetectMasterAdaptive?: Register;
    } = {};
    private readonly resizeDetectDetail: React.RefObject<Register>;
    private readonly resizeDetectMasterTemplate: React.RefObject<Register>;
    private _instanceId: string = 'inst_' + Guid.create();

    constructor(props = {} as IMasterDetail) {
        super(props);

        const initMaxSizes = getPreparedLimitSizes(props);

        let currentWidth: string;
        if (props.propStorageId) {
            if (props.initialMasterWidth) {
                currentWidth = getInitCurrentWidth(props.initialMasterWidth, this.state);
            } else {
                this.getSettings(props).then((storage: object) => {
                    this.updateSizesByPropStorageId(storage, props);
                    this.setState(getPreparedLimitSizes(props));
                });
            }
        } else {
            currentWidth = getInitCurrentWidth(props.masterWidth, this.state);
        }

        this.state = {
            adaptiveMasterVisible: !props.isAdaptive,
            canResizing: isCanResizing(props),
            virtualNavigationEnabled: false,
            masterFixed: isMasterFixed(props),
            scrollTop: 0,
            currentWidth,
            initialMasterWidth: props.initialMasterWidth,
            masterWidth: props.masterWidth,
            ...initMaxSizes,
        };

        this._container = null;
        this.resizeDetectDetail = React.createRef();
        this.resizeDetectMasterTemplate = React.createRef();
    }

    componentDidMount(): void {
        this._prevCurrentWidth = this.state.currentWidth;
        // TODO: удалить вызов метода для перерасчета ширины мастера, после пересхранения значения в процентах
        //  во всех местах использования masterDetail.
        if (this.props.propStorageId && this.props.initialMasterWidth && !this.props.isAdaptive) {
            this._setPercentWidth();
        }
        if (this.props.task1188709641) {
            this.setState(this.updateOffset(this.props, this.state));
        }

        if (this.isMasterFixedWithoutScrollTopValue(this.props) && this._container) {
            __notifyFromReact(
                this._container,
                'register',
                ['customscroll', this, this.scrollHandler.bind(this)],
                true
            );
        }
    }

    shouldComponentUpdate(
        options: IMasterDetail,
        newComponentState: Partial<IMasterDetailState>
    ): boolean {
        let newState = { ...newComponentState };

        if (isSizeOptionsChanged(options, this.props)) {
            newState = {
                ...newState,
                ...this.updateOffset(options, newState),
            };
        }

        if (options.masterVisibility !== this.props.masterVisibility) {
            newState = {
                ...newState,
                ...this.updateOffset(options, newState),
            };
        }

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }

        return true;
    }

    componentDidUpdate(prevProps: IMasterDetail): void {
        if (prevProps.masterVisibility !== this.props.masterVisibility) {
            this.startResizeRegister();
        }

        if (this._prevCurrentWidth !== this.state.currentWidth) {
            this._prevCurrentWidth = this.state.currentWidth;
            this.startResizeRegister();
        }

        if (prevProps.propStorageId !== this.props.propStorageId) {
            this.getSettings(this.props).then((storage) => {
                this.updateSizesByPropStorageId(storage, this.props);
            });
        }
    }

    componentWillUnmount(): void {
        if (this._container) {
            __notifyFromReact(this._container, 'unregister', ['customscroll', this], true);
        }
    }

    getInstanceId(): string {
        return this._instanceId;
    }

    /**
     * @name Controls/_masterDetail/Base#masterWidthChanged
     * @event Происходит при изменении ширины мастера.
     * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
     * @param {String} width Ширина мастера.
     * @remark Событие провоцируется через движение границ, или после изменения размеров родительским контролом.
     * @see propStorageId
     */

    getSettings = (options: IMasterDetail): Promise<unknown> => {
        return getSettings([options.propStorageId]);
    };

    dragStartHandler = (): void => {
        this.beginResize();
    };

    beginResize = (): void => {
        if (!this.state.minOffset && !this.state.maxOffset && this.state.canResizing) {
            this.setState(this.updateOffset(this.props, this.state));
        }
    };

    setSettings = (width: number | string | undefined): void => {
        const propStorageId = this.props.propStorageId;
        if (propStorageId) {
            if (this._savedWidth !== width) {
                this._savedWidth = getWidthByType(width);
                // TODO https://online.sbis.ru/opendoc.html?guid=15ca318c-c50f-44a4-b2a6-6ab495a6a103&client=3
                // Временное решение с передачей экземпляра класса ViewSettings через опции
                // для правильной работы ресайза MasterDetail в приложении на панели.
                // В будущем его нужно положить в слайс и брать оттуда вместо опции.
                //@ts-ignore
                setSettings(
                    { [propStorageId]: this._savedWidth },
                    this.props.ViewSettingsController
                );
            }
        }
    };

    private _setPercentWidth = (): void => {
        const { masterWidth, initialMasterWidth, masterMaxWidth } = this.props;
        if (
            isPercentValue(masterWidth) &&
            !isPercentValue(initialMasterWidth) &&
            this.getContainerWidth()
        ) {
            let masterRecalculatedWidth = this.getWidthValueInPercents(initialMasterWidth);
            const masterCalculatedMaxWidth = isPercentValue(masterMaxWidth)
                ? masterMaxWidth
                : this.getWidthValueInPercents(masterMaxWidth);

            if (masterRecalculatedWidth > masterCalculatedMaxWidth) {
                masterRecalculatedWidth = masterCalculatedMaxWidth;
            }
            this.setSettings(masterRecalculatedWidth);

            this.setState({
                currentWidth: masterRecalculatedWidth,
            });
        }
    };

    onMasterWidthChanged(newWidth: string | undefined) {
        if (this.props.onMasterWidthChanged) {
            if (checkWasabyEvent(this.props.onMasterWidthChanged)) {
                this.props.onMasterWidthChanged(newWidth);
            } else {
                const event = new SyntheticEvent(null, {
                    type: 'masterWidthChanged',
                });

                // Wasaby пользователи ожидают получить первым аргументом объект события
                //@ts-ignore
                this.props.onMasterWidthChanged(event, newWidth);
            }
        }
    }

    updateOffsetDebounced = debounce((): void => {
        this.setState(this.updateOffset(this.props, this.state));
        this.setSettings(this.state.currentWidth);

        this.onMasterWidthChanged(this.state.currentWidth);
    }, RESIZE_DELAY);

    getMasterMaxHeight = (
        scrollTop: number = 0,
        scrollOffsetTop: number,
        masterOffsetTop: number,
        containerHeightWithOffsetTopParam: number
    ): string => {
        if (this._container && document?.body) {
            const containerHeightWithOffsetTop =
                containerHeightWithOffsetTopParam || document.body.clientHeight;
            const normalHeight = scrollOffsetTop + masterOffsetTop;
            const containerClientRect = this._container.getBoundingClientRect();

            let offset = 0;
            if (containerClientRect.height) {
                offset = Math.max(containerHeightWithOffsetTop - containerClientRect.bottom, 0);
            }
            let height;
            if (this.state.virtualNavigationEnabled) {
                height = containerHeightWithOffsetTop - masterOffsetTop - offset;
            } else {
                height =
                    containerHeightWithOffsetTop -
                    Math.max(normalHeight - scrollTop, masterOffsetTop) -
                    offset;
            }
            return `${height}px`;
        }
        return `calc(100vh - ${masterOffsetTop}px)`;
    };

    enableVirtualNavigationHandler = (event: SyntheticEvent, position: 'top' | 'bottom'): void => {
        if (position === 'top') {
            this.setState({ virtualNavigationEnabled: true });
        }
    };

    disableVirtualNavigationHandler = (event: SyntheticEvent, position: 'top' | 'bottom'): void => {
        if (position === 'top') {
            this.setState({ virtualNavigationEnabled: false });
        }
    };

    // Костыль, который нужен, пока newBrowser не переведён на React
    // Сейчас masterDetail вставляется в newBrowser, единственный способ передать опцию для мастера,
    // это передать опцию в newBrowser.
    // Если при скроле передавать опцию (scrollTop) newBrowser'у,
    // то будут сильные тормоза из-за тяжелых синхронизаций, т.к. у newBrowser'a огромный тяжёлый шаблон
    isMasterFixedWithoutScrollTopValue = (options: IMasterDetail): boolean => {
        return isMasterFixed(options) && options.scrollTop === undefined;
    };

    scrollHandler = (event: SyntheticEvent, scrollTop: number): void => {
        if (this.props.masterVisibility !== 'hidden') {
            this.setState({ scrollTop });
        }
    };

    updateSizesByPropStorageId = (storage: object, options: IMasterDetail): void => {
        const width: string = storage && storage[options.propStorageId];
        if (width) {
            this._savedWidth = width;
            const newState: Partial<IMasterDetailState> = {
                currentWidth: getWidthByType(width),
            };
            this.setState(this.updateOffset(options, { ...this.state, ...newState }));
        } else {
            this.setState({
                currentWidth: getInitCurrentWidth(options.masterWidth, this.state),
            });
        }
    };

    touchstartHandler = (e: React.TouchEvent<HTMLDivElement>): void => {
        const needHandleTouch: boolean = this.needHandleTouch(e);
        if (needHandleTouch) {
            this.setState({ touchstartPosition: this.getTouchPageXCoord(e) });
            this.beginResize();
            this._children.resizingLine?.startDrag();
        }
    };

    touchMoveHandler = (e: React.TouchEvent<HTMLDivElement>): void => {
        if (this.state.touchstartPosition) {
            const touchendPosition: number = this.getTouchPageXCoord(e);
            const touchOffset: number = touchendPosition - this.state.touchstartPosition;
            if (touchOffset !== 0) {
                this._children.resizingLine.drag(touchOffset);
            }
        }
    };

    /**
     * Если кто-то пометил событие тача, как обработанное, то не запускаем ресайз по тачу
     * Например, чтобы не ресайзить во время скролла списка
     * @param event
     * @private
     */
    needHandleTouch = (event: React.TouchEvent<HTMLDivElement>): boolean => {
        return !event.processed;
    };

    touchendHandler = (e: React.TouchEvent<HTMLDivElement>): void => {
        if (this.state.touchstartPosition && this.state.canResizing) {
            const touchendPosition: number = this.getTouchPageXCoord(e);
            const touchOffset: number = touchendPosition - this.state.touchstartPosition;
            this.setState({
                touchstartPosition: null,
            });
            this._children.resizingLine.endDrag(touchOffset);
        }
    };

    getTouchPageXCoord = (e: React.TouchEvent<HTMLDivElement>): number => {
        return e.changedTouches[0].pageX;
    };

    startResizeRegister = (): void => {
        const eventCfg = {
            type: 'controlResize',
            target: this._container,
            _bubbling: true,
        };

        // https://online.sbis.ru/opendoc.html?guid=8aa1c2d6-f471-4a7e-971f-6ff9bfe72079
        // Это защита от случаев, когда при разрушении мастер области компонент внутри может вызвать resize,
        // при этом сам мастер ещё разрушен не до конца
        if (this.props.masterVisibility !== 'hidden') {
            this.getResizeDetectMaster()?.start(new SyntheticEvent(null, eventCfg));
        }
        this.resizeDetectDetail.current?.start(new SyntheticEvent(null, eventCfg));
    };

    selectedMasterValueChangedHandler = (value: string): void => {
        if (this.state.selected !== value) {
            this.setState({ selected: value });
        }
    };

    updateOffset = (options: IMasterDetail, state: IMasterDetailState): IMasterDetailState => {
        const { masterWidth, masterMaxWidth, masterMinWidth } = options;
        if (
            masterWidth !== undefined &&
            masterMaxWidth !== undefined &&
            masterMinWidth !== undefined
        ) {
            const newState: IMasterDetailState = { ...this.state };
            const containerWidth = this.getContainerWidth();
            const currentMasterWidth = parseFloat(state.currentWidth)
                ? state.currentWidth
                : masterWidth;
            const isMasterWidthInPercents = isPercentValue(currentMasterWidth);
            let currentWidth = this.getMasterCurrentWidth(options, state);
            newState.masterWidth = state.masterWidth;
            newState.currentWidth = getWidthByType(currentMasterWidth);

            const masterCurrentWidth = options.masterVisibility === 'visible' ? currentWidth : 0;
            newState.detailWidth = Math.max(
                containerWidth ? containerWidth - masterCurrentWidth : 0,
                0
            );

            // Если нет контейнера(до маунта) и значение задано в процентах, то мы не можем высчитать в px maxOffset
            // Пересчитаем после маунта в px, чтобы работало движение
            const reCalcMaxOffset = containerWidth || !isPercentValue(masterMaxWidth);
            if (reCalcMaxOffset) {
                newState.maxOffset = this.getOffsetValue(masterMaxWidth) - currentWidth;
                // Protect against window resize
                if (newState.maxOffset < 0) {
                    currentWidth += newState.maxOffset;
                    newState.maxOffset = 0;
                }
            }

            // Если нет контейнера(до маунта) и значение задано в процентах, то мы не можем высчитать в px minOffset
            // Пересчитаем после маунта в px, чтобы работало движение
            if (containerWidth || !isPercentValue(masterMinWidth)) {
                newState.minOffset = currentWidth - this.getOffsetValue(masterMinWidth);
                // Protect against window resize
                if (newState.minOffset < 0) {
                    currentWidth -= newState.minOffset;
                    newState.minOffset = 0;
                }
                newState.currentWidth = (
                    isMasterWidthInPercents
                        ? containerWidth
                            ? this.getWidthValueInPercents(currentWidth)
                            : currentMasterWidth
                        : currentWidth + 'px'
                ) as string;
            }

            if (state.currentWidth !== newState.currentWidth && reCalcMaxOffset) {
                newState.maxOffset =
                    this.getOffsetValue(masterMaxWidth) -
                    this.getMasterCurrentWidth(options, newState);
            }

            return newState;
        }
    };

    getMasterCurrentWidth(props: IMasterDetail, state: IMasterDetailState): number {
        return this.getOffsetValue(
            parseFloat(state.currentWidth) ? state.currentWidth : props.masterWidth
        );
    }

    offsetHandler = (offset: number): void => {
        if (offset !== 0) {
            this.changeOffset(offset);
        }
    };

    changeOffset = (offset: number): void => {
        const newState: IMasterDetailState = { ...this.state };

        const isMasterWidthInPercents = isPercentValue(newState.currentWidth);
        const currentWidth = this.getOffsetValue(newState.currentWidth);
        const newOffsetValue = currentWidth + offset;
        newState.currentWidth = isMasterWidthInPercents
            ? this.getWidthValueInPercents(newOffsetValue)
            : newOffsetValue + 'px';
        this.onMasterWidthChanged(newState.currentWidth);
        this.setSettings(newState.currentWidth);
        this.setState(this.updateOffset(this.props, newState));
        this.startResizeRegister();
    };

    getOffsetValue = (value: string | number): number => {
        const MaxPercent: number = 100;
        const intValue: number = parseFloat(String(value));
        if (!isPercentValue(value)) {
            return intValue;
        }
        return (this.getContainerWidth() * intValue) / MaxPercent;
    };

    getWidthValueInPercents = (value: string | number): string => {
        const MaxPercent: number = 100;
        const intValue: number = parseFloat(String(value));
        const calculatedWidth: number = (intValue / this.getContainerWidth()) * MaxPercent;
        return calculatedWidth.toFixed(2) + '%';
    };

    getContainerWidth = (): number => {
        let containerWidth = this._containerWidth;
        if (!this._containerWidth) {
            containerWidth = this._containerWidth = this._calcContainerWidth();
        }
        return containerWidth;
    };

    _calcContainerWidth(): number {
        return this._container ? this._container.getBoundingClientRect().width : 0;
    }

    resizeHandler = (): void => {
        // TODO https://online.sbis.ru/doc/a88a5697-5ba7-4ee0-a93a-221cce572430
        // Не запускаем реакцию на ресайз, если контрол скрыт
        // (к примеру лежит внутри скпытой области switchableArea) и когда нет движения границ
        if (!this._container.closest('.ws-hidden')) {
            if (this.props.propStorageId && !this.props.isAdaptive) {
                if (this._containerWidth && this._containerWidth !== this._calcContainerWidth()) {
                    this._containerWidth = null;
                    this.updateOffsetDebounced();
                } else {
                    // Чтобы проинициализировать и закэшировать ширину мастера для использования при следующих ресайзах
                    this.getContainerWidth();
                }
            }

            // Нужно чтобы лисенеры, лежащие внутри нашего регистратора, реагировали на ресайз страницы.
            // Код можно будет убрать, если в регистраторах дадут возможность не стопать событие регистрации лисенера,
            // чтобы лисенер мог регистрироваться в 2х регистраторах.
            this.startResizeRegister();

            // Когда меняется высота области, в которой лежит master, надо вызвать перерасчёты высоты мастера
            if (this.isMasterFixedWithoutScrollTopValue(this.props)) {
                this.forceUpdate();
            }
        }
    };

    adaptiveMasterVisibleChanged = (event: SyntheticEvent, value: boolean) => {
        this.setState({ adaptiveMasterVisible: value });
    };

    mergeRefs: React.LegacyRef<HTMLDivElement> = (elem) => {
        this._container = elem;

        if (!this.props.forwardedRef) {
            return;
        }

        if (typeof this.props.forwardedRef === 'function') {
            this.props.forwardedRef(elem);
        } else {
            this.props.forwardedRef.current = elem;
        }
    };

    registerResizingLine = (elem: any) => {
        this._children.resizingLine = elem;
    };

    registerResizeDetectMasterScrollContainer = (elem: any) => {
        this._children.resizeDetectMasterScrollContainer = elem;
    };

    registerResizeDetectMasterAdaptive = (elem: any) => {
        this._children.resizeDetectMasterAdaptive = elem;
    };

    getResizeDetectMaster = () => {
        const { resizeDetectMasterScrollContainer, resizeDetectMasterAdaptive } = this._children;

        return (
            resizeDetectMasterScrollContainer ??
            resizeDetectMasterAdaptive ??
            this.resizeDetectMasterTemplate.current
        );
    };

    getMasterTemplateContent = () => {
        const MasterTemplate = this.props.master;
        const isNewDesign = this._isNewDesign();

        let className = `
            controls-MasterDetail_master-template
            controls-master-template-${isNewDesign ? 'newDesign' : 'default'}
            controls-master-template-${isNewDesign ? 'newDesign' : 'default'}-${
            this.props.masterPosition
        }
        `;

        if (this.props.masterPosition === 'right') {
            className += ' controls-MasterDetail_outerPadding-reset';
        }

        const masterTemplateProps: Record<string, any> = {
            attrs: {
                key: 'mtmpl',
            },
            backgroundStyle: 'master',
            masterWidth: this.state.currentWidth,
            shadowMode: 'js',
            pixelRatioBugFix: !this.props.isAdaptive,
            onSelectedMasterValueChanged: this.selectedMasterValueChangedHandler,
            customEvents: MASTER_FROM_PROPS_CUSTOM_EVENTS,
        };

        // TODO: Использование isReactContent -- временное решение. Уйдет по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=52a5d31a-d7ec-4e22-9ee1-a2630f8e2e7e&client=3
        if (this.props.isReactContent) {
            masterTemplateProps.className = className;
        } else {
            masterTemplateProps.attrs.className = className;
        }

        return this._isWasabyOrFunction(MasterTemplate) ? (
            <MasterTemplate {...masterTemplateProps} />
        ) : (
            React.cloneElement(MasterTemplate, masterTemplateProps)
        );
    };

    getMasterTemplate = (className?: string) => {
        return (
            <>
                {this.props.isAdaptive && !this.props.adaptiveContent ? (
                    <div className={'controls-MasterDetail_isAdaptive_masterExpander ' + className}>
                        <ToggleButton
                            attrs={{ key: 'isAdp_expndr' }}
                            icons={['icon-TFFolder2Opened', 'icon-TFFolder2']}
                            viewMode="link"
                            data-qa="controls-Adaptive__FolderButton"
                            value={this.state.adaptiveMasterVisible}
                            onValueChanged={this.adaptiveMasterVisibleChanged}
                            customEvents={TOGGLE_BUTTON_CUSTOM_EVENTS}
                        />
                    </div>
                ) : null}
                {this.props.master &&
                (!this.props.isAdaptive ||
                    this.props.adaptiveContent ||
                    this.state.adaptiveMasterVisible)
                    ? this.getMasterTemplateContent()
                    : null}
            </>
        );
    };

    getMasterDetailMasterStyles = () => {
        const masterDetailMasterStyles: React.CSSProperties = {};

        if (this.state.masterFixed) {
            masterDetailMasterStyles.position = 'sticky';
            masterDetailMasterStyles.top = this.props.masterOffsetTop;
            masterDetailMasterStyles.maxHeight = this.getMasterMaxHeight(
                this.props.scrollTop || this.state.scrollTop,
                this.props.scrollOffsetTop,
                this.props.masterOffsetTop,
                this.props.containerHeightWithOffsetTop
            );
        }

        if (!this.props.isAdaptive) {
            masterDetailMasterStyles.width = isMasterWidthEqualAuto(this.props.masterWidth)
                ? 'auto'
                : this.state.currentWidth;
            masterDetailMasterStyles.maxWidth = this.state.currentMaxWidth;
            masterDetailMasterStyles.minWidth = this.state.currentMinWidth;
        }

        return masterDetailMasterStyles;
    };

    insertDetailTemplate = () => {
        const DetailTemplate = this.props.detail;

        const className = `
            controls-MasterDetail_detailsContent
            ${this.props.masterPosition === 'right' ? 'ws-flex-grow-1' : ''}
            ${
                this.props.contrastBackground && this.props.detailContrastBackground
                    ? 'controls-MasterDetail_details-bg-contrast ' +
                      (this._isNewDesign() && !this.props.isAdaptive
                          ? 'controls-MasterDetail_details-newDesign'
                          : '') +
                      (this.props.masterVisibility === 'visible' &&
                      this.props.masterPosition === 'left'
                          ? ' tlr controls-MasterDetail_outerPadding-reset'
                          : ' tr')
                    : 'controls-MasterDetail_details_bg-same'
            }
        `;

        // TODO: Использование isReactContent -- временное решение. Уйдет по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=52a5d31a-d7ec-4e22-9ee1-a2630f8e2e7e&client=3
        const DetailTemplateProps = {
            shadowMode: 'js',
            masterWidth: this.state.currentWidth,
            availableWidth: this.state.detailWidth,
            selectedMasterValue: this.state.selected,
            onControlResize: this.resizeHandler,
            onEnableVirtualNavigation: this.enableVirtualNavigationHandler,
            onDisableVirtualNavigation: this.disableVirtualNavigationHandler,
            customEvents: DETAIL_TEMPLATE_CUSTOM_EVENTS,
        };

        // TODO: Использование isReactContent -- временное решение. Уйдет по задаче:
        //  https://online.sbis.ru/opendoc.html?guid=52a5d31a-d7ec-4e22-9ee1-a2630f8e2e7e&client=3
        if (this.props.isReactContent) {
            DetailTemplateProps.className = className;
        } else {
            DetailTemplateProps.attrs = { className };
        }

        return DetailTemplate ? (
            this._isWasabyOrFunction(DetailTemplate) ? (
                <DetailTemplate {...DetailTemplateProps} />
            ) : (
                React.cloneElement(DetailTemplate, DetailTemplateProps)
            )
        ) : null;
    };

    // TODO: Заменить на использование библиотечного хелпера, когда его добавят
    private _isWasabyOrFunction(template: unknown): boolean {
        const memoSymbol = Symbol.for('react.memo');
        const forwardRefSymbol = Symbol.for('react.forward_ref');
        return (
            template?.isWasabyTemplate ||
            typeof template === 'function' ||
            template?.$$typeof === memoSymbol ||
            template?.$$typeof === forwardRefSymbol
        );
    }

    private _isNewDesign(): boolean {
        return this.context?.newDesign || this.props.newDesign;
    }

    static getDerivedStateFromProps(
        props: IMasterDetail,
        state: IMasterDetailState
    ): Partial<IMasterDetailState> {
        const { initialMasterWidth } = props;
        const masterFixed = isMasterFixed(props);
        let changes: Partial<IMasterDetailState> = {};

        if (props.masterWidth !== state.masterWidth) {
            changes.masterWidth = props.masterWidth;
            changes.currentWidth = null;
        }

        if (initialMasterWidth) {
            if (initialMasterWidth !== state.initialMasterWidth || !state.currentWidth) {
                changes = {
                    currentWidth: getInitCurrentWidth(initialMasterWidth, state),
                    initialMasterWidth,
                };
            }
        }

        if (masterFixed !== state.masterFixed) {
            changes.masterFixed = masterFixed;
        }

        if (isSizeOptionsChanged(props, state)) {
            changes = {
                ...changes,
                ...getPreparedLimitSizes(props),
                canResizing: isCanResizing(props),
            };
        }

        return changes;
    }

    render() {
        const MasterTemplate = this.props.master;
        const DetailHeaderTemplate = this.props.detailHeaderTemplate;

        const { isAdaptive } = this.props;

        const masterDetailsMasterContentMaxHeight = this.getMasterMaxHeight(
            this.props.scrollTop || this.state.scrollTop,
            this.props.scrollOffsetTop,
            this.props.masterOffsetTop,
            this.props.containerHeightWithOffsetTop
        );

        return (
            <div
                style={this.props.attrs?.style}
                ref={this.mergeRefs}
                className={`
                controls-MasterDetail controls-MasterDetail_masterPosition-${
                    this.props.masterPosition
                }
                ${isAdaptive ? 'controls-MasterDetail_isAdaptive' : ''}
                ws-flexbox controls_list_theme-${this.props.theme}
                ${this.props.restricted ? 'controls-MasterDetail-restricted' : ''}
                ${this.props.className}
              `}
            >
                {this.props.masterVisibility !== 'hidden' ? (
                    <div
                        className={`
                        controls-MasterDetail_master ${this.props.masterClassName}
                        ${
                            isAdaptive
                                ? 'controls-MasterDetail_master_adaptive'
                                : 'controls-MasterDetail_master-' +
                                  (this.props.masterContrastBackground ? 'contrast' : 'transparent')
                        } ${!isAdaptive ? 'controls-MasterDetail_master_width' : ''}
                      `}
                        style={this.getMasterDetailMasterStyles()}
                        onTouchMove={this.touchMoveHandler}
                        onTouchEnd={this.touchendHandler}
                    >
                        {this.state.masterFixed ? (
                            <Register
                                register="controlResize"
                                ref={this.registerResizeDetectMasterScrollContainer}
                            >
                                <div
                                    style={{
                                        display: 'contents',
                                        maxHeight: masterDetailsMasterContentMaxHeight,
                                    }}
                                >
                                    <ScrollContainer
                                        className="controls-MasterDetail_master-content"
                                        backgroundStyle="master"
                                        scrollbarVisible={this.props.masterScrollbarVisible}
                                        bottomShadowVisibility={
                                            this.props.masterScrollBottomShadowVisibility
                                        }
                                        attrs={{
                                            style: `maxHeight: ${masterDetailsMasterContentMaxHeight}`,
                                        }}
                                    >
                                        {this.getMasterTemplate()}
                                    </ScrollContainer>
                                </div>
                            </Register>
                        ) : (
                            <>
                                {isAdaptive && !this.props.adaptiveContent ? (
                                    <Register
                                        register="controlResize"
                                        ref={this.registerResizeDetectMasterAdaptive}
                                    >
                                        <div
                                            className={
                                                'controls-MasterDetail_isAdaptive_masterExpander controls-MasterDetail_master-template'
                                            }
                                        >
                                            <ToggleButton
                                                icons={['icon-TFFolder2Opened', 'icon-TFFolder2']}
                                                viewMode="link"
                                                data-qa="controls-Adaptive__FolderButton"
                                                value={this.state.adaptiveMasterVisible}
                                                onValueChanged={this.adaptiveMasterVisibleChanged}
                                                customEvents={TOGGLE_BUTTON_CUSTOM_EVENTS}
                                            />
                                        </div>
                                    </Register>
                                ) : null}
                                {MasterTemplate &&
                                (!isAdaptive ||
                                    this.props.adaptiveContent ||
                                    this.state.adaptiveMasterVisible) ? (
                                    <Register
                                        register="controlResize"
                                        ref={this.resizeDetectMasterTemplate}
                                    >
                                        {this.getMasterTemplateContent()}
                                    </Register>
                                ) : null}
                            </>
                        )}
                    </div>
                ) : null}

                {this.state.canResizing && !isMasterWidthEqualAuto(this.props.masterWidth) ? (
                    <div
                        className={`
                        controls-MasterDetail_resizing-line_wrapper
                        controls-MasterDetail_resizingLine_masterPosition-${this.props.masterPosition}
                    `}
                    >
                        <ResizingLine
                            ref={this.registerResizingLine}
                            className={`
                            controls-MasterDetail_resizing-line
                            ${
                                this._isNewDesign()
                                    ? 'controls-MasterDetail_resizing-line-newDesign'
                                    : null
                            }
                            controls-MasterDetail_resizing-line_position-${
                                this.props.masterPosition
                            }
                        `}
                            data-qa="controls-MasterDetail_resizing-line"
                            minOffset={this.state.minOffset}
                            maxOffset={this.state.maxOffset}
                            direction={this.props.masterPosition === 'left' ? 'direct' : 'reverse'}
                            onCustomdragStart={this.dragStartHandler}
                            onOffset={this.offsetHandler}
                            onTouchStart={this.touchstartHandler}
                            customEvents={RESIZE_LINE_CUSTOM_EVENTS}
                        />
                    </div>
                ) : null}

                <Register register="controlResize" ref={this.resizeDetectDetail}>
                    <AdaptiveContainer width={this.state.detailWidth}>
                        <div
                            className={`
                            controls-MasterDetail_details
                            controls-MasterDetail_details-${
                                this.props.detailContrastBackground ? 'contrast' : 'transparent'
                            }${isAdaptive ? '-adaptive' : ''}
                            ws-flexbox ws-flex-grow-1 ${
                                DetailHeaderTemplate ? 'ws-flex-column' : ''
                            }
                          `}
                        >
                            {DetailHeaderTemplate ? (
                                this._isWasabyOrFunction(DetailHeaderTemplate) ? (
                                    <DetailHeaderTemplate />
                                ) : (
                                    React.cloneElement(DetailHeaderTemplate)
                                )
                            ) : null}

                            {this.insertDetailTemplate()}
                        </div>
                    </AdaptiveContainer>
                </Register>

                <Listener
                    customEvents={LISTENER_CUSTOM_EVENTS}
                    event="controlResize"
                    onControlResize={this.resizeHandler}
                />
            </div>
        );
    }

    static displayName: string = 'Controls/masterDetail:Base';
    static defaultProps: Partial<IMasterDetail> = {
        isReactContent: false,
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

Base.contextType = DesignContext;

// Прокси-обертка для использования дефолтного наименования ref пропса
export default React.forwardRef((props: Omit<IMasterDetail, 'forwardedRef'>, ref) => (
    <Base {...props} forwardedRef={ref} />
));
