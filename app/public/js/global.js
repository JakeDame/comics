// Collection Data array for filling collection box
var CollectionData = [];

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

  CollectionData = data;

    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.books + '</td>';
      tableContent += '<td>' + this.books.issue + '</td>';
      tableContent += '<td>' + this.books.publisher + '</td>';
      tableContent += '<td>' + this.books.ongoing + '</td>';
      tableContent += '<td>' + this.books.writer + '</td>';
      tableContent += '<td>' + this.books.artist + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into table
    $('#collection table tbody').html(tableContent);
  });
};
