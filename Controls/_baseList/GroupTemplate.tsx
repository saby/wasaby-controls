/**
 * @kaizen_zone 1889d83a-b7c4-4a26-8824-ae82de6d5a77
 */
import * as React from 'react';

import { createElement, wasabyAttrsToReactDom, delimitProps } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';

import { StickyBlock } from 'Controls/stickyBlock';
import { GroupClassNameUtils, GroupItem } from 'Controls/display';

import { IBaseGroupTemplate } from 'Controls/_baseList/interface/BaseGroupTemplate';
import { getItemEventHandlers, IItemEventHandlers } from 'Controls/_baseList/ItemComponent';
import { THorizontalAlign, TSize } from 'Controls/interface';

export interface IGroupContentProps extends IBaseGroupTemplate, TInternalProps {
    item?: GroupItem;
    wasabyContext?: unknown;
    customTemplateProps?: object;
    className?: string;
    onClick?: React.MouseEventHandler;
    // Дополнительное условие показа шаблона справа. Применяется в гриде при скролле колонок
    rightTemplateCondition?: boolean;
    // Растягивание шаблона справа.  Применяется в гриде при скролле колонок
    rightTemplateStretch?: boolean;
    headerFixedPosition?: string;
    rightPaddingClassName?: string;
    leftPaddingClassName?: string;
    halign?: THorizontalAlign;
    expanded?: boolean;
    // идентификатор в модели
    listElementName?: string;
    textRender?: string | React.ReactElement;
    isFirstItem?: boolean;
    decorationStyle?: string; // default или master
    rightTemplateProps?: object;
    expanderPosition?: string;
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
    // По сути это headerFixedPosition
    isHeaderFixed?: string;
}

function shouldDisplayLeftSeparator(
    separatorVisibility: boolean,
    textVisible: boolean,
    textAlign: string
): boolean {
    return separatorVisibility !== false && textVisible !== false && textAlign !== 'left';
}

function shouldDisplayRightSeparator(
    separatorVisibility: boolean,
    textVisible: boolean,
    textAlign: string
): boolean {
    return separatorVisibility !== false && (textAlign !== 'right' || textVisible === false);
}

function GroupStringTextRender(props: { textRender: string }) {
    // Оборачиваем в span, тк обернули иконку группировки и подпись в flex-контейнер,
    // отсюда на подпись необходимо продублировать классы обрезания текста троеточием при переполнении
    return <span className={'tw-truncate'}>{props.textRender}</span>;
}

