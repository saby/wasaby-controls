import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import BackgroundButton, {IBackgroundButton} from 'ExtControls/BackgroundButton';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IBackgroundEditorProps extends IPropertyEditorProps<IBackgroundButton['background']>, IBackgroundButton {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    titlePosition?: string;
}

export const BackgroundEditor = memo((props: IBackgroundEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <BackgroundButton background={value}
                              onBackgroundChange={onChange}
                              baseTexture={props.baseTexture}
                              headingCaption={props.headingCaption}
                              imageLoader='DOCVIEW3/backgroundImage:Button'
            />
        </LayoutComponent>
    );
});
