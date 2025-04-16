import { ReactNode } from 'react';
import { DataContextProxy, IDataContextProxyValues, IDataConfigs } from 'Controls-DataEnv/context';
import { EditorsDataContext } from 'Controls-editors/object-type';
import { PropertyGridContext, IPropertyGridContext } from './PropertyGridContext';

interface IContextProxyProps {
    dataContextValues: IDataContextProxyValues;
    editorData: IDataConfigs;
    propertyGridContext: IPropertyGridContext;
    children: ReactNode;
}

/**
 * Оборачивает содержимое окна PropertyGrid в провайдер данных
 * @param {IContextProxyProps} props
 * @return {JSX.Element}
 * @constructor
 */
function PropertyGridContextProxy(props: IContextProxyProps) {
    const { editorData, propertyGridContext, children } = props;
    return (
        <DataContextProxy proxyContextValues={props.dataContextValues}>
            <EditorsDataContext.Provider value={editorData}>
                <PropertyGridContext.Provider value={propertyGridContext}>
                    {children}
                </PropertyGridContext.Provider>
            </EditorsDataContext.Provider>
        </DataContextProxy>
    );
}

// Для того, чтобы можно было использовать компонент в качестве шаблона окна
// @ts-ignore
PropertyGridContextProxy.isReact = true;
export default PropertyGridContextProxy;
