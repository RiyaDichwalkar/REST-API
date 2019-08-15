import { Component, OnInit , Input } from '@angular/core';
import { ProductapiService } from '../productapi.service';
import { ActivatedRoute, Router } from '@angular/router';

class ImageSnippet {
 pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  @Input() productData = { prod_name:'', prod_desc: '', prod_price: 0 ,prod_image:''};
  constructor(public rest:ProductapiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }
  selectedFile:ImageSnippet;
  
  processFile(imageInput:any){
    //debugger;
    const imagefile: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload=(e:any) => {
      this.selectedFile = new ImageSnippet(e.target.result, imagefile);
      this.productData.prod_image=e.target.result;
    };
    
    reader.readAsDataURL(imagefile);
  }
  addProduct() {
    this.rest.addProduct(this.productData).subscribe((result) => {
      //console.log(this.productData);
      this.router.navigate(['/product-details/'+result.createdProduct._id]);
    }, (err) => {
      console.log(err);
    });
  }
}


