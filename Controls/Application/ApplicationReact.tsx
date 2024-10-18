import { Component, cloneElement, createRef, RefObject } from 'react';
import { IApplicationProps } from './Interfaces';
import withScrollContextProvider from './withScrollContextProvider';
import withPendingContextProvider from './withPendingContextProvider';
import withLoadingContextProvider from './withLoadingContextProvider';
import withPopupManagerActions from './withPopupManagerActions';
import withRegisters from './withRegisters';
import withWhiteSpaceOnRotationHack from './withWhiteSpaceOnRotationHack';
import withBodyClasses from './withBodyClasses';
import { mergeHandlers, mergeRefs } from './Utils';
import { SyntheticEvent } from 'UI/Events';
import { Logger } from 'UI/Utils';
import { getConfig } from 'Application/Env';
import { constants, detection, IoC } from 'Env/Env';
import { dispatcherHandler } from 'UI/HotKeys';
import { EventSubscriber } from 'UI/Events';
import { Container as PopupContainer } from 'Controls/popup';
import { setController as setSettingsController } from 'Controls/Application/SettingsController';
import { Head as HeadAPI } from 'Application/Page';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import { isReactElement } from 'UICore/Executor';

// Нужно чтобы oldCss прилетал первым на страницу. Есть контролы (например itemsActions), стили которыйх
// Завязаны на порядок css.
import 'css!Controls/Application/oldCss';
import 'css!Controls/application';
import 'css!Controls/dragnDrop';
import 'css!Controls/CommonClasses';

/**
 * Корневой контрол для Wasaby-приложений. Служит для создания базовых html-страниц.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/sbis-env-ui/ здесь}.
 *
 * @class Controls/Application
 * @implements Controls/Application:IApplicationProps
 * @public
 */
class ApplicationReact extends Component<IApplicationProps> {
    private bodyRef: RefObject<any>;
    constructor(props: IApplicationProps) {
        super(props);

        this._checkCompat(props);

        // Чтобы при загрузке слоя совместимости, понять нужно ли грузить провайдеры(extensions, userInfo, rights),
        // положим опцию из Application в constants. Иначе придется использовать глобальную переменную.
        // TODO: Удалить этот код отсюда по задае:
        // https://online.sbis.ru/opendoc.html?guid=3ed5ebc1-0b55-41d5-a8fa-921ad24aeec3
        // @ts-ignore
        constants.loadDataProviders = props.loadDataProviders;

        setSettingsController(props.settingsController);

        this.getCustomHandler = this.getCustomHandler.bind(this);
        this.bodyRef = createRef();

        // так как файлы с описанием font-face довольно большие, разбил на два отдельных описания на базовое и MacOS
        // добавляем в head на СП, этого достаточно, дальше браузер скачает на клиенте и отрендерит всё правильно.
        if (constants.isServerSide && constants.browser.isMac) {
            HeadAPI.getInstance().createTag('link', {
                rel: 'stylesheet',
                type: 'text/css',
                href: getResourceUrl('/Controls-default-theme/fonts/TensorInterMac.css'),
            });
        }
    }
    checkErrors() {
        if (this.bodyRef.current?.parentElement.closest('.bodyContent')) {
            Logger.error(
                'Найдена дублирующая вставка контрола Controls/Application в приложении! ' +
                    'Это приводит к увеличению лишнего кода и различным ошибкам, например в двойном срабатывании событий',
                this
            );
        }
    }
    componentDidMount() {
        this.checkErrors();
    }
    componentDidUpdate() {
        this.checkErrors();
    }

    componentWillUnmount(): void {
        /* eslint-disable */
        const elements = document.getElementsByClassName('head-title-tag');
        /* eslint-enable */
        if (elements.length === 1) {
            // Chrome на ios при вызове History.replaceState, устанавливает в title текущий http адрес.
            // Если после загрузки установить title, который уже был, то он не обновится, и в заголовке вкладки
            // останется http адрес. Поэтому сначала сбросим title, а затем положим туда нужное значение.
            if (detection.isMobileIOS && detection.chrome) {
                elements[0].textContent = '';
            }
            elements[0].textContent = this.props.title || null;
        }
    }

    private getCustomHandler(handlerName: string) {
        return this.props[handlerName];
    }

    protected _keyDownHandler(event: KeyboardEvent): void {
        // todo ISyntheticEvent надо удалить из hotkeys что-то там не состыкуется
        // @ts-ignore
        dispatcherHandler(new SyntheticEvent<KeyboardEvent>(event));
    }
    private _checkCompat(opts: IApplicationProps): void {
        if (opts.compat) {
            IoC.resolve('ILogger').warn(
                'Опция compat является устаревшей. Для вставки старых контролов внутри VDOM-ного окружения ' +
                    'используйте один из способов, описанных в этой статье: https://wi.sbis.ru/doc/platform/developmentapl/ws3/compound-wasaby/'
            );
        }
    }

