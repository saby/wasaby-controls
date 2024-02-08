import { Component, createRef, RefObject } from 'react';
import { createPortal } from 'react-dom';
import StackOpener from './Openers/Stack';
import DialogOpener from './Openers/Dialog';
import StickyOpener from './Openers/Sticky';
import InfoboxOpener from './Openers/Infobox';
import NotificationOpener from './Openers/Notification';
import ConfirmationOpener from './Openers/Confirmation';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import { IPopupItem } from 'Controls/_popup/interface/IPopup';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import Controller from './Popup/GlobalController';
import Async from 'Controls/Container/Async';

interface IPortalOpener extends IBasePopupOptions {
    isPortal: boolean;
    popupType: TPopupType;
}

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
 * @variant info Подсказка.
 * @variant notification Уведомление.
 * @variant custom Кастомный шаблон окна.
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
    | 'info'
    | 'notification'
    | 'custom';

const POPUP_TYPES: {
    [type: string]: {
        opener: any;
        adaptiveViewMode: string | boolean;
        popupTemplateName: string;
    };
} = {
    largeCard: {
        opener: StackOpener,
        adaptiveViewMode: 'fullscreen',
        popupTemplateName: 'Controls/popupTemplate:Stack',
    },
    smallCard: {
        opener: DialogOpener,
        adaptiveViewMode: 'sliding',
        popupTemplateName: 'Controls/popupTemplate:Dialog',
    },
    primitiveCard: {
        opener: DialogOpener,
        adaptiveViewMode: false,
        popupTemplateName: 'Controls/popupTemplate:Dialog',
    },
    largeDictionary: {
        opener: StackOpener,
        adaptiveViewMode: 'fullscreen',
        popupTemplateName: 'Controls/popupTemplate:Stack',
    },
    smallDictionary: {
        opener: StickyOpener,
        adaptiveViewMode: 'sliding',
        popupTemplateName: 'Controls/popupTemplate:Sticky',
    },
    list: {
        opener: StickyOpener,
        adaptiveViewMode: false,
        popupTemplateName: 'Controls/popupTemplate:Sticky',
    },
    complexAction: {
        opener: StackOpener,
        adaptiveViewMode: 'sliding',
        popupTemplateName: 'Controls/popupTemplate:Stack',
    },
    simpleAction: {
        opener: DialogOpener,
        adaptiveViewMode: 'sliding',
        popupTemplateName: 'Controls/popupTemplate:Stack',
    },
    confirmation: {
        opener: ConfirmationOpener,
        adaptiveViewMode: false,
        popupTemplateName: 'Controls/popupConfirmation:Template',
    },
    info: {
        opener: InfoboxOpener,
        adaptiveViewMode: false,
        popupTemplateName: 'Controls/popupTemplate:InfoBox',
    },
    notification: {
        opener: NotificationOpener,
        adaptiveViewMode: false,
        popupTemplateName: 'Controls/popupTemplate:Notification',
    },
};

/**
 * Контрол открывающий окна в зависимости от выбранного типа.
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
 * Помимо типажей, умеет открывать окно с помощью поратла. {@link https://ru.react.js.org/docs/portals.html Подробнее про порталы}.
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
 *          isPortal={true}
 *          popupType="complexAction"
 *          ref={popupRef}
 *          template='PopupTemplates/DemoTemplate'/>
 *      <Button onClick={openPopup} caption="Открыть окно"/>
 *  </pre>
 *
 * Пример описания шаблона:
 *  <pre>
 *      <Async templateName={props.popupTemplateName}
 *             templateOptions={{
 *                 allowAdaptive: props.allowAdaptive,
 *                 bodyContentTemplate: <div>{props.text}</div>
 *             }}
 *             onClose={props.onClose}
 *             customEvents={['onClose]}/>
 *  </pre>
 * @public
 */

export default class Opener extends Component<IPortalOpener> {
    private _opener;

    private _targetRef: RefObject<HTMLDivElement> = createRef();

