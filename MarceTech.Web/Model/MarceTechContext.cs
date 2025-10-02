using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MarceTech.Web.Model;

public partial class MarceTechContext : DbContext
{
    public MarceTechContext()
    {
    }

    public MarceTechContext(DbContextOptions<MarceTechContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Ambiente> Ambientes { get; set; }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Orcamento> Orcamentos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=177.136.228.216,1436;Database=MarceTech;User Id=MarceTech;Password=36R#e*3V&tO1@uI7zHcQYeD3;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("MarceTech");

        modelBuilder.Entity<Ambiente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Ambiente__3214EC0781B745EE");

            entity.Property(e => e.Nome).IsUnicode(false);
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07AC72CEDD");

            entity.Property(e => e.Nome).IsUnicode(false);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Clientes__3214EC07C7F1C07B");

            entity.Property(e => e.Bairro).IsUnicode(false);
            entity.Property(e => e.Cep)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Cidade).IsUnicode(false);
            entity.Property(e => e.Complemento).IsUnicode(false);
            entity.Property(e => e.Cpfcnpj)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("CPFCNPJ");
            entity.Property(e => e.Email).IsUnicode(false);
            entity.Property(e => e.Estado).IsUnicode(false);
            entity.Property(e => e.Logradouro).IsUnicode(false);
            entity.Property(e => e.Nome).IsUnicode(false);
            entity.Property(e => e.NumeroLogradouro).IsUnicode(false);
            entity.Property(e => e.Rg)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("RG");
            entity.Property(e => e.Telefone)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.TipoPessoa).HasDefaultValue(false);
        });

        modelBuilder.Entity<Orcamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orcament__3214EC0782D18F6B");

            entity.Property(e => e.DataOrcamento).HasColumnType("datetime");
            entity.Property(e => e.Responsavel).IsUnicode(false);
            entity.Property(e => e.StatusOrcamento).IsUnicode(false);

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Orcamentos)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orcamento__IdCli__4CA06362");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
