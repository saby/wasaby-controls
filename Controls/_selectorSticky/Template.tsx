import {
    forwardRef,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { useTheme } from 'UI/Contexts';
import { Provider, useSlice } from 'Controls-DataEnv/context';
import {
    IDataConfig,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
    ListSlice,
} from 'Controls/dataFactory';
import { ISelectorStickyTemplateProps } from './interface/ISelectorSticky';
import { Sticky } from 'Controls/popupTemplate';
import SelectorView from './View';
import { default as SelectorSlice } from './Factory/Slice';
import HeaderTemplate from './templates/HeaderTemplate';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import 'css!Controls/selectorSticky';

interface IDataControllerOptions extends Omit<IListDataFactoryArguments, 'name'> {}

const SELECTOR_STORE_ID = '_selectorStoreId';
const MAX_HISTORY_VISIBLE_ITEMS = 10;

export default forwardRef(function SelectorStickyTemplate(
    props: ISelectorStickyTemplateProps,
    ref
) {
    const theme = useTheme(props);

    const isAdaptive = useAdaptiveMode().device.isPhone();
    const allowAdaptive = isAdaptive && props.allowAdaptive !== false;

    const stickyRef = useRef(null);
    const contentRef = useRef(null);
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

    const style = useMemo(() => {
        return {
            minWidth: styleSize.minWidth ? styleSize.minWidth + 'px' : '',
            minHeight: styleSize.minHeight ? styleSize.minHeight + 'px' : '',
        };
    }, [styleSize]);

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
        >
            <Provider
                configs={configs}
                loadResults={loadResults}
                children={
                    <Sticky
                        ref={setRef}
                        className={`controls-Layout-SelectorPopup-Sticky controls-Menu__popup-template ${
                            !allowAdaptive ? 'controls-padding_top-s' : ''
                        }`}
                        style={style}
                        onControlResize={viewResized}
                        closeButtonViewMode={closeButtonViewMode}
                        borderVisible={false}
                        borderRadius="s"
                        stickFooter={props.stickyFooter ?? true}
                        headerContentTemplate={props.headerTemplate}
                        hoverBackgroundStyle={props.hoverBackgroundStyle || 'default'}
                        bodyContentTemplate={
                            <div
                                ref={contentRef}
                                className={`tw-flex tw-flex-col tw-h-full tw-min-h-0 tw-box-border ${
                                    !allowAdaptive
                                        ? 'controls-padding_left-s controls-padding_right-s'
                                        : ''
                                }`}
                            >
                                {headerTemplateVisible ? (
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
                                ) : null}
                                {props.breadCrumbsVisibility === 'visible' ? (
                                    <BreadcrumbsPath />
                                ) : null}
                                <SelectorView
                                    {...props}
                                    markerVisibility={props.markerVisibility || 'hidden'}
                                    root={props.root || null}
                                    emptyKey={props.emptyKey || null}
                                    stickyFooter={props.stickyFooter ?? true}
                                    className={`                            ${
                                        props.breadCrumbsVisibility !== 'visible'
                                            ? props.searchParam
                                                ? 'controls-margin_top-2xs'
                                                : ''
                                            : ''
                                    }`}
                                    isAdaptive={isAdaptive}
                                    allowAdaptive={allowAdaptive}
                                    updateApplyButtonVisible={updateApplyButtonVisible}
                                />
                            </div>
                        }
                        footerContentTemplate={
                            <FooterContentTemplate
                                footerContentTemplate={props.footerContentTemplate}
                                footerBackgroundStyle={props.footerBackgroundStyle}
                                stickyFooter={props.stickyFooter}
                                multiSelect={props.multiSelect}
                                markerVisibility={props.markerVisibility || 'hidden'}
                                nodeFooterTemplate={props.nodeFooterTemplate}
                                footerItemData={props.footerItemData}
                                allowAdaptive={allowAdaptive}
                            />
                        }
                    ></Sticky>
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
            className={`${
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
            {props.stickyFooter && FooterTemplate ? <FooterTemplate {...footerItemData} /> : null}
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
    const isSelectedEmptyItem =
        options.emptyText &&
        (!options.selectedKeys?.length || options.selectedKeys?.includes(options.emptyKey || null));
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
                markedKey: isSelectedEmptyItem ? options.emptyKey || null : undefined,
                markerVisibility: options.markerVisibility || 'hidden',
                root: options.root || null,
                historyRoot: options.historyRoot || null,
                allowPin: options.allowPin,
                maxHistoryVisibleItems: options.maxHistoryVisibleItems || MAX_HISTORY_VISIBLE_ITEMS,
            } as unknown as Omit<IDataControllerOptions, 'name'>,
        },
    };
}
