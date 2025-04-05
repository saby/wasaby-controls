import * as React from 'react';
import { IComponentProps, ISearchOptions } from 'Controls/interface';
import { useTheme } from 'UI/Contexts';
import { useSlice } from 'Controls-DataEnv/context';
import { HeaderTemplate } from 'Controls/menu';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { activate } from 'UI/Focus';
import SelectorSlice from 'Controls/_selectorSticky/Factory/Slice';
import { ISelectorStickyTemplateProps } from '../interface/ISelectorSticky';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { View as FilterViewControl } from 'Controls-ListEnv/filterConnected';
import type { Back as BreadcrumbsBackControl } from 'Controls-ListEnv/breadcrumbs';
import type { View as FilterSearchViewControl } from 'Controls-ListEnv/filterSearchConnected';
import ExpandableSearchInput from 'Controls-ListEnv/ExpandableSearchInput';
import { Input as SearchConnectedInput } from 'Controls-ListEnv/searchConnected';
import 'Controls/filterDateRangeEditor'; // Редактор даты, пока загрузим здесь

export interface IHeaderTemplateProps
    extends IComponentProps,
        Pick<ISearchOptions, 'searchParam' | 'minSearchLength'>,
        Pick<
            ISelectorStickyTemplateProps,
            | 'searchPlaceholder'
            | 'allowAdaptive'
            | 'multiSelect'
            | 'markerVisibility'
            | 'breadCrumbsVisibility'
            | 'filterDescription'
            | 'filterDescriptionEmptyText'
            | 'headerContentTemplate'
            | 'headerTemplate'
            | 'nodeProperty'
            | 'parentProperty'
            | 'expanderPosition'
        > {
    storeId: string;
    caption?: string;
    applyButtonVisible?: boolean;
    rightTemplate?: React.ReactElement;
}

export default React.forwardRef(function HeaderContentWrapperTemplate(
    props: IHeaderTemplateProps,
    ref
) {
    const headerTemplateVisible =
        props.searchParam || props.caption || props.breadCrumbsVisibility === 'visible';

    return (
        <div ref={ref} className={`controls-padding_top-${props.filterDescription ? 'xs' : 's'}`}>
            {headerTemplateVisible ? <HeaderContentTemplate {...props} /> : null}
        </div>
    );
});

function HeaderContentTemplate(props: IHeaderTemplateProps): React.ReactElement {
    const theme = useTheme(props);
    const isAdaptive = useAdaptiveMode().device.isPhone();
    const allowAdaptive = isAdaptive && props.allowAdaptive !== false;
    const [expanded, setExpanded] = React.useState(false);
    const listContext = useSlice<SelectorSlice>(props.storeId);
    const backButtonCaption = listContext?.state.backButtonCaption;
    const hasHeading =
        props.caption || (backButtonCaption && props.breadCrumbsVisibility !== 'visible');
    const hasValue = !!listContext?.state.searchValue;
    const hasBreadcrumbsInHeader =
        !listContext?.state.isRoot && props.breadCrumbsVisibility !== 'visible';
    const viewMode = listContext?.state.viewMode;
    let paddingLeftClassName =
        (props.searchParam && !hasHeading) || !hasBreadcrumbsInHeader
            ? 'controls-Layout-SelectorPopup-Sticky-header-margin_left-expander controls-Layout-SelectorPopup-Sticky-header-padding_left-expander'
            : 'controls-padding_left-2xs';
    if (hasBreadcrumbsInHeader && props.searchParam && expanded) {
        paddingLeftClassName += ' controls-Layout-SelectorPopup-Sticky-header-margin_left-expander';
    }

    return (
        <div className="tw-flex controls-margin_left-2xs controls-margin_right-2xs">
            <div
                style={props.style}
                className={`controls_list_theme-${theme}
            controls-inlineheight-${props.filterDescription ? 'xl' : 'l'}
            controls-Menu__popup-header
            tw-w-full tw-flex-grow tw-box-border
            ${paddingLeftClassName}
            controls-margin_bottom-${props.filterDescription ? '2xs' : 'xs'}
            controls-Layout-SelectorPopup-Sticky-header-padding_right-${
                allowAdaptive
                    ? 'adaptive'
                    : props.headerTemplate
                    ? 'withHeader'
                    : props.multiSelect
                    ? 'applyButton'
                    : 'default'
            }
            controls-Menu__popup-header_withClose
            ${allowAdaptive ? 'controls-Menu__popup-header_adaptive' : ''} ${
                props.className || ''
            }`}
            >
                <div
                    className={`ws-flexbox ws-align-items-center tw-max-w-full tw-w-full ${
                        !expanded && hasHeading ? 'tw-w-full tw-justify-between' : ''
                    } ${
                        props.caption ? 'controls-Menu__popup_headerWrapper_search_minWidth_s' : ''
                    } ${
                        (!hasValue || viewMode !== 'search') && allowAdaptive
                            ? 'controls-Menu__popup_header_searchWrapper-width'
                            : ''
                    }`}
                >
                    <ContentTemplate
                        {...props}
                        expanded={expanded}
                        isAdaptive={isAdaptive}
                        backButtonCaption={backButtonCaption}
                        hasValue={hasValue}
                        viewMode={viewMode}
                        setExpanded={setExpanded}
                    />
                </div>
            </div>
        </div>
    );
}

