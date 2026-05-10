import { Injectable, signal } from '@angular/core';
import { Product } from './models';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  readonly products = signal<Product[]>([]);

  constructor(private readonly storage: StorageService) {
    this.products.set(this.storage.get<Product[]>(STORAGE_KEYS.products, []));
  }

  getById(productId: string): Product | undefined {
    return this.products().find((product) => product.id === productId);
  }
}
