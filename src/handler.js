const books = require('./books');
const { nanoid } = require('nanoid');

// const addBookHandler = (request, h) => {
//     const {name, year, author, summary, publisher, pageCount, readPage, reading} =  request.payload;
//     const id = nanoid(16)

//     const finished = readPage === pageCount ? true : false;

//     if (!name) {
//         const response = h.response({
//             status: 'fail',
//             message: 'Gagal menambahkan buku. Mohon isi nama buku'
//         })
//         response.code(400)
//         return response;
//     } 

//     if (readPage > pageCount) {
//         const response = h.response({
//             status: 'fail',
//             message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
//         })
//         response.code(400)
//         return response;
//     } 

//     const insertedAt = new Date().toISOString();
//     const updatedAt = insertedAt;
//     const book = {id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt}
//     const isSuccess = books.filter((book) => book.id === id).length > 0;
//     console.log(isSuccess);
//     if (isSuccess) {
//         const response = h.response({
//             status: 'success',
//             message: 'Buku berhasil ditambahkan',
//             data: {
//                 bookId: id,
//             }
//         })
//         response.code(201);
//         return response;
//     }
//     books.push(book)

//     const response = h.response({
//         status: 'fail',
//         message: 'Buku gagal ditambahkan',
//     })
//     response.code(500)
//     return response;
// };


const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
  
    if (!name) {
      return h.response({ 
        status: 'fail', 
        message: 'Gagal menambahkan buku. Mohon isi nama buku' 
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({ 
        status: 'fail', 
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' 
      }).code(400);
    }
  
    const finished = (readPage === pageCount);
  
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Id sudah digunakan',
      }).code(409);
    }
  
    const book = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(book);
  
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id,
      },
    }).code(201);
  };
  
const getAllBookHandler = (request, h) => {
    const { reading, finished, unfinished, name } = request.query;

    if (name) {
        const filtered = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
        console.log(filtered);
        return h.response({
            status:'success',
            data: {
                books: filtered.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        })
    }

    if (unfinished === '1' || unfinished === '0') {
        const filtered = books.filter((book) => book.unfinished === (unfinished === '1'))

        return h.response({
            status:'success',
            data: {
                books: filtered.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        })
    }

    if (finished === '1' || finished === '0') {
        const filtered = books.filter((book) => book.finished === (finished === '1'))

        return h.response({
            status:'success',
            data: {
                books: filtered.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        })
    }
    
    if (reading === '1' || reading === '0') {
        const filtered = books.filter((book) => book.reading === (reading === '1'))

        return h.response({
            status:'success',
            data: {
                books: filtered.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        })
    }

    return h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    })
    }

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];
    
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            }
        }
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404)
} 

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400)
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400)
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name, 
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200)
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)

}

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404);
    return response;
}


module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, };
