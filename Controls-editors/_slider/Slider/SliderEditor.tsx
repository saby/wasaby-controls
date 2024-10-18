import { memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { SliderBase } from './SliderBase';

interface ISliderEditorProps extends IPropertyGridPropertyEditorProps<number> {
    minValue?: number;
    maxValue?: number;
}

export const SliderEditor = memo((props: ISliderEditorProps) => {
    return <SliderBase {...props} />;
});
