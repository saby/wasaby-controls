/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import { createElement, wasabyAttrsToReactDom, delimitProps } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';

import { StickyBlock } from 'Controls/stickyBlock';
import { GroupItem, GroupMixin } from 'Controls/display';

import { IBaseGroupTemplate } from 'Controls/_baseList/interface/BaseGroupTemplate';
import { getItemEventHandlers, IItemEventHandlers } from 'Controls/_baseList/ItemComponent';

export interface IGroupContentProps extends IBaseGroupTemplate {
    group: GroupMixin;
    item: GroupItem;
    highlightedValue?: string;
    wasabyContext?: unknown;
    customTemplateProps?: object;
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
    className?: string;
    // Дополнительное условие показа шаблона справа. Применяется в гриде при скролле колонок
    rightTemplateCondition?: boolean;
    // Растягивание шаблона справа.  Применяется в гриде при скролле колонок
    rightTemplateStretch?: boolean;
}

interface IGroupProps extends IGroupContentProps, TInternalProps {
    itemData: GroupItem;
}

export interface IGroupTemplateProps extends IGroupProps, IItemEventHandlers {
    subPixelArtifactFix: boolean;
    pixelRatioBugFix: boolean;
}

// пропсы, которые StickyBlock передаёт в контент
interface IStickyBlockContentProps {
    // Если группа зафиксирована, то значение будет её позиция, иначе пустая строка
    isHeaderFixed?: string;
}

function ContentComponent(props: IGroupContentProps & IStickyBlockContentProps) {
    // Модель группы и модель записи могут быть разными моделями
    const group = props.group;
    const item = props.item;
    const displayText = props.textVisible !== false;
    const hasRightTemplate = !!props.rightTemplate && props.rightTemplateCondition !== false;

    let leftSeparator = null;
    if (
        group.shouldDisplayLeftSeparator(
            props.separatorVisibility,
            props.textVisible,
            props.textAlign
        )
    ) {
        const leftSeparatorClasses =
            'controls-ListView__groupSeparator controls-ListView__groupSeparator-left';
        leftSeparator = <div className={leftSeparatorClasses}>&nbsp;</div>;
    }

    let rightSeparator = null;
    if (
        group.shouldDisplayRightSeparator(
            props.separatorVisibility,
            props.textVisible,
            props.textAlign
        )
    ) {
        const rightSeparatorClasses =
            'controls-ListView__groupSeparator' +
            `${displayText ? ' controls-ListView__groupSeparator-right' : ''}`;
        rightSeparator = <div className={rightSeparatorClasses}>&nbsp;</div>;
    }

    let content = null;
    if (displayText) {
        const contentTextWrapperClasses =
            group.getContentTextWrapperClasses(
                props.fontColorStyle,
                props.fontSize,
                props.fontWeight,
                props.textTransform,
                props.separatorVisibility
            ) +
            ' ' +
            group.getBaseLineClasses(props.fontSize);
        const contentTextClasses =
            group.getContentTextClasses(props.textAlign) +
            ' ' +
            group.getExpanderClasses(
                props.expanderVisible,
                props.expanderAlign,
                props.iconSize,
                props.iconStyle
            );
        content = (
            <div className={contentTextWrapperClasses}>
                <div className={contentTextClasses} data-qa={`${item.listElementName}-expander`}>
                    {!!props.contentTemplate ? (
                        <props.contentTemplate
                            {...props.customTemplateProps}
                            item={props.item}
                            itemData={props.item}
                            highlightedValue={props.highlightedValue}
                            isHeaderFixed={props.isHeaderFixed}
                        />
                    ) : (
                        item.getContents()
                    )}
                </div>
            </div>
        );
    }

    let rightTemplate = null;
    if (hasRightTemplate) {
        let rightTemplateClasses =
            'controls-ListView__groupContent-rightTemplate ' +
            group.getGroupPaddingClasses('right');

        if (
            props.rightTemplateStretch ||
            (props.separatorVisibility === false && props.textVisible === false)
        ) {
            rightTemplateClasses += ' tw-flex-grow controls-ListView__groupContent_right';
        }

        rightTemplate = (
            <div className={rightTemplateClasses}>
                <props.rightTemplate item={item} itemData={item} />
            </div>
        );
    }

    let wrapperClasses =
        'controls-ListView__groupContent controls-ListView__groupContent_height' +
        (props.expanderVisible === false ? ' controls-ListView__groupContent_cursor-default' : '') +
        ` ${group.getGroupPaddingClasses('left')}`;
    if (!hasRightTemplate) {
        wrapperClasses += ` ${group.getGroupPaddingClasses('right')}`;
    }
    if (!props.item.isFirstItem() && props.separatorVisibility !== false) {
        wrapperClasses += ` controls-ListView__groupContent_${props.item.getStyle()}`;
    }
    if (props.className) {
        wrapperClasses += ` ${props.className}`;
    }

    return (
        <div className={wrapperClasses} ref={props.forwardedRef}>
            {leftSeparator}
            {content}
            {rightSeparator}
            {rightTemplate}
        </div>
    );
}