    render() {
        const propsChildren = this.props.children || this.props.content;
        // todo надо как-то прокинуть класс, там z-index: 1; и position: relative; точно должны мы вешать?
        // todo без this.props.children все падает потому что нет children, например тут
        //  http://psdr-prognix31.corp.tensor.ru:30010/page/demo-card-font?fontweight=400&fontsize=xl
        const childrenClassName = propsChildren?.props.className ?? '';
        const children = propsChildren
            ? isReactElement(propsChildren)
                ? cloneElement(propsChildren, {
                      className: 'bodyContent__zIndex-context ' + childrenClassName,
                  })
                : cloneElement(propsChildren, {
                      className: 'bodyContent__zIndex-context ' + childrenClassName,
                      RUMEnabled: getConfig('RUMEnabled') || false,
                      pageName: this.props.pageName || '',
                      resourceRoot: this.props.resourceRoot || constants.resourceRoot,
                  })
            : null;

        return (
            <EventSubscriber
                onSuggestStateChanged={this.getCustomHandler('suggestStateChanged')}
                on_updateDraggingTemplate={this.getCustomHandler('_updateDraggingTemplate')}
                on_removeDraggingTemplate={this.getCustomHandler('_removeDraggingTemplate')}
                on_documentDragStart={this.getCustomHandler('_documentDragStart')}
                on_documentDragEnd={this.getCustomHandler('_documentDragEnd')}
                onRegister={this.getCustomHandler('register')}
                onUnregister={this.getCustomHandler('unregister')}
                onShowIndicator={this.getCustomHandler('showIndicator')}
                onHideIndicator={this.getCustomHandler('hideIndicator')}
                onRegisterPending={this.getCustomHandler('registerPending')}
                onFinishPendingOperations={this.getCustomHandler('finishPendingOperations')}
                onCancelFinishingPending={this.getCustomHandler('cancelFinishingPending')}
                onOpenInfoBox={this.getCustomHandler('openInfoBox')}
                onServiceError={this.getCustomHandler('serviceError')}
                onCloseInfoBox={this.getCustomHandler('closeInfoBox')}
                onForceCloseInfoBox={this.getCustomHandler('forceCloseInfoBox')}
                onOpenPreviewer={this.getCustomHandler('openPreviewer')}
                onCancelPreviewer={this.getCustomHandler('cancelPreviewer')}
                onIsPreviewerOpened={this.getCustomHandler('isPreviewerOpened')}
                onClosePreviewer={this.getCustomHandler('closePreviewer')}
                onPageScrolled={this.getCustomHandler('pageScrolled')}
                onWorkspaceResize={this.getCustomHandler('workspaceResize')}
                onResize={this.getCustomHandler('resize')}
                ref={mergeRefs([this.props.forwardedRef, this.bodyRef])}
            >
                <div
                    className={'bodyContent ' + (this.props.className ?? '')}
                    style={this.props.style}
                    onKeyDown={mergeHandlers(this._keyDownHandler.bind(this), this.props.onKeyDown)}
                    onKeyPress={this.props.onKeyPress}
                    onScroll={this.props.onScroll}
                    onMouseDown={this.props.onMouseDown}
                    onMouseMove={this.props.onMouseMove}
                    onMouseUp={this.props.onMouseUp}
                    onMouseLeave={this.props.onMouseLeave}
                    onTouchStart={this.props.onTouchStart}
                    onTouchMove={this.props.onTouchMove}
                    onTouchEnd={this.props.onTouchEnd}
                >
                    {/* In case of using application in html.tmpl there will not be content option */}
                    {!this.props.builder ? (
                        <>
                            <PopupContainer />
                            {children}
                            {this.props.loadingIndicator()}
                        </>
                    ) : null}
                </div>
            </EventSubscriber>
        );
    }

    static defaultProps: Partial<IApplicationProps> = {
        title: '',
        pagingVisible: false,
    };
}

const withBodyClassesClass = withBodyClasses(ApplicationReact);
const withPopupManagerActionsClass = withPopupManagerActions(withBodyClassesClass);
const withRegistersClass = withRegisters(withPopupManagerActionsClass);
const withWhiteSpaceOnRotationHackClass = withWhiteSpaceOnRotationHack(withRegistersClass);
const withLoadingContextProviderClass = withLoadingContextProvider(
    withWhiteSpaceOnRotationHackClass
);
const withPendingContextProviderClass = withPendingContextProvider(withLoadingContextProviderClass);
const withScrollContextProviderClass = withScrollContextProvider(withPendingContextProviderClass);
const Application = withScrollContextProviderClass;
export { Application };
