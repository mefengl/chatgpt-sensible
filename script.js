// ==UserScript==
// @name         chatgpt sensible
// @namespace    https://github.com/mefengl
// @version      0.0.4
// @description  sensible to me
// @author       mefengl
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 0️⃣ a menu to control options
    // ...
    $(document).ready(function () {
        // 1️⃣ always send message when press enter (even when generating)
        $("textarea").on("keydown", function (event) {
            if (event.key === "Enter") {
                // click stop generation if exist
                // re click send button
            }
        });
        // 2️⃣ copy question when send it
        $("textarea").on("keydown", function (event) {
            if (event.key === "Enter") {
                navigator.clipboard.writeText($("textarea").val());
            }
        });
    });
})();
