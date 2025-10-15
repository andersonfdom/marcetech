using System;
using System.Collections.Generic;

namespace MarceTech.Api.Model;

public partial class Orcamento
{
    public int Id { get; set; }

    public int Idcliente { get; set; }

    public DateTime? Dataorcamento { get; set; }

    public string? Statusorcamento { get; set; }

    public int Idloja { get; set; }

    public int Idvendedor { get; set; }

    public virtual Cliente IdclienteNavigation { get; set; } = null!;

    public virtual Loja IdlojaNavigation { get; set; } = null!;

    public virtual Vendedore IdvendedorNavigation { get; set; } = null!;
}
