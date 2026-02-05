// Параметры синтетических касаний

export const AUTO_TOUCH_INTERVAL = 1500;
export const TOUCH_STEPS = 3;
export const TOUCH_STEP_SIZE = 0.05;
export const TOUCH_RANDOMNESS = 0.5;

// Функция генерации pointer-событий
export function emitMouse(canvas, type, x, y) {
  const rect = canvas.getBoundingClientRect();

  const event = new MouseEvent(type, {
    clientX: rect.left + x * rect.width,
    clientY: rect.top + y * rect.height,
    bubbles: true,
    cancelable: true,
  });

  canvas.dispatchEvent(event);
}


// Логирование реальных касаний пользователя P.S. Можно закомментить если не нужно:)
export function attachRealPointerListeners(canvas) {
  canvas.addEventListener("pointerdown", (e) => {
    console.log(
      `Real pointerdown at (${(e.offsetX / canvas.width).toFixed(2)}, ${(e.offsetY / canvas.height).toFixed(2)})`,
    );
  });
  canvas.addEventListener("pointermove", (e) => {
    console.log(
      `Real pointermove at (${(e.offsetX / canvas.width).toFixed(2)}, ${(e.offsetY / canvas.height).toFixed(2)})`,
    );
  });
  canvas.addEventListener("pointerup", (e) => {
    console.log(
      `Real pointerup at (${(e.offsetX / canvas.width).toFixed(2)}, ${(e.offsetY / canvas.height).toFixed(2)})`,
    );
  });
}

// Синтетическое касание (автокасание)
export function syntheticTouch(canvas) {
  let x = Math.random();
  let y = Math.random();

  emitMouse(canvas, "mousedown", x, y);

  for (let i = 0; i < TOUCH_STEPS; i++) {
    x += (Math.random() - 0.5) * TOUCH_STEP_SIZE * TOUCH_RANDOMNESS;
    y += (Math.random() - 0.5) * TOUCH_STEP_SIZE * TOUCH_RANDOMNESS;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    emitMouse(canvas, "mousemove", x, y);
  }

  emitMouse(canvas, "mouseup", x, y);
  console.log("Synthetic touch completed.\n");
}

// Ждём появления canvas
export function waitForCanvas(callback) {
  const interval = setInterval(() => {
    const canvas = document.querySelector("#content canvas");
    if (canvas) {
      clearInterval(interval);
      console.log(
        "Canvas ready! Synthetic touches and real touch logging enabled.",
      );
      callback(canvas);
    }
  }, 50);
}
