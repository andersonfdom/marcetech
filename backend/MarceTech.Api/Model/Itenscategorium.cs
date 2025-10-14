using System;
using System.Collections.Generic;

namespace MarceTech.Api.Model;

public partial class Itenscategorium
{
    public int Id { get; set; }

    public int Idcategoria { get; set; }

    public string? Descricao { get; set; }

    public string? Observacao { get; set; }

    public decimal? Valor { get; set; }

    public virtual Categoria IdcategoriaNavigation { get; set; } = null!;
}
