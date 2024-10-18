import { Control } from 'UI/Base';
import { StackOpener } from 'Controls/popup';
import { RecordSet } from 'Types/collection';

interface ICreateLeadOptions {
    themeData?: object;
}
/* eslint-disable ui-modules-dependencies */
/**
 * Действие создания лида
 *
 * @public
 */
export default class CreateLead {
    private _stackOpener: StackOpener;

    execute({ themeData }: ICreateLeadOptions = {}, initiator: Control): void {
        if (themeData) {
            this._openLead(themeData['@Регламент'], initiator);
        } else {
            import('CRM/info')
                .then(({ Loader, Info }) => {
                    Loader.init();
                    return Promise.all([Promise.resolve(Info), Loader.loadData()]);
                })
                .then(([Info]) => {
                    const singleThemeId = Info.get('SingleSaleThemeId');

                    if (singleThemeId) {
                        this._openLead(singleThemeId, initiator);
                        return;
                    }

                    this._openThemeSelector(initiator);
                });
        }
    }

    destroy(): void {
        if (this._stackOpener) {
            this._stackOpener.destroy();
            this._stackOpener = null;
        }
    }

    private _openLead(themeId: number, opener: Control): void {
        import('EDO3/opener').then(({ Dialog }) => {
            new Dialog().open(
                {
                    filter: {
                        'Лид.Регламент': themeId,
                        'ТипДокумента.ТипДокумента': 'Лид',
                        ВызовИзБраузера: true,
                        ФильтрДокументНашаОрганизация: -1,
                    },
                },
                {
                    opener,
                    openMode: 4,
                }
            );
        });
    }

    private _openThemeSelector(opener: Control): void {
        if (!this._stackOpener) {
            this._stackOpener = new StackOpener();
        }

        this._stackOpener.open({
            opener,
            template: 'CRMClient/Controls/ThemeChoice/List',
            templateOptions: {
                expandByItemClick: true,
                filter: {
                    ThemesTypes: ['Лид'],
                    noEmptyFolders: true,
                    ВидДерева: 'С узлами и листьями',
                    Разворот: 'С разворотом',
                },
            },
            eventHandlers: {
                onResult: (items: RecordSet) => {
                    this._openLead(items.at(0).getKey(), opener);
                },
            },
        });
    }
}
/* eslint-enable ui-modules-dependencies */
