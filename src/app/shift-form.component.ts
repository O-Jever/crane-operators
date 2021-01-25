import {Component, Inject} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from './app.service';

@Component({
  selector: 'contact-form-dialog',
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.scss']
})
export class ShiftFormDialog {

    public shiftForm: FormGroup;
    public craneTypes;
    public trucks;

    constructor(
        private appService: AppService,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ShiftFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.shiftForm = new FormGroup({
                id: new FormControl(''),
                craneCount: new FormControl(''),
                fullName: new FormControl(''),
                start: new FormControl(''),
                end: new FormControl(''),
                cranes:  new FormArray([]),
            });

            if (data.shift) {
                this.fillData(data.shift);
            }

            this.craneTypes = ['Одинарный', 'Двойной'];
            this.trucks = ['Грузовик 1', 'Грузовик 2', 'Грузовик 3'];
    }

    fillData(shift) {
        for (let craneID in shift.cranes) {
            this.cranes.push(new FormArray([]));

            for (let i = 0; i < shift.cranes[craneID].length; i++) {
                this.cranes.controls[craneID].push(new FormGroup({
                    truck: new FormControl(''),
                    loaded: new FormControl({ value: '', disabled: Boolean(shift.cranes[craneID][i].unloaded) }),
                    unloaded: new FormControl({ value: '', disabled: Boolean(shift.cranes[craneID][i].loaded) })  
                }));
            }
        }
       
        this.shiftForm.setValue(shift);

        for (let craneID in shift.cranes) {
            this.cranes.controls[craneID].push(new FormGroup({
                truck: new FormControl(''),
                loaded: new FormControl({ value: '', disabled: true }),
                unloaded: new FormControl({ value: '', disabled: true })  
            }));
        }
    }

    public mutualDisable(i, j, disableProp, enableProp) {
        if (!this.cranes.value[i][j][enableProp] && !this.cranes.value[i][j][disableProp]) {
            this.enableControl(i, j, disableProp);
            this.enableControl(i, j, enableProp);
        } else if (this.cranes.value[i][j][enableProp]) {
            this.disableControl(i, j, disableProp);
            this.enableControl(i, j, enableProp);
        } else {
            this.enableControl(i, j, disableProp);
            this.disableControl(i, j, enableProp);
        }
    }

    private enableControl(i, j, prop) {
        ((this.cranes.controls[i] as FormArray).controls[j] as FormGroup).controls[prop].enable();
    }

    private disableControl(i, j, prop) {
        ((this.cranes.controls[i] as FormArray).controls[j] as FormGroup).controls[prop].disable();
    }

    get cranes() {
        return this.shiftForm.get('cranes') as FormArray;
    }

    addCrane(craneCount: number) {
        this.cranes.clear();
        for(let i = 0; i < craneCount; i++) {
            this.cranes.push(
                new FormArray([
                    new FormGroup({
                        truck: new FormControl(''),
                        loaded: new FormControl({ value: '', disabled: true }),
                        unloaded: new FormControl({ value: '', disabled: true })
                    })
                ])
            );  
        }
        
    }

    delete(i: number, j: number) {
        (this.cranes.controls[i] as FormArray).removeAt(j);

        this.add(i, j);
    }

    add(i: number, j: number) {
        const emptyTrucks = this.cranes.value[i].filter(({ truck }) => !truck);

        if (!emptyTrucks.length && this.trucks.length !== this.cranes.value[i].length) {
            (this.cranes.controls[i] as FormArray).push(
                new FormGroup({
                    truck: new FormControl(''),
                    loaded: new FormControl({ value: '', disabled: true }),
                    unloaded: new FormControl({ value: '', disabled: true })
            }));
        }

        this.enableControl(i, j, 'loaded');
        this.enableControl(i, j, 'unloaded');
    }

    trucksForSelect(i: number, j: number) {
        return this.trucks.filter(element => {
            if (element === this.shiftForm.value.cranes[i][j].truck) return true;
            return this.shiftForm.value.cranes[i].every(({truck}) => element !== truck);
        });
    }

    public needToShowButton(i: number, j: number) {
        return this.cranes.value[i][j].truck;
    }

    public getTotalByProp(prop) {
        let result = 0;

        for (const crane of this.cranes.value) {
            for (const { [prop]: value } of crane) {
                result += +value || 0;
            }
        }

        return result;
    }
    
    public close(): void {
        this.dialogRef.close();
    }
    

    public getErrorMessage() {
        return this.shiftForm.get('name').hasError('required') ? 'Это поле обязательное для заполнения' : '';
    }

    public setShift(): void {
        const shift = Object.assign({}, this.shiftForm.value);

        shift.cranes = shift.cranes.map(crane => {
            const filteredTruckInfo = crane.filter(({truck}) => truck);
            return filteredTruckInfo.map(element => {
                if (!element.loaded) element.loaded = "";
                if (!element.unloaded) element.unloaded = "";
                return element;
            });
        });

        if(this.data.isChange) {
            this.appService.editShift(this.shiftForm.value.id, shift).subscribe();
        } else {
            this.appService.addShift( shift).subscribe();
        }
        this.close();
    }

}
