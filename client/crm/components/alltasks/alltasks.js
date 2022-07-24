import { CRMService } from '../../crm-service';
let crmService = new CRMService();

Template.alltasks.onCreated(function () {

  let templateObject = Template.instance();
  templateObject.alllabels = new ReactiveVar([]);
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.allrecords = new ReactiveVar([]);
  templateObject.todayRecords = new ReactiveVar([]);
  templateObject.upcomingRecords = new ReactiveVar([]);
  templateObject.overdueRecords = new ReactiveVar([]);
  templateObject.selected_id = new ReactiveVar(0);
  templateObject.selected_ttodo = new ReactiveVar('');
  templateObject.due_date = new ReactiveVar(null);

});

Template.alltasks.onRendered(function () {
  // console.log('alltasks render')
  let templateObject = Template.instance();
  templateObject.selected_id.set(0);
  templateObject.selected_ttodo.set(null);

  templateObject.updateTaskSchedule = function (id, date) {

    let due_date = '';
    if (date) {
      due_date = moment(date).format('YYYY-MM-DD hh:mm:ss');
    }

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: due_date
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  }

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

        $('.crm_all_count').text(allrecords.length);
        $('.crm_today_count').text(today_records.length);
        $('.crm_upcoming_count').text(upcoming_records.length);

        templateObject.allrecords.set(allrecords);
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

        let label_dropdowns = '';
        alllabels.forEach(lbl => {
          label_dropdowns += `<a class="dropdown-item" href="#"><i class="fas fa-tag text-primary" style="margin-right: 8px;"></i>${lbl.fields.TaskLabelName}
            <div style="width: 20%; float: right;">
              <div class="custom-control custom-checkbox chkBox pointer"
                style="width: 15px; float: right;">
                <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                  id="label_${lbl.fields.ID}" value="">
                <label class="custom-control-label chkBox pointer" for="label_${lbl.fields.ID}"></label>
              </div>
            </div>
          </a>`;
        });
        $('#addTaskLabelWrapper').html(label_dropdowns);

      } else {
        templateObject.alllabels.set([]);
      }

    }).catch(function (err) {
    });
  }

  templateObject.getTProjectList = function () {
    crmService.getTProjectList().then(function (data) {
      if (data.tprojectlist && data.tprojectlist.length > 0) {

        let tprojectlist = data.tprojectlist;
        tprojectlist = tprojectlist.filter(proj => proj.fields.ID != 11);
        templateObject.tprojectlist.set(tprojectlist);

        let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;
        tprojectlist.forEach(proj => {
          add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: purple;"></i>${proj.fields.ProjectName}</a>`;
        });
        $('#goProjectWrapper').html(add_projectlist);

      } else {
        templateObject.tprojectlist.set([]);
      }

    }).catch(function (err) {
    });
  }

  templateObject.getAllTaskList();
  templateObject.getAllLabels();
  templateObject.getTProjectList();
});

