import * as React from 'react';
import Async from 'Controls/Container/Async';

export default function SearchBreadCrumbsItemTemplate(props) {
    const templateOptions = React.useMemo(() => {
        const _templateOptions = {
            highlightOnHover: false,
            className: `controls-ListView__item-leftPadding_${props.leftPadding} ${
                props.className ?? ''
            } controls-margin_bottom-${props.isAdaptive ? null : props.itemsSpacing}`,
            item: props.item,
            column: props.column,
            attrs: props.attrs ? { ...props.attrs, className: undefined } : undefined,
            marker: false,
            searchValue: props.item.searchValue,
        };

        if (props.breadCrumbsItemTemplate) {
            _templateOptions.contentTemplate = (
                <CustomItemTemplate
                    breadCrumbsItemTemplate={props.breadCrumbsItemTemplate}
                    item={props.item}
                    keyProperty={props.keyProperty}
                    displayProperty={props.displayProperty}
                    leftPadding={props.leftPadding}
                />
            );
        }
        return _templateOptions;
    }, [
        props.item,
        props.column,
        props.keyProperty,
        props.displayProperty,
        props.leftPadding,
        props.item.searchValue,
        props.breadCrumbsItemTemplate,
        props.className,
        props.attrs,
    ]);

    return (
        <Async
            templateName="Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate"
            templateOptions={templateOptions}
        ></Async>
    );
}

function CustomItemTemplate(props): JSX.Element {
    const templateOptions = React.useMemo(() => {
        return {
            items: props.item.contents,
            keyProperty: props.keyProperty,
            displayProperty: props.displayProperty,
            readOnly: true,
            searchValue: props.item.searchValue,
            itemTemplate: props.breadCrumbsItemTemplate,
        };
    }, [props.item, props.keyProperty, props.displayProperty, props.breadCrumbsItemTemplate]);

    return <Async templateName="Controls/breadcrumbs:Path" templateOptions={templateOptions} />;
}