/**
 * Мемоизированный компонент содержимого группы.
 * ref прокидывается до div при помощи пропса forwardedRef.
 */
export const Content = React.memo(ContentComponent);

/**
 * Мемоизированная запись группы плоского списка
 */
const Group = React.memo(function Group(props: IGroupProps & IStickyBlockContentProps) {
    const item = props.item || props.itemData;
    const handlers: Partial<React.DOMAttributes<HTMLDivElement>> = getItemEventHandlers(
        item,
        props
    );
    const itemClasses =
        (item.isHiddenGroup() ? 'controls-ListView__groupHidden ' : 'controls-ListView__group ') +
        (props.className || props.attrs?.className || '');
    const attributes = wasabyAttrsToReactDom(props.attrs || {});
    const { $wasabyRef } = delimitProps(props);
    return (
        <div
            key={'content_' + props.item.key}
            {...attributes}
            {...handlers}
            className={itemClasses}
            ref={$wasabyRef}
        >
            <ContentComponent {...props} className={null} group={item} item={item} />
        </div>
    );
});

export default React.memo((props: IGroupTemplateProps) => {
    const { clearProps, $wasabyRef, userAttrs, context } = delimitProps(props);

    const item = props.item || props.itemData;
    const className = 'controls-ListView__itemV ' + (props.className || userAttrs.className || '');
    const attrs = {
        'attr-data-qa': `key-${item.key}`,
        'item-key': item.itemKeyAttribute,
        'data-qa': userAttrs['data-qa'] || item.listElementName,
        style: wasabyAttrsToReactDom(userAttrs).style,
    };

    if (item.isSticked()) {
        return createElement(
            StickyBlock,
            {
                subPixelArtifactFix: props.subPixelArtifactFix,
                pixelRatioBugFix: props.pixelRatioBugFix,
                backgroundStyle: props.item.getBackgroundStyle(),
                fixedZIndex: 3,
                content: (contentProps: IStickyBlockContentProps) => {
                    return (
                        <Group
                            key={item.key}
                            {...clearProps}
                            isHeaderFixed={contentProps.isHeaderFixed}
                            attrs={contentProps.attrs}
                            wasabyContext={context}
                        />
                    );
                },
                $wasabyRef,
            },
            {
                ...attrs,
                class: className + ' controls-ListView__group',
                style: props.attrs.style,
            }
        );
    } else {
        return (
            <Group
                {...clearProps}
                className={className}
                attrs={attrs}
                $wasabyRef={$wasabyRef}
                wasabyContext={context}
            />
        );
    }
});

/**
 * Шаблон, который по умолчанию используется для отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в {@link Controls/list:View плоских списках}, {@link Controls/tree:View дереве Без колонок} и {@link Controls/tile:View плитке}.
 *
 * @class Controls/_baseList/GroupTemplate
 * @implements Controls/list:IBaseGroupTemplate
 * @see Controls/interface/IGroupedList#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-16]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/list:GroupTemplate"
 *          separatorVisibility="{{ false }}"
 *          expanderVisible="{{ false }}"
 *          textAlign="left"
 *          fontSize="xs"
 *          iconSize="m"
 *          scope="{{groupTemplate}}">
 *          <ws:contentTemplate>
 *             <ws:if data="{{contentTemplate.item.contents === 'nonexclusive'}}">Неисключительные права</ws:if>
 *             <ws:if data="{{contentTemplate.item.contents === 'works'}}">Работы</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/ здесь}.
 * @public
 */
