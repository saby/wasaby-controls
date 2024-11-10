import * as React from 'react';
import Async from 'Controls/Container/Async';

export default function SearchBreadCrumbsItemTemplate(props) {
    const templateOptions = React.useMemo(() => {
        return {
            className: `controls-ListView__item-leftPadding_${props.leftPadding}`,
            highlightOnHover: false,
            ...props,
            marker: false,
        };
    }, [props.leftPadding]);

    if (props.breadCrumbsItemTemplate) {
        return (
            <CustomItemTemplate
                breadCrumbsItemTemplate={props.breadCrumbsItemTemplate}
                item={props.item}
                keyProperty={props.keyProperty}
                displayProperty={props.displayProperty}
                leftPadding={props.leftPadding}
            />
        );
    }

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

    return (
        <Async
            templateName="Controls/breadcrumbs:Path"
            className={`controls-ListView__item-leftPadding_${props.leftPadding}`}
            templateOptions={templateOptions}
        />
    );
}
