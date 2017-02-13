import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, ConnectionBackend, Request, RequestOptionsArgs, Response } from '@angular/http';

@Injectable()
export class HadronHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
      super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
      console.log(url);
      return this.intercept(super.request(url, options));       
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      console.log(url);
      return this.intercept(super.get(url,options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
      return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.delete(url, options));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
      options.headers.append('Content-Type', 'application/json');
      return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
      return observable.catch((err, source) => {
          if (err.status  == 403) {
              return Observable.empty();
              
          }
          return Observable.throw(err);
      });
  }
}