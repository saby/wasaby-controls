import * as React from 'react';
import { Select } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ui/Select';
import { ControlSection } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ui/ControlSection';
import { ListSlice } from 'Controls/dataFactory';
import { useSlice } from 'Controls-DataEnv/context';

interface Option {
    value: string | null;
    label: string;
}

export function ItemParentKey(): JSX.Element {
    const [parentNode, setParentNode] = React.useState<string | null>(null);
    const slice = useSlice<ListSlice>('GridOptionsController');
    const record = slice?.state?.items.getRecordById(12);

    const options: Option[] = [
        { value: null, label: 'Не выбрано' },
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
    ];

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const value = event.target.value || null;
        setParentNode(value);
        record?.set('parent', value);
    }

    return (
        <ControlSection
            title="Аттрибут item-parent-key"
            data-qa="controlsDemo_gridReact_ItemOptionsItemParentKeySection"
        >
            <Select
                value={parentNode}
                onChange={handleChange}
                options={options}
                label="Parent node"
                data-qa="controlsDemo_gridReact_ItemOptionsItemParentKeySelect"
            />
        </ControlSection>
    );
}
