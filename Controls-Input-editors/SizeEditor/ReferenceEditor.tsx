import { Fragment, memo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Control as ChipsControl } from 'Controls/Chips';
import { SelectedKey } from 'Controls/source';
import { RecordSet } from 'Types/collection';
import { useContent } from 'UICore/Jsx';

interface ISizeEditorProps extends IPropertyGridPropertyEditorProps<String> {
    titlePosition?: string;
}

const CUSTOM_EVENTS = ['onSelectedKeyChanged'];

const CHIPS_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 's',
            caption: 'S',
        },
        {
            id: 'm',
            caption: 'M',
        },
        {
            id: 'l',
            caption: 'L',
        },
    ],
});

export const ReferenceEditor = memo((props: ISizeEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [selectedKey, setSelectedKey] = useState<string | null>(
        value?.replace?.('controls-input_size-', '') || 's'
    );

    const onSelectedKey = (key: string) => {
        setSelectedKey(key);
        onChange(`controls-input_size-${key}`);
    };

    return (
        <LayoutComponent>
            <div className="tw-flex tw-align-baseline">
                <SelectedKey
                    items={CHIPS_ITEMS}
                    selectedKey={selectedKey}
                    onSelectedKeyChanged={onSelectedKey}
                    customEvents={CUSTOM_EVENTS}
                    content={useContent((props) => {
                        return (
                            <ChipsControl
                                {...props}
                                ref={props.$wasabyRef}
                                keyProperty="id"
                                inlineHeight="s"
                                fontSize="s"
                            />
                        );
                    })}
                />
            </div>
        </LayoutComponent>
    );
});
