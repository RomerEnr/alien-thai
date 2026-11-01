export const query = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);

export const queryAll = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(selector),
];

export const listenOnce = (target: EventTarget, type: string, listener: () => void) =>
  target.addEventListener(type, listener, { once: true });

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
