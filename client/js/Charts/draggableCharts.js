import ChartHandler from "./ChartHandler";

export default class draggableCharts {
  static disable(timeOut = 200) {
    setTimeout(() => {
      $(".connectedSortable")
        .sortable({
          disabled: true,
          connectWith: ".connectedSortable",
          placeholder: "portlet-placeholder ui-corner-all",
        })
        .disableSelection();
    }, timeOut);
  }

  static enable(timeOut = 200) {
    setTimeout(() => {
      $(".connectedSortable")
        .sortable({
          handle: '.card-header',
          disabled: false,
          scroll: false,
          placeholder: "portlet-placeholder ui-corner-all",
          tolerance: 'pointer',
          stop: async (event, ui) => {
            // console.log($(ui.item[0]));
            console.log('Dropped the sortable chart');
            $(".fullScreenSpin").css("display", "block");
            await ChartHandler.buildPositions();
            await ChartHandler.saveCharts();
            await ChartHandler.saveChartsInLocalDB();
            $(".fullScreenSpin").css("display", "none");
          },
        })
        .disableSelection();
      $(".portlet")
        .addClass(
          "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"
        )
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all");

      $(".portlet-toggle").on("click", function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
      });

      // $(".portlet").resizable({
      //   handles: "e",
      // });
    }, timeOut);
  }
}
