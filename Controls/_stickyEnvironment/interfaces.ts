/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
/**
 * Интерфейс описывает структуру объекта, содержащего информацию о граничных данных относительно верхней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
 * @public
 */
export interface ITopEdgeData<TData = unknown> {
    /**
     * Данные, которые ближе всего находятся к верхней границе за пределами видимости
     * корневого элемента либо пересекают её
     */
    above: TData;

    /**
     * Данные, которые ближе всего находятся к верхней границе в пределах видимости
     * корневого элемента
     */
    below: TData;
}

/**
 * Интерфейс описывает структуру объекта, содержащего информацию о граничных данных относительно нижней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
 * @public
 */
export interface IBottomEdgeData<TData = unknown> {
    /**
     * Данные, которые ближе всего находятся к нижней границе в пределах видимости
     * корневого элемента либо пересекают её
     */
    above: TData;

    /**
     * Данные, которые ближе всего находятся к нижней границе за пределами видимости
     * корневого элемента
     */
    below: TData;
}

/**
 * Интерфейс описывает структуру объекта, содержащего информацию о граничных данных относительно верхней и нижней границы {@link Controls/scroll:Container} (либо {@link Controls/scroll:IntersectionObserverController})
 * @public
 */
export interface IEdgesData<TData = unknown> {
    // Пограничные данные относительно верхней границы
    top: ITopEdgeData<TData>;
    // Пограничные данные относительно нижней границы
    bottom: IBottomEdgeData<TData>;
}
