(function($) {

	window.Book = Backbone.Model.extend({

		isFirstTag: function(index) {
			return index == 0;
		},

		isLastTag: function(index) {
			return index >= this.get('tags').length - 1;
		},

		imageUrl: function() {
			return this.get('image');
		}

	});

	window.Books = Backbone.Collection.extend({
		model: Book,
		url: '/books',
		
		allTags: function() {
			if (this.models.length > 0) {
				var alltags = _.rest(_.reduce(this.models, function(list, book) { 
					var tags = _(book.get('tags')).pluck('tag'); 
					return [].concat.apply(list,tags) }));
        		return alltags;
			}
			return [];
		}
	});

	window.Category = Backbone.Model.extend({});
	
/*	window.Categories = Backbone.Collection.extend({
		model: Book,
		url: '/categories',

		allTags: function() {
        	//var alltags = _(this.models.filter(function(t) {
        	//	return t.get("tag");
        	//})).pluck('tag'));

			var alltags = _.rest(_.reduce(this.models, function(list, book) { 
				var tags = _(book.get('tags')).pluck('tag'); 
				return [].concat.apply(list,tags) }));

			window.console.log("alltags: " + alltags);
        	return alltags;
        },

        filterByTag: function(tag) {
        	return _(this.models.filter(function(c) { return _.include(tag, tag); }));
        }
	});
*/

	window.library = new Books();

	window.BookView = Backbone.View.extend({
		tagName: 'li',
		className: 'book',

		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);

			this.template = _.template($('#book-template').html());
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
	});

	window.LibraryBookView = BookView.extend({

	});

	window.LibraryView = Backbone.View.extend({
		tagName: 'section',
		className: 'library',

		events: {
			'click .lend-button': 'lend',
			'click .return-button': 'restock',
			'click .add-book-button': 'addBook',
		},

		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#library-template').html());
			this.collection.bind('reset', this.render);
		},

		render: function() {
			var $books,
				collection = this.collection;
			
			$(this.el).html(this.template({}));
			$books = this.$('.books');
			collection.each(function(book) {
				var view = new LibraryBookView({
					model: book,
					collection: collection
				});
				$books.append(view.render().el);
			});
			return this;
		},
		
		JSONify: function( list, key ) {			
			window.console.log('JSONify list: '+list);
				
			var anArray = new Array()
			_.each( list, function(val) {
				window.console.log('val: '+val);
				var subObj = new Object();
				subObj[key] = val;
				anArray.push( subObj );
			});
			return anArray; //JSON.stringify(anArray);
		},
		
		addBook: function() {
			var self = this;
			$( "#dialog-form" ).dialog({
						autoOpen: false,
						height: 400,
						width: 600,
						modal: true,
						buttons: {
							"Add Book": function() {
								var bValid = true;
								//allFields.removeClass( "ui-state-error" );

								//bValid = bValid && checkLength( title, "title", 3, 200 );
								//bValid = bValid && checkLength( authors, "authors", 3, 200 );
								//bValid = bValid && checkLength( tags, "tags", 3, 200 );

								//bValid = bValid && checkRegexp( title, /^[a-z]([0-9a-z_])+$/i, "Title may consist of a-z, 0-9, underscores, begin with a letter." );
								//bValid = bValid && checkRegexp( authors, /^[a-z]([0-9a-z_])+$/i, "Authors may consist of a-z, 0-9, underscores, begin with a letter." );
								//bValid = bValid && checkRegexp( tags, /^[a-z]([0-9a-z_])+$/i, "Tags may consist of a-z, 0-9, underscores, begin with a letter." );
								bValid = true;
								if ( bValid ) {
									var book = new Book();
									var mid = window.library.models.length + 1;
									var authorlist = _.toArray(authors.value.split(";"));
									authorlist = self.JSONify( authorlist, 'author' );
									var taglist = _.toArray(tags.value.split(" "));
									taglist = self.JSONify(taglist, 'tag');
									book.set({
										id: mid, 
										title: title.value, 
										authors: authorlist, 
										tags: taglist, 
										image: image.value });
									$( this ).dialog( "close" );
									window.library.models.push(book);
									window.console.log('adding: '+JSON.stringify(book));
									self.render();
								}
							},
							Cancel: function() {
								$( this ).dialog( "close" );
							}
						},
						close: function() {
							//allFields.val( "" ).removeClass( "ui-state-error" );
						}
					});
			//$('#image').fileinput();
			$("title").value = "";
			$("authors").value = "";
			$('tags').value = "";
			$('image').value = "";
			$( "#dialog-form" ).dialog( "open" );
		},
		
		lend: function(sender) {
			var aid = parseInt(sender.srcElement.id);
			var abook = _.detect(window.library.models, function(book) {
				return book.id === aid;
			});
			if (abook) {
				abook.set({'lent_to': 'Lee, Eric'});
			}
		},
		
		restock: function(sender) {
			var aid = parseInt(sender.srcElement.id);
			var abook = _.detect(window.library.models, function(book) { 
				return book.id === aid;
			});
			if (abook) {
				abook.set({'lent_to': null});
			};
		}
	});

    window.CategoriesView = Backbone.View.extend({
        tag: 'section',
        className: 'categories-list',

		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#category-template').html());
			this.collection.bind('reset', this.render);
		},

		render: function() {
			var $categories,
				collection = this.collection.allTags();

			$(this.el).html(this.template({}));
			$categories = this.$('.categories');
			if (collection.length > 0) {
				_.each(collection, function(category) {
					$categories.append("<div class=\"category-tag\">" + category +"</div>");
				});
			};
			return this;
		}
	});

/*	window.CategoryView = Backbone.View.extend({
		tagName: 'li',
		className: 'category',

		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);

			this.template = _.template($('#category-tag-template').html());
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
	});
*/

	window.BackboneLibrary = Backbone.Router.extend({
		routes: {
			'': 'home',
			'blank': 'blank'
		},

		initialize: function() {
            this.categoriesView = new CategoriesView({
                collection: window.library
            });

            this.libraryView = new LibraryView({
				collection: window.library
			});
		},

		home: function() {
			var $container = $('#container');
			$container.empty();
			$container.append(this.categoriesView.render().el);
			$container.append(this.libraryView.render().el);
		},

		blank: function() {
			$('#container').empty();
			$('#container').text('blank');
		},
		
	});

	$(function() {
		window.App = new BackboneLibrary();
		Backbone.history.start({pushState: true});
	});

})(jQuery);