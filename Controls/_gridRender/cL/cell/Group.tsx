/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Файл обеспечивает полную совместимость со старым синтаксисом передачи опций в GroupTemplate
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';
import type { IGroupContentProps } from 'Controls/baseList';
import {
    default as GroupCellComponent,
    IGroupCellComponentProps,
} from 'Controls/_gridRender/cell/Group';
import { CCCPC } from 'Controls/_gridRender/cL/cell/Data';
import { getGroupCellProps } from 'Controls/_gridRender/cell/utils/Group';
import { validate } from 'Controls/_gridRender/utils/compatibleValidator';
import { executeSyncOrAsync } from 'UI/Deps';

type TGroupCellProps = ICellProps & Partial<IGroupContentProps>;

function validateProps(props: ICellProps) {
    if (props.column === undefined) {
        executeSyncOrAsync(['Controls/listErrors'], (errs) => errs.GroupTemplateError());
    }
}

/*
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

    const groupCellProps = getGroupCellProps({
        cell,
        row,
        rowProps: props,
    });

    const padding = {
        ...groupCellProps.padding,
        top: props.paddingTop || groupCellProps.padding.top,
        bottom: props.paddingBottom || groupCellProps.padding.bottom,
    };

    // В режиме совместимости ожидают что item - модель списочной коллекции.
    const customTemplateProps = {
        ...groupCellProps.customTemplateProps,
        item: row,
        itemData: row,
    };

    return {
        ...groupCellProps,
        padding,
        customTemplateProps,
        rightTemplateProps: customTemplateProps,
        textVisible: props.textVisible ?? groupCellProps.textVisible,
        contentRender: props.contentTemplate || groupCellProps.contentRender,
        iconStyle: props.iconStyle || groupCellProps.iconStyle,
        iconSize: props.iconSize,
        rightTemplate: props.rightTemplate || groupCellProps.rightTemplate,
        halign: (props.halign ? props.halign : props.textAlign) || groupCellProps.halign,
        separatorVisible:
            props.separatorVisible ??
            props.separatorVisibility ??
            groupCellProps.separatorVisibility,
        expanderVisible: props.expanderVisible ?? groupCellProps.expanderVisible,
        expanderPosition:
            props.expanderPosition || props.expanderAlign || groupCellProps.expanderPosition,
        rightTemplateStretch: props.rightTemplateStretch,
        className: props.className,
    };
}

/*
 * Wasaby-совместимый компонент ячейки группы и узла в виде группы.
 * Вставляется прикладником в опцию groupTemplate.
 * @param props
 */
export const CompatibleGridGroupCellComponent = React.forwardRef(
    (props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        // В некоторых случаях вместо column передают itemData.
        // Например, в прикладном коде при вставке Controls/dropdown:Button может использоваться шаблон Controls/dropdown:GroupTemplate.
        // Тогда Controls/menu:Controller передаст в него ТОЛЬКО itemData, item и className,
        // в результате тут будет какой-то ограниченный набор пропсов.
        const column = props.column || props.gridColumn || props.colData || props.itemData;
        validate(props._$compatibleCallValidator, props._$expectedTemplate, ['GroupTemplate']);

        return (
            <CCCPC
                {...props}
                column={column}
                ref={ref}
                getCCCP={getCompatibleGridGroupCellComponentProps}
                _$FCC={GroupCellComponent as React.FunctionComponent}
            />
        );
    }
);

/**
 * Шаблон, который по умолчанию используется для отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в {@link Controls/grid:View таблице}, {@link Controls/treeGrid:View дереве с колонками} и {@link Controls/explorer:View иерархическом проводнике}.
 *
 * @class Controls/_gridRender/Render/GroupCellComponent
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */
