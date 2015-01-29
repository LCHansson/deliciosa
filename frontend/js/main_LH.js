$(function () {
    //var firstPostLoaded = false;
    $('#lasVidareID').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
        var postNr = $this.closest('.collapse-group').attr("data-post")
        /*if ( !firstPostLoaded &postNr == 1 ){
            week1Collapse();
            firstPostLoaded = true;
        }*/
    });

    week1();
    makeSongBrowser();
});