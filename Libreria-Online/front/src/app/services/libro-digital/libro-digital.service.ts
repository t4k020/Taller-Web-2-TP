import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LibroDigitalAdquirido } from './libro-digital.interface';

@Injectable({
    providedIn: 'root'
})
export class LibroDigitalService {

    http = inject(HttpClient);

    private apiUrl = `${environment.API_URL}/api/libros-digitales`;

    getLibrosAdquiridos(compradorId: number): Observable<LibroDigitalAdquirido[]> {
        return this.http
            .get<{ message: string; data: LibroDigitalAdquirido[] }>(`${this.apiUrl}/comprador/${compradorId}`)
            .pipe(map(res => res.data));
    }

    adquirirLibro(compradorId: number, libroId: number): Observable<LibroDigitalAdquirido> {
        return this.http
            .post<{ message: string; data: LibroDigitalAdquirido }>(`${this.apiUrl}/adquirir`, { compradorId, libroId })
            .pipe(map(res => res.data));
    }

    getPdfUrl(libroId: number, compradorId: number): string {
        return `${this.apiUrl}/pdf/${libroId}?compradorId=${compradorId}`;
    }
}
