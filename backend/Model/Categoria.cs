using System;
using System.Collections.Generic;

namespace MarceTech.Api.Model;

public partial class Categoria
{
    public int Id { get; set; }

    public string? Nome { get; set; }

    public virtual ICollection<Itenscategorium> Itenscategoria { get; set; } = new List<Itenscategorium>();
}
