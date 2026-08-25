import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Cpu, Database, Radio, Code2, Users, Target } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o projeto · MeteoStation" },
      { name: "description", content: "Conheça a estação meteorológica inteligente, tecnologias e equipe do projeto integrador." },
    ],
  }),
  component: About,
});

const tech = [
  { icon: Cpu, name: "ESP32", desc: "Microcontrolador para aquisição de sinais analógicos e digitais." },
  { icon: Radio, name: "Wi-Fi / MQTT", desc: "Transmissão dos dados em tempo real para o servidor." },
  { icon: Database, name: "PostgreSQL", desc: "Armazenamento histórico das medições e metadados." },
  { icon: Code2, name: "React + TypeScript", desc: "Dashboard moderno e responsivo." },
];

const team = [
  { name: "Nicolas Gomes Pinheiro Cavalcante", role: "Hardware / sensores / Frontend / Banco de dados" },
  { name: "Joaquim Luiz Queiroz do Rêgo", role: "Backend / Frontend / Hardware" },
  { name: "Cauã Laurentino Gomes", role: "Backend / Frontend / Hardware" }
];

function About() {
  return (
    <Layout title="Sobre o projeto" subtitle="Estação meteorológica inteligente · Projeto integrador">
      <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <CloudSun className="h-3.5 w-3.5" /> IoT · Climate Tech
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Monitoramento ambiental <span className="text-gradient">em tempo real</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A MeteoStation é uma estação meteorológica desenvolvida como projeto integrador,
              capaz de coletar dados ambientais com sensores calibrados, armazená-los localmente,
              transmiti-los a um servidor e gerar previsões com base em análise estatística dos
              dados históricos.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Temperatura", "Umidade do ar", "Umidade do solo", "Pressão", "Luminosidade", "Chuva"].map((m) => (
                <span key={m} className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="float relative mx-auto aspect-square w-72 rounded-3xl bg-linear-to-br from-primary/20 via-accent/15 to-transparent p-8 glow">
              <div className="grid h-full place-items-center rounded-2xl border border-primary/30 bg-background/40 backdrop-blur">
                <CloudSun className="h-32 w-32 text-primary" />
              </div>
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                MeteoStation v1.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">Objetivo</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Construir um sistema acessível e replicável de monitoramento ambiental que possa ser
            usado em escolas, propriedades rurais e laboratórios para acompanhar microclimas,
            apoiar decisões de irrigação e contribuir com dados abertos.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-accent" />
            <h3 className="text-base font-semibold">Equipe</h3>
          </div>
          <ul className="mt-3 space-y-2">
            {team.map((m) => (
              <li key={m.name} className="flex items-center justify-between border-b border-border/40 pb-2 text-sm last:border-0">
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Tecnologias utilizadas
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tech.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-5 transition hover:-translate-y-0.5 hover:glow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <t.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 text-sm font-semibold">{t.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
