import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { MasterDetailNavService } from '../../master-detail-nav.service';
import { DetailPage } from '../detail/detail';
import { AbstractMasterPage } from '../AbstractMasterPage';
import { Observable } from 'rxjs';
import { MasterItem } from '../../master-detail';
import {
    JsonFormsState,
    JsonSchema,
    mapDispatchToTableControlProps,
    UISchemaElement
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';

@IonicPage()
@Component({
    selector: 'jsonforms-master-detail-master',
    template: `
      <ion-content>
          <ion-list>
              <button ion-item *ngFor="let item of items" (click)="onItemSelected(item)">
                  <h2>
                      {{ item.label }}
                  </h2>
              </button>
          </ion-list>
          <ion-fab right bottom>
            <button ion-fab (click)="onClick()">
              <ion-icon name="add"></ion-icon>
            </button>
          </ion-fab>
      </ion-content>
  `
})
export class MasterPage extends AbstractMasterPage implements OnInit {

    items: Observable<MasterItem>;
    uischema: UISchemaElement;
    schema: JsonSchema;
    path: string;
    addItem: (path: string) => () => void;

    constructor(
        public navParams: NavParams,
        private navProxy: MasterDetailNavService,
        private ngRedux: NgRedux<JsonFormsState>,
    ) {
        super();
        this.items = navParams.get('items');
        this.schema = this.navParams.get('schema');
        this.uischema = this.navParams.get('uischema');
        this.path = this.navParams.get('path');
    }

    ngOnInit() {
        const { addItem } = mapDispatchToTableControlProps(this.ngRedux.dispatch, {
            uischema: this.uischema,
            schema: this.schema,
        });
        this.addItem = addItem;
    }

    onItemSelected(item) {
        this.navProxy.pushDetail(DetailPage, { addToNavStack: true, item });
    }

    onClick() {
        this.addItem(this.path)();
    }
}