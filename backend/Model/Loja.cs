using System;
using System.Collections.Generic;

namespace MarceTech.Api.Model;

public partial class Loja
{
    public int Id { get; set; }

    public string? Razaosocial { get; set; }

    public string? Cnpj { get; set; }

    public string? Telefone { get; set; }

    public string? Email { get; set; }

    public string? Cep { get; set; }

    public string? Logradouro { get; set; }

    public string? Numerologradouro { get; set; }

    public string? Complemento { get; set; }

    public string? Bairro { get; set; }

    public string? Cidade { get; set; }

    public string? Estado { get; set; }

    public virtual ICollection<Orcamento> Orcamentos { get; set; } = new List<Orcamento>();
}
