/*
 * Файл содержит компонент-обертку над опциями действий записи и вспомогательные методы и компоненты
 */
import * as React from 'react';
import type { IItemActionsHandler } from 'Controls/baseList';
import {
    CollectionItemContext,
    ItemActionsTemplateSelector,
    ICollectionItemContextValue,
} from 'Controls/listsCommonLogic';
import {
    ToolbarChooser as ActionsToolbarChooser,
    ItemActionsContext,
    TItemActionsPosition,
    TItemActionsVisibility,
} from 'Controls/itemActions';
import type { TBackgroundStyle } from 'Controls/interface';

export interface IActionsWrapperProps {
    actionHandlers?: IItemActionsHandler;
    backgroundStyle?: TBackgroundStyle;
    hoverBackgroundStyle?: TBackgroundStyle;
    actionsClassName?: string;
    actionsVisibility?: TItemActionsVisibility;
    highlightOnHover?: boolean;
    actionsPosition?: TItemActionsPosition;
}

/*
   Не должно быть этого враппера и контекста. Нужно переписать экшины, чтобы они не использовали CollectionItem
   и чтобы они принимали опции по контексту от BaseControl-а.
   Тогда этот файл можно будет удалить и в месте использования заменить на новый ItemActionsTemplate
 */
export default function Actions(props: IActionsWrapperProps): React.ReactElement | null {
    const itemActionsContext = React.useContext(ItemActionsContext);
    const { item: collectionItem } = React.useContext(
        CollectionItemContext
    ) as ICollectionItemContextValue;
    const swipeAnimation = collectionItem.getSwipeAnimation();
    const backgroundStyle = props.backgroundStyle || 'default';
    const render = React.useMemo(() => {
        if (!collectionItem || props.actionsVisibility === 'hidden') {
            return null;
        }

        // Установка фона записей явно слишком сложная, нужно её упрощать.
        // 1. Т.к. опции записи видимы обычно по ховеру, то и цвет их должен соответствовать ховеру.
        // 2. При отсутствии подсветки ховера цвет не должен быть прозрачным, а должен совпадать с цветом записи.
        // 3. Если опции записи видимы всегда, то нужно показывать их фон в соответствии с backgroundStyle.
        // * hoverBackgroundStyle ставится none если highlightOnHover===false и props.actionsPosition не outside
        // * backgroundStyle равно backgroundColorStyle или backgroundStyle или default
        // TODO надо объединить backgroundStyle в одну опцию, иначе никто никогда не раскурит это.
        const hoverBackgroundStyle =
            props.actionsPosition === 'outside' || props.highlightOnHover !== false
                ? props.hoverBackgroundStyle
                : 'none';

        const actions = collectionItem?.getActions()?.all;
        if (actions && itemActionsContext && itemActionsContext.actionsInitialized) {
            return (
                <ActionsToolbarChooser
                    actions={actions}
                    hoverBackgroundStyle={hoverBackgroundStyle}
                    itemActionsClass={props.actionsClassName}
                    actionsVisibility={props.actionsVisibility}
                />
            );
        } else {
            return (
                <ItemActionsTemplateSelector
                    {...props.actionHandlers}
                    item={collectionItem}
                    highlightOnHover={hoverBackgroundStyle !== 'none'}
                    itemActionsBackgroundStyle={backgroundStyle}
                    hoverBackgroundStyle={hoverBackgroundStyle}
                    itemActionsClass={props.actionsClassName}
                    actionsVisibility={props.actionsVisibility}
                    itemActionsPosition={props.actionsPosition}
                />
            );
        }
    }, [
        collectionItem,
        swipeAnimation,
        backgroundStyle,
        props.hoverBackgroundStyle,
        props.actionsClassName,
        props.actionsVisibility,
        props.actionHandlers,
        itemActionsContext,
        props.actionsPosition,
        props.highlightOnHover,
    ]);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{render}</>;
}
