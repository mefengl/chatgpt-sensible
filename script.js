// ==UserScript==
// @name         chatgpt sensible
// @namespace    https://github.com/mefengl
// @version      0.5.17
// @description  sensible to me
// @author       mefengl
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/infoDiv/index.ts
  function getInfoDiv() {
    return document.querySelector("#infoDiv");
  }
  function getInfoDivClone() {
    return document.querySelector("#infoDivClone");
  }
  function initInfoDivClone() {
    var _a;
    let infoDiv = getInfoDiv();
    if (!infoDiv) {
      infoDiv = document.querySelector("form > div > div");
      infoDiv.id = "infoDiv";
    }
    let infoDivClone = getInfoDivClone();
    if (!infoDivClone) {
      infoDivClone = infoDiv.cloneNode(true);
      infoDivClone.id = "infoDivClone";
      (_a = infoDiv.parentNode) == null ? void 0 : _a.insertBefore(infoDivClone, infoDiv);
    }
  }

  // ../../packages/chatkit/dist/index.mjs
  function getTextarea() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const textareas = form.querySelectorAll("textarea");
    const result = textareas[0];
    return result;
  }
  function getSubmitButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = buttons[buttons.length - 1];
    return result;
  }
  function getRegenerateButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("regenerate");
    });
    return result;
  }
  function getStopGeneratingButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("stop generating");
    });
    return result;
  }
  function getLastResponseElement() {
    const responseElements = document.querySelectorAll(".group.w-full");
    return responseElements[responseElements.length - 1];
  }
  function getLastResponse() {
    const lastResponseElement = getLastResponseElement();
    if (!lastResponseElement)
      return;
    const lastResponse = lastResponseElement.textContent;
    return lastResponse;
  }
  function getTextareaValue() {
    var _a;
    return ((_a = chatkit.getTextarea()) == null ? void 0 : _a.value) || "";
  }
  function setTextarea(message) {
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.value = message;
    textarea.dispatchEvent(new Event("input"));
  }
  function send(message) {
    setTextarea(message);
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  }
  function waitForIdle() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!getStopGeneratingButton()) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  var chatkit = {
    getTextarea,
    getSubmitButton,
    getRegenerateButton,
    getStopGeneratingButton,
    getLastResponseElement,
    getLastResponse,
    getTextareaValue,
    setTextarea,
    send,
    waitForIdle
  };
  var src_default = chatkit;

  // src/onSend/index.ts
  function onSend(callback) {
    const textarea = src_default.getTextarea();
    if (!textarea)
      return;
    textarea.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        callback();
      }
    });
    const sendButton = src_default.getSubmitButton();
    if (!sendButton)
      return;
    sendButton.addEventListener("click", callback);
  }
  var onSend_default = onSend;

  // src/autoCopyWhenSend/index.ts
  function autoCopyWhenSend() {
    onSend_default(() => {
      navigator.clipboard.writeText(src_default.getTextareaValue());
    });
  }

  // src/sendLaterOrForceSend/index.ts
  function sendLaterOrForceSend() {
    let waitForSecondEnter = false;
    onSend_default(() => __async(this, null, function* () {
      var _a;
      const stopGeneratingButton = src_default.getStopGeneratingButton();
      if (!stopGeneratingButton)
        return;
      if (waitForSecondEnter) {
        waitForSecondEnter = false;
        stopGeneratingButton.click();
        (_a = src_default.getSubmitButton()) == null ? void 0 : _a.click();
        setTimeout(() => {
          const infoDiv = getInfoDiv();
          if (!infoDiv)
            return;
          console.log(infoDiv.innerHTML);
          if (infoDiv.innerHTML.toLowerCase().includes("error")) {
            const regenerateButton = src_default.getRegenerateButton();
            if (regenerateButton)
              regenerateButton.click();
          }
        }, 3e3);
        return;
      }
      const infoDivClone = getInfoDivClone();
      if (!infoDivClone)
        return;
      infoDivClone.innerHTML = "Press enter again in 3 seconds to send";
      waitForSecondEnter = true;
      setTimeout(() => {
        waitForSecondEnter = false;
        infoDivClone.innerHTML = "";
      }, 3e3);
    }));
  }

  // src/index.ts
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 1e3));
      initInfoDivClone();
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      autoCopyWhenSend();
      sendLaterOrForceSend();
    });
  }
  (function() {
    main();
  })();
})();
