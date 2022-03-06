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
  "button_a",
  "button_b",
  "button_start",
  "button_z",
  "button_l",
  "button_r",
  "button_c_up",
  "button_c_down",
  "button_c_left",
  "button_c_right",
];

const getGamepad = () =>
  [].slice.call(window.navigator.getGamepads()).find((gamepad) => gamepad);

const getGamepadButtons = () => getGamepad().buttons;

startRecordingButton.addEventListener("click", () => {
  // const buttonElements = [].slice.call(
  //   document.querySelectorAll('img')
  // );

  let buttonInterval;

  let requestAnimation;

  let currentButtonIndex = 0;

  document
    .querySelector(`#${buttons[currentButtonIndex]}`)
    .setAttribute("class", "visible");

  const waitForInput = () => {
    const gamepad = getGamepad();

    document
      .querySelector(`#${buttons[currentButtonIndex]}`)
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

          document.querySelectorAll('img').forEach((button) => button.removeAttribute("class"));

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
