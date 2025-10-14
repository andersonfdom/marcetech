using System;
using System.Collections.Generic;

namespace MarceTech.Api.Model;

public partial class Cliente
{
    public int Id { get; set; }

    public bool? Tipopessoa { get; set; }

    public string? Nome { get; set; }

    public string? Rg { get; set; }

    public string? Cpfcnpj { get; set; }

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
