/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/propertyGrid:PropertyGrid редакторе свойств}.
 *
 * @class Controls/propertyGrid:ItemTemplate
 * @public
 * @see Controls/propertyGrid
 * @see Controls/propertyGrid:PropertyGrid
 *
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.propertyGrid:PropertyGrid>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/propertyGrid:ItemTemplate"
 *                   highlightOnHover="{{false}}">
 *          <ws:afterEditorTemplate>
 *              <Controls.buttons:Button buttonStyle="pale" iconSize="s" icon="icon-Save" viewMode="filled"/>
 *          </ws:afterEditorTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.propertyGrid:PropertyGrid>
 * </pre>
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/propertyGrid:ItemTemplate#highlightOnHover
     * @cfg {Boolean} Видимость подсветки строки при наведении курсора мыши.
     * @remark
     * В значении false элементы редакторf свойств не будут подсвечиваться при наведении курсора мыши.
     * @default false
     * @demo Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index
     */
    highlightOnHover: boolean;

    /**
     * @name Controls/propertyGrid:ItemTemplate#afterEditorTemplate
     * @cfg {String | UI/Base:TemplateFunction} Шаблон, который отобразится справа от редактора.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.propertyGrid:PropertyGrid>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/propertyGrid:ItemTemplate"
     *          <ws:afterEditorTemplate>
     *              <Controls.buttons:Button buttonStyle="pale" iconSize="s" icon="icon-Save" viewMode="filled"/>
     *          </ws:afterEditorTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.propertyGrid:PropertyGrid>
     * </pre>
     * @demo Controls-demo/PropertyGridNew/Editors/AfterEditorTemplate/Index
     */
    afterEditorTemplate?: TemplateFunction;
}
