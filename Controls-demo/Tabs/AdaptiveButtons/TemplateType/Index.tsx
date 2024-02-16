import { AdaptiveButtons } from 'Controls/tabs';
import { forwardRef, useMemo, useState } from 'react';
import { RecordSet } from 'Types/collection';

export default forwardRef(function IconOnlyTemplateAdaptiveButtons(_, ref) {
    const [selectedKeyWithCaption, setSelectedKeyWithCaption] = useState('1');
    const selectedKeyWithCaptionChanged = (key: string) => {
        setSelectedKeyWithCaption(key);
    };

    const [selectedKeyWithMenuText, setSelectedKeyWithMenuText] = useState('1');
    const selectedKeyWithMenuTextChanged = (key: string) => {
        setSelectedKeyWithMenuText(key);
    };

    const [selectedKeyWithoutCaption, setSelectedKeyWithoutCaption] = useState('3');
    const selectedKeyWithoutCaptionChanged = (key: string) => {
        setSelectedKeyWithoutCaption(key);
    };

    const [selectedKeyWithCounter, setSelectedKeyWithCounter] = useState('1');
    const selectedKeyWithCounterChanged = (key: string) => {
        setSelectedKeyWithCounter(key);
    };

    const tabsWithCaption = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: '1',
                        title: 'first',
                        icon: 'icon-AddContact',
                        iconStyle: 'success',
                    },
                    {
                        id: '2',
                        title: 'second',
                        icon: 'icon-Admin',
                        iconStyle: 'danger',
                    },
                    {
                        id: '3',
                        title: 'third',
                        icon: 'icon-Android',
                        iconStyle: 'danger',
                    },
                    {
                        id: '4',
                        title: 'fourth',
                        icon: 'icon-AreaBlur',
                        iconStyle: 'warning',
                        iconTooltip: 'drop',
                    },
                    {
                        id: '5',
                        title: 'fifth',
                        icon: 'icon-AutoTuning',
                        iconStyle: 'warning',
                        iconTooltip: 'drop',
                    },
                    {
                        id: '6',
                        title: 'sixth',
                        icon: 'icon-Calc',
                        iconStyle: 'warning',
                        iconTooltip: 'drop',
                    },
                ],
            }),
        []
    );

    const tabsWithoutCaption = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: '1',
                        icon: 'icon-AddContact',
                        iconStyle: 'success',
                    },
                    {
                        id: '2',
                        icon: 'icon-Admin',
                        iconStyle: 'danger',
                    },
                    {
                        id: '3',
                        icon: 'icon-Android',
                        iconStyle: 'danger',
                    },
                    {
                        id: '4',
                        icon: 'icon-AreaBlur',
                        iconStyle: 'warning',
                        iconTooltip: 'drop',
                    },
                    {
                        id: '5',
                        icon: 'icon-AutoTuning',
                        iconStyle: 'success',
                    },
                    {
                        id: '6',
                        icon: 'icon-Calc',
                        iconStyle: 'success',
                    },
                ],
            }),
        []
    );

    const tabsWithCounter = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: '1',
                        icon: 'icon-AddContact',
                        iconSize: 's',
                        mainCounter: 11,
                    },
                    {
                        id: '2',
                        icon: 'icon-Admin',
                        iconSize: 'm',
                        mainCounter: 222,
                    },
                    {
                        id: '3',
                        icon: 'icon-Android',
                        iconSize: 'l',
                        mainCounter: 3333,
                    },
                    {
                        id: '4',
                        icon: 'icon-AreaBlur',
                        iconSize: 's',
                        mainCounter: 1,
                    },
                    {
                        id: '5',
                        icon: 'icon-AutoTuning',
                        iconSize: 'm',
                        mainCounter: 10,
                    },
                    {
                        id: '6',
                        icon: 'icon-AutoTuning',
                        iconSize: 'l',
                        mainCounter: 10,
                    },
                    {
                        id: '7',
                        icon: 'icon-AutoTuning',
                        mainCounter: 10,
                    },
                    {
                        id: '8',
                        icon: 'icon-AutoTuning',
                        mainCounter: 10,
                    },
                ],
            }),
        []
    );

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div data-qa="controlsDemo_capture">
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">templateType='TextAndIcon'</div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithCaption}
                        items={tabsWithCaption}
                        containerWidth={400}
                        onSelectedKeyChanged={selectedKeyWithCaptionChanged}
                        customEvents={['onSelectedKeyChanged']}
                        templateType="TextAndIcon"
                    />
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">templateType='Icon'</div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithMenuText}
                        items={tabsWithCaption}
                        containerWidth={200}
                        onSelectedKeyChanged={selectedKeyWithMenuTextChanged}
                        customEvents={['onSelectedKeyChanged']}
                        templateType="Icon"
                    />
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">templateType='Icon'</div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithoutCaption}
                        items={tabsWithoutCaption}
                        containerWidth={200}
                        onSelectedKeyChanged={selectedKeyWithoutCaptionChanged}
                        customEvents={['onSelectedKeyChanged']}
                        templateType="Icon"
                    />
                </div>
                <div>
                    <div className="controls-text-label">templateType='IconAndCounter'</div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithCounter}
                        displayProperty="mainCounter"
                        items={tabsWithCounter}
                        containerWidth={300}
                        onSelectedKeyChanged={selectedKeyWithCounterChanged}
                        customEvents={['onSelectedKeyChanged']}
                        templateType="IconAndCounter"
                    />
                </div>
            </div>
        </div>
    );
});
