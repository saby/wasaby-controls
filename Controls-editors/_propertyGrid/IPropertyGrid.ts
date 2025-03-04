import { IPropertyEditorProps, ObjectMeta } from 'Meta/types';
import {
    IEditorLayoutProps,
    PropsValidation,
    IEditorValidation,
} from 'Controls-editors/object-type';
import { Record as EntityRecord } from 'Types/entity';
import { ControllerClass as ValidationControllerClass } from 'Controls/validate';

/**
 * Интерфейс пропсов компонента PropertyGrid
 * @public
 */
export interface IPropertyGrid {
    /**
     * Позволяет строго задать ширину колонки с меткой
     */
    captionColumnWidth?: string;

    /**
     * Идентификатор слайса, в котором находятся загруженные редакторы
     */
    storeId?: string;

    /**
     * css класс
     */
    className?: string;

    /**
     * Показывать подсказки рядом с редактором
     */
    showTooltip?: boolean;

    /**
     * Вид отображения группы свойств
     */
    groupType?: 'cloud';

    /**
     * Значения валидации для редакторов
     */
    validation?: EntityRecord | PropsValidation;

    /**
     * Класс контроллера валидации для настройки логики валидации
     */
    validationControllerClass?: ValidationControllerClass;

    /**
     * Мета-описание объекта.
     */
    metaType: ObjectMeta;

    /**
     * Значения свойств объекта.
     */
    value?: object;

    /**
     * Получение измененных значений.
     */
    onChange: (value: object) => void;

    /**
     * Отобразить редактор только на чтение
     */
    readOnly?: boolean;
}

/**
 * Интерфейс пропсов компонента-обертки раскладки редакторов проперти грида
 * @interface IPropertyGridEditorLayout
 * @name IPropertyGridEditorLayout
 * @author Парамонов В.С.
 */
export interface IPropertyGridEditorLayout extends IEditorLayoutProps {
    /**
     * Определяет расположение заголовка редактора (по умолчанию 'left')
     */
    titlePosition: 'left' | 'top' | 'none' | 'float';

    /**
     * Название редактируемого атрибута
     */
    attributeName?: string;

    /**
     * Отключить валидацию, встроенную в раскладку
     */
    doNotValidate?: boolean;

    /**
     * Валидаторы для редактора и значения для валидации вложенных свойств
     */
    validation?: IEditorValidation;
}

export interface IPropertyGridPropertyEditorProps<RuntimeInterface>
    extends IPropertyEditorProps<RuntimeInterface> {
    /**
     * Валидаторы для редактора и значения для валидации вложенных свойств
     */
    validation?: IEditorValidation;
}
