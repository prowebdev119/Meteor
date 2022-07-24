import { CRMService } from '../crm-service';
let crmService = new CRMService();

Template.filterslabels.onCreated(function () {

  const templateObject = Template.instance();
  templateObject.alllabels = new ReactiveVar([]);

});

Template.filterslabels.onRendered(function () {

  $("#labelsCollapseContainer").sortable({
    // handle: '.filtersmenuoption',
    update: function (event, ui) {
    },
  });

  $("#filtersCollapseContainer").sortable({
    // handle: '.filtersmenuoption',
    update: function (event, ui) {
    },
  });

  $("#date-input, #dtRescheduleDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    constrainInput: false,
    dateFormat: 'd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  let templateObject = Template.instance();

  templateObject.getAllTaskList = function () {
    crmService.getAllTaskList().then(function (data) {
      if (data.tprojecttasks && data.tprojecttasks.length > 0) {

        let today = moment().format('YYYY-MM-DD');
        let allrecords = data.tprojecttasks;
        allrecords = allrecords.filter(item => item.fields.ProjectID == 11);

        // tempcode until fields are added in backend 
        // let allrecords = data.tprojecttasks.sort(function (a, b) {
        //   return (a.Recno < b.Recno) ? 1 : -1;
        // });

        let today_records = allrecords.filter(item => item.fields.due_date.substring(0, 10) == today);
        let upcoming_records = allrecords.filter(item => item.fields.due_date.substring(0, 10) > today);
        let overdue_records = allrecords.filter(item => (!item.fields.due_date || item.fields.due_date.substring(0, 10) < today));
        let all_records = allrecords.filter(item => !item.fields.due_date || item.fields.due_date.substring(0, 10) >= today);

        $('.crm_all_count').text(allrecords.length);
        $('.crm_today_count').text(today_records.length);
        $('.crm_upcoming_count').text(upcoming_records.length);

        templateObject.allrecords.set(all_records);
        templateObject.todayRecords.set(today_records);
        templateObject.upcomingRecords.set(upcoming_records);
        templateObject.overdueRecords.set(overdue_records);

        setTimeout(() => {
          $(".crmDatepicker").datepicker({
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: '/img/imgCal2.png',
            constrainInput: false,
            dateFormat: 'yy/mm/dd',
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
            onSelect: function (dateText, inst) {
              // alert(dateText);
              let task_id = inst.id
              templateObject.updateTaskSchedule(task_id, dateText)
            }
          });
          $(".crmEditDatepicker").datepicker({
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: '/img/imgCal2.png',
            constrainInput: false,
            dateFormat: 'yy/mm/dd',
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
          });
        }, 500);

      } else {
        $('.crm_all_count').text(0);
        $('.crm_today_count').text(0);
        $('.crm_upcoming_count').text(0);
      }

    }).catch(function (err) {

    });
  }


  templateObject.getAllLabels = function () {
    crmService.getAllLabels().then(function (data) {
      if (data.tprojecttask_tasklabel && data.tprojecttask_tasklabel.length > 0) {

        let alllabels = data.tprojecttask_tasklabel;
        templateObject.alllabels.set(alllabels);

      } else {
        templateObject.alllabels.set([]);
      }

    }).catch(function (err) {
    });
  }

  templateObject.getAllTaskList();
  templateObject.getAllLabels();


});

Template.filterslabels.events({
  'click .menuTasklist': function (e) {
    let path = FlowRouter.current().path;
    if (path != '/crmoverview') {
      FlowRouter.go('/crmoverview?id=all');
    }
  },

  'click .menuTasktoday': function (e) {
    let path = FlowRouter.current().path;
    if (path != '/crmoverview') {
      FlowRouter.go('/crmoverview?id=today');
    }
  },

  'click .menuTaskupcoming': function (e) {
    let path = FlowRouter.current().path;
    if (path != '/crmoverview') {
      FlowRouter.go('/crmoverview?id=upcoming');
    }
  },

});

Template.filterslabels.helpers({

  alllabels: () => {
    return Template.instance().alllabels.get();
  },

  getTodoDate: (date, format) => {
    return moment(date).format(format);
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getDescription: (description) => {
    return description.length < 80 ? description : description.substring(0, 79) + '...'
  }
});
