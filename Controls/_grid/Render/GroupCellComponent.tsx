/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import GroupCell from '../display/GroupCell';
import { GroupContentComponent, IGroupContentProps } from 'Controls/baseList';

export const GROUP_EXPANDER_SELECTOR = 'js-controls-Tree__row-expander';

interface IPropsCompatibility {
    itemData: GroupCell;
    gridColumn: GroupCell;
    colData: GroupCell;
}

interface IProps extends TInternalProps, IGroupContentProps, IPropsCompatibility {
    column: GroupCell;
    isHeaderFixed?: string; // По сути это headerFixedPosition
    dataQa?: string;
}

function GroupCellComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const group = props.itemData || props.gridColumn || props.colData || props.column;
    // Иногда шаблон используют так, что в props.item оказывается contents.
    // Во избежание ошибок делаем проверку и, если что, берём модель из owner
    const item =
        typeof props.item !== 'string' && props.item['[Controls/_display/GroupItem]']
            ? props.item
            : group.getOwner();
    const customTemplateProps = {
        item,
        itemData: item,
        results: group.getMetaResults(),
        column: group,
    };
    return (
        <GroupContentComponent
            forwardedRef={ref}
            textVisible={props.textVisible !== false && group.isContentCell()}
            textAlign={props.textAlign}
            separatorVisible={props.separatorVisibility}
            highlightedValue={group.getSearchValue()}
            expanderPosition={props.expanderAlign}
            groupViewMode={item.getGroupViewMode()}
            expanderVisible={props.expanderVisible}
            contentTemplate={props.contentTemplate}
            onClick={props.onClick}
            fontColorStyle={props.fontColorStyle}
            backgroundStyle={props.backgroundStyle}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            iconSize={props.iconSize}
            iconStyle={props.iconStyle}
            headerFixedPosition={props.isHeaderFixed}
            customTemplateProps={customTemplateProps}
            attrs={props.attrs}
            wasabyContext={props.wasabyContext}
            rightTemplate={props.rightTemplate}
            rightTemplateCondition={!group.isContentCell() || item.getColspanGroup()}
            rightTemplateStretch={!item.getColspanGroup()}
            className={props.className || props.attrs?.className}
            rightPaddingClassName={group.getGroupPaddingClasses('right')}
            leftPaddingClassName={group.getGroupPaddingClasses('left')}
            expanded={item.isExpanded()}
            rightTemplateProps={customTemplateProps}
            listElementName={item.listElementName}
            textRender={props.contentTemplate || item.getContents()}
            isFirstItem={item.isFirstItem()}
            decorationStyle={item.getStyle()}
            paddingTop={props.paddingTop}
            paddingBottom={props.paddingBottom}
            data-qa={props.dataQa}
        />
    );
}

export default React.forwardRef(GroupCellComponent);

/**
 * Шаблон, который по умолчанию используется для отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в {@link Controls/grid:View таблице}, {@link Controls/treeGrid:View дереве с колонками} и {@link Controls/explorer:View иерархическом проводнике}.
 *
 * @class Controls/_grid/Render/GroupCellComponent
 * @implements Controls/list:IBaseGroupTemplate
 * @see Controls/interface/IGroupedGrid#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" scope="{{ groupTemplate }}">
 *          <ws:contentTemplate>
 *             <ws:if data="{{contentTemplate.item.contents === 'tasks'}}">Задачи</ws:if>
 *             <ws:if data="{{contentTemplate.item.contents === 'error'}}">Ошибки</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ здесь}.
 * @public
 */
