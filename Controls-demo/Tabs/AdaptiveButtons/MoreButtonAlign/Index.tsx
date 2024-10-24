import { forwardRef, useState } from 'react';
import { AdaptiveButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';

const tabs = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Контакты',
        },
        {
            id: '2',
            title: 'Задачи',
        },
        {
            id: '3',
            title: 'Бизнес',
        },
        {
            id: '4',
            title: 'Деньги',
        },
        {
            id: '5',
            title: 'Лучшие сотрудники',
        },
        {
            id: '6',
            title: 'Самые важные документы',
        },
        {
            id: '7',
            title: 'Очень дорогие компании',
        },
    ],
});

export default forwardRef(function MoreButtonAlign(_, ref) {
    const [selectedKeyWithoutAlign, setSelectedKeyWithoutAlign] = useState('1');
    const selectedKeyWithoutAlignChanged = (key: string) => {
        setSelectedKeyWithoutAlign(key);
    };
    const [selectedKeyWithRightAlign, setSelectedKeyWithRightAlign] = useState('1');
    const selectedKeyWithRightAlignChanged = (key: string) => {
        setSelectedKeyWithRightAlign(key);
    };
    const [selectedKeyWithLeftAlign, setSelectedKeyWithLeftAlign] = useState('1');
    const selectedKeyWithLeftAlignChanged = (key: string) => {
        setSelectedKeyWithLeftAlign(key);
    };
    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div data-qa="controlsDemo_capture">
                <div className="controls-margin_bottom-2xl controlsDemo_fixedWidth500">
                    <div className="controls-text-label">
                        Не заданы опции align и moreButtonAlign
                    </div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithoutAlign}
                        items={tabs}
                        onSelectedKeyChanged={selectedKeyWithoutAlignChanged}
                        customEvents={['onSelectedKeyChanged']}
                        onClick={(e) => e.stopPropagation()}
                        data-qa="Controls-demo_Tabs_AdaptiveButtons_MoreButtonAlign__align-none"
                    />
                </div>
                <div className="controls-margin_bottom-2xl controlsDemo_fixedWidth500">
                    <div className="controls-text-label">align='right' и moreButtonAlign='end'</div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithRightAlign}
                        items={tabs}
                        moreButtonAlign="end"
                        align="right"
                        onSelectedKeyChanged={selectedKeyWithRightAlignChanged}
                        customEvents={['onSelectedKeyChanged']}
                        onClick={(e) => e.stopPropagation()}
                        data-qa="Controls-demo_Tabs_AdaptiveButtons_MoreButtonAlign__align-right"
                    />
                </div>
                <div className="controlsDemo_fixedWidth500">
                    <div className="controls-text-label">
                        align='left' и moreButtonAlign='start'
                    </div>
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKeyWithLeftAlign}
                        items={tabs}
                        moreButtonAlign="start"
                        align="left"
                        onSelectedKeyChanged={selectedKeyWithLeftAlignChanged}
                        customEvents={['onSelectedKeyChanged']}
                        onClick={(e) => e.stopPropagation()}
                        data-qa="Controls-demo_Tabs_AdaptiveButtons_MoreButtonAlign__align-left"
                    />
                </div>
            </div>
        </div>
    );
});
