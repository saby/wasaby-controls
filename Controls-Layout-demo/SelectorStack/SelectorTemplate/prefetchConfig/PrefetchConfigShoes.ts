import { Memory } from 'Types/source';
import * as filter from '../DataFilter';
import { IGetConfigProps } from '../Index';
import { SHOES, HIERARCHY_SHOES } from './ListData';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import HierarchicalMemory from './HierarchicalMemory';

export const getConfig = (props: IGetConfigProps) => {
    const dataFactoryArguments: IListDataFactoryArguments = {
        columns: [
            {
                key: 'id',
                displayProperty: 'title',
            },
        ],
        displayProperty: 'title',
        keyProperty: 'id',
        searchParam: 'title',
        multiSelectVisibility: props.multiSelect ? 'onhover' : 'hidden',
    };

    if (props.filter) {
        dataFactoryArguments.filterDescription = [
            {
                caption: '',
                name: 'discount',
                editorTemplateName: 'Controls/filterPanelEditors:Boolean',
                resetValue: false,
                viewMode: 'extended',
                textValue: props.appliedFilter ? 'Уценённые с длинным названием фильтра' : '',
                value: !!props.appliedFilter,
                extendedCaption: 'Уценённые',
            },
        ];
    }

    if (props.hierarchy) {
        dataFactoryArguments.source = new HierarchicalMemory({
            data: HIERARCHY_SHOES,
            keyProperty: 'id',
            parentProperty: 'parent',
            filter,
        });
        dataFactoryArguments.parentProperty = 'parent';
        dataFactoryArguments.nodeProperty = 'parent@';
    } else {
        dataFactoryArguments.source = new Memory({
            data: SHOES,
            keyProperty: 'id',
            filter,
        });
    }

    return {
        shoes: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments,
        },
    };
};
