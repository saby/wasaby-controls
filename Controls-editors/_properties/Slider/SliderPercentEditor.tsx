import { memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { SliderBase } from './SliderBase';

interface ISliderPercentEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    startTitle: string;
    endTitle: string;
}

export const SliderPercentEditor = memo((props: ISliderPercentEditorProps) => {
    const { startTitle, endTitle } = props;
    const scaleLabelFormatter = (value: number): string => {
        if (value === 0) {
            return startTitle;
        }
        if (value === 100) {
            return endTitle;
        }

        return '';
    };

    return <SliderBase scaleLabelFormatter={scaleLabelFormatter} scaleStep={100} {...props} />;
});
