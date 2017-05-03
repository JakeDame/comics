// Collection Data array for filling collection box
//var CollectionData = [];

// DOM Ready 
$(document).ready(function() {

  populateCollections();

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
        tableContent += '</tr>';
        i += 1;
      }
    });

    // Inject the whole content string into table
    $('#collection table tbody').html(tableContent);
  });
};
