import * as React from 'react';
import type { Model, Record } from 'Types/entity';
import { Path, ItemTemplate } from 'Controls/breadcrumbs';
import { Highlight } from 'Controls/baseDecorator';
import { useContent } from 'UICore/Jsx';

export interface IPathComponentProps {
    keyProperty?: string;
    displayProperty?: string;
    readOnly?: boolean;
    items: Model[];
    searchValue?: string;

    backgroundStyle?: string;
    containerWidth?: number;
    onBreadCrumbsItemClick?: (event: Event, item: Record) => void;
}

export default React.memo(
    React.forwardRef(function PathComponent(
        props: IPathComponentProps,
        forwardedRef: React.ForwardedRef<HTMLDivElement>
    ): JSX.Element {
        const {
            keyProperty,
            displayProperty,
            containerWidth,
            readOnly,
            onBreadCrumbsItemClick,
            items,
            backgroundStyle,
            searchValue,
        } = props;

        const itemTemplateContent = useContent(
            (
                contentTemplateProps: { itemData: { item: Record } },
                forwardedContentRef: React.ForwardedRef<HTMLDivElement>
            ) => {
                return (
                    <Highlight
                        ref={forwardedContentRef}
                        className="controls-Grid__breadCrumbs_highlight"
                        highlightedValue={searchValue}
                        value={contentTemplateProps.itemData.item.get(displayProperty) || ''}
                    />
                );
            },
            [searchValue]
        );

        const itemTemplate = useContent(
            (
                itemTemplateContentProps: object,
                forwardedContentRef: React.ForwardedRef<HTMLDivElement>
            ) => {
                return (
                    <ItemTemplate
                        {...itemTemplateContentProps}
                        contentTemplate={itemTemplateContent}
                        ref={forwardedContentRef}
                    />
                );
            },
            [itemTemplateContent]
        );

        return (
            <Path
                ref={forwardedRef}
                className="controls-Grid__breadCrumbs"
                readOnly={readOnly}
                items={items}
                backgroundStyle={backgroundStyle}
                breadCrumbsItemClickCallback={onBreadCrumbsItemClick}
                containerWidth={containerWidth}
                keyProperty={keyProperty}
                displayProperty={displayProperty}
                itemTemplate={itemTemplate}
            />
        );
    })
);
