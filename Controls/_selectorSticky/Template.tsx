import {
    forwardRef,
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { useTheme } from 'UI/Contexts';
import { EventSubscriber } from 'UI/Events';
import { Provider, useSlice } from 'Controls-DataEnv/context';
import {
    IDataConfig,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
    ListSlice,
} from 'Controls/dataFactory';
import isEmptyKeySelected from './Utils/IsEmptyKeySelected';
import { ISelectorStickyTemplateProps } from './interface/ISelectorSticky';
import { Context as PopupContext, Sticky } from 'Controls/popupTemplate';
import SelectorView from './View';
import { default as SelectorSlice } from './Factory/Slice';
import HeaderTemplate from './templates/HeaderTemplate';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import 'css!Controls/selectorSticky';

interface IDataControllerOptions extends Omit<IListDataFactoryArguments, 'name'> {}

export const SELECTOR_STORE_ID = '_selectorStoreId';
const MAX_HISTORY_VISIBLE_ITEMS = 10;

/**
 *  Контрол "Справочник в меню". Отображается в шаблоне стики окна.
 *  @class Controls/selectorSticky:Template
 *  @implements Controls/selectorSticky:ISelectorStickyTemplateProps
 *  @public
 */
export default forwardRef(function SelectorStickyTemplate(
    props: ISelectorStickyTemplateProps,
    ref
) {
    const { stickyFooter = true } = props;
    const theme = useTheme(props);
    const popupContext = useContext(PopupContext);

    const isAdaptive = useAdaptiveMode().device.isPhone();
    const allowAdaptive = isAdaptive && props.allowAdaptive !== false;

    const stickyRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);
    const [adaptiveMenuIsSwiped, setAdaptiveMenuIsSwiped] = useState(() => false);
    const [applyButtonVisible, setApplyButtonVisible] = useState(() => false);
    const [styleSize, setStyleSize] = useState(() => {
        return { minWidth: 0, minHeight: 0 };
    });

    const setRef = useCallback((element) => {
        if (ref) {
            ref(element);
        }
        stickyRef.current = element;
    }, []);

    const slidingPanelOptions = useMemo(() => {
        return {
            ...props.slidingPanelOptions,
            shouldSwipeOnContent: true,
        };
    }, [props.slidingPanelOptions]);

    const style = useMemo(() => {
        const minH = slidingPanelOptions.minHeight || styleSize.minHeight;
        return {
            minWidth: styleSize.minWidth ? styleSize.minWidth + 'px' : '',
            minHeight: minH ? minH + 'px' : '',
        };
    }, [slidingPanelOptions.minHeight, styleSize.minHeight, styleSize.minWidth]);

    const { configs, loadResults } = useMemo(() => {
        return {
            configs: getNormalizeConfigs(props, allowAdaptive),
            loadResults: getLoadResultFromOptions(props),
        };
    }, []);

    useEffect(() => {
        setStyleSize({
            minWidth: !isAdaptive ? contentRef?.current?.clientWidth : 0,
            minHeight: contentRef?.current?.clientHeight,
        });
    }, [isAdaptive]);

    useEffect(() => {
        if (isAdaptive) {
            const maxHeight = props.slidingPanelOptions?.maxHeight || document?.body?.clientHeight;
            setAdaptiveMenuIsSwiped(containerRef?.current?.clientHeight === maxHeight);
        }
    }, []);

    const viewResized = useCallback(() => {
        if (!allowAdaptive) {
            const content = contentRef?.current;

            const stickyHeight = stickyRef?.current?._container.clientHeight;

            if (styleSize.minWidth < content?.clientWidth || styleSize.minHeight < stickyHeight) {
                const newStyle = { ...styleSize };
                if (styleSize.minWidth < content?.clientWidth) {
                    newStyle.minWidth = content?.clientWidth;
                }
                if (styleSize.minHeight < stickyHeight) {
                    const bodyDimensions = DimensionsMeasurer.getElementDimensions(document.body);
                    newStyle.minHeight = Math.min(stickyHeight, bodyDimensions.clientHeight * 0.6);
                }
                setStyleSize(newStyle);
            }
        }
    }, [isAdaptive, styleSize]);

    const menuSwiped = useCallback(
        (direction) => {
            if (direction === 'top' && !adaptiveMenuIsSwiped) {
                popupContext.sendResult('slidingHeightUpdate', [
                    {
                        autoHeight: true,
                    },
                ]);
                setAdaptiveMenuIsSwiped(true);
            }
        },
        [adaptiveMenuIsSwiped, popupContext]
    );

    const updateApplyButtonVisible = useCallback(
        (newApplyButtonVisible: boolean) => {
            setApplyButtonVisible(newApplyButtonVisible);
        },
        [setApplyButtonVisible]
    );

    const paddingCloseClassName =
        !allowAdaptive && props.multiSelect
            ? 'controls-Layout-SelectorPopup-Sticky-with-closeButton'
            : '';

    const headerTemplateVisible =
        props.searchParam || props.headingCaption || props.breadCrumbsVisibility === 'visible';

    const closeButtonViewMode =
        props.multiSelect || !headerTemplateVisible
            ? applyButtonVisible
                ? 'externalWide'
                : 'external'
            : 'link';

    return (
        <div
            className={`${
                props.className
            } controls_dropdownPopup_theme-${theme} ${paddingCloseClassName} controls-Menu__popup ${
                !allowAdaptive ? 'controls-padding_top-3xs' : ''
            }`}
            ref={containerRef}
        >
            <Provider
                configs={configs}
                loadResults={loadResults}
                children={
                    <EventSubscriber
                        onPopupDragStart={props.onPopupDragStart}
                        onPopupDragEnd={props.onPopupDragEnd}
                        onPopupMovingSize={props.handleChangeSize}
                    >
                        <Sticky
                            ref={setRef}
                            slidingPanelOptions={slidingPanelOptions}
                            className={`controls-Layout-SelectorPopup-Sticky controls-Menu__popup-template ${
                                !allowAdaptive ? 'controls-Menu__popup-template_maxWidth' : ''
                            } ${props.dropdownClassName || ''}`}
                            style={style}
                            onCustomdragStart={menuSwiped}
                            onControlResize={viewResized}
                            closeButtonViewMode={closeButtonViewMode}
                            borderVisible={false}
                            borderRadius="s"
                            stickyFooter={stickyFooter}
                            headerContentTemplate={props.headerTemplate}
                            bodyContentTemplate={
                                <div
                                    ref={contentRef}
                                    className="tw-flex tw-flex-col tw-h-full tw-min-h-0 tw-box-border"
                                >
                                    <HeaderTemplate
                                        storeId={SELECTOR_STORE_ID}
                                        allowAdaptive={allowAdaptive}
                                        caption={
                                            props.filterDescription && props.searchParam
                                                ? undefined
                                                : props.headingCaption
                                        }
                                        headerContentTemplate={props.headerContentTemplate}
                                        searchParam={props.searchParam}
                                        searchPlaceholder={props.searchPlaceholder}
                                        searchWidth={props.searchWidth}
                                        minSearchLength={props.minSearchLength}
                                        markerVisibility={props.markerVisibility || 'hidden'}
                                        multiSelect={props.multiSelect}
                                        breadCrumbsVisibility={props.breadCrumbsVisibility}
                                        filterDescription={props.filterDescription}
                                        filterDescriptionEmptyText={
                                            props.filterDescriptionEmptyText
                                        }
                                    />
                                    {props.breadCrumbsVisibility === 'visible' ? (
                                        <BreadcrumbsPath />
                                    ) : null}
                                    <SelectorView
                                        {...props}
                                        hoverBackgroundStyle={
                                            props.hoverBackgroundStyle || 'default'
                                        }
                                        markerVisibility={props.markerVisibility || 'hidden'}
                                        root={props.root || null}
                                        emptyKey={props.emptyKey || null}
                                        stickyFooter={stickyFooter}
                                        className={`${
                                            !allowAdaptive
                                                ? 'controls-padding_left-s controls-padding_right-s tw-box-border'
                                                : ''
                                        }`}
                                        isAdaptive={isAdaptive}
                                        allowAdaptive={allowAdaptive}
                                        adaptiveMenuIsSwiped={adaptiveMenuIsSwiped}
                                        updateApplyButtonVisible={updateApplyButtonVisible}
                                    />
                                </div>
                            }
                            footerContentTemplate={(footerProps) => (
                                <FooterContentTemplate
                                    {...footerProps}
                                    footerContentTemplate={props.footerContentTemplate}
                                    footerBackgroundStyle={props.footerBackgroundStyle}
                                    stickyFooter={stickyFooter}
                                    multiSelect={props.multiSelect}
                                    markerVisibility={props.markerVisibility || 'hidden'}
                                    nodeFooterTemplate={props.nodeFooterTemplate}
                                    footerItemData={props.footerItemData}
                                    allowAdaptive={allowAdaptive}
                                />
                            )}
                        ></Sticky>
                    </EventSubscriber>
                }
            ></Provider>
        </div>
    );
});

