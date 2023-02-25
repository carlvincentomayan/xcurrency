
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrencyService } from "../services/currency.service";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('selectfrom') selectfrom:ElementRef; 
  @ViewChild('selectto') selectto:ElementRef; 
  timer;
  countryCodes:any;
  countryCodesSubject = new BehaviorSubject(0)
  countryNames = new Map();
  process:boolean;
  resultRate: any = "0.00";
  currRate: any = "0.00";
  fcurrInfo : any;
  tcurrInfo : any;
  swappedRate: any;
  xchangeresponse;
  fromValue: any;
  toValue: any;
  size;
  fromCurr: any = 'USD'; // default values
  toCurr: any = 'PHP'; // default values
  fromCountry;
  toCountry;
  selectedOption;
  timestamp;
  date;
  fromflag;
  toflag;
  localstorageItems : any[] = [];
  error = {
    val : false,
    msg : ""
  };
  constructor(public navCtrl: NavController, protected cuService: CurrencyService, public http: HttpClient,) {

  }

  ngOnInit() {
    this.fetchCountries();
    
  }

  ngAfterViewInit() {
    this.countryCodesSubject.subscribe((x :any) => {
      if (x != null && x.length > 0) {
        this.loadcurrencinfo();
        this.calculateCurrencyOne();
      }
    });
  }
  /* An asynchronous function which retrieves 
  CountryCode List
  */
  async fetchCountries() {
    try {
      this.countryCodes = [];
      const res:any = await this.cuService.getCountries();
      res.forEach((resu,i) => {
        if (resu && resu !== 'null' && typeof resu !== 'undefined' && resu.currencies != undefined ) {
          let data = {
            country : resu?.name.common,
            countrycode : resu?.cioc ? resu["cioc"] : "",
            currencies : resu?.currencies ? resu["currencies"]:"",
            currency : resu.currencies != undefined  ? Object.keys(resu.currencies)[0]: "",
            currencyinfo : resu.currencies != undefined ? Object.values(resu.currencies)[0]:"",
            flag : resu.currencies != undefined ? resu?.flags?.png:""
          }
          
          if (data.countrycode != undefined) {
            this.countryCodes.push(data);
            //this.countryNames.set(resu, res['results'][resu].currencyName);
          } else {
            console.log(JSON.stringify(data))
          }
          
        }
        
      });
      this.countryCodesSubject.next(this.countryCodes);
    } catch (err) {
      console.error(err);
    }
    
    await this.countryCodes.sort((a,b) => a.currency.localeCompare(b.currency));
    // setTimeout(() => {
    //   this.loadcurrencinfo();  
    // }, 1000);
    
  }
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			e.preventDefault();
		}
	}
   loadcurrencinfo(){
     let ff = "USD - United States"; //default
     let ft = "PHP - Philippines"; //default
     let cf = this.selectfrom.nativeElement;
     let ct = this.selectto.nativeElement;
     let cfarray = cf.selectedOptions.length == 0 ? ff.split('-') : cf.selectedOptions[0].text.split('-');
     let ctarray = ct.selectedOptions.length == 0 ? ft.split('-') : ct.selectedOptions[0].text.split('-');
      this.fromCountry = this.countryCodes.find(elem=> elem.currency.trim() == cfarray[0].trim() && elem.country == cfarray[1].trim());
      this.toCountry = this.countryCodes.find(elem=> elem.currency.trim() == ctarray[0].trim() && elem.country == ctarray[1].trim());
      this.fcurrInfo = this.fromCountry['currencyinfo'];
      this.tcurrInfo = this.toCountry['currencyinfo'];
      this.toflag = this.toCountry['flag'];
      this.fromflag =  this.fromCountry['flag'];
  }
    
  // }
  async getCurrencyRate(valueselected) {
    
    //let selectedIndex = this.selectfrom.nativeElement.selectedIndex;
    //this.adTarget(selectedIndex);
    let from = this.fromCurr;
    let to = this.toCurr;
    try {
      this.loadcurrencinfo();
      const exchangeRate:any = await this.cuService.getBaseExchangeRate();
      //let rate = exchangeRate[from + "_" + to].val;
      //this.resultRate = exchangeRate["rates"];
      this.calculateCurrencyOne();
    }
    catch (err) {
      console.error(err);
    }
  }
  async calculateCurrencyOne() {
    
    clearTimeout(this.timer);
    
    try {
      this.timer = setTimeout(() => {
        this.process = true;
        this.cuService.getExchangeRate(this.fromCurr,this.toCurr,this.fromValue == null ? 0:this.fromValue).then((val:any ) => {
          this.xchangeresponse = JSON.parse(val)
          if (this.xchangeresponse.success) {
            this.resultRate = this.xchangeresponse.result.toFixed(2);
            this.currRate = this.xchangeresponse?.info?.rate;
            
          } else {
            this.resultRate = 0.00;
           
          }
          this.error = {
            val : this.xchangeresponse?.success == undefined || !this.xchangeresponse?.success ? true:false,
            msg : this.xchangeresponse.message
          }
          this.date = this.xchangeresponse?.date;
          this.process = false
          console.log(val);
        })
        this.toValue = this.fromValue * parseFloat(this.resultRate);
      }, 1000);
   } catch(e) {
    this.process = false
   } finally {
    this.process = false
   }
   
    
  }

  // calculateCurrencyTwo() {
  //   this.fromValue = this.toValue / parseFloat(this.resultRate);
  // }
  // public adTarget(index) {
  //   this.localstorageItems.push(this.countryCodes[index]);
  //   this.countryCodes.splice(index, 1);
  // }
}