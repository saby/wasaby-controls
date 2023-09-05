import { memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { SliderBase } from './SliderBase';

interface ISliderEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    minValue?: number;
    maxValue?: number;
}

export const SliderEditor = memo((props: ISliderEditorProps) => {
    return <SliderBase {...props} />;
});
