import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Box } from '../../core/models/box';
import { Router } from '@angular/router';
import { UploadImageService } from '../../core/services/uploadImage';

@Component({
  selector: 'app-card-box',
  imports: [],
  templateUrl: './card-box.html',
  styleUrl: './card-box.css',
})
export class CardBox {
  @Input() box!: Box;
  immagineUrl:any;
  private cdr = inject(ChangeDetectorRef); // COPIED per quando ho le img forzo angular: ho dei componenti cambiati

  constructor(
    private router: Router,
    private uploadImageBoxService: UploadImageService
  ){}

  ngOnInit(): void {
    this.caricaImmagine();
  }

  caricaImmagine(): void {
    this.uploadImageBoxService.getById('box', this.box.id)
      .subscribe({
        next: (resp: any) => {
          this.immagineUrl = resp?.url ?? resp?.path ?? resp?.nomeFile ?? 'image-box.png';
          this.cdr.markForCheck(); //what does this do?
        },
        error: () => {
          this.immagineUrl = 'image-box.png'; //TO BE LOADED
          this.cdr.markForCheck();
        }
      });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/image-box.png';
  }

  clickDetail(): void {
    this.router.navigate( ['/box', this.box.id]);
  }
}
