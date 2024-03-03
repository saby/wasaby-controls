/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { ICommandOptions } from 'Controls/listCommands';
import { IActionProps } from 'Controls/_actions/interface/IActionProps';
import { TKey, IFontColorStyle } from 'Controls/interface';
/**
 * Интерфейс описания экшена
 * @interface Controls/_actions/interface/IActionOptions
 * @implements Controls/_actions/interface/IActionProps
 * @implements Controls/interface:IFontColorStyle
 * @public
 */

/**
 * @name Controls/_actions/interface/IActionOptions#order
 * @cfg {number} Порядок отображения экшена.
 */

/**
 * @name Controls/_actions/interface/IActionOptions#actionName
 * @cfg {number} Путь до класса, реализующего экшен.
 * Все внутри объекта будут переданы в коструктор класса, см. пример
 * @example
 * * <pre class="brush: js">
 *    const editAction = {
 *        iconStyle: 'secondary',
 *        icon: 'icon-Edit'
 *        actionName: MyModule/actions:EditAction
 *    }
 * </pre>
 */

/**
 * @name Controls/_actions/interface/IActionOptions#permissions
 * @cfg {Array<String>} Массив идентификаторов зон доступа.
 */

/**
 * @name Controls/_actions/interface/IActionOptions#permissionsMode
 * @cfg {TPermissionsMode} Режим проверки прав.
 * @see {permissions}
 */

/**
 * @name Controls/_actions/interface/IActionOptions#prefetchResultId
 * @cfg {string} Идентификатор элемента предзагрузки. Результат будет передан в конструктор экшена.
 */

/**
 * @name Controls/_actions/interface/IActionOptions#parent
 * @cfg {string|number} Идентификатор родительского экшена
 */

/**
 * @name Controls/_actions/interface/IActionOptions#@parent
 * @cfg {boolean} Флаг, указывающий на то, есть ли у экшена дочерние элементы.
 */

/**
 * @name Controls/_actions/interface/IActionOptions#requiredLevel
 * @cfg {string} Минимально необходимый доступ к контролу. Подробнее можно прочитать {@link /docs/js/Permission/access/Container/options/requiredLevel тут}.
 */

/**
 * @name Controls/_actions/interface/IActionOptions#onExecuteHandler
 * @cfg {string} Путь до метода, который будет вызван при клике на экшен. В аргументы будут переданы элемент и опции экшена.
 * @example
 * * <pre class="brush: js">
 *    const editAction = {
 *        iconStyle: 'secondary',
 *        icon: 'icon-Edit'
 *        onExecuteHandler: MyModule/actionsHandlers:Edit
 *    }
 * </pre>
 */

/**
 * @name Controls/_actions/interface/IActionOptions#commandName
 * @cfg {string} Путь до модуля, реализуещего класс с интерфейсом ICommand.
 * В конструктор будут переданы опции экшена и commandOptions.
 * @see commandOptions
 * @example
 * * <pre class="brush: js">
 *    const editAction = {
 *        iconStyle: 'secondary',
 *        icon: 'icon-Edit'
 *        commandName: MyModule/actionsHandlers:Edit
 *    }
 * </pre>
 */

/**
 * @name Controls/_actions/interface/IActionOptions#commandOptions
 * @cfg {string} Опции для команды.
 * @see commandName
 * @example
 * * <pre class="brush: js">
 *    const editAction = {
 *        iconStyle: 'secondary',
 *        icon: 'icon-Edit',
 *        commandName: 'MyModule/actionsHandler
 *        commandOptions: {
 *            method: 'endpoint.methodName'
 *        }
 *    }
 * </pre>
 */
export interface IActionOptions<Context extends Record<string, unknown> = Record<string, unknown>>
    extends IActionProps {
    parent?: TKey;
    'parent@'?: boolean;
    order?: number;
    onExecuteHandler?: Function;
    handler?: Function;
    actionName?: string;
    commandName?: string;
    commandOptions?: ICommandOptions;
    viewCommandName?: string;
    viewCommandOptions?: unknown;
    permissions?: string[];
    permissionsLevel?: number;
    requiredLevel?: string;
    prefetchResultId?: string;
    context?: Context;
    reloadOnOpen?: boolean;
    permissionsMode?: 0 | 1;
    storeId?: TKey;
    readOnly?: boolean;
    fontColorStyle?: IFontColorStyle;
    prefetchResult?: unknown;
}
