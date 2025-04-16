import Async from 'Controls/Container/Async';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import { IPopupItem } from 'Controls/_popup/interface/IPopup';
import { IPopupWidthOptions } from 'Controls/_popup/interface/IPopupWidth';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';
import { Context as FreezeContext, IFreezeContext } from 'Controls/freezeContext';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';
import { Control } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { Component, RefObject, createRef } from 'react';
import { createPortal } from 'react-dom';
import BaseOpener from './Openers/Base';
import ConfirmationOpener from './Openers/Confirmation';
import DialogOpener from './Openers/Dialog';
import InfoboxOpener from './Openers/Infobox';
import NotificationOpener from './Openers/Notification';
import PreviewerOpener from './Openers/Previewer';
import StackOpener from './Openers/Stack';
import StickyOpener from './Openers/Sticky';
import Controller from './Popup/GlobalController';
import { reactEventList } from 'UICore/Events';

interface IPortalOpener extends IBasePopupOptions, IPopupWidthOptions, IStickyPopupOptions {
    popupType: TPopupType;
    customPopupType?: ICustomPopupType;

    contentComponent?: string | Control | Function;
    contentProps?: {};
}

/**
 * Интерфейс кастомной конфигурации окна.
 * @example
 * getCustomPopup() {
 * import { StackOpener } from 'Controls/popup';
 *     return {
 *         opener: StackOpener,
 *         adaptiveViewMode: 'fullscreen',
 *     }
 * }
 */

export interface ICustomPopupType {
    /**
     * Открыватор из стандартного наобора Controls/popup:${NAME}Opener
     */
    opener: any;
    /**
     * Определяет, в каком виде откроется окно в адаптиве.
     * @variant fullscreen Адаптивоне окно на весь эркан.
     * @variant sliding Шторка.
     * @variant false Десктопное окно.
     */
    adaptiveViewMode: string | boolean;
}

const EVENT_LIST = ['onClick', 'onMouseDown', 'onTouchStart'];

// События из портала проксируются на открывающий элемент.
// Будем точечно добавлять нужные события и останавливать их самостоятельно.
const getEventList = () => {
    const handlers = {};
    EVENT_LIST.forEach((eventName: string) => {
        handlers[eventName] = (event) => {
            event.stopPropagation();
        };
    });
    return handlers;
};

const POPUP_CONTAINER_NODE = '#popup';

/**
 * Варианты значений типа окна.
 * @typedef TPopupType
 * @variant largeCard Объект с большим набором свойств.
 * @variant smallCard Объект с малым набором свойств.
 * @variant primitiveCard Примитивный объект.
 * @variant largeDictionary Большой справочник.
 * @variant smallDictionary Небольшой справочник.
 * @variant list Простой список.
 * @variant complexAction Сложная настройка действия.
 * @variant simpleAction Простая настройка действия.
 * @variant confirmation Окно подтверждения.
 * @variant info Подсказка.
 * @variant notification Уведомление.
 * @variant previewer Превьювер.
 * @variant custom Кастомная конфигурация окна.
 */
type TPopupType =
    | 'largeCard'
    | 'smallCard'
    | 'primitiveCard'
    | 'largeDictionary'
    | 'smallDictionary'
    | 'list'
    | 'complexAction'
    | 'simpleAction'
    | 'confirmation'
    | 'info'
    | 'notification'
    | 'custom';

const POPUP_TYPES: {
    [type: string]: {
        opener: any;
        adaptiveViewMode: string | boolean;
        popupComponentName: string;
    };
} = {
    largeCard: {
        opener: StackOpener,
        adaptiveViewMode: 'fullscreen',
        popupComponentName: 'Controls/popupTemplate:Stack',
    },
    smallCard: {
        opener: DialogOpener,
        adaptiveViewMode: 'sliding',
        popupComponentName: 'Controls/popupTemplate:Dialog',
    },
    primitiveCard: {
        opener: DialogOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupTemplate:Dialog',
    },
    largeDictionary: {
        opener: StackOpener,
        adaptiveViewMode: 'fullscreen',
        popupComponentName: 'Controls/popupTemplate:Stack',
    },
    smallDictionary: {
        opener: StickyOpener,
        adaptiveViewMode: 'sliding',
        popupComponentName: 'Controls/popupTemplate:Sticky',
    },
    list: {
        opener: StickyOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupTemplate:Sticky',
    },
    complexAction: {
        opener: StackOpener,
        adaptiveViewMode: 'sliding',
        popupComponentName: 'Controls/popupTemplate:Stack',
    },
    simpleAction: {
        opener: DialogOpener,
        adaptiveViewMode: 'sliding',
        popupComponentName: 'Controls/popupTemplate:Dialog',
    },
    confirmation: {
        opener: ConfirmationOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupConfirmation:Template',
    },
    info: {
        opener: InfoboxOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupTemplate:InfoBox',
    },
    notification: {
        opener: NotificationOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupTemplate:Notification',
    },
    previewer: {
        opener: PreviewerOpener,
        adaptiveViewMode: false,
        popupComponentName: 'Controls/popupTargets:PreviewerTemplate',
    },
};

