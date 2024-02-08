import { forwardRef } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGridConnected';
import { useConnectedValue } from 'Controls-Input/useConnectedValue';
import IConfigurationTypeMeta from 'Controls-editors-demo/PropertyGridConnected/RecordType/IConfigurationType';

const Index = forwardRef((_, ref) => {
    const { value } = useConnectedValue(['MyData', 'Configuration']);
    return (
        <div ref={ref} className="controlsDemo__wrapper tw-flex tw-flex-col">
            <PropertyGrid name={['MyData', 'Configuration']} metaType={IConfigurationTypeMeta} />
            <span>Содержимое контекста:</span>
            <pre data-qa="Controls-editors-demo_PropertyGridConnected_RecordType__value">{JSON.stringify(value, null, 4)}</pre>
        </div>
    );
});

Index.getLoadConfig = () => {
    return {
        MyData: {
            dataFactoryName: 'Controls-editors-demo/PropertyGridConnected/RecordType/MyFactory',
            dataFactoryArguments: {},
        },
    };
};

export default Index;
