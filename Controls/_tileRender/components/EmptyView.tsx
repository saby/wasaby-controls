import { ITileViewProps } from 'Controls/_tileRender/interface/ITileView';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { EmptyTemplateItem } from 'Controls/display';
import { ModulesManager } from 'RequireJsLoader/conduct';
import { isLoaded as isModuleLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { TEmptyTemplateAlign, TEmptyTemplateSpacing } from 'Controls/list';

export function getEmptyView(props: Pick<ITileViewProps, 'collection' | 'needShowEmptyTemplate'>) {
    const { needShowEmptyTemplate, collection } = props;
    const emptyTemplateItem = collection.getEmptyTemplateItem();
    const emptyTemplateItems = collection.getSourceCollection();
    const emptyRender = collection.getEmptyRender();
    const emptyRenderProps = collection.getEmptyRenderProps();

    if (!needShowEmptyTemplate || (!emptyTemplateItem && !emptyRender)) {
        return null;
    }

    const contentRender = getContentRender({
        emptyRender,
        emptyRenderProps,
        item: emptyTemplateItem,
        items: emptyTemplateItems,
        filter: collection.getFilter(),
    });

    return <EmptyComponent className={'ws-flex-grow-1'} contentRender={contentRender} />;
}

interface IGetContentRenderProps {
    emptyRender: React.ReactElement | null;
    emptyRenderProps: object | null;
    item: EmptyTemplateItem;
    items: RecordSet;
    filter: object;
}

function getContentRender(props: IGetContentRenderProps): React.ReactElement {
    if (props.emptyRender && React.isValidElement(props.emptyRender)) {
        const renderProps = props.emptyRenderProps ?? {};
        const classes = getEmptyRenderWrapperClasses(renderProps);
        return (
            <div className={classes} data-qa={'empty'}>
                {props.emptyRender}
            </div>
        );
    }

    const templateProps = {
        ...props.item?.getItemTemplateOptions?.(),
        item: props.item,
        items: props.items,
        filter: props.filter,
    };

    const emptyTemplate = props.item.getTemplate();

    //TODO: Вынести в templateLoader по аналогии с гридом
    if (typeof emptyTemplate === 'string') {
        if (ModulesManager.isModule(emptyTemplate) && isModuleLoaded(emptyTemplate)) {
            const TemplateComponent = loadSync(emptyTemplate) as React.FunctionComponent<Object>;
            return <TemplateComponent {...templateProps} />;
        } else {
            return <span>emptyTemplate</span>;
        }
    }

    return React.createElement(emptyTemplate, templateProps);
}

interface IEmptyWrapperProps {
    className?: string;
    contentRender: React.ReactElement;
}

function EmptyWrapper(props: IEmptyWrapperProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const className: string =
        (props.className ? `${props.className} ` : '') +
        'controls-BaseControl__emptyTemplate' +
        ' tw-h-full tw-w-full tw-flex tw-items-center';

    return (
        <div ref={ref} className={className}>
            <div className={'controls-BaseControl__emptyTemplate__contentWrapper'}>
                {props.contentRender}
            </div>
        </div>
    );
}

const EmptyComponent = React.forwardRef(EmptyWrapper);

interface IEmptyRenderWrapperClassesProps {
    align?: TEmptyTemplateAlign;
    bottomSpacing?: TEmptyTemplateSpacing;
    topSpacing?: TEmptyTemplateSpacing;
}

//TODO: Нужно будет перейти на утилиты
function getEmptyRenderWrapperClasses(props: IEmptyRenderWrapperClassesProps) {
    let classes = 'controls-ListView__empty';
    classes += ` controls-ListView__empty-textAlign_${props.align || 'center'}`;
    classes += ` controls-ListView__empty_topSpacing_${props.topSpacing || 'l'}`;
    classes += ` controls-ListView__empty_bottomSpacing_${props.bottomSpacing || 'l'}`;
    return classes;
}