/**
 * Контрол открывающий портал в зависимости от выбранного типа.
 * @class Controls/_popup/Opener
 * @implements Controls/popup:IDialogOpener
 * @implements Controls/popup:IStackOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IStickyOpener
 * @implements Controls/popup:IBasePopupOptions
 * @implements Controls/popup:IAdaptivePopup
 * @implements Controls/popup:IConfirmationOptions
 * @implements Controls/popup:INotificationOpener
 *
 * @remark
 * {@link https://ru.react.js.org/docs/portals.html Подробнее про порталы}.
 * @example
 * Пример описания опенера:
 *  <pre>
 *      const openPopup = () => {
 *          popupRef.current.open({
 *              templateOptions: {
 *                  text: 'Текст'
 *              }
 *          });
 *      }
 *      ...
 *      <Opener
 *          popupType="complexAction"
 *          ref={popupRef}
 *          contentComponent='PopupTemplates/DemoTemplate'/>
 *      <Button onClick={openPopup} caption="Открыть окно"/>
 *  </pre>
 *
 * Пример описания шаблона:
 *  <pre>
 *      import { getPopupComponent } from 'Controls/popup';
 *
 *      function Example(props) {
 * 	        const Component = getPopupComponent(props.popupComponentName);
 * 	        return (
 * 		        <Component
 * 			        headerContentTemplate={<div>Контент в шапке окон</div>}
 * 			        bodyContentTemplate={<div>Контент в теле окна<div>}
 * 			        allowAdaptive={props.allowAdaptive}/>
 * 	        )
 *      }
 *  </pre>
 * @public
 */

export default class Opener extends Component<IPortalOpener> {
    private _opener: BaseOpener<IPortalOpener>;

    private _targetRef: RefObject<HTMLDivElement> = createRef();

    private _popupType: TPopupType;
    private _destroyed: boolean = false;
    context: React.ContextType<typeof FreezeContext> | null;

    state: {
        popupItem: IPopupItem;
        className: string;
    };

    constructor(props: IPortalOpener) {
        super(props);
        if (props.template || props.templateOptions) {
            Logger.warn(
                'Controls/popup:Opener',
                'Используются устаревшие опции template или templateOptions.' +
                    'Воспользуйтесь значениями contentComponent и contentProps.'
            );
        }
    }

    componentDidUpdate(_prevProps: IPortalOpener, _prevState: any, prevContext: IFreezeContext) {
        if (prevContext !== this.context) {
            this._onFreezeContextChange(this.context?.isFreeze);
        }
    }

    componentWillUnmount() {
        this._opener?.destroy();
        this.setState({
            popupItem: null,
        });
        this._destroyed = true;
    }

    private _initOpener(popupType: TPopupType): void {
        if (this._popupType !== popupType) {
            this._opener = new (this._getPopupType(popupType).opener)();
            this._popupType = popupType;
        }
    }

    open(props: IPortalOpener = {}): Promise<string> {
        this._initOpener(props.popupType || this.props.popupType);
        return this._opener
            .open({
                ...this.props,
                ...props,
                template:
                    { template: this.props.children, ...this.props, ...props }.contentComponent ||
                    { template: this.props.children, ...this.props, ...props }.template,
                target:
                    { ...this.props, ...props }.target ||
                    (this._opener._type === 'sticky' && this._targetRef.current),
                opener: { ...this.props, ...props }.opener || this._targetRef.current,
                adaptiveOptions: {
                    ...this.props.adaptiveOptions,
                    ...props?.adaptiveOptions,
                    viewMode: this._getPopupType(props.popupType).adaptiveViewMode,
                },
                templateOptions: this._getContentProps(
                    props.contentProps || props.templateOptions,
                    props.popupType
                ),
                allowAdaptive: !!this._getPopupType(props.popupType).adaptiveViewMode,
                updateCallback: this._update.bind(this),
                removeCallback: this._remove.bind(this),
                updateClassNameCallback: this._updateClassNameCallback.bind(this),
                isPortal: true,
            })
            .then((popupId: string) => {
                const setPopupItem = () => {
                    const popupItem = Controller.getController().find(popupId);
                    this.setState({
                        popupItem,
                        className: '',
                    });
                    return popupId;
                };
                if (Controller.getController()) {
                    return setPopupItem();
                }
                // На случай, если контроллер еще не ициализирован
                return this._loadController().then(() => {
                    return setPopupItem();
                });
            });
    }

