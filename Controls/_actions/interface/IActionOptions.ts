/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { ICommandOptions } from 'Controls/listCommands';
import { IActionProps, IActionCommonConfig } from 'Controls/_actions/interface/IActionProps';
import { TKey } from 'Controls/interface';

/**
 * Режим проверки прав. Через И или ИЛИ
 * @typedef TPermissionsMode
 * @variant 0 Проверка прав через И
 * @variant 1 Проверка прав через ИЛИ
 */
export type TPermissionsMode = 0 | 1;

/**
 * Действие с правами доступа
 * @public
 */
export interface IActionWithPermissions {
    /**
     * Массив идентификаторов зон доступа.
     * @cfg
     */
    permissions?: string[];
    /**
     * Минимально необходимый доступ к контролу. Подробнее можно прочитать {@link /docs/js/Permission/access/Container/options/requiredLevel тут}.
     * @cfg
     */
    requiredLevel?: string;
    /**
     * Режим проверки прав.
     * @cfg
     * @see permissions
     */
    permissionsMode?: TPermissionsMode;
}

/**
 * Действие с конструктором
 * @public
 */
export interface IActionWithConstructor {
    /**
     * Путь до класса, реализующего экшен.
     * Все внутри объекта будут переданы в конструктор класса, см. пример
     * @cfg
     * @default Controls/actions:BaseAction
     * @example
     * * <pre class="brush: js">
     *    const editAction = {
     *        iconStyle: 'secondary',
     *        icon: 'icon-Edit'
     *        actionName: MyModule/actions:EditAction
     *    }
     * </pre>
     */
    actionName?: string;
}

/**
 * Действие с иерархией
 * @public
 */
export interface IActionWithHierarchy {
    /**
     * Идентификатор родительского экшена
     * @cfg
     */
    parent?: TKey;
    /**
     * Флаг, указывающий на то, есть ли у экшена дочерние элементы.
     * @cfg
     */
    'parent@'?: boolean | null;
}

/**
 * Действие с доступом к слайсу данных
 * @public
 */
export interface IActionWithStoreId {
    /**
     * Идентификатор доступа к слайсу данных..
     * @cfg
     */
    storeId?: TKey;
}

/**
 * Публичный интерфейс действия
 * @public
 */
export interface IActionBaseConfig
    extends IActionCommonConfig,
        IActionWithConstructor,
        IActionWithPermissions,
        IActionWithHierarchy,
        IActionWithStoreId {}

/**
 * Действие без комманды, в методе execute в качестве обработчика вызывается onExecuteHandler
 * @public
 */
export interface IActionWithoutCommand extends IActionBaseConfig {
    /**
     * Путь до метода, который будет вызван при клике на экшен. В аргументы будут переданы элемент и опции экшена.
     * @cfg
     * @example
     * <pre class="brush: js">
     *    const editAction = {
     *        iconStyle: 'secondary',
     *        icon: 'icon-Edit'
     *        onExecuteHandler: MyModule/actionsHandlers:Edit
     *    }
     * </pre>
     */
    onExecuteHandler?: Function;
}

/**
 * Действие с конструктором команды, которая инициализируется и вызывается в методе execute
 * @public
 */
export interface IActionWithCommand extends IActionBaseConfig {
    /**
     * Путь до класса, который выполнит действия с данными. Например, отправит запрос на БЛ.
     * Класс должен реализовать интерфейс ICommand. В конструктор будут переданы опции экшена и commandOptions.
     * @cfg
     * @see commandOptions
     * @example
     * <pre class="brush: js">
     *    const editAction = {
     *        iconStyle: 'secondary',
     *        icon: 'icon-Edit'
     *        commandName: MyModule/actionsHandlers:Edit
     *    }
     * </pre>
     */
    commandName?: string;
    /**
     * Опции для класса команды, выполняющей действия с данными.
     * @cfg
     * @see commandName
     * @example
     * <pre class="brush: js">
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
    commandOptions?: ICommandOptions;
    /**
     * Путь до класса, который выполнит действия на вью. Например, обновит записи в RecordSet.
     * Класс должен реализовать интерфейс ICommand. В конструктор будут переданы опции экшена и viewCommandOptions.
     * @cfg
     * @see viewCommandOptions
     */
    viewCommandName?: string;
    /**
     * Опции для класса команды, выполняющей действия на вью.
     * @cfg
     * @see viewCommandName
     */
    viewCommandOptions?: unknown;
}

export interface IActionWithCounter {
    counter?: number;
    counterStyle?: string;
}

/**
 * Интерфейс описания экшена
 * @public
 */
export interface IActionOptions<Context extends Record<string, unknown> = Record<string, unknown>>
    extends IActionProps,
        IActionBaseConfig,
        IActionWithCommand,
        IActionWithoutCommand,
        IActionWithCounter {
    /**
     * Флаг, указывающий на то, будет ли экшен отображаться в пустом представлении.
     * @cfg
     * @default false
     */
    emptyViewVisibility?: boolean;
    /**
     * Идентификатор элемента предзагрузки. Результат будет передан в конструктор экшена.
     * @cfg
     */
    prefetchResultId?: string;
    prefetchResult?: unknown;
    context?: Context;
    handler?: Function;
    reloadOnOpen?: boolean;
    allowEmptySelection?: unknown;
    requiresSelection?: boolean;
}
