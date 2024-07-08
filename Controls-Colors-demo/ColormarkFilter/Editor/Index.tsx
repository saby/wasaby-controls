import * as React from 'react';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';

const filterItems = [
    {
        id: '4',
        icon: 'Flag',
        iconStyle: 'primary',
        iconSize: 'm',
        caption: 'Важный',
    },
    {
        id: '5',
        icon: 'Add',
        iconStyle: 'primary',
        iconSize: 'm',
        caption: 'Плюс',
    },
    {
        id: '0',
        type: 'color',
        value: {
            color: '--danger_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Красный',
        removable: true,
        editable: true,
    },
    {
        id: '1',
        type: 'color',
        value: {
            color: '--success_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Зеленый',
    },
    {
        id: '2',
        type: 'color',
        value: {
            color: '--secondary_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Синий',
        removable: true,
        editable: true,
    },
    {
        id: '3',
        type: 'color',
        value: {
            color: '--warning_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Желтый',
        removable: true,
        editable: true,
    },
];

export default class extends React.Component {
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            markData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'mark',
                            editorTemplateName: 'Controls-Colors/colormarkFilter:Editor',
                            resetValue: { selected: [], excluded: [] },
                            viewMode: 'extended',
                            value: { selected: ['1', '3'], excluded: ['0', '2'] },
                            editorOptions: {
                                items: filterItems,
                                extendedCaption: 'Пометки',
                            },
                        },
                    ],
                },
            },
        };
    }

    render() {
        return (
            <div>
                <FilterView ref={this.props.forwardedRef} storeId="markData" />
            </div>
        );
    }
}