Template.alltasks.events({

  'click .btnAddSubTask': function (event) {

    let addTaskModal = '<div id="addTaskModal" class="row addTaskModal no-modal">' + $('#addTaskModal').html() + '</div>';
    $('#addTaskModal').remove();
    $('#newTaskRowWrapper').html(addTaskModal)

    $(".newTaskRow").css("display", "inline-flex");
    $(".addTaskModal").css("display", "inline-flex");
    $(".btnAddSubTask").css("display", "none");
  },

  'click .btnCancelAddTask': function (event) {
    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");
    $(".addTaskModal").css("display", "none");
  },

  // complete task
  'click .chk_complete': function (e) {
    let id = e.target.dataset.id;
    // handle complete process via api
    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        Completed: true
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (objDetails) {
        // $('#ttodo_' + id).remove();
        $('.chkComplete').prop('checked', false);
        // recalculate count here
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // delete task
  'click .delete-task': function (e) {
    let id = e.target.dataset.id;
    // handle complete process via api
    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        Active: false
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (objDetails) {
        // recalculate count here
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // duplicate task
  'click .duplicate-task': function (e) {
    let templateObject = Template.instance();
    let id = e.target.dataset.id;
    $('.fullScreenSpin').css('display', 'inline-block');
    crmService.getTaskDetail(id).then(function (data) {
      $('.fullScreenSpin').css('display', 'none');
      if (data.fields.ID == id) {
        let selected_record = data.fields;
        // handle complete process via api
        var objDetails = {
          type: "Tprojecttasks",
          fields: {
            TaskName: 'Copy of ' + selected_record.TaskName,
            TaskDescription: selected_record.TaskDescription,
            due_date: selected_record.due_date,
            priority: selected_record.priority,
            // TaskLabel: selected_record.TaskLabel,
            Completed: false
          }
        };

        crmService.saveNewTask(objDetails).then(function (data) {
          // recalculate count here
          templateObject.getAllTaskList();
          $('.fullScreenSpin').css('display', 'none');
        }).catch(function (err) {
          $('.fullScreenSpin').css('display', 'none');
          swal(err, '', 'error');
          return;
        });;

      } else {

        swal('Cannot duplicate this task', '', 'warning');
        return;
      }

    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
      swal(err, '', 'error');
      return;
    });
  },

  // open edit modal
  'click .ttodo-edit': function (e) {

    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");
    $(".addTaskModal").css("display", "none");

    let id = e.target.dataset.id;
    let templateObject = Template.instance();
    let selected_id = templateObject.selected_id.get();
    let selected_ttodo = templateObject.selected_ttodo.get();

    $('.fullScreenSpin').css('display', 'inline-block');
    // get selected task detail via api
    crmService.getTaskDetail(id).then(function (data) {
      $('.fullScreenSpin').css('display', 'none');
      if (data.fields.ID == id) {
        let selected_record = data.fields;

        let title = selected_record.TaskName;
        let description = selected_record.TaskDescription;
        let labels = selected_record.TaskLabel;
        let due_date = selected_record.due_date;

        let edit_projectlist = `<a class="dropdown-item no-modal"  data-projectid="11"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;
        templateObject.tprojectlist.get().forEach(proj => {
          edit_projectlist += `<a class="dropdown-item setProjectIDEdit no-modal" data-projectid="${proj.fields.ID}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: purple;"></i>${proj.fields.ProjectName}</a>`;
        });

        if (labels == '' || labels == null) {
          labels = '';
        } else if (labels.type == undefined) {
          let label_string = '';
          labels.forEach(label => {
            label_string += label.fields.TaskLabelName + ', '
          });
          labels = label_string.slice(0, -2);
        } else {
          labels = labels.fields.TaskLabelName;
        }

        let alllabels = templateObject.alllabels.get();
        let label_dropdowns = '';
        alllabels.forEach(lbl => {
          label_dropdowns += `<a class="dropdown-item" href="#"><i class="fas fa-tag text-primary" style="margin-right: 8px;"></i>${lbl.fields.TaskLabelName}
            <div style="width: 20%; float: right;">
              <div class="custom-control custom-checkbox chkBox pointer"
                style="width: 15px; float: right;">
                <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                  id="label_${lbl.fields.ID}" value="">
                <label class="custom-control-label chkBox pointer" for="label_${lbl.fields.ID}"></label>
              </div>
            </div>
          </a>`;
        });

        // priority = 0 : Priority 4
        // priority = 1 : Priority 3
        // priority = 2 : Priority 2
        // priority = 3 : Priority 1
        let checked0 = selected_record.priority == 0 ? 'checked' : '';
        let checked1 = selected_record.priority == 1 ? 'checked' : '';
        let checked2 = selected_record.priority == 2 ? 'checked' : '';
        let checked3 = selected_record.priority == 3 ? 'checked' : '';

        let getTodayDate = moment().format('ddd');
        let getTomorrowDay = moment().add(1, 'day').format('ddd');
        let startDate = moment();
        let getNextMonday = moment(startDate).day(1 + 7).format('ddd MMM D');

        var edit_modal = `<div class="row editTaskRow no-modal">
            <div class="col-12">
              <div class="form-group">
                <input class="form-control no-modal" type="text" id="edit_task_name" name="" autocomplete="off" value="${title}">
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <textarea class="form-control no-modal" rows="3" id="edit_task_description" name="" autocomplete="off">${description}</textarea>
              </div>
            </div>
            <div class="col-6" style="display: inline-flex;">
              <div class="dropdown taskDropdownSchedule">
                <button class="btn btn-primary dropdown-toggle btnSchedule" type="button" id=""
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="far fa-calendar-minus" style="margin-right: 8px;"></i>Schedule
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="width: 275px;">
                  <a class="dropdown-item no-modal setScheduleTodayAdd">
                    <i class="fas fa-calendar-day text-success no-modal" style="margin-right: 8px;"></i>Today
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getTodayDate}</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleTomorrowAdd">
                    <i class="fas fa-sun text-warning no-modal" style="margin-right: 8px;"></i>Tomorrow
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getTomorrowDay}</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleWeekendAdd">
                    <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>This Weekend
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">Sat</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleNexweekAdd">
                    <i class="fas fa-calendar-alt text-danger no-modal" style="margin-right: 8px;"></i>Next Week
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getNextMonday}
                    </div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleNodateAdd">
                    <i class="fas fa-ban text-secondary no-modal" style="margin-right: 8px;"></i>
                    No Date</a>
                  <div class="dropdown-divider no-modal"></div>
                  <div class="form-group" data-toggle="tooltip" data-placement="bottom"
                    title="Date format: YYYY-MM-DD" style="margin: 6px 20px; margin-top: 14px;">
                    <div class="input-group date" style="cursor: pointer;">
                      <input type="text" class="form-control crmEditDatepicker" autocomplete="off" value="${due_date}">
                      <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="dropdown taskDropdownFilter">
                <button class="btn btn-primary dropdown-toggle btnSchedule"
                  style="background-color: rgba(0,0,0,0);" type="button" id="" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <span class="dropdownFilter"><i class="fas fa-inbox text-primary"
                      style="margin-right: 5px;"></i>All Tasks</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="width: 275px;">
                  ${edit_projectlist}
                </div>
              </div>
            </div>
            <div class="col-6" style="display: inline-flex; justify-content: end;">
              <div class="dropdown">
                <i class="fas fa-tag taskModalAction taskModalActionDropdown dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  title="Add label(s)..."></i>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" style="width: 200px;">
                  ${label_dropdowns}
                </div>
              </div>
              <div class="dropdown no-modal">
                <i class="fas fa-flag taskModalAction taskModalActionDropdown dropdown-toggle no-modal task_priority_${selected_record.priority}"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  title="Set the priority..."></i>
                <div class="dropdown-menu dropdown-menu-right no-modal" aria-labelledby="dropdownMenuButton"
                  style="width: 200px;">
                  <a class="dropdown-item text-danger no-modal" for="chkPriority3${id}"><i class="fas fa-tag no-modal"
                      style="margin-right: 8px;"></i>Priority 1
                    <div style="width: 20%; float: right;" class="no-modal">
                      <div class="custom-control custom-checkbox chkBox pointer no-modal"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer no-modal" type="checkbox"
                          id="chkPriority3${id}" data-id="${id}" value="3" ${checked3}>
                        <label class="custom-control-label chkBox pointer no-modal" for="chkPriority3${id}"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-warning no-modal"><i class="fas fa-tag no-modal"
                      style="margin-right: 8px;"></i>Priority 2
                    <div style="width: 20%; float: right;" class="no-modal">
                      <div class="custom-control custom-checkbox chkBox pointer no-modal"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer no-modal" type="checkbox"
                          id="chkPriority2${id}" data-id="${id}" value="2" ${checked2}>
                        <label class="custom-control-label chkBox pointer no-modal" for="chkPriority2${id}"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-primary no-modal"><i class="fas fa-tag no-modal"
                      style="margin-right: 8px;"></i>Priority 3
                    <div style="width: 20%; float: right;" class="no-modal">
                      <div class="custom-control custom-checkbox chkBox pointer no-modal"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer no-modal" type="checkbox"
                          id="chkPriority1${id}" data-id="${id}" value="1" ${checked1}>
                        <label class="custom-control-label chkBox pointer no-modal" for="chkPriority1${id}"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-secondary no-modal"><i class="fas fa-tag no-modal"
                      style="margin-right: 8px;"></i>Priority 4
                    <div style="width: 20%; float: right;" class="no-modal">
                      <div class="custom-control custom-checkbox chkBox pointer no-modal"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer no-modal" type="checkbox"
                          id="chkPriority0${id}" data-id="${id}" value="0" ${checked0}>
                        <label class="custom-control-label chkBox pointer no-modal" for="chkPriority0${id}"></label>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <i class="far fa-bell taskModalAction" data-toggle="tooltip" data-placement="bottom"
                title="Add reminder(s)..."></i>
            </div>
            <input type="hidden" id="editProjectID" value="11" />
            <div class="col-12" style="margin-top: 12px;">
              <button class="btn btn-success btnSaveEdit no-modal" type="button" style=""><i class="fa fa-save no-modal"
                  style="margin-right: 5px;"></i>Save</button>
              <button class="btn btn-secondary btnCancelEdit no-modal" type="button" style="margin-left: 8px;"><i
                  class="fa fa-close no-modal" style="margin-right: 5px;"></i>Cancel</button>
            </div>
          </div>`

        if (selected_id !== id) {
          // recover old record
          if (selected_id != 0 && selected_ttodo != null) {
            $('#ttodo_' + selected_id).html(selected_ttodo);
            $('#ttodo_' + selected_id).addClass('mainTaskCol');
          }
          // set new record
          templateObject.selected_ttodo.set($('#ttodo_' + id).html());
          templateObject.selected_id.set(id);
          $('#ttodo_' + id).removeClass('mainTaskCol');
          $('#ttodo_' + id).html(edit_modal);

          setTimeout(() => {
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
            // let currentDate = new Date();
            let begunDate = due_date ? moment(due_date).format("YYYY-MM-DD") : null;
            $('.crmEditDatepicker').val(begunDate);

          }, 500);
        }

      } else {
        $('#ttodo_' + selected_id).addClass('mainTaskCol');
        templateObject.selected_id.set(0);
        templateObject.selected_ttodo.set(null);

        swal('Cannot edit this task', '', 'warning');
        return;
      }

    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
      $('#ttodo_' + selected_id).addClass('mainTaskCol');
      templateObject.selected_id.set(0);
      templateObject.selected_ttodo.set(null);

      swal(err, '', 'error');
      return;
    });
  },

  // set projectID in edit
  'click .setProjectIDEdit': function (e) {
    let projectID = e.target.dataset.projectid;
    $('#editProjectID').val(projectID);

  },

  // set priority in edit
  'click .chkPriority': function (e) {
    let id = e.target.dataset.id;
    let value = e.target.value
    $('#chkPriority0' + id).prop('checked', false);
    $('#chkPriority1' + id).prop('checked', false);
    $('#chkPriority2' + id).prop('checked', false);
    $('#chkPriority3' + id).prop('checked', false);
    $('#chkPriority' + value + id).prop('checked', true);

  },

  // set projectID in add
  'click .setProjectIDAdd': function (e) {
    let projectID = e.target.dataset.projectid;
    $('#addProjectID').val(projectID);

  },

  // set priority in add
  'click .chkPriorityAdd': function (e) {
    let value = e.target.value
    $('#chkPriority0').prop('checked', false);
    $('#chkPriority1').prop('checked', false);
    $('#chkPriority2').prop('checked', false);
    $('#chkPriority3').prop('checked', false);
    $('#chkPriority' + value).prop('checked', true);

  },

  // cancel edit
  'click .btnCancelEdit': function (e) {

    let selected_id = Template.instance().selected_id.get();
    let selected_ttodo = Template.instance().selected_ttodo.get();

    $('#ttodo_' + selected_id).addClass('mainTaskCol');
    $('#ttodo_' + selected_id).html(selected_ttodo);

    Template.instance().selected_id.set(0);
    Template.instance().selected_ttodo.set(null);

  },

  // submit edit
  'click .btnSaveEdit': function (e) {

    let templateObject = Template.instance();
    let selected_id = templateObject.selected_id.get();
    let selected_ttodo = templateObject.selected_ttodo.get();

    let due_date = $('.crmEditDatepicker').val();
    due_date = due_date ? moment(due_date).format('YYYY-MM-DD hh:mm:ss') : '';

    let priority = 0;
    priority = $('#chkPriority1' + selected_id).prop('checked') ? 1 : $('#chkPriority2' + selected_id).prop('checked') ? 2 : $('#chkPriority3' + selected_id).prop('checked') ? 3 : 0;

    // handle save process here
    let edit_task_name = $('#edit_task_name').val();
    let edit_task_description = $('#edit_task_description').val();

    let projectID = $('#editProjectID').val() ? $('#editProjectID').val() : 11;


    if (edit_task_name === '') {
      swal('Task name is not entered!', '', 'warning');
      return;
    }
    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: selected_id,
        ProjectID: projectID,
        TaskName: edit_task_name,
        TaskDescription: edit_task_description,
        due_date: due_date,
        priority: priority
      }
    };

    crmService.saveNewTask(objDetails).then(function (objDetails) {
      if (objDetails.fields.ID) {

        let id = objDetails.fields.ID;
        $('#ttodo_' + id).addClass('mainTaskCol');
        $('#ttodo_' + id).html(selected_ttodo);

        $('#edit_task_name').val(edit_task_name);
        $('#edit_task_description').val(edit_task_description);

        edit_task_description = edit_task_description.length < 80 ? edit_task_description : edit_task_description.substring(0, 79) + '...'
        $('#ttodo_' + id + ' .taskName').html(edit_task_name);
        $('#ttodo_' + id + ' .taskDescription').html(edit_task_description);

        let duedate = due_date == '' ? due_date : moment(due_date).format('YYYY-MM-DD');
        let duedateClass = 'taskUpcoming';
        if (duedate == '') {
          duedate = '';
          duedateClass = 'taskNodate';
        }
        else if (moment().format('YYYY-MM-DD') == duedate) {
          duedate = 'Today';
          duedateClass = 'taskToday';
        } else if (moment().add(1, 'day').format('YYYY-MM-DD') == duedate) {
          duedate = 'Tomorrow';
          duedateClass = 'taskTomorrow';
        } else if (moment().format('YYYY-MM-DD') > duedate) {
          duedateClass = 'taskOverdue';
        } else {
          duedate = moment(due_date).format('D MMM');
        }

        let dueDateInner = '<i class="far fa-calendar-plus no-modal" style="margin-right: 5px;"></i>' + duedate;
        $('#ttodo_' + id + ' .taskDueDate').html(dueDateInner);
        $('#ttodo_' + id + ' .taskDueDate img').addClass('no-modal');
        $('#ttodo_' + id + ' .taskDueDate').removeClass('taskOverdue');
        $('#ttodo_' + id + ' .taskDueDate').removeClass('taskToday');
        $('#ttodo_' + id + ' .taskDueDate').removeClass('taskTomorrow');
        $('#ttodo_' + id + ' .taskDueDate').removeClass('taskUpcoming');
        $('#ttodo_' + id + ' .taskDueDate').removeClass('taskNodate');
        $('#ttodo_' + id + ' .taskDueDate').addClass(duedateClass);

        $('#ttodo_' + id + ' .custom-checkbox').removeClass('task_priority_0');
        $('#ttodo_' + id + ' .custom-checkbox').removeClass('task_priority_1');
        $('#ttodo_' + id + ' .custom-checkbox').removeClass('task_priority_2');
        $('#ttodo_' + id + ' .custom-checkbox').removeClass('task_priority_3');
        $('#ttodo_' + id + ' .custom-checkbox').addClass('task_priority_' + priority);


        templateObject.getAllTaskList();
      }

      $('.fullScreenSpin').css('display', 'none');

    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
        $('#ttodo_' + selected_id).addClass('mainTaskCol');
        $('#ttodo_' + selected_id).html(selected_ttodo);
      });
      $('.fullScreenSpin').css('display', 'none');
    });

    templateObject.selected_id.set(0);
    templateObject.selected_ttodo.set(null);

  },

  // submit save new task
  'click .btnSaveAddTask': function (e) {

    let task_name = $('#add_task_name').val();
    let task_description = $('#add_task_description').val();
    let templateObject = Template.instance();

    let due_date = $('.crmEditDatepicker').val();
    due_date = due_date ? moment(due_date).format('YYYY-MM-DD hh:mm:ss') : moment().format('YYYY-MM-DD hh:mm:ss');

    let priority = 0;
    priority = $('#chkPriority1').prop('checked') ? 1 : ($('#chkPriority2').prop('checked') ? 2 : ($('#chkPriority3').prop('checked') ? 3 : 0));

    if (task_name === '') {
      swal('Task name is not entered!', '', 'warning');
      return;
    }
    $('.fullScreenSpin').css('display', 'inline-block');
    let projectID = $('#addProjectID').val() ? $('#addProjectID').val() : 11;

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        TaskName: task_name,
        TaskDescription: task_description,
        Completed: false,
        ProjectID: projectID,
        due_date: due_date,
        priority: priority
      }
    };

    crmService.saveNewTask(objDetails).then(function (objDetails) {
      if (objDetails.fields.ID) {

        $(".btnAddSubTask").css("display", "block");
        $(".newTaskRow").css("display", "none");
        $(".addTaskModal").css("display", "none");

        //////////////////////////////
        templateObject.getAllTaskList();
      }

      $('.fullScreenSpin').css('display', 'none');

      $('#add_task_name').val('');
      $('#add_task_description').val('');

    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
      });
      $('.fullScreenSpin').css('display', 'none');
    });

  },

  // submit set schedule as today
  'click .setScheduleToday': function (e) {

    let id = e.target.dataset.id;

    let currentDate = new Date();
    let due_date = moment(currentDate).format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: due_date
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as tomorrow
  'click .setScheduleTomorrow': function (e) {

    let id = e.target.dataset.id;
    let tomorrow = moment().add(1, 'day').format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: tomorrow
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as weekend
  'click .setScheduleWeekend': function (e) {

    let id = e.target.dataset.id;
    let weekend = moment().endOf('week').format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: weekend
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as next week
  'click .setScheduleNexweek': function (e) {

    let id = e.target.dataset.id;

    var startDate = moment();
    let next_monday = moment(startDate).day(1 + 7).format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: next_monday
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as no-date
  'click .setScheduleNodate': function (e) {

    let id = e.target.dataset.id;

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: ''
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // set due_date
  'click .setScheduleTodayAdd': function (e) {

    let due_date = moment().format('YYYY-MM-DD hh:mm:ss');
    $('.crmEditDatepicker').val(due_date)

  },

  // set due_date
  'click .setScheduleTomorrowAdd': function (e) {

    let due_date = moment().add(1, 'day').format('YYYY-MM-DD hh:mm:ss');
    $('.crmEditDatepicker').val(due_date)

  },

  // set due_date
  'click .setScheduleWeekendAdd': function (e) {

    let due_date = moment().endOf('week').format('YYYY-MM-DD hh:mm:ss');
    $('.crmEditDatepicker').val(due_date)

  },

  // set due_date
  'click .setScheduleNexweekAdd': function (e) {

    var startDate = moment();
    let due_date = moment(startDate).day(1 + 7).format('YYYY-MM-DD hh:mm:ss');

    $('.crmEditDatepicker').val(due_date)

  },

  // set due_date
  'click .setScheduleNodateAdd': function (e) {

    $('.crmEditDatepicker').val(null)

  },

  // open add task above
  'click .add-task-above': function (e) {
    let id = e.target.dataset.id;
    let addTaskModal = '<div id="addTaskModal" class="row addTaskModal no-modal">' + $('#addTaskModal').html() + '</div>';
    $('#addTaskModal').remove();
    $('#ttodo_' + id).prepend(addTaskModal)
  },

  // open add task below
  'click .add-task-below': function (e) {
    let id = e.target.dataset.id;
    let addTaskModal = '<div id="addTaskModal" class="row addTaskModal no-modal">' + $('#addTaskModal').html() + '</div>';
    $('#addTaskModal').remove();
    $('#ttodo_' + id).append(addTaskModal)
  },

  'click .taskDropSecondFlag': function (e) {
    let id = e.target.dataset.id;
    let priority = e.target.dataset.priority;

    if (id && priority) {
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          ID: id,
          priority: priority
        }
      };

      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

});

Template.alltasks.helpers({
  alllabels: () => {
    return Template.instance().alllabels.get();
  },
  allrecords: () => {
    return Template.instance().allrecords.get();
  },

  overdueRecords: () => {
    return Template.instance().overdueRecords.get();
  },

  todayRecords: () => {
    return Template.instance().todayRecords.get();
  },

  upcomingRecords: () => {
    return Template.instance().upcomingRecords.get();
  },

  getTodoDate: (date, format) => {
    if (date == "" || date == null) return '';
    if (moment().format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'Today';
    } else if (moment().add(1, 'day').format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'Tomorrow';
    } else {
      return moment(date).format(format);
    }
  },

  getTaskStyleClass: (date) => {
    if (date == "" || date == null) return 'taskNodate';
    if (moment().format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'taskToday';
    } else if (moment().add(1, 'day').format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'taskTomorrow';
    } else if (moment().format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD')) {
      return 'taskOverdue';
    } else {
      return 'taskUpcoming';
    }
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getTomorrowDay: () => {
    return moment().add(1, 'day').format('ddd');
  },

  getNextMonday: () => {
    var startDate = moment();
    return moment(startDate).day(1 + 7).format('ddd MMM D');
  },

  getDescription: (description) => {
    return description.length < 80 ? description : description.substring(0, 79) + '...'
  },

  getTaskLabel: (labels) => {
    if (labels == '' || labels == null) {
      return '';
    } else if (labels.type == undefined) {
      let label_string = '';
      labels.forEach(label => {
        label_string += label.fields.TaskLabelName + ', '
      });
      return label_string.slice(0, -2);
    } else {
      return labels.fields.TaskLabelName;
    }
  },

});
