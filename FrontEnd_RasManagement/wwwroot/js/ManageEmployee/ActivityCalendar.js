$(function () {
    var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        // customButtons: {
        //   wfoButton: {
        //     text: 'WFO',
        //     click: function() {
        //       var wfoEvents = calendar.getEvents().filter(function(event) {
        //         return event.title.includes('WFO');
        //       });
    
        //       calendar.removeAllEvents();
        //       calendar.addEventSource(wfoEvents);
    
        //     }
        //   },
        //   wfhButton: {
        //     text: 'WFH',
        //     click: function() {
        //       var wfoEvents = calendar.getEvents().filter(function(event) {
        //         return event.title.includes('WFH');
        //       });
    
        //       calendar.removeAllEvents();
        //       calendar.addEventSource(wfoEvents);
    
        //     }
        //   }
        // },
        footerToolbar: {
          left: 'customButton1', // Customize buttons on the left
          center: '',
      },
      customButtons: {
          customButton1: {
              text: 'Flag',
          },
        },
      //     customButton2: {
      //         text: 'Custom 2',
      //         click: function() {
      //             alert('Custom Button 2 clicked!');
      //         }
      //     },
      //     customButton3: {
      //         text: 'Custom 3',
      //         click: function() {
      //             alert('Custom Button 3 clicked!');
      //         }
      //     },
      //     customButton4: {
      //         text: 'Custom 4',
      //         click: function() {
      //             alert('Custom Button 4 clicked!');
      //         }
      //     }
      //   },
  
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
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end + "&flag=",
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

});
