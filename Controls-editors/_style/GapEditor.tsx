import { memo, Fragment, FC } from 'react';
import { IPropertyEditorProps } from 'Meta/types';
import { Number as NumberInput } from 'Controls/input';

interface IGapEditorProps extends IPropertyEditorProps<string> {
    value: string;
    onChange: (value: string) => void;
    LayoutComponent?: FC;
}

const integersLength = 3;

export const GapEditor = memo(function (props: IGapEditorProps) {
    const { value, onChange, LayoutComponent = Fragment } = props;

    return (
        <LayoutComponent>
            <NumberInput
                className="tw-w-full"
                value={Number(value?.replace(/px$/, '')) || 0}
                precision={0}
                valueChangedCallback={(newValue: number) => {
                    onChange(`${newValue?.toString() || '0'}px`);
                }}
                onlyPositive={true}
                integersLength={integersLength}
            />
        </LayoutComponent>
    );
});
