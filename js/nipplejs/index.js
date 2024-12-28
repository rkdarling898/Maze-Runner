import Manager from './manager.js';

const factory = new Manager();
export default {
    create: function (options) {
        return factory.create(options);
    },
    factory: factory
};
