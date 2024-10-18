/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Файл обеспечивает полную совместимость со старым синтаксисом передачи опций в GroupTemplate
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_grid/compatibleLayer/cell/interface';
import { IGroupContentProps } from 'Controls/baseList';
import {
    default as GroupCellComponent,
    IGroupCellComponentProps,
} from '../dirtyRender/group/GroupCellComponent';
import { Logger } from 'UI/Utils';
import {
    CompatibleCellComponentPropsConverter,
    getCompatibleGridCellComponentProps,
} from 'Controls/_grid/compatibleLayer/CellComponent';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getGroupPaddingClasses } from 'Controls/_grid/dirtyRender/group/utils/Group';
import { isFirstDataCell } from 'Controls/_grid/cleanRender/cell/utils/Props/Cell';
import { isTreeGroupNodeCell } from 'Controls/_grid/compatibleLayer/utils/Type';

type TGroupCellProps = ICellProps & Partial<IGroupContentProps>;

function validateProps(props: ICellProps) {
    if (props.column === undefined) {
        Logger.warn(
            'Controls/grid. В шаблон "Controls/grid:GroupTemplate" не передана область видимости ("scope"). ' +
                'Полноценный рендер невозможен, см. https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/item/#config'
        );
    }
}

/*
 * TODO тут отличается API. Надо вести с Footer, Header, etc.
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки группы и узла в виде группы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
export function getCompatibleGridGroupCellComponentProps(
    props: TGroupCellProps
): Partial<IGroupCellComponentProps> {
    validateProps(props);

    const cell = props.column || props.gridColumn || props.colData;
    const row = cell.getOwner();

    const customTemplateProps = {
        item: row,
        itemData: row,
        highlightedValue: row.getSearchValue?.(),
    };

    const stickyProps = cell ? getStickyProps({ cell, row }) : {};

    return {
        // TODO Неправильно, что ячейка группы в себе вызывает этот метод, но имеет другое API.
        ...getCompatibleGridCellComponentProps(props),
        customTemplateProps,
        expanded: props.expanded,
        fontColorStyle: props.fontColorStyle,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        halign: props.halign !== undefined ? props.halign : props.textAlign,
        headerFixedPosition: props.headerFixedPosition, // ?? wtf
        iconSize: props.iconSize,
        iconStyle: props.iconStyle,
        leftPaddingClassName: getGroupPaddingClasses({
            side: 'left',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        paddingBottom: props.paddingBottom,
        paddingTop: props.paddingTop,
        rightPaddingClassName: getGroupPaddingClasses({
            side: 'right',
            isFirstCell: cell.isFirstColumn(),
            isLastCell: cell.isLastColumn(),
            paddingLeft: row.getLeftPadding(),
            paddingRight: row.getRightPadding(),
        }),
        rightTemplate: props.rightTemplate,
        rightTemplateCondition: !cell?.isContentCell() || props.colspanGroup,
        rightTemplateProps: customTemplateProps,
        rightTemplateStretch: props.rightTemplateStretch,
        separatorVisible:
            props.separatorVisible !== undefined
                ? props.separatorVisible
                : props.separatorVisibility,
        textTransform: props.textTransform,
        textVisible: props.textVisible !== false && cell?.isContentCell(),
        contentRender: props.contentTemplate || cell?.getDefaultDisplayValue(),
        expanderPosition: props.expanderPosition || props.expanderAlign,
        wasabyContext: props.wasabyContext,
        backgroundStyle: props.backgroundStyle,
        className: props.className,
        ...stickyProps,
        isFirstColumn: cell?.isFirstColumn(),
        isLastColumn: cell?.isLastColumn(),
        isFirstDataColumn: isFirstDataCell(cell),
        isGroupNode: isTreeGroupNodeCell(cell),
        hoverBackgroundStyle: 'none',
    };
}

/*
 * Wasaby-совместимый компонент ячейки группы и узла в виде группы.
 * Вставляется прикладником в опцию groupTemplate.
 * @param props
 */
export const CompatibleGridGroupCellComponent = React.memo(
    React.forwardRef((props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        // В некоторых случаях вместо column передают itemData.
        // Например, в прикладном коде при вставке Controls/dropdown:Button может использоваться шаблон Controls/dropdown:GroupTemplate.
        // Тогда Controls/menu:Controller передаст в него ТОЛЬКО itemData, item и className,
        // в результате тут будет какой-то ограниченный набор пропсов.
        const column = props.column || props.gridColumn || props.colData || props.itemData;

        return (
            <CompatibleCellComponentPropsConverter
                {...props}
                column={column}
                ref={ref}
                getCompatibleCellComponentProps={getCompatibleGridGroupCellComponentProps}
                _$FunctionalCellComponent={GroupCellComponent as React.FunctionComponent}
            />
        );
    })
);

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
