import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../Services/AuthApiService';
import { UploadService } from '../Services/UploadService';
import { KahlaUser } from '../Models/KahlaUser';
import { AiurProtocal } from '../Models/AiurProtocal';
import { AiurCollection } from '../Models/AiurCollection';
import Swal from 'sweetalert2';
import { Values } from '../values';
import { MessageService } from '../Services/MessageService';
import { HeaderService } from '../Services/HeaderService';
@Component({
  templateUrl: '../Views/userDetail.html',
  styleUrls: [
    '../Styles/userDetail.css',
    '../Styles/button.css'
  ]
})

export class UserDetailComponent implements OnInit {
  public user: KahlaUser;
  public loadingImgURL = Values.loadingImgURL;
  @ViewChild('imageInput') public imageInput;
  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    public uploadService: UploadService,
    public messageService: MessageService,
    private headerService: HeaderService
  ) {
    this.headerService.title = 'Edit Profile';
    this.headerService.returnButton = true;
    this.headerService.button = false;
    this.headerService.shadow = false;
}

  public ngOnInit(): void {
    if (!this.messageService.me) {
      this.authApiService.Me().subscribe(p => {
        this.user = p.value;
        this.user.avatarURL = Values.fileAddress + this.user.headImgFileKey;
      });
    } else {
      this.user = Object.assign({}, this.messageService.me);
    }
  }

  public uploadAvatar(): void {
    if (this.imageInput) {
      const fileBrowser = this.imageInput.nativeElement;
      if (fileBrowser.files && fileBrowser.files[0]) {
        this.uploadService.uploadAvatar(this.user, fileBrowser.files[0]);
      }
    }
  }

  public save() {
    document.querySelector('#save').textContent = 'Saving...';
    this.authApiService.UpdateInfo(this.user.nickName, this.user.bio ? this.user.bio : ``, this.user.headImgFileKey)
      .subscribe((t) => {
      if (t.code === 0) {
        this.messageService.me = Object.assign({}, this.user);
        this.router.navigate(['/settings']);
      } else if (t.code === -10) {
        Swal(t.message, (t as AiurProtocal as AiurCollection<string>).items[0], 'error');
      } else {
        Swal('input in failed', t.message, 'error');
      }
    });
  }
}
