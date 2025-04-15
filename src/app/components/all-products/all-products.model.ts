export interface Produto {
    nome: string;
    imagem: string;
    preco: number;
    precoOriginal?: number;
    promocao?: boolean;
    categoria: string;
  }