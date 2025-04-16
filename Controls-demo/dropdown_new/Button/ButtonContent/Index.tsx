import { SingleButton } from 'ExtControls/buttons';
import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { ForwardedRef } from 'react';

const Index = React.forwardRef((_props: unknown, ref: ForwardedRef<HTMLDivElement>) => {
    const items = new RecordSet({
        keyProperty: 'key',
        rawData: [
            { key: 1, title: 'Add', icon: 'icon-Bell' },
            { key: 2, title: 'Vacation', icon: 'icon-Vacation' },
            { key: 3, title: 'Time off', icon: 'icon-SelfVacation' },
            { key: 4, title: 'Hospital', icon: 'icon-Sick' },
            { key: 5, title: 'Business trip', icon: 'icon-statusDeparted' },
            {
                key: 6,
                title: 'Task',
                icon: 'icon-TFTask',
                additional: true,
            },
            {
                key: 7,
                title: 'Incident',
                icon: 'icon-Alert',
                additional: true,
            },
            {
                key: 8,
                title: 'Outfit',
                icon: 'icon-PermittedBuyers',
                additional: true,
            },
            {
                key: 9,
                title: 'Project',
                icon: 'icon-Document',
                additional: true,
            },
            {
                key: 10,
                title: 'Check',
                icon: 'icon-Statistics',
                additional: true,
            },
            {
                key: 11,
                title: 'Meeting',
                icon: 'icon-Groups',
                additional: true,
            },
            {
                key: 12,
                title: 'Treaties',
                icon: 'icon-Report',
                additional: true,
            },
        ],
    });
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <Button
                keyProperty="key"
                caption="Create"
                items={items}
                additionalProperty="pale"
                buttonContent={SingleButton}
                icon="icon-Add"
                captionPosition="end"
                className="controlsDemo-menuButton"
                data-qa="ControlsDemo_MenuButton__extra-items"
            />
        </div>
    );
});

export default Index;
