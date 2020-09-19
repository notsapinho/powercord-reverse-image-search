const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const { ContextMenu } = require('powercord/components');
const { getOwnerInstance } = require('powercord/util');

/**
 * Hey, if you're reading this I'd appreciate some feedback!
 * This is my first powercord plugin, so please tell me if I'm doing something incorrectly.
 */

module.exports = class ReverseImageSearch extends Plugin {
    async startPlugin() {
        const { imageWrapper } = await getModule(['imageWrapper']);
        const mdl = await getModule(
            m => m.default && m.default.displayName === 'MessageContextMenu'
        );

        inject('reverseImageSearch', mdl, 'default', ([{ target }], res) => {
            if (
                target.tagName.toLowerCase() === 'img' &&
                target.parentElement.classList.contains(imageWrapper)
            ) {
                res.props.children.push(
                    ...ContextMenu.renderRawItems([
                        {
                            type: 'submenu',
                            name: 'Reverse Image Search',
                            getItems: () => {
                                return [
                                    {
                                        type: 'button',
                                        name: 'Google Images',
                                        onClick: () =>
                                            window.open(
                                                'https://www.google.com/searchbyimage?image_url=' +
                                                    encodeURI(
                                                        getOwnerInstance(target)
                                                            .props.href ||
                                                            target.src
                                                    ),
                                                '_blank'
                                            )
                                    },
                                    {
                                        type: 'button',
                                        name: 'TinEye',
                                        onClick: () =>
                                            window.open(
                                                'https://www.tineye.com/search?url=' +
                                                    encodeURI(
                                                        getOwnerInstance(target)
                                                            .props.href ||
                                                            target.src
                                                    ),
                                                '_blank'
                                            )
                                    },
                                    {
                                        type: 'button',
                                        name: 'SauceNAO',
                                        onClick: () =>
                                            window.open(
                                                'https://saucenao.com/search.php?url=' +
                                                    encodeURI(
                                                        getOwnerInstance(target)
                                                            .props.href ||
                                                            target.src
                                                    ),
                                                '_blank'
                                            )
                                    }
                                ];
                            }
                        }
                    ])
                );
            }
            return res;
        });
    }

    pluginWillUnload() {
        uninject('reverseImageSearch');
    }
};
