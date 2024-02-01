$(function () {
    var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        footerToolbar: {
          center: 'title',
        },
        themeSystem: 'bootstrap',
        lazyFetching: false,
        eventDidMount: function (info) {

          $(info.el).popover({
              title: info.event.title,
              placement: 'bottom',
              html:true,
              content: info.event.extendedProps.description,
              trigger: 'hover',
              container: 'body',
          });
        },
        
      
        events: function (info, successCallback, failureCallback) {
          let start = moment(info.start.valueOf()).format('YYYY-MM-DD');
          let end = moment(info.end.valueOf()).format('YYYY-MM-DD');
          $.ajax({
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end,
              type: 'GET',
              headers: {
                  Authorization: "Bearer " + sessionStorage.getItem("Token")
              }, success: function (response) {
                      successCallback(response);
              }
          });
      },
      
      
      
      
      
    });
    
  calendar.render();
  // $('#calendar').fullCalendar()

});
