import { Slice } from 'Controls-DataEnv/slice';

export const widgetConfig = {
    getConfig() {
        return {
            widgetData: {
                dataFactoryName:
                    'Controls-DataEnv-demo/context/RootContext/DynamicContextCreation/configGetters:widgetFactory',
                dataFactoryArguments: {
                    value: 'firstWidget',
                },
            },
        };
    },
};

export const widgetConfigDynamic = {
    getConfig() {
        return {
            widgetData: {
                dataFactoryName:
                    'Controls-DataEnv-demo/context/RootContext/DynamicContextCreation/configGetters:widgetFactory',
                dataFactoryArguments: {
                    value: 'dynamicWidget',
                },
            },
        };
    },
};

class WidgetSlice extends Slice {}

export const widgetFactory = {
    async loadData({ value }: Record<string, unknown>): Promise<unknown> {
        return value;
    },
    slice: WidgetSlice,
};
