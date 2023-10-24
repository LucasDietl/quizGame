import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DialogFacadeService } from '../store/dialog/dialog-facade.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { collectionNames } from '../utils/helpers/collection-names';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';
import { AuthUser, User } from '../store/user/user.interface';
import { Router } from '@angular/router';
import { first }from 'rxjs/operators'


@Component({
  selector: 'qz-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  users: AuthUser[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private firestore: Firestore, 
    private dialogFacadeService: DialogFacadeService, 
    private userFacadeService: UserFacadeService,
    private router: Router
    ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nickName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    });
  }

  async ngOnInit() {
    const userId = await this.userFacadeService.userId().pipe(first()).toPromise();
    if (userId) {
      this.router.navigate(['joinGame'])
    } else {
      // TODO: this is only used for showing users
      this.getData();
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
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      userDataInUse = doc.exists();
    });
    if (!userDataInUse) {
      addDoc(collectionInstance, user).then((data) => {
        this.userFacadeService.saveUserData({ ...user, id: data.id })
        this.isLoading = false;
        formDirective.resetForm();
        this.registrationForm.reset();
        this.router.navigate(['joinGame'])
      }).catch((err) => {
        this.isLoading = false;
        console.error(err);
      });
    } else {
      this.isLoading = false;
      this.dialogFacadeService.openDialog('Esos datos ya estan en uso =(');
    }
  }

  getData(): void {
    const collectionInstance = collection(this.firestore, collectionNames.users);
    collectionData(collectionInstance, { idField: 'id' }).subscribe((data) => {
      console.log('List of users', data);
      this.users = data as AuthUser[];
    });
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

  updateData(id: string): void {
    const docInstance = doc(this.firestore, collectionNames.users, id);
    const newData = { name: 'Lucas2' };

    updateDoc(docInstance, newData).then(() => {
      console.log('Success update');
    }).catch((err) => {
      console.error(err);
    });
  }

  deleteUser(id: string): void {
    const docInstance = doc(this.firestore, collectionNames.users, id);
    deleteDoc(docInstance).then(() => {
      console.log('Delete Success');
    }).catch((err) => {
      console.error(err);
    });
  }
}
