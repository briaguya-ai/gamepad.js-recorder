import bowser from "bowser";

const browser = bowser.getParser(window.navigator.userAgent);

const dataPreview = document.querySelector("pre");

const data = {
  id: "unknown controller",
  friendlyName: "",
  browser: browser.getBrowserName(),
  os: browser.getOSName(),
  buttons: {}
};

const startRecordingButton = document.querySelector(".btn-primary");

const buttons = [
  "button_1",
  "button_2",
  "button_3",
  "button_4",
  "shoulder_top_left",
  "shoulder_top_right",
  "shoulder_bottom_left",
  "shoulder_bottom_right",
  "select",
  "start",
  "stick_button_left",
  "stick_button_right",
  "d_pad_up",
  "d_pad_down",
  "d_pad_left",
  "d_pad_right",
  "vendor"
];

const getGamepad = () =>
  [].slice.call(window.navigator.getGamepads()).find((gamepad) => gamepad);

const getGamepadButtons = () => getGamepad().buttons;

startRecordingButton.addEventListener("click", () => {
  const highlights = [].slice.call(
    document.querySelectorAll('svg [id$="_highlight"]')
  );

  let buttonInterval;

  let requestAnimation;

  let currentButtonIndex = 0;

  document
    .querySelector(`svg [id$="${buttons[currentButtonIndex]}_highlight"]`)
    .setAttribute("class", "visible");

  const waitForInput = () => {
    const gamepad = getGamepad();

    document
      .querySelector(`svg [id$="${buttons[currentButtonIndex]}_highlight"]`)
      .setAttribute("class", "visible");

    if (gamepad && !buttonInterval) {
      data.id = gamepad.id;

      const buttonIndex = getGamepadButtons().findIndex(
        (button) => button.pressed
      );

      if (buttonIndex > -1) {
        data.buttons[buttons[currentButtonIndex]] = buttonIndex;

        dataPreview.innerHTML = JSON.stringify(data, null, 2);

        if (currentButtonIndex < buttons.length - 1) {
          currentButtonIndex += 1;

          highlights.map((highlight) => highlight.removeAttribute("class"));

          buttonInterval = setInterval(() => {
            if (
              getGamepadButtons().findIndex((button) => button.pressed) !==
              buttonIndex
            ) {
              clearInterval(buttonInterval);

              buttonInterval = null;
            }
          }, 100);
        }
      }
    }

    requestAnimation = requestAnimationFrame(waitForInput);
  };

  requestAnimationFrame(waitForInput);
});
