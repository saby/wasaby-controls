import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/Results';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ResultsBackgroundColorStyle from 'Controls-demo/gridNew/Results/BackgroundColorStyle/Index';
import ResultsCellTemplate from 'Controls-demo/gridNew/Results/CellTemplate/Index';
import ResultsFontColorStyle from 'Controls-demo/gridNew/Results/FontColorStyle/Index';
import ResultsFontSize from 'Controls-demo/gridNew/Results/FontSize/Index';
import ResultsFromMetaCustomResultsRow from 'Controls-demo/gridNew/Results/FromMeta/CustomResultsRow/Index';
import ResultsFontWeight from 'Controls-demo/gridNew/Results/FontWeight/Index';
import ResultsFromMetaCustomResultsCells from 'Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/Index';
import ResultsColspanCallback from 'Controls-demo/gridNew/Results/ResultsColspanCallback/Index';
import ResultsPositionBottom from 'Controls-demo/gridNew/Results/ResultsPosition/Bottom/Index';
import ResultsNoSticky from 'Controls-demo/gridNew/Results/NoSticky/Index';
import ResultsTemplateDefault from 'Controls-demo/gridNew/Results/ResultsTemplate/Default/Index';
import ResultsTemplate from 'Controls-demo/gridNew/Results/ResultsTemplate/Index';
import ResultsPositionTop from 'Controls-demo/gridNew/Results/ResultsPosition/Top/Index';
import ResultsTemplateAdditional from 'Controls-demo/gridNew/Results/ResultsTemplate/Additional/Index';
import ResultsSingleRecordResults from 'Controls-demo/gridNew/Results/SingleRecordResults/Index';
import ResultsTemplateUnaccented from 'Controls-demo/gridNew/Results/ResultsTemplate/Unaccented/Index';
import ResultsTemplateOptions from 'Controls-demo/gridNew/Results/ResultsTemplateOptions/Index';
import ResultsVisibilityHidden from 'Controls-demo/gridNew/Results/ResultsVisibility/Hidden/Index';
import ResultsSingleRecordResultsSimple from 'Controls-demo/gridNew/Results/SingleRecordResults/Simple/Index';
import ResultsSingleRecordResultsVisible from 'Controls-demo/gridNew/Results/SingleRecordResults/Visible/Index';
import ResultsSticky from 'Controls-demo/gridNew/Results/Sticky/Index';
import ResultsTextOverflow from 'Controls-demo/gridNew/Results/TextOverflow/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ResultsBackgroundColorStyle.getLoadConfig(),
            ...ResultsCellTemplate.getLoadConfig(),
            ...ResultsFontColorStyle.getLoadConfig(),
            ...ResultsFontSize.getLoadConfig(),
            ...ResultsFromMetaCustomResultsRow.getLoadConfig(),
            ...ResultsFontWeight.getLoadConfig(),
            ...ResultsFromMetaCustomResultsCells.getLoadConfig(),
            ...ResultsColspanCallback.getLoadConfig(),
            ...ResultsPositionBottom.getLoadConfig(),
            ...ResultsNoSticky.getLoadConfig(),
            ...ResultsTemplateDefault.getLoadConfig(),
            ...ResultsTemplate.getLoadConfig(),
            ...ResultsPositionTop.getLoadConfig(),
            ...ResultsTemplateAdditional.getLoadConfig(),
            ...ResultsSingleRecordResults.getLoadConfig(),
            ...ResultsTemplateUnaccented.getLoadConfig(),
            ...ResultsTemplateOptions.getLoadConfig(),
            ...ResultsVisibilityHidden.getLoadConfig(),
            ...ResultsSingleRecordResultsSimple.getLoadConfig(),
            ...ResultsSingleRecordResultsVisible.getLoadConfig(),
            ...ResultsSticky.getLoadConfig(),
            ...ResultsTextOverflow.getLoadConfig(),
        };
    }
}
