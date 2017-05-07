// Collection Data array for filling collection box
//var CollectionData = [];

// DOM Ready 
$(document).ready(function() {

  // Populate the user table on page load
  populateCollections();

  // Delete Book Entry
  $('#collection table tbody').on('click', 'td a.linkdeletebook', deleteBook);

});

// Functions

// Fill Table with data
function populateCollections() {

  //Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/collection', function( data ) {

    var i = 0;
    $.each(data, function(){
      while(typeof this.books[i] != "undefined")
      {
        tableContent += '<tr>';
        tableContent += '<td>' + this.books[i].title + '</td>';
        tableContent += '<td>' + this.books[i].issue + '</td>';
        tableContent += '<td>' + this.books[i].publisher + '</td>';
        tableContent += '<td>' + this.books[i].ongoing + '</td>';
        tableContent += '<td>' + this.books[i].writer + '</td>';
        tableContent += '<td>' + this.books[i].artist + '</td>';
        tableContent += '<td><a href="#" class="linkdeletebook" rel="' + this.books[i].title + '">Delete</a></td>';
        tableContent += '</tr>';
        i += 1;
      }
    });

    // Inject the whole content string into table
    $('#collection table tbody').html(tableContent);
  });
};

//Delete Book
function deleteBook(event) {

  event.preventDefault();

  //pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this book?');

  //check and make sure the user confirmed
  if (confirmation === true) {

    $.ajax({
      type: 'DELETE',
      url: '/deleteEntry/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        //alert('Error: ' + response.msg);
      }

      // Update the table
      populateCollections();

    });
  }
  else {
    // If user says no to the confirm do nothing
    return false;
  }

};
