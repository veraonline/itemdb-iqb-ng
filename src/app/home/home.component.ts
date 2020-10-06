import { DatastoreService } from '../authoring/datastore.service';
import { WorkspaceData } from '../authoring';
import { MainDatastoreService } from '../maindatastore.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ConfirmDialogComponent, ConfirmDialogData} from "iqb-components";
import {BackendService, ServerError} from "../backend.service";
import {MatDialog} from "@angular/material/dialog";


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginform: FormGroup;
  isLoggedIn = false;
  isError = false;
  errorMessage = '';
  isSuperadmin = false;
  loginName = '';
  workspaceList: WorkspaceData[] = [];

  constructor(private fb: FormBuilder,
    private mds: MainDatastoreService,
    private bs: BackendService,
    private ds: DatastoreService,
    public confirmDialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.mds.pageTitle$.next('');

    this.mds.notLoggedInMessage$.subscribe(
      m => this.errorMessage = m);
    this.loginform = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(1)])
    });

    this.ds.workspaceList$.subscribe(list => {
      if (list.length > 0) {
        list.sort((ws1, ws2) => {
          if (ws1.name.toLowerCase() > ws2.name.toLowerCase()) {
            return 1;
          } else if (ws1.name.toLowerCase() < ws2.name.toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      this.workspaceList = list;
    });
    this.mds.isSuperadmin$.subscribe(is => this.isSuperadmin = is);
    this.mds.loginName$.subscribe(n => this.loginName = n);
    this.mds.isLoggedIn$.subscribe(is => this.isLoggedIn = is);
  }

  login() {
    this.isError = false;
    this.errorMessage = '';

    if (this.loginform.valid) {
      this.mds.login(this.loginform.get('name').value, this.loginform.get('pw').value);
    }
  }

  changeLogin() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
      data:  <ConfirmDialogData>{
        title: 'Abmelden',
        content: 'Möchten Sie sich abmelden?',
        confirmbuttonlabel: 'Abmelden',
        showcancel: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.bs.logout(this.mds.token$.getValue()).subscribe(
          () => {
            this.mds.updateStatus('', '', false, '');
            this.router.navigateByUrl('/');
          }, (err: ServerError) => {
            this.mds.updateStatus('', '', false, err.label);
            this.router.navigateByUrl('/');
          }
        );
      }
    });
  }

  buttonGotoWorkspace(selectedWorkspace: WorkspaceData) {
    if (this.router.navigate(['/a'])) {
      this.ds.workspaceId$.next(selectedWorkspace.id);
    }
  }

}
