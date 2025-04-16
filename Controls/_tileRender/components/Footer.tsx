import * as React from 'react';
import { StickyBlock } from 'Controls/stickyBlock';
import { TBackgroundStyle } from 'Controls/interface';
import { ITileViewProps, TTileOrientation } from 'Controls/_tileRender/interface/ITileView';
import { FooterItem } from 'Controls/display';
import { ModulesManager } from 'RequireJsLoader/conduct';
import { isLoaded as isModuleLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

export function getFooter(
    props: Pick<
        ITileViewProps,
        | 'collection'
        | 'orientation'
        | 'stickyFooter'
        | 'backgroundStyle'
        | 'style'
        | 'footerTemplateOptions'
    >
) {
    const footer = props.collection?.getFooter();
    const footerRender = props.collection?.getFooterRender();
    const footerRenderProps = props.collection?.getFooterRenderProps() || {};

    if (!footer && !footerRender) {
        return null;
    }

    const contentRender = getContentRender({
        item: footer,
        orientation: props.orientation,
        footerTemplateOptions: props.footerTemplateOptions,
        footerRender,
        footerRenderProps,
    });

    return (
        <Footer
            stickyFooter={props.stickyFooter}
            contentRender={contentRender}
            style={props.style}
            backgroundStyle={props.backgroundStyle}
            orientation={props.orientation}
        />
    );
}

interface IGetContentRender {
    item: FooterItem;
    orientation?: TTileOrientation;
    footerTemplateOptions?: object;
    footerRender: React.ReactElement | null;
    footerRenderProps?: object;
}

function getContentRender(props: IGetContentRender): React.ReactElement {
    if (props.footerRender && React.isValidElement(props.footerRender)) {
        const renderProps = props.footerRenderProps ?? {};
        return React.cloneElement(props.footerRender, renderProps);
    }

    const footerTemplate = props.item.getContentTemplate();

    const footerTemplateOptions = props.footerTemplateOptions ?? {};

    //TODO: Вынести в templateLoader по аналогии с гридом
    if (typeof footerTemplate === 'string') {
        if (ModulesManager.isModule(footerTemplate) && isModuleLoaded(footerTemplate)) {
            const TemplateComponent = loadSync(footerTemplate) as React.FunctionComponent<Object>;
            return <TemplateComponent {...footerTemplateOptions} />;
        } else {
            return <>footerTemplate</>;
        }
    }

    return React.createElement(footerTemplate, footerTemplateOptions);
}

interface IFooterProps {
    stickyFooter?: boolean;
    orientation?: 'vertical' | 'horizontal';
    backgroundStyle?: TBackgroundStyle;
    style?: 'master' | 'default';
    contentRender: React.ReactElement;
}

function Footer(props: IFooterProps) {
    const { stickyFooter, orientation, backgroundStyle, style, contentRender } = props;

    if (stickyFooter) {
        return (
            <StickyBlock
                position={orientation === 'horizontal' ? 'right' : 'bottom'}
                backgroundStyle={backgroundStyle || style}
            >
                <div
                    className={`controls-TileView__footer controls-TileView__footer_${orientation}`}
                >
                    {contentRender}
                </div>
            </StickyBlock>
        );
    }

    return (
        <div className={`controls-TileView__footer controls-TileView__footer_${orientation}`}>
            {contentRender}
        </div>
    );
}
