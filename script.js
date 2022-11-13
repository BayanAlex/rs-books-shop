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
document.querySelector('.header__search-input').oninput = searchBooks;

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
document.querySelector('.bag__confirm-button').setAttribute('disabled', '');
addChild('.body__content', 'footer', 'footer');
addChild('.footer', 'div', 'footer__content');

addChild('.footer__content', 'a', 'footer__github-logo');
document.querySelector('.footer__github-logo').setAttribute('href', 'https://github.com/BayanAlex');
addChild('.footer__github-logo', 'img', 'footer__github-img');
document.querySelector('.footer__github-img').setAttribute('src', 'images/logo-github.png');

addChild('.footer__content', 'div', 'footer__copyright', '© 11.2022 Oleksandr Shyhyda');

addChild('.footer__content', 'a', 'footer__rs-logo');
document.querySelector('.footer__rs-logo').setAttribute('href', 'https://rs.school/');
addChild('.footer__rs-logo', 'img', 'footer__rs-img');
document.querySelector('.footer__rs-img').setAttribute('src', 'images/logo-rsschool.png');

document.querySelector('.bag__confirm-button').setAttribute('disabled', '');

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
        const button = document.querySelector('.bag__confirm-button');
        this.total == 0 ? button.setAttribute("disabled", "") : button.removeAttribute("disabled");
    }
};

fetch('books.json').then(response => response.json()).then(data => {
    books = data;
    addBooksToCatalogue();
});

// *** FUNCTIONS ***

function searchBooks(event) {
    const searchText = event.target.value.toLowerCase();
    document.querySelectorAll('.book_in-catalogue').forEach(book => book.style.display = book.querySelector('.book__title').textContent.toLowerCase().includes(searchText) || book.querySelector('.book__author').textContent.toLowerCase().includes(searchText) ? 'block' : 'none');
}

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
    // book.setAttribute('data-rating', currentBook.rating);
    book.dataset.index = index;

    let content = document.createElement('div');
    content.classList.add('book__content');
    book.append(content);

    let element = document.createElement('div');
    element.classList.add('book__img-wrap');
    let subElement = document.createElement('img');
    subElement.classList.add('book__img');
    subElement.setAttribute('src', 'images/BooksCovers/' + currentBook.imageLink);
    element.addEventListener('mousedown', bookDragStart);
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
    for(let i = 1; i <= 5; i++) {
        subElement = document.createElement('div');
        subElement.classList.add('book__rating-star');
        subElement.setAttribute('data-rate', i);
        if(currentBook.rating < i) {
            subElement.classList.add('book__rating-star_not-active');
        }
        subElement.onclick = (event) => {
            const parent = event.target.parentNode;
            const currentIndex = +event.target.dataset.rate;
            const book = parent.closest('.book');
            // book.setAttribute('data-rating', currentIndex);
            books[book.dataset.index].rating = currentIndex;
            for(let i = 0; i < 5; i++) {
                if(i < currentIndex)
                    parent.children[i].classList.remove('book__rating-star_not-active');
                else
                    parent.children[i].classList.add('book__rating-star_not-active');
            }
        }
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

    element = document.createElement('button');
    element.setAttribute('class', 'close-button book__close');
    content.append(element);

    document.querySelector('.catalogue__list').append(book);
}

function bookDragStart(event) {
    event.preventDefault();
    let bagActive = false;
    const coverCopy = event.target.cloneNode(true);
    const bookIndex = event.target.closest('.book').dataset.index;
    coverCopy.style.position = 'absolute';
    document.querySelector('.main__content').append(coverCopy);
    moveTo(event.target.getBoundingClientRect().left + window.scrollX, event.target.getBoundingClientRect().top + window.scrollY);
    const shiftX = event.clientX - event.target.getBoundingClientRect().left;
    const shiftY = event.clientY - event.target.getBoundingClientRect().top;
    document.addEventListener('mousemove', bookDrag);
    coverCopy.addEventListener('mouseup', bookDragStop);
    coverCopy.ondragstart = () => false;

    function moveTo(x, y) {
        if(x + parseInt(getComputedStyle(coverCopy).width) <= coverCopy.parentNode.getBoundingClientRect().right + window.scrollX && x >= coverCopy.parentNode.getBoundingClientRect().left + window.scrollX)
            coverCopy.style.left = x + 'px';
        if(y + parseInt(getComputedStyle(coverCopy).height) <= coverCopy.parentNode.getBoundingClientRect().bottom + window.scrollY && y >= coverCopy.parentNode.getBoundingClientRect().top + window.scrollY)
            coverCopy.style.top = y + 'px';
    }

    function bookDrag(event) {
        event.preventDefault();
        moveTo(event.pageX - shiftX, event.pageY - shiftY);
        coverCopy.hidden = true;
        let bagElement;
        if(document.elementFromPoint(event.clientX, event.clientY))
            bagElement = document.elementFromPoint(event.clientX, event.clientY).closest('.bag');
        coverCopy.hidden = false;
        if(bagElement) {
            if(!bagActive) {
                bagActive = true;
                bagElement.classList.add('bag_highlight');
            }
        }
        else {
            if(bagActive) {
                bagActive = false;
                document.querySelector('.bag').classList.remove('bag_highlight');
            }
        }
    }

    function bookDragStop(event) {
        if(bagActive) {
            document.querySelector('.bag').classList.remove('bag_highlight');
            bag.addBookToBag(bookIndex);
        }
        document.removeEventListener('mousemove', bookDrag);
        coverCopy.onmouseup = null;
        coverCopy.remove();
    }
}

