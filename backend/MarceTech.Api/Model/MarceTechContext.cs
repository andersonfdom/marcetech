using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace MarceTech.Api.Model;

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

    public virtual DbSet<Itenscategorium> Itenscategoria { get; set; }

    public virtual DbSet<Loja> Lojas { get; set; }

    public virtual DbSet<Orcamento> Orcamentos { get; set; }

    public virtual DbSet<Vendedore> Vendedores { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=marcetech;uid=marcetech;pwd=36R#e*3V&tO1@uI7zHcQYeD3", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.11.8-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Ambiente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ambientes");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("categorias");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("clientes");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Bairro)
                .HasMaxLength(255)
                .HasColumnName("bairro");
            entity.Property(e => e.Cep)
                .HasMaxLength(30)
                .HasColumnName("cep");
            entity.Property(e => e.Cidade)
                .HasMaxLength(255)
                .HasColumnName("cidade");
            entity.Property(e => e.Complemento)
                .HasMaxLength(255)
                .HasColumnName("complemento");
            entity.Property(e => e.Cpfcnpj)
                .HasMaxLength(30)
                .HasColumnName("cpfcnpj");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Estado)
                .HasMaxLength(255)
                .HasColumnName("estado");
            entity.Property(e => e.Logradouro)
                .HasMaxLength(255)
                .HasColumnName("logradouro");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
            entity.Property(e => e.Numerologradouro)
                .HasMaxLength(255)
                .HasColumnName("numerologradouro");
            entity.Property(e => e.Rg)
                .HasMaxLength(30)
                .HasColumnName("rg");
            entity.Property(e => e.Telefone)
                .HasMaxLength(30)
                .HasColumnName("telefone");
            entity.Property(e => e.Tipopessoa)
                .HasDefaultValueSql("'0'")
                .HasColumnName("tipopessoa");
        });

        modelBuilder.Entity<Itenscategorium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("itenscategoria");

            entity.HasIndex(e => e.Idcategoria, "idcategoria");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Descricao)
                .HasMaxLength(255)
                .HasColumnName("descricao");
            entity.Property(e => e.Idcategoria)
                .HasColumnType("int(11)")
                .HasColumnName("idcategoria");
            entity.Property(e => e.Observacao)
                .HasColumnType("text")
                .HasColumnName("observacao");
            entity.Property(e => e.Valor)
                .HasPrecision(18, 2)
                .HasColumnName("valor");

            entity.HasOne(d => d.IdcategoriaNavigation).WithMany(p => p.Itenscategoria)
                .HasForeignKey(d => d.Idcategoria)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("itenscategoria_ibfk_1");
        });

        modelBuilder.Entity<Loja>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("lojas");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Bairro)
                .HasMaxLength(255)
                .HasColumnName("bairro");
            entity.Property(e => e.Cep)
                .HasMaxLength(30)
                .HasColumnName("cep");
            entity.Property(e => e.Cidade)
                .HasMaxLength(255)
                .HasColumnName("cidade");
            entity.Property(e => e.Cnpj)
                .HasMaxLength(30)
                .HasColumnName("cnpj");
            entity.Property(e => e.Complemento)
                .HasMaxLength(255)
                .HasColumnName("complemento");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Estado)
                .HasMaxLength(255)
                .HasColumnName("estado");
            entity.Property(e => e.Logradouro)
                .HasMaxLength(255)
                .HasColumnName("logradouro");
            entity.Property(e => e.Numerologradouro)
                .HasMaxLength(255)
                .HasColumnName("numerologradouro");
            entity.Property(e => e.Razaosocial)
                .HasMaxLength(255)
                .HasColumnName("razaosocial");
            entity.Property(e => e.Telefone)
                .HasMaxLength(30)
                .HasColumnName("telefone");
        });

        modelBuilder.Entity<Orcamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orcamentos");

            entity.HasIndex(e => e.Idcliente, "idcliente");

            entity.HasIndex(e => e.Idloja, "idloja");

            entity.HasIndex(e => e.Idvendedor, "idvendedor");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Dataorcamento)
                .HasColumnType("datetime")
                .HasColumnName("dataorcamento");
            entity.Property(e => e.Idcliente)
                .HasColumnType("int(11)")
                .HasColumnName("idcliente");
            entity.Property(e => e.Idloja)
                .HasColumnType("int(11)")
                .HasColumnName("idloja");
            entity.Property(e => e.Idvendedor)
                .HasColumnType("int(11)")
                .HasColumnName("idvendedor");
            entity.Property(e => e.Statusorcamento)
                .HasMaxLength(255)
                .HasColumnName("statusorcamento");

            entity.HasOne(d => d.IdclienteNavigation).WithMany(p => p.Orcamentos)
                .HasForeignKey(d => d.Idcliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orcamentos_ibfk_1");

            entity.HasOne(d => d.IdlojaNavigation).WithMany(p => p.Orcamentos)
                .HasForeignKey(d => d.Idloja)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orcamentos_ibfk_2");

            entity.HasOne(d => d.IdvendedorNavigation).WithMany(p => p.Orcamentos)
                .HasForeignKey(d => d.Idvendedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orcamentos_ibfk_3");
        });

        modelBuilder.Entity<Vendedore>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vendedores");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Bairro)
                .HasMaxLength(255)
                .HasColumnName("bairro");
            entity.Property(e => e.Cep)
                .HasMaxLength(30)
                .HasColumnName("cep");
            entity.Property(e => e.Cidade)
                .HasMaxLength(255)
                .HasColumnName("cidade");
            entity.Property(e => e.Complemento)
                .HasMaxLength(255)
                .HasColumnName("complemento");
            entity.Property(e => e.Cpf)
                .HasMaxLength(30)
                .HasColumnName("cpf");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Estado)
                .HasMaxLength(255)
                .HasColumnName("estado");
            entity.Property(e => e.Logradouro)
                .HasMaxLength(255)
                .HasColumnName("logradouro");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
            entity.Property(e => e.Numerologradouro)
                .HasMaxLength(255)
                .HasColumnName("numerologradouro");
            entity.Property(e => e.Rg)
                .HasMaxLength(30)
                .HasColumnName("rg");
            entity.Property(e => e.Telefone)
                .HasMaxLength(30)
                .HasColumnName("telefone");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
