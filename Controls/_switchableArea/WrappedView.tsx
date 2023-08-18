/**
 * @kaizen_zone 6b2f7c09-87a5-4183-bd7c-59117d2711bc
 */
import { TemplateFunction } from 'UI/Base';
import { ISwitchableAreaItem } from 'Controls/_switchableArea/View';
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { DataContext } from 'Controls-DataEnv/context';
import { AreaSlice, IAreaState } from 'Controls-DataEnv/dataFactory';
import { IControlProps } from 'Controls/interface';
import { default as View, correctSelectedKey } from './View';

export interface IWrappedViewOptions extends TInternalProps, IControlProps {
    itemTemplate: TemplateFunction;
    selectedKey?: string | number;
    items?: ISwitchableAreaItem[];
    storeId?: string;
    className?: string;
}

function getDataOptions(
    context: AreaSlice,
    selectedKey: string | number
): Record<string | number, unknown> {
    return context?.results?.[selectedKey];
}

export default React.forwardRef(function WrappedView(
    props: IWrappedViewOptions,
    _
): React.ReactElement<IWrappedViewOptions, string> {
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
    };

    const contextOptions = React.useContext(DataContext);
    const contextValue: AreaSlice = contextOptions?.[props.storeId];
    const [selectedKey, setSelectedKey] = React.useState(correctSelectedKey(props));
    const [dataOptions, setDataOptions] = React.useState(getDataOptions(contextValue, selectedKey));

    React.useEffect(() => {
        const selectedKey = correctSelectedKey(props);

        if (contextValue) {
            if (!!contextValue.results[selectedKey]) {
                setDataOptions(getDataOptions(contextValue, selectedKey));
                setSelectedKey(selectedKey);
            } else {
                contextValue
                    .load(contextValue, selectedKey as string)
                    .then((config: IAreaState) => {
                        setDataOptions(getDataOptions(contextValue, selectedKey));
                        setSelectedKey(selectedKey);
                    });
            }
        }
    }, [props.selectedKey, contextOptions]);

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return (
        <View
            {...attrs}
            {...props}
            selectedKey={selectedKey}
            className={getAttrClass()}
            _dataOptionsValue={dataOptions}
        />
    );
});

/**
 * Контрол для переключения контентных областей с предзагрузкой данных.
 *
 * Полезные ссылки:
 * * {@link Controls/switchableArea:View}
 *
 * @example
 * <pre class="brush: js">
 * Поддерживаемый формат данных. Обратите внимание на **areaData**
 * areaData: {
 *     dataFactoryName: 'Controls/dataFactory:Area',
 *     dataFactoryArguments: {
 *         initialKeys: ['first'],
 *         configs: {
 *             first: {
 *                 list: {
 *                      dataFactoryName: 'Controls/dataFactory:List',
 *                      dataFactoryArguments: {
 *                          source: new Memory(...)
 *                      }
 *                 }
 *                 toggle: {
 *                      dataFactoryName: 'Controls/dataFactory:Custom',
 *                      dataFactoryArguments: {
 *                          source: new Memory(...)
 *                      }
 *                 }
 *             },
 *             second: {
 *                 list: {
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
 * <Controls.switchableArea:WrappedView
 *      items="{{_items}}"
 *      selectedKey="{{_selectedKey}}"
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
 * * * * * data - Имя ключа для фабрики. В качестве ключей фабрик используются уникальные строковые значения, которые в дальнейшем будут применяться для конфигурирования компонентов внутри элемента switchableArea.
 * * * * * * dataFactoryName - Тип предзагружаемых данных. Принимает следующие значения: **'Controls/dataFactory:List**, **'Controls/dataFactory:Custom**
 * * * * * * dataFactoryArguments - Настройки для предзагруженных данных
 *
 * Далее, необходимо предзагрузить сами данные. Делается это следующим образом:
 * <pre class="brush: js">
 * import {Loader} from 'Controls-DataEnv/dataLoader';
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
 * Загруженные данные придут в **dataOptions** шаблона
 * <pre class="brush: html">
 * <Controls.switchableArea:WrappedView items="{{_items}}" storeId="areaData"/>
 *      <ws:itemTemplate>
 *          <Controls.CheckboxGroup:Control scope="{{itemTemplate.dataOptions.toggle}}"
 *          <Controls.list:View scope="{{itemTemplate.dataOptions.list}}"/>
 *      </ws:itemTemplate>
 * </Controls.switchableArea:WrappedView>
 * </pre>
 * @class Controls/_switchableArea/WrappedView
 * @implements Controls/interface:IControl
 * @extends Controls/switchableArea:View
 * @public
 * @demo Controls-demo/SwitchableArea/Base/Index
 */

/**
 * @name Controls/_switchableArea/WrappedView#storeId
 * @cfg {String} Идентификатор элемента предзагрузки из хранилища.
 */
