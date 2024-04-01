interface BaseComponentOptions<K extends keyof HTMLElementTagNameMap> {
  parentNode?: BaseComponent | HTMLElement | null;
  tag: K;
  className?: string;
  content?: string;
}

interface HTMLElementWithBaseComponent extends HTMLElement {
  component: BaseComponent;
}

class BaseComponent<K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  protected node: HTMLElementTagNameMap[K];

  unsubbers: Array<() => void> = [];

  constructor({ parentNode = null, tag, className = '', content = '' }: BaseComponentOptions<K>) {
    this.node = document.createElement(tag);
    this.node.className = className;
    this.node.innerHTML = content;
    if (parentNode) {
      parentNode.append(this.node);
    }
    (this.node as HTMLElementWithBaseComponent).component = this;
  }

  cleanup() {
    this.unsubbers.forEach((unsub) => unsub());
  }

  removes(): void {
    this.node.remove();
  }

  append(...components: (BaseComponent | HTMLElement)[]): void {
    const nodes = components.map((component) => {
      if (component instanceof HTMLElement) {
        return component;
      }
      return component.node;
    });
    this.node.append(...nodes);
  }

  before(...components: (BaseComponent | HTMLElement)[]): void {
    const nodes = components.map((component) => {
      if (component instanceof HTMLElement) {
        return component;
      }
      return component.node;
    });
    this.node.before(...nodes);
  }

  prepend(...components: (BaseComponent | HTMLElement)[]): void {
    const nodes = components.map((component) => {
      if (component instanceof HTMLElement) {
        return component;
      }
      return component.node;
    });
    this.node.prepend(...nodes);
  }

  addListener(eventName: string, callback: EventListener): void {
    this.node.addEventListener(eventName, callback);
  }

  removeListener(eventName: string, callback: EventListener): void {
    this.node.removeEventListener(eventName, callback);
  }

  setAttributes(attrs: { [key: string]: string | undefined }): void {
    Object.entries(attrs).forEach(([name, value]) => {
      if (!value) return;
      this.node.setAttribute(name, value);
    });
  }

  removeAttributes(...args: string[]): void {
    args.forEach((attribute) => {
      this.node.removeAttribute(attribute);
    });
  }

  setContent(content: string): void {
    this.node.textContent = content;
  }

  addClass(...classNames: string[]): void {
    this.node.classList.add(...classNames);
  }

  removeClass(...classNames: string[]): void {
    this.node.classList.remove(...classNames);
  }

  toggleClass(className: string, state?: boolean): void {
    this.node.classList.toggle(className, state);
  }

  clear(): void {
    this.node.innerHTML = '';
  }

  replaceWith(newElement: BaseComponent | HTMLElement): void {
    if (newElement instanceof HTMLElement) {
      this.node.replaceWith(newElement);
    } else {
      this.node.replaceWith(newElement.node);
    }
  }

  get style(): CSSStyleDeclaration {
    return this.node.style;
  }

  setWidth(value: number): this {
    this.node.style.width = `${value}px`;
    return this;
  }

  countChildren(): number {
    return this.node.childElementCount;
  }

  getChildren(): HTMLElement[] {
    return Array.from(this.node.children) as HTMLElement[];
  }

  get innerText(): string {
    return this.node.innerText;
  }

  get value(): string {
    if (this.node instanceof HTMLInputElement) {
      return this.node.value;
    }
    throw new Error('Node is not an HTMLInputElement');
  }

  setValue(value: string): void {
    if (this.node instanceof HTMLInputElement) {
      this.node.value = value;
      return;
    }
    throw new Error('Node is not an HTMLInputElement');
  }

  animate(keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation {
    return this.node.animate(keyframes, options);
  }

  stopAnimations(): void {
    this.node.getAnimations().forEach((animation) => animation.cancel());
  }

  pauseAnimations(): void {
    this.node.getAnimations().forEach((animation) => {
      if (animation instanceof CSSAnimation) return;
      animation.pause();
    });
  }

  disable(): void {
    (this.node as HTMLButtonElement).disabled = true;
  }

  enable(): void {
    (this.node as HTMLButtonElement).disabled = false;
  }

  getAnimation(id: string): Animation | undefined {
    return this.node.getAnimations().find((animation) => animation.id === id);
  }
}

export default BaseComponent;
