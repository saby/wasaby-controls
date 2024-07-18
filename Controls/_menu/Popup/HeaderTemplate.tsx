import * as React from 'react';
import HeaderWrapperTemplate, {
    IHeaderWrapperTemplateProps,
} from 'Controls/_menu/Popup/HeaderWrapperTemplate';
import { Title } from 'Controls/heading';

interface IHeaderTemplateProps extends IHeaderWrapperTemplateProps {
    caption?: string;
    markerVisibility?: string;
    multiSelect?: boolean;
}

export default React.forwardRef(function HeaderTemplate(props: IHeaderTemplateProps, ref) {
    if (props.caption) {
        return (
            <HeaderWrapperTemplate ref={ref} {...props}>
                <Title
                    className={`ws-ellipsis ${
                        (props.markerVisibility && props.markerVisibility !== 'hidden') ||
                        props.multiSelect
                            ? 'controls-MenuButton__popup-header-paddingLeft_marker'
                            : ''
                    }`}
                    caption={props.caption}
                    fontColorStyle={
                        props.isAdaptive && props.allowAdaptive !== false ? 'default' : 'label'
                    }
                    fontSize={
                        props.isAdaptive ? (props.allowAdaptive !== false ? '2xl' : 'xs') : 'm'
                    }
                    textTransform={
                        props.isAdaptive && props.allowAdaptive !== false ? 'none' : 'uppercase'
                    }
                    fontWeight={
                        props.isAdaptive && props.allowAdaptive !== false ? 'bold' : 'normal'
                    }
                    readOnly={true}
                    tooltip={props.caption}
                />
            </HeaderWrapperTemplate>
        );
    } else {
        return <HeaderWrapperTemplate ref={ref} {...props} />;
    }
});
