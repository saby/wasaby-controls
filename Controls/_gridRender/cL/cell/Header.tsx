/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';
import HeaderCellComponent from 'Controls/_gridRender/cell/Header';
import { CCCPC } from 'Controls/_gridRender/cL/cell/Data';
import { getHeaderCellProps } from 'Controls/_gridRender/cell/utils/Header';
import { prepareCommonCompatibleProps, filterCommonCompatibleProps } from '../utils/common';
import { validate } from 'Controls/_gridRender/utils/compatibleValidator';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки шапки таблицы.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleHeaderCellComponentProps(props: ICellProps) {
    const column = props.column || props.gridColumn || props.colData;

    const cellProps = getHeaderCellProps({
        cell: column,
        row: column.getOwner(),
    });
    const compatibleProps = prepareCommonCompatibleProps({
        ...cellProps,
        ...props,
        // Некоторые props имеют значение undefined, но не должны перебивать аналогичное значение из cellProps.
        // Но они не должны перебивать корректно расчитанные опции из cellProps.
        backgroundColorStyle: props.backgroundColorStyle || cellProps.backgroundColorStyle,
        fixedBackgroundStyle: props.fixedBackgroundStyle || cellProps.fixedBackgroundStyle,
        valign: cellProps.valign,
        halign: cellProps.halign,
        cursor: props.cursor || cellProps.cursor,
    });

    filterCommonCompatibleProps(compatibleProps, false);

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки шапки таблицы.
 * Вставляется прикладником в опцию headerTemplate.
 * @param props
 */
export const CompatibleHeaderCellComponent = React.forwardRef(
    (props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        const cell = props.column || props.gridColumn || props.colData;
        validate(props._$compatibleCallValidator, props._$expectedTemplate, ['HeaderContent']);
        const cellProps = cell.getColumnConfig().getCellProps
            ? cell.getColumnConfig().getCellProps()
            : {};

        const BeforeContentRender =
            cellProps.beforeContentRender !== undefined
                ? cellProps.beforeContentRender
                : props.beforeContentRender;

        const preparedBeforeContentRender = (
            BeforeContentRender ? <BeforeContentRender cell={cell} /> : null
        ) as React.ReactElement;

        return (
            <CCCPC
                {...props}
                ref={ref}
                beforeContentRender={preparedBeforeContentRender}
                getCCCP={getCompatibleHeaderCellComponentProps}
                _$FCC={HeaderCellComponent as React.FunctionComponent}
            />
        );
    }
);

/**
 * Шаблон, который по умолчанию используется для отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ ячейки заголовка} в {@link Controls/grid:View таблице}.
 *
 * @class Controls/_grid/Render/HeaderCellComponent
 * @see Controls/grid:IGridControl/HeaderCell.typedef
 * @see Controls/grid:IGridControl#header
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ здесь}.
 * @example
 * <pre class="brush: html; highlight: [7-12]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:header>
 *       <ws:Array>
 *          <ws:Object>
 *             <ws:template>
 *                <ws:partial template="Controls/grid:HeaderContent"  scope="{{_options}}">
 *                   <ws:contentTemplate>
 *                      {{contentTemplate.column.config.caption}}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:header>
 * </Controls.grid:View>
 * </pre>
 * @public
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * @name Controls/_grid/Render/HeaderCellComponent#contentTemplate
 * @cfg {String|TemplateFunction} Пользовательский шаблон для отображения содержимого ячейки шапки.
 * @markdown
 * @remark
 * В области видимости шаблона доступен объект **column**. Через него можно получить доступ к свойству **config**, которое содержит конфигурацию {@link /docs/js/Controls/grid/IHeaderCell/ ячейки шапки}.
 * @example
 * **Пример 1.** Шаблон и контрол сконфигурированы в одном WML-файле.
 * <pre class="brush: html; highlight: [7-11]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:header>
 *       <ws:Array>
 *          <ws:Object>
 *             <ws:template>
 *                <ws:partial template="Controls/grid:HeaderContent" scope="{{_options}}">
 *                   <ws:contentTemplate>
 *                      {{contentTemplate.column.config.caption}}
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:header>
 * </Controls.grid:View>
 * </pre>
 *
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre class="brush: html">
 * <!-- file1.wml -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:header>
 *       <ws:Array>
 *          <ws:Object>
 *             <ws:template>
 *                <ws:partial template="wml!file2" scope="{{template}}"/>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:header>
 * </Controls.grid:View>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * <ws:partial template="Controls/grid:HeaderContent" scope="{{_options}}">
 *    <ws:contentTemplate>
 *       {{contentTemplate.column.config.caption}}
 *    </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 *
 * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
 *
 * <pre class="brush: html">
 * <!-- file1.wml -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:header>
 *       <ws:Array>
 *          <ws:Object>
 *             <ws:template>
 *                <ws:partial template="Controls/grid:HeaderContent" scope="{{_options}}">
 *                   <ws:contentTemplate>
 *                      <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:header>
 * </Controls.grid:View>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- file2.wml -->
 * {{contentTemplate.column.config.caption}}
 * </pre>
 */

/**
 * @name Controls/_grid/Render/HeaderCellComponent#className
 * @cfg {String} Дополнительный CSS класс для стилизации шаблона.
 */
