import type { ObjectMeta } from 'Types/meta';

type TCommandOptions = Record<string, unknown>;

/**
 * Интерфейс объекта, описывающего действия.
 * @public
 */
export interface IActionConfig<RuntimeInterface extends object> {
    /**
     * Уникальный идентификатор действия
     * @remark это значение пишется в настройки действия во фрейме
     */
    id: string;

    /**
     * Человекопонятное название действия
     */
    title: string;
    /**
     * Категория действия
     */
    category?: string;
    /**
     * Иконка действия
     */
    icon?: string;
    /**
     * Алиас до модуля-исполнителя команды
     * @interface
     */
    commandName?: string;
    /**
     * Опции, которые пережаются в commandName первым аргументом
     */
    commandOptions?: TCommandOptions;
    /**
     * Мета-тип атрибутов команды
     */
    propsMeta?: ObjectMeta<RuntimeInterface>;
}

/**
 * Интерфейс модуля-исполнителя команды
 */
export interface IActionExecutor {
    /**
     * Метод, запускающий выполнение действия
     * @param commandOptions опции действия, заданные в его описании
     * @param editorProps опции действия, настроенные в конструкторе через {@link Controls-editors/propertyGrid:PropertyGrid PropertyGrid}
     */
    execute(commandOptions: TCommandOptions, editorProps: Record<string, unknown>);
}
