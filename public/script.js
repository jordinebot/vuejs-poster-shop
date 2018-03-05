const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        results: [],
        items: [],
        cart: [],
        search: {
            term: '60s',
            last: '',
            loading: false
        },
        price: PRICE
    },
    methods: {
        appendItems: function() {
            if (this.results.length > this.items.length) {
                this.items = this.items.concat(this.results.slice(this.items.length, this.items.length + LOAD_NUM));
            }
        },
        onSearch: function() {
            if (!this.search.term.length) {
                return false;
            }

            this.search.loading = true;
            this.results = [];
            this.items = [];
            axios.get('/search/' + this.search.term).then(res => {
                this.search.last = this.search.term;
                this.results = res.data;
                this.appendItems();
                this.search.loading = false;
            }).catch(res => {
                this.search.loading = false;
            });
        },
        getCartItem: function(item) {
            return this.cart.find(i => i.id === item.id);
        },
        addItem: function(item) {
            var cartItem = this.getCartItem(item);
            if (cartItem) {
                cartItem.qty++;
            } else {
                cartItem = {
                    id: item.id,
                    title: item.title,
                    price: item.comment_count,
                    qty: 1,
                };
                this.cart.push(cartItem);
            }
            this.total += cartItem.price;
        },
        incr: function(cartItem) {
            cartItem.qty++;
            this.total += cartItem.price;
        },
        decr: function(cartItem) {
            cartItem.qty--;
            this.total -= cartItem.price;
            if (cartItem.qty <= 0) {
                this.cart.splice(this.cart.indexOf(cartItem), 1);
            }
        },
    },
    computed: {
        noMoreItems: function() {
            return this.results.length && this.items.length >= this.results.length
        }
    },
    filters: {
        currency: function(price) {
            return '$' + price.toFixed(2);
        },
    },
    mounted: function() {
        this.onSearch();
        const elem = document.getElementById('product-list-bottom');
        const watcher = scrollMonitor.create(elem);
        watcher.enterViewport(event => this.appendItems());
    }
});

