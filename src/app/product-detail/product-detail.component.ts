import { Component, OnInit } from '@angular/core';
import { ProductapiService } from '../productapi.service';
import { ActivatedRoute, Router } from '@angular/router';
class ImageSnippet {
   constructor(public src: string, public file: File) {}
 }
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {
  product:any;
  constructor(public rest:ProductapiService, private route: ActivatedRoute, private router: Router) { }
  imageFile:ImageSnippet;
  ngOnInit() {
    this.rest.getProduct(this.route.snapshot.params['id']).subscribe((data: {}) => {
      this.product = data;
      //debugger;
      this.imageFile=this.product.product.prod_image;
    });
  }

}

