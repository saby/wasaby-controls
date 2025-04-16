/*
import * as React from 'react';
import { createElement, delimitProps } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { FocusRoot } from 'UI/Focus';
import { detection } from 'Env/Env';

import { helpers } from 'Controls/listsCommonLogic';

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

    const actionsPosition = item.getItemActionsPosition();

    // Если itemActions вываодятся в произвольном месте, то в contentTemplate надо отдавать подготовленный шаблон.
    // в наши шаблоны просто прокидываем дальше props.itemActionsTemplate
    // @see Controls/_baseList/Render/ForReact.tsx#L79
    const itemActionsTemplate = React.useMemo(() => {
        return actionsPosition === 'custom'
            ? !detection.isMobilePlatform
                ? getItemActionsTemplate(props)
                : () => null
            : props.itemActionsTemplate;
    }, [
        props.itemActionsTemplate,
        actionsPosition,
        props.item,
        props.itemData,
        props.itemActionsTemplateMountedCallback,
        props.itemActionsTemplateUnmountedCallback,
        props.itemType,
        props.itemActionsClass,
        props.iconStyle,
        props.captionStyle,
        props.highlightOnHover,
        props.hoverBackgroundStyle,
        props.actionsVisibility,
        props.actionStyle,
        props.actionPadding,
        props.itemActionsPosition,
    ]);

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
    const handlers = helpers.events.getItemEventHandlers(item, props);
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
*/

import { IDefaultTileRenderProps } from 'Controls/_tileRender/interface/IDefaultRender';
import { Checkbox } from 'Controls/_tileRender/components/Checkbox';
import { Actions } from 'Controls/_tileRender/components/Actions';
import { Marker } from 'Controls/_tileRender/components/Marker';
import { Image } from 'Controls/_tileRender/item/content/Image';
import { Caption } from 'Controls/_tileRender/item/content/Caption';
import { IBorderProps, IRoundAnglesProps, IShadowProps } from 'Controls/interface';

function getContentClasses() {
    return '';
}

/**
 * Тут вызываются утилиты для вычисления классов на основе переданных props
 * @param props
 */
function getWrapperClasses<T extends IBorderProps & IShadowProps & IRoundAnglesProps>(props: T) {
    if (props.borderStyle) {
        return '';
    }

    return '';
}

export function DefaultTileRender(props: IDefaultTileRenderProps) {
    const {
        dataQa,

        // image
        imageSrc,
        imageRender,
        fallbackImage,
        imageClassName,
        imageFit,

        // caption
        caption,
        tooltip,

        // checkbox
        checkboxClassName,
        checkboxReadonly,
        checkboxVisibility,
        checkboxValue,

        // item actions
        actionsClassName,
        actionsPosition,
        actionsVisibility,
        actionStyle,

        // marker
        markerClassName,
        markerVisible,
        markerPosition,
        markerSize,

        // border
        borderStyle,
        borderVisibility,
        shadowVisibility,

        // round borders
        roundAngleBR,
        roundAngleTL,
        roundAngleTR,
        roundAngleBL,
    } = props;

    return (
        <div
            data-qa={dataQa}
            title={tooltip}
            className={getWrapperClasses({
                borderStyle,
                borderVisibility,
                shadowVisibility,
                roundAngleBL,
                roundAngleTR,
                roundAngleTL,
                roundAngleBR,
            })}
            style={props.style}
        >
            <Checkbox
                checkboxClassName={checkboxClassName}
                checkboxReadonly={checkboxReadonly}
                checkboxValue={checkboxValue}
                checkboxVisibility={checkboxVisibility}
            />
            <Actions
                actionsClassName={actionsClassName}
                actionsPosition={actionsPosition}
                actionStyle={actionStyle}
                actionsVisibility={actionsVisibility}
            />
            <Marker
                markerClassName={markerClassName}
                markerVisible={markerVisible}
                markerPosition={markerPosition}
                markerSize={markerSize}
            />
            <div className={getContentClasses()}>
                <Image
                    imageSrc={imageSrc}
                    imageRender={imageRender}
                    fallbackImage={fallbackImage}
                    imageClassName={imageClassName}
                    imageFit={imageFit}
                />
                <Caption caption={caption} />
            </div>
        </div>
    );
}
