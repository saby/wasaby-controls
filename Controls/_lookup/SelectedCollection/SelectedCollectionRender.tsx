import { TInternalProps } from 'UICore/Executor';
import {
    Component,
    forwardRef,
    MouseEventHandler,
    MouseEvent,
    ForwardedRef,
    useRef,
    useCallback,
    Fragment,
} from 'react';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import {
    default as itemTemplate,
    CrossTemplate,
} from 'Controls/_lookup/SelectedCollection/ItemTemplate';

export interface ISelectedCollectionOptions extends TInternalProps {
    theme?: string;
    itemsLayout?: string;
    collectionWidth?: number;
    counterAlignment?: string;
    counterVisibility?: string;
    inlineHeight?: string;
    collectionClass?: string;
    tabindex?: number;
    fontSize?: string;
    itemTemplate?: Component | TemplateFunction;
    visibleItems?: Model[];
    itemClickHandler?: (event: MouseEvent<HTMLSpanElement, MouseEvent>, item: Model) => void;
    openInfoBoxHandler?: MouseEventHandler<HTMLSpanElement>;
    fontColorStyle?: string;
    contentTemplate?: Component | TemplateFunction;
    counterTemplate?: Component | TemplateFunction;
    readOnly?: boolean;
    isSingleItem?: boolean;
    displayProperty?: string;
    backgroundStyle?: string;
    getItemOrder?: Function;
    getItemMaxWidth?: Function;
    getItemGridStyles?: Function;
    itemsCount?: number;
    items?: RecordSet;
    maxVisibleItems?: number;
    counterWidth?: number;
    multiLine?: boolean;
    needShowCounter?: boolean;
    counterClassName?: string;
}

function Counter(props: ISelectedCollectionOptions): JSX.Element {
    const { maxVisibleItems, readOnly, itemsLayout, visibleItems, multiLine, itemsCount } = props;
    const infoBoxRef = useRef(null);
    const infoBoxStyle = {
        order: props.getItemOrder(
            null,
            visibleItems.length,
            itemsLayout,
            !(readOnly && !maxVisibleItems)
        ),
    };
    const onClick = useCallback(() => {
        return props.openInfoBoxHandler(infoBoxRef.current);
    }, [infoBoxRef.current]);

    if (
        ((!multiLine && itemsLayout === 'oneRow') ||
            (itemsCount || props.items.getCount()) > maxVisibleItems) &&
        props.needShowCounter
    ) {
        return (
            <span
                ref={infoBoxRef}
                style={infoBoxStyle}
                className={`controls-SelectedCollection__InfoBox ${props.counterClassName}
                            ${
                                props.counterAlignment === 'right'
                                    ? 'controls-SelectedCollection__counter-singleLine'
                                    : ''
                            }
                            ${
                                props.itemsLayout === 'oneRow' && readOnly && !maxVisibleItems
                                    ? ' controls-SelectedCollection__InfoBox_fixed'
                                    : ''
                            }`}
                onClick={onClick}
            >
                <props.counterTemplate
                    multiLine={multiLine}
                    backgroundStyle={props.backgroundStyle}
                    itemsCount={itemsCount || props.items.getCount()}
                    fontSize={props.fontSize}
                    counterAlignment={props.counterAlignment}
                    counterVisibility={props.counterVisibility}
                    style={{
                        width: props.counterWidth ? `width: ${props.counterWidth}px` : null,
                    }}
                />
            </span>
        );
    }
    return null;
}

