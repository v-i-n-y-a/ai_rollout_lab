export interface Item {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: string;
}

export interface ItemSummary {
  readonly itemId: string;
  readonly summary: string;
  readonly generatedAt: string;
}
