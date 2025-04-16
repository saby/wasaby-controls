import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Navigation';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NavigationCutBrowserCut from 'Controls-demo/list_new/Navigation/Cut/BrowserCut/Index';
import NavigationCutButtonPositionCenter from 'Controls-demo/list_new/Navigation/Cut/ButtonPosition/Center/Index';
import NavigationCutButtonPosition from 'Controls-demo/list_new/Navigation/Cut/ButtonPosition/Index';
import NavigationCutButtonPositionStart from 'Controls-demo/list_new/Navigation/Cut/ButtonPosition/Start/Index';
import NavigationCutContrastBackgroundDefault from 'Controls-demo/list_new/Navigation/Cut/ContrastBackground/Default/Index';
import NavigationCutContrastBackground from 'Controls-demo/list_new/Navigation/Cut/ContrastBackground/Index';
import NavigationCutCutSize from 'Controls-demo/list_new/Navigation/Cut/CutSize/Index';
import NavigationCutContrastBackgroundFalse from 'Controls-demo/list_new/Navigation/Cut/ContrastBackground/False/Index';
import NavigationCutCutSizeM from 'Controls-demo/list_new/Navigation/Cut/CutSize/M/Index';
import NavigationCutCutSizeL from 'Controls-demo/list_new/Navigation/Cut/CutSize/L/Index';
import NavigationCutCutSizeS from 'Controls-demo/list_new/Navigation/Cut/CutSize/S/Index';
import NavigationCut from 'Controls-demo/list_new/Navigation/Cut/Index';
import NavigationCutListCut from 'Controls-demo/list_new/Navigation/Cut/ListCut/Index';
import NavigationDigitPaging from 'Controls-demo/list_new/Navigation/DigitPaging/Index';
import NavigationDigitPagingMinElements from 'Controls-demo/list_new/Navigation/DigitPaging/MinElements/Index';
import NavigationDigitPagingWithItemActions from 'Controls-demo/list_new/Navigation/DigitPaging/WithItemActions/Index';
import NavigationDigitPagingWithoutScroll from 'Controls-demo/list_new/Navigation/DigitPaging/WithoutScroll/Index';
import NavigationCutRecount from 'Controls-demo/list_new/Navigation/Cut/Recount/Index';
import NavigationDigitPagingWithScroll from 'Controls-demo/list_new/Navigation/DigitPaging/WithScroll/Index';
import NavigationDirection from 'Controls-demo/list_new/Navigation/Direction/Index';
import NavigationHasMorePaging from 'Controls-demo/list_new/Navigation/HasMorePaging/Index';
import NavigationMaxCountAutoLoad from 'Controls-demo/list_new/Navigation/MaxCountAutoLoad/Index';
import NavigationMaxCountValue from 'Controls-demo/list_new/Navigation/MaxCountValue/Index';
import NavigationMoreButtonBase from 'Controls-demo/list_new/Navigation/MoreButton/Base/Index';
import NavigationMoreButton from 'Controls-demo/list_new/Navigation/MoreButton/Index';
import NavigationMoreButtonTemplate from 'Controls-demo/list_new/Navigation/MoreButton/Template/Index';
import NavigationMoreButtonButtonConfig from 'Controls-demo/list_new/Navigation/MoreButton/ButtonConfig/Index';
import NavigationMoreFontColorStyleDanger from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Danger/Index';
import NavigationMoreFontColorStyle from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Index';
import NavigationMoreFontColorStyleDefault from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Default/Index';
import NavigationMoreFontColorStyleDefaultValue from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/DefaultValue/Index';
import NavigationMoreFontColorStyleInfo from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Info/Index';
import NavigationMoreFontColorStyleLink from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Link/Index';
import NavigationMoreFontColorStyleLabel from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Label/Index';
import NavigationMoreFontColorStylePrimary from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Primary/Index';
import NavigationMoreFontColorStyleSecondary from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Secondary/Index';
import NavigationMoreFontColorStyleUnaccented from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Unaccented/Index';
import NavigationMoreFontColorStyleSuccess from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Success/Index';
import NavigationPagingBasicAllArrowsCount from 'Controls-demo/list_new/Navigation/Paging/Basic/AllArrowsCount/Index';
import NavigationPagingBasicDefault from 'Controls-demo/list_new/Navigation/Paging/Basic/Default/Index';
import NavigationMoreFontColorStyleWarning from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Warning/Index';
import NavigationPagingBasicResetButtonDay from 'Controls-demo/list_new/Navigation/Paging/Basic/ResetButtonDay/Index';
import NavigationPagingBasicShowEndButton from 'Controls-demo/list_new/Navigation/Paging/Basic/ShowEndButton/Index';
import NavigationPagingEdgesUpDirection from 'Controls-demo/list_new/Navigation/Paging/EdgesUpDirection/Index';
import NavigationPagingEdges from 'Controls-demo/list_new/Navigation/Paging/Edges/Index';
import NavigationPagingEndDefault from 'Controls-demo/list_new/Navigation/Paging/End/Default/Index';
import NavigationPagingEdge from 'Controls-demo/list_new/Navigation/Paging/Edge/Index';
import NavigationPagingEndContentTemplate from 'Controls-demo/list_new/Navigation/Paging/End/ContentTemplate/Index';
import NavigationPagingLeftTemplate from 'Controls-demo/list_new/Navigation/Paging/LeftTemplate/Index';
import NavigationPagingNumbers from 'Controls-demo/list_new/Navigation/Paging/Numbers/Index';
import NavigationPagingPositionLeft from 'Controls-demo/list_new/Navigation/Paging/Position/Left/Index';
import NavigationPagingPositionRightTemplate from 'Controls-demo/list_new/Navigation/Paging/Position/RightTemplate/Index';
import NavigationScrollPaging from 'Controls-demo/list_new/Navigation/ScrollPaging/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NavigationCutBrowserCut.getLoadConfig(),
            ...NavigationCutButtonPositionCenter.getLoadConfig(),
            ...NavigationCutButtonPosition.getLoadConfig(),
            ...NavigationCutButtonPositionStart.getLoadConfig(),
            ...NavigationCutContrastBackgroundDefault.getLoadConfig(),
            ...NavigationCutContrastBackground.getLoadConfig(),
            ...NavigationCutCutSize.getLoadConfig(),
            ...NavigationCutContrastBackgroundFalse.getLoadConfig(),
            ...NavigationCutCutSizeM.getLoadConfig(),
            ...NavigationCutCutSizeL.getLoadConfig(),
            ...NavigationCutCutSizeS.getLoadConfig(),
            ...NavigationCut.getLoadConfig(),
            ...NavigationCutListCut.getLoadConfig(),
            ...NavigationDigitPaging.getLoadConfig(),
            ...NavigationDigitPagingMinElements.getLoadConfig(),
            ...NavigationDigitPagingWithItemActions.getLoadConfig(),
            ...NavigationDigitPagingWithoutScroll.getLoadConfig(),
            ...NavigationCutRecount.getLoadConfig(),
            ...NavigationDigitPagingWithScroll.getLoadConfig(),
            ...NavigationDirection.getLoadConfig(),
            ...NavigationHasMorePaging.getLoadConfig(),
            ...NavigationMaxCountAutoLoad.getLoadConfig(),
            ...NavigationMaxCountValue.getLoadConfig(),
            ...NavigationMoreButtonBase.getLoadConfig(),
            ...NavigationMoreButton.getLoadConfig(),
            ...NavigationMoreButtonTemplate.getLoadConfig(),
            ...NavigationMoreButtonButtonConfig.getLoadConfig(),
            ...NavigationMoreFontColorStyleDanger.getLoadConfig(),
            ...NavigationMoreFontColorStyle.getLoadConfig(),
            ...NavigationMoreFontColorStyleDefault.getLoadConfig(),
            ...NavigationMoreFontColorStyleDefaultValue.getLoadConfig(),
            ...NavigationMoreFontColorStyleInfo.getLoadConfig(),
            ...NavigationMoreFontColorStyleLink.getLoadConfig(),
            ...NavigationMoreFontColorStyleLabel.getLoadConfig(),
            ...NavigationMoreFontColorStylePrimary.getLoadConfig(),
            ...NavigationMoreFontColorStyleSecondary.getLoadConfig(),
            ...NavigationMoreFontColorStyleUnaccented.getLoadConfig(),
            ...NavigationMoreFontColorStyleSuccess.getLoadConfig(),
            ...NavigationPagingBasicAllArrowsCount.getLoadConfig(),
            ...NavigationPagingBasicDefault.getLoadConfig(),
            ...NavigationMoreFontColorStyleWarning.getLoadConfig(),
            ...NavigationPagingBasicResetButtonDay.getLoadConfig(),
            ...NavigationPagingBasicShowEndButton.getLoadConfig(),
            ...NavigationPagingEdgesUpDirection.getLoadConfig(),
            ...NavigationPagingEdges.getLoadConfig(),
            ...NavigationPagingEndDefault.getLoadConfig(),
            ...NavigationPagingEdge.getLoadConfig(),
            ...NavigationPagingEndContentTemplate.getLoadConfig(),
            ...NavigationPagingLeftTemplate.getLoadConfig(),
            ...NavigationPagingNumbers.getLoadConfig(),
            ...NavigationPagingPositionLeft.getLoadConfig(),
            ...NavigationPagingPositionRightTemplate.getLoadConfig(),
            ...NavigationScrollPaging.getLoadConfig(),
        };
    }
}
