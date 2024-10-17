import * as React from 'react';
import { useCallback, useState } from 'react';
import { Control as RadioGroup } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
// import { ForcedAdaptiveModeHoc } from 'UI/Adaptive';

const ADAPTIVE_MODE_ITEMS = [
    { key: null, title: 'Не установлен' },
    { key: 'sm-', title: 'Менее sm' },
    { key: 'sm', title: 'sm' },
    { key: 'md', title: 'md' },
    { key: 'lg', title: 'lg' },
];

const ADAPTIVE_MODE_SOURCE = new RecordSet({
    keyProperty: 'id',
    rawData: ADAPTIVE_MODE_ITEMS,
});

function getWidth(am: string): string {
    if (!am) {
        return 'auto';
    }

    if (am === 'sm-') {
        return '639px';
    }

    if (am === 'sm') {
        return '640px';
    }

    if (am === 'md') {
        return '768px';
    }

    if (am === 'lg') {
        return '1024px';
    }
}

interface IProps {
    children: React.ReactElement;
}
function ModeSwitcher(props: IProps, ref: React.Ref<HTMLDivElement>): React.ReactElement {
    const [selectedAM, setSelectedAM] = useState(null);
    const handlerSK = useCallback(
        function (id) {
            setSelectedAM(id);
        },
        [setSelectedAM]
    );

    const widthStyle = {
        width: getWidth(selectedAM),
        outline: 'solid 1px orange',
        borderRadius: '2px',
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <div className="controlsDemo__wrapper" style={{ width: '640px' }}>
                <div className="controls-text-label">Режим адаптивности</div>
                <div className="controlsDemo__wrapper">
                    <RadioGroup
                        items={ADAPTIVE_MODE_SOURCE}
                        displayProperty="title"
                        direction="horizontal"
                        keyProperty="key"
                        selectedKey={selectedAM}
                        onSelectedKeyChanged={handlerSK}
                        customEvents={['onSelectedKeyChanged']}
                    />
                </div>
            </div>
            <div className="controlsDemo__wrapper" style={widthStyle}>
                {/* <ForcedAdaptiveModeHoc mode={selectedAM}> */}
                {props.children}
                {/* </ForcedAdaptiveModeHoc> */}
            </div>
        </div>
    );
}

const modeSwitcher = React.forwardRef(ModeSwitcher);
modeSwitcher.displayName = 'Controls-demo..ModeSwitcher';
export default modeSwitcher;
