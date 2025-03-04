/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IIconOptions {
    icon?: string;
}

/**
 * Интерфейс для контролов, который имеют возможность отображения иконки.
 * @public
 */
export default interface IIcon {
    readonly '[Controls/_interface/IIcon]': boolean;
}
/**
 * @name Controls/_interface/IIcon#icon
 * @cfg {String} Определяет иконку, которая будет отображена в контроле.
 * @default undefined
 * @remark Все иконки — символы специального шрифта иконок.
 * Список всех иконок можно увидеть {@link /docs/js/icons/ здесь}.
 * Данная опция задает только символ шрифта иконки. Размер и цвет задаются другими соответствующими опциями: iconSize и iconStyle.
 * Способы подключения иконки:
 * Чтобы определить иконку как символ шрифта, используйте формат команды: icon="icon-Add".
 * Чтобы использовать иконку как svg-картинку, воспользуйтесь {@link /doc/platform/developmentapl/interface-development/svg/ инструкцией}.
 * @example
 * Кнопка со стилем primary и иконкой Add.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" buttonStyle="primary" viewMode="outlined"/>
 * </pre>
 * @see Controls/interface:IIconSize
 * @see Controls/interface:IIconStyle
 */

/*
 * @name Controls/_interface/IIcon#icon
 * @cfg {String} Button icon.
 * @default Undefined
 * @remark Icon is given by icon classes.
 * All icons are symbols of special icon font. You can see all icons at <a href="/docs/js/icons/">this page</a>.
 * @example
 * Button with style buttonPrimary and icon Add.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" buttonStyle="primary" viewMode="outlined"/>
 * </pre>
 * @see iconStyle
 */
