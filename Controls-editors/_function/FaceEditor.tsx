import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Fragment, useCallback, useMemo } from 'react';
import { lazy, importer } from 'UI/Async';

export interface IFaceEditorProps extends IPropertyGridPropertyEditorProps<IBalanceArgsValue> {
    LayoutComponent: unknown;
}

interface IDataObjectLink {
    Type: string;
    Id: number;
}

interface IBalanceArgsValue {
    Account?: IDataObjectLink;
    Face1?: IDataObjectLink;
    Face2?: IDataObjectLink;
    Face3?: IDataObjectLink;
    Face4?: IDataObjectLink;
}

const EDITOR = 'Entry/AccountingCatalog/accountAndDimensions:Component';
const AccountsEditor = lazy(() => importer(EDITOR));

/**
 * Редактор типа прикладного объекта "Лицо"
 */
function FaceEditor(props: IFaceEditorProps) {
    const { LayoutComponent = Fragment, value, onChange } = props;

    const accounts = useMemo(() => {
        if (!value || !value.Account) {
            return [];
        }

        return [value.Account.Id];
    }, [value]);

    const dimensions = useMemo(() => {
        if (!value) {
            return [[], [], [], []];
        }

        return [
            value.Face1?.Id ? [value.Face1.Id] : [],
            value.Face2?.Id ? [value.Face2.Id] : [],
            value.Face3?.Id ? [value.Face3.Id] : [],
            value.Face4?.Id ? [value.Face4.Id] : [],
        ];
    }, [value]);

    const onAccountSelectedKeysChanged = useCallback(
        (value) => {
            onChange(buildValue(value, dimensions));
        },
        [dimensions]
    );

    const onDimensionsSelectedKeysChanged = useCallback(
        (value) => {
            onChange(buildValue(accounts, value));
        },
        [accounts]
    );

    return (
        <LayoutComponent title={null}>
            <AccountsEditor
                accountSelectedKeys={accounts}
                dimensionsSelectedKeys={dimensions}
                organization={-1}
                organizationName="Все юрлица"
                documentDate={currentDate}
                account={account}
                dimension={dimension}
                labels={labels}
                borderVisibility={'partial'}
                onAccountSelectedKeysChanged={onAccountSelectedKeysChanged}
                onDimensionsSelectedKeysChanged={onDimensionsSelectedKeysChanged}
                name={'AccountsAndDimensions'}
            />
        </LayoutComponent>
    );
}

function buildValue(account: number[], dimensions: number[][]): IBalanceArgsValue {
    const [Face1, Face2, Face3, Face4] = dimensions;

    return {
        Account: buildDataObjectValue('BookkeepingAccount', account),
        Face1: buildDataObjectValue('Face', Face1),
        Face2: buildDataObjectValue('Face', Face2),
        Face3: buildDataObjectValue('Face', Face3),
        Face4: buildDataObjectValue('Face', Face4),
    };
}

function buildDataObjectValue(Type: string, selectedKeys: number[]): IDataObjectLink | undefined {
    if (Array.isArray(selectedKeys) && selectedKeys.length) {
        const [Id] = selectedKeys;
        return {
            Id,
            Type,
        };
    }
}

const currentDate = new Date();

const dimension = {
    multiSelect: false,
    defaultTaxation: true,
    emptyDimensionsItems: true,
};

const labels = {
    visible: false,
    accountLabelText: 'Счет',
    align: 'left',
    position: 'top',
};

const account = {
    multiSelect: false,
    selectionType: 'all',
    clickable: true,
    isRequired: true,
    placeholderLabel: 'счет',
    prePlaceholderText: 'Укажите',
    shortAccountTemplate: true,
};

export { FaceEditor };
