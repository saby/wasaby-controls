import { Slice } from 'Controls-DataEnv/slice';
import { ReactNode } from 'react';
import { DataContext, RootContext, IDataConfigs } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { EditorsDataContext } from 'Controls-editors/object-type';
import { PropertyGridContext, IPropertyGridContext } from './PropertyGridContext';

interface IContextProxyProps {
    rootContext: IDataConfigs;
    dataContext: Record<string, Slice>;
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
    const { rootContext, dataContext, editorData, propertyGridContext, children } = props;

    if (!!rootContext) {
        return (
            <RootContext.Provider value={rootContext}>
                <EditorsDataContext.Provider value={editorData}>
                    <PropertyGridContext.Provider value={propertyGridContext}>
                        {children}
                    </PropertyGridContext.Provider>
                </EditorsDataContext.Provider>
            </RootContext.Provider>
        );
    }

    return (
        <DataContext.Provider value={dataContext}>
            <EditorsDataContext.Provider value={editorData}>{children}</EditorsDataContext.Provider>
        </DataContext.Provider>
    );
}

// Для того, чтобы можно было использовать компонент в качестве шаблона окна
// @ts-ignore
PropertyGridContextProxy.isReact = true;
export default PropertyGridContextProxy;
