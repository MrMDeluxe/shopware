import ProxyFactory from './../factory/data-proxy.factory';
import utils from './../service/util.service';

export default {

    inject: ['productService'],

    methods: {
        initProduct,
        saveProduct,
        getProductById,
        updateProductById,
        createProduct,
        getDefaultProduct,
        getNewProduct,
        addProductPrice
    }
};

function initProduct(id, dataKey = 'product') {
    this.productDataKey = dataKey;
    this[dataKey] = this.getDefaultProduct();

    if (!id) {
        const productProxy = this.getNewProduct();

        this.productProxy = productProxy;
        this[dataKey] = productProxy.data;

        return Promise.resolve(() => {
            return productProxy;
        });
    }

    return this.getProductById(id).then((productProxy) => {
        this.productProxy = productProxy;
        this[dataKey] = productProxy.data;

        return productProxy;
    });
}

function saveProduct() {
    const id = this.productProxy.data.id;

    if (!id) {
        return this.createProduct(this.productProxy).then((data) => {
            this.productProxy.data = data;
            return data;
        }).catch();
    }

    return this.updateProductById(id, this.productProxy).then((data) => {
        this.productProxy.data = data;
        return data;
    }).catch();
}

function getProductById(id) {
    return this.productService.getById(id).then((response) => {
        return ProxyFactory.create(response.data);
    });
}

function updateProductById(id, proxy) {
    if (!id || !proxy) {
        return Promise.reject(new Error('Missing required parameters.'));
    }

    // There are no changes
    if (Object.keys(proxy.changeSet).length === 0) {
        return Promise.reject();
    }

    const changeSet = { ...proxy.changeSet };

    /**
     * We have to remap the categories at the moment.
     *
     * ToDo: Add category support!
     */
    if (changeSet.categories) {
        changeSet.categories = mapCategories(changeSet.categories);
    }

    return this.productService.updateById(id, changeSet).then((response) => {
        return response.data;
    });
}

function createProduct(proxy) {
    const data = proxy.data;

    /**
     * We have to remap the categories at the moment.
     *
     * ToDo: Add category support!
     */
    if (data.categories) {
        data.categories = mapCategories(data.categories);
    }

    return this.productService.create(proxy.data).then((response) => {
        if (response.errors.length) {
            return Promise.reject(new Error('API error'));
        }

        return response.data[0];
    });
}

function getDefaultProduct() {
    return {
        attribute: {},
        categories: []
    };
}

function getNewProduct() {
    const product = {
        id: null,
        taxId: '49260353-68e3-4d9f-a695-e017d7a231b9',
        manufacturerId: null,
        prices: [{
            id: null,
            price: 0,
            basePrice: 0,
            pseudoPrice: null,
            quantityStart: 1,
            quantityEnd: null,
            percentage: 0,
            customerGroupId: '3294e6f6-372b-415f-ac73-71cbc191548f'
        }]
    };

    return ProxyFactory.create(product);
}

function addProductPrice() {
    const id = utils.createId();

    this[this.productDataKey].prices.push({
        id,
        price: 0,
        basePrice: 0,
        pseudoPrice: null,
        quantityStart: 1,
        quantityEnd: null,
        percentage: null,
        customerGroupId: '3294e6f6-372b-415f-ac73-71cbc191548f'
    });
}

function mapCategories(categories) {
    const mappedCategories = [];

    categories.forEach((entry) => {
        mappedCategories.push({
            categoryId: entry.id
        });
    });

    return mappedCategories;
}