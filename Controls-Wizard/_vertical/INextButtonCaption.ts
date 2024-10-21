/**
 * Интерфейс для настройки текста кнопки перехода на следующий шаг в вертикальном мастере настройки.
 * @interface Controls-Wizard/_vertical/INextButtonCaption
 * @public
 */
export interface INextButtonCaption {
    /**
     * @name Controls-Wizard/_vertical/INextButtonCaption#nextButtonCaption
     * @cfg {string} Текст кнопки перехода на следующий шаг. Если указать данную опцию, то на всех кроме последнего шага мастера вне контентной области появится кнопка перехода на следующий шаг.
     * По нажатию на неё срабатывает событие selectedStepIndexChanged.
     * @example
     * <pre class="brush: js">
     *  <Layout onSelectedStepIndexChanged={selectedStepIndexChangedHandler} />
     *
     *  const selectedStepIndexChangedHandler = (step: number) => {}
     * </pre>
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     * @remark Также есть возможность задать текст кнопки основного действия в массиве items для отдельного шага.
     */
    nextButtonCaption?: string;
}
