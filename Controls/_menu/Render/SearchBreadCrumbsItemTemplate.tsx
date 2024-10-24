import * as React from 'react';
import Async from 'Controls/Container/Async';

export default function SearchBreadCrumbsItemTemplate(props) {
    const templateOptions = React.useMemo(() => {
        const _templateOptions = {
            highlightOnHover: false,
            ...props,
            className: `controls-ListView__item-leftPadding_${props.leftPadding} ${
                props.className ?? ''
            }`,
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
    }, [props.leftPadding, props.item.searchValue]);

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
