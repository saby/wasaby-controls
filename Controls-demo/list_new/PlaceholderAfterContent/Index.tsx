import * as React from 'react';
import { ItemsView as ListView } from 'Controls/list';
import { Container } from 'Controls/scroll';
import { RecordSet } from 'Types/collection';
import { getFewCategories } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const ITEMS = new RecordSet({
    rawData: getFewCategories(),
    keyProperty: 'key',
});

export default React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <Container className={'controlsDemo_fixedWidth1000 controlsDemo__height300'}>
                <ListView placeholderAfterContent items={ITEMS} />
            </Container>
        </div>
    );
});
