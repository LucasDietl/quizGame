import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { takeUntil } from 'rxjs/operators';
import { DialogFacadeService } from '../store/dialog/dialog-facade.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { User } from '../store/user/user.interface';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { collectionNames } from '../utils/helpers/collection-names';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';


@Component({
    selector: 'qz-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent extends DestroyableComponent implements OnInit {
    registrationForm: FormGroup;
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private firestore: Firestore,
        private dialogFacadeService: DialogFacadeService,
        private userFacadeService: UserFacadeService,
        private router: Router
    ) {
        super();
        this.registrationForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            nickName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        });
    }

    async ngOnInit() {
        const userId = await firstValueFrom(this.userFacadeService.userId().pipe(takeUntil(this.destroyed$)));
        if (userId) {
            this.router.navigate(['joinGame'])
        }
    }

    public async saveUserInfo(formDirective: FormGroupDirective): Promise<void> {
        this.isLoading = true;
        const user: User = this.registrationForm.value as User;
        const collectionInstance = collection(this.firestore, collectionNames.users);
        const q = query(
            collectionInstance,
            where('firstName', FireStoreOperators.EQ, user.firstName),
            where('lastName', FireStoreOperators.EQ, user.lastName),
            where('nickName', FireStoreOperators.EQ, user.nickName)
        );
        const querySnapshot = await getDocs(q);
        let userDataInUse = false;
        querySnapshot.forEach((doc) => {
            userDataInUse = doc.exists();
        });
        if (!userDataInUse) {
            addDoc(collectionInstance, user).then((data) => {
                this.userFacadeService.saveUserData({ ...user, id: data.id })
                this.isLoading = false;
                formDirective.resetForm();
                this.registrationForm.reset();
                const gameId = localStorage.getItem('GameIdToJoin');
                const url = gameId ? `joinGame/${gameId}` : 'joinGame'
                this.router.navigate([url])
            }).catch((err) => {
                this.isLoading = false;
                console.error(err);
            });
        } else {
            this.isLoading = false;
            this.dialogFacadeService.openDialog('Esos datos ya estan en uso =(');
        }
    }

    getErrorMessage(controlName: string) {
        const control = this.registrationForm.controls[controlName]
        if (control.hasError('required')) {
            return 'Dale escribite algo';
        }
        if (control.hasError('maxlength')) {
            return 'Se te fue la mano me parece';
        }

        return control.hasError('minlength') ? 'Metele 3 letras fiera' : '';
    }
}