interface IFooterContentTemplateOptions
    extends Pick<
        ISelectorStickyTemplateProps,
        | 'footerContentTemplate'
        | 'footerBackgroundStyle'
        | 'stickyFooter'
        | 'multiSelect'
        | 'markerVisibility'
        | 'nodeFooterTemplate'
        | 'footerItemData'
    > {
    allowAdaptive?: boolean;
}

function BreadcrumbsPath(): ReactElement {
    const selectorContext = useSlice<SelectorSlice>('_selectorStoreId');

    const BreadcrumbsPath = loadSync('Controls-ListEnv/breadcrumbs:HeadingPath');

    if (selectorContext?.state.breadCrumbsItems?.length) {
        return (
            <div className="tw-flex tw-items-center controls-margin_left-m controls-margin_right-s controls-inlineheight-xl controls-margin_bottom-xs">
                <BreadcrumbsPath
                    storeId={SELECTOR_STORE_ID}
                    showActionButton={false}
                    iconStyle="primary"
                    fontColorStyle="default"
                />
            </div>
        );
    }
    return null;
}

function FooterContentTemplate(props: IFooterContentTemplateOptions): ReactElement {
    const isWithSelect = props.multiSelect || props.markerVisibility !== 'hidden';
    const listContext = useSlice<ListSlice>(SELECTOR_STORE_ID);

    const { FooterTemplate, footerItemData } = useMemo(() => {
        const root = listContext?.state.root;
        if (!root) {
            return {
                FooterTemplate: props.footerContentTemplate,
                footerItemData: props.footerItemData,
            };
        } else {
            return {
                FooterTemplate: props.nodeFooterTemplate,
                footerItemData: {
                    key: root,
                    item: listContext?.state.items?.getRecordById(root),
                },
            };
        }
    }, [
        listContext?.state.root,
        listContext?.state.items,
        props.footerContentTemplate,
        props.nodeFooterTemplate,
        props.footerItemData,
    ]);

    return (
        <div
            data-qa={props['data-qa']}
            className={`${props.className} ${
                FooterTemplate &&
                props.footerBackgroundStyle &&
                props.footerBackgroundStyle !== 'default'
                    ? 'controls-padding_top-s controls-margin_top-xs'
                    : ''
            } ${
                !props.allowAdaptive
                    ? 'controls-padding_bottom-s controls-padding_left-s controls-padding_right-s'
                    : ''
            }
            ${
                props.stickyFooter
                    ? 'controls-padding_left-' +
                      (isWithSelect ? 'xs' : 's') +
                      ' controls-padding_right-' +
                      (isWithSelect ? 'xs' : 's')
                    : ''
            }`}
        >
            {props.stickyFooter && FooterTemplate ? (
                <FooterTemplate footerItemData={footerItemData} />
            ) : null}
        </div>
    );
}

