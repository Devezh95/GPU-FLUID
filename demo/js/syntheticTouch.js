export const AUTO_TOUCH_INTERVAL = 3000; // Каждые 3 сек
export const TOUCH_DURATION = 600; // Длительность касания
export const MOVE_STEPS = 12; // Количество шагов движения
export const MAX_MOVEMENT = 120; // 120 px для вижения
export const IDLE_TIMEOUT = 5000; // 5 сек без активности - включаем автосимуляцию


let lastActivityTime = Date.now();
let autoTouchTimeout = null;
let isAutoSimulationEnabled = true; //
let idleCheckInterval = null;

/**
 Функцуия проверки , сколько без активности
 */
function isUserIdle() {
  return Date.now() - lastActivityTime > IDLE_TIMEOUT;
}

/**
 * вкл/выкл автосимуляции
 */
export function disableAutoSimulation() {
  if (!isAutoSimulationEnabled) return;

  console.log("Автосимуляция ОТКЛЮЧЕНА (пользователь активен)");
  isAutoSimulationEnabled = false;

  if (autoTouchTimeout) {
    clearTimeout(autoTouchTimeout);
    autoTouchTimeout = null;
  }
}

export function enableAutoSimulation() {
  if (isAutoSimulationEnabled) return;

  console.log("Автосимуляция ВКЛЮЧЕНА (пользователь неактивен)");
  isAutoSimulationEnabled = true;
  scheduleNextAutoTouch();
}

/**
 генерация спокойного касания
 */
export async function syntheticTouch() {
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * MAX_MOVEMENT; 
  const endX = startX + Math.cos(angle) * distance;
  const endY = startY + Math.sin(angle) * distance;

  
  dispatchMouseEvent("mousemove", startX, startY, 0);
  await delay(50);


  dispatchMouseEvent("mousedown", startX, startY, 1);
  await delay(50);

  //Плавное движение
  const stepDuration = TOUCH_DURATION / MOVE_STEPS;
  for (let i = 0; i < MOVE_STEPS; i++) {
    await delay(stepDuration);
    const progress = i / MOVE_STEPS;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;
    dispatchMouseEvent("mousemove", currentX, currentY, 1);
  }

 
  await delay(50);
  dispatchMouseEvent("mouseup", endX, endY, 0);

  console.log(`TOUCH COMPLETE\n`);
}

/**
 * Следующий автотач
 */
function scheduleNextAutoTouch() {
  if (!isAutoSimulationEnabled) return;

  if (autoTouchTimeout) clearTimeout(autoTouchTimeout);

  autoTouchTimeout = setTimeout(async () => {
    await syntheticTouch();
    scheduleNextAutoTouch();
  }, AUTO_TOUCH_INTERVAL);
}


function dispatchMouseEvent(type, clientX, clientY, buttons) {
  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return;

  element.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      screenX: clientX,
      screenY: clientY,
      pageX: clientX,
      pageY: clientY,
      buttons,
    }),
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * пользовательский ввод
 * включение асинхронной автосимуляции
 */
export function initUserInteractionTracking() {
  const allEvents = [
    "mousedown",
    "mousemove",
    "mouseup",
    "touchstart",
    "touchmove",
    "touchend",
  ];

  allEvents.forEach((eventType) => {
    document.addEventListener(
      eventType,
      () => {
        lastActivityTime = Date.now();
        disableAutoSimulation(); // пользователь активен — выключаем авто
      },
      true,
    );
  });

  // Проверяем каждые 1 сек, не пора ли включить автосимуляцию
  idleCheckInterval = setInterval(() => {
    if (isUserIdle() && !isAutoSimulationEnabled) {
      enableAutoSimulation();
    }
  }, 1000);

  console.log("Отслеживание активности включено");
}
