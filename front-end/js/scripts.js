/**
 * scripts.js
 *
 * General Enp Button scripts
 */

jQuery( document ).ready( function( $ ) {


    $('.enp-btn').click(function(e) {
        e.preventDefault();

        // if user is not logged in & it's required, then disable the button
        var enp_btn_clickable = enp_button_params.enp_btn_clickable;
        var enp_login_url = enp_button_params.enp_login_url;

        if(enp_btn_clickable == 0) { // false
            // if we already have an error message, destroy it
            if($('.enp-btn-error-message').length) {
                $('.enp-btn-error-message').remove();
            }

            var btns_group_wrap_id = $(this).parent().parent().parent().attr('id');
            // append the button wrap id to the login url
            enp_login_url = enp_login_url+'%2F%23'+btns_group_wrap_id;
            // get the place to append the message
            var btn_group = $(this).parent().parent();
            var message = 'You must be <a href="'+enp_login_url+'">logged in</a> to click this button. Please <a href="'+enp_login_url+'">log in</a> and try again.';
            enp_errorMessage(btn_group, message);
            return false;
        }

        if( $(this).hasClass('enp-btn--clicked')||
            $(this).hasClass('enp-btn--success')||
            $(this).hasClass('enp-btn--error')  ||
            $(this).hasClass('enp-btn--disabled')
        ) {
            return; // hey! You're not supposed to click me!
        } else {
            // $(this).addClass('enp-btn--disabled');
            $(this).addClass('enp-btn--clicked');
        }

        // assume that our front-end check is enough
        // and increase it by 1 for a super fast response time
        enp_increaseCount(this);

        // if it's a post, pass the id/slug to an ajax request to update the post_meta for this post
        var id       = $(this).attr( 'data-pid' );
        var nonce    = $(this).attr( 'data-nonce' );
        var btn_slug = $(this).attr( 'data-btn-slug' );
        var btn_type = $(this).attr( 'data-btn-type' );
        var url      = enp_button_params.ajax_url;

        // if it's a comment, pass the id/slug to an ajax request to update the comment_meta for this comment
        // Post to the server
        $.ajax({
            type: 'POST',
            url: url,
            data:  {
                    'action': 'enp_update_button_count',
                    'pid': id,
                    'slug': btn_slug,
                    'type': btn_type,
                    'nonce': nonce
                },
            dataType: 'xml',
            success:function(xml) {
                // don't do anything!
                // If we update with the xml count, it could be wrong if someone
                // on a different connection has clicked it. Then, it would go up by
                // multiple numbers, instead of just one, and the person seeing that
                // happen would think that their click registered lots of times instead
                // of correctly counting just once

                // here's how to get the new count from the returned xml doc though
                // var count = $(xml).find('count').text();
                var btn_type = $(xml).find('type').text();
                var pid = $(xml).find('pid').text();
                var btn_slug = $(xml).find('slug').text();
                var btn = $('#'+btn_slug+'_'+btn_type+'_'+pid);
                var response = $(xml).find('response_data').text(); // will === 'success' or 'error'

                if(response === 'error') {
                    // there was an error updating the meta key on the server
                    // reset the count back one and let the user know what's up
                    var message = $(xml).find('message').text();
                    // show error message
                    var btn_group = $('.enp-btns-'+btn_type+'-'+pid);
                    // process the error
                    enp_processError(btn, btn_group, message);

                } else {
                    // success! add a btn class so we can style if we want to
                    btn.addClass('enp-btn--success');
                }

            },
            error:function(json) {

                var error = $.parseJSON(json.responseText);
                // An error occurred when trying to post, alert an error message
                var message = error.message;
                var pid = error.pid;
                var btn_type = error.btn_type;
                var btn_slug = error.btn_slug;
                // create objects
                var btn = $('#'+btn_slug+'_'+btn_type+'_'+pid);
                var btn_group = $('.enp-btns-'+btn_type+'-'+pid);

                // process the error
                enp_processError(btn, btn_group, message);
            }


        });


    });


    // Increase the count by 1
    function enp_increaseCount(btn) {
        var curr_count = enp_getBtnCount(btn);
        // if curr_count is 0, then remove the class that hides the 0
        if(curr_count === 0) {
            count.removeClass('enp-btn__count--zero');
        }

        // add one for the click
        new_count = curr_count + 1;
        // replace the text with the new number
        count.text(new_count);
    }


    // get the current count of a button
    function enp_getBtnCount(btn) {
        count = $('.enp-btn__count', btn);
        var curr_count = count.text();
        // turn it into an integer
        curr_count = parseInt(curr_count);

        return curr_count;
    }

    // roll back count on error
    function enp_rollBackCount(btn) {
        var new_count = enp_getBtnCount(btn);
        var roll_back_count = new_count - 1;
        $('.enp-btn__count', btn).text(roll_back_count);
    }

    function enp_errorMessage(obj, message) {
        // append the error message
        obj.append('<p class="enp-btn-error-message">'+message+'</p>');
    }

    function enp_processError(btn, btn_group, message) {
        // roll back count
        enp_rollBackCount(btn);

        // create error message
        enp_errorMessage(btn_group, message);

        // add disabled and error classes to the button
        btn.addClass('enp-btn--disabled enp-btn--error');
    }


});
