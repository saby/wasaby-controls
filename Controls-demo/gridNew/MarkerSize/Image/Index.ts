import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/gridNew/MarkerSize/Image/Image';

const imageSizes = {
    l: 40,
    mt: 36,
    m: 32,
    s: 24,
    xs: 16,
};

function getData(imageSize: string) {
    return Tasks.getData()
        .slice(0, 1)
        .map((el) => {
            const newEl = { ...el };
            if (imageSizes[imageSize]) {
                newEl.width = `${imageSizes[imageSize]}px`;
            }
            if (imageSizes[imageSize]) {
                newEl.height = `${imageSizes[imageSize]}px`;
            }
            return newEl;
        });
}

function getLoadConfigForImageSize(imageSize?: string) {
    return {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            displayProperty: 'title',
            source: new Memory({
                keyProperty: 'key',
                data: getData(imageSize),
            }),
            markerVisibility: 'visible',
        },
    };
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Tasks.getColumns();
    protected _padding: string[] = ['default', 's', 'l'];
    protected _imageSizes: string[] = Object.keys(imageSizes);
    protected _markerSizes: object = {
        l: 'image-l',
        mt: 'image-mt',
        m: 'image-m',
        s: 'image-s',
        xs: 'content-xl',
    };

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        let configs = {
            defaultListData: getLoadConfigForImageSize(),
        };
        configs = Object.keys(imageSizes).reduce((obj, size) => {
            return {
                ...obj,
                [`${size}ListData`]: getLoadConfigForImageSize(size),
            };
        }, configs);
        return configs;
    }
}
