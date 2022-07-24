Template.financialSettings.onRendered(function(){
    $(document).ready(function(){
        $("#close_model").click(function(){
            $("#lock_date").hide();
        });
        $("#btn2").click(function(){
            $(".lockDate").hide();
            $("#lock_date").show();

        });

        $("#close_model_bacs").click(function(){
            $("#lock_date_bacs").hide();
        });
        $("#btn3").click(function(){
            $(".lockDate").hide();
            $("#lock_date_bacs").show();

        });

        $("#close_model_dates").click(function(){
            $("#lock_date_dates").hide();
        });
        $("#btn4").click(function(){
            $(".lockDate").hide();
            $("#lock_date_dates").show();

        });
        $("#btn4").click(function(){
            $(".lockDate").hide();
            $("#lock_date_dates").show();
        });

    });


});
