//filterbyflag
var flag = "";
var categories = "";
var selectStatus = "";

$(function () {
  createCalendar();
  document.getElementById("selectflag").addEventListener("change", function(){
    flag = this.value;
    console.log(flag)
    createCalendar();
  }); 

  document.getElementById("selectCategory").addEventListener("change", function(){
    categories = this.value;
    console.log(categories)
    FilterCalendarbyCategory();
  }); 

  document.getElementById("selectStatus").addEventListener("change", function(){
    selectStatus = this.value;
    console.log(selectStatus)
    FilterCalendarbyStatus();
  }); 
});



function createCalendar(){
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
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end + "&flag=" + flag,
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
}

// function FilterCalendarbyFlag(){
//   var calendarEl = document.getElementById('calendar');
//   var calendar = new FullCalendar.Calendar(calendarEl, {
//         headerToolbar: {
//           left: 'prev,next today',
//           center: 'title',
//           right: 'dayGridMonth,dayGridWeek,dayGridDay'
//         },
//         // customButtons: {
//         //   wfoButton: {
//         //     text: 'WFO',
//         //     click: function() {
//         //       var wfoEvents = calendar.getEvents().filter(function(event) {
//         //         return event.title.includes('WFO');
//         //       });
    
//         //       calendar.removeAllEvents();
//         //       calendar.addEventSource(wfoEvents);
    
//         //     }
//         //   },
//         //   wfhButton: {
//         //     text: 'WFH',
//         //     click: function() {
//         //       var wfoEvents = calendar.getEvents().filter(function(event) {
//         //         return event.title.includes('WFH');
//         //       });
    
//         //       calendar.removeAllEvents();
//         //       calendar.addEventSource(wfoEvents);
    
//         //     }
//         //   }
//         // },
  
//         themeSystem: 'bootstrap',
//         lazyFetching: false,
//         eventDidMount: function (info) {

//           $(info.el).popover({
//               title: info.event.title,
//               placement: 'bottom',
//               html:true,
//               content: info.event.extendedProps.description,
//               trigger: 'hover',
//               container: 'body',
//           });
//         },
      
//         events: function (info, successCallback, failureCallback) {
//           let start = moment(info.start.valueOf()).format('YYYY-MM-DD');
//           let end = moment(info.end.valueOf()).format('YYYY-MM-DD');

//           $.ajax({
//               url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end + "&flag=" + flag,
//               type: 'GET',
//               headers: {
//                   Authorization: "Bearer " + sessionStorage.getItem("Token")
//               }, success: function (response) {
//                       successCallback(response);
//               }
//           });
//       },
//     }); 
//   calendar.render();
// }

function FilterCalendarbyCategory(){
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
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
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end + "&categories=" + categories,
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
}

function FilterCalendarbyStatus(){
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
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
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end + "&status=" + selectStatus,
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
}