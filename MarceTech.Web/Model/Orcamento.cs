using System;
using System.Collections.Generic;

namespace MarceTech.Web.Model;

public partial class Orcamento
{
    public int Id { get; set; }

    public int IdCliente { get; set; }

    public int IdVendedor { get; set; }

    public int IdLoja { get; set; }

    public DateTime? DataOrcamento { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    public virtual Loja IdLojaNavigation { get; set; } = null!;

    public virtual Vendedore IdVendedorNavigation { get; set; } = null!;
}
