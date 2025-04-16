/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import {
    ReactElement,
    useMemo,
    useCallback,
    useRef,
    MutableRefObject,
    useContext,
    useEffect,
    useImperativeHandle,
    ForwardedRef,
    cloneElement,
    forwardRef,
} from 'react';
import { isReactElement } from 'UICore/Executor';
import { clsx } from 'clsx';
import { lazy, importer } from 'UI/Async';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';
import {
    IAdaptivePopupOptions,
    Controller,
    getAdaptiveDesktopMode,
    Context,
    IContext,
} from 'Controls/popup';
import { constants } from 'Env/Env';
import RightPanel from 'Controls/_popupTemplate/Stack/Template/RightPanel';
import Header from 'Controls/_popupTemplate/Stack/Template/Header';
import BaseStack from 'Controls/_popupTemplate/Stack/Template/BaseStack';
import { IControlOptions } from 'UICommon/_base/Control';
import { IPopupTemplateOptions } from 'Controls/_popupTemplate/interface/IPopupTemplate';
import { IBaseStackTemplateOptions } from 'Controls/_popupTemplate/Stack/Template/BaseStack';
import * as rk from 'i18n!Controls';

/**
 * @typedef {Object} Controls/_popupTemplate/Stack/RightPanelOptions
 * @property {Array.<Hint/interface:IHelpButtonConfig>} helpButtonConfig Конфигурация кнопки помощи.
 * @property {String} entityId Идентификатор stack-панели или вкладки в stack-панели, имеет вид "entity-<идентификатор>". Подробнее читайте {@link /doc/platform/developmentapl/interface-development/saby-design/help-system/routes/#2-stack-stack- здесь}.
 * @property {String} title Заголовок stack-панели или вкладки в stack-панели. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/saby-design/help-system/routes/#2-stack-stack- здесь}.
 *
 */
export interface IRightPanelOptions {
    helpButtonConfig: object[];
    entityId?: string;
    title?: string;
}

export interface IStackTemplateOptions
    extends IControlOptions,
        IPopupTemplateOptions,
        IBaseStackTemplateOptions,
        IAdaptivePopupOptions {
    headerBackgroundStyle?: string;
    footerBackgroundStyle?: string;
    backgroundStyle?: string;
    maximizeButtonVisibility?: boolean;
    workspaceWidth?: number;
    headerBorderVisible?: boolean;
    rightBorderVisible?: boolean;
    maximized?: boolean;
    maxWidth?: number;
    minWidth?: number;
    stackMinimizedWidth?: number;
    width?: number;
    rightPanelOptions?: IRightPanelOptions;
    closeButtonVisibility?: boolean;
    // Опция проксируется только из StackPageWrapper
    isTablet?: boolean;
    isWorkspacePopup?: boolean;
}

const MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON = 100;

const CloseButton = lazy(() => importer('Controls/extButtons:CloseButton'));

