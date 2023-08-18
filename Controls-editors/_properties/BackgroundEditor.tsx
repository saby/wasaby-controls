import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import {IConfiguration, IBackgroundDecorationOptions, BackgroundButton} from 'ExtControls/richColorPicker';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IBackgroundEditorProps extends IPropertyEditorProps<IConfiguration>, IBackgroundDecorationOptions {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    titlePosition?: string;
}

export const BackgroundEditor = memo((props: IBackgroundEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <BackgroundButton configuration={value}
                              onConfigurationChange={onChange}
                              baseTexture={props.baseTexture}
                              headingCaption={props.headingCaption}
                              imageLoader={props.imageLoader}
            />
        </LayoutComponent>
    );
});
