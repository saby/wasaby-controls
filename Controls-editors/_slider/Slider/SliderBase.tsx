import { Fragment, memo } from 'react';
import { IComponent, Meta } from 'Types/meta';
import { Base as SliderControl } from 'Controls/slider';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IBasePropertyEditorProps } from 'Controls-editors/properties';

const CUSTOM_EVENTS = ['onValueChanged'];

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

    return (
        <LayoutComponent>
            <SliderControl
                value={value}
                data-qa="controls-PropertyGrid__editor_slider"
                onValueChanged={onChange}
                customEvents={CUSTOM_EVENTS}
                minValue={minValue}
                maxValue={maxValue}
                scaleStep={scaleStep}
                scaleLabelFormatter={scaleLabelFormatter}
            />
        </LayoutComponent>
    );
});
