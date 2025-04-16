import { forwardRef, LegacyRef, useState } from 'react';
import { RecordSet } from 'Types/collection';
import { AdaptiveButtons, ITabAdaptiveButtonItem } from 'Controls/tabs';
import { TSelectedKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { Label } from 'Controls/input';

const ITEMS = new RecordSet<ITabAdaptiveButtonItem>({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Merge request',
            additionalText: '№88221034142246',
        },
        {
            id: '2',
            title: 'Обсудить',
        },
        {
            id: '3',
            title: 'Лента',
        },
    ],
});

interface IItemTemplateProps {
    item: Model<ITabAdaptiveButtonItem>;
    selected: boolean;
    displayProperty: string;
}

function rightTemplate(props: IItemTemplateProps) {
    const { item } = props;
    const additionalText = item.get('additionalText');

    return !!additionalText ? (
        <Label className="controls-margin_left-s" caption={additionalText} />
    ) : null;
}

export default forwardRef(function ItemRightTemplate(_, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKey, setSelectedKey] = useState<TSelectedKey>('1');

    return (
        <div className="controls-margin_left-2xl ws-flexbox ws-justify-content-center" ref={ref}>
            <div data-qa="controlsDemo_capture">
                <AdaptiveButtons
                    className="controlsDemo_fixedWidth400"
                    selectedKey={selectedKey}
                    keyProperty="id"
                    items={ITEMS}
                    itemRightTemplate={rightTemplate}
                    onSelectedKeyChanged={setSelectedKey}
                    moreButtonAlign="end"
                />
            </div>
        </div>
    );
});
