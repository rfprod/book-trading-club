$(document).ready(function(){
	var urlHash = window.location.hash;
	console.log('url hash: '+urlHash);
	if (urlHash == '#already-exists') {
		window.location.hash = '';
		$('#dialog').html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Not added</strong> You already possess the book you are trying to add.</div>');
	}
	$('#dialog').bind('DOMSubtreeModified', function() {
	    console.log('tree changed');
	    if ($('#dialog').html() != ''){
			setTimeout(function(){
			    $('#dialog').html('');
		    },5000);
		}
	});
});
function removeBook(obj){
	console.log($('.books').children().length);
	var mediaContainer = $('#'+obj.id).parent().parent().parent();
	console.log(mediaContainer.attr('id'));
	var bookISBN13 = mediaContainer.find('#book_isbn13').html();
	console.log('book removal invoked, isbn13: '+bookISBN13);
	var connRemove = new WebSocket("wss://book-trading-club-rfprod.c9users.io/removebook");
    connRemove.onopen = function(){
	    console.log("Removing book. Connection opened");
	    connRemove.send(bookISBN13);
    }
    connRemove.onmessage = function(evt){
	    console.info("Received "+JSON.stringify(evt.data));
	    mediaContainer.remove();
	    console.log($('.books').children().length);
	    $('#profile-books').html($('#profile-books').html()-1);
	    if ($('.books').children().length == 0) {
	    	$('.books').html('You do not own any books yet.');
	    }
	    connRemove.close();
    };
    connRemove.onerror = function(error){
	    console.error("Error:"+JSON.stringify(error));
	    connRemove.close();
    };
    connRemove.onclose = function(){
	    console.log("Stock removed. Connection closed");
    };
}
function emailSignup(obj){
	console.log(obj);
	var formContainer = $('#'+obj.id).parent().parent().parent();
	console.log(formContainer.attr('id'));
	var emailSignup = formContainer.find('#email-signup');
	var passSignup = formContainer.find('#password-signup');
	var passRepeatSignup = formContainer.find('#password-repeat-signup');
	emailSignup.parent().attr('class','form-group');
	passSignup.parent().attr('class','form-group');
	passRepeatSignup.parent().attr('class','form-group');
	console.log('email signup invoked: '+emailSignup.val()+' ~ '+passSignup.val()+' ~ '+passRepeatSignup.val());
	var connRemove = new WebSocket("wss://book-trading-club-rfprod.c9users.io/emailsignup");
    connRemove.onopen = function(){
	    console.log("Email sign up. Connection opened");
	    connRemove.send(emailSignup.val()+'|'+passSignup.val()+'|'+passRepeatSignup.val());
    }
    connRemove.onmessage = function(evt){
    	var responseString = JSON.stringify(evt.data);
	    console.info("Received "+responseString);
	    if (responseString.indexOf('success') != -1){
	    	emailSignup.attr('value','Email');
		    passSignup.attr('value','Password');
		    passRepeatSignup.attr('value','Repeat password');
		    var successDialog = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Account created</strong> You can now Log In with your registered credentials.</div>';
			$('#dialog').html(successDialog);
	    }else if (responseString.indexOf('already exists') != -1){
		    emailSignup.parent().addClass('has-error').addClass('has-feedback');
	    	var existsDialog = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Already exists</strong> Account associated with this email already exists.</div>';
			$('#dialog').html(existsDialog);
	    }else if (responseString.indexOf('do not match') != -1){
	    	passSignup.parent().addClass('has-error').addClass('has-feedback');
		    passRepeatSignup.parent().addClass('has-error').addClass('has-feedback');
	    	var passMatchDialog = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Not created</strong> Passwords do not match.</div>';
			$('#dialog').html(passMatchDialog);
	    }
	    connRemove.close();
    };
    connRemove.onerror = function(error){
	    console.error("Error:"+JSON.stringify(error));
	    connRemove.close();
    };
    connRemove.onclose = function(){
	    console.log("Email sugn up. Connection closed");
    };
}
function addBookByVolumeId(obj){
	console.log(obj);
	var formContainer = $('#'+obj.id).parent().parent().parent();
	var bookISBN13 = obj.id;
	console.log('bookISBN13: '+bookISBN13);
	var connAddById = new WebSocket("wss://book-trading-club-rfprod.c9users.io/addbookbyisbn");
    connAddById.onopen = function(){
	    console.log("Add book by volume id. Connection opened");
	    connAddById.send(bookISBN13);
    }
    connAddById.onmessage = function(evt){
    	var responseString = JSON.stringify(evt.data);
	    console.info("Received "+responseString);
	    alert(responseString);
	    var reqBookDOM = formContainer.find('.btn-request-book');
	    console.log(reqBookDOM.attr('id'));
		var addBookDOM = formContainer.find('.btn-add-book');
		console.log(addBookDOM.attr('id'));
		addBookDOM.addClass('disabled');
		reqBookDOM.html('You own the book');
		reqBookDOM.removeClass('btn-info').addClass('btn-success');
	    connAddById.close();
    };
    connAddById.onerror = function(error){
	    console.error("Error:"+JSON.stringify(error));
	    connAddById.close();
    };
    connAddById.onclose = function(){
	    console.log("Add book by volume id. Connection closed");
    };
}
function requestBook(obj){
	console.log(obj);
	var formContainer = $('#'+obj.id).parent().parent().parent();
	var bookISBN13 = obj.id;
	console.log('bookISBN13: '+bookISBN13);
	var connAddById = new WebSocket("wss://book-trading-club-rfprod.c9users.io/requestbook");
    connAddById.onopen = function(){
	    console.log("Add book by isnb13. Connection opened");
	    connAddById.send(bookISBN13);
    }
    connAddById.onmessage = function(evt){
    	var responseString = JSON.stringify(evt.data);
	    console.info("Received "+responseString);
	    alert(responseString);
	    /*
	    var reqBookDOM = formContainer.find('.btn-request-book');
	    console.log(reqBookDOM.attr('id'));
		var addBookDOM = formContainer.find('.btn-add-book');
		console.log(addBookDOM.attr('id'));
		addBookDOM.addClass('disabled');
		reqBookDOM.html('You own the book');
		reqBookDOM.removeClass('btn-info').addClass('btn-success');
		*/
	    connAddById.close();
    };
    connAddById.onerror = function(error){
	    console.error("Error:"+JSON.stringify(error));
	    connAddById.close();
    };
    connAddById.onclose = function(){
	    console.log("Add book by isbn13. Connection closed");
    };
}