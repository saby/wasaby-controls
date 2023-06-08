import { Memory } from 'Types/source';

export function getConfig({ widgetSource }: { widgetSource: Memory }): object {
    return {
        data: {
            type: 'custom',
            loadDataMethod: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            key: 'key',
                            count: 100500,
                            date: new Date(),
                            info: 'This is long info about this dialog '.repeat(
                                10
                            ),
                        });
                    }, 2000);
                });
            },
            dependentArea: ['workspace'],
        },
        widgets: {
            type: 'custom',
            loadDataMethod: (cfg) => {
                return widgetSource.query().then((data) => {
                    const widgetsData = {};
                    data.getAll().forEach((element) => {
                        widgetsData[element.getKey()] = element.getRawData();
                    });
                    return widgetsData;
                });
            },
            dependentArea: ['workspace'],
        },
    };
}
