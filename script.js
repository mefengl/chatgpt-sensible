// ==UserScript==
// @name         chatgpt sensible
// @namespace    https://github.com/mefengl
// @version      0.5.18
// @description  sensible to me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @author       mefengl
// @match        https://chat.openai.com/*
// @grant        none

// @name:en      ChatGPT Sensible
// @description:en Sensible to me
// @name:zh-CN   聊天GPT明智
// @description:zh-CN 对我来说明智
// @name:es      ChatGPT Sensato
// @description:es Sensato para mí
// @name:hi      चैटजीपीटी संवेदनशील
// @description:hi मेरे लिए संवेदनशील
// @name:ar      ChatGPT حساس
// @description:ar حساس بالنسبة لي
// @name:pt      ChatGPT Sensato
// @description:pt Sensato para mim
// @name:ru      ChatGPT Разумный
// @description:ru Разумно для меня
// @name:ja      ChatGPTセンシブル
// @description:ja 私にとって感覚的
// @name:de      ChatGPT Sinnvoll
// @description:de Sinnvoll für mich
// @name:fr      ChatGPT Sensible
// @description:fr Sensible pour moi
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
    const textarea = getTextarea();
    if (!textarea)
      return;
    return textarea.nextElementSibling;
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
    return ((_a = getTextarea()) == null ? void 0 : _a.value) || "";
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
  function regenerate() {
    const regenerateButton = getRegenerateButton();
    if (!regenerateButton)
      return;
    regenerateButton.click();
  }
  function onSend(callback) {
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.addEventListener("keydown", function(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        callback();
      }
    });
    const sendButton = getSubmitButton();
    if (!sendButton)
      return;
    sendButton.addEventListener("mousedown", callback);
  }
  function isGenerating() {
    var _a, _b;
    return ((_b = (_a = getSubmitButton()) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.childElementCount) === 3;
  }
  function waitForIdle() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isGenerating()) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  function setListener(key = "prompt_texts") {
    let last_trigger_time = +/* @__PURE__ */ new Date();
    if (location.href.includes("chat.openai")) {
      GM_addValueChangeListener(key, (name, old_value, new_value) => __async(this, null, function* () {
        if (+/* @__PURE__ */ new Date() - last_trigger_time < 500) {
          return;
        }
        last_trigger_time = +/* @__PURE__ */ new Date();
        setTimeout(() => __async(this, null, function* () {
          const prompt_texts = new_value;
          if (prompt_texts.length > 0) {
            let firstTime = true;
            while (prompt_texts.length > 0) {
              if (!firstTime) {
                yield new Promise((resolve) => setTimeout(resolve, 2e3));
              }
              if (!firstTime && chatgpt.isGenerating()) {
                continue;
              }
              firstTime = false;
              const prompt_text = prompt_texts.shift() || "";
              chatgpt.send(prompt_text);
            }
          }
        }), 0);
        GM_setValue(key, []);
      }));
    }
  }
  var chatgpt = {
    getTextarea,
    getSubmitButton,
    getRegenerateButton,
    getStopGeneratingButton,
    getLastResponseElement,
    getLastResponse,
    getTextareaValue,
    setTextarea,
    send,
    regenerate,
    onSend,
    isGenerating,
    waitForIdle,
    setListener
  };
  var chatgpt_default = chatgpt;

  // src/onSend/index.ts
  function onSend2(callback) {
    const textarea = chatgpt_default.getTextarea();
    if (!textarea)
      return;
    textarea.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        callback();
      }
    });
    const sendButton = chatgpt_default.getSubmitButton();
    if (!sendButton)
      return;
    sendButton.addEventListener("click", callback);
  }
  var onSend_default = onSend2;

  // src/autoCopyWhenSend/index.ts
  function autoCopyWhenSend() {
    onSend_default(() => {
      navigator.clipboard.writeText(chatgpt_default.getTextareaValue());
    });
  }

  // src/sendLaterOrForceSend/index.ts
  function sendLaterOrForceSend() {
    let waitForSecondEnter = false;
    onSend_default(() => __async(this, null, function* () {
      var _a;
      const stopGeneratingButton = chatgpt_default.getStopGeneratingButton();
      if (!stopGeneratingButton)
        return;
      if (waitForSecondEnter) {
        waitForSecondEnter = false;
        stopGeneratingButton.click();
        (_a = chatgpt_default.getSubmitButton()) == null ? void 0 : _a.click();
        setTimeout(() => {
          const infoDiv = getInfoDiv();
          if (!infoDiv)
            return;
          console.log(infoDiv.innerHTML);
          if (infoDiv.innerHTML.toLowerCase().includes("error")) {
            const regenerateButton = chatgpt_default.getRegenerateButton();
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
