// ---- Book class representing a book ----
class Book {
    constructor(title, author, isbn){
        // this.title = title;
        // this.author = author;
        // this.isbn = isbn;

        Object.assign(this, {title, author, isbn});
    }
}


// ---- UI class : to handle UI tasks ----
class UI{

    // used static methods to make it simpler, doesnt need instantiating
    static displayBooks(){
        // use hard-coded array with book objects in it for testing
        // const storedBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: 123456,
        //     },

        //     {
        //         title: 'Book Two',
        //         author: 'Johnny Doe',
        //         isbn: 123456789,
        //     },
        // ];

        // const books = storedBooks;
        const books = Store.getBooks();

        books.forEach( book => UI.addBookToList(book));
    }

    static addBookToList(book){
        // get the <tbody> from rhe DOM
        const list = document.getElementById('book-list');

        // create <tr> to append the list in
        const row = document.createElement('tr');

        // add the book details into the <tr>
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        // append <tr> to the <tbody>
        list.appendChild(row);

    }

    static deleteBook(target_el){
        if (target_el.classList.contains('delete')) {
            target_el.parentElement.parentElement.remove();
        } else{
            console.log(target_el);
        }
    }

    static showAlert(message, class_Name){
        // need to create div to show alert message
        const div = document.createElement('div');
        div.className = `alert alert-${class_Name}`;

        div.appendChild(document.createTextNode(message));

        // find a place to insert the div, inside the main div and before the form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div,form);

        // make alert div vanish or they will accumulate
        setTimeout(() => document.querySelector('.alert').remove(), 3000); 

    }

    static clearFields(){
        // gave an empty string to each <input> once this method is fired
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';

    }
}


// ---- Store class : handle storage ----
class Store{
    static getBooks(){
        let books;

        // check local storage to see if books exist
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // use isbn to make every book unique
    static removeBook(isbn){
        const books = Store.getBooks();
        
        books.forEach( (book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            } 
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// ---- Event : display books ----
// DOMContentLoaded => triggers only when DOM is ready 
document.addEventListener('DOMContentLoaded', UI.displayBooks);



// ---- Event : add a book ----
document.getElementById('book-form').addEventListener('submit', e => {
    e.preventDefault();

    // get value from <input> entered in the <form>
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // validate the <input> first
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please complete all fields', 'danger');
    } else {
        // create a Book instance
        const book = new Book(title, author, isbn);

        // add book to UI to display
        UI.addBookToList(book);

        // add book to local storage
        Store.addBook(book);

        // show success message
        UI.showAlert('Added successfully', 'success');

        // Clear fields
        UI.clearFields();
    }
});



// ---- Event : remove a book ----
document.getElementById('book-list').addEventListener('click', e =>{
    
    // remove book from UI
    UI.deleteBook(e.target);

    // remove book from local storage
    // tricky because can't access book object from this scope
    // so need to improvise
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success message
    UI.showAlert('Removed successfully', 'success');
});