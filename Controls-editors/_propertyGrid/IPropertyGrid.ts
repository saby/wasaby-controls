import { IPropertyEditorProps, ObjectMeta } from 'Meta/types';
import {
    IEditorLayoutProps,
    PropsValidation,
    IEditorValidation,
} from 'Controls-editors/object-type';
import { Record as EntityRecord } from 'Types/entity';
import { ControllerClass as ValidationControllerClass } from 'Controls/validate';
import { FC } from 'react';
/**
 * Базовый интерфейс настройки PG
 * @public
 */
export interface IPropertyGridBase {
    /**
     * Позволяет строго задать ширину колонки с меткой
     */
    captionColumnWidth?: string;

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

    /**
     * Значение текущей цветовой схемы (светлая/темная)
     */
    colorScheme?: string;
}

/**
 * Интерфейс настройки PG в зависимости от свойств
 * @public
 */
export interface IPropertyGridProps extends IPropertyGridBase {
    /**
     * Мета-описание объекта.
     */
    metaType: ObjectMeta<any> | ObjectMeta;

    storeId?: string;
}

/**
 * Интерфейс настройки PG в зависимости от storeId
 * @public
 */
export interface IPropertyGridByStoreProps extends IPropertyGridBase {
    storeId: string;
    /**
     * Мета-описание объекта.
     */
    metaType?: ObjectMeta<any> | ObjectMeta;
}

/**
 * Интерфейс пропсов компонента PropertyGrid
 * @interface Controls-editors/_propertyGrid/IPropertyGrid
 * @extends Controls-editors/_propertyGrid/IPropertyGridByStoreProps
 * @extends Controls-editors/_propertyGrid/IPropertyGridProps
 * @public
 */
export type IPropertyGrid = IPropertyGridProps | IPropertyGridByStoreProps;

/**
 * Интерфейс пропсов компонента-обертки раскладки редакторов проперти грида
 * @public
 */
export interface IPropertyGridEditorLayout extends IEditorLayoutProps {
    /**
     * Определяет расположение заголовка редактора (по умолчанию 'left')
     */
    titlePosition?: 'left' | 'top' | 'none' | 'float';

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

    LayoutComponent: FC<IPropertyGridEditorLayout>;
}
