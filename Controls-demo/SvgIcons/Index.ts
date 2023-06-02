import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/SvgIcons/Index';
import { Getter } from 'File/ResourceGetter/fileSystem';
import 'css!Controls-demo/SvgIcons/Index';
import * as IconUtil from 'Controls/Utils/Icon';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;

    protected _beforeMount(): void {
        const origGetIcon = IconUtil.getIcon;
        IconUtil.isSVGIcon = (icon) => {
            return icon && icon.indexOf('.svg') !== -1;
        };
        IconUtil.getIcon = (icon) => {
            return icon && icon.indexOf('.svg') !== -1
                ? '##example'
                : origGetIcon(icon);
        };

        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: '1',
                    icon: 'icon.svg',
                    iconStyle: 'info',
                    title: 'Message',
                },
                {
                    key: '2',
                    title: 'Report',
                },
                {
                    key: '3',
                    icon: 'icon-Sandclock',
                    title: 'Task',
                },
                {
                    key: '4',
                    icon: 'icon-Successful',
                    title: 'Task',
                },
            ],
        });
    }

    protected _attachIcon() {
        const fileSystem = new Getter({
            extensions: ['svg'],
        });
        fileSystem.getFiles().then((result) => {
            this._uploadIcon(result[0].getData());
        });
    }

    private _uploadIcon(file: File): void {
        const reader = new FileReader();

        reader.onload = (event) => {
            this._appendSvgToDom(file.name, event.target.result);
        };
        reader.readAsText(file);
    }

    private _appendSvgToDom(name: string, result: string): void {
        this._icon = name;
        const containers = document.querySelectorAll('.controls-demo_svg-icon');
        containers.forEach((container) => {
            const icon = document.createElement('div');
            icon.innerHTML = result;
            icon.children[0].id = '#example';
            icon.children[0].classList.add('controls-demo_svg-icon_baseline');
            icon.className = 'controls-icon_size-m';
            container.children[0]?.remove();
            container.appendChild(icon);
        });
    }
}
