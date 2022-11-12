let parent = document.querySelector('body');
let element = document.createElement('div');
element.classList.add('body__content');
parent.prepend(element);

// *** HEADER ***
addChild('.body__content', 'header', 'header');
addChild('.header', 'div', 'header__content');
addChild('.header__content', 'h1', 'header__caption', 'Welcome to amazing book shop!');
addChild('.header__content', 'input', 'header__search-input');
setAttribute('.header__search-input', 'type', 'search');
setAttribute('.header__search-input', 'placeholder', 'Search...');

// *** MAIN ***
addChild('.body__content', 'main', 'main');
addChild('.main', 'div', 'main__content');
addChild('.main__content', 'div', 'catalogue');
addChild('.catalogue', 'div', 'catalogue__content');
addChild('.catalogue__content', 'h2', 'catalogue__caption section-caption', 'Book Catalog');
addChild('.catalogue__content', 'div', 'catalogue__list');
addChild('.main__content', 'div', 'bag');
addChild('.bag', 'div', 'bag__content');
addChild('.bag__content', 'h2', 'bag__caption section-caption', 'Order Books');
addChild('.bag__content', 'div', 'bag__list');
addChild('.bag__content', 'div', 'bag__total price');
addChild('.bag__total', 'div', 'price__caption', 'Total:');
addChild('.bag__total', 'div', 'price__value', '0');
setAttribute('.price__value', 'id', 'total-value');
addChild('.bag__content', 'button', 'button button_confirm-order bag__confirm-button', 'Confirm Order');
addChild('.body__content', 'footer', 'footer');
addChild('.footer', 'div', 'footer__content');

let books = [];
let bag = {
    bookIndexes: [],
    total: 0,
    addBookToBag(index) {
        if(this.bookIndexes.includes(index))
            return;
        let book = document.querySelector(`.book[data-index='${index}']`).cloneNode(true);
        book.classList.remove('book_in-catalogue');
        book.classList.add('book_in-bag');
        book.querySelector('.close-button').onclick = (event) => this.removeBookFromBag(event);
        document.querySelector('.bag__list').append(book);
        this.bookIndexes.push(index);
        this.total += books[index].price;
        this.setTotal();
    },

    removeBookFromBag(event) {
        let book = event.target.closest('.book');
        let index = book.dataset.index;
        this.bookIndexes.splice(this.bookIndexes.indexOf(index), 1);
        this.total -= books[index].price;
        book.remove();
        this.setTotal();
    },
    
    setTotal() {
        document.querySelector('.bag__total .price__value').innerHTML = this.total;
    }
};

fetch('books.json').then(response => response.json()).then(data => {
    books = data;
    addBooksToCatalogue();
});
// *** FUNCTIONS ***

function addBooksToCatalogue() {
    books.forEach((v, i) => addBookToCatalog(i));
}

function addChild(parent, element, classList, text) {
    element = document.createElement(element);
    element.setAttribute('class', classList);
    if(text) {
        element.innerHTML = text;
    }
    document.querySelector(parent).append(element);
}

function setAttribute(element, name, value) {
    document.querySelector(element).setAttribute(name, value);
}

function addBookToCatalog(index) {
    let currentBook = books[index];
    let book = document.createElement('div');
    book.setAttribute('class', 'book book_in-catalogue');
    book.dataset.index = index;

    let content = document.createElement('div');
    content.classList.add('book__content');
    book.append(content);

    let element = document.createElement('div');
    element.classList.add('book__img-wrap');
    let subElement = document.createElement('img');
    subElement.classList.add('book__img');
    subElement.setAttribute('src', 'images/BooksCovers/' + currentBook.imageLink);
    element.append(subElement);
    content.append(element);

    element = document.createElement('h3');
    element.classList.add('book__title');
    element.innerHTML = currentBook.title;
    content.append(element);

    element = document.createElement('div');
    element.classList.add('book__author');
    element.innerHTML = currentBook.author;
    content.append(element);

    element = document.createElement('div');
    element.classList.add('book__rating');
    for(let i = 0; i < 5; i++) {
        subElement = document.createElement('img');
        subElement.classList.add('book__rating-star');
        subElement.setAttribute('src', 'images/Star.svg');
        element.append(subElement);
    }
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'book__price price');
    subElement = document.createElement('div');
    subElement.classList.add('price__caption');
    subElement.innerHTML = 'Price:';
    element.append(subElement);
    subElement = document.createElement('div');
    subElement.classList.add('price__value');
    subElement.innerHTML = currentBook.price;
    element.append(subElement);
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'book__buttons');

    subElement = document.createElement('button');
    subElement.setAttribute('class', 'button button_add-to-bag book__add-button');
    subElement.onclick = (event) => bag.addBookToBag(event.target.closest('.book').dataset.index);
    subElement.innerHTML = 'Add to bag';
    element.append(subElement);

    subElement = document.createElement('button');
    subElement.setAttribute('class', 'book__show-more');
    subElement.innerHTML = 'Show more';
    element.append(subElement);
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'close-button book__close');
    content.append(element);

    document.querySelector('.catalogue__list').append(book);
}
