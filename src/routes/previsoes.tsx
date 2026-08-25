import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Sun, Cloud, CloudRain, CloudLightning, CloudSun, Sparkles, TrendingUp, Droplets,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Layout } from "@/components/Layout";
import { generateForecast } from "@/lib/mockData";

const iconFor = (c: string) => {
  if (c.includes("Tempestade")) return CloudLightning;
  if (c.includes("Chuva")) return CloudRain;
  if (c.includes("Nublado")) return Cloud;
  if (c.includes("Parcial")) return CloudSun;
  return Sun;
};

export const Route = createFileRoute("/previsoes")({
  head: () => ({
    meta: [
      { title: "Previsões · MeteoStation" },
      { name: "description", content: "Previsões climáticas baseadas em análise estatística dos dados coletados." },
    ],
  }),
  component: Forecast,
});

function Forecast() {
  const forecast = useMemo(() => generateForecast(7), []);

  return (
    <Layout title="Previsões inteligentes" subtitle="Análise preditiva baseada nos dados coletados">
      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl `bg-gradient-to-br` from-primary to-accent glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Modelo preditivo · regressão estatística</p>
            <p className="text-xs text-muted-foreground">
              Base: 60 dias · Confiança média <span className="text-primary">87%</span>
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-xs">
          <Stat label="Tendência semanal" value="+1.8°C" icon={TrendingUp} />
          <Stat label="Prob. chuva" value="42%" icon={Droplets} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {forecast.map((d, i) => {
          const Icon = iconFor(d.condition);
          return (
            <div key={i} className="glass rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:glow">
              <p className="text-xs font-medium text-muted-foreground">{d.day}</p>
              <Icon className="mx-auto my-3 h-8 w-8 text-primary float" />
              <p className="text-xs text-muted-foreground">{d.condition}</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                <span className="font-semibold">{d.max}°</span>
                <span className="text-muted-foreground">{d.min}°</span>
              </div>
              <p className="mt-1 text-[10px] text-accent">{d.rain}% chuva</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">Tendência de temperatura</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="t1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="max" stroke="var(--color-chart-1)" fill="url(#t1)" strokeWidth={2} />
              <Area type="monotone" dataKey="min" stroke="var(--color-chart-2)" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">Probabilidade de chuva (%)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rain" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Insight title="Conforto térmico" value="Agradável" desc="Sensação entre 22°C e 26°C nos próximos 3 dias." />
        <Insight title="Risco de geada" value="Baixo" desc="Mínimas previstas acima de 17°C." />
        <Insight title="Alerta de chuva" value="Moderado" desc="Acumulado esperado de até 35mm na semana." />
      </div>
    </Layout>
  );
}

const tooltipStyle = { background: "oklch(0.2 0.04 250 / 0.95)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 };

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Insight({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-xl font-semibold text-gradient">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
