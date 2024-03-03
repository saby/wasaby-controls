/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IViewModeOptions {
    viewMode?: string;
}

/**
 * Интерфейс для контролов, который имеют возможность менять режим отображения.
 * @public
 */
export interface IViewMode {
    readonly '[Controls/_buttons/interface/IViewMode]': boolean;
}

/**
 * @name Controls/_buttons/interface/IViewMode#viewMode
 * @cfg {String} Режим отображения кнопки.
 * @variant outlined В виде обычной кнопки по-умолчанию.
 * @variant filled В виде обычной кнопки c заливкой.
 * @variant link В виде гиперссылки.
 * @variant ghost В виде кнопки для панели инструментов.
 * @default outlined
 * @demo Controls-demo/Buttons/ViewModes/Index
 * @example
 * Кнопка в режиме отображения "ghost".
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.buttons:Button
 *    caption="Send document"
 *    buttonStyle="danger"
 *    viewMode="ghost"/>
 * </pre>
 * Кнопка в режиме отображения "outlined".
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.buttons:Button
 *    caption="Send document"
 *    buttonStyle="success"
 *    viewMode="outlined"/>
 * </pre>
 * Кнопка в режиме отображения "filled".
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.buttons:Button
 *    caption="Send document"
 *    buttonStyle="success"
 *    viewMode="filled"/>
 * </pre>
 * Кнопка в режиме отображения "link".
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.buttons:Button
 *    caption="Send document"
 *    viewMode="link"/>
 * </pre>
 * @see Size
 */

/*
 * @name Controls/_buttons/interface/IViewMode#viewMode
 * @cfg {Enum} Button view mode.
 * @variant link Decorated hyperlink.
 * @variant outlined Default button.
 * @variant filled Filled default button.
 * @variant ghost Toolbar button.
 * @default outlined
 * @example
 * Button with 'link' viewMode.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="primary" viewMode="link" fontSize="3xl"/>
 * </pre>
 * Button with 'ghost' viewMode.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="danger" viewMode="ghost"/>
 * </pre>
 * Button with 'outlined' viewMode.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="success" viewMode="outlined"/>
 * </pre>
 * Button with 'filled' viewMode.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="success" viewMode="filled"/>
 * </pre>
 * @see Size
 */
