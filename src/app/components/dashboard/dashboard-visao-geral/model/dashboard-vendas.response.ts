export interface Venda {
  id: number;                    // id do pedido ou venda
  name: string;                  // nome do cliente
  cpf?: string;                  // CPF do cliente
  total: number;                 // soma total da venda
  quantidade_total?: number;    // soma das quantidades dos itens da venda
  data: string;                 // data da venda (ISO string)
}

export interface Vendas {
  user_name: string;
  user_cpf: string;
  // Campos adicionais conforme a view
  item_id?: number;
  order_id?: number;
  user_id?: string;
  status?: string;
  payment_method?: string;
  payment_proof_url?: string;
  created_at?: string;

  // Dados do item
  size?: string;
  quantity?: number;
  price?: number;
  total_item?: number;

  // Dados do produto
  product_name?: string;
  product_image?: string;

  // Endereço
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}
