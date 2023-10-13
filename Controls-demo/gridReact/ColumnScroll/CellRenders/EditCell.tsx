import * as React from 'react';
import { Text as TextInput } from 'Controls/input';
import { Model } from 'Types/entity';
import { useItemData } from 'Controls/gridReact';

export default function EditCell(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (value) => {
            return item.set(property, value);
        },
        [item]
    );

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TextInput не типизирован.
        <TextInput
            value={String(renderValues[property])}
            className={'tw-w-full'}
            contrastBackground
            onValueChanged={onValueChanged}
            customEvents={['onValueChanged']}
        />
    );
}
