$(function () {
    var firstPostLoaded = false;
    $('.read-on').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
        $this.children( "i" ).toggleClass( "fa-caret-square-o-down" );
        $this.children( "i" ).toggleClass( "fa-caret-square-o-up" );
        if (  $this.children( "i" ).hasClass( "fa-caret-square-o-down" ) ) {

            $('html, body').animate({
                scrollTop: $this.offset().top - $collapse.height() - 200
            }, 0)
        }
        var postNr = $this.closest('.collapse-group').attr("data-post")
        if ( !firstPostLoaded & postNr == 1 ){
            week1Collapse();
            firstPostLoaded = true;
        }
    });

    week1();

    window.fbShare = function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
        return false;
    }
});