export function SelectedCollectionRenderWithoutHooks(
    props: ISelectedCollectionOptions & { onClick?: Function }
): JSX.Element {
    const visibleItems = () => {
        return props.visibleItems.map((item, index) => {
            const itemTemplateStyle = {
                order: props.getItemOrder(index, props.visibleItems.length, props.itemsLayout),
                maxWidth: props.getItemMaxWidth(
                    index,
                    props.itemsCount || props.items.getCount(),
                    props.maxVisibleItems,
                    props.itemsLayout,
                    props.counterWidth
                ),
                ...props.getItemGridStyles(index, props.itemsLayout),
            };

            return (
                // Т.к. props.itemTemplate является wasaby-шаблоном, на нем не работает задание ключа key.
                // Чтобы не оборачивать в лишний div, используем Fragment
                <Fragment key={item.getKey()}>
                    <props.itemTemplate
                        className={`js-controls-SelectedCollection__item controls-SelectedCollection__item 
                                    controls-SelectedCollection__collectionItem_layout_${props.itemsLayout}`}
                        style={itemTemplateStyle}
                        item={item}
                        displayProperty={props.displayProperty}
                        caption={props.displayProperty ? item.get(props.displayProperty) : null}
                        isSingleItem={props.isSingleItem}
                        isLastItem={props.visibleItems.length === index + 1}
                        readOnly={props.readOnly}
                        itemsLayout={props.itemsLayout}
                        theme={props.theme}
                        onClick={(e) => {
                            return props.onClick(e, item);
                        }}
                        fontColorStyle={props.fontColorStyle}
                        crossTemplate={CrossTemplate}
                        data-qa="SelectedCollection__item"
                    />
                </Fragment>
            );
        });
    };

    const fontSizeClass = `controls-SelectedCollection__collection_${
        props.itemsLayout !== 'oneRow' ? 'multiLine' : 'singleLine'
    }_fontSize-${props.fontSize || 'm'}`;
    const itemsLayoutClass = `controls-SelectedCollection__collection_${
        props.itemsLayout !== 'oneRow' ? 'multiLine' : 'singleLine'
    }`;
    const counterVisibilityClass = `${
        props.counterVisibility === 'hidden' && props.itemsLayout === 'oneRow'
            ? 'controls-SelectedCollection__collection-container_hidden-counter'
            : ''
    }`;
    const singleSelectClass = `${
        props.visibleItems.length === 1
            ? 'controls-SelectedCollection__collection-singleSelect'
            : ''
    }`;

    const inlineHeightClass = `${
        props.inlineHeight
            ? 'controls-SelectedCollection__collection_lineheight-' + props.inlineHeight
            : ''
    }`;
    const itemsContainerCounterVisibilityClass = `${
        props.counterVisibility === 'hidden' && props.itemsLayout === 'oneRow'
            ? 'controls-SelectedCollection__itemsContainer_hidden-counter'
            : ''
    }`;
    const itemsContainerItemsLayoutClass = `controls-SelectedCollection__collection-${props.itemsLayout}`;

    return (
        <div
            className={`controls_lookup_theme-${props.theme} ${props.attrs?.className}
            controls-SelectedCollection__collection-container
            controls-SelectedCollection__collection-container_${
                props.itemsLayout !== 'oneRow' ? 'multiLine' : 'singleLine'
            }
            ${
                props.visibleItems.length === 1
                    ? 'controls-SelectedCollection__collection-container-singleSelect'
                    : ''
            }`}
            style={{
                minWidth: `${props.collectionWidth}px`,
                maxWidth: `${props.collectionWidth}px`,
            }}
            ref={props.forwardedRef}
            data-qa={props.attrs?.['data-qa']}
        >
            <div
                className={`controls-SelectedCollection__collection
                ${fontSizeClass}
                ${counterVisibilityClass}
                ${itemsLayoutClass}
                ${singleSelectClass}
                ${props.collectionClass}`}
                tabIndex={props.tabindex}
            >
                {props.counterAlignment === 'left' ? <Counter {...props} /> : ''}
                <div
                    className={`controls-SelectedCollection__itemsContainer
                ${itemsContainerItemsLayoutClass}
                ${inlineHeightClass}
                ${itemsContainerCounterVisibilityClass}`}
                >
                    {visibleItems()}
                </div>
            </div>
            {props.counterAlignment === 'right' ? <Counter {...props} /> : null}
        </div>
    );
}

function SelectedCollectionRender(
    props: ISelectedCollectionOptions,
    ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
    const onClick = useCallback((e, item) => {
        return props.itemClickHandler(e, item);
    }, []);

    return <SelectedCollectionRenderWithoutHooks {...props} onClick={onClick} forwardedRef={ref} />;
}

const forwardedComponent = forwardRef(SelectedCollectionRender);

forwardedComponent.defaultProps = {
    itemTemplate,
    itemsLayout: 'default',
    backgroundStyle: 'default',
    counterAlignment: 'left',
};

export default forwardedComponent;