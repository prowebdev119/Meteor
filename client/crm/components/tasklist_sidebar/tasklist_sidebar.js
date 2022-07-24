import { CRMService } from '../../crm-service';
let crmService = new CRMService();

Template.tasklist_sidebar.onCreated(function () {

  const templateObject = Template.instance();
  templateObject.active_projects = new ReactiveVar([]);
  templateObject.archived_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);

});

Template.tasklist_sidebar.onRendered(function () {

  let templateObject = Template.instance();

  templateObject.getTProjectList = function () {
    crmService.getTProjectList().then(function (data) {

      if (data.tprojectlist && data.tprojectlist.length > 0) {

        let all_projects = data.tprojectlist.filter(project => project.fields.Active == true && project.fields.ID != 11);
        let archived_projects = all_projects.filter(project => project.fields.Archive == true);
        let active_projects = all_projects.filter(project => project.fields.Archive == false);
        let favorite_projects = active_projects.filter(project => project.fields.AddToFavourite == true);

        templateObject.active_projects.set(active_projects);
        templateObject.archived_projects.set(archived_projects);
        templateObject.favorite_projects.set(favorite_projects);

        $('.crm_project_count').html(active_projects.length)
        if (favorite_projects.length > 0) {
          $('#li_favorite').css('display', 'block');
        } else {
          $('#li_favorite').css('display', 'none');
        }

      } else {
        $('.crm_project_count').html(0)
      }

    }).catch(function (err) {

    });
  }

  templateObject.getTProjectList();

});

Template.tasklist_sidebar.events({

  'click .projectName': function (e) {
    let id = e.target.dataset.id;
    if (id) {
      FlowRouter.go('/projects?id=' + id);
      Meteor._reload.reload();
    }
  },

  // 'click .menuTasklist': function (e) {
  //   FlowRouter.go('/tasklist');
  // },

  // 'click .menuTasktoday': function (e) {
  //   FlowRouter.go('/tasktoday');
  // },

  // 'click .menuTaskupcoming': function (e) {
  //   FlowRouter.go('/taskupcoming');
  // },

  'click .menuFilterslabels': function (e) {
    FlowRouter.go('/filterslabels');
  },

  // delete project
  'click .delete-project': function (e) {
    let id = e.target.dataset.id;
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('.projectName' + id).remove();
        $('.fullScreenSpin').css('display', 'none');
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
    }
  },

  // add to favorite project
  'click .add-favorite': function (e) {
    let id = e.target.dataset.id;

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          AddToFavourite: true
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        $('#li_favorite').css('display', 'block');
        templateObject.getTProjectList();
        $('.fullScreenSpin').css('display', 'none');
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
    }
  },

  // unarchive project
  'click .remove-favorite': function (e) {
    let id = e.target.dataset.id;
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          AddToFavourite: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        templateObject.getTProjectList();
        $('.fullScreenSpin').css('display', 'none');
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
    }
  },

  // archive project
  'click .archive-project': function (e) {
    let id = e.target.dataset.id;
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Archive: true
        }
      };
      let templateObject = Template.instance();

      crmService.updateProject(objDetails).then(function (data) {
        templateObject.getTProjectList();

        $('.fullScreenSpin').css('display', 'none');
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
    }
  },

  // unarchive project
  'click .unarchive-project': function (e) {
    let id = e.target.dataset.id;

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Archive: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {

        templateObject.getTProjectList();

        $('.fullScreenSpin').css('display', 'none');
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
    }
  },

  // submit save new project
  'click .btnNewCrmProject': function (e) {
    let projectName = $('#crmProjectName').val();
    let projectColor = $('#crmProjectColor').val();
    let swtNewCrmProjectFavorite = $("#swtNewCrmProjectFavorite").prop("checked");

    if (projectName === '' || projectName === null) {
      swal('Project name is not entered!', '', 'warning');
      return;
    }

    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor,
        AddToFavourite: swtNewCrmProjectFavorite
      }
    };
    let templateObject = Template.instance();

    crmService.updateProject(objDetails).then(function (data) {

      templateObject.getTProjectList();

      $('.fullScreenSpin').css('display', 'none');
      // Meteor._reload.reload();
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

  // open edit modal
  'click .edit-project': function (e) {
    let id = e.target.dataset.id;
    crmService.getTProjectDetail(id).then(function (data) {
      if (data.fields) {

        let projectName = data.fields.ProjectName;
        let ProjectColour = data.fields.ProjectColour;
        let AddToFavourite = data.fields.AddToFavourite;
        // missing color, favorite fields
        $('#editProjectID').val(id);
        $('#editCrmProjectName').val(projectName);
        $('#editCrmProjectColor').val(ProjectColour);
        if (AddToFavourite == true) {
          $("#swteditCrmProjectFavorite").prop("checked", true);
        } else {
          $("#swteditCrmProjectFavorite").prop("checked", false);
        }

      }

    }).catch(function (err) {
      // templateObject.active_projects.set(null);
      // templateObject.archived_projects.set(null);
    });
  },

  // submit edit project
  'click .btnEditCrmProject': function (e) {
    let id = $('#editProjectID').val();
    let projectName = $('#editCrmProjectName').val();
    let projectColor = $('#editCrmProjectColor').val();
    let swtNewCrmProjectFavorite = $("#swteditCrmProjectFavorite").prop("checked");

    // tempcode
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.lentgh;
    }
    // tempcode

    if (id === '' || id === null) {
      swal('Project is not selected correctly', '', 'warning');
      return;
    }

    if (projectName === '' || projectName === null) {
      swal('Project name is not entered!', '', 'warning');
      return;
    }

    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        ID: id,
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor,
        AddToFavourite: swtNewCrmProjectFavorite
      }
    };
    let templateObject = Template.instance();

    crmService.updateProject(objDetails).then(function (data) {
      templateObject.getTProjectList();

      $('.fullScreenSpin').css('display', 'none');
      // Meteor._reload.reload();
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


  // submit duplicate project
  'click .duplicate-project': function (e) {

    let projectName = 'Copy of ' + e.target.dataset.name;
    let projectColor = e.target.dataset.color;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.lentgh;
    }

    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor
      }
    };
    projectColor = projectColor == 0 ? 'gray' : projectColor;
    let templateObject = Template.instance();

    crmService.updateProject(objDetails).then(function (data) {

      templateObject.getTProjectList();

      $('.fullScreenSpin').css('display', 'none');
      // Meteor._reload.reload();
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

});

Template.tasklist_sidebar.helpers({

  active_projects: () => {
    return Template.instance().active_projects.get();
  },

  archived_projects: () => {
    return Template.instance().archived_projects.get();
  },

  favorite_projects: () => {
    return Template.instance().favorite_projects.get();
  },

  getProjectColor: (color) => {
    if (color == 0) {
      return 'gray';
    }
    return color;
  },

  getProjectCount: (tasks) => {
    if (tasks == null) {
      return '';
    } else if (tasks.fields != undefined) {
      return 1;
    } else {
      return tasks.lentgh;
    }
  },

  stringProjecttasks: (projecttasks) => {

  }

});
