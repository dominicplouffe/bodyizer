function find_image() {
    function seek_image(all_elements) {
        var max_width = 0.00;
        var max_height = 0.00;
        var chosen_element = null;

        for (var i = 0; i <= all_elements.length; i++) {
            el = all_elements[i];
            if (el !== undefined && el.tagName === 'IMG') {
                s = el.width + el.height;

                if (el.width> max_width && el.height > max_height) {
                    max_width > el.width;
                    max_height = el.height;
                    chosen_element = el;
                }
            }
        }

        image_url = '';
        if (chosen_element !== null) {
            image_url = chosen_element.src;
        }

        return image_url;
    }

    return seek_image(document.body.getElementsByTagName("*"));
}
