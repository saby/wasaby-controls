/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import { createElement, delimitProps } from 'UICore/Jsx';
import { FocusRoot } from 'UICore/Focus';
import { Highlight } from 'Controls/baseDecorator';
import { ListMarker } from 'Controls/baseList';
import { ItemActionsTemplateSelector } from 'Controls/baseList';
import { IItemTemplateProps, getItemEventHandlers } from 'Controls/baseList';

const MultiSelectTemplate = ({ item }) => {
    return createElement(item.getMultiSelectTemplate(), {
        item,
        viewMode: 'outlined',
    });
};

const ContentTemplate = (props: IItemTemplateProps): JSX.Element => {
    let Content;
    if (props.children || props.contentTemplate) {
        Content =
            props.children ||
            createElement(
                props.contentTemplate,
                {
                    item: props.item,
                    highlightOnHover: props.highlightOnHover,
                    searchValue: props.item.getSearchValue(),
                    itemPadding: props.item.getItemPadding(),
                    viewMode: 'outlined',
                    readOnly: props.readOnly,
                    itemActionsTemplate: props.itemActionsTemplate,
                    swipeTemplate: props.swipeTemplate,
                    multiSelectTemplate: MultiSelectTemplate,
                },
                undefined,
                undefined,
                props.wasabyContext
            );
    } else if (props.item.getSearchValue()) {
        Content = createElement(Highlight, {
            highlightedValue: props.item.getSearchValue(),
            value: String(props.item.getDisplayValue(props.displayProperty)),
        });
    } else {
        Content = props.item.getDisplayValue(props.displayProperty);
    }
    return Content;
};

function Item(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const { clearProps, context } = delimitProps(props);
    const {
        item,
        highlightOnHover,
        cursor,
        tagStyle,
        clickable,
        shadowVisibility,
        backgroundColorStyle,
        hoverBackgroundStyle,
        showItemActionsOnHover,
        multiSelectVisibility,
        multiSelectPosition,
        contentPadding,
        isAdaptive,
        onDeactivatedCallback,
    } = { ...clearProps };

    const attrs = item.getItemAttrs(props);
    const handlers = getItemEventHandlers(item, props);
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback && onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );

    const itemActions =
        props.item.SupportItemActions &&
        (props.item.getItemActionsPosition() !== 'custom' || item.shouldDisplaySwipeTemplate()) ? (
            <ItemActionsTemplateSelector
                item={props.item}
                highlightOnHover={props.highlightOnHover}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                itemActionsBackgroundStyle={'hovered'}
                actionsVisibility={props.actionsVisibility}
                itemActionsClass={props.itemActionsClass}
                onActionsMouseEnter={props.onActionsMouseEnter}
                onActionMouseDown={props.onActionMouseDown}
                onActionMouseUp={props.onActionMouseUp}
                onActionMouseEnter={props.onActionMouseEnter}
                onActionMouseLeave={props.onActionMouseLeave}
                onActionClick={props.onActionClick}
                onItemActionSwipeAnimationEnd={props.onItemActionSwipeAnimationEnd}
                itemActionsTemplateMountedCallback={props.itemActionsTemplateMountedCallback}
                itemActionsTemplateUnmountedCallback={props.itemActionsTemplateUnmountedCallback}
            />
        ) : null;
    const className =
        props.className +
        ' ' +
        props.item.getWrapperClasses(
            highlightOnHover,
            cursor || clickable,
            backgroundColorStyle,
            hoverBackgroundStyle,
            showItemActionsOnHover,
            contentPadding,
            isAdaptive
        );
    return (
        <FocusRoot
            as="div"
            {...attrs}
            {...handlers}
            {...props.item.getItemAttrs(props)}
            onDeactivated={onDeactivated}
            className={className}
            ref={ref}
        >
            <ListMarker
                item={item}
                className={props.markerClassName}
                marker={props.marker}
                markerSize={props.markerSize}
                markerPosition={props.markerPosition}
            />
            {multiSelectVisibility &&
                multiSelectVisibility !== 'hidden' &&
                multiSelectPosition !== 'custom' && <MultiSelectTemplate item={item} />}
            <div className={props.item.getContentClasses(shadowVisibility)}>
                <ContentTemplate {...(clearProps as IItemTemplateProps)} wasabyContext={context} />
            </div>
            {itemActions}
            {item.getTagStyle(tagStyle) && <props.tagTemplate tagStyle={tagStyle} />}
        </FocusRoot>
    );
}

export default React.memo(React.forwardRef(Item));