function ContentComponent(props: IGroupContentProps) {
    const displayText = props.textVisible !== false;
    const hasRightTemplate = !!props.rightTemplate && props.rightTemplateCondition !== false;
    const leftPaddingClassName = props.leftPaddingClassName ? ` ${props.leftPaddingClassName}` : '';
    const rightPaddingClassName = props.rightPaddingClassName
        ? ` ${props.rightPaddingClassName}`
        : '';
    // В новых списках используем separatorVisible, а не separatorVisibility,
    // gо аналогии c textVisible, expanderVisible
    const separatorVisible =
        props.separatorVisible !== undefined ? props.separatorVisible : props.separatorVisibility;
    // В новых списках используем halign вместо textAlign, по аналогии c настройками ячейки
    const textAlign =
        props.textAlign ||
        (props.halign &&
            {
                start: 'left',
                end: 'right',
                center: 'center',
            }[props.halign]);

    let leftSeparator = null;
    if (shouldDisplayLeftSeparator(separatorVisible, props.textVisible, textAlign)) {
        const leftSeparatorClasses =
            'controls-ListView__groupSeparator controls-ListView__groupSeparator-left';
        leftSeparator = <div className={leftSeparatorClasses}>&nbsp;</div>;
    }

    let rightSeparator = null;
    if (shouldDisplayRightSeparator(separatorVisible, props.textVisible, textAlign)) {
        const rightSeparatorClasses =
            'controls-ListView__groupSeparator' +
            `${displayText ? ' controls-ListView__groupSeparator-right' : ''}`;
        rightSeparator = <div className={rightSeparatorClasses}>&nbsp;</div>;
    }

    let content = null;
    if (displayText) {
        const contentTextWrapperClasses = GroupClassNameUtils.getTextWrapperClassName(
            props.fontColorStyle,
            props.fontSize,
            props.fontWeight,
            props.textTransform,
            separatorVisible
        );
        const contentTextClasses = GroupClassNameUtils.getTextClassName(
            textAlign,
            props.expanderVisible,
            props.expanderPosition,
            props.expanded,
            props.iconSize,
            props.iconStyle,
            props.fontSize
        );

        const textRender =
            props.children ||
            (!props.textRender || typeof props.textRender === 'string' ? (
                <GroupStringTextRender textRender={props.textRender} />
            ) : (
                createElement(props.textRender, {
                    ...props.customTemplateProps,
                    isHeaderFixed: !!props.headerFixedPosition,
                    headerFixedPosition: props.headerFixedPosition,
                })
            ));

        content = (
            <div className={contentTextWrapperClasses}>
                <div
                    className={contentTextClasses}
                    data-qa={`${props.listElementName}-expander`}
                    onClick={props.onClick}
                >
                    {textRender}
                </div>
            </div>
        );
    }

    let rightTemplate = null;
    if (hasRightTemplate) {
        let rightTemplateClasses =
            'controls-ListView__groupContent-rightTemplate ' + props.rightPaddingClassName;

        if (
            props.rightTemplateStretch ||
            (separatorVisible === false && props.textVisible === false)
        ) {
            rightTemplateClasses += ' tw-flex-grow controls-ListView__groupContent_right';
        }

        rightTemplate = (
            <div className={rightTemplateClasses}>
                <props.rightTemplate {...props.rightTemplateProps} />
            </div>
        );
    }

    let wrapperClasses =
        'controls-ListView__groupContent controls-ListView__groupContent_height' +
        `  controls-padding_top-${props.paddingTop} controls-padding_bottom-${props.paddingBottom}` +
        (props.expanderVisible === false ? ' tw-cursor-default' : '') +
        leftPaddingClassName;
    if (!hasRightTemplate) {
        wrapperClasses += rightPaddingClassName;
    }
    if (!props.isFirstItem && separatorVisible !== false) {
        wrapperClasses += ` controls-ListView__groupContent_${props.decorationStyle}`;
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

ContentComponent.defaultProps = {
    paddingTop: 's',
    paddingBottom: '2xs',
};

/**
 * Мемоизированный компонент содержимого группы.
 * ref прокидывается до div при помощи пропса forwardedRef.
 */
export const Content = React.memo(ContentComponent);

/**
 * Мемоизированная запись группы плоского списка
 */
const Group = React.memo(function Group(props: IGroupProps & IStickyBlockContentProps) {
    const handlers: Partial<React.DOMAttributes<HTMLDivElement>> = getItemEventHandlers(
        props.item,
        props
    );

    const attributes = wasabyAttrsToReactDom(props.attrs || {});
    const { $wasabyRef } = delimitProps(props);

    const customTemplateProps = {
        item: props.item,
        itemData: props.item,
        highlightedValue: props.item.getSearchValue(),
    };

    return (
        <div
            key={'content_' + props.item.key}
            {...attributes}
            {...handlers}
            className={props.className}
            ref={$wasabyRef}
        >
            <ContentComponent
                {...props}
                className={null}
                expanded={props.item.isExpanded()}
                expanderPosition={props.expanderAlign}
                customTemplateProps={customTemplateProps}
                rightTemplateProps={customTemplateProps}
                listElementName={props.item.listElementName}
                textRender={props.contentTemplate || props.item.getContents()}
                isFirstItem={props.item.isFirstItem()}
                decorationStyle={props.item.getStyle()}
                rightPaddingClassName={props.item.getGroupPaddingClasses('right')}
                leftPaddingClassName={props.item.getGroupPaddingClasses('left')}
            />
        </div>
    );
});

export default React.memo((props: IGroupTemplateProps) => {
    const { clearProps, $wasabyRef, userAttrs, context } = delimitProps(props);

    const item = props.item || props.itemData;
    const className =
        'controls-ListView__itemV ' +
        (item.isHiddenGroup() ? 'controls-ListView__groupHidden ' : 'controls-ListView__group ') +
        'controls-ListView__GroupContentWrapper controls-ListView__GroupContentWrapper_first controls-ListView__GroupContentWrapper_last ' +
        (props.className || props.attrs?.className || '');
    const attrs = {
        'item-key': item.itemKeyAttribute,
        'data-qa': userAttrs['data-qa'] || props['data-qa'] || item.listElementName,
        style: wasabyAttrsToReactDom(userAttrs).style,
    };

    if (item.isSticked()) {
        return createElement(
            StickyBlock,
            {
                subPixelArtifactFix: props.subPixelArtifactFix,
                pixelRatioBugFix: props.pixelRatioBugFix,
                backgroundStyle: props.backgroundStyle || props.item.getBackgroundStyle(),
                fixedBackgroundStyle: props.item.getFixedBackgroundStyle(),
                fixedZIndex: 3,
                content: (contentProps: IStickyBlockContentProps) => {
                    return (
                        <Group
                            key={item.key}
                            {...clearProps}
                            headerFixedPosition={contentProps.isHeaderFixed}
                            attrs={contentProps.attrs}
                            wasabyContext={context}
                            item={item}
                        />
                    );
                },
                $wasabyRef,
            },
            {
                ...attrs,
                class: className,
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
                item={item}
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
