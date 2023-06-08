/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { default as HeaderCellModel } from 'Controls/_Grid/display/HeaderCell';
import SortingButtonComponent from 'Controls/_grid/SortingButtonComponent';
import { getUserClassName } from '../utils/getUserArgsCompatible';

interface IPropsCompatibility {
    itemData: HeaderCellModel;
    gridColumn: HeaderCellModel;
    colData: HeaderCellModel;
}

interface IProps extends TInternalProps, IPropsCompatibility {
    column: HeaderCellModel;
    contentTemplate: React.ReactElement | TemplateFunction;
    className: string;
    tooltip?: string;
    'data-qa'?: string;
}

function HeaderCellComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const column = props.column || props.gridColumn || props.colData;
    const contentClassName = column.getContentClasses() + ` ${getUserClassName(props)}`;
    let style = wasabyAttrsToReactDom({
        style: column.getContentStyles(),
    }).style;
    if (props.attrs?.style) {
        style = { ...style, ...props.attrs?.style };
    }

    let content;
    if (!!props.children || !!props.contentTemplate) {
        content = props.children ? (
            React.cloneElement(props.children, { colData: column, column })
        ) : (
            <props.contentTemplate colData={column} column={column} />
        );
    } else if (column.getSortingProperty()) {
        content = (
            <SortingButtonComponent
                align={column.getAlign()}
                textOverflow={column.getTextOverflow()}
                caption={column.getCaption()}
                className={'controls-Grid__sorting-button'}
                property={column.getSortingProperty()}
                value={column.getSorting()}
            />
        );
    } else {
        const innerContentClassName =
            'controls-Grid__header-cell__content__innerWrapper' +
            ` controls-Grid__header-cell__content-${column.getTextOverflow()}`;
        content = (
            <div title={column.getCaption()} className={innerContentClassName}>
                {column.getCaption()}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={contentClassName}
            style={style}
            title={props.tooltip || props.attrs?.title}
            data-qa={props['data-qa'] || props.attrs?.['data-qa']}
        >
            {content}
        </div>
    );
}

export default React.forwardRef(HeaderCellComponent);

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
