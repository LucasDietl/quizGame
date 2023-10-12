import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'quizGame';
  users: {name: string, lastName: string, nickName: string, id: string}[] = [];
  constructor(private firestore: Firestore) {

  }

  ngOnInit(): void {
    
    this.getData();
  }
  
  addUser() :void {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, { name: 'Lucas', lastName: 'Dietl', nickName: 'Lucho' }).then((data) => {
      console.log('Success', data);
    }).catch((err) => {
      console.error(err);
    });
  }

  getData(): void {
    const collectionInstance = collection(this.firestore, 'users');
    collectionData(collectionInstance, {idField: 'id'}).subscribe((data)=> {
      console.log(data);
      debugger;
      this.users = data as {name: string, lastName: string, nickName: string, id: string}[];
    });
  }

  updateData(id: string): void {
    const docInstance = doc(this.firestore, 'users', id);
    const newData = {name: 'Lucas2'};

    updateDoc(docInstance, newData).then(()=> {
      console.log('Success update');
    }).catch((err)=> {
      console.error(err);
    });
  }

  deleteUser(id: string): void {
    const docInstance = doc(this.firestore, 'users', id);
    deleteDoc(docInstance).then(()=> {
      console.log('Delete Success');
    }).catch((err)=> {
      console.error(err);
    });
  }
}
