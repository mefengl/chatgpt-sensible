// ==UserScript==
// @name         chatgpt sensible
// @namespace    https://github.com/mefengl
// @version      0.0.2
// @description  sensible to me
// @author       mefengl
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        const $new_button = $('nav a:first').css('color', 'gray');
        $new_button.appendTo('form div:first');
    });
})();
