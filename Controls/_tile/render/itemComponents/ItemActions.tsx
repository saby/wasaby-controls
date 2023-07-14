/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { detection } from 'Env/Env';
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import { IItemActionsTemplateProps, TItemActionsPosition } from 'Controls/itemActions';
import {
    extractSwipeActionProps,
    HoverActionsTemplate,
    IHoverActionsTemplateProps,
    SwipeActionsTemplate,
} from 'Controls/baseList';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import type { TTileItem } from '../../display/mixins/TileItem';
import type { default as TileItem } from '../../display/TileCollectionItem';

interface ITileItemActionsComponentProps
    extends IHoverActionsTemplateProps,
        IItemActionsTemplateProps {
    item: TileItem;
    itemType: TTileItem;
    itemActionsPosition: TItemActionsPosition;
    itemActionsTemplate: Function;
    swipeTemplate?: Function;
    shouldDisplayHoverActions?: boolean;
    shouldDisplaySwipeActions?: boolean;
}

// Возвращает функцию для вставки в прикладном коде.
// Функция принимает опции для шаблона операций над записью
export function getItemActionsTemplate(props: ITileItemProps): React.ExoticComponent {
    return React.forwardRef(
        (
            itemActionsProps: TInternalProps<ITileItemActionsComponentProps>,
            ref: React.ForwardedRef<HTMLDivElement>
        ) => {
            const item = props.item || props.itemData;
            const [itemActions, setItemActions] = React.useState(item.getActions()?.showed || []);

            React.useLayoutEffect(() => {
                props.itemActionsTemplateMountedCallback?.(item, setItemActions);
                return () => {
                    props.itemActionsTemplateUnmountedCallback?.(item);
                };
            }, [
                props.itemActionsTemplateMountedCallback,
                props.itemActionsTemplateUnmountedCallback,
            ]);

            const itemActionsClass = props.item.getItemActionsClasses(
                props.itemType,
                itemActionsProps.itemActionsClass || props.itemActionsClass
            );
            const iconStyle =
                props.iconStyle ?? (props.itemType === 'rich' ? 'default' : undefined);
            // Большинство пропсов берётся из скоупа именно шаблона записи, а не itemActionsTemplate
            return (
                <HoverActionsTemplate
                    ref={ref}
                    {...props}
                    item={item}
                    showedActions={itemActions}
                    itemActionsClass={itemActionsClass}
                    highlightOnHover={props.highlightOnHover}
                    hoverBackgroundStyle={props.hoverBackgroundStyle}
                    actionsVisibility={props.actionsVisibility}
                    iconStyle={iconStyle}
                    actionMode={props.item.getActionMode(props.itemType)}
                    actionStyle={props.actionStyle}
                    actionPadding={props.actionPadding || itemActionsProps.actionPadding}
                    itemActionsBackgroundStyle={
                        itemActionsProps.itemActionsBackgroundStyle || 'transparent'
                    }
                    attrs={{
                        ...itemActionsProps.attrs,
                        'data-qa': 'controls-TileView__previewTemplate_itemActions_node',
                    }}
                />
            );
        }
    );
}

// Если рендерится HoverActionsTemplate или SwipeActionsTemplate, то ОБЯЗАТЕЛЬНО
// вызываем itemActionsTemplateMountedCallback для всех элементов из текущего диапазона.
// Если этого не происходит, то скорее всего возникла ошибка и у нас что-то не работает.
export function ItemActionsResolverComponent(
    props: ITileItemActionsComponentProps
): React.ReactElement {
    const item = props.item;

    const shouldDisplayHoverActions = item.shouldDisplayTileItemActions(
        props.itemType,
        props.itemActionsPosition,
        'wrapper'
    );
    const shouldDisplaySwipeActions = item.shouldDisplaySwipeTemplate();

    // В превью темплейте itemActions должны показываться внутри блока с названием
    // На свайпе вообще всегда надо вызывать этот шаблон. Кроме того, рендерить
    // резолвер надо до того, как запись пометилась isSwiped,
    // иначе для он 'preview' никогда не вызовется и операции над записью будут всегда пустые.
    const [itemActions, setItemActions] = React.useState(item.getActions()?.showed || []);
    React.useLayoutEffect(() => {
        props.itemActionsTemplateMountedCallback?.(item, setItemActions);
        return () => {
            props.itemActionsTemplateUnmountedCallback?.(item);
        };
    }, [
        props.itemActionsTemplateMountedCallback,
        props.itemActionsTemplateUnmountedCallback,
        item,
    ]);
    if (shouldDisplayHoverActions) {
        const itemActionsClass = item.getItemActionsClasses(props.itemType, props.itemActionsClass);
        return (
            <HoverActionsTemplate
                {...props}
                showedActions={itemActions}
                itemActionsClass={itemActionsClass}
                iconStyle={props.itemType === 'rich' ? 'default' : undefined}
                actionMode={item.getActionMode(props.itemType)}
                attrs={{
                    ...props.attrs,
                    'data-qa': 'controls-TileView__previewTemplate_itemActions_node',
                }}
            />
        );
    } else if (shouldDisplaySwipeActions) {
        return (
            <SwipeActionsTemplate
                item={item}
                showedActions={itemActions}
                {...extractSwipeActionProps(props)}
            />
        );
    }
    return null;
}

// Функция, которая разруливает необходимость рендеринга компонентов операций над записью и
// возвращает или компоненты или null, в зависимости от условий.
export function getItemActionsResolverComponentIfNeed(
    props: ITileItemActionsComponentProps
): React.ReactElement {
    if (
        !TouchDetect.getInstance().isTouch() &&
        !props.item.shouldDisplaySwipeTemplate() &&
        (props.item.getItemActionsPosition() === 'custom' || props.itemType === 'preview')
    ) {
        return null;
    }

    return <ItemActionsResolverComponent {...props} attrs={undefined} />;
}

// Рендерит для плитки контрол с операциями над записью
export const ItemActionsControl = React.memo(function ItemActionsControl(props: ITileItemProps): React.ReactElement {
    const shouldDisplay = props.item.shouldDisplayTileItemActions(
        props.itemType,
        props.itemActionsPosition,
        'title'
    );
    const itemActionsControl = props.item.getItemActionsControl(props.itemType);
    if (!shouldDisplay || !itemActionsControl) {
        return null;
    }

    const actionStyle =
        !props.titleStyle || props.titleStyle === 'light' ? 'tileLight' : 'tileDark';
    // @see Controls/_baseList/Render/ForReact.tsx#L79
    const controlContent =
        !detection.isMobilePlatform || props.item.isEditing()
            ? getItemActionsTemplate({
                  ...props,
                  actionPadding: props.item.getActionPadding(props.itemType),
                  actionStyle,
                  iconStyle: actionStyle,
                  highlightOnHover: false,
              })
            : null;
    return createElement(itemActionsControl, {
        item: props.item,
        content: controlContent,
    });
});
