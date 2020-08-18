function showInfo() {
  $('.showInfo').on('click', function() {
    let $el = $(this);
    $el.find('span').toggleClass('fa-plus-circle fa-minus-circle');});
}
