/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import * as React from 'react';
import { createElement, delimitProps } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { FocusRoot } from 'UI/Focus';
import { detection } from 'Env/Env';

import { getItemEventHandlers } from 'Controls/baseList';

import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import { AutoResizer } from 'Controls/_tile/render/itemComponents/AutoResizer';
import FooterTemplate from 'Controls/_tile/render/itemComponents/FooterTemplate';
import {
    getItemActionsResolverComponentIfNeed,
    getItemActionsTemplate,
} from 'Controls/_tile/render/itemComponents/ItemActions';
import Title from 'Controls/_tile/render/itemComponents/Title';

function Marker(props: ITileItemProps): JSX.Element {
    if (!props.item.shouldDisplayMarker(props.marker)) {
        return null;
    }

    let className = props.item.getTileMarkerClasses(props.itemType, props.markerSize);
    if (props.markerPosition !== 'custom') {
        className += ' controls-TileView_itemV_marker_default';
    }
    if (props.markerClassName) {
        className += ` ${props.markerClassName}`;
    }

    return <div className={className} data-qa={'marker'} />;
}

function MultiSelect(props: ITileItemProps): JSX.Element {
    return createElement(
        props.item.getMultiSelectTemplate(),
        {
            item: props.item,
        },
        {
            ...props.attrs,
            style: props.item.getMultiSelectStyles(props.itemType, props.attrs?.style),
        }
    );
}

function Content(props: ITileItemProps): JSX.Element {
    const item = props.item || props.itemData;

    const { clearProps } = delimitProps(props);

    const contentTemplate = props.item.getContentTemplate(
        props.itemType,
        props.contentTemplate,
        props.nodeContentTemplate
    );

    // Если itemActions вываодятся в произвольном месте, то в contentTemplate надо отдавать подготовленный шаблон.
    // в наши шаблоны просто прокидываем дальше props.itemActionsTemplate
    // @see Controls/_baseList/Render/ForReact.tsx#L79
    const itemActionsTemplate =
        item.getItemActionsPosition() === 'custom' ? (
            !detection.isMobilePlatform ? (
                getItemActionsTemplate(props)
            ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
            )
        ) : (
            props.itemActionsTemplate
        );

    const multiSelectTemplate = React.forwardRef((multiSelectProps: TInternalProps, _) => {
        return <MultiSelect {...clearProps} attrs={multiSelectProps.attrs} />;
    });

    return createElement(contentTemplate, {
        ...clearProps,
        itemActionsTemplate,
        multiSelectTemplate,
    });
}

export default function DefaultTileItem(props: ITileItemProps): JSX.Element {
    const item = props.item;
    const onDeactivatedCallback = props.onDeactivatedCallback;
    const handlers = getItemEventHandlers(item, props);
    const attrs = item.getItemAttrs(props);
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback && onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );
    const className =
        props.item.getItemClasses(props) +
        props.item.getCursorClasses(props.cursor, props.clickable) +
        ` ${props.className || props.attrs?.className || ''}`;
    return (
        <FocusRoot
            as="div"
            ref={props.$wasabyRef}
            {...attrs}
            {...handlers}
            onDeactivated={onDeactivated}
            className={className}
            style={props.item.getItemStyles(props)}
        >
            <AutoResizer {...props} position={'item'} attrs={undefined} className={undefined} />
            <div
                className={props.item.getWrapperClasses(props)}
                style={props.item.getWrapperStyles(props.itemType)}
                data-qa={props.item.shouldDisplayMarker(props.marker) ? 'marked' : undefined}
            >
                <Marker {...props} attrs={undefined} className={undefined} />
                {props.item.shouldDisplayMultiSelectTemplate() && (
                    <MultiSelect {...props} attrs={undefined} className={undefined} />
                )}
                <Content {...props} attrs={undefined} className={undefined} />
                {props.itemActionsStyle === 'bottom' && <Title {...props} attrStyle={undefined} />}
                {getItemActionsResolverComponentIfNeed(props)}
                <FooterTemplate
                    {...props}
                    place={'wrapper'}
                    attrs={undefined}
                    className={undefined}
                />
            </div>
        </FocusRoot>
    );
}
