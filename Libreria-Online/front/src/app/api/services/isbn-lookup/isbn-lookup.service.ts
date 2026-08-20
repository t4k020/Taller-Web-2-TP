import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface OpenLibraryBook {
  title?: string;
  subtitle?: string;
  authors?: Array<{ name?: string }>;
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  excerpts?: Array<{ text?: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class IsbnLookupService {
  private http = inject(HttpClient);
  private apiUrl = environment.OPEN_LIBRARY_API_URL;

  buscarEnOpenLibrary(isbn: string): Observable<OpenLibraryBook | null> {
    const isbnNormalizado = this.normalizarIsbn(isbn);
    const url = `${this.apiUrl}?bibkeys=ISBN:${encodeURIComponent(isbnNormalizado)}&jscmd=data&format=json`;

    return this.http.get<Record<string, OpenLibraryBook>>(url).pipe(
      map((respuesta) => respuesta[`ISBN:${isbnNormalizado}`] ?? null)
    );
  }

  portadaUrl(isbn: string, size: 'S' | 'M' | 'L' = 'S'): string {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(this.normalizarIsbn(isbn))}-${size}.jpg?default=false`;
  }

  private normalizarIsbn(isbn: string): string {
    return isbn.trim().replace(/[^0-9Xx]/g, '').toUpperCase();
  }
}
