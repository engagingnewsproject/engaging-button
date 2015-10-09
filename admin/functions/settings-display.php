<?
/*
*   settings-display-functions.php
*   Functions for displaying the settings form
*
*/



/*
*
*   Create Settings Button HTML
*
*/
function buttonCreateForm($enp_buttons, $registered_content_types) {
    $formHTML = '';

    if($enp_buttons === false) {
        $formHTML .= buttonCreateFormHTML($enp_buttons, $registered_content_types);
    } else {
        $i = 0;
        foreach($enp_buttons as $enp_button) {
            $args['btn_slug'] = $enp_button['btn_slug'];
            $enp_btn_obj = new Enp_Button($args);
            $formHTML .= buttonCreateFormHTML($enp_buttons, $registered_content_types, $i, $enp_btn_obj);
            $i++;
        }

        // if we want to add buttons later, we'd add more after this loop
        // $formHTML .= buttonCreateFormHTML($enp_buttons, $registered_content_types, $i, $enp_btn_obj);

    }

    echo $formHTML;

}


function buttonCreateFormHTML($enp_buttons, $registered_content_types, $i = 0, $enp_btn_obj = false ) {
    $formHTML = '<table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="enp-button-type">Button</label>
                        </th>
                        <td>
                            <fieldset>'
                                .buttonCreateSlug($enp_buttons, $i, $enp_btn_obj).
                            '</fieldset>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="enp-button-content-type">Where to Use this Button</label>
                        </th>
                        <td>
                            <fieldset>'.
                                buttonCreateBtnType($enp_buttons, $i, $registered_content_types)
                            .'</fieldset>
                            <p id="enp-button-content-type-description" class="description">Where do you want this button to display?</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr>';

    return $formHTML;
}



function buttonCreateSlug($enp_buttons, $i = 0, $enp_btn_obj) {
    $buttonSlugHTML = '';

    $buttonSlugHTML .= buttonCreateSlugHTML($enp_buttons, $i, $enp_btn_obj);

    return $buttonSlugHTML;
}

function buttonCreateSlugHTML($enp_buttons, $i = 0, $enp_btn_obj) {
    // if there's no object or there are
    if($enp_btn_obj === false || $enp_btn_obj->btn_lock === false) {
        $buttonSlugHTML ='<label>
                            <input type="radio" name="enp_buttons['.$i.'][btn_slug]" aria-describedby="enp-button-slug-description" value="respect" '.checked('respect', $enp_buttons[$i]["btn_slug"], false).' /> Respect
                        </label>
                        <br/>
                        <label>
                            <input type="radio" name="enp_buttons['.$i.'][btn_slug]" aria-describedby="enp-button-slug-description" value="recommend" '.checked('recommend', $enp_buttons[$i]["btn_slug"], false).' /> Recommend
                        </label>
                        <br/>
                        <label>
                            <input type="radio" name="enp_buttons['.$i.'][btn_slug]" aria-describedby="enp-button-slug-description" value="important" '.checked('important', $enp_buttons[$i]["btn_slug"], false).' /> Important
                        </label>
                        <p id="enp-button-slug-description"class="description">Which button do you want to use on your site?</p>
                        <p class="description">Have an idea for other button text options? Let us know! ____@engagingnewsproject.org';
    } else {
        // the button object exists and it's locked, so we can't let people change it
        // without resetting everything to 0
        $buttonSlugHTML =  '<label>
                                <input type="radio" name="enp_buttons['.$i.']['.$enp_btn_obj->get_btn_slug().']" aria-describedby="enp-button-slug-description" value="respect" '.checked('respect', $enp_buttons[$i]["btn_slug"], false).' /> '.$enp_btn_obj->get_btn_name()
                          .'</label>
                          <p class="description">This button is locked because people have already clicked on it.</p>
                          <p class="description">You have to delete it and create a new button to change the button name.</p>';
    }


    return $buttonSlugHTML;
}


function buttonCreateBtnType($enp_buttons, $i, $registered_content_types) {
    $checklist_html = '';

    foreach($registered_content_types as $content_type) {
        $checklist_html .= buttonCreateBtnTypeHTML($enp_buttons, $i, $content_type);
    }

    return $checklist_html;
}

function buttonCreateBtnTypeHTML($enp_buttons, $i, $content_type) {
    $checklist_html ='';

    $name = 'enp_buttons['.$i.'][btn_type]['.$content_type['slug'].']';

    // set our default value to false
    $checked_val = false;
    // this is absurdly convoluted, but it works... Improvements are welcome
    if(isset($enp_buttons[$i]['btn_type'][$content_type['slug']])) {
        // set the value
        $checked_val = $enp_buttons[$i]['btn_type'][$content_type['slug']];
    }

    $checklist_html .= '<label>
                            <input type="checkbox" name="'.$name.'" value="1" '.checked(true, $checked_val, false).' aria-describedby="enp-button-content-type-description"/> '.$content_type['label_name'].'
                        </label>
                        <br/>';

    return $checklist_html;
}


?>
