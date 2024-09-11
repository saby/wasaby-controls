/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
/**
 * Модуль возвращает функцию, которая проверяет, является ли класс наследником {@link UI/Base:Control}.
 * @remark
 * Аргументы функции:
 *
 * Прототип класса компонента.
 *
 * Критерий проверки:
 *
 * Класс унаследован от UI/Base:Control.
 *
 * Возвращает:
 *
 * * true - класс унаследован от UI/Base:Control.
 * * false - класс не унаследован от UI/Base:Control.
 *
 * @example
 * <pre class="brush: js">
 * require(['Controls/buttons:Button', 'SBIS3.CONTROLS/Button', 'Controls/Utils/isVDOMTemplate'], function(VDOMButton, WS3Button, isVDOMTemplate) {
 *   // true
 *   isVDOMTemplate(VDOMButton);
 *   // false
 *   isVDOMTemplate(WS3Button);
 * });
 * </pre>
 *
 * @class Controls/Utils/isVDOMTemplate
 * @public
 */

export function isVDOMTemplate(templateClass: Control): boolean {
    // на VDOM классах есть св-во _template.
    // Если его нет, но есть stable или isDataArray, значит это функция от tmpl файла
    const isVDOM =
        templateClass &&
        ((templateClass.prototype && templateClass.prototype._template) ||
            templateClass.stable ||
            templateClass.isDataArray);
    return !!isVDOM;
}

export function isWS3Template(templateClass: Control): boolean {
    return (
        templateClass.prototype &&
        !!templateClass.prototype.setActive &&
        !!templateClass.prototype._hasMarkup &&
        !!templateClass.prototype._registerToParent
    );
}
