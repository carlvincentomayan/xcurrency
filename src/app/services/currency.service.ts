import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@Injectable()
export class CurrencyService {

    API_KEY = '7488255780c23c61f7a6';
    
    constructor(public http: HttpClient) {}

    getCountries() {
        return this.http.get(`https://restcountries.com/v3.1/all`).toPromise();            
    }
    getBaseExchangeRate(){
        return this.http.get(`https://openexchangerates.org/api/latest.json?app_id=e683a3f9c1054e07b82ef47b8d5f29d3`).toPromise();    
    }
    // getExchangeRate(from: String, to: String){
    //     return this.http.get(`http://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y&apiKey=${this.API_KEY}`).toPromise();    
    // }


    async getExchangeRate(from: String, to: String,amt) { 
        var headers = new Headers();
        headers.append("apikey", "yAerRTj3CB9clLoBr37jfdFMID6sgtHx");
        
        var requestOptions : RequestInit = {
          method: 'GET',
          redirect: 'follow',
          headers: headers
        };
        
        return await fetch(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amt}`,requestOptions)
                .then(response => response.text())
                .then(data => {
                    return data;
                }).catch(error => {
                    return error;
                });
       
    }
    // getExchangeRate(from: String, to: String){ }

    // this.http({method: 'GET', url: '[the-target-url]', headers: {
    //     'Authorization': '[your-api-key]'}
    //   });

    // var myHeaders = new Headers();
    // myHeaders.append("apikey", "pjeqA1G8dYkCkaadtr99qIw6dOebqkt5");
    
    // var requestOptions = {
    //   method: 'GET',
    //   redirect: 'follow',
    //   headers: myHeaders
    // };
    
    // fetch("https://api.apilayer.com/fixer/convert?to=USD&from=EUR&amount=1", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
}