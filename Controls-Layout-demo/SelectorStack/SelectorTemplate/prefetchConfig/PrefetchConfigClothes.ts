import { Memory } from 'Types/source';
import * as filter from '../DataFilter';
import { IGetConfigProps } from '../Index';
import { CLOTHES } from './ListData';

export const getConfig = (props: IGetConfigProps) => {
    const dataFactoryArguments = {
        source: new Memory({
            data: CLOTHES,
            keyProperty: 'id',
            filter,
        }),
        columns: [
            {
                key: 'id',
                displayProperty: 'title',
            },
        ],
        displayProperty: 'title',
        keyProperty: 'id',
        searchParam: props.caption ? null : 'title',
        multiSelectVisibility: props.multiSelect ? 'onhover' : 'hidden',
    };

    return {
        clothes: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments,
        },
    };
};
