export default {
    getConfig() {
        return {
            list: {
                dataFactoryName: 'Controls-DataEnv-demo/context/RootContext/ListFactory',
                dataFactoryArguments: {
                    sliceExtraValues: [
                        {
                            propName: 'filter',
                            dependencyName: 'filter',
                            dependencyPropName: 'filter',
                        },
                    ],
                    loaderExtraValues: [
                        {
                            propName: 'filter',
                            dependencyName: 'filter',
                            dependencyPropName: 'filter',
                        },
                    ],
                },
            },
        };
    },
};
