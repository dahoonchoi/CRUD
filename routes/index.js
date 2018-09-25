module.exports = function(app, Book)
{
  // GET ALL BOOKS
  app.get('/api/books', function(req,res){
    Book.find(function(err, books){ //Book 안에있는 값을 찾습니다.
      if(err) return res.status(500).send({error: 'database failure'}); //데이터 베이스 실페
      res.json(books); //json 값으로 books 의 값을 불러옵니ㅏ.
    })
  })
  // GET SINGLE BOOK
  app.get('/api/books/:book_id', function(req, res) { //books의 id 값을 입력을 할시에
    Book.findOne({_id: req.params.book_id}, function(err, book){ //findOne 한개의 값만 찾습니다. book_id 값을 입력을 할때
      if(err) return res.status(500).json({error: err}) //
      if(!book) return res.status(404).json({error: 'book not found'}) //book에 대한 정보가 없을 시에
      res.json(book); //아니면 book값을 불러옵니다.
    })
  })
  // GET BOOK BY AUTHOR
  app.get('/api/books/author/:author', function(req, res){ //books의 author 값을 입력을 할 시에
    Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1}, function(err, books){ //title: 1  == 보여준다
      if(err) return res.status(500).json({error: err}); //에러코드
      if(books.length === 0 ) return res.status(404).json({error: 'book not found'}); //books의 갯수가 없을 시에는
      res.json(books); //book 정보를 불러옵니다.
    })
  })
  // CREATE BOOKS
  app.post('/api/books', function(req, res){
    var book = new Book(); //새로운 book의 값을 만듭니다
    book.title = req.body.name; //name 입력시 title 로 들어 간다
    book.author = req.body.author; //author 입력시 author 값으로 들어간다
    book.published_date = new Date(req.body.published_date); //published_date 입력시 들어간다

    book.save(function(err){ // 데이터를 데이터 베이스에 저장하는 api.
      if(err){  //저장 실패/
        console.error(err);
        res.json({result: 0 })
        return;
      }

      res.json({result: 1})  //성공
    })
  })
  //UPDATE BOOKS
  app.put('/api/books/:book_id', function(req, res){ //PUT 으로 book_id를 입력 했을시
    Book.findById(req.params.book_id, function(err, book){ //book_id 값을 입력하게되면
      if(err) return res.status(500).json({error: 'book not found'}); //book 찾을수 없을때
      if(!book) return res.status(404).json({error: 'book not found'}) //book값이 없을 때

      if(req.body.title) book.title = req.body.title; //title 값을 입력햇을시
      if(req.body.author) book.author = req.body.author; //author 값을 입력 했을 시 변경
      if(req.body.published_date) book.published_date = req.body.published_date; //published 값을 입력했을시

      book.save(function(err){ // 데이터를 데이터 베이스에 저장한다
        if(err) res.status(500).json({error: 'failed to update'}); //업데이트 실패시
        res.json({message: 'book updated'});
      })
    })
  })
  app.delete('/api/books/:book_id', function(req, res){
    Book.remove({_id: req.params.book_id}, function(err, output){
      if(err) return res.status(500).json({error: "database failure"});

      res.status(204).end();
    })
  })
}
