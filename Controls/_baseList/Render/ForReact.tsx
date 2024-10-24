/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';

import { TemplateFunction } from 'UICommon/Base';
import { TInternalProps } from 'UICore/executor';
import { createElement, delimitProps } from 'UICore/Jsx';
import { detection } from 'Env/Env';
import { Model } from 'Types/entity';

import { Collection, CollectionItem } from 'Controls/display';
import type { IItemAction } from 'Controls/itemActions';
import {
    IItemTemplateProps,
    TItemDeactivatedHandler,
    TItemEventHandler,
} from 'Controls/_baseList/ItemComponent';
import { getItemActionsTemplate } from 'Controls/_baseList/Render/ItemActions';
import type { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';

export interface IForProps extends TInternalProps, IItemActionsHandler {
    collection: Collection;

    itemTemplate: TemplateFunction | React.Component | React.FunctionComponent;
    groupTemplate: TemplateFunction | React.Component | React.FunctionComponent;

    keyPrefix: string;
    style: string;
    theme: string;
    readOnly: boolean;

    itemActionsClass: string;

    subPixelArtifactFix: boolean;
    pixelRatioBugFix: boolean;
    stickyCallback: Function;
    itemTemplateOptions: object;

    _onBreadcrumbClick: Function;
    _onBreadcrumbItemClick: Function;
    _showOnlyFixedColumns?: boolean;

    onItemMouseEnterCallback: TItemEventHandler;
    onItemMouseLeaveCallback: TItemEventHandler;
    onItemMouseMoveCallback: TItemEventHandler;
    onItemMouseDownCallback: TItemEventHandler;
    onItemMouseUpCallback: TItemEventHandler;
    onItemClickCallback: TItemEventHandler;
    onItemDeactivatedCallback: TItemDeactivatedHandler;
    onItemContextMenuCallback: TItemEventHandler;
    onItemSwipeCallback: TItemEventHandler;
    onItemLongTapCallback: TItemEventHandler;
    onItemWheelCallback: TItemEventHandler;
    onItemTouchMoveCallback?: TItemEventHandler;
    onItemTouchStartCallback?: TItemEventHandler;
    onItemTouchEndCallback?: TItemEventHandler;
    onTagClick?: (
        event: React.BaseSyntheticEvent,
        item: CollectionItem,
        columnIndex: number
    ) => void;
    onTagHover?: (
        event: React.BaseSyntheticEvent,
        item: CollectionItem,
        columnIndex: number
    ) => void;
    getItemTemplateProps?: (item: Model) => IItemTemplateProps;
}

interface IItemTemplateWrapperProps {
    itemTemplate: React.FunctionComponent;
    itemProps: IItemTemplateProps;
    context: Record<string, unknown>;
}

// Делаем первый слой реактовским, чтобы корректно повесился ключ на элемент и не было лишних перерисовок
// Плашка с операциями для свайпа всегда рисуется в месте, предусмотренном платформой.
// Поэтому на мобильных устройствах принудительно возвращаем тут пустой блок.
// Нет смысла проверять в этом месте на shouldDisplaySwipeTemplate, т.к. на
// тач устройствах getItemActionsTemplate вызывается при отрисовке,
// когда запись ещё не свайпнута,
// ни одной операции над записью в записи нет, и даже не понятно,
// находимся ли мы в режиме тач, потому что ни одного действия с экраном
// или мышью ещё не производили.
// Единственный способ проверки - на мобильную платформу.
// В любом другом случае для кастомно расположенных операций над записью получим
// либо двойную отрисовку (свайп + ховер с битыми иконками) либо такие непредсказуемые
// вещи, как перебитие одного колбека состояния другим (ховер может перебить свайп).
// Возможно, надо добавлять хук, который позволит подписаться на обновление записи,
// и изменить текущий способ отрисовки операций над записью.
function ItemTemplateWrapper(props: IItemTemplateWrapperProps): React.ReactElement {
    const itemProps = props.itemProps;
    const isEditing = itemProps.item.isEditing();
    itemProps.itemActionsTemplate = React.useMemo(() => {
        return !detection.isMobilePlatform || itemProps.actionsVisibility === 'visible' || isEditing
            ? getItemActionsTemplate(itemProps)
            : null;
    }, [
        itemProps.item,
        itemProps.itemActionsTemplateMountedCallback,
        itemProps.itemActionsTemplateUnmountedCallback,
        itemProps.itemActionsClass,
        itemProps.hoverBackgroundStyle,
        itemProps.actionsVisibility,
        itemProps.highlightOnHover,
        isEditing,
    ]);
    // нужно переходить на tsx-синтаксис, что бы самим не объединять атрибуты
    let attrs;
    if (itemProps.className) {
        attrs = { class: itemProps.className };
    }
    if (itemProps.className && itemProps.attrs && itemProps.attrs.class) {
        attrs = { class: itemProps.attrs.class + itemProps.className };
    }
    return createElement(props.itemTemplate, itemProps, attrs);
}

const ItemTemplateWrapperMemo = React.memo(ItemTemplateWrapper, itemTemplateWrapperPropsAreEqual);

export function itemPropsAreEqual(
    prevProps: IItemTemplateProps,
    nextProps: IItemTemplateProps
): boolean {
    // itemActionsTemplateMountedCallback и itemActionsTemplateUnmountedCallback - нужны для кейса,
    // когда пересоздался itemActions:Controller
    return (
        prevProps.itemVersion === nextProps.itemVersion &&
        prevProps.item === nextProps.item &&
        prevProps.className === nextProps.className &&
        !(
            prevProps.itemActionsTemplateMountedCallback === undefined &&
            prevProps.itemActionsTemplateMountedCallback !==
                nextProps.itemActionsTemplateMountedCallback
        ) &&
        !(
            prevProps.itemActionsTemplateUnmountedCallback === undefined &&
            prevProps.itemActionsTemplateUnmountedCallback !==
                nextProps.itemActionsTemplateUnmountedCallback
        ) &&
        prevProps.backgroundColorStyle === nextProps.backgroundColorStyle &&
        prevProps.cursor === nextProps.cursor &&
        prevProps.fontColorStyle === nextProps.fontColorStyle &&
        prevProps.fontSize === nextProps.fontSize &&
        prevProps.fontWeight === nextProps.fontWeight &&
        prevProps.highlightOnHover === nextProps.highlightOnHover &&
        prevProps.tagStyle === nextProps.tagStyle &&
        prevProps.baseline === nextProps.baseline &&
        prevProps.borderStyle === nextProps.borderStyle &&
        prevProps.borderVisibility === nextProps.borderVisibility &&
        prevProps.displayProperty === nextProps.displayProperty &&
        prevProps.shadowVisibility === nextProps.shadowVisibility &&
        prevProps.itemActionsClass === nextProps.itemActionsClass &&
        prevProps.marker === nextProps.marker &&
        prevProps.markerClassName === nextProps.markerClassName &&
        prevProps.shadowVisibility === nextProps.shadowVisibility &&
        prevProps.markerSize === nextProps.markerSize &&
        prevProps.readOnly === nextProps.readOnly &&
        prevProps.actionsVisibility === nextProps.actionsVisibility
    );
}

function itemTemplateWrapperPropsAreEqual(
    prevProps: IItemTemplateWrapperProps,
    nextProps: IItemTemplateWrapperProps
) {
    return (
        prevProps.itemTemplate === nextProps.itemTemplate &&
        itemPropsAreEqual(prevProps.itemProps, nextProps.itemProps)
    );
}

export default class For extends React.Component<IForProps> {
    protected _getItemProps(item: CollectionItem): IItemTemplateProps {
        let itemTemplateOptions = item.getItemTemplateOptions();
        // Суть проблемы - при достаточно крупных изменениях (много опций во многих контролах) React
        // считает что нужна не просто перерисовка, а буквально полное пересоздание шаблонов.
        // Редактирование по месту в таком случае теряет фокус.
        // Наиболее правильным было бы убрать перерисовки.
        // Но, при динамически рассчитываемых опциях шаблона сделать такое невозможно, т.к.
        // itemTemplate задаётся внутри wml, а значит перерисовки неизбежны.
        // Поэтому добавил getItemTemplateProps, как временное решение до полного перехода на React.
        // Он позволяет не задавать itemTemplate для того, чтобы динамически передать опции шаблону.
        // https://online.sbis.ru/opendoc.html?guid=ddc26de2-a646-401f-8632-d4cdc322230e&client=3
        if (this.props.getItemTemplateProps instanceof Function) {
            itemTemplateOptions = {
                ...itemTemplateOptions,
                ...this.props.getItemTemplateProps(item.contents),
            };
        }
        return {
            ...itemTemplateOptions,
            itemVersion: item.getVersion(),
            item,
            itemData: item,
            keyPrefix: this.props.keyPrefix,
            style: this.props.style,
            className: item.getAnimationClassName() || undefined,
            theme: this.props.theme,
            readOnly: this.props.readOnly,
            faded: item.isFaded() || item.isDragged(),
            stickyCallback: this.props.stickyCallback,
            actionsPosition: this.props.collection.getItemActionsPosition(),
            actionsVisibility: this.props.collection.getActionsVisibility(),
            actionsDisplayDelay: this.props.collection.getActionsDisplayDelay(),
            checkboxVisibility: this.props.collection.getMultiSelectVisibility(),
            checkboxValue: item.isSelected(),
            markerVisible: item.isMarked(),
            actions: item.getActions() ? (item.getActions().showed as IItemAction[]) : null,
            itemActionsClass: this.props.itemActionsClass,
            roundAngleBL: this.props.collection.getRoundAngleBL(),
            roundAngleBR: this.props.collection.getRoundAngleBR(),
            roundAngleTL: this.props.collection.getRoundAngleTL(),
            roundAngleTR: this.props.collection.getRoundAngleTR(),
            caption: item.getDisplayValue(),

            _showOnlyFixedColumns: this.props._showOnlyFixedColumns,

            onTagClick: this.props.onTagClick,
            onTagHover: this.props.onTagHover,

            onMouseEnterCallback: this.props.onItemMouseEnterCallback,
            onMouseLeaveCallback: this.props.onItemMouseLeaveCallback,
            onMouseMoveCallback: this.props.onItemMouseMoveCallback,
            onMouseDownCallback: this.props.onItemMouseDownCallback,
            onMouseUpCallback: this.props.onItemMouseUpCallback,
            onClickCallback: this.props.onItemClickCallback,
            onDeactivatedCallback: this.props.onItemDeactivatedCallback,
            onContextMenuCallback: this.props.onItemContextMenuCallback,
            onSwipeCallback: this.props.onItemSwipeCallback,
            onLongTapCallback: this.props.onItemLongTapCallback,
            onWheelCallback: this.props.onItemWheelCallback,
            onItemTouchMoveCallback: this.props.onItemTouchMoveCallback,
            onTouchStart: this.props.onItemTouchStartCallback,
            onTouchEnd: this.props.onItemTouchEndCallback,

            onActionsMouseEnter: this.props.onActionsMouseEnter,
            onActionMouseDown: this.props.onActionMouseDown,
            onActionMouseUp: this.props.onActionMouseUp,
            onActionMouseEnter: this.props.onActionMouseEnter,
            onActionMouseLeave: this.props.onActionMouseLeave,
            onActionClick: this.props.onActionClick,
            onItemActionSwipeAnimationEnd: this.props.onItemActionSwipeAnimationEnd,
            itemActionsTemplateMountedCallback: this.props.itemActionsTemplateMountedCallback,
            itemActionsTemplateUnmountedCallback: this.props.itemActionsTemplateUnmountedCallback,

            _onBreadcrumbClick: this.props._onBreadcrumbClick,
            _onBreadcrumbItemClick: this.props._onBreadcrumbItemClick,
        };
    }

    render() {
        const { context } = delimitProps(this.props);

        const itemTemplates = [];

        const viewIterator = this.props.collection.getViewIterator();
        viewIterator.each((item, index) => {
            // TODO когда удалим старый for можно будет и опцию userGroupTemplate удалить
            const itemTemplate = item.getTemplate(
                this.props.collection.getItemTemplateProperty(),
                this.props.itemTemplate,
                this.props.groupTemplate
            );

            const itemProps: IItemTemplateProps = this._getItemProps(item);
            itemProps.className =
                (itemProps.className || '') +
                (viewIterator.isItemAtIndexHidden(index) ? ' ws-hidden' : '');

            itemTemplates.push(
                <ItemTemplateWrapperMemo
                    key={(item?.isAdd ? 'adding-' : '') + item.key}
                    itemTemplate={itemTemplate}
                    itemProps={itemProps}
                    context={context}
                />
            );
        });

        return itemTemplates;
    }
}
