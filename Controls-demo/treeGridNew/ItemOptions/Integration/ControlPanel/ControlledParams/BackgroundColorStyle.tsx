import * as React from 'react';
import { ControlSection } from '../ui/ControlSection';
import { Select } from '../ui/Select';

export type TBackgroundStyle =
    | 'default'
    | 'danger'
    | 'success'
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'unaccented'
    | 'readonly'
    | 'info'
    | 'none';

interface BackgroundColorStyleProps {
    backgroundColor: TBackgroundStyle;
    onBackgroundColorChange: (color: TBackgroundStyle) => void;
}

export function BackgroundColorControl(props: BackgroundColorStyleProps): React.ReactElement {
    const { backgroundColor, onBackgroundColorChange } = props;

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        onBackgroundColorChange(event.target.value as TBackgroundStyle);
    }

    const options = [
        { value: 'default', label: 'Default' },
        { value: 'danger', label: 'Danger' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'unaccented', label: 'Unaccented' },
        { value: 'readonly', label: 'Readonly' },
        { value: 'info', label: 'Info' },
        { value: 'none', label: 'None' },
    ];

    return (
        <ControlSection
            title="getCellProps"
            data-qa="controlsDemo_gridReact_ItemOptionsBackgroundStyleSection"
        >
            <Select
                value={backgroundColor}
                onChange={handleChange}
                options={options}
                label="backgroundColorStyle"
                data-qa="controlsDemo_gridReact_ItemOptionsBackgroundStyleSelect"
            />
        </ControlSection>
    );
}
