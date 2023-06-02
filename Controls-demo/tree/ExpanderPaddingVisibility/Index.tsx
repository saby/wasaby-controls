import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { ItemsView as TreeGridView } from 'Controls/treeGrid';
import { Button } from 'Controls/buttons';
import { TExpanderPaddingVisibility } from 'Controls/display';

const data = [
    {
        key: 1,
        title: 'Notebooks',
        node: true,
        parent: null,
        hasChildren: false,
    },
    {
        key: 2,
        title: 'Tablets',
        node: null,
        parent: null,
        hasChildren: false,
    },
    {
        key: 3,
        title: 'Laptop computers',
        node: null,
        parent: null,
        hasChildren: false,
    },
];
const items = new RecordSet({
    keyProperty: 'key',
    rawData: data,
});

const VISIBILITY_VALUES: TExpanderPaddingVisibility[] = [
    'visible',
    'hidden',
    'hasExpander',
];
let SELECTED_VISIBILITY_INDEX = 0;
export default React.forwardRef((_, ref) => {
    const [expanderPaddingVisibility, setExpanderPaddingVisibility] =
        React.useState<TExpanderPaddingVisibility>(
            VISIBILITY_VALUES[SELECTED_VISIBILITY_INDEX]
        );

    const changeExpanderPaddingVisibility = () => {
        SELECTED_VISIBILITY_INDEX++;
        const newMode =
            VISIBILITY_VALUES[
                SELECTED_VISIBILITY_INDEX % VISIBILITY_VALUES.length
            ];
        setExpanderPaddingVisibility(newMode);
    };

    const itemTemplateOptions = React.useMemo(() => {
        return { expanderPaddingVisibility };
    }, [expanderPaddingVisibility]);
    return (
        <div ref={ref}>
            {`Current expanderPaddingVisibility ${expanderPaddingVisibility}`}
            <br />
            <Button
                caption={'Change expanderPaddingVisibility'}
                onClick={changeExpanderPaddingVisibility}
            />
            <br />
            <TreeGridView
                items={items}
                keyProperty={'key'}
                nodeProperty={'node'}
                parentProperty={'parent'}
                hasChildrenProperty={'hasChildren'}
                columns={[{ displayProperty: 'title' }]}
                expanderVisibility={'hasChildren'}
                itemTemplateOptions={itemTemplateOptions}
            />
        </div>
    );
});
