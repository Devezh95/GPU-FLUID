export const AUTO_TOUCH_INTERVAL = 5000; // Каждые 5 сек
export const TOUCH_DURATION = 800; // Длительность касания (мс)
export const MOVE_STEPS = 15; // Количество шагов движения (больше = плавнее)

export async function syntheticTouch() {
  // Случайная позиция на экране
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;

  // Конечная позиция (близко к начальной, спокойное движение)
  const endX = startX + (Math.random() - 0.5) * 100;
  const endY = startY + (Math.random() - 0.5) * 100;

  console.log(
    `🌊 SMOOTH TOUCH START at (${startX.toFixed(0)}, ${startY.toFixed(0)})`,
  );

  // === MOUSEDOWN (начало касания) ===
  document.elementFromPoint(startX, startY)?.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: startX,
      clientY: startY,
      screenX: startX,
      screenY: startY,
      pageX: startX,
      pageY: startY,
      buttons: 1,
    }),
  );
  document.elementFromPoint(startX, startY)?.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: startX,
      clientY: startY,
      screenX: startX,
      screenY: startY,
      pageX: startX,
      pageY: startY,
      buttons: 1,
    }),
  );
  // === ПЛАВНОЕ ДВИЖЕНИЕ (MOUSEMOVE) ===
  const stepDuration = TOUCH_DURATION / MOVE_STEPS;

  for (let i = 0; i < MOVE_STEPS; i++) {
    await delay(stepDuration);

    // Интерполяция: плавное движение от start к end
    const progress = i / MOVE_STEPS;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    document.elementFromPoint(currentX, currentY)?.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: currentX,
        clientY: currentY,
        screenX: currentX,
        screenY: currentY,
        pageX: currentX,
        pageY: currentY,
        buttons: 1,
      }),
    );
  }

  // === MOUSEUP (конец касания) ===
  await delay(100);
  document.elementFromPoint(endX, endY)?.dispatchEvent(
    new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      clientX: endX,
      clientY: endY,
      screenX: endX,
      screenY: endY,
      pageX: endX,
      pageY: endY,
      buttons: 1,
    }),
  );

  console.log(`✨ SMOOTH TOUCH END\n`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForCanvas(callback) {
  const interval = setInterval(() => {
    const canvas = document.querySelector("#content canvas");
    if (canvas) {
      clearInterval(interval);
      callback(canvas);
    }
  }, 50);
}
