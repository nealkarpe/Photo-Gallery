var photoManager = (function () {
  

    var deletePhoto = function() {
        id = $(this).data('id');
        $.ajax({
            method: 'post',
            url: '/api/photo/' + id + '/delete',
            success: function(res) {
                listAll();
            }
        })
    };

    var likePhoto = function() {
        id = $(this).data('id');
        $.ajax({
            method: 'post',
            url: '/api/like',
	    data: {'photo_id': id},
            success: function(res) {
                listOneGuest(id);
            }
        })
    };


    var dislikePhoto = function() {
        id = $(this).data('id');
        $.ajax({
            method: 'post',
            url: '/api/dislike',
            data: {'photo_id': id},
            success: function(res) {
                listOneGuest(id);
            }
        })
    };


    var listAll = function () {
        $.ajax({
            method: 'get',
            url: '/api/photo',
            success: function(res) {
                console.log(res.photos);
                viewManager.render('photos-list', {
                    photos: res.photos,
                });
            }
        });
    };


    var listAllPublic = function (id) {
	console.log(id);
	var string = id.path;
        string=string.split("/");
        var required=string[string.length-1]
	console.log(required);
        var idnum = parseInt(required);
        $.ajax({
            method: 'get',
            url: '/api/user/' + idnum,
            success: function(res) {
                console.log(res.photos);
                viewManager.render('public-photos-list', {
                    photos: res.photos,
                });
            }
        });
    };


    var create = function () {
        viewManager.render('photo', {
            formAction: '/api/photo',
        }, function ($view) {
            console.log($view);
            $view.submitViaAjax(function (response) {
                page('/');
            });
        });
    };

   /* var listOne = function (id) {
        $.ajax({
            method: 'get',
            url: '/api/photo',
            success: function(res) {
                console.log(res.photos[0]);
                viewManager.render('photo', res.photos[0]);
            }
        })
    };
	*/
   var getLikers = function(photo_id) {
            var result;
            $.ajax({
            method: 'post',
            url: '/api/likers',
                async: false,
                data: {'photo_id':photo_id},
            success: function(res) {
			result = res.likers;
			console.log(result);
            },
                failure: console.log("ajax failed")
            });
            console.log(result);
            return result;
   };


      var getDislikers = function(photo_id) {
            var result;
            $.ajax({
            method: 'post',
            url: '/api/dislikers',
                async: false,
                data: {'photo_id':photo_id},
            success: function(res) {
			result = res.dislikers;
			console.log(result);
            },
                failure: console.log("ajax failed")
            });
            console.log(result);
            return result;
   };

	var searchUser = function(text)
	{
		var id;
	    $.ajax({
            method: 'post',
            url: '/api/getId',
                async: false,
                data: {'username':text},
            success: function(res) {
                        id = res.user_id;
                        console.log(id);
            },
                failure: console.log("ajax failed")
            });

		return id;

	};


    var listAll = function () {
        $.ajax({
            method: 'get',
            url: '/api/photo',
            success: function(res) {
                console.log(res.photos);
                viewManager.render('photos-list', {
                    photos: res.photos,
                }, function($view){

		    $view.find(".searchbutton").click(function(){var text = $view.find(".searchtext")[0].value;      


				var userid = searchUser(text);
				//alert(userid);
				page("/user/" + userid);

              });



		});
            }
        });
    };


	var listOne = function (id) {
	var string = id.path;
        string=string.split("/");
        var required=string[string.length-1]
        var idnum = parseInt(required);
        $.ajax({
            method: 'get',
            url: '/api/photo/' + idnum,
            success: function(res) {
			photo = res.photo;
			likers = getLikers(photo.id);
			dislikers = getDislikers(photo.id);

                console.log(photo);
                console.log(likers);
                //console.log(res.todos[1]);
                viewManager.render('view-photo', {path:photo.path,id:photo.id,private:photo.private,likers:likers,dislikers:dislikers},function($view) {
                    $view.find(".like-photo-1").click(likePhoto);
                    $view.find(".like-photo-1").click(function(){page("/photo/" + photo.id);});
                    $view.find(".dislike-photo-1").click(dislikePhoto);
                    $view.find(".dislike-photo-1").click(function(){page("/photo/" + photo.id);});
                    $view.find(".delete-photo").click(deletePhoto);
		    $view.find(".combutton").click(function(){

		    
		    var comstring = $view.find(".comtext")[0].value;
		    var photo_id = photo.id;
		    
		   
            $.ajax({
            method: 'post',
            url: '/api/comment',
                data: {'photo_id':photo_id, 'comstring':comstring},
            success: console.log("ajax succeeded!"),
                failure: console.log("ajax failed")
            });
		
		alert('hho');
		page("/photo/" + photo.id);



			});
                });
            }
        })
    };
           


        var listOneGuest = function (id) {
	console.log("HIIIIIII");
        var string = id.path;
        string=string.split("/");
        var required=string[string.length-1]
        var idnum = parseInt(required);
        $.ajax({
            method: 'get',
            url: '/api/photo/guest/' + idnum,
            success: function(res) {
                        photo = res.photo;
                        likers = getLikers(photo.id);
                        dislikers = getDislikers(photo.id);

                console.log(photo);
                //console.log(res.todos[1]);
                viewManager.render('guest-view-photo', {path:photo.path,id:photo.id,private:photo.private,likers:likers,dislikers:dislikers},function($view) {

                    $view.find(".like-photo").click(likePhoto);
                    $view.find(".like-photo").click(function(){page("/photo/guest/" + photo.id);});
                    $view.find(".dislike-photo").click(dislikePhoto);
                    $view.find(".dislike-photo").click(function(){page("/photo/guest/" + photo.id);});
                });
            }
        })
    };


        var listOnePublic = function (id) {
        var string = id.path;
        string=string.split("/");
        var required=string[string.length-1];
        var idnum = parseInt(required);
        $.ajax({
            method: 'get',
            url: '/api/photo/public/' + idnum,
            success: function(res) {
                        photo = res.photo;
                        likers = getLikers(photo.id);
                        dislikers = getDislikers(photo.id);
                console.log(photo);
                //console.log(res.todos[1]);
                viewManager.render('public-view-photo', {path:photo.path,id:photo.id,private:photo.private,likers:likers,dislikers:dislikers});
            }
        })
    };



    var tManager = {};
    tManager.listAll = listAll;
    tManager.listAllPublic= listAllPublic;
    tManager.listOne = listOne;
    tManager.listOnePublic = listOnePublic;
    tManager.listOneGuest = listOneGuest;
    tManager.create = create;
    return tManager;
})();
