export interface ICounterVisibilityOptions {
    counterVisibility?: boolean;
}

/**
 * Интерфейс для контролов полей ввода в которых можно отобразить счётчик количества введённых символов. Используется совместно с опцией MaxLength.
 * @public
 */
export default interface ICounterVisibility {
    readonly '[Controls/_input/interface/ICounterVisibility]': boolean;
}

/**
 * @name Controls/_input/interface/ICounterVisibility#counterVisibility
 * @cfg {boolean} Определяет, будет показываться счётчик или нет. Опция работает вместе с maxLength.
 * @demo Controls-demo/Input/Area/Counter/Index
 * @demo Controls-demo/Input/Text/Counter/Index
 */
