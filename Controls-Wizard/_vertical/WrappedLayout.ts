import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard/_vertical/WrappedLayout/WrappedLayout';
import { IAreaDataFactory, IAreaDataFactoryResult } from 'Controls/dataFactory';

export interface IWrappedLayoutOptions extends IControlOptions {
    itemTemplate: TemplateFunction;
    items?: object;
    storeId?: string;
}

interface IContextOptions {
    _dataOptionsValue?: IAreaDataFactory | IAreaDataFactoryResult;
}

/**
 * Контрол для отображения процесса, состоящего из нескольких шагов с предзагрузкой данных.
 *
 * @example
 * <pre class="brush: js">
 * Поддерживаемый формат данных. Обратите внимание на **areaData**
 * areaData: {
 *     dataFactoryName: 'Controls/dataFactory:Area',
 *     dataFactoryArguments: {
 *         initialKeys: ['0'],
 *         configs: {
 *             0: {
 *                 data: {
 *                      dataFactoryName: 'Controls/dataFactory:List',
 *                      dataFactoryArguments: {
 *                          source: new Memory(...)
 *                      }
 *                 }
 *             },
 *             1: {
 *                 data: {
 *                      dataFactoryName: 'Controls/dataFactory:Custom',
 *                      dataFactoryArguments: {
 *                          source: new Memory(...)
 *                      }
 *                 }
 *             }
 *         }
 *     }
 * }
 * </pre>
 *
 * <pre class="brush: html">
 * Обратите внимание на значение в **storeId**
 * <Wizard.vertical:WrappedLayout
 *      items="{{_items}}"
 *      selectedStepIndex="{{_selectedStepIndex}}"
 *      storeId="areaData"/>
 * </pre>
 *
 * @remark
 * Для корректной работы контрола, предзагруженные данные должны быть в следующем формате:
 * * dataFactoryName - Тип предзагружаемых данных. Принимает значение **Controls/dataFactory:Area**
 * * dataFactoryArguments - Настройки для предзагруженных данных
 * * * initialKeys - Массив из ключей, по которым будет произведена предзагрузка.
 * * * configs - Параметры
 * * * * name - Имя ключа. Имя должно соответствовать ключу элемента, которые переданы в опцию **items**
 * * * * * data - Имя ключа для фабрики. В качестве ключей фабрик используются уникальные строковые значения, которые в дальнейшем будут применяться для конфигурирования компонентов внутри активного шага
 * * * * * * dataFactoryName - Тип предзагружаемых данных. Принимает следующие значения: **'Controls/dataFactory:List**, **'Controls/dataFactory:Custom**
 * * * * * * dataFactoryArguments - Настройки для предзагруженных данных
 *
 * Далее, необходимо предзагрузить сами данные. Делается это следующим образом:
 * <pre class="brush: js">
 * import {Loader} from 'Controls/dataLoader';
 *
 * function _getLoader(loaderConfig) {
 *     return Loader.load(loadConfig);
 * }
 *
 * const _loader = await getLoader(...);
 * </pre>
 * Где loaderConfig, это данные для предзагрузки, которые были проинициализированы ранее.
 *
 * Полученный результат нужно передать в ContextOptionsProvider.
 * <pre class="brush: html">
 * <Controls.context:ContextOptionsProvider value={_loader}>
 *     ...
 * </Controls.context:ContextOptionsProvider>
 * </pre>
 *
 * Загруженные данные можно будет получить вызвав метод **getDataOptions**, который придет в {@link Controls-Wizard/vertical:IVerticalItem#contentTemplate шаблон контента шага}. Метод принимает в качестве параметра номер шага.
 * <pre class="brush: js">
 * protected _source: Memory;
 *
 * protected _beforeMount(options): void {
 *     // selectedStepIndex = 0
 *     this._source = options.getDataOptions(0);
 * }
 * </pre>
 * @extends UI/Base:Control
 * @public
 * @demo Controls-Wizard-demo/vertical/WrappedLayout/Vertical
 */
export default class WrappedLayout extends Control<IWrappedLayoutOptions> {
    _template: TemplateFunction = template;

    protected _getDataOptionsValue(contextOptions: IContextOptions): IAreaDataFactoryResult {
        return contextOptions._dataOptionsValue?.[this._options.storeId];
    }
}

/**
 * @name Controls-Wizard/_vertical/WrappedLayout#storeId
 * @cfg {String} Идентификатор элемента предзагрузки из хранилища.
 */
