/**
 * @public
 * Поле контекста данных
 */
export interface IDataContextField {
    /**
     * Имя
     */
    name: string;
    /**
     * Значение
     */
    value: any;
}

/**
 * @public
 * Привязка поля контекста данных
 */
export interface IDataField {
    /**
     * Поле контекста, в которое нужно записать значение
     * Пример UserData.Counter1
     */
    contextName: string;
    /**
     * Название поля/метода для чтения.
     * Можно передать как полный путь, так и относительное название.
     * Пример полного пути: "CurrentUser.ФИО"
     * Пример относительного пути: "ФИО"
     */
    name: string;
    /**
     * Тип привязки
     */
    type: 'Function' | 'DataSet';
    /**
     * Параметры вызова метода
     */
    params?: Record<string, unknown>;
}
