import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import {
    default as HierarchicalReverseMemory,
    getColumns,
    getData,
} from '../treeGridNew/LoadMore/ReverseLoad/Data';
import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

function FirstColumn() {
    const { renderValues } = useItemData<Model>(['name', 'text']);
    return (
        <div>
            <b>{renderValues.name}</b>
            <div>{renderValues.text}</div>
        </div>
    );
}

const SOURCE = new HierarchicalReverseMemory({
    keyProperty: 'key',
    parentProperty: 'parent',
    data: getData(),
});

const COLUMNS = getColumns().map((el) => {
    if (el.template) {
        delete el.template;
        el.render = <FirstColumn />;
    }
    return { ...el, key: el.displayProperty };
});

const NAVIGATION = {
    source: 'position',
    view: 'demand',
    sourceConfig: {
        direction: 'bothways',
        field: 'key',
        limit: 2,
        multiNavigation: true,
    },
};

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <TreeGridView
                source={SOURCE}
                columns={COLUMNS}
                keyProperty={'key'}
                parentProperty={'parent'}
                nodeProperty={'type'}
                markerVisibility={'hidden'}
                navigation={NAVIGATION}
                nodeMoreCaption={'Показать еще ответы...'}
                expanderIcon={'emptyNode'}
            />
        </div>
    );
});