function StackTemplate(
    props: IStackTemplateOptions,
    forwardedRef: ForwardedRef<HTMLElement>
): ReactElement {
    const propsWithDefaultProps = {
        headingFontSize: '4xl',
        backgroundStyle: 'default',
        headingFontColorStyle: 'default',
        closeButtonVisible: true,
        closeButtonViewMode: 'functionalButton',
        headerBorderVisible: true,
        ...props,
        rightBorderVisible: props.rightBorderVisible ?? true,
    };

    const clearProps = { ...propsWithDefaultProps };
    delete clearProps.attrs;
    delete clearProps.className;
    delete clearProps.style;
    delete clearProps['data-qa'];
    delete clearProps.$wasabyRef;
    delete clearProps.forwardedRef;
    const containerRef: MutableRefObject<HTMLDivElement | undefined> = useRef();
    const popupContext: IContext = useContext(Context);

    useMemo(() => {
        if (!constants.isServerSide) {
            Controller.getController()
                ?.find(props.popupId)
                ?.controller.updateElementsVisibility?.();
        }
    }, []);

    useImperativeHandle(
        forwardedRef,
        () => {
            return {
                close,
                toggleMaximizeState,
            };
        },
        []
    );

    useEffect(() => {
        // Имитируем работу afterUpdate
        if (containerRef.current) {
            const item = Controller.getController()?.find(props.popupId);
            if (item) {
                const result = item.controller.onTemplateUpdated?.(item, containerRef.current);
                if (result) {
                    Controller.getController()?.update(item.id, item.popupOptions);
                }
            }
        }
    }, [props]);

    const accordionTemplate = useMemo(() => {
        if (props.isCompoundTemplate || props.isPopup) {
            return;
        }
        return Controller.getAccordionTemplate();
    }, []);

    const hasRightPanel = useMemo(() => {
        return Controller.hasRightPanel() || !!props.toolbarContentTemplate;
    }, []);

    const rightBottomTemplate = useMemo((): string => {
        return Controller.getRightPanelBottomTemplate();
    }, []);

    const isAdaptive = useMemo((): boolean => {
        return getAdaptiveModeForLoaders()?.device.isPhone();
    }, []);

    const adaptiveWidth = useMemo((): number => {
        if (!isAdaptive) {
            return;
        }
        // На случай если не задали ширины, возьмем среднюю ширину попапов на сайте.
        const standardWidth = 700;
        return props.width || props.minWidth || props.maxWidth || standardWidth;
    }, []);

    const allowAdaptive = useMemo((): boolean => {
        return (
            (props.isAdaptive || props.allowAdaptive) && isAdaptive && Controller.getIsAdaptive()
        );
    }, []);

    const slidingPanelProps = useMemo((): {
        height: string;
        position: string;
        desktopMode: string;
    } => {
        const props = {
            height: '100%',
            position: 'bottom',
            desktopMode: 'stack',
        };
        if (props.adaptiveOptions?.viewMode) {
            props.desktopMode = getAdaptiveDesktopMode(props.adaptiveOptions?.viewMode, 'stack');
        }
        return props;
    }, []);

    const backgroundStyleClassName = useMemo((): string => {
        return propsWithDefaultProps.backgroundStyle === 'default'
            ? 'controls-StackTemplate_backgroundColor'
            : 'controls-background-' + propsWithDefaultProps.backgroundStyle;
    }, [props.backgroundStyle]);

    const footerBackgroundClassName = useMemo((): string => {
        return propsWithDefaultProps.backgroundStyle === 'default'
            ? 'controls-StackTemplate__bottomArea-backgroundColor'
            : 'controls-background-' + propsWithDefaultProps.backgroundStyle;
    }, [props.backgroundStyle]);

    // Для пользователей делается механизм подсказок, который должен быть привязан к определенному шаблону на
    // сайте. На уровне StackTemplate мы не знаем в каком шаблоне находимся и не можем передать это в контроллер
    // подсказок. Передадим метод, который по DOM определит имя шаблона. Другого способа узнать имя шаблона окна пока
    // нет, оставим поддержку полукостыля на нашем уровне.
    const getTemplateName = useCallback((): string | null => {
        const popupContainer = containerRef.current?.closest('.controls-Popup');
        return popupContainer ? popupContainer.getAttribute('templateName') : '';
    }, []);

    const closeButtonVisible = useMemo((): boolean => {
        return !!accordionTemplate || (props.closeButtonVisible ?? true);
    }, []);

    const maximizeButtonTitle = useMemo((): string => {
        return `${rk('Свернуть', 'окно')}/${rk('Развернуть', 'окно')}`;
    }, []);

    const maximizeButtonVisible = useMemo((): boolean => {
        if (props.maxWidth - props.minWidth < MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON || isAdaptive) {
            return false;
        }
        return !!props.maximizeButtonVisibility && !props.isTablet;
    }, [props.maxWidth, props.minWidth]);

    const toggleMaximizeState = useCallback((maximized?: boolean): void => {
        popupContext.maximized(maximized);
    }, []);

    const close = useCallback(() => {
        popupContext.close();
    }, []);

    const stackOptions = useMemo(() => {
        const headerProps = { ...propsWithDefaultProps };
        delete headerProps.attrs;
        delete headerProps.className;
        delete headerProps.style;
        return headerProps;
    }, [props]);

    const RightBottomComponent = useMemo(() => {
        return lazy(() => importer(rightBottomTemplate));
    }, []);

    const PopupSlidingComponent = useMemo(() => {
        return lazy(() => importer('Controls/popupSliding:Template'));
    }, []);

    const AccordionComponent = useMemo(() => {
        return lazy(() => importer(accordionTemplate));
    }, []);

    const bodyContentComponent = useMemo(() => {
        if (!props.bodyContentTemplate) {
            return null;
        }
        if (!props.bodyContentTemplate.props) {
            return (
                <props.bodyContentTemplate
                    {...clearProps}
                    onClose={props.onClose}
                    hasRightTemplate={hasRightPanel}
                    // Опция с тем же названием есть на выпадающем списке.
                    // Чтобы опция не пролетала до выпадающего списка, который лежит в стеке
                    bodyContentTemplate={null}
                    headerContentTemplate={null}
                    footerContentTemplate={null}
                />
            );
        }
        const contentProps = isReactElement(props.bodyContentTemplate)
            ? {}
            : {
                  ...clearProps,
                  onClose: props.onClose,
                  hasRightTemplate: hasRightPanel,
                  // Опция с тем же названием есть на выпадающем списке.
                  // Чтобы опция не пролетала до выпадающего списка, который лежит в стеке
                  bodyContentTemplate: null,
                  headerContentTemplate: null,
                  footerContentTemplate: null,
              };
        return cloneElement(props.bodyContentTemplate, contentProps);
    }, [props]);

    const footerContentTemplate = useMemo(() => {
        if (!props.footerContentTemplate) {
            return null;
        }
        if (!props.footerContentTemplate.props) {
            return (
                <props.footerContentTemplate
                    {...clearProps}
                    hasRightTemplate={hasRightPanel}
                    // Опция с тем же названием есть на выпадающем списке.
                    // Чтобы опция не пролетала до выпадающего списка, который лежит в стеке
                    bodyContentTemplate={null}
                    headerContentTemplate={null}
                    footerContentTemplate={null}
                />
            );
        }
        const contentProps = isReactElement(props.footerContentTemplate)
            ? {}
            : {
                  ...clearProps,
                  onClose: undefined,
                  hasRightTemplate: hasRightPanel,
                  // Опция с тем же названием есть на выпадающем списке.
                  // Чтобы опция не пролетала до выпадающего списка, который лежит в стеке
                  bodyContentTemplate: null,
                  headerContentTemplate: null,
                  footerContentTemplate: null,
              };
        return cloneElement(props.footerContentTemplate, contentProps);
    }, [props]);

    const leftContentTemplate = useMemo(() => {
        if (!props.leftContentTemplate) {
            return null;
        }
        if (!props.leftContentTemplate.props) {
            return (
                <props.leftContentTemplate
                    {...clearProps}
                    bodyContentTemplate={null}
                    headerContentTemplate={null}
                    footerContentTemplate={null}
                />
            );
        }
        const contentProps = isReactElement(props.leftContentTemplate)
            ? {}
            : {
                  ...clearProps,
                  onClose: undefined,
                  hasRightTemplate: hasRightPanel,
                  // Опция с тем же названием есть на выпадающем списке.
                  // Чтобы опция не пролетала до выпадающего списка, который лежит в стеке
                  bodyContentTemplate: null,
                  headerContentTemplate: null,
                  footerContentTemplate: null,
              };
        return cloneElement(props.leftContentTemplate, contentProps);
    }, [props]);

    const mainContent = useMemo((): ReactElement => {
        return (
            <>
                {props.leftContentTemplate || accordionTemplate ? (
                    <div className="controls-StackTemplate__leftArea">
                        <div className="controls-StackTemplate__leftArea-wrapper">
                            {accordionTemplate ? <AccordionComponent /> : null}
                            {props.leftContentTemplate ? leftContentTemplate : null}
                        </div>
                    </div>
                ) : null}
                <div
                    ref={containerRef}
                    className={`controls-StackTemplate-content_wrapper ${
                        props.isTablet ? 'controls-StackTemplate-content_wrapper_zIndex' : ''
                    } ${backgroundStyleClassName}`}
                    style={{ width: `${adaptiveWidth}px` }}
                >
                    {hasRightPanel ? (
                        <RightPanel
                            {...clearProps}
                            getTemplateName={getTemplateName}
                            rightBorderVisible={propsWithDefaultProps.rightBorderVisible}
                            closeButtonVisible={closeButtonVisible}
                            maximizeButtonVisibility={maximizeButtonVisible}
                            maximizeButtonTitle={maximizeButtonTitle}
                            maximizeButtonClickCallback={toggleMaximizeState}
                            bodyContentTemplate={null}
                            headerContentTemplate={null}
                            footerContentTemplate={null}
                        />
                    ) : null}
                    <div className="controls-StackTemplate-content">
                        <div className="controls-StackTemplate__header__fakeRightTemplate">
                            {rightBottomTemplate && !hasRightPanel ? (
                                <RightBottomComponent
                                    {...props.rightPanelOptions}
                                    isCompatiblePopup={props.isCompatiblePopup}
                                    getTemplateName={getTemplateName}
                                    stack={true}
                                />
                            ) : null}
                        </div>
                        {props.caption ||
                        props.headingCaption ||
                        props.topArea ||
                        props.headerContentTemplate ||
                        props.applyButtonVisible ? (
                            <Header
                                {...clearProps}
                                onClose={undefined}
                                stackOptions={stackOptions}
                                _maximizeButtonTitle={maximizeButtonTitle}
                                changeMaximizedState={toggleMaximizeState}
                                hasRightPanel={hasRightPanel}
                                _maximizeButtonVisibility={maximizeButtonVisible}
                            />
                        ) : !hasRightPanel ? (
                            <div className="controls-StackTemplate__command_buttons_without_head">
                                {maximizeButtonVisible ? (
                                    <div
                                        className="controls-StackTemplate__maximized_button tw-flex tw-items-center tw-justify-center controls-margin_right-m controls-icon_size-s controls-icon_style-secondary icon-CollapseExpand"
                                        data-qa="controls-StackTemplate__maximized_button"
                                        onClick={toggleMaximizeState}
                                        title={maximizeButtonTitle}
                                    ></div>
                                ) : null}
                                {props.closeButtonVisible ? (
                                    <CloseButton
                                        offset="offset"
                                        className="controls-StackTemplate__close_button"
                                        dataQa="controls-stack-Button__close"
                                        dataName="controls-stack-Button__close"
                                        viewMode={propsWithDefaultProps.closeButtonViewMode}
                                        onClick={close}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {props.bodyContentTemplate ? (
                            <div
                                className={`controls-StackTemplate__content-area ${backgroundStyleClassName}`}
                            >
                                {bodyContentComponent}
                            </div>
                        ) : null}
                        {props.footerContentTemplate ? (
                            <div
                                className={`controls-StackTemplate__bottomArea ${footerBackgroundClassName}`}
                            >
                                {footerContentTemplate}
                            </div>
                        ) : null}
                    </div>
                </div>
            </>
        );
    }, [maximizeButtonVisible, maximizeButtonTitle, props]);

    const baseStackClassName = useMemo((): string => {
        return clsx(`${props.className}`, {
            'controls-StackTemplate__with-right-panel': hasRightPanel,
        });
    }, [props.className]);

    if (allowAdaptive) {
        return (
            <PopupSlidingComponent
                slidingPanelOptions={slidingPanelProps}
                {...propsWithDefaultProps}
                className={baseStackClassName}
                ref={forwardedRef}
                closeButtonVisible={closeButtonVisible}
            />
        );
    }
    return (
        <BaseStack {...propsWithDefaultProps} ref={forwardedRef} className={baseStackClassName}>
            {isAdaptive ? (
                <div className={`controls-StackTemplate__wrapper ${backgroundStyleClassName}`}>
                    {mainContent}
                </div>
            ) : (
                mainContent
            )}
        </BaseStack>
    );
}

/**
 * @name Controls/_popupTemplate/Stack#headerBackgroundStyle
 * @cfg {String} Определяет цвет фона шапки стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default unaccented
 * @demo Controls-demo/PopupTemplate/Stack/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#footerBackgroundStyle
 * @cfg {String} Определяет цвет фона подвала стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default default
 * @demo Controls-demo/PopupTemplate/Stack/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#backgroundStyle
 * @cfg {String} Определяет цвет фона стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default default
 * @demo Controls-demo/PopupTemplate/Stack/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */

/**
 * @name Controls/_popupTemplate/Stack#toolbarContentTemplate
 * @cfg {function|String} Шаблон контента под крестиком закрытия для размещения тулбара, расположенного в правой панели.
 */

/**
 * @name Controls/_popupTemplate/Stack#leftContentTemplate
 * @cfg {function|String} Шаблон контента слева границы стекового окна.
 */

/**
 * @name Controls/_popupTemplate/Stack#maximizeButtonVisibility
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка изменения размера.
 * @default false
 */

/**
 * @name Controls/_popupTemplate/Stack#headerBorderVisible
 * @cfg {Boolean} Определяет, будет ли отображаться граница шапки панели.
 * @default true
 * @remark
 * Позволяет скрыть отображение нижней границы {@link Controls/popupTemplate:IPopupTemplateBase#headerContentTemplate headerContentTemplate}. Используется для построения двухуровневых шапок.
 * Необходимо поместить свой контейнер с шапкой в {@link Controls/popupTemplate:IPopupTemplateBase#bodyContentTemplate bodyContentTemplate} и навесить:
 *
 * 1. класс, добавляющий фон для шапки:
 * <pre class="brush: css">
 * controls-StackTemplate__top-area_default
 * </pre>
 * 2. класс, добавляющий нижнюю границу для шапки:
 * <pre class="brush: css">
 * controls-StackTemplate__top-area-border
 * </pre>
 * @demo Controls-demo/PopupTemplate/Stack/HeaderBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#rightBorderVisible
 * @cfg {Boolean} Определяет, будет ли отображаться полоса разделяющая правую панель и контент.
 * @default true
 * @remark
 * Позволяет скрыть отображение правой границы.
 * @demo Controls-demo/PopupTemplate/Stack/RightBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#workspaceWidth
 * @cfg {Number} Текущая ширина шаблона стековой панели
 * @remark
 * Опция только для чтения, значение устанавливается контролом Controls/popup исходя из заданной конфигурации окна
 */

/**
 * @name Controls/_popupTemplate/Stack#rightPanelOptions
 * @cfg {Controls/_popupTemplate/Stack/RightPanelOptions.typedef} Опции для шаблона правой панели стекового окна.
 * @example
 * Работает только в том случае, если был указан rightPanelBottomTemplate, указать его можно следующим образом:
 * <pre>
 *   import {ManagerController} from 'Controls/popup';
 *   ...
 *   ManagerController.setRightPanelBottomTemplate('Ваш шаблон');
 * </pre>
 * @see Hint/interface:IHelpButtonItem
 */

/**
 * @name Controls/_popupTemplate/Stack#stackPosition
 * @cfg {string} Положение стекового окна
 * @variant left окно будет прижато к левому краю
 * @variant right окно будет прижато к правому краю страницы
 * @default right
 * @demo Controls-demo/Popup/Stack/StackPosition/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#toggleMaximizeState
 * @function
 * @description Переключает состояние разворота панели.
 * @param {Boolean} maximize Определяет новое состояние разворота панели. Если аргумент не передан, то новое состояние задается противоположным текущему.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <ws:template name="StackTemplate">
 *  <Controls.popupTemplate:Stack name="my_stack">
 *      <ws:bodyContentTemplate>
 *          <Controls.input:Text value="_value" />
 *          <Controls.buttons:Button caption="maximized" on:click="_maximized()"/>
 *      </ws:bodyContentTemplate>
 *  </Controls.popupTemplate:Stack>
 * </ws:template>
 *
 * <Controls.popup:Stack name="stack" template="StackTemplate"/>
 *
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions>{
 *    ...
 *
 *    _beforeMount() {
 *      var popupOptions = {
 *          autofocus: true
 *      }
 *      this._children.stack.open(popupOptions)
 *    }
 *
 *    _maximized() {
 *       this._children.my_stack.toggleMaximizeState()
 *    }
 *
 *    ...
 * }
 * </pre>
 */

/**
 * @event Событие, позволяющее растянуть стековое окно на полный экран.
 * @name Controls/_popupTemplate/Stack#fullscreen
 * @param {boolean} fullscreen
 * @demo Controls-demo/Popup/Stack/Fullscreen/Index
 */

export default forwardRef(StackTemplate);
