/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import GroupCell from '../display/GroupCell';
import { GroupContentComponent, IGroupContentProps } from 'Controls/baseList';

interface IPropsCompatibility {
    itemData: GroupCell;
    gridColumn: GroupCell;
    colData: GroupCell;
}

interface IProps
    extends TInternalProps,
        IGroupContentProps,
        IPropsCompatibility {
    column: GroupCell;
    className?: string;
    onClick?: Function;
    isHeaderFixed?: boolean;
    dataQa?: string;
}

function GroupCellComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const group =
        props.itemData || props.gridColumn || props.colData || props.column;
    // Иногда шаблон используют так, что в props.item оказывается contents.
    // Во избежание ошибок делаем проверку и, если что, берём модель из owner
    const item =
        typeof props.item !== 'string' &&
        props.item['[Controls/_display/GroupItem]']
            ? props.item
            : group.getOwner();
    const customTemplateProps = {
        results: group.getMetaResults(),
        column: group,
    };
    return (
        <GroupContentComponent
            forwardedRef={ref}
            textVisible={props.textVisible !== false && group.isContentCell()}
            textAlign={props.textAlign}
            separatorVisibility={props.separatorVisibility}
            item={item}
            group={group}
            highlightedValue={group.getSearchValue()}
            expanderAlign={props.expanderAlign}
            expanderVisible={props.expanderVisible}
            fontColorStyle={props.fontColorStyle}
            contentTemplate={props.contentTemplate}
            onClick={props.onClick}
            backgroundStyle={props.backgroundStyle}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            iconSize={props.iconSize}
            iconStyle={props.iconStyle}
            isHeaderFixed={props.isHeaderFixed}
            customTemplateProps={customTemplateProps}
            attrs={props.attrs}
            wasabyContext={props.wasabyContext}
            rightTemplate={props.rightTemplate}
            rightTemplateCondition={
                !group.isContentCell() || item.getColspanGroup()
            }
            rightTemplateStretch={!item.getColspanGroup()}
            className={props.className || props.attrs?.className}
            dataQa={props.dataQa}
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
