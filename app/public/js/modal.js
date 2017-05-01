$(document).ready(function () {
  $('#myModal').on('show.bs.modal', function (e) {
    var image = $(e.relatedTarget).attr('src');
    var title = $(e.relatedTarget).attr('alt');
    $(".img-responsive").attr("src", image);
    $(".title").attr("p", title);
  });
});
