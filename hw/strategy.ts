import { Widget } from './db';

export interface Strategy {
  doStrategy(widgetOrWidgets: Widget | Widget[]): Promise<Widget[]>;
}

export class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  public getDataLinkWidgetsChain(
    widgetOrWidgets: Widget | Widget[]
  ): Promise<Widget[]> {
    return this.strategy.doStrategy(widgetOrWidgets);
  }
}
