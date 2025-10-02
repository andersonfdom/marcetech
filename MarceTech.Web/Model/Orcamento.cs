using System;
using System.Collections.Generic;

namespace MarceTech.Web.Model;

public partial class Orcamento
{
    public int Id { get; set; }

    public int IdCliente { get; set; }

    public DateTime? DataOrcamento { get; set; }

    public string? Responsavel { get; set; }

    public string? StatusOrcamento { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; } = null!;
}
