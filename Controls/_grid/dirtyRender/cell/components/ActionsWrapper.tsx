/*
 * Файл содержит компонент-обертку над опциями действий записи и вспомогательные методы и компоненты
 */
import * as React from 'react';
import {
    IItemActionsHandler,
    ItemActionsTemplateSelector,
    CollectionItemContext,
} from 'Controls/baseList';
import type { TItemActionsPosition, TItemActionsVisibility } from 'Controls/itemActions';
import type { TBackgroundStyle } from 'Controls/interface';
import { ItemActionsComponent, ItemActionsContext } from 'Controls/itemActions';

export interface IActionsWrapperProps {
    actionHandlers: IItemActionsHandler;
    backgroundStyle: TBackgroundStyle;
    hoverBackgroundStyle: TBackgroundStyle;
    actionsClassName: string;
    actionsVisibility: TItemActionsVisibility;
    highlightOnHover?: boolean;
    actionsPosition?: TItemActionsPosition;
}

/*
   Не должно быть этого враппера и контекста. Нужно переписать экшины, чтобы они не использовали CollectionItem
   и чтобы они принимали опции по контексту от BaseControl-а.
   Тогда этот файл можно будет удалить и в месте использования заменить на новый ItemActionsTemplate
 */
export default function ActionsWrapper(props: IActionsWrapperProps): React.ReactElement | null {
    const itemActionsContext = React.useContext(ItemActionsContext);
    const collectionItem = React.useContext(CollectionItemContext);
    const swipeAnimation = collectionItem.getSwipeAnimation();
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
                <ItemActionsComponent
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
                    itemActionsBackgroundStyle={props.backgroundStyle}
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
        props.backgroundStyle,
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
