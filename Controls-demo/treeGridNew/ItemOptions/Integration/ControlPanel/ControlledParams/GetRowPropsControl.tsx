import * as React from 'react';
import { ControlSection } from '../ui/ControlSection';
import { Select } from '../ui/Select';
import { TSize } from 'Controls/interface';
import { IRoundAngles } from '../../Index';
import { TBorderVisibility } from 'Controls/display';

interface IGetRowPropsControlProps {
    borderVisibility: TBorderVisibility;
    setBorderVisibility: (borderVisibility: TBorderVisibility) => void;
    roundAngle: IRoundAngles;
    setRoundAngle: (roundAngle: IRoundAngles) => void;
}

export function GetRowPropsControl(props: IGetRowPropsControlProps): React.ReactElement {
    const { borderVisibility, setBorderVisibility, roundAngle, setRoundAngle } = props;

    const visibilityOptions = [
        { value: 'hidden', label: 'hidden' },
        { value: 'visible', label: 'visible' },
        { value: 'onhover', label: 'onhover' },
    ];

    const options = [
        { value: 'null', label: 'Нет закругления' },
        { value: '3xs', label: '3xs' },
        { value: '2xs', label: '2xs' },
        { value: 'xs', label: 'xs' },
        { value: 's', label: 's' },
        { value: 'm', label: 'm' },
        { value: 'l', label: 'l' },
        { value: 'xl', label: 'xl' },
        { value: '2xl', label: '2xl' },
        { value: '3xl', label: '3xl' },
    ];

    // Обработчик изменения видимости границы
    const handleBorderVisibilityChange = (value: TBorderVisibility): void => {
        setBorderVisibility(value);
    };

    // Обработчик изменения закругления углов
    const handleRoundAngleChange = (value: TSize): void => {
        setRoundAngle({
            roundAngleTL: value,
            roundAngleTR: value,
            roundAngleBL: value,
            roundAngleBR: value,
        });
    };

    return (
        <ControlSection
            title="getRowProps"
            data-qa="controlsDemo_gridReact_ItemOptionsCombinedSection"
        >
            <Select
                value={borderVisibility}
                onChange={(e) => handleBorderVisibilityChange(e.target.value as TBorderVisibility)}
                options={visibilityOptions}
                label="borderVisibility"
                data-qa="controlsDemo_gridReact_ItemOptionsBorderVisibilitySelect"
            />
            <div style={{ marginTop: '16px' }}>
                <Select
                    value={roundAngle.roundAngleTL}
                    onChange={(e) => handleRoundAngleChange(e.target.value as TSize)}
                    options={options}
                    label="roundAngle(BR|TR|TL|BL)"
                    data-qa="controlsDemo_gridReact_ItemOptionsRoundBorderSelect"
                />
            </div>
        </ControlSection>
    );
}
