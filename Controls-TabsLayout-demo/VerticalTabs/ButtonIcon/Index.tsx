import { forwardRef, LegacyRef, useState } from 'react';
import { Buttons, IVerticalTabs } from 'Controls-TabsLayout/verticalTabs';
import { RecordSet } from 'Types/collection';

export default forwardRef(function VerticalTabsOffsetDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [value, setValue] = useState('Текст');
    function onButtonClick(value: string) {
        setValue(value);
    }

    const items = new RecordSet<IVerticalTabs>({
        keyProperty: 'id',
        rawData: [
            {
                key: 1,
                title: 'Иконка',
                mainCounter: 852600,
                icon: 'icon-SabyBird',
            },
            {
                key: 2,
                title: 'Кнопка',
                mainCounter: 52600,
                buttonIcon: 'icon-SabyBird',
                buttonClickHandler: () => onButtonClick('Кнопка'),
            },
            {
                key: 3,
                title: 'Кнопка и иконка',
                mainCounter: 99,
                icon: 'icon-SabyBird',
                buttonIcon: 'icon-SabyBird',
                buttonClickHandler: () => onButtonClick('Кнопка и иконка'),
            },
        ],
    });

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="tw-flex tw-justify-start">
                <div className="controls-margin_right-m">
                    <Buttons items={items} />
                </div>
                <div className="controls-margin_right-m controlsDemo_fixedWidth200 tw-flex tw-justify-center tw-items-center">
                    {value}
                </div>
            </div>
        </div>
    );
});
