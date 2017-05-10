// DOM Ready
$(document).ready(function() {

  populateRecommendations();

});


//Fill Recommendation Table
function  populateRecommendations() {

    var tableContent = '';

    $.getJSON( '/recommendations', function( data ) {

      var i = 0;
      $.each(data, function(){
        while(typeof this.books[i] != "undefined")
        {
          tableContent += '<tr>';
          tableContent += '<td>' + this.books[i].title +'</td>';
          tableContent += '<td>' + this.books[i].publisher +'</td>';
          tableContent += '<td>' + this.books[i].ongoing +'</td>';
          tableContent += '<td>' + this.books[i].writer +'</td>';
          tableContent += '<td>' + this.books[i].artist +'</td>';
          tableContent += '<td><a href="#">Buy</a></td>';
          tableContent += '</tr>';

          i += 1;
        }
      });

      // Inject the Content into the table
      $('#recommended table tbody').html(tableContent);
    });

};
