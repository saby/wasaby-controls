/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { useFocusCallbacks } from 'UICore/Focus';
import { detection } from 'Env/Env';

import { getItemAttrs, getItemEventHandlers } from 'Controls/baseList';

import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import { AutoResizer } from 'Controls/_tile/render/itemComponents/AutoResizer';
import FooterTemplate from 'Controls/_tile/render/itemComponents/FooterTemplate';
import {
    getItemActionsResolverComponentIfNeed,
    getItemActionsTemplate,
} from 'Controls/_tile/render/itemComponents/ItemActions';

function Marker(props: ITileItemProps): JSX.Element {
    if (!props.item.shouldDisplayMarker(props.marker)) {
        return null;
    }

    let className = props.item.getTileMarkerClasses(
        props.itemType,
        props.markerSize
    );
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
            style: props.item.getMultiSelectStyles(
                props.itemType,
                props.attrs?.style
            ),
        }
    );
}

function Content(props: ITileItemProps): JSX.Element {
    const item = props.item || props.itemData;

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

    const multiSelectTemplate = React.forwardRef(
        (multiSelectProps: TInternalProps, _) => {
            return <MultiSelect {...props} attrs={multiSelectProps.attrs} />;
        }
    );

    return createElement(contentTemplate, {
        ...props,
        itemActionsTemplate,
        multiSelectTemplate,
    });
}

export default function DefaultTileItem(props: ITileItemProps): JSX.Element {
    const handlers = getItemEventHandlers(props.item, props);
    const attrs = getItemAttrs(props.item, props);
    const ref = useFocusCallbacks(
        {
            onDeactivated: (options) => {
                return (
                    props.onDeactivatedCallback &&
                    props.onDeactivatedCallback(props.item, options)
                );
            },
        },
        props.$wasabyRef as (element: HTMLElement) => void
    );
    const className =
        props.item.getItemClasses(props) +
        ` ${props.attrs?.className || ''}` +
        ` ${props.className || ''}`;
    return (
        <div
            ref={ref}
            {...attrs}
            {...handlers}
            className={className}
            style={props.item.getItemStyles(props)}
        >
            <AutoResizer
                {...props}
                position={'item'}
                attrs={undefined}
                className={undefined}
            />
            <div
                className={props.item.getWrapperClasses(props)}
                style={props.item.getWrapperStyles(props.itemType)}
                data-qa={
                    props.item.shouldDisplayMarker(props.marker)
                        ? 'marked'
                        : undefined
                }
            >
                <Marker {...props} attrs={undefined} className={undefined} />
                {props.item.shouldDisplayMultiSelectTemplate() && (
                    <MultiSelect
                        {...props}
                        attrs={undefined}
                        className={undefined}
                    />
                )}
                <Content {...props} attrs={undefined} className={undefined} />
                {getItemActionsResolverComponentIfNeed(props)}
                <FooterTemplate
                    {...props}
                    place={'wrapper'}
                    attrs={undefined}
                    className={undefined}
                />
            </div>
        </div>
    );
}
