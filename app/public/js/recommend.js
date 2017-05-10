// DOM Ready
$(document).ready(function() {

  populateRecommendations();

});


//Fill Recommendation Table
function  populateRecommendations() {

    var tableContent = '';

    $.getJSON( '/allCollections', function( data ) {

      $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td>' + this +'</td>';
        tableContent += '</tr>';

      });

      $('#recommended table tbody').html(tableContent);
    });

};