    state: {
        popupItem: IPopupItem;
    };

    constructor(props: IPortalOpener) {
        super(props);
        this._initOpener(props.popupType);
    }

    componentDidUpdate(prevProps: Readonly<IPortalOpener>) {
        if (prevProps.popupType !== this.props.popupType) {
            this._initOpener(this.props.popupType);
        }
    }

    private _initOpener(popupType: TPopupType): void {
        this._opener = new POPUP_TYPES[popupType].opener();
    }

    open(props: IPortalOpener): void {
        this._opener
            .open({
                ...this.props,
                ...props,
                template: { template: this.props.children, ...this.props, ...props }.template,
                target: this._opener._type === 'sticky' && this._targetRef.current,
                opener: this._targetRef.current,
                adaptiveOptions: {
                    ...this.props.adaptiveOptions,
                    ...props?.adaptiveOptions,
                    viewMode: POPUP_TYPES[this.props.popupType].adaptiveViewMode,
                },
                templateOptions: this._getTemplateOptions(props.templateOptions),
                allowAdaptive: !!POPUP_TYPES[this.props.popupType].adaptiveViewMode,
                updateCallback: this._update.bind(this),
                removeCallback: this._remove.bind(this),
            })
            .then((popupId: string) => {
                if (this.props.isPortal) {
                    const popupItem = Controller.getController().find(popupId);
                    this.setState({
                        popupItem,
                    });
                }
            });
    }

    close(): void {
        this._opener.close();
        this.setState({
            popupItem: null,
        });
    }

    private _update(popupItem: IPopupItem): void {
        if (this.props.isPortal) {
            this.setState({
                popupItem,
            });
        }
    }

    private _remove(): void {
        if (this.props.isPortal) {
            this.setState({
                popupItem: null,
            });
        }
    }

    private _getTemplateOptions(templateOptions: object) {
        return {
            ...templateOptions,
            ...this.props.templateOptions,
            popupTemplateName: this._getTemplateName(),
            allowAdaptive: !!POPUP_TYPES[this.props.popupType].adaptiveViewMode,
        };
    }

    private _getTemplateName(): string {
        const popupType = POPUP_TYPES[this.props.popupType];
        if (unsafe_getRootAdaptiveMode().device.isPhone() && popupType.adaptiveViewMode) {
            if (popupType.adaptiveViewMode === 'sliding') {
                return 'Controls/popupTemplate:Dialog';
            }
            return 'Controls/popupTemplate:Stack';
        }
        return popupType.popupTemplateName;
    }

    render() {
        return (
            <div ref={this._targetRef}>
                {this.state?.popupItem
                    ? createPortal(
                          <Async
                              templateOptions={{
                                  ...this.state.popupItem.popupOptions,
                                  id: this.state.popupItem.id,
                                  item: this.state.popupItem,
                                  position: this.state.popupItem.position,
                                  templateOptions: this._getTemplateOptions(),
                                  template: this.props.template,
                                  name: this.state.popupItem.id,
                              }}
                              templateName={'Controls/popupTemplateStrategy:Popup'}
                          />,
                          document.querySelector(POPUP_CONTAINER_NODE)
                      )
                    : null}
            </div>
        );
    }

    static defaultProps = {
        popupType: 'largeCard',
        isPortal: false,
    };
}

/**
 * @name Controls/popup:Opener#isPortal
 * @cfg {Boolean} Определяет, будет ли окно открыто как портал.
 * @remark
 * Главное отличие от обычных окон, это то, что порталы находятся в дереве компонентов там же, где и опенер.
 * Поэтому, у окна будет тот же контекст, что и у опенера. {@link https://ru.react.js.org/docs/portals.html Подробнее про порталы}
 * @demo Controls-demo/Popup/Opener/IsPortal/Index
 */

/**
 * @name Controls/popup:Opener#popupType
 * @cfg {TPopupType} Логический тип окна
 * @demo Controls-demo/Popup/Opener/PopupType/Index
 */
