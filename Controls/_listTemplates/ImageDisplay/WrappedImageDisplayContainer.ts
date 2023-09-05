import { Control, TemplateFunction } from 'UI/Base';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { IImageDisplayContainerOptions } from './ImageDisplayContainer';

import * as Template from 'wml!Controls/_listTemplates/ImageDisplay/WrappedImageDisplayContainer';

interface IProps extends IImageDisplayContainerOptions {
    _dataOptionsValue: IContextOptionsValue;
    storeId: string;
}

class WrappedImageDisplayContainer extends Control<IProps> {
    protected _template: TemplateFunction = Template;
}

export default connectToDataContext(WrappedImageDisplayContainer);
