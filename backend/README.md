MarceTech API
Esta é uma API desenvolvida em ASP.NET Core para o sistema MarceTech, fornecendo endpoints para gerenciamento de ambientes, categorias, clientes, orçamentos e itens de categoria.

📋 Funcionalidades
Ambientes
GET /Ambientes - Listar todos os ambientes

POST /Ambientes - Criar novo ambiente

DELETE /Ambientes - Excluir ambiente por ID

Categorias
GET /Categories - Listar todas as categorias

POST /Categories - Criar nova categoria

DELETE /Categories - Excluir categoria por ID (com remoção em cascata dos itens relacionados)

Clientes
GET /Clientes/Listar - Listar todos os clientes ordenados por nome

GET /Clientes/CarregarDados - Carregar dados de um cliente específico por ID

POST /Clientes/GravarDados - Criar ou atualizar cliente

POST /Clientes/CriarOrcamentoCliente - Criar cliente e orçamento associado

DELETE /Clientes - Excluir cliente por ID

Itens de Categoria
GET /ItensCategoria - Listar itens por categoria

POST /ItensCategoria - Criar novo item de categoria

DELETE /ItensCategoria - Excluir item de categoria por ID

🛠️ Tecnologias Utilizadas
ASP.NET Core

Entity Framework Core

MySQL

Swagger/OpenAPI

CORS

⚙️ Configuração e Instalação
1. Sincronizar banco de dados MySQL com a API via Entity Framework Core
bash
dotnet ef dbcontext scaffold "server=148.113.189.63;database=marcetech;uid=marcetech;pwd=36R#e*3V&tO1@uI7zHcQYeD3;" Pomelo.EntityFrameworkCore.MySql -o Model -f -c MarceTechContext
2. Restaurar os pacotes do projeto
bash
dotnet restore
3. Compilar e executar o projeto
bash
dotnet run
📚 Documentação da API
A documentação interativa da API está disponível via Swagger em:

text
https://localhost:[PORT]/swagger
🔧 Configurações
CORS
A API está configurada para permitir requisições de qualquer origem (AllowAll policy).

Banco de Dados
Servidor: 148.113.189.63

Banco: marcetech

Usuário: marcetech

Contexto: MarceTechContext

📝 Modelos Principais
ClienteModel
csharp
public class ClienteModel
{
    public int Id { get; set; }
    public bool? TipoPessoa { get; set; } // false = PF, true = PJ
    public string? Nome { get; set; }
    public string? Rg { get; set; }
    public string? Cpfcnpj { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }
    // ... endereço completo
}
Validações
Validação de CPF/CNPJ

Verificação de email e CPF/CNPJ duplicados

Campos obrigatórios

🚀 Execução
Execute os comandos de sincronização do banco de dados

Restaure os pacotes NuGet

Execute a aplicação

Acesse a documentação Swagger para testar os endpoints

A API estará rodando em https://localhost:[PORT] e pronta para receber requisições.