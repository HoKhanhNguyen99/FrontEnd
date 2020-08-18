// Check all checkbox
function checkAll() {
  $('#checkAll').click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
  });
}