function getLoadResultFromOptions(
    options: ISelectorStickyTemplateProps
): Record<string, IListDataFactoryLoadResult> {
    const sourceController = options.sourceController;

    return {
        [SELECTOR_STORE_ID]: {
            ...options,
            ...(sourceController
                ? {
                      data: sourceController.getItems(),
                      error: sourceController.getLoadError(),
                  }
                : {}),
        },
    } as Record<string, IListDataFactoryLoadResult>;
}

function getNormalizeConfigs(
    options: ISelectorStickyTemplateProps,
    allowAdaptive?: boolean
): Record<'_selectorStoreId', IDataConfig<IListDataFactoryArguments>> {
    const isEmptyKeyArray = options.emptyKey instanceof Array;
    const emptyKeys = isEmptyKeyArray ? options.emptyKey : [options.emptyKey || null];
    const isSelectedEmptyItem =
        (options.emptyText || isEmptyKeyArray) &&
        (!options.selectedKeys?.length || isEmptyKeySelected(emptyKeys, options.selectedKeys));
    return {
        [SELECTOR_STORE_ID]: {
            dataFactoryName: options.selectorFactoryName || 'Controls/selectorSticky:DataFactory',
            dataFactoryArguments: {
                ...options,
                viewMode: 'table',
                searchNavigationMode: 'readonly',
                sliceOwnedByBrowser: true,
                dataLoadCallback: null,
                filterButtonSource: null,
                // Чтобы в режиме совместимости itemactions "в старом стиле" не попали в интерактор,
                // и для старых контролов не включалась новая логика.
                itemActions: undefined,
                multiSelectVisibility: options.multiSelect
                    ? allowAdaptive
                        ? 'visible'
                        : 'onhover'
                    : 'hidden',
                markedKey: isSelectedEmptyItem
                    ? options.selectedKeys?.[0] || options.emptyKey || null
                    : undefined,
                markerVisibility: options.markerVisibility || 'hidden',
                root: options.root || null,
                historyRoot: options.historyRoot || null,
                allowPin: options.allowPin,
                maxHistoryVisibleItems: options.maxHistoryVisibleItems || MAX_HISTORY_VISIBLE_ITEMS,
            } as unknown as Omit<IDataControllerOptions, 'name'>,
        },
    };
}
