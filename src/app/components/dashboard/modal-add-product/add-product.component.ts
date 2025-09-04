import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { supabase } from '../../../services/supabase.client';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-add-product',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements OnInit {

  @Input() produto?: Product;
  productForm: FormGroup;
  selectedFiles: File[] = [];
  selectedCoverFile: File | null = null;
  imageError: string = '';
  coverImageError: string = '';
  isSubmitting = false;
  categorias = ['Masculinas', 'Femininas', 'Tênis', 'NBA', 'Versões Torcedor', 'Versões Jogador', 'Retrô', 'Kit Infantil'];

  categorySelected: string = '';

  availableSizes = ['P', 'M', 'G', 'GG', 'XG', 'XGG'];
  availableShoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

  selectedSizes: string[] = [];
  selectedShoeSizes: string[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [''],
      preco_original: ['', Validators.required],
      preco_atual: [''],
      desconto: [''],
      size: [[]]
    });
  }

  ngOnInit(): void {
    if (this.produto) {
      this.populateForm(this.produto);
    }

    this.productForm.valueChanges.subscribe(() => {
      this.calcularPrecoAtual();
    });
  }

  onCoverImageChange(event: any) {
    this.coverImageError = '';
    const file: File = event.target.files[0];

    if (file && file.size > 150 * 1024) {
      this.coverImageError = 'A imagem de capa deve ter no máximo 150KB.';
      return;
    }

    if (file) {
      this.selectedCoverFile = file;
    }
  }

  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.categorySelected = selectedCategory;

    if (selectedCategory !== 'Tênis') {
      this.productForm.get('shoeSize')?.reset();
      this.selectedShoeSizes = [];
    } else {
      this.productForm.get('size')?.reset();
      this.selectedSizes = [];
    }
  }

  onSizeChange(size: string, event: any) {
    if (event.target.checked) {
      this.selectedSizes.push(size);
    } else {
      const index = this.selectedSizes.indexOf(size);
      if (index > -1) {
        this.selectedSizes.splice(index, 1);
      }
    }
  }

  onShoeSizeChange(size: string, event: any) {
    if (event.target.checked) {
      this.selectedShoeSizes.push(size);
    } else {
      const index = this.selectedShoeSizes.indexOf(size);
      if (index > -1) {
        this.selectedShoeSizes.splice(index, 1);
      }
    }
  }

  onFileChange(event: any) {
    this.imageError = '';
    const files: FileList = event.target.files;
    if (files.length > 5) {
      this.imageError = 'Você pode selecionar no máximo 5 imagens.';
      return;
    }

    const tooBig = Array.from(files).some(file => file.size > 150 * 1024);
    if (tooBig) {
      this.imageError = 'Cada imagem deve ter no máximo 150KB.';
      return;
    }

    this.selectedFiles = Array.from(files);
  }

  calcularPrecoAtual(): void {
    const precoOriginal = this.productForm.get('preco_original')?.value;
    const desconto = this.productForm.get('desconto')?.value;

    if (precoOriginal != null && precoOriginal > 0) {
      if (desconto != null && desconto > 0) {
        const precoAtual = precoOriginal - (precoOriginal * (desconto / 100));
        this.productForm.get('preco_atual')?.setValue(precoAtual.toFixed(2), { emitEvent: false });
      } else {
        this.productForm.get('preco_atual')?.setValue(precoOriginal.toFixed(2), { emitEvent: false });
      }
    }
  }

  private populateForm(produto: Product) {
    this.productForm.patchValue({
      name: produto.name,
      description: produto.description,
      category: produto.category,
      preco_original: produto.preco_original,
      preco_atual: produto.preco_atual,
      desconto: produto.desconto,
      size: produto.size || []
    });

    // Também preencha os arrays de tamanhos selecionados
    if (produto.category === 'Tênis') {
      this.selectedShoeSizes = produto.size || [];
    } else {
      this.selectedSizes = produto.size || [];
    }

    this.categorySelected = produto.category || '';
  }

  async onSubmit() {
  if (this.productForm.invalid || (!this.selectedFiles.length && !this.produto?.image_urls?.length) || (!this.selectedCoverFile && !this.produto?.image_url)) {
    this.imageError = 'Preencha todos os campos obrigatórios e selecione pelo menos uma imagem de capa e uma imagem adicional.';
    return;
  }

  this.isSubmitting = true;

  const imageUrls: string[] = [];
  let imageUrl: string = '';

  if (this.selectedCoverFile) {
    const coverFilePath = `products/${Date.now()}-${this.selectedCoverFile.name}`;
    const { error: uploadCoverError } = await supabase.storage.from('images').upload(coverFilePath, this.selectedCoverFile);

    if (uploadCoverError) {
      console.error('Erro ao enviar imagem de capa:', uploadCoverError);
      this.imageError = 'Erro ao enviar a imagem de capa.';
      this.isSubmitting = false;
      return;
    }

    const { data: coverData } = supabase.storage.from('images').getPublicUrl(coverFilePath);
    imageUrl = coverData.publicUrl;
  } else {
    imageUrl = this.produto?.image_url || '';
  }

  if (this.selectedFiles.length > 0) {
    for (const file of this.selectedFiles) {
      const filePath = `products/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

      if (uploadError) {
        console.error('Erro ao enviar imagem:', uploadError);
        this.imageError = 'Erro ao enviar imagens.';
        this.isSubmitting = false;
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrls.push(data.publicUrl);
    }
  } else {
    imageUrls.push(...(this.produto?.image_urls || []));
  }

  // Tamanhos
  const sizeData = this.productForm.value.category === 'Tênis'
    ? this.selectedShoeSizes
    : this.selectedSizes;

  const productData = {
    name: this.productForm.value.name,
    description: this.productForm.value.description,
    category: this.productForm.value.category,
    preco_original: this.productForm.value.preco_original,
    preco_atual: this.productForm.value.preco_atual,
    desconto: this.productForm.value.desconto,
    image_url: imageUrl,
    image_urls: imageUrls,
    size: sizeData
  };

  let response;

  if (this.produto?.id) {
    // EDITAR produto existente
    const { error } = await supabase.from('products').update(productData).eq('id', this.produto.id);
    response = { error };
  } else {
    // CRIAR novo produto
    const { error } = await supabase.from('products').insert([{ ...productData, created_at: new Date().toISOString() }]);
    response = { error };
  }

  if (response.error) {
    console.error('Erro ao salvar produto:', response.error);
    this.toastService.error('Erro ao salvar produto.');
  } else {
    this.toastService.success(this.produto?.id ? 'Produto atualizado com sucesso!' : 'Produto salvo com sucesso!');
    this.modal.close({ ...productData, id: this.produto?.id }); // <- fecha modal retornando produto atualizado
  }

  this.isSubmitting = false;
}





}
