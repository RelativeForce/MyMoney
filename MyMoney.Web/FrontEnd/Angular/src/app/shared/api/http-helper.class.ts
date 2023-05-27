import { Injectable } from '@angular/core';
import { HttpHelper as CommonHttpHelper }  from 'mymoney-common/lib/api'

@Injectable({ providedIn: 'root' })
export class HttpHelper extends CommonHttpHelper {
}
