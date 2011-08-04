var bookData = [{
    "title": "Python cookbook",
    "authors": [{"name": "Martelli, Alex"}, {"name": "Ascher, David"}],
    "image": "/library/python-cookbook.jpg",
    "tags": [{"tag": "python"}, {"tag": "programming"}, {"tag": "algorithms"}]
},
{
    "title": "CIO Wisdom",
    "authors": [{"name": "Lane, Dean"}],
    "image": "/library/cio-wisdom.jpg",
    "tags": [{"tag": "business"}, {"tag": "essays"}]
},
{
    "title": "Natural Language Toolkit",
    "authors": [{"name": "Bird, Steven"}, {"name": "Khan, Imran"}, {"name": "Loper, Edward"}],
    "image": "/library/nltk.jpg",
    "tags": [{"tag": "python"}, {"tag": "programming"}, {"tag": "api"}]
},
{
    "title": "Lord of the Rings",
    "authors": [{"name": "Tolkien, J.R.R"}],
    "image": "/library/lord-of-the-rings.jpg",
    "tags": [{"tag": "fiction"}, {"tag": "fantasy"}]
}];

describe("Book", function () {

    beforeEach(function () {
        this.book = new Book(bookData[0]);
    });

    it("creates from data", function () {
        expect(this.book.get('tags').length).toEqual(3);
    });

    describe("first tag", function() {
        it("identifies correct first tag", function() {
            expect(this.book.isFirstTag(0)).toBeTruthy();
        });
    });

    describe("last tag", function() {
        it("identifies the last tag", function() {
            expect(this.book.isLastTag(2)).toBeTruthy();
        });
    });

    it("returns the Image for a book", function() {
       expect(this.book.imageUrl())
        .toEqual('/library/python-cookbook.jpg');
    });

});
