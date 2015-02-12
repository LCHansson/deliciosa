$(function () {
    var firstPostLoaded = false;
    $('.read-on').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $this.toggleClass('up');
        $this.toggleClass('down');
        $collapse.collapse('toggle');

        var postNr = $this.closest('.collapse-group').attr("data-post")
        if (!firstPostLoaded & postNr == 1){
            week1Collapse();
            firstPostLoaded = true;
        }
    });

    $( ".nav-pills" ).find( "a" ).on( "show.bs.tab", function( e ){
        if ( window.innerWidth >= 768 ) {
            e.preventDefault();
        }
    });

    //week1();
    week2();

    window.fbShare = function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
        return false;
    }
});
