import { forwardRef, LegacyRef, useState } from 'react';
import { Buttons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';
import { data } from '../tabsItems';
import { Infobox } from 'Controls/popupTargets';

const ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: data.getDefaultItems(),
});

function onMouseEnter(e: Event, key) {
    Infobox.openPopup({
        target: e.target,
        opener: e.target,
        message: `Подсказка для элемента с id #${key}`,
    });
}

function onMouseLeave() {
    Infobox.closePopup();
}

export default forwardRef(function ItemMouseEnter(_, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKey, setSelectedKey] = useState('1');
    return (
        <div className="controls-margin_left-2xl ws-flexbox ws-justify-content-center" ref={ref}>
            <div className="controlsDemo_fixedWidth500" data-qa="controlsDemo_capture">
                <Buttons
                    selectedKey={selectedKey}
                    keyProperty="id"
                    items={ITEMS}
                    onSelectedKeyChanged={setSelectedKey}
                    onItemMouseEnter={onMouseEnter}
                    onItemMouseLeave={onMouseLeave}
                    customEvents={['onSelectedKeyChanged', 'onItemMouseEnter', 'onItemMouseLeave']}
                />
            </div>
        </div>
    );
});
