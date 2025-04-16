import * as React from 'react';
import { ControlSection } from '../ui/ControlSection';
import { Select } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ui/Select';

interface ColumnConfigChangesProps {
    columnWidth: number;
    onWidthChange: (width: number) => void;
}

interface Option {
    value: string;
    label: string;
}

export function ColumnConfigChanges(props: ColumnConfigChangesProps): React.ReactElement {
    const { columnWidth, onWidthChange } = props;

    const options: Option[] = [
        { value: '100', label: '100px' },
        { value: '200', label: '200px' },
        { value: '300', label: '300px' },
    ];

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        onWidthChange(parseInt(event.target.value, 10));
    }

    return (
        <ControlSection
            title="columns"
            data-qa="controlsDemo_gridReact_ItemOptionsColumnConfigSection"
        >
            <Select
                value={columnWidth.toString()}
                onChange={handleChange}
                options={options}
                data-qa="controlsDemo_gridReact_ItemOptionsColumnConfigSelect"
                label="width"
            />
        </ControlSection>
    );
}
