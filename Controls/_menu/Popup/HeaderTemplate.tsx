import * as React from 'react';
import HeaderWrapperTemplate, {
    IHeaderWrapperTemplateProps,
} from 'Controls/_menu/Popup/HeaderWrapperTemplate';
import { Title } from 'Controls/heading';

interface IHeaderTemplateProps extends IHeaderWrapperTemplateProps {
    caption?: string;
    cursor?: string;
    markerVisibility?: string;
    multiSelect?: boolean;
}

export default React.forwardRef(function HeaderTemplate(props: IHeaderTemplateProps, ref) {
    const allowAdaptive = props.isAdaptive && props.allowAdaptive !== false;
    if (props.caption) {
        return (
            <HeaderWrapperTemplate ref={ref} {...props}>
                <Title
                    className={`controls-MenuButton-header-caption-cursor-${
                        props.cursor || 'pointer'
                    } ws-ellipsis ${
                        (props.markerPosition !== 'right' &&
                            props.markerVisibility &&
                            props.markerVisibility !== 'hidden') ||
                        props.multiSelect
                            ? 'controls-MenuButton__popup-header-paddingLeft_marker' +
                              (allowAdaptive ? '_adaptive' : '')
                            : ''
                    }`}
                    caption={props.caption}
                    fontColorStyle={allowAdaptive ? 'default' : 'label'}
                    fontSize={
                        props.isAdaptive ? (props.allowAdaptive !== false ? '2xl' : 'xs') : 'm'
                    }
                    textTransform={allowAdaptive ? 'none' : 'uppercase'}
                    fontWeight={allowAdaptive ? 'bold' : 'normal'}
                    readOnly={true}
                    tooltip={props.caption}
                />
            </HeaderWrapperTemplate>
        );
    } else {
        return <HeaderWrapperTemplate ref={ref} {...props} />;
    }
});
