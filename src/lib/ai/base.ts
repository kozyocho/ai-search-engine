export interface AIProvider {
  id: string;
  name: string;
  search(query: string, apiKey: string): Promise<string>;
}

export abstract class BaseAIProvider implements AIProvider {
  constructor(public id: string, public name: string) {}

  abstract search(query: string, apiKey: string): Promise<string>;
}
