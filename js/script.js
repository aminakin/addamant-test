$(document).ready(function() {
  $('#sendxlsx').on('submit', function(evt) {
      var form = document.querySelector('#sendxlsx');
      var fd = new FormData(form);

      $.ajax({
          xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);
                $('.progress').show();
                $('.progress-bar').width(percentComplete+'%');
                $('.progress-bar').text(percentComplete+'%');
                $('.progress').fadeOut();
                console.log(percentComplete);
              }
            }, false);

            return xhr;
          },
          url: 'parsexlsx.php',
          data: fd,
          processData: false,
          contentType: false,
          dataType: 'json',
          type: 'POST',
          success: function (data) {
            var dataArray = $(data).toArray();
            if ($('.tables').html() != '') {
              $('.tables').slick('unslick');
            }
            for (i = 0; i < dataArray.length; i++) {
              var elem = document.createElement('li');
              elem.classList.add('tables__item');
              elem.dataset.table = i;
              elem.innerHTML= dataArray[i];
              $('.tables').append(elem);
            }
            runSlider();
            addListeners();
          }
      });
  });

  $('.clear').on('click', function() {
    $('.tables').slick('unslick');
    $('.tables').empty();
  });

  var runSlider = function () {
    $('.tables').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true
    });
  }

  var sortTable = function (table, col, order) {
    if (order===1) {
        var sortedRows = Array.from(table.rows).slice(1).sort((rowA, rowB) => rowA.cells[col].innerHTML > rowB.cells[col].innerHTML ? 1 : -1);
    }
    else {
      var sortedRows = Array.from(table.rows).slice(1).sort((rowA, rowB) => rowA.cells[col].innerHTML < rowB.cells[col].innerHTML ? 1 : -1);
    }
    table.tBodies[0].append(...sortedRows);
  }

  function filterTable($table) {
      var $filters = $table.find('.filter-input');
      var $rows = $table.find('tr');
      $rows.each(function (rowIndex) {
          var valid = true;
          $(this).find('td').each(function (colIndex) {
              if ($filters.eq(colIndex).val()) {
                  if ($(this).html().toLowerCase().indexOf(
                  $filters.eq(colIndex).val().toLowerCase()) == -1) {
                      valid = valid && false;
                  }
              }
          });
          if (valid === true) {
              $(this).css('display', '');
          } else {
              $(this).css('display', 'none');
          }
      });
  }

  var addListeners = function () {
    $('.btn-asc').on('click', function(evt) {
      evt.preventDefault();
      var table = $(this).parents('table')[0];
      var col = $($(this).parents('.dropup')[0]).attr('data-col');
      sortTable(table, col, 1);
    });
    $('.btn-desc').on('click', function(evt) {
      evt.preventDefault();
      var table = $(this).parents('table')[0];
      var col = $($(this).parents('.dropup')[0]).attr('data-col');
      sortTable(table, col, 0);
    });
    $('.filter-input').on('input', function () {
      filterTable($(this).parents('table'));
    });
    $('.btn-clear-all').on('click', function () {
      var inputs = $($(this).parents('table')[0]).find('.filter-input');
      inputs.val('');
      filterTable($(this).parents('table'));
    });
  }

});
