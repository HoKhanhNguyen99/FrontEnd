function test() {
alert('hello');
}

function addProduct(){
  $(document).ready(function () {
    var counter = 0;

    $("#addRow").on("click", function () {
      var newRow = $("<tr>");
      var cols = "";

      cols += '<td><input type="text" class="form-control" name="name' + counter + '"/></td>';
      cols += '<td><input type="text" class="form-control" name="mail' + counter + '"/></td>';
      cols += '<td><select name="" id=""><option value="Banh">Banh</option><option value="Keo">Keo</option></select></td>';
      cols += '<td><input type="text" class="form-control" name="phone' + counter + '"/></td>';
      cols += '<td><input type="text" class="form-control" name="phone' + counter + '"/></td>';
      cols += '<td><input type="text" class="form-control" name="phone' + counter + '"/></td>';
      cols += '<td><input type="text" class="form-control" name="phone' + counter + '"/></td>';

      cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Save"></td>';
      cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';



      newRow.append(cols);
      $("table.order-list").append(newRow);
      counter++;
    });



    $("table.dataTable").on("click", ".ibtnDel", function (event) {
      $(this).closest("tr").remove();
      counter -= 1
    });

  });



  function calculateRow(row) {
    var price = +row.find('input[name^="price"]').val();

  }

  function calculateGrandTotal() {
    var grandTotal = 0;
    $("table.order-list").find('input[name^="price"]').each(function () {
      grandTotal += +$(this).val();
    });
    $("#grandtotal").text(grandTotal.toFixed(2));
  }

}
