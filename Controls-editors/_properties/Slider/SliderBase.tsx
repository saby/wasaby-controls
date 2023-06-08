import { Fragment, memo, useCallback } from 'react';
import { IComponent, Meta } from 'Types/meta';
import { Base as SliderControl } from 'Controls/slider';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { IBasePropertyEditorProps } from '../BasePropertyEditorProps';

interface ISliderBaseProps extends IBasePropertyEditorProps<number, Meta<number>> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    minValue?: number;
    maxValue?: number;
    scaleLabelFormatter?: (val: number) => string;
    scaleStep?: number;
}

export const SliderBase = memo((props: ISliderBaseProps) => {
    const {
        value,
        onChange,
        LayoutComponent = Fragment,
        maxValue = 100,
        minValue = 0,
        scaleLabelFormatter,
        scaleStep,
    } = props;

    const onValueChanged = useCallback((val) => {
        onChange(val);
    }, []);

    return (
        <LayoutComponent>
            <SliderControl
                value={value}
                data-qa="controls-PropertyGrid__editor_slider"
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                minValue={minValue}
                maxValue={maxValue}
                scaleStep={scaleStep}
                scaleLabelFormatter={scaleLabelFormatter}
            />
        </LayoutComponent>
    );
});
