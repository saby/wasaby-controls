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
    tagClassName: string;
    setTagClassName: (tagClassName: string) => void;
}

export function GetCellPropsControl(props: BackgroundColorStyleProps): React.ReactElement {
    const { backgroundColor, onBackgroundColorChange, tagClassName, setTagClassName } = props;

    function handleChangeBGColor(event: React.ChangeEvent<HTMLSelectElement>): void {
        onBackgroundColorChange(event.target.value as TBackgroundStyle);
    }

    function handleChangeTagClass(event: React.ChangeEvent<HTMLSelectElement>): void {
        setTagClassName(event.target.value as string);
    }

    const optionsBG = [
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
    const optionsTagClass = [
        { value: '', label: 'Без передаваемых классов' },
        { value: 'test-tag-class', label: 'Увеличенный уголок' },
    ];

    return (
        <ControlSection
            title="getCellProps"
            data-qa="controlsDemo_gridReact_ItemOptionsBackgroundStyleSection"
        >
            <Select
                value={backgroundColor}
                onChange={handleChangeBGColor}
                options={optionsBG}
                label="backgroundColorStyle"
                data-qa="controlsDemo_gridReact_ItemOptionsBackgroundStyleSelect"
            />
            <Select
                value={tagClassName}
                onChange={handleChangeTagClass}
                options={optionsTagClass}
                label="tagClassName"
                data-qa="controlsDemo_gridReact_ItemOptionsTagClassNameSelect"
            />
        </ControlSection>
    );
}