function ContentTemplate(
    props: IHeaderTemplateProps & {
        expanded: boolean;
        isAdaptive?: boolean;
        backButtonCaption?: string;
        hasValue?: boolean;
        viewMode?: string;
        setExpanded: Function;
    }
): React.ReactElement {
    return (
        <>
            {props.caption ||
            (props.backButtonCaption && props.breadCrumbsVisibility !== 'visible') ? (
                <CaptionTemplate {...props} backButtonCaption={props.backButtonCaption} />
            ) : null}
            <SearchFilterTemplate {...props} />
            {props.rightTemplate ? <props.rightTemplate /> : null}
        </>
    );
}

function CaptionTemplate(props: IHeaderTemplateProps & { backButtonCaption?: string }) {
    if (props.caption || props.backButtonCaption) {
        if (props.backButtonCaption && props.breadCrumbsVisibility !== 'visible') {
            const BreadcrumbsBack = loadSync(
                'Controls-ListEnv/breadcrumbs:Back'
            ) as typeof BreadcrumbsBackControl;
            return (
                <BreadcrumbsBack
                    storeId={props.storeId}
                    iconStyle="primary"
                    fontColorStyle="default"
                    fontSize={props.allowAdaptive ? 'xl' : '3xl'}
                    className={`${props.className} controls-Layout-SelectorPopup-Sticky-header-breadCrumbs-padding`}
                />
            );
        } else {
            return (
                <HeaderTemplate
                    caption={props.caption}
                    cursor="default"
                    className={props.className}
                />
            );
        }
    }
    return null;
}

function SearchFilterTemplate(
    props: IHeaderTemplateProps & { backButtonCaption?: string; setExpanded: Function }
): React.ReactElement {
    const classNameApplySpace = props.multiSelect
        ? `controls_Layout-SelectorPopup-Sticky-header-applyButtonSpace_${
              !props.applyButtonVisible ? 'left' : 'right'
          }`
        : '';
    if (props.searchParam && props.filterDescription) {
        const FilterSearchView = loadSync(
            'Controls-ListEnv/filterSearchConnected:View'
        ) as typeof FilterSearchViewControl;
        return (
            <FilterSearchView
                className={`${classNameApplySpace} tw-w-full controls-Layout-SelectorPopup-header_searchInput`}
                storeId={props.storeId}
                emptyText={props.filterDescriptionEmptyText}
                placeholder={props.searchPlaceholder || props.caption || undefined}
            />
        );
    } else {
        return (
            <>
                {props.searchParam ? (
                    <SearchTemplate
                        className={classNameApplySpace}
                        storeId={props.storeId}
                        allowAdaptive={props.allowAdaptive}
                        backButtonCaption={props.backButtonCaption}
                        breadCrumbsVisibility={props.breadCrumbsVisibility}
                        caption={props.caption}
                        placeholder={props.searchPlaceholder || props.caption || undefined}
                        setExpanded={props.setExpanded}
                    />
                ) : null}
                {props.filterDescription ? (
                    <FilterViewTemplate
                        className={!props.searchParam ? classNameApplySpace : ''}
                        storeId={props.storeId}
                        emptyText={props.filterDescriptionEmptyText}
                    />
                ) : null}
            </>
        );
    }
    return null;
}

function SearchTemplate(props: {
    storeId: string;
    allowAdaptive?: boolean;
    backButtonCaption?: string;
    breadCrumbsVisibility?: string;
    caption?: string;
    placeholder?: string;
    className?: string;
    setExpanded: Function;
}): React.ReactElement {
    const searchRef = React.useRef(null);
    const isExpandableSearch =
        props.caption || (props.backButtonCaption && props.breadCrumbsVisibility !== 'visible');

    const className = `${
        isExpandableSearch
            ? 'controls-margin_left-2xs controls-margin_right-2xs'
            : 'controls-Layout-SelectorPopup-header_searchInput'
    }`;

    React.useEffect(() => {
        if (!isExpandableSearch) {
            activate(searchRef.current);
        }
    }, []);

    const onExpandedChanged = React.useCallback(
        (value) => {
            props.setExpanded(value);
        },
        [props.setExpanded]
    );

    const Search = isExpandableSearch ? ExpandableSearchInput : SearchConnectedInput;
    return (
        <Search
            ref={searchRef}
            storeId={props.storeId}
            // onValueChanged: valueChanged,
            // value: inputSearchValue,
            placeholder={props.placeholder}
            contrastBackground={true}
            iconSize={null}
            searchInputDirection="left"
            inlineWidth="auto"
            inlineHeight={props.allowAdaptive ? 'l' : 'default'}
            // expanded: props.expanded,
            onExpandedChanged={onExpandedChanged}
            className={`${className} ${props.className}`}
        />
    );
}

function FilterViewTemplate(props: { storeId: string; emptyText }): React.ReactElement {
    const FilterView = loadSync(
        'Controls-ListEnv/filterConnected:View'
    ) as typeof FilterViewControl;
    return (
        <FilterView
            storeId={props.storeId}
            emptyText={props.emptyText}
            className="controls-margin_left-l"
        />
    );
}
