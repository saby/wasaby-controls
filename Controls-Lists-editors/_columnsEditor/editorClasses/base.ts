import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { ITreeControlItem } from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import { LOCAL_MOVE_POSITION } from 'Types/source';

/**
 * Интерфейс значения колонки
 * @private
 */
export interface IColumnValue {
    /**
     * Заголовок по умолчанию
     */
    initCaption: string;
    /**
     * Значение
     */
    displayProperty: string;
}

/**
 * Действия над записями в поддереве
 * @variant edit редактировать
 * @variant add добавить
 * @variant delete удалить
 * @variant move переместить
 */
type TEditorActions = 'edit' | 'add' | 'delete' | 'move';

/**
 * Интерфейс сохраненных опций
 */
interface IEditorSavedOptions {
    /**
     * Список пустых папок, добавленных при редактировании
     */
    emptyFolders?: ITreeControlItem[];
}

/**
 * Интерфейс редактора поддерева
 * @private
 */
interface IEditorActions {
    /**
     * Элементы поддерева
     */
    items: ITreeControlItem | ITreeControlItem[];
    /**
     * Действие над элементами
     */
    action: TEditorActions;
    /**
     * Опции, которые необходимо сохранить
     */
    savedOptions?: IEditorSavedOptions;
    /**
     * Позиционирование записи при перемещении
     */
    position?: LOCAL_MOVE_POSITION;
}

/**
 * Интерфейс настроек типа
 * @private
 */
export interface IEditingValue {
    /**
     * Заголовок
     */
    caption?: string;
    /**
     * Значение
     */
    columnValue?: IColumnValue;
    /**
     * Разделители
     */
    columnSeparatorSize?: {
        left: string | null;
        right: string | null;
    };
    /**
     * Ширина
     */
    width?: string;
    /**
     * Перенос строк
     */
    whiteSpace?: boolean;
    /**
     * Выравнивание
     */
    align?: string;
    /**
     * Поддерево
     */
    subTree?: IEditorActions;
}

/**
 * Базовый класс, описывающий основные методы, необходимые для работы с редактором типа
 * @private
 */
export abstract class BaseEditor {
    /**
     * Значение
     */
    _value: IEditingValue = {};

    /**
     * Получить значение
     * @return object
     */
    getValue(): object {
        return this._value;
    }

    /**
     * Получить метатип
     * @return object
     */
    abstract getMetaType(): object;

    /**
     * Обновить значение
     * @param {IMarkupValue} oldValue предыдущее значение
     * @param {IEditingValue} newProperties новые настройки
     * @return IMarkupValue
     */
    abstract updateValue(oldValue: IMarkupValue, newProperties: IEditingValue): IMarkupValue;
}