    close(...args: unknown): void {
        this._opener?.close(...args);
    }

    isOpened(): boolean {
        return !!this.state?.popupItem;
    }

    getPopupItem(): unknown {
        return this.state?.popupItem;
    }

    private _update(popupItem: IPopupItem): void {
        if (this._destroyed) {
            // Превьювер не удалится из дочерних связей, пока не пройдет анимация.
            // Если опенер уничтожится, анимации не будет.
            // Завершим промис, который ждет конца анимации.
            if (this.props.popupType === 'previewer') {
                popupItem._destroyDeferred?.callback?.();
            }
            return;
        }
        this.setState({
            popupItem,
        });
    }

    private _updateClassNameCallback(className: string): void {
        // TODO https://online.sbis.ru/opendoc.html?guid=2ea7fc2d-e4a4-486c-b514-ba04d911eb03&client=3
        if (this.state?.popupItem && this.state?.className !== className) {
            this.setState({
                className,
            });
        }
    }

    private _remove(): void {
        if (this._destroyed) {
            return;
        }
        this.setState({
            popupItem: null,
        });
    }

    private _loadController(): Promise<void> {
        return import('Controls/popupTemplateStrategy').then(({ Controller }) => {
            if (!GlobalController.getController()) {
                new Controller().init();
            }
        });
    }

    private _getContentProps(contentProps?: object, popupType?: TPopupType) {
        if (!contentProps && this.state?.popupItem?.popupOptions.templateOptions) {
            return this.state?.popupItem?.popupOptions.templateOptions;
        }
        return {
            ...this.state?.popupItem?.popupOptions.templateOptions,
            ...contentProps,
            ...(this.props.contentProps || this.props.templateOptions),
            popupComponentName: this._getComponentName(popupType || this._popupType),
            allowAdaptive: !!this._getPopupType(popupType || this._popupType).adaptiveViewMode,
        };
    }

    private _getComponentName(popupType: TPopupType): string {
        const popupTypeObject = this._getPopupType(popupType);
        if (getAdaptiveModeForLoaders().device.isPhone() && popupTypeObject.adaptiveViewMode) {
            if (popupTypeObject.adaptiveViewMode === 'sliding') {
                return 'Controls/popupTemplate:Dialog';
            }
            return 'Controls/popupTemplate:Stack';
        }
        return popupTypeObject.popupComponentName;
    }

    private _getPopupType(popupType: TPopupType): string {
        return (
            this.props.customPopupType ||
            POPUP_TYPES[popupType] ||
            POPUP_TYPES[this.props.popupType]
        );
    }

    private _getPortal(): JSX.Element | null {
        if (this.state?.popupItem) {
            return createPortal(
                <Async
                    {...getEventList()}
                    className={this.state.className}
                    templateOptions={{
                        ...this.state.popupItem.popupOptions,
                        id: this.state.popupItem.id,
                        item: this.state.popupItem,
                        position: this.state.popupItem.position,
                        templateOptions: this._getContentProps(),
                        template: this.state.popupItem.popupOptions.template,
                        name: this.state.popupItem.id,
                    }}
                    templateName={'Controls/popupTemplateStrategy:Popup'}
                />,
                document.querySelector(POPUP_CONTAINER_NODE)
            );
        }
        return null;
    }

    private _onFreezeContextChange(isFreeze: boolean | undefined) {
        if (isFreeze) {
            this._opener?.close();
        }
    }

    render() {
        return <>{this._getPortal()}</>;
    }

    static contextType = FreezeContext;

    static defaultProps = {
        popupType: 'largeCard',
    };
}

/**
 * @name Controls/_popup/Opener#popupType
 * @cfg {TPopupType} Логический тип окна
 * @demo Controls-demo/Popup/Opener/Portal/PopupType/Index
 */

/**
 * @name Controls/_popup/Opener#customPopupType
 * @cfg {ICustomPopupType} Кастомная конфигурация окна
 */

/**
 * @name Controls/_popup/Opener#contentComponent
 * @cfg {String|Function} Компонент внутри попапа.
 */

/**
 * @name Controls/_popup/Opener#contentProps
 * @cfg {Object} Опции компонента, который передали в {@link component}
 */
