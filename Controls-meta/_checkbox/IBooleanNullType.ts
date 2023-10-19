import { BooleanType, Meta } from 'Types/meta';

export const IBooleanNullType = BooleanType.id('Controls/meta:IBooleanNullType').editor(() => {
    return import('Controls-editors/toggle').then(({ SwitchEditor }) => {
        return SwitchEditor;
    });
}) as Meta<boolean | null>;
