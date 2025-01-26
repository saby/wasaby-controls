import * as React from 'react';
import { IComponentProps, ISearchOptions } from 'Controls/interface';
import { useTheme } from 'UI/Contexts';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { HeaderTemplate } from 'Controls/menu';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { ISelectorOptions } from '../Sticky';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { View as FilterViewControl } from 'Controls-ListEnv/filterConnected';
import type { Back as BreadcrumbsBackControl } from 'Controls-ListEnv/breadcrumbs';
import type { View as FilterSearchViewControl } from 'Controls-ListEnv/filterSearchConnected';
import ExpandableSearchInput from 'Controls-ListEnv/ExpandableSearchInput';
import { Input as SearchConnectedInput } from 'Controls-ListEnv/searchConnected';

export interface IHeaderTemplateProps
    extends IComponentProps,
        Pick<ISearchOptions, 'searchParam' | 'minSearchLength'>,
        Pick<
            ISelectorOptions,
            | 'searchPlaceholder'
            | 'searchWidth'
            | 'allowAdaptive'
            | 'multiSelect'
            | 'markerVisibility'
            | 'breadCrumbsVisibility'
            | 'filterDescription'
            | 'filterDescriptionEmptyText'
            | 'headerContentTemplate'
        > {
    storeId: string;
    caption?: string;
}

export default React.forwardRef(function HeaderContentTemplate(
    props: IHeaderTemplateProps,
    ref
): React.ReactElement {
    const theme = useTheme(props);
    const isAdaptive = useAdaptiveMode().device.isPhone();
    const allowAdaptive = isAdaptive && props.allowAdaptive !== false;
    const [expanded, setExpanded] = React.useState(false);
    const listContext = useSlice<ListSlice>(props.storeId);
    const backButtonCaption = listContext?.state.backButtonCaption;
    const hasHeading =
        props.caption || (backButtonCaption && props.breadCrumbsVisibility !== 'visible');
    const hasValue = !!listContext?.state.searchValue;
    const viewMode = listContext?.state.viewMode;

    return (
        <div ref={ref} className="tw-flex tw-w-full">
            <div
                style={props.style}
                className={`controls_dropdownPopup_theme-${theme}
            controls_list_theme-${theme}
            controls-inlineheight-l
            controls-Menu__popup-header
            tw-w-full tw-flex-grow tw-box-border
            controls-padding_left-${
                props.searchParam && !hasHeading
                    ? 'null'
                    : props.multiSelect || props.markerVisibility !== 'hidden'
                    ? 's'
                    : 'm'
            }
            controls-Layout-SelectorPopup-Sticky-header-padding_right-${
                props.multiSelect ? 'applyButton' : 'default'
            }
            controls-Menu__popup-header_withClose
            ${
                allowAdaptive
                    ? 'controls-Menu__popup-header_adaptive controls-padding_left-m controls-padding_right-xs'
                    : ''
            } ${props.className || ''}`}
            >
                <div
                    className={`ws-flexbox ws-align-items-center tw-max-w-full ${
                        !expanded && hasHeading ? 'tw-w-full tw-justify-between' : ''
                    }
    ${
        props.caption
            ? 'controls-Menu__popup_headerWrapper_search_minWidth_' + (props.searchWidth || 's')
            : ''
    }
     ${
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
                    />
                </div>
            </div>
        </div>
    );
});

function ContentTemplate(
    props: IHeaderTemplateProps & {
        expanded: boolean;
        isAdaptive?: boolean;
        backButtonCaption?: string;
        hasValue?: boolean;
        viewMode?: string;
    }
): React.ReactElement {
    return (
        <>
            {props.caption ||
            (props.backButtonCaption && props.breadCrumbsVisibility !== 'visible') ? (
                <CaptionTemplate {...props} backButtonCaption={props.backButtonCaption} />
            ) : null}
            <SearchFilterTemplate {...props} />
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
                    className={props.className}
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
    props: IHeaderTemplateProps & { backButtonCaption?: string }
): React.ReactElement {
    if (props.searchParam && props.filterDescription) {
        const FilterSearchView = loadSync(
            'Controls-ListEnv/filterSearchConnected:View'
        ) as typeof FilterSearchViewControl;
        return (
            <FilterSearchView
                storeId={props.storeId}
                emptyText={props.filterDescriptionEmptyText}
            />
        );
    } else {
        return (
            <>
                {props.searchParam ? (
                    <SearchTemplate
                        storeId={props.storeId}
                        backButtonCaption={props.backButtonCaption}
                        breadCrumbsVisibility={props.breadCrumbsVisibility}
                        caption={props.caption}
                        placeholder={props.searchPlaceholder || props.caption || undefined}
                    />
                ) : null}
                {props.filterDescription ? (
                    <FilterViewTemplate
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
    backButtonCaption?: string;
    breadCrumbsVisibility?: string;
    caption?: string;
    placeholder?: string;
    className?: string;
}): React.ReactElement {
    const isExpandableSearch =
        props.caption || (props.backButtonCaption && props.breadCrumbsVisibility !== 'visible');

    const className = `${
        isExpandableSearch ? 'controls-margin_left-2xs controls-margin_right-2xs' : ''
    }`;
    const Search = isExpandableSearch ? ExpandableSearchInput : SearchConnectedInput;
    return (
        <Search
            storeId={props.storeId}
            // onValueChanged: valueChanged,
            // value: inputSearchValue,
            placeholder={props.placeholder}
            contrastBackground={true}
            iconSize={null}
            searchInputDirection="left"
            inlineWidth="auto"
            // expanded: props.expanded,
            className={className}
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
