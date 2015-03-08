$(function () {
    var firstPostLoaded = false,
        thirdPostLoaded = false,
        sixthPostLoaded = false;
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
        if (!thirdPostLoaded & postNr == 3){
            week3Collapse();
            thirdPostLoaded = true;
        }
        if (!sixthPostLoaded & postNr == 6){
            week6Collapse();
            sixthPostLoaded = true;
        }
    });

    $( ".nav-pills" ).find( "a" ).on( "show.bs.tab", function( e ){
        if ( window.innerWidth >= 768 ) {
            e.preventDefault();
        }
    });

    week1();
    week2();
    week3();
    week4();
    week5();
    week6();

    window.fbShare = function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
        return false;
    }
});
